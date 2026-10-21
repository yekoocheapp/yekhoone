"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  Plus,
  Trash2,
  MapPin,
  BedDouble,
  Maximize2,
  Clock,
  Sparkles,
  ArrowRightLeft,
  Calendar,
  Layers,
  Search,
  ExternalLink,
  ChevronLeft,
  Rocket,
  RefreshCw,
  Users,
  Award,
  Briefcase,
  FileText
} from "lucide-react";
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

export default function AgentDashboardView() {
  const [activeTab, setActiveTab] = useState<"listings" | "leads" | "neshasst" | "license">("listings");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Agent Profile Data
  const [agentProfile, setAgentProfile] = useState<any>(null);
  const [licenseCode, setLicenseCode] = useState("۹۹۴۸۲");
  const [agencyName, setAgencyName] = useState("دپارتمان املاک سرمایه‌گذاری سعادت‌آباد");
  const [officePhone, setOfficePhone] = useState("۰۲۱۲۲۰۰۳۳۰۰");
  const [specialtyDistricts, setSpecialtyDistricts] = useState<string[]>(["سعادت‌آباد", "شهرک غرب", "پونک"]);
  const [bio, setBio] = useState("کارشناس ارشد معاملات ملکی، تهاتر دارایی و پروژه‌های مشارکت در ساخت منطقه ۲ و ۱ تهران.");

  // Data
  const [managedProperties, setManagedProperties] = useState<any[]>([]);
  const [buyerLeads, setBuyerLeads] = useState<any[]>([]);
  const [neshasstSessions, setNeshasstSessions] = useState<any[]>([]);

  // Filter
  const [propertyFilter, setPropertyFilter] = useState<string>("all");

  // Bump State
  const [bumpingId, setBumpingId] = useState<number | null>(null);
  const [bumpToast, setBumpToast] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadAgentData() {
      try {
        setLoading(true);
        const res = await fetch("/api/profile/agent");
        if (!res.ok) throw new Error("Failed to load agent profile");
        const data = await res.json();
        if (isMounted && data.success) {
          if (data.agentProfile) {
            setAgentProfile(data.agentProfile);
            if (data.agentProfile.licenseCode) setLicenseCode(data.agentProfile.licenseCode);
            if (data.agentProfile.agencyName) setAgencyName(data.agentProfile.agencyName);
            if (data.agentProfile.officePhone) setOfficePhone(data.agentProfile.officePhone);
            if (data.agentProfile.bio) setBio(data.agentProfile.bio);
            if (data.agentProfile.specialtyDistricts) {
              try {
                const parsed = JSON.parse(data.agentProfile.specialtyDistricts);
                if (Array.isArray(parsed)) setSpecialtyDistricts(parsed);
              } catch {}
            }
          }
          if (data.managedProperties) setManagedProperties(data.managedProperties);
          if (data.buyerLeads) setBuyerLeads(data.buyerLeads);
          if (data.neshasstSessions) setNeshasstSessions(data.neshasstSessions);
        }
      } catch (err: any) {
        console.error("Agent load error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadAgentData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Save License & Credentials
  const handleSaveCredentials = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/profile/agent", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licenseCode,
          agencyName,
          officePhone,
          specialtyDistrict: specialtyDistricts.join(" و "),
          specialtyDistricts,
          bio
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا در ذخیره‌سازی");
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "خطا در برقراری ارتباط");
    } finally {
      setSaving(false);
    }
  };

  // Algorithmic Bump
  const handleBump = async (propertyId: number, propertyTitle: string) => {
    setBumpingId(propertyId);
    try {
      const res = await fetch("/api/properties/bump", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId })
      });
      const data = await res.json();
      if (res.ok) {
        setBumpToast(`فایل «${propertyTitle}» با موفقیت نردبان شد و در صدر نتایج جستجو قرار گرفت.`);
        setTimeout(() => setBumpToast(null), 5000);
        // Update local property timestamp
        setManagedProperties(prev =>
          prev.map(p =>
            p.id === propertyId
              ? { ...p, lastAlgorithmicBump: "همین الان (نردبان اختصاصی مشاور)" }
              : p
          )
        );
      }
    } catch {} finally {
      setBumpingId(null);
    }
  };

  const toggleDistrict = (district: string) => {
    if (specialtyDistricts.includes(district)) {
      setSpecialtyDistricts(specialtyDistricts.filter(d => d !== district));
    } else {
      setSpecialtyDistricts([...specialtyDistricts, district]);
    }
  };

  const filteredProperties = managedProperties.filter(p => {
    if (propertyFilter === "all") return true;
    if (propertyFilter === "barter") return p.isBarter || p.type === "barter";
    if (propertyFilter === "partnership") return p.isPartnership || p.type === "partnership";
    return p.type === propertyFilter;
  });

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {bumpToast && (
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 flex items-center gap-3 text-xs sm:text-sm animate-in fade-in">
          <Rocket className="w-5 h-5 text-cyan-400 shrink-0 animate-bounce" />
          <span>{bumpToast}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 text-xs sm:text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>اطلاعات پروانه و دپارتمان مشاور با موفقیت در پایگاه داده به‌روزرسانی شد.</span>
        </div>
      )}

      {/* Agent KPI Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="block text-2xl font-black text-blue-400">
            {formatPersianNumber(managedProperties.length)}
          </span>
          <span className="text-xs text-slate-400 font-medium mt-1">فایل‌های ملکی فعال</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="block text-2xl font-black text-amber-400">
            {formatPersianNumber(buyerLeads.length)}
          </span>
          <span className="text-xs text-slate-400 font-medium mt-1">متقاضی منطبق در منطقه</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="block text-2xl font-black text-emerald-400">
            {formatPersianNumber(neshasstSessions.length)}
          </span>
          <span className="text-xs text-slate-400 font-medium mt-1">نشست و قرارداد پرونده</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="block text-2xl font-black text-cyan-400">
            ۴.۹ ★
          </span>
          <span className="text-xs text-slate-400 font-medium mt-1">امتیاز رضایت مشتریان</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("listings")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === "listings"
              ? "bg-gradient-to-l from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>فایل‌های تحت مدیریت ({formatPersianNumber(managedProperties.length)})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("leads")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === "leads"
              ? "bg-gradient-to-l from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>رادار متقاضیان و سرنخ‌ها ({formatPersianNumber(buyerLeads.length)})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("neshasst")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === "neshasst"
              ? "bg-gradient-to-l from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>اتاق‌های نشست و قرارداد ({formatPersianNumber(neshasstSessions.length)})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("license")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === "license"
              ? "bg-gradient-to-l from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>پروانه و مشخصات تخصصی</span>
        </button>
      </div>

      {/* TAB 1: Managed Listings */}
      {activeTab === "listings" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "همه فایل‌ها" },
                { id: "sale", label: "فروش قطعی" },
                { id: "rent", label: "رهن و اجاره" },
                { id: "barter", label: "تهاتر" },
                { id: "partnership", label: "مشارکت در ساخت" }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setPropertyFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    propertyFilter === f.id
                      ? "bg-blue-500 text-white shadow-sm shadow-blue-500/20"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-l from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>ثبت فایل ملکی جدید</span>
            </Link>
          </div>

          {filteredProperties.length === 0 ? (
            <div className="text-center p-12 rounded-3xl bg-slate-900/40 border border-slate-800 max-w-md mx-auto space-y-3">
              <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">فایلی در این دسته‌بندی یافت نشد</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                برای افزودن فایل جدید، دکمه «ثبت فایل ملکی جدید» را انتخاب فرمایید.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProperties.map(prop => (
                <div
                  key={prop.id}
                  className="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-blue-500/40 transition-all group"
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
                        تهاتر
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
                        {prop.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                        {prop.address}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
                      <span className="text-slate-400">
                        {prop.meters} متر • {prop.bedrooms} خواب
                      </span>
                      <span className="font-extrabold text-amber-400">
                        {prop.totalPrice || "تماس بگیرید"}
                      </span>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        disabled={bumpingId === prop.id}
                        onClick={() => handleBump(prop.id, prop.title)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 border border-blue-500/40 text-blue-300 hover:text-white text-xs font-bold transition-all disabled:opacity-50"
                        title="ارتقا و نردبان فایل به صدر نتایج جستجو"
                      >
                        {bumpingId === prop.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Rocket className="w-3.5 h-3.5 text-blue-400" />
                        )}
                        <span>نردبان فایل</span>
                      </button>

                      <Link
                        href={`/properties/${prop.id}`}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                        title="مشاهده صفحه فایل"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Buyer Leads Radar */}
      {activeTab === "leads" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center gap-3 text-xs text-blue-300">
            <Sparkles className="w-5 h-5 text-blue-400 shrink-0" />
            <span>
              رادار تقاضای یه خونه: متقاضیان فعال که معیارهای بودجه و محله‌های مورد نظرشان با تخصص و فایل‌های شما در منطقه همخوانی دارند.
            </span>
          </div>

          {buyerLeads.length === 0 ? (
            <div className="text-center p-12 rounded-3xl bg-slate-900/40 border border-slate-800 max-w-md mx-auto space-y-3">
              <Users className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">متقاضی فعالی در حال حاضر ثبت نشده است</h3>
              <p className="text-xs text-slate-400">به محض ثبت تقاضای جدید توسط خریداران، در این بخش نمایش داده می‌شود.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {buyerLeads.map(lead => (
                <div
                  key={lead.id}
                  className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-blue-500/30 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-white">{lead.buyerName}</span>
                      <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {lead.demandType === "buy" ? "خرید مسکن" : lead.demandType === "rent" ? "رهن و اجاره" : "تهاتر دارایی"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {lead.desiredDistricts && lead.desiredDistricts.map((d: string) => (
                        <span key={d} className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 text-[10px] border border-slate-800">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-slate-800/60 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>محدوده بودجه:</span>
                      <span className="font-bold text-white">
                        {lead.minBudgetTomans && lead.maxBudgetTomans ? `${lead.minBudgetTomans} تا ${lead.maxBudgetTomans} میلیارد` : lead.budgetLabel}
                      </span>
                    </div>
                    {lead.minMeters && (
                      <div className="flex justify-between text-slate-400">
                        <span>حداقل فضا:</span>
                        <span className="text-white font-medium">{lead.minMeters} متر • {lead.minBedrooms || 2} خواب</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <a
                      href={`tel:${lead.contact}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-l from-emerald-500 to-teal-600 hover:from-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>تماس و پیشنهاد فایل</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Neshasst Sessions */}
      {activeTab === "neshasst" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span>اتاق جلسات نشست و قرارداد آنلاین</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              جلسات قرارداد که شما به عنوان مشاور ارشد و کارشناس پرونده در آن‌ها حضور دارید.
            </p>
          </div>

          {neshasstSessions.length === 0 ? (
            <div className="text-center p-12 rounded-3xl bg-slate-900/40 border border-slate-800 max-w-md mx-auto space-y-3">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">جلسه نشست فعالی ثبت نشده است</h3>
              <p className="text-xs text-slate-400">پس از هماهنگی بازدید با خریدار و توافق اولیه، اتاق قرارداد توسط سرپرست دپارتمان تشکیل می‌شود.</p>
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
                      <h4 className="text-sm sm:text-base font-bold text-white">{session.title}</h4>
                    </div>
                    <p className="text-xs text-slate-400">{session.propertyAddress}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span>زمان: {session.scheduledDate} ساعت {session.scheduledTime}</span>
                      <span>خریدار: {session.buyerName}</span>
                      <span>مالک: {session.sellerName}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-l from-blue-500 to-indigo-600 hover:from-blue-400 text-white font-bold text-xs shrink-0 shadow-md shadow-blue-500/20 transition-all hover:scale-105"
                  >
                    ورود به اتاق مذاکره و تنظیم قرارداد
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: License & Credentials */}
      {activeTab === "license" && (
        <div className="max-w-2xl space-y-6">
          <div className="rounded-3xl bg-slate-900/50 border border-slate-800 p-5 sm:p-7 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-400" />
                <span>مشخصات پروانه صنفی و دپارتمان مشاور</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                این اطلاعات روی شناسنامه فایل‌های ملکی و کارت رسمی شما در سامانه یه خونه نمایش داده می‌شود.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">کد صنفی / شماره پروانه مشاور</label>
                <input
                  type="text"
                  value={licenseCode}
                  onChange={e => setLicenseCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">تلفن دفتر / خط ثابت دپارتمان</label>
                <input
                  type="text"
                  value={officePhone}
                  onChange={e => setOfficePhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] text-slate-400 mb-1">نام دپارتمان یا آژانس املاک وابسته</label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={e => setAgencyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-2">
                <label className="block text-[11px] text-slate-400">مناطق و محله‌های تخصصی فعالیت</label>
                <div className="flex flex-wrap gap-2">
                  {TEHRAN_DISTRICTS.map(district => {
                    const isSelected = specialtyDistricts.includes(district);
                    return (
                      <button
                        key={district}
                        type="button"
                        onClick={() => toggleDistrict(district)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-blue-500 text-white font-black shadow-sm shadow-blue-500/20"
                            : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {district}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] text-slate-400 mb-1">بیوگرافی و تخصص کاری (نمایش عمومی)</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs leading-relaxed focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end">
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveCredentials}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-l from-blue-500 to-indigo-600 hover:from-blue-400 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saving ? "در حال ذخیره‌سازی..." : "ذخیره اطلاعات پروانه"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
