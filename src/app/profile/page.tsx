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
  ChevronLeft,
  LogOut
} from "lucide-react";
import ClassicSignUpForm from "@/components/ClassicSignUpForm";
import CategoryCompletionForm from "@/components/CategoryCompletionForm";

export default function ProfilePage() {
  const {
    currentRole,
    setCurrentRole,
    baseUser,
    buyerProfile,
    sellerProfile,
    agentProfile,
    agencyProfile,
    currentNeshasst,
    toggleFavorite,
    isFavorite,
    resetCategory,
    logout
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

      {/* ==================== MAIN PROFILE CONTENT ==================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        {/* Active Account Status & Logout Header (When Signed In) */}
        {currentRole !== "guest" && (
          <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center justify-between gap-4 flex-wrap animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <span className="text-xs text-slate-400 block">
                  {baseUser ? `خوش آمدید، ${baseUser.fullName}` : "حساب کاربری فعال در سامانه یه خونه:"}
                  {baseUser?.contact ? ` • تماس/ایمیل: ${baseUser.contact}` : ""}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-extrabold text-white">
                    {baseUser?.fullName ||
                      (currentRole === "buyer"
                        ? buyerProfile.name
                        : currentRole === "seller"
                        ? sellerProfile.name
                        : currentRole === "agent"
                        ? agentProfile.name
                        : currentRole === "agency"
                        ? agencyProfile.name
                        : "کاربر عضو سامانه")}
                  </span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                    {currentRole === "buyer"
                      ? "متقاضی مسکن"
                      : currentRole === "seller"
                      ? "مالک و فروشنده"
                      : currentRole === "agent"
                      ? "مشاور املاک"
                      : currentRole === "agency"
                      ? "آژانس املاک"
                      : "عضو سامانه (در انتظار تکمیل رسته)"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {currentRole !== "member" && (
                <button
                  onClick={resetCategory}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all shadow-sm group"
                  title="تغییر یا ویرایش رسته کاربری"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
                  <span>تغییر رسته کاربری</span>
                </button>
              )}

              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 border border-red-500/30 text-xs font-bold transition-all shadow-sm group"
                title="خروج از حساب کاربری و بازگشت به حالت مهمان"
              >
                <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>خروج از حساب</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================== 1. BUYER PROFILE VIEW ==================== */}
        {currentRole === "buyer" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Buyer Header Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-xl bg-slate-950 shrink-0 flex items-center justify-center">
                  {buyerProfile.avatar ? (
                    <Image src={buyerProfile.avatar} alt={buyerProfile.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-emerald-950/60 flex items-center justify-center text-emerald-400 text-2xl font-black">
                      {buyerProfile.name ? buyerProfile.name.slice(0, 1) : <User className="w-8 h-8" />}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-extrabold text-white">{buyerProfile.name || "متقاضی مسکن"}</h2>
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
                  <span>یافتن خانه روی نقشه هوشمند تهران</span>
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
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-purple-500/40 shadow-xl bg-slate-950 shrink-0 flex items-center justify-center">
                  {sellerProfile.avatar ? (
                    <Image src={sellerProfile.avatar} alt={sellerProfile.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-purple-950/60 flex items-center justify-center text-purple-400 text-2xl font-black">
                      {sellerProfile.name ? sellerProfile.name.slice(0, 1) : <Key className="w-8 h-8" />}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-extrabold text-white">{sellerProfile.name || "مالک مسکن"}</h2>
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
                    <span>شماره تماس: {sellerProfile.phone || "ثبت نشده"}</span>
                    <span>•</span>
                    <span>تعداد املاک ثبت‌شده: {formatPersianNumber(sellerProperties.length)} ملک</span>
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
                  <span>ورود به نشست قرارداد آنلاین با متقاضی مسکن</span>
                </Link>
              </div>
            </div>

            {/* My Registered Properties */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-bold text-white">املاک و آپارتمان‌های تحت مالکیت من ({formatPersianNumber(sellerProperties.length)})</h3>
                </div>
                <Link
                  href="/map"
                  className="text-xs px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 font-bold transition-all"
                >
                  + ثبت پلاک یا آپارتمان جدید روی نقشه
                </Link>
              </div>

              {sellerProperties.length > 0 ? (
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
              ) : (
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 text-center">
                  <Home className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-400 mb-4">هنوز ملکی را به عنوان مالک ثبت نکرده‌اید.</p>
                  <Link
                    href="/map"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all hover:scale-105"
                  >
                    <span>+ ثبت پلاک یا آپارتمان روی نقشه هوشمند تهران</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== 3. AGENT PROFILE VIEW ==================== */}
        {currentRole === "agent" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Agent Header Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-blue-500/40 shadow-xl bg-slate-950 shrink-0 flex items-center justify-center">
                  {agentProfile.avatar ? (
                    <Image src={agentProfile.avatar} alt={agentProfile.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-blue-950/60 flex items-center justify-center text-blue-400 text-2xl font-black">
                      {agentProfile.name ? agentProfile.name.slice(0, 1) : <Briefcase className="w-8 h-8" />}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-extrabold text-white">{agentProfile.name || "مشاور املاک"}</h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                      مشاور ارشد رنج معاملات
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                      کد صنفی: {agentProfile.licenseCode || "در دست استعلام"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>آژانس همکار: {agentProfile.agencyName || "دفتر معاملات مسکن"}</span>
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
                <span>ورود به نشست قرارداد با متقاضی مسکن و مالک</span>
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

              {agentProperties.length > 0 ? (
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
              ) : (
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 text-center">
                  <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-400 mb-4">هنوز فایل ملکی جدیدی ثبت نکرده‌اید.</p>
                  <Link
                    href="/agency/dashboard"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
                  >
                    <span>ورود به پنل فایلینگ و ثبت فایل جدید</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== 4. AGENCY PROFILE VIEW (ENTERPRISE) ==================== */}
        {currentRole === "agency" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Agency Corporate Header */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-xl bg-slate-950 shrink-0 flex items-center justify-center">
                  {agencyProfile.logo ? (
                    <Image src={agencyProfile.logo} alt="لوگو آژانس" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-amber-950/60 flex items-center justify-center text-amber-400 text-2xl font-black">
                      {agencyProfile.name ? agencyProfile.name.slice(0, 1) : <Building2 className="w-8 h-8" />}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h2 className="text-xl font-extrabold text-white">{agencyProfile.name || "آژانس املاک"}</h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-black">
                      آژانس املاک عضو اتحادیه
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                      پروانه کسب: {agencyProfile.licenseNumber || "در دست ثبت"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
                    <span>مدیر مسئول: {agencyProfile.managerName || "مدیریت آژانس"}</span>
                    <span>•</span>
                    <span className="text-amber-400 font-bold">سرپرست و مدیر قرارداد: {agencyProfile.supervisorName || "سرپرست حقوقی"}</span>
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{agencyProfile.address || "تهران"} • تلفن: {agencyProfile.phone || "ثبت نشده"}</span>
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

              {agencyProfile.members.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  {agencyProfile.members.map((member) => (
                    <div
                      key={member.id}
                      className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex items-center gap-4"
                    >
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 shrink-0 flex items-center justify-center">
                        {member.avatar ? (
                          <Image src={member.avatar} alt={member.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-slate-800 flex items-center justify-center text-amber-400 font-bold text-lg">
                            {member.name ? member.name.slice(0, 1) : <User className="w-6 h-6" />}
                          </div>
                        )}
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
              ) : (
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center">
                  <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">هنوز مشاوری به آژانس شما متصل نشده است. می‌توانید با ارسال دعوت‌نامه، مشاوران خود را اضافه نمایید.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== 5. MEMBER CATEGORY COMPLETION VIEW ==================== */}
        {currentRole === "member" && (
          <div className="max-w-3xl mx-auto py-6 space-y-6 animate-in fade-in">
            <div className="text-center space-y-2 mb-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-1">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>گام دوم: انتخاب و تکمیل رسته کاربری</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {baseUser?.fullName ? `${baseUser.fullName} عزیز، رسته فعالیت خود را انتخاب فرمایید` : "تعیین رسته کاربری در سامانه «یه خونه»"}
              </h1>
              <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                مشخص نمایید به عنوان متقاضی مسکن، مالک، مشاور یا آژانس در سامانه فعالیت خواهید داشت تا امکانات و ابزارهای مرتبط با رسته شما فعال گردد:
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <CategoryCompletionForm />
            </div>
          </div>
        )}

        {/* ==================== 6. GUEST USER VIEW (CLASSIC SIGN-UP WITH SMART CAPTCHA) ==================== */}
        {currentRole === "guest" && (
          <div className="max-w-xl mx-auto py-6 space-y-6 animate-in fade-in">
            <div className="text-center space-y-2 mb-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>سامانه احراز هویت امن «یه خونه»</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                ورود و ثبت‌نام کاربر
              </h1>
              <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                ابتدا مشخصات اولیه شامل نام، نام خانوادگی، شماره همراه یا ایمیل و کد امنیتی را وارد فرمایید؛ سپس در پروفایل رسته فعالیت خود را مشخص نمایید:
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <ClassicSignUpForm />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
