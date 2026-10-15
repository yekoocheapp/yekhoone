"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserRole,
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
  buyerProfile: BuyerProfile;
  sellerProfile: SellerProfile;
  agentProfile: AgentProfile;
  agencyProfile: AgencyProfile;
  currentNeshasst: NeshasstSession;
  toggleFavorite: (propertyId: number) => void;
  isFavorite: (propertyId: number) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>("buyer");
  const [buyerProfile, setBuyerProfile] = useState<BuyerProfile>(INITIAL_BUYER_PROFILE);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile>(INITIAL_SELLER_PROFILE);
  const [agentProfile, setAgentProfile] = useState<AgentProfile>(INITIAL_AGENT_PROFILE);
  const [agencyProfile, setAgencyProfile] = useState<AgencyProfile>(INITIAL_AGENCY_PROFILE);
  const [currentNeshasst, setCurrentNeshasst] = useState<NeshasstSession>(INITIAL_NESHASST);

  // Sync role to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("yekhoone_user_role") as UserRole;
      if (saved && ["buyer", "seller", "agent", "agency", "guest"].includes(saved)) {
        setCurrentRole(saved);
      }
    }
  }, []);

  const handleSetRole = (role: UserRole) => {
    setCurrentRole(role);
    if (typeof window !== "undefined") {
      localStorage.setItem("yekhoone_user_role", role);
    }
  };

  const toggleFavorite = (propertyId: number) => {
    setBuyerProfile((prev) => {
      const exists = prev.favoritePropertyIds.includes(propertyId);
      const nextFavorites = exists
        ? prev.favoritePropertyIds.filter((id) => id !== propertyId)
        : [...prev.favoritePropertyIds, propertyId];
      return { ...prev, favoritePropertyIds: nextFavorites };
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
        buyerProfile,
        sellerProfile,
        agentProfile,
        agencyProfile,
        currentNeshasst,
        toggleFavorite,
        isFavorite
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
