"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { initialProperties, Property, formatPersianNumber } from "@/data/properties";
import {
  ArrowRight,
  PlusCircle,
  Building2,
  TrendingUp,
  Eye,
  PhoneCall,
  Flame,
  CheckCircle2,
  Trash2,
  Edit3,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Zap,
  Filter,
  Check,
  X,
  RotateCw,
  Clock,
  Cpu,
  Info
} from "lucide-react";

export default function AgencyDashboardPage() {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "deals">("all");
  const [notificationToast, setNotificationToast] = useState<string | null>(null);
  const [showAlgorithmModal, setShowAlgorithmModal] = useState<boolean>(false);

  // New property form state
  const [newTitle, setNewTitle] = useState("");
  const [newDistrict, setNewDistrict] = useState("سعادت‌آباد");
  const [newAddress, setNewAddress] = useState("");
  const [newType, setNewType] = useState<"rent" | "sale">("rent");
  const [newMeters, setNewMeters] = useState("");
  const [newBedrooms, setNewBedrooms] = useState("2");
  const [newDeposit, setNewDeposit] = useState("");
  const [newRent, setNewRent] = useState("");
  const [newTotalSale, setNewTotalSale] = useState("");
  const [newHasTour, setNewHasTour] = useState<boolean>(true);

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Property = {
      id: properties.length + 1,
      title: newTitle || "آپارتمان نوساز",
      slug: `property-${Date.now()}`,
      district: newDistrict,
      address: newAddress || `${newDistrict}، خیابان اصلی`,
      type: newType,
      propertyType: "آپارتمان مسکونی",
      meters: Number(newMeters) || 100,
      bedrooms: Number(newBedrooms) || 2,
      floor: 2,
      totalFloors: 5,
      unitsPerFloor: 2,
      age: 1,
      orientation: "جنوبی",
      hasParking: true,
      hasElevator: true,
      hasStorage: true,
      hasBalcony: true,
      coolingSystem: "اسپلیت",
      heatingSystem: "پکیج",
      flooring: "سنگ",
      deedStatus: "سند تک‌برگ",
      deposit: Number(newDeposit.replace(/,/g, "")) || 500000000,
      rent: Number(newRent.replace(/,/g, "")) || 20000000,
      totalPrice: Number(newTotalSale.replace(/,/g, "")) || 0,
      agencyName: "املاک نوین سعادت‌آباد",
      agencyPhone: "۰۲۱۲۲۳۳۴۴۵۵",
      agentName: "مهرداد حیدری",
      agentRole: "مشاور ارشد",
      agentPhone: "۰۹۱۲۳۴۵۶۷۸۹",
      agentRating: 4.9,
      agentDealsCount: 53,
      isVerified: true,
      hasVirtualTour: newHasTour,
      videoUrl: newHasTour
        ? "https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-with-balcony-view-40742-large.mp4"
        : undefined,
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
      ],
      tags: ["نوساز", "فول امکانات", "تخلیه"],
      description: "فایل اختصاصی ثبت شده توسط آژانس در سامانه یه خونه.",
      coordinates: { lat: 35.78, lng: 51.37 },
      createdAt: "لحظاتی پیش",
      lastAlgorithmicBump: "لحظاتی پیش",
      nextAlgorithmicBump: "۴ ساعت دیگر",
      bumpIntervalHours: 4
    };

    setProperties([created, ...properties]);
    setShowAddModal(false);
    setNotificationToast(
      newHasTour
        ? "فایل جدید با تور مجازی ۳۶۰° و نردبان الگوریتمی با موفقیت ثبت شد!"
        : "فایل با موفقیت ثبت شد و بلافاصله در چرخه نردبان الگوریتمی ۴ الی ۶ ساعته قرار گرفت!"
    );
    setTimeout(() => setNotificationToast(null), 5000);
  };

  const handleDelete = (id: number) => {
    if (confirm("آیا از حذف این فایل مطمئن هستید؟")) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-amber-500/30">
                <Image src="/logo.jpg" alt="لوگو" fill className="object-cover" />
              </div>
              <span className="text-lg font-black text-white">یه خونه</span>
            </Link>
            <span className="text-slate-600">|</span>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              پنل اختصاصی همکاران و آژانس‌ها
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ ثبت فایل ملکی جدید</span>
            </button>
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              مشاهده سایت اصلی
            </Link>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {notificationToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Agency Profile Header Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-l from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-2xl shrink-0">
              م
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">املاک نوین سعادت‌آباد</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
                  آژانس رسمی تایید شده
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                مدیر و کارشناس ارشد: <strong className="text-slate-200">مهرداد حیدری</strong> • تلفن مستقیم: <span dir="ltr" className="text-slate-300">۰۹۱۲۳۴۵۶۷۸۹</span>
              </p>
              <p className="text-[11px] text-amber-400 font-medium mt-1">
                امتیاز اعتبار: ★ ۴.۹ (۵۲ معامله موفق در منطقه ۲ تهران)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
            >
              افزودن ملک جدید
            </button>
            <Link
              href="/"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              صفحه عمومی
            </Link>
          </div>
        </div>

        {/* Financial Comparison Widget (Anti-Divar Metric) */}
        <div className="p-6 rounded-3xl bg-gradient-to-l from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-emerald-400 font-bold block mb-0.5">
                  گزارش سیستماتیک فایل‌های آژانس
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  تمام <span className="text-emerald-400 font-extrabold">{properties.length} فایل ملکی</span> شما در چرخه به‌روزرسانی فعال قرار دارند
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  الگوریتم هوشمند «یه خونه» فایل‌های معتبر آژانس شما را هر ۴ تا ۶ ساعت یکبار به صورت خودکار و زمان‌بندی‌شده به‌روزرسانی کرده و در صدر نتایج متقاضیان قرار می‌دهد.
                </p>
              </div>
            </div>

            <div className="bg-slate-950/80 px-4 py-3 rounded-2xl border border-slate-800 text-center shrink-0">
              <span className="text-[11px] text-slate-400 block mb-1">وضعیت اشتراک حرفه‌ای</span>
              <span className="text-sm font-black text-emerald-400">فعال و نامحدود</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">فایل‌های فعال</span>
              <Building2 className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-2xl font-black text-white">{properties.length}</span>
            <span className="text-[11px] text-slate-500 mr-2">فایل در حال نمایش</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">بازدید کل کاربران</span>
              <Eye className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-2xl font-black text-white">۳,۴۸۰</span>
            <span className="text-[11px] text-emerald-400 mr-2">↑ ۲۴٪ این هفته</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">تماس‌های مستقیم</span>
              <PhoneCall className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-2xl font-black text-white">۹۴</span>
            <span className="text-[11px] text-slate-500 mr-2">مشتری واقعی</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">نردبان سیستمی و الگوریتمی</span>
              <Cpu className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-lg sm:text-xl font-black text-indigo-400">خودکار (۴ الی ۶ ساعت)</span>
            <span className="text-[11px] text-slate-500 mr-2 block mt-1">بدون نیاز به کلیک دستی</span>
          </div>
        </div>

        {/* Manage Listings Table Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">مدیریت فایل‌های ملکی و نردبان هوشمند</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[11px] font-semibold flex items-center gap-1">
                  <RotateCw className="w-3 h-3 animate-spin" style={{ animationDuration: '8s' }} />
                  موتور الگوریتمی فعال
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                در یه خونه نردبان دستی وجود ندارد؛ سیستم هر ۴ الی ۶ ساعت تمام فایل‌ها را به صورت عادلانه در صدر قرار می‌دهد.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAlgorithmModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold transition-all"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>الگوریتم چگونه کار می‌کند؟</span>
              </button>

              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === "all" ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-950 text-slate-400"
                }`}
              >
                همه فایل‌ها ({properties.length})
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">تصویر و مشخصات ملک</th>
                  <th className="py-3 px-4 font-semibold">محله</th>
                  <th className="py-3 px-4 font-semibold">نوع معامله</th>
                  <th className="py-3 px-4 font-semibold">قیمت / ودیعه</th>
                  <th className="py-3 px-4 font-semibold">وضعیت نردبان الگوریتمی (سیستمی)</th>
                  <th className="py-3 px-4 font-semibold text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Property info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-12 rounded-xl overflow-hidden bg-slate-950 shrink-0">
                          <Image src={prop.images[0]} alt={prop.title} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/property/${prop.id}`}
                              className="font-bold text-white hover:text-amber-400 transition-colors line-clamp-1 block text-sm"
                            >
                              {prop.title}
                            </Link>
                            {prop.hasVirtualTour && (
                              <span className="px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold shrink-0">
                                🥽 ۳۶۰°
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {prop.meters} متر • {prop.bedrooms} خواب • {prop.floor === 0 ? "همکف" : `طبقه ${prop.floor}`}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* District */}
                    <td className="py-3 px-4 font-semibold text-slate-200">
                      {prop.district}
                    </td>

                    {/* Type */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-bold text-amber-400">
                        {prop.type === "rent" ? "رهن و اجاره" : "فروش"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      {prop.type === "rent" ? (
                        <div>
                          <span className="font-bold text-white block">
                            {formatPersianNumber(prop.deposit)} ودیعه
                          </span>
                          <span className="text-amber-400 text-[11px]">
                            {prop.rent === 0 ? "رهن کامل" : `${formatPersianNumber(prop.rent)} اجاره`}
                          </span>
                        </div>
                      ) : (
                        <span className="font-bold text-amber-400 text-sm">
                          {formatPersianNumber(prop.totalPrice || 0)} تومان
                        </span>
                      )}
                    </td>

                    {/* Algorithmic Bump Status (100% Systemic - No manual button) */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium text-[11px]">
                          <RotateCw className="w-3 h-3 text-indigo-400" />
                          نردبان خودکار ({prop.bumpIntervalHours || 4} ساعته)
                        </span>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                          <span>آخرین نردبان: <strong className="text-slate-200">{prop.lastAlgorithmicBump || "لحظاتی پیش"}</strong></span>
                          <span className="text-slate-600">•</span>
                          <span>نوبت بعد: <strong className="text-amber-400">{prop.nextAlgorithmicBump || "۴ ساعت دیگر"}</strong></span>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* View Details */}
                        <Link
                          href={`/property/${prop.id}`}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-800 text-[11px] font-medium"
                          title="مشاهده صفحه عمومی فایل"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                          <span>مشاهده</span>
                        </Link>

                        {/* Delete / Closed deal */}
                        <button
                          onClick={() => handleDelete(prop.id)}
                          className="p-1.5 rounded-lg bg-slate-950 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors border border-slate-800"
                          title="حذف فایل (معامله انجام شد)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ==================== ADD PROPERTY MODAL ==================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 left-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">ثبت فوری فایل جدید در سامانه</h3>
                <p className="text-xs text-slate-400">فایل شما بلافاصله در سامانه و نقشه کاداستر شهری منتشر خواهد شد</p>
              </div>
            </div>

            <form onSubmit={handleAddProperty} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">عنوان کامل آگهی</label>
                <input
                  required
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: آپارتمان ۱۳۰ متری، ۲ خواب، علامه شمالی"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">محله در تهران</label>
                  <select
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="سعادت‌آباد">سعادت‌آباد</option>
                    <option value="شهرک غرب">شهرک غرب</option>
                    <option value="پونک">پونک</option>
                    <option value="مرزداران">مرزداران</option>
                    <option value="نیاوران">نیاوران</option>
                    <option value="صادقیه">صادقیه</option>
                    <option value="تهرانپارس">تهرانپارس</option>
                    <option value="یوسف‌آباد">یوسف‌آباد</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">نوع معامله</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as "rent" | "sale")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="rent">رهن و اجاره</option>
                    <option value="sale">خرید و فروش</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">متراژ (متر)</label>
                  <input
                    required
                    type="number"
                    value={newMeters}
                    onChange={(e) => setNewMeters(e.target.value)}
                    placeholder="۱۲۰"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">تعداد اتاق خواب</label>
                  <input
                    type="number"
                    value={newBedrooms}
                    onChange={(e) => setNewBedrooms(e.target.value)}
                    placeholder="۲"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {newType === "rent" ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">ودیعه (تومان)</label>
                    <input
                      required
                      type="text"
                      value={newDeposit}
                      onChange={(e) => setNewDeposit(e.target.value)}
                      placeholder="۶۰۰,۰۰۰,۰۰۰"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">اجاره ماهانه (تومان)</label>
                    <input
                      type="text"
                      value={newRent}
                      onChange={(e) => setNewRent(e.target.value)}
                      placeholder="۳۰,۰۰۰,۰۰۰"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">قیمت کل فروش (تومان)</label>
                  <input
                    required
                    type="text"
                    value={newTotalSale}
                    onChange={(e) => setNewTotalSale(e.target.value)}
                    placeholder="۱۲,۰۰۰,۰۰۰,۰۰۰"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">آدرس دقیق یا کوچه (اختیاری جهت لوکیشن)</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="مثال: علامه شمالی، کوچه هجدهم"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Virtual Tour Toggle Option */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block text-xs">فعال‌سازی تور مجازی ۳۶۰° و ویدیو تور</span>
                    <span className="text-[11px] text-slate-400">امکان بازدید ۳ بعدی در سالن، آشپزخانه و خواب‌ها برای مشتریان</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={newHasTour}
                  onChange={(e) => setNewHasTour(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              {/* Algorithmic Bumping Callout */}
              <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-2.5">
                <Cpu className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <span className="font-bold text-indigo-300 block mb-0.5">چرخه به‌روزرسانی هوشمند و الگوریتمی</span>
                  <span className="text-slate-400">
                    این فایل به صورت خودکار هر ۴ الی ۶ ساعت در صدر نتایج قرار خواهد گرفت. نیازی به پرداخت هزینه یا زدن مکرر دکمه نردبان نیست.
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20"
              >
                ثبت و انتشار در سامانه «یه خونه»
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================== ALGORITHMIC ENGINE EXPLAINER MODAL ==================== */}
      {showAlgorithmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full relative shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAlgorithmModal(false)}
              className="absolute top-5 left-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">سازوکار نردبان الگوریتمی و سیستمی «یه خونه»</h3>
                <p className="text-xs text-slate-400">چرا در پلتفرم ما دکمه دستی نردبان وجود ندارد؟</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>۱. عدالت کامل برای تمام مشاوران و مالکین</span>
                </div>
                <p className="text-slate-400">
                  در «یه خونه»، نمایش فایل‌ها بر اساس صف ریاضی چرخشی (Round-Robin) مدیریت می‌شود. تمام فایل‌های معتبر آژانس‌ها و مشاورین هر ۴ الی ۶ ساعت یکبار به صورت کاملاً عادلانه و یکنواخت به صدر نتایج جستجو هدایت می‌شوند.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-1.5">
                  <Clock className="w-4 h-4" />
                  <span>۲. آسایش کامل و صفر شدن زحمت کاربری</span>
                </div>
                <p className="text-slate-400">
                  نیازی نیست صبح زود یا آخر شب برای زدن دکمه نردبان آلارم گوشی بگذارید یا کار خود را متوقف کنید. سرورهای ابری «یه خونه» شبانه‌روزی و بدون نیاز به حتی یک کلیک شما، فایل‌هایتان را مرتباً تازه و در معرض دید مشتریان قرار می‌دهند.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>۳. ریشه‌کن شدن ربات‌ها، افزونه‌ها و اسپم</span>
                </div>
                <p className="text-slate-400">
                  در روش‌های سنتی با دکمه‌های دستی به‌روزرسانی، افراد از ربات‌ها و افزونه‌های خودکار برای کلیک مدام استفاده می‌کردند که تجربه کاربری را تخریب می‌کرد. سیستماتیک بودن نردبان در «یه خونه» هرگونه امکان سوءاستفاده یا تقلب را از ریشه می‌بندد.
                </p>
              </div>

              <div className="bg-indigo-950/30 border border-indigo-500/20 p-4 rounded-2xl text-center">
                <span className="text-[11px] text-indigo-300 font-medium block">
                  دوره گردش الگوریتم: <strong className="text-white">هر ۴ تا ۶ ساعت یکبار</strong>
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  تمام فایل‌های فعال این آژانس هم‌اکنون در این چرخه قرار دارند.
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowAlgorithmModal(false)}
              className="w-full mt-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
