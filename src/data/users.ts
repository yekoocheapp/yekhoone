import { Property, initialProperties } from "./properties";

export type UserRole = "buyer" | "seller" | "agent" | "agency" | "member" | "guest";

export interface BaseUserProfile {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  contact: string;
  email?: string;
  phone?: string;
  registeredAt: string;
  isCategoryCompleted: boolean;
  selectedCategory?: "buyer" | "seller" | "agent" | "agency";
}

export interface BuyerProfile {
  id: string;
  role: "buyer";
  name: string;
  phone: string;
  avatar: string;
  demandType?: "buy" | "rent" | "barter";
  budgetLabel: string;
  desiredDistricts: string[];
  favoritePropertyIds: number[];
  upcomingNeshasstId?: string;
}

export interface SellerProfile {
  id: string;
  role: "seller";
  name: string;
  phone: string;
  avatar: string;
  nationalId?: string;
  nationalIdVerified: boolean;
  propertyType?: string;
  district?: string;
  isBarterAccepted?: boolean;
  barterTargetDescription?: string;
  ownedPropertyIds: number[];
  upcomingNeshasstId?: string;
}

export interface AgentProfile {
  id: string;
  role: "agent";
  name: string;
  phone: string;
  avatar: string;
  licenseCode: string;
  specialtyDistrict?: string;
  rating: number;
  dealsCount: number;
  agencyId: string;
  agencyName: string;
  managedPropertyIds: number[];
  upcomingNeshasstId?: string;
}

export interface AgencyAgentMember {
  id: string;
  name: string;
  phone: string;
  role: string;
  avatar: string;
  activeListingsCount: number;
  dealsCount: number;
}

export interface AgencyProfile {
  id: string;
  role: "agency";
  name: string;
  licenseNumber: string;
  managerName: string;
  supervisorName: string;
  phone: string;
  officePhone?: string;
  address: string;
  logo: string;
  members: AgencyAgentMember[];
  totalManagedProperties: number;
  activeNeshasstRooms: number;
  upcomingNeshasstId?: string;
}

export interface NeshasstSession {
  id: string;
  title: string;
  propertyId: number;
  propertyTitle: string;
  propertyAddress: string;
  propertyPrice: string;
  agencyName: string;
  supervisorName: string;
  agentName: string;
  buyerName: string;
  sellerName: string;
  scheduledTime: string;
  status: "live" | "scheduled" | "completed";
}

// Standard Generic Neshasst Room
export const INITIAL_NESHASST: NeshasstSession = {
  id: "neshasst-live-01",
  title: "نشست آنلاین اتاق قرارداد",
  propertyId: 1,
  propertyTitle: "آپارتمان نوساز علامه شمالی",
  propertyAddress: "تهران، سعادت‌آباد، میدان کاج، خیابان سرو غربی",
  propertyPrice: "۱۸,۵۰۰,۰۰۰,۰۰۰ تومان",
  agencyName: "دفتر املاک رسمی",
  supervisorName: "سرپرست قرارداد",
  agentName: "مشاور ارشد پرونده",
  buyerName: "متقاضی مسکن",
  sellerName: "مالک ملک",
  scheduledTime: "در حال برگزاری",
  status: "live"
};

// Clean Empty Profile Initializers (Zero Mock Data)
export const DEFAULT_EMPTY_BUYER_PROFILE: BuyerProfile = {
  id: "buyer-empty",
  role: "buyer",
  name: "",
  phone: "",
  avatar: "",
  budgetLabel: "تعیین نشده",
  desiredDistricts: [],
  favoritePropertyIds: [],
  upcomingNeshasstId: undefined
};

export const DEFAULT_EMPTY_SELLER_PROFILE: SellerProfile = {
  id: "seller-empty",
  role: "seller",
  name: "",
  phone: "",
  avatar: "",
  nationalIdVerified: false,
  ownedPropertyIds: [],
  upcomingNeshasstId: undefined
};

export const DEFAULT_EMPTY_AGENT_PROFILE: AgentProfile = {
  id: "agent-empty",
  role: "agent",
  name: "",
  phone: "",
  avatar: "",
  licenseCode: "",
  rating: 5.0,
  dealsCount: 0,
  agencyId: "",
  agencyName: "",
  managedPropertyIds: [],
  upcomingNeshasstId: undefined
};

export const DEFAULT_EMPTY_AGENCY_PROFILE: AgencyProfile = {
  id: "agency-empty",
  role: "agency",
  name: "",
  licenseNumber: "",
  managerName: "",
  supervisorName: "",
  phone: "",
  address: "",
  logo: "/logo.jpg",
  totalManagedProperties: 0,
  activeNeshasstRooms: 0,
  upcomingNeshasstId: undefined,
  members: []
};

// Backwards-compatible aliases pointing to clean empty states
export const INITIAL_BUYER_PROFILE = DEFAULT_EMPTY_BUYER_PROFILE;
export const INITIAL_SELLER_PROFILE = DEFAULT_EMPTY_SELLER_PROFILE;
export const INITIAL_AGENT_PROFILE = DEFAULT_EMPTY_AGENT_PROFILE;
export const INITIAL_AGENCY_PROFILE = DEFAULT_EMPTY_AGENCY_PROFILE;
