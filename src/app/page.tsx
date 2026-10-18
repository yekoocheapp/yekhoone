"use client";

import React, { useState } from "react";
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
  Heart
} from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function HomePage() {
  const { currentRole, isFavorite, toggleFavorite } = useUser();
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [dealType, setDealType] = useState<"all" | "rent" | "sale">("rent");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("همه");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyVirtualTour, setOnlyVirtualTour] = useState<boolean>(false);
  const [calculatorOpen, setCalculatorOpen] = useState<boolean>(false);
  const [submitModalOpen, setSubmitModalOpen] = useState<boolean>(false);
  const [contactModalProperty, setContactModalProperty] = useState<Property | null>(null);

  // Rahn-Ejareh Calculator states
  const [calcDeposit, setCalcDeposit] = useState<number>(500); // 500 million
  const [calcRent, setCalcRent] = useState<number>(15);       // 15 million
  const [calcRate, setCalcRate] = useState<number>(3);        // 3% standard rate

  // Convert Rahn to full Rahn
  const fullRahnEquivalent = calcDeposit + (calcRent / (calcRate / 100));
  // Convert Rahn to full Rent (assuming 100M deposit minimum)
  const fullRentEquivalent = (fullRahnEquivalent - 100) * (calcRate / 100);

  const districts = ["همه", "سعادت‌آباد", "شهرک غرب", "پونک", "مرزداران", "نیاوران", "صادقیه", "تهرانپارس", "پاسداران", "یوسف‌آباد"];

  const filteredProperties = properties.filter((item) => {
    if (dealType !== "all" && item.type !== dealType) return false;
    if (selectedDistrict !== "همه" && item.district !== selectedDistrict) return false;
    if (onlyVirtualTour && !item.hasVirtualTour) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q) ||
        item.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* ==================== HEADER ==================== */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* User Sign-in / Profile Pill & Action CTA (Swapped to Right side) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Sign in / Profile Pill */}
            <Link
              href="/profile"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-all shadow-sm"
              title="پروفایل کاربری و ورود"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium">
                {currentRole === "guest" ? "ورود / ثبت‌نام" : (
                  currentRole === "buyer" ? "متقاضی" :
                  currentRole === "seller" ? "مالک" :
                  currentRole === "agent" ? "مشاور" : "آژانس"
                )}
              </span>
            </Link>

            {/* Register Property Button */}
            <button
              onClick={() => setSubmitModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-l from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>ثبت ملک</span>
            </button>
          </div>

          {/* Logo & Brand Identity (Swapped to Left side - Only Logo and Name) */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <span className="text-xl font-black tracking-tight bg-gradient-to-l from-amber-400 via-amber-300 to-white bg-clip-text text-transparent">
              یه خونه
            </span>
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-amber-500/10 border border-amber-500/30 group-hover:scale-105 transition-transform">
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

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative pt-12 pb-14 px-4 lg:px-8 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(245,158,11,0.06),transparent_60%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Mission Tag - Professional, Authoritative */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/25 text-amber-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>سامانه هوشمند املاک و معاملات بدون واسطه مسکن در تهران</span>
          </div>

          {/* Main Title - Dignified, Prestigious */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight mb-4">
            جستجوی مطمئن مسکن،
            <br className="hidden sm:inline" />{" "}
            <span className="bg-gradient-to-l from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
              روی نقشه هوشمند تهران
            </span>
          </h1>

          <p className="text-slate-300/90 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            دسترسی مستقیم به فایل‌های معتبر ملکی با لوکیشن دقیق، تور ویدیویی ۳۶۰ درجه و اتاق نشست آنلاین قرارداد میان خریدار، فروشنده و سرپرست آژانس.
          </p>

          {/* Search Capsule / Command Center */}
          <div className="bg-slate-900/90 border border-slate-800/90 p-3 sm:p-4 rounded-2xl shadow-2xl shadow-black/60 backdrop-blur-xl">
            {/* Top Row: Deal Type Selector + Virtual Tour Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800/70 text-xs font-semibold">
              <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800/60">
                <button
                  onClick={() => setDealType("rent")}
                  className={`px-3.5 py-1.5 rounded-lg transition-all ${
                    dealType === "rent"
                      ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  رهن و اجاره
                </button>
                <button
                  onClick={() => setDealType("sale")}
                  className={`px-3.5 py-1.5 rounded-lg transition-all ${
                    dealType === "sale"
                      ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  خرید و فروش
                </button>
                <button
                  onClick={() => setDealType("all")}
                  className={`px-3.5 py-1.5 rounded-lg transition-all ${
                    dealType === "all"
                      ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  همه فایل‌ها
                </button>
              </div>

              {/* 360 Virtual Tour Filter Pill */}
              <button
                onClick={() => setOnlyVirtualTour(!onlyVirtualTour)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all text-xs ${
                  onlyVirtualTour
                    ? "bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/50 shadow-sm"
                    : "bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                <span>فقط واحدهای با تور ویدیویی</span>
                {onlyVirtualTour && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
              </button>
            </div>

            {/* Main Input Row: Neighborhood Selector + Keyword Search */}
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="sm:w-48 shrink-0">
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full h-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="همه">همه محله‌های تهران</option>
                  {districts.filter(d => d !== "همه").map((d) => (
                    <option key={d} value={d}>محله {d}</option>
                  ))}
                </select>
              </div>

              <div className="relative flex-1">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی عنوان، خیابان یا مشخصات ملک..."
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <button
                onClick={() => setCalculatorOpen(true)}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs sm:text-sm font-medium border border-slate-700/60 transition-colors shrink-0"
              >
                <ArrowRightLeft className="w-4 h-4 text-amber-400" />
                <span>تبدیل رهن</span>
              </button>
            </div>
          </div>

          {/* Quick Value Pillars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/70 flex items-center gap-2.5 text-right">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">نقشه هوشمند تهران</div>
                <div className="text-[10px] text-slate-400">لوکیشن دقیق پلاک‌به‌پلاک</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/70 flex items-center gap-2.5 text-right">
              <Eye className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">تور ویدیویی املاک</div>
                <div className="text-[10px] text-slate-400">بازدید پیش از حضور</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/70 flex items-center gap-2.5 text-right">
              <Video className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">نشست آنلاین قرارداد</div>
                <div className="text-[10px] text-slate-400">مذاکره ۴ نفره مجازی</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/70 flex items-center gap-2.5 text-right">
              <Building2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">مشاوران رسمی</div>
                <div className="text-[10px] text-slate-400">ارتباط مستقیم و مطمئن</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SMART TEHRAN MAP HERO BANNER ==================== */}
      <section className="px-4 lg:px-8 -mt-6 mb-4 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-r from-amber-500/10 via-indigo-950/40 to-slate-900 border border-amber-500/30 p-5 sm:p-6 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 shrink-0">
                <Layers className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/30">
                    سامانه نقشه یکپارچه
                  </span>
                  <span className="text-xs text-slate-400">جستجوی پلاک‌به‌پلاک</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                  نقشه هوشمند تهران (پلاک‌به‌پلاک)
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                  روی هر کوچه یا ساختمانی در تهران کلیک کنید؛ واحدهای آماده برای رهن، اجاره و خرید، متراژ، قیمت و تور ویدیویی را در لحظه مشاهده کنید.
                </p>
              </div>
            </div>

            <Link
              href="/map"
              className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2 shrink-0 group"
            >
              <span>ورود به نقشه هوشمند تهران</span>
              <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== DISTRICT QUICK TABS ==================== */}
      <section className="px-4 lg:px-8 py-4 border-y border-slate-800/80 bg-slate-950/60">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
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
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 shadow">
                    {prop.type === "rent" ? "رهن و اجاره" : "فروش"}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-950/70 backdrop-blur-md text-white border border-white/10">
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

                  {/* Specs Pill row */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-800/80 text-xs text-slate-300 mb-4">
                    <div className="flex items-center justify-center gap-1.5 bg-slate-950/40 py-1.5 rounded-lg">
                      <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>{formatPersianNumber(prop.meters)} متر</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 bg-slate-950/40 py-1.5 rounded-lg">
                      <BedDouble className="w-3.5 h-3.5 text-amber-400" />
                      <span>{formatPersianNumber(prop.bedrooms)} خواب</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 bg-slate-950/40 py-1.5 rounded-lg">
                      <Car className="w-3.5 h-3.5 text-amber-400" />
                      <span>{prop.hasParking ? "پارکینگ" : "بی‌پارکینگ"}</span>
                    </div>
                  </div>
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
              سامانه «یه خونه» بستر یکپارچه و مدرنی را برای دفاتر معاملات ملکی فراهم ساخته است. انتشار نامحدود فایل‌ها، نمایش موقعیت دقیق ملک بر روی نقشه هوشمند تهران، الگوریتم توزیع عادلانه نتایج، و امکان برگزاری نشست‌های ۴ نفره مجازی قرارداد میان خریدار، فروشنده، مشاور و سرپرست آژانس بدون نیاز به تردد شهری.
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
                  min="0"
                  max="100"
                  step="1"
                  value={calcRent}
                  onChange={(e) => setCalcRent(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Conversion rate */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">نرخ تبدیل ماهانه:</span>
                <span className="font-bold text-white">{calcRate} درصد (هر ۱۰۰ میلیون رهن = ۳ میلیون اجاره)</span>
              </div>

              {/* Results Cards */}
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
                  <label className="block text-slate-300 font-semibold mb-1.5">مبلغ ودیعه (تومان)</label>
                  <input
                    type="text"
                    placeholder="مثال: ۵۰۰,۰۰۰,۰۰۰"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">اجاره ماهانه (تومان)</label>
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
                  placeholder="مثال: املاک نوین سعادت‌آباد - مشاور مهرداد حیدری"
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
    </div>
  );
}
