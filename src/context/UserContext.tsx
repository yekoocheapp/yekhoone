"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserRole,
  BaseUserProfile,
  BuyerProfile,
  SellerProfile,
  AgentProfile,
  AgencyProfile,
  NeshasstSession,
  INITIAL_BUYER_PROFILE,
  INITIAL_SELLER_PROFILE,
  INITIAL_AGENT_PROFILE,
  INITIAL_AGENCY_PROFILE,
  INITIAL_NESHASST
} from "@/data/users";

interface UserContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  baseUser: BaseUserProfile | null;
  buyerProfile: BuyerProfile;
  sellerProfile: SellerProfile;
  agentProfile: AgentProfile;
  agencyProfile: AgencyProfile;
  currentNeshasst: NeshasstSession;
  toggleFavorite: (propertyId: number) => void;
  isFavorite: (propertyId: number) => boolean;

  // Classic sign-up & sign-in for everyone
  signUpClassic: (data: { firstName: string; lastName: string; contact: string; password?: string; role?: UserRole }) => Promise<{ success: boolean; error?: string; userName?: string }>;
  signInClassic: (data: { contact: string; password?: string }) => Promise<{ success: boolean; error?: string; userName?: string }>;

  // Category completion in Profile
  completeBuyerCategory: (data: { demandType?: "buy" | "rent" | "barter"; budgetLabel?: string; desiredDistricts?: string[] }) => void;
  completeSellerCategory: (data: { nationalId?: string; propertyType?: string; district?: string; isBarterAccepted?: boolean; barterTargetDescription?: string }) => void;
  completeAgentCategory: (data: { licenseCode?: string; agencyName?: string; specialtyDistrict?: string }) => void;
  completeAgencyCategory: (data: { name: string; managerName: string; supervisorName: string; phone?: string; officePhone?: string; licenseNumber?: string; address?: string }) => void;
  resetCategory: () => void;

  // Direct quick sign-ups (backwards-compatible)
  signUpBuyer: (data: { name: string; phone: string; demandType?: "buy" | "rent" | "barter"; budgetLabel?: string; desiredDistricts?: string[] }) => void;
  signUpSeller: (data: { name: string; phone: string; nationalId?: string; propertyType?: string; district?: string }) => void;
  signUpAgent: (data: { name: string; phone: string; licenseCode?: string; agencyName?: string; specialtyDistrict?: string }) => void;
  signUpAgency: (data: { name: string; managerName: string; supervisorName: string; phone: string; officePhone?: string; licenseNumber?: string; address?: string }) => void;
  logout: () => Promise<void>;
}

export interface RegisteredAccountRecord {
  baseUser: BaseUserProfile;
  password?: string;
  buyerProfile?: BuyerProfile;
  sellerProfile?: SellerProfile;
  agentProfile?: AgentProfile;
  agencyProfile?: AgencyProfile;
}

export function normalizeContactString(contact: string): string {
  if (!contact) return "";
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  let res = contact.trim().toLowerCase();
  for (let i = 0; i < persianDigits.length; i++) {
    res = res.replace(new RegExp(persianDigits[i], "g"), i.toString());
  }
  return res.replace(/\s+/g, "");
}

