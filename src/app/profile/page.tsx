"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  User,
  Search,
  Heart,
  ArrowRightLeft,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  Plus,
  Trash2,
  MapPin,
  BedDouble,
  Maximize2,
  Building2,
  Phone,
  Mail,
  Clock,
  Sparkles,
  LogOut,
  ExternalLink,
  ChevronLeft,
  DollarSign,
  Car,
  Home,
  Briefcase,
  KeyRound,
  Building,
  Layers,
  SlidersHorizontal,
  RefreshCw
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import AuthModal from "@/components/AuthModal";
import AgentDashboardView from "@/components/profile/AgentDashboardView";
import SellerDashboardView from "@/components/profile/SellerDashboardView";
import AgencyDashboardView from "@/components/profile/AgencyDashboardView";
import { formatPersianNumber } from "@/data/properties";

const TEHRAN_DISTRICTS = [
  "سعادت‌آباد",
  "شهرک غرب",
  "پونک",
  "نیاوران",
  "فرمانیه",
  "زعفرانیه",
  "ولنجک",
  "قیطریه",
  "الهیه",
  "محمودیه",
  "دروس",
  "پاسداران",
  "یوسف‌آباد",
  "تهرانپارس",
  "جنت‌آباد",
  "مرزداران",
  "گیشا",
  "صادقیه"
];

const PROPERTY_TYPES_OPTIONS = [
  "آپارتمان مسکونی",
  "ویلایی / باغ‌ویلا",
  "زمین مسکونی",
  "کلنگی تجمیعی",
  "اداری و موقعیت اداری",
  "مستغلات دربست"
];

const AMENITY_OPTIONS = [
  { id: "parking", label: "پارکینگ سندی" },
  { id: "elevator", label: "آسانسور" },
  { id: "storage", label: "انباری سندی" },
  { id: "balcony", label: "بالکن / تراس" },
  { id: "master", label: "اتاق خواب مستر" },
  { id: "lobby", label: "لابی مجلل و لابی‌من" },
  { id: "pool", label: "استخر، سونا و جکوزی" },
  { id: "smart", label: "سیستم هوشمند (BMS)" }
];

interface BarterAssetItem {
  id: string;
  category: string;
  title: string;
  valuationTomans: string;
  cashDelta: string;
  deedType: string;
}

