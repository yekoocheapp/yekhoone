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
  signUpClassic: (data: { firstName: string; lastName: string; contact: string; password?: string }) => void;
  signInClassic: (data: { contact: string; password?: string }) => { success: boolean; error?: string; userName?: string };

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
  logout: () => void;
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

  // Sync role and saved profiles from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 0. Base User & Auto-migration
      try {
        const savedBase = localStorage.getItem("yekhoone_base_user");
        if (savedBase) {
          const parsed = JSON.parse(savedBase);
          setBaseUser(parsed);
          saveRegisteredUserRecord({ baseUser: parsed });
        }
      } catch (e) {}

      // 1. Role
      const savedRole = localStorage.getItem("yekhoone_user_role") as UserRole;
      if (savedRole && ["buyer", "seller", "agent", "agency", "member", "guest"].includes(savedRole)) {
        setCurrentRole(savedRole);
      } else {
        setCurrentRole("guest");
        localStorage.setItem("yekhoone_user_role", "guest");
      }

      // 2. Buyer Profile
      try {
        const savedBuyer = localStorage.getItem("yekhoone_buyer_profile");
        if (savedBuyer) setBuyerProfile(JSON.parse(savedBuyer));
      } catch (e) {}

      // 3. Seller Profile
      try {
        const savedSeller = localStorage.getItem("yekhoone_seller_profile");
        if (savedSeller) setSellerProfile(JSON.parse(savedSeller));
      } catch (e) {}

      // 4. Agent Profile
      try {
        const savedAgent = localStorage.getItem("yekhoone_agent_profile");
        if (savedAgent) setAgentProfile(JSON.parse(savedAgent));
      } catch (e) {}

      // 5. Agency Profile
      try {
        const savedAgency = localStorage.getItem("yekhoone_agency_profile");
        if (savedAgency) setAgencyProfile(JSON.parse(savedAgency));
      } catch (e) {}
    }
  }, []);

  const handleSetRole = (role: UserRole) => {
    setCurrentRole(role);
    if (typeof window !== "undefined") {
      localStorage.setItem("yekhoone_user_role", role);
    }
  };

  const logout = () => {
    setBaseUser(null);
    handleSetRole("guest");
    if (typeof window !== "undefined") {
      localStorage.removeItem("yekhoone_base_user");
      localStorage.setItem("yekhoone_user_role", "guest");
    }
  };

  // Step 1: Classic Sign-Up for every user
  const signUpClassic = (data: { firstName: string; lastName: string; contact: string; password?: string }) => {
    const isEmail = data.contact.includes("@");
    const newBase: BaseUserProfile = {
      id: `user-${Date.now()}`,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      fullName: `${data.firstName.trim()} ${data.lastName.trim()}`,
      contact: data.contact.trim(),
      email: isEmail ? data.contact.trim() : undefined,
      phone: !isEmail ? data.contact.trim() : undefined,
      registeredAt: "امروز",
      isCategoryCompleted: false,
      selectedCategory: undefined
    };

    setBaseUser(newBase);
    handleSetRole("member");
    if (typeof window !== "undefined") {
      localStorage.setItem("yekhoone_base_user", JSON.stringify(newBase));
    }

    // Persist to permanent accounts registry
    saveRegisteredUserRecord({
      baseUser: newBase,
      password: data.password
    });
  };

  // Step 1 Alternative: Classic Sign-In
  const signInClassic = (data: { contact: string; password?: string }): { success: boolean; error?: string; userName?: string } => {
    const norm = normalizeContactString(data.contact);
    const all = loadRegisteredUsers();
    let account = all.find(
      (u) => normalizeContactString(u.baseUser.contact) === norm
    );

    // Fallback: check if active baseUser matches
    if (!account && baseUser && normalizeContactString(baseUser.contact) === norm) {
      account = { baseUser };
    }

    if (!account) {
      return {
        success: false,
        error: "حسابی با این شماره یا ایمیل یافت نشد. لطفاً از سربرگ «ثبت‌نام کاربر جدید» ابتدا ثبت‌نام فرمایید."
      };
    }

    // Verify password if account has a registered password
    if (account.password && data.password && account.password !== data.password) {
      return {
        success: false,
        error: "کلمه عبور وارد شده نادرست است. لطفاً دوباره بررسی فرمایید."
      };
    }

    // Restore real user identity
    setBaseUser(account.baseUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("yekhoone_base_user", JSON.stringify(account.baseUser));
    }

    // Restore category profiles if previously completed
    if (account.buyerProfile) {
      setBuyerProfile(account.buyerProfile);
      if (typeof window !== "undefined") {
        localStorage.setItem("yekhoone_buyer_profile", JSON.stringify(account.buyerProfile));
      }
    }
    if (account.sellerProfile) {
      setSellerProfile(account.sellerProfile);
      if (typeof window !== "undefined") {
        localStorage.setItem("yekhoone_seller_profile", JSON.stringify(account.sellerProfile));
      }
    }
    if (account.agentProfile) {
      setAgentProfile(account.agentProfile);
      if (typeof window !== "undefined") {
        localStorage.setItem("yekhoone_agent_profile", JSON.stringify(account.agentProfile));
      }
    }
    if (account.agencyProfile) {
      setAgencyProfile(account.agencyProfile);
      if (typeof window !== "undefined") {
        localStorage.setItem("yekhoone_agency_profile", JSON.stringify(account.agencyProfile));
      }
    }

    const nextRole = account.baseUser.selectedCategory || "member";
    handleSetRole(nextRole);

    return {
      success: true,
      userName: account.baseUser.fullName
    };
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
