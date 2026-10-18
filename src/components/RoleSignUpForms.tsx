"use client";

import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { UserRole } from "@/data/users";
import {
  User,
  Heart,
  Key,
  Briefcase,
  Building2,
  ShieldCheck,
  Phone,
  CheckCircle2,
  Sparkles,
  MapPin,
  FileText,
  AlertCircle
} from "lucide-react";

interface RoleSignUpFormsProps {
  initialRole?: UserRole;
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

export default function RoleSignUpForms({
  initialRole = "buyer",
  onSuccess,
  className = ""
}: RoleSignUpFormsProps) {
  const { signUpBuyer, signUpSeller, signUpAgent, signUpAgency } = useUser();
  const [selectedRole, setSelectedRole] = useState<"buyer" | "seller" | "agent" | "agency">(
    initialRole === "guest" || initialRole === "member" ? "buyer" : (initialRole as "buyer" | "seller" | "agent" | "agency")
  );

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State: Buyer
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerDemandType, setBuyerDemandType] = useState<"buy" | "rent">("buy");
  const [buyerBudget, setBuyerBudget] = useState(BUYER_BUDGETS[1]);
  const [buyerDistricts, setBuyerDistricts] = useState<string[]>(["سعادت‌آباد", "شهرک غرب"]);

  // Form State: Seller
  const [sellerName, setSellerName] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const [sellerNationalId, setSellerNationalId] = useState("");
  const [sellerPropertyType, setSellerPropertyType] = useState("آپارتمان مسکونی");
  const [sellerDistrict, setSellerDistrict] = useState("سعادت‌آباد");

  // Form State: Agent
  const [agentName, setAgentName] = useState("");
  const [agentPhone, setAgentPhone] = useState("");
  const [agentLicense, setAgentLicense] = useState("");
  const [agentAgencyName, setAgentAgencyName] = useState("");
  const [agentSpecialtyDistrict, setAgentSpecialtyDistrict] = useState("منطقه ۲ (سعادت‌آباد و شهرک غرب)");

  // Form State: Agency
  const [agencyName, setAgencyName] = useState("");
  const [agencyLicenseNumber, setAgencyLicenseNumber] = useState("");
  const [agencyManagerName, setAgencyManagerName] = useState("");
  const [agencySupervisorName, setAgencySupervisorName] = useState("");
  const [agencyOfficePhone, setAgencyOfficePhone] = useState("");
  const [agencyMobilePhone, setAgencyMobilePhone] = useState("");
  const [agencyAddress, setAgencyAddress] = useState("");