export function loadRegisteredUsers(): RegisteredAccountRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("yekhoone_registered_users");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveRegisteredUserRecord(record: Partial<RegisteredAccountRecord> & { baseUser: BaseUserProfile }) {
  if (typeof window === "undefined") return;
  try {
    const all = loadRegisteredUsers();
    const targetContact = normalizeContactString(record.baseUser.contact);
    const existingIndex = all.findIndex(
      (u) => normalizeContactString(u.baseUser.contact) === targetContact
    );
    if (existingIndex >= 0) {
      all[existingIndex] = {
        ...all[existingIndex],
        ...record,
        baseUser: {
          ...all[existingIndex].baseUser,
          ...record.baseUser
        }
      };
    } else {
      all.push(record as RegisteredAccountRecord);
    }
    localStorage.setItem("yekhoone_registered_users", JSON.stringify(all));
  } catch (e) {}
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>("guest");
  const [baseUser, setBaseUser] = useState<BaseUserProfile | null>(null);
  const [buyerProfile, setBuyerProfile] = useState<BuyerProfile>(INITIAL_BUYER_PROFILE);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile>(INITIAL_SELLER_PROFILE);
  const [agentProfile, setAgentProfile] = useState<AgentProfile>(INITIAL_AGENT_PROFILE);
  const [agencyProfile, setAgencyProfile] = useState<AgencyProfile>(INITIAL_AGENCY_PROFILE);
  const [currentNeshasst, setCurrentNeshasst] = useState<NeshasstSession>(INITIAL_NESHASST);

  // Sync session with SQLite backend database & local cache
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Initial quick load from localStorage so UI does not flicker
      try {
        const savedBase = localStorage.getItem("yekhoone_base_user");
        if (savedBase) {
          const parsed = JSON.parse(savedBase);
          setBaseUser(parsed);
        }
        const savedRole = localStorage.getItem("yekhoone_user_role") as UserRole;
        if (savedRole && ["buyer", "seller", "agent", "agency", "guest"].includes(savedRole)) {
          setCurrentRole(savedRole);
        }
      } catch (e) {}

      // 2. Authoritative check with SQLite Backend via /api/auth/me
      fetch("/api/auth/me")
        .then((res) => {
          if (!res.ok) throw new Error("Unauthenticated");
          return res.json();
        })
        .then((data) => {
          if (data.authenticated && data.user) {
            const dbUser = data.user;
            const uRole = (dbUser.role as UserRole) || "buyer";
            const names = (dbUser.fullName || "").trim().split(" ");
            const updatedBase: BaseUserProfile = {
              id: dbUser.id,
              firstName: dbUser.firstName || names[0] || "",
              lastName: dbUser.lastName || names.slice(1).join(" ") || "",
              fullName: dbUser.fullName,
              contact: dbUser.contact,
              email: dbUser.contact.includes("@") ? dbUser.contact : undefined,
              phone: !dbUser.contact.includes("@") ? dbUser.contact : undefined,
              registeredAt: "پایگاه داده",
              isCategoryCompleted: true,
              selectedCategory: (uRole === "buyer" || uRole === "seller" || uRole === "agent" || uRole === "agency") ? uRole : undefined
            };
            setBaseUser(updatedBase);
            setCurrentRole(uRole);
            localStorage.setItem("yekhoone_base_user", JSON.stringify(updatedBase));
            localStorage.setItem("yekhoone_user_role", uRole);
          } else {
            // Deleted in database or unauthenticated: wipe stale session
            setBaseUser(null);
            setCurrentRole("guest");
            localStorage.removeItem("yekhoone_base_user");
            localStorage.setItem("yekhoone_user_role", "guest");
          }
        })
        .catch(() => {
          // If deleted in Prisma Studio or session missing
          setBaseUser(null);
          setCurrentRole("guest");
          localStorage.removeItem("yekhoone_base_user");
          localStorage.setItem("yekhoone_user_role", "guest");
        });
    }
  }, []);

  const handleSetRole = (role: UserRole) => {
    setCurrentRole(role);
    if (typeof window !== "undefined") {
      localStorage.setItem("yekhoone_user_role", role);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setBaseUser(null);
    handleSetRole("guest");
    if (typeof window !== "undefined") {
      localStorage.removeItem("yekhoone_base_user");
      localStorage.setItem("yekhoone_user_role", "guest");
      localStorage.removeItem("yekhoone_buyer_profile");
      localStorage.removeItem("yekhoone_seller_profile");
      localStorage.removeItem("yekhoone_agent_profile");
      localStorage.removeItem("yekhoone_agency_profile");
    }
  };

  // Step 1: Real Database Sign-Up via Backend API
  const signUpClassic = async (data: { firstName: string; lastName: string; contact: string; password?: string; role?: UserRole }): Promise<{ success: boolean; error?: string; userName?: string }> => {
    const chosenRole: UserRole = data.role && data.role !== "guest" ? data.role : "buyer";
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          contact: data.contact.trim(),
          password: data.password || "123456",
          role: chosenRole
        })
      });

      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: json.error || "خطا در ثبت‌نام در پایگاه داده." };
      }

      const u = json.user;
      const newBase: BaseUserProfile = {
        id: u.id,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        fullName: u.fullName,
        contact: u.contact,
        email: u.contact.includes("@") ? u.contact : undefined,
        phone: !u.contact.includes("@") ? u.contact : undefined,
        registeredAt: "پایگاه داده",
        isCategoryCompleted: true,
        selectedCategory: (chosenRole === "buyer" || chosenRole === "seller" || chosenRole === "agent" || chosenRole === "agency") ? chosenRole : undefined
      };

      setBaseUser(newBase);
      handleSetRole(chosenRole);
      if (typeof window !== "undefined") {
        localStorage.setItem("yekhoone_base_user", JSON.stringify(newBase));
        localStorage.setItem("yekhoone_user_role", chosenRole);
      }

      return { success: true, userName: u.fullName };
    } catch (err: any) {
      return { success: false, error: "خطا در برقراری ارتباط با پایگاه داده." };
    }
  };

  // Step 1 Alternative: Real Database Sign-In via Backend API
  const signInClassic = async (data: { contact: string; password?: string }): Promise<{ success: boolean; error?: string; userName?: string }> => {
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: data.contact.trim(),
          password: data.password || ""
        })
      });

      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: json.error || "ورود ناموفق بود." };
      }

      const u = json.user;
      const chosenRole: UserRole = (u.role as UserRole) || "buyer";
      const names = (u.fullName || "").trim().split(" ");
      const newBase: BaseUserProfile = {
        id: u.id,
        firstName: names[0] || "",
        lastName: names.slice(1).join(" ") || "",
        fullName: u.fullName,
        contact: u.contact,
        email: u.contact.includes("@") ? u.contact : undefined,
        phone: !u.contact.includes("@") ? u.contact : undefined,
        registeredAt: "پایگاه داده",
        isCategoryCompleted: true,
        selectedCategory: (chosenRole === "buyer" || chosenRole === "seller" || chosenRole === "agent" || chosenRole === "agency") ? chosenRole : undefined
      };

      setBaseUser(newBase);
      handleSetRole(chosenRole);
      if (typeof window !== "undefined") {
        localStorage.setItem("yekhoone_base_user", JSON.stringify(newBase));
        localStorage.setItem("yekhoone_user_role", chosenRole);
      }

      return { success: true, userName: u.fullName };
    } catch (err: any) {
      return { success: false, error: "خطا در برقراری ارتباط با پایگاه داده." };
    }
  };

  // Step 2: In Profile, fill category: متقاضی مسکن
  const completeBuyerCategory = (data: { demandType?: "buy" | "rent" | "barter"; budgetLabel?: string; desiredDistricts?: string[] }) => {
    const currentName = baseUser ? baseUser.fullName : "متقاضی مسکن";
    const currentPhone = baseUser ? (baseUser.phone || baseUser.contact) : "۰۹۱۲۰۰۰۰۰۰۰";

    const updatedBase: BaseUserProfile = baseUser ? {
      ...baseUser,
      isCategoryCompleted: true,
      selectedCategory: "buyer"
    } : {
      id: `buyer-${Date.now()}`,
      firstName: "متقاضی",
      lastName: "مسکن",
      fullName: currentName,
      contact: currentPhone,
      phone: currentPhone,
      registeredAt: "امروز",
      isCategoryCompleted: true,
      selectedCategory: "buyer"
    };

    setBaseUser(updatedBase);
    if (typeof window !== "undefined") {
      localStorage.setItem("yekhoone_base_user", JSON.stringify(updatedBase));
    }

    const newProfile: BuyerProfile = {
      id: updatedBase.id,
      role: "buyer",
      name: currentName,
      phone: currentPhone,
      avatar: "",
      demandType: data.demandType || "buy",
      budgetLabel: data.budgetLabel || "تعیین نشده",
      desiredDistricts: data.desiredDistricts || [],
      favoritePropertyIds: buyerProfile.favoritePropertyIds || [],
      upcomingNeshasstId: undefined
    };
    setBuyerProfile(newProfile);
    handleSetRole("buyer");
    if (typeof window !== "undefined") {
      localStorage.setItem("yekhoone_buyer_profile", JSON.stringify(newProfile));
    }

    // Save to permanent registry
    saveRegisteredUserRecord({
      baseUser: updatedBase,
      buyerProfile: newProfile
    });
  };

  // Step 2: In Profile, fill category: مالک مسکن
  const completeSellerCategory = (data: { nationalId?: string; propertyType?: string; district?: string; isBarterAccepted?: boolean; barterTargetDescription?: string }) => {
    const currentName = baseUser ? baseUser.fullName : "مالک مسکن";
    const currentPhone = baseUser ? (baseUser.phone || baseUser.contact) : "۰۹۱۲۰۰۰۰۰۰۰";

    const updatedBase: BaseUserProfile = baseUser ? {
      ...baseUser,
      isCategoryCompleted: true,
      selectedCategory: "seller"
    } : {
      id: `seller-${Date.now()}`,
      firstName: "مالک",
      lastName: "مسکن",
      fullName: currentName,
      contact: currentPhone,
      phone: currentPhone,
      registeredAt: "امروز",
      isCategoryCompleted: true,
      selectedCategory: "seller"
    };

    setBaseUser(updatedBase);
    if (typeof window !== "undefined") {
      localStorage.setItem("yekhoone_base_user", JSON.stringify(updatedBase));
    }

    const newProfile: SellerProfile = {
      id: updatedBase.id,
      role: "seller",
      name: currentName,
      phone: currentPhone,
      avatar: "",
      nationalId: data.nationalId,
      nationalIdVerified: Boolean(data.nationalId),
      propertyType: data.propertyType || "آپارتمان مسکونی",
      district: data.district || "تهران",
      isBarterAccepted: data.isBarterAccepted,
      barterTargetDescription: data.barterTargetDescription,
      ownedPropertyIds: sellerProfile.ownedPropertyIds || [],
      upcomingNeshasstId: undefined
    };
    setSellerProfile(newProfile);
    handleSetRole("seller");
    if (typeof window !== "undefined") {
      localStorage.setItem("yekhoone_seller_profile", JSON.stringify(newProfile));
    }

    // Save to permanent registry
    saveRegisteredUserRecord({
      baseUser: updatedBase,
      sellerProfile: newProfile
    });
  };

  // Step 2: In Profile, fill category: مشاور املاک
  const completeAgentCategory = (data: { licenseCode?: string; agencyName?: string; specialtyDistrict?: string }) => {
    const currentName = baseUser ? baseUser.fullName : "مشاور املاک";
    const currentPhone = baseUser ? (baseUser.phone || baseUser.contact) : "۰۹۱۲۰۰۰۰۰۰۰";

    const updatedBase: BaseUserProfile = baseUser ? {
      ...baseUser,
      isCategoryCompleted: true,
      selectedCategory: "agent"
    } : {
      id: `agent-${Date.now()}`,
      firstName: "مشاور",
      lastName: "املاک",
      fullName: currentName,
      contact: currentPhone,
      phone: currentPhone,
      registeredAt: "امروز",
      isCategoryCompleted: true,
      selectedCategory: "agent"
    };

    setBaseUser(updatedBase);
    if (typeof window !== "undefined") {
      localStorage.setItem("yekhoone_base_user", JSON.stringify(updatedBase));
    }

    const newProfile: AgentProfile = {
      id: updatedBase.id,
      role: "agent",
      name: currentName,
      phone: currentPhone,
      avatar: "",
      licenseCode: data.licenseCode || "در دست استعلام",
      specialtyDistrict: data.specialtyDistrict || "منطقه ۲ تهران",
      rating: 5.0,
      dealsCount: 0,
      agencyId: "agency-user",
      agencyName: data.agencyName || "دفتر معاملات مسکن",
      managedPropertyIds: agentProfile.managedPropertyIds || [],
      upcomingNeshasstId: undefined
    };
    setAgentProfile(newProfile);
    handleSetRole("agent");
    if (typeof window !== "undefined") {
      localStorage.setItem("yekhoone_agent_profile", JSON.stringify(newProfile));
    }

    // Save to permanent registry
    saveRegisteredUserRecord({
      baseUser: updatedBase,
      agentProfile: newProfile
    });
  };

  // Step 2: In Profile, fill category: آژانس املاک
  const completeAgencyCategory = (data: { name: string; managerName: string; supervisorName: string; phone?: string; officePhone?: string; licenseNumber?: string; address?: string }) => {
    const currentName = data.name || (baseUser ? `دفتر املاک ${baseUser.lastName}` : "آژانس املاک رسمی");
    const currentPhone = data.phone || (baseUser ? (baseUser.phone || baseUser.contact) : "۰۲۱۲۲۰۰۰۰۰۰");

    const updatedBase: BaseUserProfile = baseUser ? {
      ...baseUser,
      isCategoryCompleted: true,
      selectedCategory: "agency"
    } : {
      id: `agency-${Date.now()}`,
      firstName: "مدیر",
      lastName: "آژانس",
      fullName: currentName,
      contact: currentPhone,
      phone: currentPhone,
      registeredAt: "امروز",
      isCategoryCompleted: true,
      selectedCategory: "agency"
    };

    setBaseUser(updatedBase);
    if (typeof window !== "undefined") {
      localStorage.setItem("yekhoone_base_user", JSON.stringify(updatedBase));
    }

    const newProfile: AgencyProfile = {
      id: updatedBase.id,
      role: "agency",
      name: currentName,
      licenseNumber: data.licenseNumber || "در دست ثبت",
      managerName: data.managerName || (baseUser ? baseUser.fullName : "مدیریت آژانس"),
      supervisorName: data.supervisorName || data.managerName || "سرپرست حقوقی",
      phone: currentPhone,
      officePhone: data.officePhone || "",
      address: data.address || "تهران",
      logo: "/logo.jpg",
      totalManagedProperties: 0,
      activeNeshasstRooms: 0,
      upcomingNeshasstId: undefined,
      members: []
    };
    setAgencyProfile(newProfile);
    handleSetRole("agency");
    if (typeof window !== "undefined") {
      localStorage.setItem("yekhoone_agency_profile", JSON.stringify(newProfile));
    }

    // Save to permanent registry
    saveRegisteredUserRecord({
      baseUser: updatedBase,
      agencyProfile: newProfile
    });
  };

  const resetCategory = () => {
    if (baseUser) {
      const updated = { ...baseUser, isCategoryCompleted: false, selectedCategory: undefined };
      setBaseUser(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("yekhoone_base_user", JSON.stringify(updated));
      }
      saveRegisteredUserRecord({ baseUser: updated });
    }
    handleSetRole("member");
  };

  // Backwards-compatible direct sign ups
  const signUpBuyer = (data: { name: string; phone: string; demandType?: "buy" | "rent" | "barter"; budgetLabel?: string; desiredDistricts?: string[] }) => {
    const names = data.name.split(" ");
    signUpClassic({
      firstName: names[0] || data.name,
      lastName: names.slice(1).join(" ") || "گرامی",
      contact: data.phone
    });
    completeBuyerCategory(data);
  };

  const signUpSeller = (data: { name: string; phone: string; nationalId?: string; propertyType?: string; district?: string }) => {
    const names = data.name.split(" ");
    signUpClassic({
      firstName: names[0] || data.name,
      lastName: names.slice(1).join(" ") || "گرامی",
      contact: data.phone
    });
    completeSellerCategory(data);
  };

  const signUpAgent = (data: { name: string; phone: string; licenseCode?: string; agencyName?: string; specialtyDistrict?: string }) => {
    const names = data.name.split(" ");
    signUpClassic({
      firstName: names[0] || data.name,
      lastName: names.slice(1).join(" ") || "گرامی",
      contact: data.phone
    });
    completeAgentCategory(data);
  };

  const signUpAgency = (data: { name: string; managerName: string; supervisorName: string; phone: string; officePhone?: string; licenseNumber?: string; address?: string }) => {
    const names = data.managerName.split(" ");
    signUpClassic({
      firstName: names[0] || data.managerName,
      lastName: names.slice(1).join(" ") || "گرامی",
      contact: data.phone
    });
    completeAgencyCategory(data);
  };

  const toggleFavorite = (propertyId: number) => {
    setBuyerProfile((prev) => {
      const exists = prev.favoritePropertyIds.includes(propertyId);
      const nextFavorites = exists
        ? prev.favoritePropertyIds.filter((id) => id !== propertyId)
        : [...prev.favoritePropertyIds, propertyId];
      const updated = { ...prev, favoritePropertyIds: nextFavorites };
      if (typeof window !== "undefined") {
        localStorage.setItem("yekhoone_buyer_profile", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const isFavorite = (propertyId: number) => {
    return buyerProfile.favoritePropertyIds.includes(propertyId);
  };

  return (
    <UserContext.Provider
      value={{
        currentRole,
        setCurrentRole: handleSetRole,
        baseUser,
        buyerProfile,
        sellerProfile,
        agentProfile,
        agencyProfile,
        currentNeshasst,
        toggleFavorite,
        isFavorite,
        signUpClassic,
        signInClassic,
        completeBuyerCategory,
        completeSellerCategory,
        completeAgentCategory,
        completeAgencyCategory,
        resetCategory,
        signUpBuyer,
        signUpSeller,
        signUpAgent,
        signUpAgency,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
