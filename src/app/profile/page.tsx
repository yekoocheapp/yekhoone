"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { initialProperties, Property, formatPersianNumber } from "@/data/properties";
import {
  UserRole,
  BuyerProfile,
  SellerProfile,
  AgentProfile,
  AgencyProfile
} from "@/data/users";
import {
  User,
  Heart,
  Building2,
  Video,
  Phone,
  ShieldCheck,
  Star,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  ExternalLink,
  PlusCircle,
  Eye,
  CheckCircle2,
  Sparkles,
  Key,
  Home,
  Trash2,
  Calendar,
  Layers,
  Compass,
  Briefcase,
  SlidersHorizontal,
  ChevronLeft
} from "lucide-react";

export default function ProfilePage() {
  const {
    currentRole,
    setCurrentRole,
    buyerProfile,
    sellerProfile,
    agentProfile,
    agencyProfile,
    currentNeshasst,
    toggleFavorite,
    isFavorite
  } = useUser();

  const [activeTab, setActiveTab] = useState<string>("overview");

  // Get buyer's favorite properties
  const favoriteProperties = initialProperties.filter((p) =>
    buyerProfile.favoritePropertyIds.includes(p.id)
  );

  // Get seller's owned properties
  const sellerProperties = initialProperties.filter((p) =>
    sellerProfile.ownedPropertyIds.includes(p.id)
  );

  // Get agent's managed properties
  const agentProperties = initialProperties.filter((p) =>
    agentProfile.managedPropertyIds.includes(p.id)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* ==================== TOP NAVIGATION ==================== */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Back to Home */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-all group"
            >
              <ArrowRight className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">صفحه اصلی</span>
            </Link>

            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-amber-500/30">
                <Image src="/logo.jpg" alt="یه خونه" fill className="object-cover" />
              </div>
              <span className="text-base font-extrabold bg-gradient-to-l from-amber-400 to-white bg-clip-text text-transparent">
                پروفایل کاربری یه خونه
              </span>
            </Link>
          </div>

          {/* Quick Access to Map & Virtual Neshasst */}
          <div className="flex items-center gap-2">
            <Link
              href="/neshasst"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-l from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg shadow-red-600/20 transition-all hover:scale-105"
            >
              <Video className="w-4 h-4 animate-pulse" />
              <span>اتاق نشست آنلاین (۴ نفره)</span>
            </Link>

            <Link
              href="/map"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 hover:text-white text-xs font-bold transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>نقشه تهران</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ==================== ROLE SWITCHER HERO BAR ==================== */}
      <section className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-amber-400 font-bold block mb-1">
              تفکیک سطح دسترسی و نقش کاربری:
            </span>
            <p className="text-sm text-slate-300">
              می‌توانید به سادگی بین نقش‌های سامانه جابجا شده و پروفایل اختصاصی هر نقش را بررسی کنید.
            </p>
          </div>

          {/* 4 Distinct Role Switcher Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
            {/* 1. Buyer */}
            <button
              onClick={() => setCurrentRole("buyer")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                currentRole === "buyer"
                  ? "bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>خریدار / متقاضی</span>
            </button>

            {/* 2. Seller */}
            <button
              onClick={() => setCurrentRole("seller")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                currentRole === "seller"
                  ? "bg-purple-500 text-white font-black shadow-lg shadow-purple-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>مالک و فروشنده</span>
            </button>

            {/* 3. Agent */}
            <button
              onClick={() => setCurrentRole("agent")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                currentRole === "agent"
                  ? "bg-blue-500 text-white font-black shadow-lg shadow-blue-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>مشاور املاک</span>
            </button>

            {/* 4. Agency */}
            <button
              onClick={() => setCurrentRole("agency")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                currentRole === "agency"
                  ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>آژانس املاک</span>
            </button>

            {/* 5. Guest */}
            <button
              onClick={() => setCurrentRole("guest")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                currentRole === "guest"
                  ? "bg-slate-700 text-white font-black shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <span>کاربر مهمان</span>
            </button>
          </div>
        </div>
      </section>

      {/* ==================== MAIN PROFILE CONTENT ==================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        {/* ==================== 1. BUYER PROFILE VIEW ==================== */}
        {currentRole === "buyer" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Buyer Header Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-xl">
                  <Image src={buyerProfile.avatar} alt={buyerProfile.name} fill className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-extrabold text-white">{buyerProfile.name}</h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      متقاضی مسکن
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>شماره تماس: {buyerProfile.phone}</span>
                    <span>•</span>
                    <span>بودجه: {buyerProfile.budgetLabel}</span>
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[11px] text-slate-500">مناطق مورد علاقه:</span>
                    {buyerProfile.desiredDistricts.map((d) => (
                      <span key={d} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Banner: Active Neshasst */}
              <div className="w-full md:w-auto p-4 rounded-2xl bg-gradient-to-l from-red-950/40 via-slate-900 to-slate-900 border border-red-500/30 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-red-400 font-bold mb-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span>نشست قرارداد آنلاین دعوت شده‌اید</span>
                  </div>
                  <p className="text-xs text-slate-300 font-bold">{currentNeshasst.propertyTitle}</p>
                </div>
                <Link
                  href="/neshasst"
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-lg shadow-red-600/30 transition-all hover:scale-105 shrink-0"
                >
                  ورود به اتاق نشست
                </Link>
              </div>
            </div>

            {/* Favorite Properties Section (The Buyer's List) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                  <h3 className="text-lg font-bold text-white">
                    فهرست خانه‌ها و آپارتمان‌های نشان‌شده من ({formatPersianNumber(favoriteProperties.length)})
                  </h3>
                </div>
                <Link
                  href="/map"
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                >
                  <span>یافتن خانه روی نقشه کاداستر</span>
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              </div>

              {favoriteProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {favoriteProperties.map((p) => (
                    <div
                      key={p.id}
                      className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-xl transition-all group flex flex-col"
                    >
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={p.images[0]}
                          alt={p.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-xl font-bold shadow-md ${
                              p.type === "rent" ? "bg-emerald-500 text-slate-950" : "bg-amber-500 text-slate-950 font-black"
                            }`}
                          >
                            {p.type === "rent" ? "رهن و اجاره" : "فروش نقدی"}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleFavorite(p.id)}
                          className="absolute top-3 left-3 p-2 rounded-xl bg-slate-950/80 backdrop-blur-md text-red-400 hover:bg-slate-900 transition-colors shadow-md"
                          title="حذف از نشان‌شده‌ها"
                        >
                          <Heart className="w-4 h-4 fill-red-400" />
                        </button>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                            <MapPin className="w-3.5 h-3.5 text-amber-400" />
                            <span>{p.district}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                            {p.title}
                          </h4>
                          <p className="text-xs text-amber-400 font-extrabold mt-2">
                            {p.type === "rent"
                              ? `رهن: ${formatPersianNumber(p.deposit / 1000000)} م | اجاره: ${formatPersianNumber(p.rent / 1000000)} م`
                              : `قیمت کل: ${formatPersianNumber((p.totalPrice || 0) / 1000000000)} میلیارد تومان`}
                          </p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                          <span className="text-slate-400">{p.meters} متر • {p.bedrooms} خواب</span>
                          <Link
                            href={`/property/${p.id}`}
                            className="text-amber-400 font-bold hover:underline flex items-center gap-1"
                          >
                            مشاهده کامل
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center">
                  <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-400 mb-4">هنوز خانه‌ای را به نشان‌شده‌های خود اضافه نکرده‌اید.</p>
                  <Link
                    href="/map"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
                  >
                    جستجوی خانه روی نقشه
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== 2. SELLER / HOMEOWNER PROFILE VIEW ==================== */}
        {currentRole === "seller" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Seller Header Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-purple-500/40 shadow-xl">
                  <Image src={sellerProfile.avatar} alt={sellerProfile.name} fill className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-extrabold text-white">{sellerProfile.name}</h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
                      مالک و فروشنده
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      احراز مالکیت ثبتی
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>شماره تماس: {sellerProfile.phone}</span>
                    <span>•</span>
                    <span>تعداد املاک ثبت‌شده: ۲ ملک فعال</span>
                  </p>
                </div>
              </div>

              {/* Start/Join Neshasst CTA */}
              <div className="flex items-center gap-3">
                <Link
                  href="/neshasst"
                  className="px-5 py-3 rounded-2xl bg-gradient-to-l from-red-600 to-rose-600 hover:from-red-500 text-white font-extrabold text-xs shadow-xl shadow-red-600/20 transition-all hover:scale-105 flex items-center gap-2"
                >
                  <Video className="w-4 h-4 animate-pulse" />
                  <span>ورود به نشست قرارداد آنلاین با خریدار</span>
                </Link>
              </div>
            </div>

            {/* My Registered Properties */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-bold text-white">املاک و آپارتمان‌های تحت مالکیت من</h3>
                </div>
                <Link
                  href="/map"
                  className="text-xs px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 font-bold transition-all"
                >
                  + ثبت پلاک یا آپارتمان جدید روی نقشه
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {sellerProperties.map((p) => (
                  <div
                    key={p.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-slate-800">
                        <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-bold">
                            {p.district}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold">
                            فایل فعال
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white truncate">{p.title}</h4>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{p.address}</p>
                        <p className="text-xs text-amber-400 font-black mt-2">
                          {p.type === "rent"
                            ? `رهن: ${formatPersianNumber(p.deposit / 1000000)} م • اجاره: ${formatPersianNumber(p.rent / 1000000)} م`
                            : `قیمت فروش: ${formatPersianNumber((p.totalPrice || 0) / 1000000000)} میلیارد تومان`}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400">مشاور پرونده: {p.agentName}</span>
                      <div className="flex items-center gap-2">
                        <Link
                          href="/neshasst"
                          className="px-3 py-1.5 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/30 text-xs font-bold transition-all flex items-center gap-1"
                        >
                          <Video className="w-3.5 h-3.5" />
                          نشست اختصاصی
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. AGENT PROFILE VIEW ==================== */}
        {currentRole === "agent" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Agent Header Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-blue-500/40 shadow-xl">
                  <Image src={agentProfile.avatar} alt={agentProfile.name} fill className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-extrabold text-white">{agentProfile.name}</h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                      مشاور ارشد رنج فروش
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                      کد صنفی: {agentProfile.licenseCode}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>آژانس همکار: {agentProfile.agencyName}</span>
                    <span>•</span>
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>امتیاز: {agentProfile.rating} / ۵ ({agentProfile.dealsCount} معامله موفق)</span>
                  </p>
                </div>
              </div>

              {/* Start Neshasst */}
              <Link
                href="/neshasst"
                className="px-5 py-3 rounded-2xl bg-gradient-to-l from-red-600 to-rose-600 hover:from-red-500 text-white font-extrabold text-xs shadow-xl shadow-red-600/20 transition-all hover:scale-105 flex items-center gap-2"
              >
                <Video className="w-4 h-4 animate-pulse" />
                <span>ورود به نشست قرارداد با خریدار و مالک</span>
              </Link>
            </div>

            {/* Properties Managed by Agent */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-bold text-white">فایل‌های تحت مدیریت من ({formatPersianNumber(agentProperties.length)})</h3>
                </div>
                <Link
                  href="/agency/dashboard"
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                >
                  <span>ورود به پنل جامع فایلینگ</span>
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {agentProperties.map((p) => (
                  <div
                    key={p.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between"
                  >
                    <div className="relative h-44 w-full">
                      <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-bold">
                        {p.district}
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="text-sm font-bold text-white truncate">{p.title}</h4>
                      <p className="text-xs text-amber-400 font-black mt-1">
                        {p.type === "rent" ? "رهن و اجاره" : `${formatPersianNumber((p.totalPrice || 0) / 1000000000)} میلیارد تومان`}
                      </p>
                      <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-400">طرفین: آماده نشست</span>
                        <Link
                          href="/neshasst"
                          className="text-red-400 font-bold hover:underline flex items-center gap-1"
                        >
                          <Video className="w-3.5 h-3.5" />
                          ورود به نشست
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 4. AGENCY PROFILE VIEW (ENTERPRISE) ==================== */}
        {currentRole === "agency" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Agency Corporate Header */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-xl bg-slate-950 p-2 flex items-center justify-center">
                  <Image src="/logo.jpg" alt="لوگو آژانس" fill className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h2 className="text-xl font-extrabold text-white">{agencyProfile.name}</h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-black">
                      آژانس املاک عضو اتحادیه
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                      پروانه کسب: {agencyProfile.licenseNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
                    <span>مدیر مسئول: {agencyProfile.managerName}</span>
                    <span>•</span>
                    <span className="text-amber-400 font-bold">سرپرست و مدیر قرارداد: {agencyProfile.supervisorName}</span>
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{agencyProfile.address} • تلفن: {agencyProfile.phone}</span>
                  </p>
                </div>
              </div>

              {/* Host/Chair Neshasst Button */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                <Link
                  href="/neshasst"
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-l from-red-600 via-rose-600 to-red-600 hover:from-red-500 text-white font-black text-xs shadow-xl shadow-red-600/30 transition-all hover:scale-105 flex items-center justify-center gap-2 shrink-0"
                >
                  <Video className="w-4 h-4 animate-pulse" />
                  <span>مدیریت و برگزاری نشست آنلاین (سرپرست قرارداد)</span>
                </Link>
              </div>
            </div>

            {/* Agency Roster: Agents Working in this Agency */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">تیم و مشاوران فعال آژانس ({formatPersianNumber(agencyProfile.members.length)} مشاور)</h3>
                </div>
                <button
                  onClick={() => alert("فرم دعوت و افزودن مشاور جدید به آژانس املاک")}
                  className="text-xs px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 font-bold transition-all"
                >
                  + افزودن مشاور جدید به آژانس
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {agencyProfile.members.map((member) => (
                  <div
                    key={member.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex items-center gap-4"
                  >
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-700 shrink-0">
                      <Image src={member.avatar} alt={member.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className="text-sm font-bold text-white truncate">{member.name}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {member.dealsCount} معامله
                        </span>
                      </div>
                      <p className="text-xs text-amber-400 font-medium truncate">{member.role}</p>
                      <p className="text-xs text-slate-400 mt-1">تلفن: {member.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 5. GUEST USER VIEW ==================== */}
        {currentRole === "guest" && (
          <div className="max-w-2xl mx-auto py-12 text-center space-y-6 animate-in fade-in">
            <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 mx-auto shadow-xl">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white mb-2">شما به عنوان کاربر مهمان وارد شده‌اید</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                برای ذخیره خانه‌های مورد علاقه، مشاهده شناسنامه ۲ بعدی کاداستر و حضور در نشست قرارداد آنلاین، لطفاً نقش مورد نظر خود را انتخاب کنید:
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <button
                onClick={() => setCurrentRole("buyer")}
                className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/30 text-center transition-all group"
              >
                <Heart className="w-6 h-6 text-emerald-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white block">خریدار مسکن</span>
              </button>
              <button
                onClick={() => setCurrentRole("seller")}
                className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-purple-500/30 text-center transition-all group"
              >
                <Key className="w-6 h-6 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white block">مالک و فروشنده</span>
              </button>
              <button
                onClick={() => setCurrentRole("agent")}
                className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-blue-500/30 text-center transition-all group"
              >
                <User className="w-6 h-6 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white block">مشاور املاک</span>
              </button>
              <button
                onClick={() => setCurrentRole("agency")}
                className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-center transition-all group"
              >
                <Building2 className="w-6 h-6 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white block">آژانس املاک</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