  const handleToggleDistrict = (dist: string) => {
    if (buyerDistricts.includes(dist)) {
      setBuyerDistricts(buyerDistricts.filter((d) => d !== dist));
    } else {
      setBuyerDistricts([...buyerDistricts, dist]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (selectedRole === "buyer") {
      if (!buyerName.trim()) {
        setErrorMsg("لطفاً نام و نام خانوادگی خود را وارد کنید.");
        return;
      }
      if (!buyerPhone.trim() || buyerPhone.trim().length < 10) {
        setErrorMsg("لطفاً شماره تلفن همراه معتبر (مثلاً ۰۹۱۲...) وارد کنید.");
        return;
      }

      signUpBuyer({
        name: buyerName.trim(),
        phone: buyerPhone.trim(),
        demandType: buyerDemandType,
        budgetLabel: buyerBudget,
        desiredDistricts: buyerDistricts
      });
      setSuccessMsg("ثبت‌نام متقاضی مسکن با موفقیت انجام شد.");
    } else if (selectedRole === "seller") {
      if (!sellerName.trim()) {
        setErrorMsg("لطفاً نام و نام خانوادگی مالک را وارد کنید.");
        return;
      }
      if (!sellerPhone.trim() || sellerPhone.trim().length < 10) {
        setErrorMsg("لطفاً شماره تلفن همراه معتبر مالک را وارد کنید.");
        return;
      }

      signUpSeller({
        name: sellerName.trim(),
        phone: sellerPhone.trim(),
        nationalId: sellerNationalId.trim(),
        propertyType: sellerPropertyType,
        district: sellerDistrict
      });
      setSuccessMsg("ثبت‌نام مالک مسکن با موفقیت انجام شد.");
    } else if (selectedRole === "agent") {
      if (!agentName.trim()) {
        setErrorMsg("لطفاً نام و نام خانوادگی مشاور را وارد کنید.");
        return;
      }
      if (!agentPhone.trim() || agentPhone.trim().length < 10) {
        setErrorMsg("لطفاً شماره همراه مشاور را وارد کنید.");
        return;
      }

      signUpAgent({
        name: agentName.trim(),
        phone: agentPhone.trim(),
        licenseCode: agentLicense.trim() || "صنف-۱۴۰۵",
        agencyName: agentAgencyName.trim() || "دفتر معاملات مسکن",
        specialtyDistrict: agentSpecialtyDistrict
      });
      setSuccessMsg("ثبت‌نام مشاور املاک با موفقیت انجام شد.");
    } else if (selectedRole === "agency") {
      if (!agencyName.trim()) {
        setErrorMsg("لطفاً نام رسمی آژانس املاک را وارد کنید.");
        return;
      }
      if (!agencyManagerName.trim()) {
        setErrorMsg("لطفاً نام مدیر مسئول آژانس را وارد کنید.");
        return;
      }
      if (!agencyMobilePhone.trim() && !agencyOfficePhone.trim()) {
        setErrorMsg("لطفاً حداقل یک شماره تماس معتبر وارد کنید.");
        return;
      }

      signUpAgency({
        name: agencyName.trim(),
        managerName: agencyManagerName.trim(),
        supervisorName: agencySupervisorName.trim() || agencyManagerName.trim(),
        phone: agencyMobilePhone.trim() || agencyOfficePhone.trim(),
        officePhone: agencyOfficePhone.trim(),
        licenseNumber: agencyLicenseNumber.trim() || "اتحادیه-تهران",
        address: agencyAddress.trim() || "تهران"
      });
      setSuccessMsg("ثبت‌نام آژانس املاک با موفقیت انجام شد.");
    }

    if (onSuccess) {
      setTimeout(() => {
        onSuccess();
      }, 350);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Role Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          type="button"
          onClick={() => {
            setSelectedRole("buyer");
            setErrorMsg(null);
          }}
          className={`p-3.5 sm:p-4 rounded-2xl border text-right transition-all flex flex-col justify-between ${
            selectedRole === "buyer"
              ? "bg-emerald-950/40 border-emerald-500/80 shadow-lg shadow-emerald-500/10 text-emerald-400"
              : "bg-slate-900/80 hover:bg-slate-800/80 border-slate-800 text-slate-300"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Heart
              className={`w-5 h-5 ${
                selectedRole === "buyer" ? "text-emerald-400 fill-emerald-400/20" : "text-slate-400"
              }`}
            />
            {selectedRole === "buyer" && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </div>
          <div>
            <span className="text-sm font-bold text-white block">متقاضی مسکن</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">جستجو، نشان‌کردن و نشست</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedRole("seller");
            setErrorMsg(null);
          }}
          className={`p-3.5 sm:p-4 rounded-2xl border text-right transition-all flex flex-col justify-between ${
            selectedRole === "seller"
              ? "bg-purple-950/40 border-purple-500/80 shadow-lg shadow-purple-500/10 text-purple-400"
              : "bg-slate-900/80 hover:bg-slate-800/80 border-slate-800 text-slate-300"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Key
              className={`w-5 h-5 ${
                selectedRole === "seller" ? "text-purple-400" : "text-slate-400"
              }`}
            />
            {selectedRole === "seller" && (
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            )}
          </div>
          <div>
            <span className="text-sm font-bold text-white block">مالک مسکن</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">فروشنده یا موجر ملک</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedRole("agent");
            setErrorMsg(null);
          }}
          className={`p-3.5 sm:p-4 rounded-2xl border text-right transition-all flex flex-col justify-between ${
            selectedRole === "agent"
              ? "bg-blue-950/40 border-blue-500/80 shadow-lg shadow-blue-500/10 text-blue-400"
              : "bg-slate-900/80 hover:bg-slate-800/80 border-slate-800 text-slate-300"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Briefcase
              className={`w-5 h-5 ${
                selectedRole === "agent" ? "text-blue-400" : "text-slate-400"
              }`}
            />
            {selectedRole === "agent" && (
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            )}
          </div>
          <div>
            <span className="text-sm font-bold text-white block">مشاور املاک</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">کارشناس تخصصی منطقه</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedRole("agency");
            setErrorMsg(null);
          }}
          className={`p-3.5 sm:p-4 rounded-2xl border text-right transition-all flex flex-col justify-between ${
            selectedRole === "agency"
              ? "bg-amber-950/40 border-amber-500/80 shadow-lg shadow-amber-500/10 text-amber-400"
              : "bg-slate-900/80 hover:bg-slate-800/80 border-slate-800 text-slate-300"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Building2
              className={`w-5 h-5 ${
                selectedRole === "agency" ? "text-amber-400" : "text-slate-400"
              }`}
            />
            {selectedRole === "agency" && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </div>
          <div>
            <span className="text-sm font-bold text-white block">آژانس املاک</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">مدیریت و سرپرست قرارداد</span>
          </div>
        </button>
      </div>

      {/* Role Context & Privileges Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          {selectedRole === "buyer" && (
            <span>
              به عنوان <strong className="text-white">متقاضی مسکن</strong>، فایل‌های تاییدشده و نقشه هوشمند تهران را بدون آگهی‌های فیک بررسی کرده، املاک را نشان کنید و در نشست آنلاین رسمی قرارداد شرکت نمایید.
            </span>
          )}
          {selectedRole === "seller" && (
            <span>
              به عنوان <strong className="text-white">مالک مسکن</strong>، پلاک یا واحد خود را مستقیماً ثبت کنید، از تماس‌های بی‌مورد واسطه‌ها جلوگیری کرده و جلسه نشست آنلاین قرارداد را با نظارت رسمی هماهنگ نمایید.
            </span>
          )}
          {selectedRole === "agent" && (
            <span>
              به عنوان <strong className="text-white">مشاور املاک</strong>، فایل‌های کارشناسی شده را منتشر کرده، از نردبان زمان‌بندی‌شده هر ۴ ساعت به طور خودکار بهره‌مند شوید و کمیسیون معاملات را پیگیری نمایید.
            </span>
          )}
          {selectedRole === "agency" && (
            <span>
              به عنوان <strong className="text-white">آژانس املاک</strong>، مدیریت جامع مشاوران و فایل‌های ثبتی دفتر را بر عهده داشته و اتاق‌های نشست آنلاین ۴ نفره قرارداد را سرپرستی کنید.
            </span>
          )}
        </div>
      </div>

      {/* Error / Success Notifications */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* The Actual Role Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ================= 1. FORM FOR متقاضی مسکن ================= */}
        {selectedRole === "buyer" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  نام و نام خانوادگی <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="مثال: کیانوش کاظمی"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  شماره تلفن همراه <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-left"
                  />
                </div>
              </div>
            </div>

            {/* Demand Type */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">نوع تقاضا</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBuyerDemandType("buy")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    buyerDemandType === "buy"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
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
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                  }`}
                >
                  رهن و اجاره
                </button>
              </div>
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">سقف بودجه تقریبی</label>
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

            {/* Desired Districts in Tehran */}
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
              className="w-full mt-4 py-3 rounded-xl bg-gradient-to-l from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01]"
            >
              ثبت‌نام و ورود به عنوان متقاضی مسکن
            </button>
          </div>
        )}

        {/* ================= 2. FORM FOR مالک مسکن ================= */}
        {selectedRole === "seller" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  نام و نام خانوادگی مالک <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="مثال: محمدرضا سلیمی"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  شماره همراه مالک <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-left"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  کد ملی مالک (اختیاری - احراز هویت سند تک‌برگ)
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

            {/* Property Type */}
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
              className="w-full mt-4 py-3 rounded-xl bg-gradient-to-l from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-black text-sm shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.01]"
            >
              ثبت‌نام و ورود به عنوان مالک مسکن
            </button>
          </div>
        )}

        {/* ================= 3. FORM FOR مشاور املاک ================= */}
        {selectedRole === "agent" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  نام و نام خانوادگی مشاور <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="مثال: فرهاد رضازاده"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  شماره همراه مشاور <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    value={agentPhone}
                    onChange={(e) => setAgentPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-left"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  شناسه صنفی / کد پروانه مشاور
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="مثال: ۹۸۳۴۲۱"
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
                  placeholder="مثال: منطقه ۲ تهران (سعادت‌آباد، شهرک غرب)"
                  value={agentSpecialtyDistrict}
                  onChange={(e) => setAgentSpecialtyDistrict(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3 rounded-xl bg-gradient-to-l from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white font-black text-sm shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.01]"
            >
              ثبت‌نام و ورود به عنوان مشاور املاک
            </button>
          </div>
        )}

        {/* ================= 4. FORM FOR آژانس املاک ================= */}
        {selectedRole === "agency" && (
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
                  شماره پروانه کسب اتحادیه املاک تهران <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                  <input
                    type="text"
                    required
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
                  نام و نام خانوادگی مدیر مسئول <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="مثال: مهندس رامین قنبری"
                    value={agencyManagerName}
                    onChange={(e) => setAgencyManagerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  شماره همراه مدیریت / سرپرست <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    value={agencyMobilePhone}
                    onChange={(e) => setAgencyMobilePhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-left"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">نشانی و نشانه ثبتی دفتر در تهران</label>
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
              className="w-full mt-4 py-3 rounded-xl bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01]"
            >
              ثبت‌نام و ورود به عنوان آژانس املاک
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