export default function ProfilePage() {
  const { currentRole, setCurrentRole, baseUser, logout } = useUser();
  const [activeTab, setActiveTab] = useState<"criteria" | "favorites" | "barter" | "neshasst" | "settings">("criteria");

  // Auth Modal state for guest
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Loading & Feedback
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Criteria State
  const [demandType, setDemandType] = useState<"buy" | "rent" | "barter">("buy");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [desiredDistricts, setDesiredDistricts] = useState<string[]>(["سعادت‌آباد", "شهرک غرب"]);
  const [minMeters, setMinMeters] = useState("100");
  const [minBedrooms, setMinBedrooms] = useState("2");
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>(["آپارتمان مسکونی"]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(["parking", "elevator", "storage"]);
  const [urgency, setUrgency] = useState("1month");

  // Barter Assets
  const [barterAssets, setBarterAssets] = useState<BarterAssetItem[]>([]);
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [newAssetCategory, setNewAssetCategory] = useState("خودرو سواری");
  const [newAssetTitle, setNewAssetTitle] = useState("");
  const [newAssetValuation, setNewAssetValuation] = useState("");
  const [newAssetDelta, setNewAssetDelta] = useState("امکان پرداخت مابه‌التفاوت نقدی");
  const [newAssetDeed, setNewAssetDeed] = useState("سند رسمی قطعی");

  // Favorites & Neshasst data
  const [favorites, setFavorites] = useState<any[]>([]);
  const [neshasstSessions, setNeshasstSessions] = useState<any[]>([]);

  // User Profile Form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Load from backend API on mount
  useEffect(() => {
    let isMounted = true;
    async function loadBuyerProfile() {
      try {
        setLoading(true);
        const res = await fetch("/api/profile/buyer");
        if (!res.ok) {
          if (res.status === 401) {
            // Not authenticated
            setLoading(false);
            return;
          }
          throw new Error("Failed to load profile");
        }
        const data = await res.json();
        if (isMounted && data.success) {
          if (data.user) {
            setFirstName(data.user.firstName || "");
            setLastName(data.user.lastName || "");
          }
          if (data.buyerProfile) {
            const p = data.buyerProfile;
            if (p.demandType) setDemandType(p.demandType);
            if (p.minBudgetTomans) setMinBudget(p.minBudgetTomans);
            if (p.maxBudgetTomans) setMaxBudget(p.maxBudgetTomans);
            if (p.minMeters) setMinMeters(String(p.minMeters));
            if (p.minBedrooms) setMinBedrooms(String(p.minBedrooms));
            if (p.urgency) setUrgency(p.urgency);

            if (p.desiredDistricts) {
              try {
                const parsed = JSON.parse(p.desiredDistricts);
                if (Array.isArray(parsed)) setDesiredDistricts(parsed);
              } catch {}
            }
            if (p.propertyTypes) {
              try {
                const parsed = JSON.parse(p.propertyTypes);
                if (Array.isArray(parsed)) setSelectedPropertyTypes(parsed);
              } catch {}
            }
            if (p.amenities) {
              try {
                const parsed = JSON.parse(p.amenities);
                if (Array.isArray(parsed)) setSelectedAmenities(parsed);
              } catch {}
            }
            if (p.barterAssetsJson) {
              try {
                const parsed = JSON.parse(p.barterAssetsJson);
                if (Array.isArray(parsed)) setBarterAssets(parsed);
              } catch {}
            }
          }
          if (data.favorites) setFavorites(data.favorites);
          if (data.neshasstSessions) setNeshasstSessions(data.neshasstSessions);
        }
      } catch (err: any) {
        console.error("Profile load error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadBuyerProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const [roleSwitching, setRoleSwitching] = useState(false);
  const handleSwitchRole = async (newRole: "buyer" | "seller" | "agent" | "agency") => {
    if (newRole === currentRole) return;
    setRoleSwitching(true);
    try {
      const res = await fetch("/api/profile/role", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        setCurrentRole(newRole);
        if (baseUser) {
          const updated = { ...baseUser, selectedCategory: newRole };
          localStorage.setItem("yekhoone_base_user", JSON.stringify(updated));
        }
        localStorage.setItem("yekhoone_user_role", newRole);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRoleSwitching(false);
    }
  };

  const ROLE_PRESENTATION: Record<string, { title: string; dashboardTitle: string; badgeColor: string; icon: any }> = {
    agent: {
      title: "مشاور رسمی املاک",
      dashboardTitle: "میز کار مشاور املاک",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      icon: Briefcase
    },
    seller: {
      title: "مالک یا سازنده مسکن",
      dashboardTitle: "میز کار مالک و سازنده",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      icon: KeyRound
    },
    agency: {
      title: "دفتر و مدیریت آژانس",
      dashboardTitle: "میز کار مدیریت دپارتمان",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      icon: Building
    },
    buyer: {
      title: "متقاضی و خریدار مسکن",
      dashboardTitle: "میز کار متقاضی مسکن",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      icon: Sparkles
    }
  };

  const currentRoleInfo = ROLE_PRESENTATION[currentRole] || ROLE_PRESENTATION.buyer;
  const RoleIcon = currentRoleInfo.icon;

  // Save changes to backend database
  const handleSaveCriteria = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/profile/buyer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          demandType,
          minBudgetTomans: minBudget,
          maxBudgetTomans: maxBudget,
          budgetLabel: minBudget && maxBudget ? `${minBudget} تا ${maxBudget} میلیارد` : "تعیین شده توسط متقاضی",
          desiredDistricts,
          minMeters,
          minBedrooms,
          propertyTypes: selectedPropertyTypes,
          amenities: selectedAmenities,
          urgency,
          barterAssetsJson: barterAssets,
          firstName,
          lastName
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "خطا در ذخیره‌سازی اطلاعات");
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "خطا در ارتباط با سرور");
    } finally {
      setSaving(false);
    }
  };

  // Toggle district pill
  const toggleDistrict = (district: string) => {
    if (desiredDistricts.includes(district)) {
      setDesiredDistricts(desiredDistricts.filter(d => d !== district));
    } else {
      setDesiredDistricts([...desiredDistricts, district]);
    }
  };

  // Toggle property type
  const togglePropertyType = (type: string) => {
    if (selectedPropertyTypes.includes(type)) {
      setSelectedPropertyTypes(selectedPropertyTypes.filter(t => t !== type));
    } else {
      setSelectedPropertyTypes([...selectedPropertyTypes, type]);
    }
  };

  // Toggle amenity
  const toggleAmenity = (id: string) => {
    if (selectedAmenities.includes(id)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== id));
    } else {
      setSelectedAmenities([...selectedAmenities, id]);
    }
  };

  // Add new Barter Asset
  const handleAddBarterAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetTitle.trim()) return;

    const newItem: BarterAssetItem = {
      id: `asset-${Date.now()}`,
      category: newAssetCategory,
      title: newAssetTitle.trim(),
      valuationTomans: newAssetValuation.trim() || "توافقی کارشناسی",
      cashDelta: newAssetDelta,
      deedType: newAssetDeed
    };

    const updated = [newItem, ...barterAssets];
    setBarterAssets(updated);
    setIsAddingAsset(false);
    setNewAssetTitle("");
    setNewAssetValuation("");

    // Auto-save to DB
    fetch("/api/profile/buyer", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ barterAssetsJson: updated })
    }).catch(() => {});
  };

  // Remove Barter Asset
  const handleRemoveBarterAsset = (id: string) => {
    const updated = barterAssets.filter(a => a.id !== id);
    setBarterAssets(updated);
    fetch("/api/profile/buyer", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ barterAssetsJson: updated })
    }).catch(() => {});
  };

  // Guest State Screen
  if (!loading && (!baseUser || currentRole === "guest")) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-all group"
            >
              <ArrowRight className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>بازگشت به صفحه اصلی</span>
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-amber-500/30">
                <Image src="/logo.jpg" alt="یه خونه" fill className="object-cover" />
              </div>
              <span className="text-base font-extrabold bg-gradient-to-l from-amber-400 to-white bg-clip-text text-transparent">
                یه خونه
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 flex items-center justify-center">
          <div className="text-center p-8 sm:p-12 rounded-3xl bg-slate-900/60 border border-slate-800 max-w-md w-full shadow-2xl backdrop-blur-xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-500/10">
              <User className="w-8 h-8" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mb-2">
              ورود به میز کار متقاضی مسکن
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
              برای دسترسی به مشخصات تقاضا، ذخیره علاقه‌مندی‌ها، کیف دارایی‌های تهاتر و اتاق قرارداد آنلاین، لطفاً وارد حساب خود شوید.
            </p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-l from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
              >
                ورود یا ثبت‌نام متقاضی
              </button>
              <Link
                href="/"
                className="block w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
              >
                مشاهده املاک صفحه اصلی
              </Link>
            </div>
          </div>
        </main>

        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultMode="signin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-all group"
            >
              <ArrowRight className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>بازگشت به سایت</span>
            </Link>

            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-amber-500/30">
                <Image src="/logo.jpg" alt="یه خونه" fill className="object-cover" />
              </div>
              <span className="text-base font-extrabold bg-gradient-to-l from-amber-400 to-white bg-clip-text text-transparent">
                {currentRoleInfo.dashboardTitle}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => logout()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800/60 text-xs font-semibold text-slate-300 hover:text-rose-400 transition-all"
              title="خروج از حساب"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* User Identity & KYC Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-5 sm:p-7 shadow-xl">
          <div className="absolute top-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* User Info */}
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-black text-2xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20 border-2 border-amber-400/30">
                {baseUser?.fullName ? baseUser.fullName.charAt(0) : "م"}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-lg sm:text-2xl font-black text-white">
                    {baseUser?.fullName || "متقاضی محترم مسکن"}
                  </h1>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black border ${currentRoleInfo.badgeColor}`}>
                    <RoleIcon className="w-3.5 h-3.5" />
                    {currentRoleInfo.title}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3" />
                    احراز هویت شده
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span dir="ltr">{baseUser?.contact || "۰۹۱۲۰۰۰۰۰۰۰"}</span>
                  </span>
                  {baseUser?.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>{baseUser.email}</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>عضویت در سامانه یه خونه</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 shrink-0">
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 text-center">
                <span className="block text-lg sm:text-xl font-black text-amber-400">
                  {formatPersianNumber(favorites.length)}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">نشان‌شده‌ها</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 text-center">
                <span className="block text-lg sm:text-xl font-black text-emerald-400">
                  {formatPersianNumber(barterAssets.length)}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">دارایی تهاتر</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 text-center">
                <span className="block text-lg sm:text-xl font-black text-blue-400">
                  {formatPersianNumber(neshasstSessions.length)}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">جلسه نشست</span>
              </div>
            </div>
          </div>

          {/* Quick 1-Click Role Switcher */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold text-[11px]">تغییر رسته کاربری فعال:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { role: "agent", label: "مشاور رسمی املاک", icon: Briefcase },
                  { role: "seller", label: "مالک یا سازنده", icon: KeyRound },
                  { role: "buyer", label: "متقاضی و خریدار", icon: Sparkles },
                  { role: "agency", label: "دپارتمان املاک", icon: Building }
                ].map(r => (
                  <button
                    key={r.role}
                    type="button"
                    disabled={roleSwitching}
                    onClick={() => handleSwitchRole(r.role as any)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      currentRole === r.role
                        ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20 ring-1 ring-amber-400"
                        : "bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                    }`}
                  >
                    <r.icon className="w-3.5 h-3.5" />
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <span className="text-[11px] text-slate-500">
              با انتخاب هر رسته، ابزارها و داشبورد همان بخش فوراً فعال می‌شود.
            </span>
          </div>
        </section>

        {currentRole === "agent" ? (
          <AgentDashboardView />
        ) : currentRole === "seller" ? (
          <SellerDashboardView />
        ) : currentRole === "agency" ? (
          <AgencyDashboardView />
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("criteria")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === "criteria"
                ? "bg-gradient-to-l from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20"
                : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>معیارهای تقاضا و بودجه</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("favorites")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === "favorites"
                ? "bg-gradient-to-l from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20"
                : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>املاک نشان‌شده ({formatPersianNumber(favorites.length)})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("barter")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === "barter"
                ? "bg-gradient-to-l from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20"
                : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>کیف دارایی‌های تهاتر ({formatPersianNumber(barterAssets.length)})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("neshasst")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === "neshasst"
                ? "bg-gradient-to-l from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20"
                : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>نشست‌ها و اتاق قرارداد ({formatPersianNumber(neshasstSessions.length)})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === "settings"
                ? "bg-gradient-to-l from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20"
                : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <User className="w-4 h-4" />
            <span>تنظیمات حساب</span>
          </button>
        </div>

        {/* Global Toast Alerts */}
        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 text-xs sm:text-sm animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>معیارها و مشخصات تقاضای شما با موفقیت در پایگاه داده ذخیره شد.</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-3 text-xs sm:text-sm animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* TAB 1: Search Criteria & Preferences */}
        {activeTab === "criteria" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-3xl bg-slate-900/50 border border-slate-800 p-5 sm:p-7 space-y-6">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <Search className="w-5 h-5 text-amber-400" />
                    <span>نوع معامله و هدف تقاضا</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    مشخص کنید تمایل به خرید قطعی، رهن و اجاره، یا تهاتر دارایی دارید.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: "buy", title: "خرید قطعی مسکن", desc: "خرید نقدی یا با وام" },
                    { key: "rent", title: "رهن و اجاره", desc: "ودیعه و اجاره ماهانه" },
                    { key: "barter", title: "تهاتر دارایی", desc: "معاوضه ملک، خودرو یا زمین" }
                  ].map(item => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setDemandType(item.key as any)}
                      className={`p-3 sm:p-4 rounded-2xl border text-right transition-all ${
                        demandType === item.key
                          ? "bg-amber-500/10 border-amber-500 text-white shadow-md shadow-amber-500/10"
                          : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      <span className="block font-bold text-xs sm:text-sm mb-0.5">{item.title}</span>
                      <span className="block text-[11px] text-slate-500">{item.desc}</span>
                    </button>
                  ))}
                </div>

                {/* Target Districts */}
                <div className="space-y-3 pt-4 border-t border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <label className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      <span>محله‌ها و مناطق مورد نظر در تهران</span>
                    </label>
                    <span className="text-[11px] text-amber-400 font-bold">
                      {formatPersianNumber(desiredDistricts.length)} محله انتخاب شده
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {TEHRAN_DISTRICTS.map(district => {
                      const isSelected = desiredDistricts.includes(district);
                      return (
                        <button
                          key={district}
                          type="button"
                          onClick={() => toggleDistrict(district)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            isSelected
                              ? "bg-amber-500 text-slate-950 font-black shadow-sm shadow-amber-500/20"
                              : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                          }`}
                        >
                          {district}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Budget Range */}
                <div className="space-y-3 pt-4 border-t border-slate-800/80">
                  <label className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-amber-400" />
                    <span>محدوده بودجه پیشنهادی (میلیارد تومان)</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[11px] text-slate-400 mb-1.5">حداقل بودجه (میلیارد تومان)</span>
                      <div className="relative">
                        <input
                          type="number"
                          value={minBudget}
                          onChange={e => setMinBudget(e.target.value)}
                          placeholder="مثلاً ۸"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 text-right font-bold"
                        />
                        <span className="absolute left-3 top-3 text-[11px] text-slate-500">میلیارد</span>
                      </div>
                    </div>

                    <div>
                      <span className="block text-[11px] text-slate-400 mb-1.5">سقف بودجه (میلیارد تومان)</span>
                      <div className="relative">
                        <input
                          type="number"
                          value={maxBudget}
                          onChange={e => setMaxBudget(e.target.value)}
                          placeholder="مثلاً ۱۵"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 text-right font-bold"
                        />
                        <span className="absolute left-3 top-3 text-[11px] text-slate-500">میلیارد</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {[
                      { label: "زیر ۱۰ میلیارد", min: "0", max: "10" },
                      { label: "۱۰ تا ۲۰ میلیارد", min: "10", max: "20" },
                      { label: "۲۰ تا ۳۵ میلیارد", min: "20", max: "35" },
                      { label: "بالای ۳۵ میلیارد", min: "35", max: "100" }
                    ].map(preset => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setMinBudget(preset.min);
                          setMaxBudget(preset.max);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 hover:text-amber-400 hover:border-amber-500/40 transition-all"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Specifications */}
                <div className="space-y-4 pt-4 border-t border-slate-800/80">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span>مشخصات فنی ملک مورد تقاضا</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[11px] text-slate-400 mb-1.5">حداقل متراژ (متر مربع)</span>
                      <div className="relative">
                        <input
                          type="number"
                          value={minMeters}
                          onChange={e => setMinMeters(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 text-right font-bold"
                        />
                        <span className="absolute left-3 top-3 text-[11px] text-slate-500">مترمربع</span>
                      </div>
                    </div>

                    <div>
                      <span className="block text-[11px] text-slate-400 mb-1.5">حداقل تعداد خواب</span>
                      <select
                        value={minBedrooms}
                        onChange={e => setMinBedrooms(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 text-right font-bold"
                      >
                        <option value="1">حداقل ۱ خواب</option>
                        <option value="2">حداقل ۲ خواب</option>
                        <option value="3">حداقل ۳ خواب</option>
                        <option value="4">۴ خواب یا بیشتر</option>
                      </select>
                    </div>
                  </div>

                  {/* Property Types */}
                  <div>
                    <span className="block text-[11px] text-slate-400 mb-2">نوع کاربری ملک</span>
                    <div className="flex flex-wrap gap-2">
                      {PROPERTY_TYPES_OPTIONS.map(pt => {
                        const isSelected = selectedPropertyTypes.includes(pt);
                        return (
                          <button
                            key={pt}
                            type="button"
                            onClick={() => togglePropertyType(pt)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                              isSelected
                                ? "bg-amber-500/20 border border-amber-500 text-amber-300"
                                : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                            }`}
                          >
                            {pt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <span className="block text-[11px] text-slate-400 mb-2">امکانات الزامی ملک</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {AMENITY_OPTIONS.map(am => {
                        const isSelected = selectedAmenities.includes(am.id);
                        return (
                          <button
                            key={am.id}
                            type="button"
                            onClick={() => toggleAmenity(am.id)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold text-center border transition-all ${
                              isSelected
                                ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-300"
                                : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700"
                            }`}
                          >
                            {am.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Urgency */}
                  <div>
                    <span className="block text-[11px] text-slate-400 mb-2">فوریت و زمان‌بندی معامله</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: "immediate", label: "فوری (کمتر از ۱ ماه)" },
                        { key: "1month", label: "متوسط (۱ الی ۳ ماه)" },
                        { key: "flexible", label: "بررسی و سرمایه‌گذاری" }
                      ].map(item => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setUrgency(item.key)}
                          className={`py-2 px-2 text-center text-xs font-bold rounded-xl border transition-all ${
                            urgency === item.key
                              ? "bg-amber-500 text-slate-950 font-black"
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={handleSaveCriteria}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-l from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105 disabled:opacity-50"
                  >
                    {saving ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{saving ? "در حال ذخیره‌سازی..." : "ذخیره معیارهای خرید"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar Overview Column */}
            <div className="space-y-6">
              {/* Active Search Summary Card */}
              <div className="rounded-3xl bg-slate-900/40 border border-slate-800 p-5 space-y-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>خلاصه تقاضای فعال شما</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">قصد معامله:</span>
                    <span className="font-bold text-amber-400">
                      {demandType === "buy" ? "خرید قطعی" : demandType === "rent" ? "رهن و اجاره" : "تهاتر دارایی"}
                    </span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">مناطق هدف:</span>
                    <span className="font-bold text-white text-left max-w-[140px] truncate" title={desiredDistricts.join("، ")}>
                      {desiredDistricts.length > 0 ? desiredDistricts.slice(0, 2).join("، ") + (desiredDistricts.length > 2 ? ` (+${desiredDistricts.length - 2})` : "") : "انتخاب نشده"}
                    </span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">محدوده بودجه:</span>
                    <span className="font-bold text-white">
                      {minBudget && maxBudget ? `${minBudget} تا ${maxBudget} میلیارد` : "تعیین نشده"}
                    </span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">حداقل فضا:</span>
                    <span className="font-bold text-white">
                      {minMeters} متر • {minBedrooms} خواب
                    </span>
                  </div>
                </div>

                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-all"
                >
                  <Search className="w-3.5 h-3.5 text-amber-400" />
                  <span>جستجوی املاک با این معیارها</span>
                </Link>
              </div>

              {/* Dedicated Concierge Agent */}
              <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/20 p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">کارشناس اختصاصی تقاضا</h4>
                    <p className="text-[11px] text-amber-400/90 font-medium">پشتیبانی معاملات یه خونه</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  معیارهای تقاضای شما مستقیماً توسط کارشناسان خبره منطقه رصد شده و بهترین فایل‌های شخصی قبل از آگهی عمومی به شما معرفی می‌شوند.
                </p>
                <a
                  href="tel:02122000000"
                  className="block text-center py-2 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500 hover:text-slate-950 transition-all"
                >
                  تماس مستقیم با سرپرست تقاضا
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Saved Favorites */}
        {activeTab === "favorites" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-400" />
                  <span>املاک نشان‌شده و علاقه‌مندی‌ها</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  فایل‌های ملکی که برای بررسی بیشتر یا مقایسه ذخیره فرموده‌اید.
                </p>
              </div>
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-amber-400 hover:bg-slate-800 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>افزودن ملک جدید</span>
              </Link>
            </div>

            {favorites.length === 0 ? (
              <div className="text-center p-12 rounded-3xl bg-slate-900/30 border border-slate-800/80 max-w-lg mx-auto space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white">هنوز ملکی را نشان نکرده‌اید</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  هنگام گشت‌وگذار در سامانه یه خونه، با کلیک بر روی آیکون قلب روی هر ملک، می‌توانید آن را در این بخش برای دسترسی سریع ذخیره نمایید.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-l from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:scale-105 transition-all"
                >
                  <Search className="w-4 h-4" />
                  <span>مشاهده املاک منتخب تهران</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {favorites.map(prop => (
                  <div
                    key={prop.id}
                    className="group rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden hover:border-amber-500/40 transition-all flex flex-col"
                  >
                    <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                      {prop.images ? (
                        <Image
                          src={typeof prop.images === "string" ? JSON.parse(prop.images)[0] : prop.images[0]}
                          alt={prop.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <Building2 className="w-12 h-12" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-amber-400 border border-slate-800">
                        {prop.district}
                      </div>
                      {prop.isBarter && (
                        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-black">
                          آماده تهاتر
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-amber-400 transition-colors">
                          {prop.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                          {prop.address}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                        <span className="text-slate-400">
                          {prop.meters} متر • {prop.bedrooms} خواب
                        </span>
                        <span className="font-extrabold text-amber-400">
                          {prop.totalPrice || "تماس بگیرید"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <Link
                          href={`/properties/${prop.id}`}
                          className="flex-1 text-center py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
                        >
                          مشاهده جزییات ملک
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Barter Asset Wallet */}
        {activeTab === "barter" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-amber-400" />
                  <span>کیف دارایی‌های تهاتر متقاضی</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  دارایی‌هایی که مالک آن‌ها هستید و تمایل دارید با مسکن، ویلا یا زمین مورد نظرتان معاوضه بفرمایید.
                </p>
              </div>

              {!isAddingAsset && (
                <button
                  type="button"
                  onClick={() => setIsAddingAsset(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-l from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>ثبت دارایی جدید جهت تهاتر</span>
                </button>
              )}
            </div>

            {/* Add Asset Form Modal / Box */}
            {isAddingAsset && (
              <form
                onSubmit={handleAddBarterAsset}
                className="p-5 sm:p-7 rounded-3xl bg-slate-900 border border-amber-500/30 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-amber-400" />
                    <span>مشخصات دارایی پیشنهادی برای تهاتر</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAddingAsset(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    انصراف
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">دسته‌بندی دارایی</label>
                    <select
                      value={newAssetCategory}
                      onChange={e => setNewAssetCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value="خودرو سواری">خودرو خارجی یا لوکس</option>
                      <option value="زمین / باغ">زمین یا باغ (دماوند، شمال، کرج و...)</option>
                      <option value="آپارتمان مسکونی">آپارتمان مسکونی (تهران یا شهرستان)</option>
                      <option value="ملک تجاری / مغازه">ملک تجاری، دفتر کار یا مغازه</option>
                      <option value="کلنگی یا مستغلات">ملک کلنگی یا ویلایی قدیمی</option>
                      <option value="سایر دارایی‌ها">سایر دارایی‌های با ارزش ریالی</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">عنوان و مدل دقیق دارایی</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: لکسوس NX مدل ۲۰۱۷ یا ۳۰۰ متر زمین کلاردشت"
                      value={newAssetTitle}
                      onChange={e => setNewAssetTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    >
                    </input>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">ارزش تخمینی کارشناسی (تومان)</label>
                    <input
                      type="text"
                      placeholder="مثال: ۴ میلیارد و ۵۰۰ میلیون تومان"
                      value={newAssetValuation}
                      onChange={e => setNewAssetValuation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    >
                    </input>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">وضعیت پرداخت مابه‌التفاوت (سرک نقدی)</label>
                    <select
                      value={newAssetDelta}
                      onChange={e => setNewAssetDelta(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value="امکان پرداخت مابه‌التفاوت نقدی">توانایی پرداخت مابه‌التفاوت نقدی روی دارایی</option>
                      <option value="تهاتر سر به سر">صرفاً تهاتر سر به سر (بدون رد و بدل نقدینگی)</option>
                      <option value="تمایل به دریافت نقدینگی مازاد">تمایل به دریافت مازاد نقدی از فروشنده</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">وضعیت اسناد و مدارک مالکیت</label>
                    <select
                      value={newAssetDeed}
                      onChange={e => setNewAssetDeed(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value="سند تک‌برگ رسمی">سند رسمی تک‌برگ شخصی (شش‌دانگ آماده انتقال)</option>
                      <option value="سند قطعی منگوله‌دار">سند رسمی دفترچه‌ای معتبر</option>
                      <option value="قولنامه معتبر با کد رهگیری">قولنامه رسمی هولوگرام‌دار با استعلام ثبت</option>
                      <option value="سند خودرو و بیمه‌نامه معتبر">سند مالکیت کمپانی خودرو و برگ سبز</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddingAsset(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all"
                  >
                    افزودن به کیف تهاتر
                  </button>
                </div>
              </form>
            )}

            {/* Assets List */}
            {barterAssets.length === 0 ? (
              <div className="text-center p-12 rounded-3xl bg-slate-900/30 border border-slate-800/80 max-w-lg mx-auto space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                  <ArrowRightLeft className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white">هنوز دارایی برای تهاتر ثبت نکرده‌اید</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  اگر قصد دارید بخشی از مبلغ خرید مسکن را با خودرو، زمین یا آپارتمان دیگری تهاتر فرمایید، دارایی خود را ثبت کنید تا سیستم به صورت خودکار مالکان علاقه‌مند به تهاتر را به شما وصل کند.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddingAsset(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-l from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:scale-105 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>ثبت اولین دارایی تهاتر</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {barterAssets.map(asset => (
                  <div
                    key={asset.id}
                    className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4 relative group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {asset.category}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBarterAsset(asset.id)}
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                          title="حذف دارایی"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h4 className="text-sm font-bold text-white leading-snug">
                        {asset.title}
                      </h4>
                    </div>

                    <div className="space-y-1.5 pt-3 border-t border-slate-800/60 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">ارزش تخمینی:</span>
                        <span className="font-extrabold text-amber-400">{asset.valuationTomans}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">سند و مدارک:</span>
                        <span className="text-slate-300 font-medium">{asset.deedType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">نقدینگی:</span>
                        <span className="text-emerald-400 font-medium text-[11px]">{asset.cashDelta}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Neshasst Online Sessions */}
        {activeTab === "neshasst" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span>اتاق جلسات نشست و قرارداد آنلاین</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                جلسات رسمی هماهنگ‌شده با حضور مشاور ارشد، سرپرست قرارداد و طرف دوم معامله.
              </p>
            </div>

            {neshasstSessions.length === 0 ? (
              <div className="text-center p-12 rounded-3xl bg-slate-900/30 border border-slate-800/80 max-w-lg mx-auto space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                  <Calendar className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white">جلسه نشست فعالی ندارید</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  هنگامی که پس از بازدید از ملک، برای توافق نهایی قیمت و مفاد قرارداد زمان نشست تعیین فرمایید، اتاق قرارداد آنلاین با نظارت حقوقی در این بخش در دسترس شما خواهد بود.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {neshasstSessions.map(session => (
                  <div
                    key={session.id}
                    className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-5"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                          {session.status === "live" ? "در حال برگزاری (آنلاین)" : "تعیین شده"}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-white">
                          {session.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400">
                        {session.propertyAddress}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                        <span>زمان: {session.scheduledDate} ساعت {session.scheduledTime}</span>
                        <span>دپارتمان: {session.hostAgencyName}</span>
                        <span>کارشناس پرونده: {session.hostAgentName}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-l from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs shrink-0 shadow-md shadow-amber-500/20 transition-all hover:scale-105"
                    >
                      ورود به اتاق مذاکره آنلاین
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Account & Security Settings */}
        {activeTab === "settings" && (
          <div className="max-w-2xl space-y-6">
            <div className="rounded-3xl bg-slate-900/50 border border-slate-800 p-5 sm:p-7 space-y-6">
              <div>
                <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-400" />
                  <span>مشخصات هویتی و حساب کاربری</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  اطلاعات فردی ثبت‌شده در سامانه معاملات یه خونه.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">نام</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">نام خانوادگی</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-slate-400 mb-1">شماره تماس یا ایمیل احراز هویت</label>
                  <input
                    type="text"
                    disabled
                    value={baseUser?.contact || ""}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-400 text-xs sm:text-sm cursor-not-allowed font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    برای تغییر شماره همراه رسمی، با واحد پشتیبانی تماس حاصل فرمایید.
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleSaveCriteria}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>ذخیره تغییرات مشخصات</span>
                </button>

                <button
                  type="button"
                  onClick={() => logout()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>خروج از حساب</span>
                </button>
              </div>
            </div>
          </div>
        )}
          </>
        )}
      </main>
    </div>
  );
}
