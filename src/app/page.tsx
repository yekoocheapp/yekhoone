"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  initialProperties,
  Property,
  formatPersianNumber
} from "@/data/properties";
import {
  Search,
  MapPin,
  Building2,
  Home,
  ShieldCheck,
  Phone,
  Calculator,
  PlusCircle,
  Sparkles,
  BedDouble,
  Maximize2,
  Car,
  CheckCircle2,
  X,
  Compass,
  ArrowRightLeft,
  Building,
  ExternalLink,
  RotateCw,
  Cpu,
  Eye,
  Video,
  Layers,
  User,
  Heart,
  LogOut
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import AuthModal from "@/components/AuthModal";

export default function HomePage() {
  const {
    currentRole,
    baseUser,
    buyerProfile,
    sellerProfile,
    agentProfile,
    agencyProfile,
    isFavorite,
    toggleFavorite,
    logout
  } = useUser();
  const [properties, setProperties] = useState<Property[]>(initialProperties);

  // Sync with live Backend API & SQLite Database
  useEffect(() => {
    fetch("/api/properties")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.properties) && data.properties.length > 0) {
          setProperties(data.properties);
        }
      })
      .catch((err) => console.error("Properties API sync error:", err));
  }, []);
  const [dealType, setDealType] = useState<"all" | "rent" | "sale" | "barter" | "partnership">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("همه");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("همه");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyVirtualTour, setOnlyVirtualTour] = useState<boolean>(false);
  const [calculatorOpen, setCalculatorOpen] = useState<boolean>(false);
  const [submitModalOpen, setSubmitModalOpen] = useState<boolean>(false);
  const [contactModalProperty, setContactModalProperty] = useState<Property | null>(null);

  // Auth modal states
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authNotice, setAuthNotice] = useState<string | undefined>(undefined);

  // Rahn-Ejareh Calculator states
  const [calcDeposit, setCalcDeposit] = useState<number>(500); // 500 million
  const [calcRent, setCalcRent] = useState<number>(15);       // 15 million
  const [calcRate, setCalcRate] = useState<number>(3);        // 3% standard rate

  // Convert Rahn to full Rahn
  const fullRahnEquivalent = calcDeposit + (calcRent / (calcRate / 100));
  // Convert Rahn to full Rent (assuming 100M deposit minimum)
  const fullRentEquivalent = (fullRahnEquivalent - 100) * (calcRate / 100);

  const districts = ["همه", "سعادت‌آباد", "شهرک غرب", "پونک", "مرزداران", "نیاوران", "صادقیه", "تهرانپارس", "پاسداران", "یوسف‌آباد", "لواسانات"];
  const categories = ["همه", "آپارتمان", "ویلایی", "زمین", "باغ", "کلنگی"];

  const filteredProperties = properties.filter((item) => {
    if (dealType === "barter") {
      if (!item.isBarter && item.type !== "barter") return false;
    } else if (dealType === "partnership") {
      if (!item.isPartnership && item.type !== "partnership") return false;
    } else if (dealType !== "all" && item.type !== dealType) {
      return false;
    }
    if (selectedCategory !== "همه" && !item.propertyType.includes(selectedCategory)) return false;
    if (selectedDistrict !== "همه" && item.district !== selectedDistrict) return false;
    if (onlyVirtualTour && !item.hasVirtualTour) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q) ||
        item.address.toLowerCase().includes(q) ||
        (item.barterTerms?.targetAssetLabel && item.barterTerms.targetAssetLabel.toLowerCase().includes(q)) ||
        (item.partnershipTerms?.builderReputationNotes && item.partnershipTerms.builderReputationNotes.toLowerCase().includes(q)) ||
        (item.partnershipTerms?.permitStatus && item.partnershipTerms.permitStatus.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* ==================== HEADER ==================== */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 sm:py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 relative min-h-[52px]">
          {/* User Sign-in / Profile Pill & Action CTA (Right side in RTL) */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 z-10">
            {/* Sign in / Profile Pill */}
            {currentRole === "guest" ? (
              <button
                type="button"
                onClick={() => {
                  setAuthNotice(undefined);
                  setAuthModalOpen(true);
                }}
                className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-all shadow-sm group"
                title="ورود و ثبت‌نام در سامانه"
              >
                <User className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">ورود / ثبت‌نام</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/40 text-xs text-slate-200 hover:text-white transition-all shadow-sm group"
                  title="مشاهده پروفایل کاربری"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold max-w-[120px] truncate text-white">
                    {baseUser?.fullName || "کاربر گرامی"}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-bold">
                    {currentRole === "buyer"
                      ? "متقاضی"
                      : currentRole === "seller"
                      ? "مالک"
                      : currentRole === "agent"
                      ? "مشاور"
                      : "آژانس"}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800/60 text-slate-400 hover:text-rose-400 transition-all shadow-sm"
                  title="خروج از حساب کاربری"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Register Property Button */}
            <button
              onClick={() => {
                if (currentRole === "guest") {
                  setAuthNotice("برای ثبت فایل یا ملک جدید در سامانه یه خونه، لطفاً ابتدا ثبت‌نام فرمایید.");
                  setAuthModalOpen(true);
                
                } else {
                  setSubmitModalOpen(true);
                }
              }}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-l from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>ثبت ملک</span>
            </button>
          </div>

          {/* Middle: Brand Name [یه خونه] & Introduction in One Single Line */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center whitespace-nowrap pointer-events-auto">
            <Link href="/" className="group inline-flex items-center gap-2 sm:gap-3 text-lg sm:text-xl md:text-2xl font-bold text-slate-100 select-none">
              <span className="text-amber-400 font-black inline-block drop-shadow-sm">
                یه خونه
              </span>
              <span className="hidden sm:inline-block text-slate-600 font-light">
                |
              </span>
              <span className="hidden sm:inline-block text-slate-100 group-hover:text-amber-300 transition-colors">
                سامانه هوشمند معاملات مسکن تهران
              </span>
            </Link>
          </div>

          {/* Left side in RTL: Standalone Logo Only */}
          <Link href="/" className="group shrink-0 z-10" title="صفحه اصلی یه خونه">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden shadow-lg shadow-amber-500/10 border border-amber-500/30 group-hover:scale-105 transition-transform">
              <Image
                src="/logo.jpg"
                alt="لوگو یه خونه"
                fill
                className="object-cover"
                priority
              />
            </div>
          </Link>
        </div>
      </header>

      {/* ==================== HERO SECTION (DUAL-COLUMN ARCHITECTURAL CONCEPT 01 & 02) ==================== */}
      <section className="relative pt-8 pb-10 px-4 lg:px-8 overflow-hidden bg-slate-950 border-b border-slate-800/60">
        {/* Vintage Tehran Night Hero Background Artwork */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src="/tehran-night-hero.jpg"
            alt="نمای هنری شبانه تهران با برج میلاد و رشته‌کوه البرز"
            fill
            className="object-cover object-top md:object-center opacity-80 scale-100"
            priority
          />
          {/* Subtle atmospheric vignette that keeps the artwork vivid and clearly visible */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/20 to-slate-950" />
          <div className="absolute inset-0 bg-slate-950/30" />
        </div>

        <div className="absolute top-1/4 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* RIGHT COLUMN (7 cols on lg): Hero Headline, Unified Search Capsule & Trust Proof */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3.5 w-fit shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>پلتفرم یکپارچه معاملات مسکن، تهاتر و مشارکت در ساخت پایتخت</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-3 drop-shadow-md">
                فراتر از یک جست‌وجو،
                <span className="block mt-1 bg-gradient-to-l from-amber-400 via-amber-200 to-orange-400 bg-clip-text text-transparent">
                  یک نقشه از فرصت‌ها
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed mb-5 max-w-2xl drop-shadow-sm font-medium">
                دسترسی بی‌واسطه به فایل‌های کارشناسی‌شده تهران با قابلیت کاوش پلاک‌به‌پلاک روی نقشه سه‌بعدی، تور ویدیویی ۳۶۰ درجه، بازار تهاتر و قراردادهای مشارکت در ساخت.
              </p>

              {/* Unified Search Capsule */}
              <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-2xl shadow-black/80 backdrop-blur-xl">
                {/* Deal Tabs: All, Sale, Rent, Barter, Partnership */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3 pb-3 border-b border-slate-800/80 text-xs font-semibold">
                  <button
                    onClick={() => setDealType("all")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      dealType === "all"
                        ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    همه فایل‌ها
                  </button>
                  <button
                    onClick={() => setDealType("sale")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      dealType === "sale"
                        ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    خرید و فروش
                  </button>
                  <button
                    onClick={() => setDealType("rent")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      dealType === "rent"
                        ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    رهن و اجاره
                  </button>
                  <button
                    onClick={() => setDealType("barter")}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      dealType === "barter"
                        ? "bg-sky-500 text-slate-950 font-extrabold shadow-md shadow-sky-500/20"
                        : "text-sky-400 hover:text-sky-300 hover:bg-sky-950/30 border border-sky-500/30"
                    }`}
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>تهاتر و معاوضه</span>
                  </button>
                  <button
                    onClick={() => setDealType("partnership")}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      dealType === "partnership"
                        ? "bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/20"
                        : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30 border border-emerald-500/30"
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>مشارکت در ساخت</span>
                  </button>
                </div>

                {/* Category Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 border-b border-slate-800/60 scrollbar-none text-xs">
                  <span className="text-slate-400 font-semibold pl-1 whitespace-nowrap">نوع ملک:</span>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap text-xs ${
                        selectedCategory === cat
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold shadow-sm"
                          : "bg-slate-950/50 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700"
                      }`}
                    >
                      {cat === "همه" ? "همه دسته‌ها" : cat === "باغ" ? "باغ و باغچه" : cat}
                    </button>
                  ))}
                </div>

                {/* Inputs Row: District select + Keyword search + Action buttons */}
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                  <div className="sm:w-44 shrink-0">
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full h-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                    >
                      <option value="همه">همه محله‌های تهران</option>
                      {districts.filter(d => d !== "همه").map((d) => (
                        <option key={d} value={d}>محله {d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="نام خیابان، پلاک، محله، شرایط تهاتر یا مشارکت..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setCalculatorOpen(true)}
                      title="محاسبه‌گر تبدیل رهن و اجاره"
                      className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                    >
                      <Calculator className="w-3.5 h-3.5 text-amber-400" />
                      <span className="hidden sm:inline">تبدیل رهن</span>
                    </button>

                    <button
                      onClick={() => setOnlyVirtualTour(!onlyVirtualTour)}
                      title="فیلتر فقط فایل‌های دارای تور ۳۶۰ درجه"
                      className={`flex items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all text-xs font-semibold ${
                        onlyVirtualTour
                          ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 shadow-sm"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="hidden sm:inline">تور ۳۶۰°</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Trust Stats Row Under Search Capsule */}
              <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-800/50 text-center">
                <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/40">
                  <div className="text-sm sm:text-base font-extrabold text-white">+۵,۲۰۰</div>
                  <div className="text-[10px] sm:text-xs text-slate-400">فایل کارشناسی‌شده فعال</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/40">
                  <div className="text-sm sm:text-base font-extrabold text-amber-400">+۳,۴۰۰</div>
                  <div className="text-[10px] sm:text-xs text-slate-400">سرمایه‌گذار و متقاضی مسکن</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/40">
                  <div className="text-sm sm:text-base font-extrabold text-emerald-400">+۱,۲۵۰</div>
                  <div className="text-[10px] sm:text-xs text-slate-400">نشست و معامله موفق ملکی</div>
                </div>
              </div>
            </div>

            {/* LEFT COLUMN (5 cols on lg): Interactive 3D Atlas Map Widget */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-amber-500/30 p-4 sm:p-5 shadow-2xl backdrop-blur-xl overflow-hidden group">
                {/* Subtle Ambient Glow */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Card Header */}
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white">اطلس زنده املاک تهران</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-extrabold border border-amber-500/30">
                    کاوش پلاک‌به‌پلاک
                  </span>
                </div>

                {/* Simulated Map Viewport */}
                <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/90 flex flex-col justify-between p-3">
                  {/* Grid Lines Pattern */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

                  {/* Top Badges in Viewport */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80 text-[10px] text-slate-300 backdrop-blur-md">
                      <Compass className="w-3 h-3 text-amber-400" />
                      <span>موقعیت جغرافیایی زنده تهران</span>
                    </div>
                    <div className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      پوشش ۲۲ منطقه
                    </div>
                  </div>

                  {/* Interactive-looking Hotspot Pins */}
                  <div className="relative z-10 space-y-2">
                    {/* Pin 1: Saadat Abad Partnership highlight */}
                    <div className="flex items-center gap-2 bg-slate-900/95 border border-emerald-500/40 p-2 rounded-xl shadow-lg backdrop-blur-md">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs">
                        🏗️
                      </div>
                      <div className="flex-1 min-w-0 text-right">
                        <div className="text-[11px] font-bold text-white truncate">سعادت‌آباد • کلنگی ۶۰۰ متری آماده مشارکت</div>
                        <div className="text-[10px] text-emerald-400 font-semibold">سهم ۶۰٪ مالک / ۱۵ میلیارد بلاعوض</div>
                      </div>
                    </div>

                    {/* Pin 2: Niavaran Luxury Villa */}
                    <div className="flex items-center gap-2 bg-slate-900/90 border border-amber-500/30 p-2 rounded-xl shadow-lg backdrop-blur-md">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 font-bold text-xs">
                        🏡
                      </div>
                      <div className="flex-1 min-w-0 text-right">
                        <div className="text-[11px] font-bold text-white truncate">نیاوران • ویلای تریپلکس ۸۵۰ متری</div>
                        <div className="text-[10px] text-amber-300">قیمت کارشناسی: ۱۷۰ میلیارد تومان</div>
                      </div>
                    </div>

                    {/* Pin 3: Shahrak Gharb Barter */}
                    <div className="flex items-center gap-2 bg-slate-900/80 border border-sky-500/30 p-2 rounded-xl shadow-lg backdrop-blur-md">
                      <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 font-bold text-xs">
                        🔄
                      </div>
                      <div className="flex-1 min-w-0 text-right">
                        <div className="text-[11px] font-bold text-white truncate">شهرک غرب • آپارتمان ۱۶۵ متری</div>
                        <div className="text-[10px] text-sky-300">آماده معاوضه با ویلایی یا کلنگی</div>
                      </div>
                    </div>
                  </div>

                  {/* Viewport Footer */}
                  <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                    <span>دید هوایی و لایه‌های نقشه</span>
                    <span className="text-amber-400 font-semibold">پلاک‌های آماده معامله</span>
                  </div>
                </div>

                {/* Direct CTA into /map */}
                <Link
                  href="/map"
                  className="mt-3.5 w-full py-3 rounded-2xl bg-gradient-to-l from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group"
                >
                  <Compass className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
                  <span>ورود به اطلس نقشه هوشمند تهران</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== DISTRICT QUICK TABS ==================== */}
      <section className="px-4 lg:px-8 py-3.5 border-b border-slate-800/80 bg-slate-950/60">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 whitespace-nowrap pl-2 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            محله‌های پرتقاضا:
          </span>
          {districts.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDistrict(d)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDistrict === d
                  ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                  : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </section>

      {/* ==================== PROPERTY FEED ==================== */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10 flex-1 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              فایل‌های مسکن در {selectedDistrict === "همه" ? "کل تهران" : selectedDistrict}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              نمایش {filteredProperties.length} فایل تایید شده با قیمت کارشناسی (روی هر کارت کلیک کنید تا وارد صفحه کامل ملک شوید)
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>مرتب‌سازی: جدیدترین‌ها</span>
          </div>
        </div>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop) => (
            <div
              key={prop.id}
              className="bg-slate-900/70 border border-slate-800/80 hover:border-amber-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-slate-950/90 flex flex-col group relative"
            >
              {/* Photo Box & Link to Detail */}
              <Link href={`/property/${prop.id}`} className="block relative h-56 w-full overflow-hidden bg-slate-950">
                <Image
                  src={prop.images[0]}
                  alt={prop.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                {/* Deal Tag & Virtual Tour Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 flex-wrap">
                  {prop.isPartnership || prop.type === "partnership" ? (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500 text-slate-950 shadow flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      <span>مشارکت در ساخت</span>
                    </span>
                  ) : prop.isBarter || prop.type === "barter" ? (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-500 text-slate-950 shadow flex items-center gap-1">
                      <ArrowRightLeft className="w-3 h-3" />
                      <span>تهاتر</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 shadow">
                      {prop.type === "rent" ? "رهن و اجاره" : "فروش"}
                    </span>
                  )}

                  <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-slate-950/70 backdrop-blur-md text-white border border-white/10">
                    {prop.propertyType}
                  </span>
                  <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-slate-950/70 backdrop-blur-md text-slate-300 border border-white/10">
                    {prop.district}
                  </span>
                  {prop.hasVirtualTour && (
                    <span className="px-2 py-1 rounded-lg text-xs font-bold bg-gradient-to-l from-indigo-500 to-purple-600 text-white shadow-lg flex items-center gap-1 border border-indigo-400/40">
                      <Eye className="w-3 h-3 text-amber-300" />
                      <span>تور ۳۶۰°</span>
                    </span>
                  )}
                </div>

                {/* Verified Agency Badge & Algorithmic Bump indicator */}
                <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] font-medium text-emerald-300">
                      {prop.agencyName}
                    </span>
                  </div>

                  {prop.lastAlgorithmicBump && (
                    <div className="flex items-center gap-1 bg-slate-950/85 backdrop-blur-md px-2 py-1 rounded-lg border border-indigo-500/30 text-[10px] text-indigo-300">
                      <RotateCw className="w-2.5 h-2.5 text-indigo-400" />
                      <span>نردبان: {prop.lastAlgorithmicBump}</span>
                    </div>
                  )}
                </div>
              </Link>

              {/* Card Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <Link href={`/property/${prop.id}`} className="block">
                    <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-400 transition-colors line-clamp-1 mb-2">
                      {prop.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="line-clamp-1">{prop.address}</span>
                  </p>

                  {/* Specs Pill row (Dynamically tailored to Property Category) */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-800/80 text-xs text-slate-300 mb-3">
                    <div className="flex items-center justify-center gap-1.5 bg-slate-950/40 py-1.5 rounded-lg">
                      <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>{formatPersianNumber(prop.meters)} متر</span>
                    </div>

                    {prop.propertyType === "زمین" || prop.propertyType === "کلنگی" ? (
                      <>
                        <div className="flex items-center justify-center gap-1.5 bg-slate-950/40 py-1.5 rounded-lg">
                          <Compass className="w-3.5 h-3.5 text-amber-400" />
                          <span>گذر {formatPersianNumber(prop.streetWidth || 12)}م</span>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 bg-slate-950/40 py-1.5 rounded-lg">
                          <Building2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>بر {formatPersianNumber(prop.frontageMeters || 15)}م</span>
                        </div>
                      </>
                    ) : prop.propertyType === "باغ" ? (
                      <>
                        <div className="flex items-center justify-center gap-1.5 bg-slate-950/40 py-1.5 rounded-lg">
                          <Home className="w-3.5 h-3.5 text-amber-400" />
                          <span>بنا {formatPersianNumber(prop.buildingArea || 0)}م</span>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 bg-slate-950/40 py-1.5 rounded-lg">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-[10px]">حق‌آبه ثبتی</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-center gap-1.5 bg-slate-950/40 py-1.5 rounded-lg">
                          <BedDouble className="w-3.5 h-3.5 text-amber-400" />
                          <span>{formatPersianNumber(prop.bedrooms)} خواب</span>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 bg-slate-950/40 py-1.5 rounded-lg">
                          <Car className="w-3.5 h-3.5 text-amber-400" />
                          <span>{prop.hasParking ? "پارکینگ" : "بی‌پارکینگ"}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Structured Partnership Terms Box */}
                  {(prop.isPartnership || prop.type === "partnership") && prop.partnershipTerms && (
                    <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 mb-3 text-xs">
                      <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 mb-1">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          <span>شرایط مشارکت در ساخت:</span>
                        </span>
                        <span className="text-amber-300 font-extrabold">
                          {formatPersianNumber(prop.partnershipTerms.ownerSharePercent)}٪ مالک / {formatPersianNumber(prop.partnershipTerms.builderSharePercent)}٪ سازنده
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-300">
                        <span>مبلغ بلاعوض پیشنهادی:</span>
                        <span className="text-white font-bold">
                          {prop.partnershipTerms.belaAvazTomans && prop.partnershipTerms.belaAvazTomans > 0
                            ? `${formatPersianNumber(prop.partnershipTerms.belaAvazTomans)} تومان`
                            : "بدون بلاعوض"}
                        </span>
                      </div>
                      {prop.partnershipTerms.builderReputationNotes && (
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                          شرط سازنده: {prop.partnershipTerms.builderReputationNotes}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Structured Barter Terms Box */}
                  {prop.isBarter && prop.barterTerms && (
                    <div className="p-2.5 rounded-xl bg-sky-950/30 border border-sky-500/30 mb-3 text-xs">
                      <div className="flex items-center justify-between text-[11px] font-bold text-sky-400 mb-1">
                        <span className="flex items-center gap-1">
                          <ArrowRightLeft className="w-3 h-3" />
                          <span>شرایط تهاتر:</span>
                        </span>
                        <span className="text-amber-400">{prop.propertyType}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-2">
                        {prop.barterTerms.targetAssetLabel}
                      </p>
                    </div>
                  )}
                </div>

                {/* Price & Action */}
                <div>
                  {prop.type === "rent" ? (
                    <div className="space-y-1 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">ودیعه (رهن):</span>
                        <span className="font-bold text-white text-sm">
                          {formatPersianNumber(prop.deposit)} تومان
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">اجاره ماهانه:</span>
                        <span className="font-extrabold text-amber-400 text-sm">
                          {prop.rent === 0 ? "رهن کامل" : `${formatPersianNumber(prop.rent)} تومان`}
                        </span>
                      </div>
                    </div>
                  ) : prop.type === "barter" ? (
                    <div className="space-y-1 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">ارزش کارشناسی تهاتر:</span>
                        <span className="font-extrabold text-sky-400 text-base">
                          {formatPersianNumber(prop.totalPrice || 0)} تومان
                        </span>
                      </div>
                      {prop.barterTerms?.cashDeltaTomans ? (
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>سقف سرک نقدی:</span>
                          <span className="text-amber-300 font-semibold">تا {formatPersianNumber(prop.barterTerms.cashDeltaTomans)} تومان</span>
                        </div>
                      ) : null}
                    </div>
                  ) : prop.type === "partnership" || prop.isPartnership ? (
                    <div className="space-y-1 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">سهم طرفین مشارکت:</span>
                        <span className="font-extrabold text-emerald-400 text-sm">
                          {formatPersianNumber(prop.partnershipTerms?.ownerSharePercent || 60)}٪ مالک / {formatPersianNumber(prop.partnershipTerms?.builderSharePercent || 40)}٪ سازنده
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">بلاعوض پیشنهادی:</span>
                        <span className="font-bold text-amber-400 text-sm">
                          {prop.partnershipTerms?.belaAvazTomans
                            ? `${formatPersianNumber(prop.partnershipTerms.belaAvazTomans)} تومان`
                            : "بدون بلاعوض"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-slate-400">قیمت کل:</span>
                      <span className="font-extrabold text-amber-400 text-base">
                        {formatPersianNumber(prop.totalPrice || 0)} تومان
                      </span>
                    </div>
                  )}

                  {/* 3D Map Shortcut */}
                  <Link
                    href={`/map?propertyId=${prop.id}`}
                    className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-400 font-bold text-[11px] border border-amber-500/20 mb-2.5 transition-all hover:border-amber-500/50"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>نمایش پلاک این ساختمان در نقشه ۳ بعدی</span>
                  </Link>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setContactModalProperty(prop)}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors border border-slate-700"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>تماس مشاور</span>
                    </button>
                    <Link
                      href={`/property/${prop.id}`}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all"
                    >
                      <span>مشاهده کامل</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ==================== AGENCY & AGENT PARTNERSHIP SECTION ==================== */}
        <section className="mt-16 p-6 sm:p-10 rounded-3xl bg-gradient-to-l from-indigo-950/60 via-slate-900 to-slate-950 border border-amber-500/30 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold mb-4">
              <Building className="w-4 h-4" />
              زیرساخت اختصاصی دفاتر و آژانس‌های املاک تهران
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              مدیریت حرفه‌ای فایلینگ، نقشه هوشمند تهران و اتاق نشست آنلاین
            </h3>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              سامانه «یه خونه» بستر یکپارچه و مدرنی را برای دفاتر معاملات ملکی فراهم ساخته است. انتشار نامحدود فایل‌ها، نمایش موقعیت دقیق ملک بر روی نقشه هوشمند تهران، الگوریتم توزیع عادلانه نتایج، و امکان برگزاری نشست‌های ۴ نفره مجازی قرارداد میان متقاضی مسکن، مالک، مشاور و سرپرست آژانس بدون نیاز به تردد شهری.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/agency/dashboard"
                className="px-6 py-3 rounded-xl bg-gradient-to-l from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105 flex items-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                <span>ورود به پنل آژانس و مدیریت همکاران</span>
              </Link>
              <button
                onClick={() => setSubmitModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700 transition-colors"
              >
                + ثبت مستقیم فایل ملکی
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-slate-900 bg-slate-950 px-4 lg:px-8 py-10 mt-16 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-amber-500/30">
              <Image src="/logo.jpg" alt="لوگو" fill className="object-cover" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">یه خونه (YeKhoone)</span>
              <p className="text-[11px] text-slate-500">سامانه معاملات مسکن و نقشه هوشمند تهران</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <Link href="/" className="hover:text-white">صفحه اصلی</Link>
            <Link href="/agency/dashboard" className="hover:text-white">پنل آژانس‌ها</Link>
            <span>شرایط و قوانین</span>
            <span>پشتیبانی</span>
          </div>

          <div className="text-slate-500">
            © ۱۴۰۵ کلیه حقوق برای پلتفرم «یه خونه» (yekhoone.ir) محفوظ است.
          </div>
        </div>
      </footer>

      {/* ==================== MODAL 1: RAHN & EJAREH CALCULATOR ==================== */}
      {calculatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl animate-in fade-in zoom-in-95">
            <button
              onClick={() => setCalculatorOpen(false)}
              className="absolute top-5 left-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">محاسبه‌گر هوشمند تبدیل رهن و اجاره</h3>
                <p className="text-xs text-slate-400">بر مبنای فرمول عرف بازار مسکن ایران (۳ درصد)</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Deposit Slider */}
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-400">ودیعه نقدی (رهن فعلی):</span>
                  <span className="font-bold text-white text-sm">{formatPersianNumber(calcDeposit)} میلیون تومان</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="3000"
                  step="50"
                  value={calcDeposit}
                  onChange={(e) => setCalcDeposit(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Rent Slider */}
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-400">اجاره ماهانه فعلی:</span>
                  <span className="font-bold text-amber-400 text-sm">{formatPersianNumber(calcRent)} میلیون تومان</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="150"
                  step="1"
                  value={calcRent}
                  onChange={(e) => setCalcRent(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-right">
                  <span className="text-xs text-amber-400 font-semibold block mb-1">معادل رهن کامل:</span>
                  <span className="text-lg font-extrabold text-white">
                    {formatPersianNumber(Math.round(fullRahnEquivalent))}
                  </span>
                  <span className="text-[11px] text-slate-400 mr-1">میلیون تومان</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-right">
                  <span className="text-xs text-slate-300 font-semibold block mb-1">معادل اجاره (با ۱۰۰م ودیعه):</span>
                  <span className="text-lg font-extrabold text-amber-400">
                    {formatPersianNumber(Math.max(0, Math.round(fullRentEquivalent)))}
                  </span>
                  <span className="text-[11px] text-slate-400 mr-1">میلیون تومان</span>
                </div>
              </div>

              <button
                onClick={() => setCalculatorOpen(false)}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors"
              >
                بستن و ادامه جستجو
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 2: FREE PROPERTY SUBMISSION ==================== */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSubmitModalOpen(false)}
              className="absolute top-5 left-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">ثبت مستقیم فایل ملکی در سامانه</h3>
                <p className="text-xs text-slate-400">انتشار روی نقشه هوشمند تهران و دسترسی مستقیم متقاضیان</p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("فایل شما با موفقیت در سامانه یه خونه ثبت و منتشر شد.");
                setSubmitModalOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">عنوان آگهی</label>
                <input
                  required
                  type="text"
                  placeholder="مثال: آپارتمان ۱۱۰ متری نوساز، علامه شمالی"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">محله در تهران</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500">
                    {districts.filter(d => d !== "همه").map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">نوع معامله</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500">
                    <option value="rent">رهن و اجاره</option>
                    <option value="sale">خرید و فروش</option>
                    <option value="barter">تهاتر و معاوضه</option>
                    <option value="partnership">مشارکت در ساخت</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">متراژ (متر مربع)</label>
                  <input
                    required
                    type="number"
                    placeholder="مثال: ۹۵"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">تعداد خواب</label>
                  <input
                    required
                    type="number"
                    placeholder="مثال: ۲"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">مبلغ ودیعه / ارزش کل (تومان)</label>
                  <input
                    type="text"
                    placeholder="مثال: ۵۰۰,۰۰۰,۰۰۰"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">اجاره ماهانه / بلاعوض (تومان)</label>
                  <input
                    type="text"
                    placeholder="مثال: ۲۰,۰۰۰,۰۰۰"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">نام آژانس املاک یا مشاور</label>
                <input
                  required
                  type="text"
                  placeholder="مثال: دپارتمان املاک سرمایه‌گذاری سعادت‌آباد - مشاور رسمی"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">شماره تماس مستقیم مشاور</label>
                <input
                  required
                  type="tel"
                  placeholder="۰۹۱۲..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-left"
                  dir="ltr"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-l from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
              >
                ثبت نهایی و انتشار فایل در «یه خونه»
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL 3: AGENT CONTACT DETAILS ==================== */}
      {contactModalProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl animate-in fade-in zoom-in-95 text-center">
            <button
              onClick={() => setContactModalProperty(null)}
              className="absolute top-5 left-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 mx-auto flex items-center justify-center text-emerald-400 mb-4">
              <Phone className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              اطلاعات مشاور املاک تایید شده
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {contactModalProperty.agencyName}
            </p>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 mb-6 text-right space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">نام مشاور:</span>
                <span className="font-bold text-white">{contactModalProperty.agentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">فایل مورد نظر:</span>
                <span className="font-semibold text-amber-400 line-clamp-1">{contactModalProperty.title}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="text-slate-400">شماره مستقیم:</span>
                <span className="font-extrabold text-base text-emerald-400 tracking-wider" dir="ltr">
                  {contactModalProperty.agentPhone}
                </span>
              </div>
            </div>

            <a
              href={`tel:${contactModalProperty.agentPhone}`}
              className="block w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all mb-2"
            >
              برقراری تماس مستقیم
            </a>

            <button
              onClick={() => setContactModalProperty(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              بستن
            </button>
          </div>
        </div>
      )}

      {/* ==================== AUTHENTICATION MODAL ==================== */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        notice={authNotice}
      />
    </div>
  );
}
