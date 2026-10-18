"use client";

import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import {
  Heart,
  Key,
  Briefcase,
  Building2,
  ShieldCheck,
  MapPin,
  FileText,
  Phone,
  CheckCircle2,
  Sparkles,
  ArrowLeft
} from "lucide-react";

interface CategoryCompletionFormProps {
  onSuccess?: () => void;
  className?: string;
}

const TEHRAN_DISTRICTS = [
  "سعادت‌آباد",
  "شهرک غرب",
  "نیاوران",
  "پونک",
  "مرزداران",
  "صادقیه",
  "زعفرانیه",
  "ولنجک",
  "پاسداران",
  "قیطریه",
  "الهیه",
  "فرمانیه"
];

const BUYER_BUDGETS = [
  "تا ۵ میلیارد تومان",
  "۵ تا ۱۰ میلیارد تومان",
  "۱۰ تا ۲۰ میلیارد تومان",
  "۲۰ تا ۳۵ میلیارد تومان",
  "بالای ۳۵ میلیارد تومان"
];

export default function CategoryCompletionForm({
  onSuccess,
  className = ""
}: CategoryCompletionFormProps) {
  const {
    baseUser,
    completeBuyerCategory,
    completeSellerCategory,
    completeAgentCategory,
    completeAgencyCategory
  } = useUser();

  const [selectedCategory, setSelectedCategory] = useState<"buyer" | "seller" | "agent" | "agency">(
    baseUser?.selectedCategory || "buyer"
  );

  // Form State: Buyer
  const [buyerDemandType, setBuyerDemandType] = useState<"buy" | "rent">("buy");
  const [buyerBudget, setBuyerBudget] = useState(BUYER_BUDGETS[1]);
  const [buyerDistricts, setBuyerDistricts] = useState<string[]>(["سعادت‌آباد", "شهرک غرب"]);

  // Form State: Seller
  const [sellerNationalId, setSellerNationalId] = useState("");
  const [sellerPropertyType, setSellerPropertyType] = useState("آپارتمان مسکونی");
  const [sellerDistrict, setSellerDistrict] = useState("سعادت‌آباد");

  // Form State: Agent
  const [agentLicense, setAgentLicense] = useState("");
  const [agentAgencyName, setAgentAgencyName] = useState("");
  const [agentSpecialtyDistrict, setAgentSpecialtyDistrict] = useState("منطقه ۲ (سعادت‌آباد و شهرک غرب)");

  // Form State: Agency
  const [agencyName, setAgencyName] = useState(baseUser?.lastName ? `دفتر املاک ${baseUser.lastName}` : "");
  const [agencyLicenseNumber, setAgencyLicenseNumber] = useState("");
  const [agencySupervisorName, setAgencySupervisorName] = useState("");
  const [agencyOfficePhone, setAgencyOfficePhone] = useState("");
  const [agencyAddress, setAgencyAddress] = useState("");

  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleToggleDistrict = (dist: string) => {
    if (buyerDistricts.includes(dist)) {
      setBuyerDistricts(buyerDistricts.filter((d) => d !== dist));
    } else {
      setBuyerDistricts([...buyerDistricts, dist]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCategory === "buyer") {
      completeBuyerCategory({
        demandType: buyerDemandType,
        budgetLabel: buyerBudget,
        desiredDistricts: buyerDistricts
      });
      setSuccessNotice("رسته «متقاضی مسکن» با موفقیت فعال گردید.");
    } else if (selectedCategory === "seller") {
      completeSellerCategory({
        nationalId: sellerNationalId.trim(),
        propertyType: sellerPropertyType,
        district: sellerDistrict.trim()
      });
      setSuccessNotice("رسته «مالک مسکن» با موفقیت فعال گردید.");
    } else if (selectedCategory === "agent") {
      completeAgentCategory({
        licenseCode: agentLicense.trim() || "صنف-۱۴۰۵",
        agencyName: agentAgencyName.trim() || "دفتر معاملات مسکن",
        specialtyDistrict: agentSpecialtyDistrict
      });
      setSuccessNotice("رسته «مشاور املاک» با موفقیت فعال گردید.");
    } else if (selectedCategory === "agency") {
      completeAgencyCategory({
        name: agencyName.trim() || "دفتر املاک رسمی",
        managerName: baseUser?.fullName || "مدیریت آژانس",
        supervisorName: agencySupervisorName.trim() || baseUser?.fullName || "سرپرست حقوقی",
        phone: baseUser?.phone || baseUser?.contact || "۰۲۱۲۲۰۰۰۰۰۰",
        officePhone: agencyOfficePhone.trim(),
        licenseNumber: agencyLicenseNumber.trim() || "اتحادیه-تهران",
        address: agencyAddress.trim() || "تهران"
      });
      setSuccessNotice("رسته «آژانس املاک» با موفقیت فعال گردید.");
    }

    if (onSuccess) {
      setTimeout(() => {
        onSuccess();
      }, 400);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Category Selection Cards */}
      <div>
        <label className="block text-xs font-bold text-slate-400 mb-2.5">
          انتخاب رسته فعالیت مورد نظر در سامانه:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* 1. متقاضی مسکن */}
          <button
            type="button"
            onClick={() => setSelectedCategory("buyer")}
            className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between ${
              selectedCategory === "buyer"
                ? "bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-500/10 text-emerald-400"
                : "bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Heart
                className={`w-5 h-5 ${
                  selectedCategory === "buyer" ? "text-emerald-400 fill-emerald-400/20" : "text-slate-400"
                }`}
              />
              {selectedCategory === "buyer" && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </div>
            <div>
              <span className="text-sm font-black text-white block">متقاضی مسکن</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">خریدار یا مستاجر</span>
            </div>
          </button>

          {/* 2. مالک مسکن */}
          <button
            type="button"
            onClick={() => setSelectedCategory("seller")}
            className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between ${
              selectedCategory === "seller"
                ? "bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-500/10 text-purple-400"
                : "bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Key
                className={`w-5 h-5 ${
                  selectedCategory === "seller" ? "text-purple-400" : "text-slate-400"
                }`}
              />
              {selectedCategory === "seller" && (
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              )}
            </div>
            <div>
              <span className="text-sm font-black text-white block">مالک مسکن</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">فروشنده یا موجر ملک</span>
            </div>
          </button>

          {/* 3. مشاور املاک */}
          <button
            type="button"
            onClick={() => setSelectedCategory("agent")}
            className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between ${
              selectedCategory === "agent"
                ? "bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-500/10 text-blue-400"
                : "bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Briefcase
                className={`w-5 h-5 ${
                  selectedCategory === "agent" ? "text-blue-400" : "text-slate-400"
                }`}
              />
              {selectedCategory === "agent" && (
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              )}
            </div>
            <div>
              <span className="text-sm font-black text-white block">مشاور املاک</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">کارشناس منطقه</span>
            </div>
          </button>

          {/* 4. آژانس املاک */}
          <button
            type="button"
            onClick={() => setSelectedCategory("agency")}
            className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between ${
              selectedCategory === "agency"
                ? "bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-500/10 text-amber-400"
                : "bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Building2
                className={`w-5 h-5 ${
                  selectedCategory === "agency" ? "text-amber-400" : "text-slate-400"
                }`}
              />
              {selectedCategory === "agency" && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </div>
            <div>
              <span className="text-sm font-black text-white block">آژانس املاک</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">مدیر و سرپرست</span>
            </div>
          </button>
        </div>
      </div>

      {/* Role explanation */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-300 leading-relaxed">
          {selectedCategory === "buyer" &&
            "به عنوان متقاضی مسکن، امکان نشان‌کردن نامحدود فایل‌های ملکی، بررسی مشخصات و تصاویر سه‌بعدی روی نقشه هوشمند تهران و حضور در اتاق نشست آنلاین قرارداد بدون کمیسیون‌های نامتعارف را خواهید داشت."}
          {selectedCategory === "seller" &&
            "به عنوان مالک مسکن، می‌توانید پلاک یا واحد آپارتمان خود را مستقیماً ثبت نموده، احراز سند رسمی انجام داده و جلسه نشست آنلاین قرارداد را با حضور متقاضی و سرپرست حقوقی هماهنگ کنید."}
          {selectedCategory === "agent" &&
            "به عنوان مشاور املاک، فایل‌های ملکی منطقه خود را منتشر کرده و از سیستم نردبان الگوریتمی هوشمند هر ۴ ساعت یک‌بار بدون هزینه مضاعف بهره‌مند خواهید شد."}
          {selectedCategory === "agency" &&
            "به عنوان آژانس املاک، دسترسی به پنل مدیریت مشاوران، نظارت حقوقی بر قراردادهای ثبت شده و مدیریت اتاق‌های آنلاین ۴ نفره نشست به شما اختصاص می‌یابد."}
        </p>
      </div>

      {successNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Form Details for Selected Category */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {/* ================= 1. متقاضی مسکن ================= */}
        {selectedCategory === "buyer" && (
          <div className="space-y-4 animate-in fade-in">
            {/* Demand Type */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">نوع تقاضا</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBuyerDemandType("buy")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    buyerDemandType === "buy"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-black"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                  }`}
                >
                  خرید مسکونی / سرمایه‌گذاری
                </button>
                <button
                  type="button"
                  onClick={() => setBuyerDemandType("rent")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    buyerDemandType === "rent"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-black"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                  }`}
                >
                  رهن و اجاره
                </button>
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">سقف بودجه مدنظر</label>
              <div className="flex flex-wrap gap-2">
                {BUYER_BUDGETS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBuyerBudget(b)}
                    className={`py-1.5 px-3 rounded-xl text-xs border transition-all ${
                      buyerBudget === b
                        ? "bg-emerald-500 text-slate-950 font-black border-emerald-500 shadow-sm"
                        : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Districts */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                مناطق مدنظر در تهران (چند انتخاب همزمان)
              </label>
              <div className="flex flex-wrap gap-2">
                {TEHRAN_DISTRICTS.map((dist) => {
                  const isSelected = buyerDistricts.includes(dist);
                  return (
                    <button
                      key={dist}
                      type="button"
                      onClick={() => handleToggleDistrict(dist)}
                      className={`py-1.5 px-3 rounded-xl text-xs border transition-all ${
                        isSelected
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500 font-bold"
                          : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                      }`}
                    >
                      {dist} {isSelected ? "✓" : "+"}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-l from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <span>تکمیل و فعال‌سازی پنل متقاضی مسکن</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ================= 2. مالک مسکن ================= */}
        {selectedCategory === "seller" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  کد ملی مالک (جهت استعلام سند تک‌برگ)
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                  <input
                    type="text"
                    dir="ltr"
                    maxLength={10}
                    placeholder="۰۰۱۲۳۴۵۶۷۸"
                    value={sellerNationalId}
                    onChange={(e) => setSellerNationalId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-left font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">منطقه / محله ملک در تهران</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="مثال: سعادت‌آباد، علامه شمالی"
                    value={sellerDistrict}
                    onChange={(e) => setSellerDistrict(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">نوع ملک تحت مالکیت</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["آپارتمان مسکونی", "ویلایی / عمارت", "اداری / مطب", "مستغلات / کلنگی"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSellerPropertyType(t)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                      sellerPropertyType === t
                        ? "bg-purple-500/20 text-purple-300 border-purple-500"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-l from-purple-500 to-indigo-500 hover:from-purple-400 text-white font-black text-sm shadow-xl shadow-purple-500/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <span>تکمیل و فعال‌سازی پنل مالک مسکن</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ================= 3. مشاور املاک ================= */}
        {selectedCategory === "agent" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  کد صنفی / شماره پروانه مشاور
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="مثال: ۸۹۲۳۴۱"
                    value={agentLicense}
                    onChange={(e) => setAgentLicense(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">آژانس املاک همکار</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="مثال: دفتر املاک سعادت‌آباد"
                    value={agentAgencyName}
                    onChange={(e) => setAgentAgencyName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">منطقه تخصصی فعالیت در تهران</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                <input
                  type="text"
                  placeholder="مثال: منطقه ۲ تهران (سعادت‌آباد و شهرک غرب)"
                  value={agentSpecialtyDistrict}
                  onChange={(e) => setAgentSpecialtyDistrict(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-l from-blue-500 to-indigo-500 hover:from-blue-400 text-white font-black text-sm shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <span>تکمیل و فعال‌سازی پنل مشاور املاک</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ================= 4. آژانس املاک ================= */}
        {selectedCategory === "agency" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  نام رسمی آژانس املاک <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="مثال: دفتر کارگزاری مسکن شمیران"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  شماره پروانه کسب اتحادیه املاک تهران
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="مثال: پ-۴۸۲۹۱"
                    value={agencyLicenseNumber}
                    onChange={(e) => setAgencyLicenseNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-left font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  سرپرست و مدیر اتاق نشست آنلاین
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="مثال: کارشناس حقوقی قراردادها"
                    value={agencySupervisorName}
                    onChange={(e) => setAgencySupervisorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">تلفن ثابت دفتر آژانس</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                  <input
                    type="tel"
                    dir="ltr"
                    placeholder="۰۲۱۲۲۰۰۰۰۰۰"
                    value={agencyOfficePhone}
                    onChange={(e) => setAgencyOfficePhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-left"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">نشانی کامل دفتر در تهران</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                <input
                  type="text"
                  placeholder="مثال: تهران، سعادت‌آباد، میدان کاج، خیابان سرو شرقی، پلاک ۴۰"
                  value={agencyAddress}
                  onChange={(e) => setAgencyAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <span>تکمیل و فعال‌سازی پنل آژانس املاک</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
