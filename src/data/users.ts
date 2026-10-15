import { Property, initialProperties } from "./properties";

export type UserRole = "buyer" | "seller" | "agent" | "agency" | "guest";

export interface BuyerProfile {
  id: string;
  role: "buyer";
  name: string;
  phone: string;
  avatar: string;
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
  nationalIdVerified: boolean;
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

// Initial Mock Neshasst Room (The Active Session)
export const INITIAL_NESHASST: NeshasstSession = {
  id: "neshasst-1403-76",
  title: "نشست اتاق قرارداد آنلاین - آپارتمان ۱۶۵ متری سعادت‌آباد",
  propertyId: 1,
  propertyTitle: "آپارتمان ۱۶۵ متری ۳ خوابه کلیدنخورده",
  propertyAddress: "تهران، سعادت‌آباد، میدان کاج، خیابان سرو غربی، پلاک ۲۴",
  propertyPrice: "۱۸,۵۰۰,۰۰۰,۰۰۰ تومان",
  agencyName: "املاک نوین سعادت‌آباد",
  supervisorName: "مهندس کامران شایسته (سرپرست قرارداد)",
  agentName: "مهرداد حیدری (مشاور ارشد پرونده)",
  buyerName: "آقای دکتر پارسا کیانی (خریدار)",
  sellerName: "مهندس علیرضا سهرابی (مالک و فروشنده)",
  scheduledTime: "هم‌اکنون در حال برگزاری",
  status: "live"
};

// Initial Mock Profiles
export const INITIAL_BUYER_PROFILE: BuyerProfile = {
  id: "buyer-01",
  role: "buyer",
  name: "دکتر پارسا کیانی",
  phone: "۰۹۱۲۱۱۱۴۳۲۱",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  budgetLabel: "تا ۲۰ میلیارد تومان",
  desiredDistricts: ["سعادت‌آباد", "شهرک غرب", "نیاوران"],
  favoritePropertyIds: [1, 2, 4],
  upcomingNeshasstId: "neshasst-1403-76"
};

export const INITIAL_SELLER_PROFILE: SellerProfile = {
  id: "seller-01",
  role: "seller",
  name: "مهندس علیرضا سهرابی",
  phone: "۰۹۱۲۸۸۸۹۹۰۰",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  nationalIdVerified: true,
  ownedPropertyIds: [1, 3],
  upcomingNeshasstId: "neshasst-1403-76"
};

export const INITIAL_AGENT_PROFILE: AgentProfile = {
  id: "agent-01",
  role: "agent",
  name: "مهرداد حیدری",
  phone: "۰۹۱۲۳۴۵۶۷۸۹",
  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  licenseCode: "UN-94821",
  rating: 4.9,
  dealsCount: 53,
  agencyId: "agency-novin",
  agencyName: "املاک نوین سعادت‌آباد",
  managedPropertyIds: [1, 2, 3],
  upcomingNeshasstId: "neshasst-1403-76"
};

export const INITIAL_AGENCY_PROFILE: AgencyProfile = {
  id: "agency-novin",
  role: "agency",
  name: "املاک نوین سعادت‌آباد",
  licenseNumber: "ص/۸۸۳۴۲۱ اتحادیه املاک تهران",
  managerName: "حاج محمود شایسته",
  supervisorName: "مهندس کامران شایسته (مدیر قرارداد)",
  phone: "۰۲۱-۲۲۳۳۴۴۵۵",
  address: "تهران، سعادت‌آباد، میدان کاج، نبش خیابان مروارید، پلاک ۱۲",
  logo: "/logo.jpg",
  totalManagedProperties: 28,
  activeNeshasstRooms: 2,
  upcomingNeshasstId: "neshasst-1403-76",
  members: [
    {
      id: "agent-01",
      name: "مهرداد حیدری",
      phone: "۰۹۱۲۳۴۵۶۷۸۹",
      role: "مشاور ارشد رنج فروش",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      activeListingsCount: 8,
      dealsCount: 53
    },
    {
      id: "agent-02",
      name: "سارا فرهمند",
      phone: "۰۹۱۲۷۷۷۶۵۴۳",
      role: "مشاور تخصصی رهن و اجاره",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      activeListingsCount: 12,
      dealsCount: 38
    },
    {
      id: "agent-03",
      name: "امیرحسین رضوی",
      phone: "۰۹۱۲۴۴۴۳۳۲۲",
      role: "مشاور املاک و مستغلات کلنگی",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
      activeListingsCount: 6,
      dealsCount: 29
    }
  ]
};
