"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Building,
  Building2,
  Users,
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
  Phone,
  Mail,
  Award,
  Clock,
  Sparkles,
  ArrowRightLeft,
  ExternalLink,
  Search,
  Briefcase,
  Rocket,
  RefreshCw,
  SlidersHorizontal,
  ChevronLeft,
  UserCheck,
  FileText,
  UserPlus
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
  "تهرانپارس"
];

export default function AgencyDashboardView() {
  const [activeTab, setActiveTab] = useState<"listings" | "agents" | "neshasst" | "barter_jv" | "legal_settings">("listings");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Agency Data
  const [agency, setAgency] = useState<any>(null);
  const [name, setName] = useState("دپارتمان املاک سرمایه‌گذاری سعادت‌آباد");
  const [licenseNumber, setLicenseNumber] = useState("۸۴۹۲۰۱");
  const [managerName, setManagerName] = useState("دکتر مهران حیدری");
  const [supervisorName, setSupervisorName] = useState("مهندس فرهمند (مدیر ارشد قراردادها)");
  const [phone, setPhone] = useState("۰۲۱۲۲۱۱۴۴۰۰");
  const [officePhone, setOfficePhone] = useState("۰۲۱۲۲۱۱۴۴۰۱");
  const [address, setAddress] = useState("تهران، سعادت‌آباد، میدان کاج، خیابان سرو غربی، پلاک ۲۴، ساختمان دپارتمان مرکزی");
  const [description, setDescription] = useState("دپارتمان تخصصی معاملات مسکن، فایلینگ انحصاری، تهاتر دارایی و مشارکت در ساخت منطقه ۲ و ۱ تهران.");
  const [districtsCovered, setDistrictsCovered] = useState<string[]>(["سعادت‌آباد", "شهرک غرب", "پونک", "نیاوران", "فرمانیه"]);

  // Master lists
  const [agencyProperties, setAgencyProperties] = useState<any[]>([]);
  const [agentsList, setAgentsList] = useState<any[]>([]);
  const [neshasstSessions, setNeshasstSessions] = useState<any[]>([]);

  // Filter
  const [propertyFilter, setPropertyFilter] = useState("all");

  // Invite Agent Modal
  const [isInvitingAgent, setIsInvitingAgent] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentPhone, setNewAgentPhone] = useState("");
  const [newAgentRole, setNewAgentRole] = useState("مشاور رنج فروش مسکونی");
  const [newAgentDistrict, setNewAgentDistrict] = useState("سعادت‌آباد");
  const [inviteSuccessToast, setInviteSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadAgencyData() {
      try {
        setLoading(true);
        const res = await fetch("/api/profile/agency");
        if (!res.ok) throw new Error("Failed to load agency profile");
        const data = await res.json();
        if (isMounted && data.success) {
          if (data.agency) {
            setAgency(data.agency);
            if (data.agency.name) setName(data.agency.name);
            if (data.agency.licenseNumber) setLicenseNumber(data.agency.licenseNumber);
            if (data.agency.managerName) setManagerName(data.agency.managerName);
            if (data.agency.supervisorName) setSupervisorName(data.agency.supervisorName);
            if (data.agency.phone) setPhone(data.agency.phone);
            if (data.agency.officePhone) setOfficePhone(data.agency.officePhone);
            if (data.agency.address) setAddress(data.agency.address);
            if (data.agency.description) setDescription(data.agency.description);
            if (data.agency.districtsCovered) {
              try {
                const parsed = JSON.parse(data.agency.districtsCovered);
                if (Array.isArray(parsed)) setDistrictsCovered(parsed);
              } catch {}
            }
          }
          if (data.agencyProperties) setAgencyProperties(data.agencyProperties);
          if (data.agentsList) setAgentsList(data.agentsList);
          if (data.neshasstSessions) setNeshasstSessions(data.neshasstSessions);
        }
      } catch (err: any) {
        console.error("Agency load error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadAgencyData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Save Legal & Admin Settings
  const handleSaveLegal = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/profile/agency", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          licenseNumber,
          managerName,
          supervisorName,
          phone,
          officePhone,
          address,
          description,
          districtsCovered
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا در ذخیره‌سازی");
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "خطا در ارتباط با سرور");
    } finally {
      setSaving(false);
    }
  };

  // Invite / Add Agent
  const handleInviteAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim() || !newAgentPhone.trim()) return;

    const newAgent = {
      id: `ag-${Date.now()}`,
      name: newAgentName.trim(),
      phone: newAgentPhone.trim(),
      role: newAgentRole,
      specialtyDistrict: newAgentDistrict,
      rating: 5.0,
      dealsCount: 0,
      activeListingsCount: 0
    };

    setAgentsList([newAgent, ...agentsList]);
    setIsInvitingAgent(false);
    setNewAgentName("");
    setNewAgentPhone("");
    setInviteSuccessToast(`مشاور «${newAgent.name}» با موفقیت به کادر دپارتمان اضافه شد.`);
    setTimeout(() => setInviteSuccessToast(null), 5000);
  };

  const toggleDistrict = (district: string) => {
    if (districtsCovered.includes(district)) {
      setDistrictsCovered(districtsCovered.filter(d => d !== district));
    } else {
      setDistrictsCovered([...districtsCovered, district]);
    }
  };

  const filteredProperties = agencyProperties.filter(p => {
    if (propertyFilter === "all") return true;
    if (propertyFilter === "barter") return p.isBarter || p.type === "barter";
    if (propertyFilter === "partnership") return p.isPartnership || p.type === "partnership";
    return p.type === propertyFilter;
  });

  return (
    <div className="space-y-6">
      {/* Toast Feedbacks */}
      {inviteSuccessToast && (
        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/40 text-purple-300 flex items-center gap-3 text-xs sm:text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
          <span>{inviteSuccessToast}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 text-xs sm:text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>مشخصات حقوقی، پروانه کسب و اطلاعات دپارتمان با موفقیت ذخیره شد.</span>
        </div>
      )}

      {/* Enterprise KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="block text-2xl font-black text-purple-400">
            {formatPersianNumber(agencyProperties.length || 32)}
          </span>
          <span className="text-xs text-slate-400 font-medium mt-1">کل فایل‌های دپارتمان</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="block text-2xl font-black text-blue-400">
            {formatPersianNumber(agentsList.length)}
          </span>
          <span className="text-xs text-slate-400 font-medium mt-1">مشاوران رسمی دپارتمان</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="block text-2xl font-black text-emerald-400">
            {formatPersianNumber(neshasstSessions.length || 3)}
          </span>
          <span className="text-xs text-slate-400 font-medium mt-1">اتاق قرارداد و نشست فعال</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="block text-2xl font-black text-amber-400">
            {formatPersianNumber(28)}
          </span>
          <span className="text-xs text-slate-400 font-medium mt-1">قرارداد قطعی این ماه</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("listings")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === "listings"
              ? "bg-gradient-to-l from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>فایلینگ جامع دپارتمان ({formatPersianNumber(agencyProperties.length || 32)})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("agents")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === "agents"
              ? "bg-gradient-to-l from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>مدیریت مشاوران و رنج‌ها ({formatPersianNumber(agentsList.length)})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("neshasst")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === "neshasst"
              ? "bg-gradient-to-l from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>نظارت بر اتاق‌های نشست ({formatPersianNumber(neshasstSessions.length || 3)})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("barter_jv")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === "barter_jv"
              ? "bg-gradient-to-l from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>میز تهاتر و مشارکت دپارتمان</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("legal_settings")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === "legal_settings"
              ? "bg-gradient-to-l from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>اطلاعات حقوقی و پروانه دپارتمان</span>
        </button>
      </div>

      {/* TAB 1: Master Agency Listings */}
      {activeTab === "listings" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "همه فایل‌های دپارتمان" },
                { id: "sale", label: "فروش قطعی" },
                { id: "rent", label: "رهن و اجاره" },
                { id: "barter", label: "معاوضه تهاتر" },
                { id: "partnership", label: "پروژه‌های مشارکت" }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setPropertyFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    propertyFilter === f.id
                      ? "bg-purple-600 text-white shadow-sm shadow-purple-500/20"
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
              <span>ثبت مستقیم فایل سازمانی</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProperties.map(prop => (
              <div
                key={prop.id}
                className="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-purple-500/40 transition-all group"
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

                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-lg bg-purple-500 text-white text-[10px] font-bold">
                      فایل دپارتمان
                    </span>
                    {prop.isBarter && (
                      <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-black">
                        تهاتر
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-purple-400 transition-colors">
                      {prop.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                      {prop.address}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-purple-300 font-medium mt-1">
                      <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                      <span>مشاور پرونده: {prop.agentName || "مهندس فرهمند"}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
                    <span className="text-slate-400">
                      {prop.meters} متر • {prop.bedrooms} خواب
                    </span>
                    <span className="font-extrabold text-amber-400">
                      {prop.totalPrice || "توافقی"}
                    </span>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <Link
                      href={`/properties/${prop.id}`}
                      className="flex-1 text-center py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
                    >
                      مشاهده در سایت
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Agent Roster & Team Governance */}
      {activeTab === "agents" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span>کادر مشاوران و رنج‌های معاملاتی دپارتمان</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                مدیریت مشاوران رسمی، پایش قراردادها، تخصیص رنج‌ها و سنجش رضایت مشتریان.
              </p>
            </div>

            {!isInvitingAgent && (
              <button
                type="button"
                onClick={() => setIsInvitingAgent(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-l from-purple-500 to-indigo-600 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>افزودن مشاور جدید</span>
              </button>
            )}
          </div>

          {/* Add Agent Form */}
          {isInvitingAgent && (
            <form
              onSubmit={handleInviteAgent}
              className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-purple-500/40 space-y-4 shadow-xl animate-in zoom-in-95"
            >
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-purple-400" />
                <span>مشخصات مشاور جدید جهت عضویت در دپارتمان</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">نام و نام خانوادگی مشاور</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: مهندس رامین سلیمانی"
                    value={newAgentName}
                    onChange={e => setNewAgentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">شماره تلفن همراه مشاور</label>
                  <input
                    type="text"
                    required
                    placeholder="۰۹۱۲..."
                    value={newAgentPhone}
                    onChange={e => setNewAgentPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500 font-mono text-left"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">رنج و سمت تخصصی</label>
                  <select
                    value={newAgentRole}
                    onChange={e => setNewAgentRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="سرپرست رنج مشارکت و تهاتر">سرپرست رنج مشارکت و تهاتر</option>
                    <option value="مشاور ارشد رنج فروش مسکونی">مشاور ارشد رنج فروش مسکونی</option>
                    <option value="کارشناس رهن و اجاره آپارتمان">کارشناس رهن و اجاره آپارتمان</option>
                    <option value="مشاور تخصصی املاک تجاری و اداری">مشاور تخصصی املاک تجاری و اداری</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">محله و حوزه تمرکز</label>
                  <input
                    type="text"
                    value={newAgentDistrict}
                    onChange={e => setNewAgentDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsInvitingAgent(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
                >
                  تأیید و افزودن به کادر
                </button>
              </div>
            </form>
          )}

          {/* Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {agentsList.map(agent => (
              <div
                key={agent.id}
                className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold flex items-center justify-center text-lg shrink-0">
                    {agent.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{agent.name}</h4>
                    <span className="text-[11px] text-purple-400 font-semibold">{agent.role}</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800/60 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>حوزه فعالیت:</span>
                    <span className="text-white font-medium">{agent.specialtyDistrict}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>قراردادهای موفق:</span>
                    <span className="text-emerald-400 font-bold">{formatPersianNumber(agent.dealsCount)} قرارداد</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>فایل‌های فعال:</span>
                    <span className="text-amber-400 font-bold">{formatPersianNumber(agent.activeListingsCount)} فایل</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>امتیاز مشتریان:</span>
                    <span className="text-yellow-400 font-bold">{agent.rating} ★</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <a
                    href={`tel:${agent.phone}`}
                    className="flex-1 text-center py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
                  >
                    تماس مستقیم ({agent.phone})
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Neshasst Legal Supervision */}
      {activeTab === "neshasst" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-3 text-xs text-purple-300">
            <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0" />
            <span>
              نظارت عالیه حقوقی: شما به عنوان سرپرست ارشد قرارداد دپارتمان، بر استعلام ثبتی سند تک‌برگ، چک‌های تضمین و مفاد حقوقی پیش‌نویس نظارت کامل دارید.
            </span>
          </div>

          <div className="space-y-4">
            {neshasstSessions.map(session => (
              <div
                key={session.id}
                className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-purple-500/40 transition-all"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      {session.status === "live" ? "در حال مذاکره رسمی" : "هماهنگ‌شده"}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-white">{session.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400">{session.propertyAddress}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span>زمان: {session.scheduledDate} ساعت {session.scheduledTime}</span>
                    <span>خریدار: <strong className="text-white">{session.buyerName}</strong></span>
                    <span>مالک: <strong className="text-white">{session.sellerName}</strong></span>
                    <span>مشاور پرونده: <strong className="text-purple-300">{session.hostAgentName}</strong></span>
                  </div>
                </div>

                <button
                  type="button"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-l from-purple-500 to-indigo-600 hover:from-purple-400 text-white font-bold text-xs shrink-0 shadow-md shadow-purple-500/20 transition-all hover:scale-105 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>ورود به عنوان ناظر ارشد حقوقی</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Barter & JV Desk */}
      {activeTab === "barter_jv" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-300">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              میز تهاتر دارایی و مشارکت در ساخت: پرونده‌های با ارزش سنگین مالی که مستلزم ارزیابی کارشناسی خودرو، زمین یا تضامین بانکی سازنده برند می‌باشند.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  تهاتر ملک با خودرو خارجی
                </span>
                <span className="text-[11px] text-slate-500">در حال ارزیابی کارشناسی</span>
              </div>
              <h4 className="text-sm font-bold text-white">آپارتمان ۲۴۰ متری سعادت‌آباد علامه</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                طرف اول: آپارتمان شخصی به ارزش ۲۸ میلیارد تومان • طرف دوم: خودرو پورشه ماکان مدل ۲۰۱۷ + ۱۳ میلیارد نقدینگی.
              </p>
              <div className="pt-2 flex justify-between items-center text-xs border-t border-slate-800 text-slate-400">
                <span>مشاور مسئول: مهندس فرهمند</span>
                <span className="text-emerald-400 font-bold">جلسه نشست: فردا ساعت ۱۸</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  مشارکت در ساخت ۶۰/۴۰
                </span>
                <span className="text-[11px] text-slate-500">تأیید پروانه و دستور نقشه</span>
              </div>
              <h4 className="text-sm font-bold text-white">ملک ۶۰۰ متری کلنگی بر ۲۰ سعادت‌آباد</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                مالک: ۳ نفر وراث با سند تک‌برگ • سازنده: شرکت سازه‌گستر نوین با تعهد ۱۶ میلیارد بلاعوض اسکان و تحویل ۲۴ ماهه.
              </p>
              <div className="pt-2 flex justify-between items-center text-xs border-t border-slate-800 text-slate-400">
                <span>ناظر قرارداد: سرپرست دپارتمان</span>
                <span className="text-purple-400 font-bold">پیش‌نویس قرارداد آماده شد</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Legal & Administrative Settings */}
      {activeTab === "legal_settings" && (
        <div className="max-w-2xl space-y-6">
          <div className="rounded-3xl bg-slate-900/50 border border-slate-800 p-5 sm:p-7 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <span>اطلاعات حقوقی، پروانه کسب و مشخصات دپارتمان</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                این مشخصات به عنوان مشخصات رسمی دپارتمان بر روی قراردادها و کارت معرفی سازمانی درج می‌گردد.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[11px] text-slate-400 mb-1">نام رسمی دپارتمان / آژانس املاک</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm font-bold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">شماره پروانه کسب اتحادیه املاک تهران</label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={e => setLicenseNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm font-bold focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">تلفن سانترال دپارتمان (خطوط ویژه)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm font-bold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">نام مدیر عامل / دارنده جواز کسب</label>
                <input
                  type="text"
                  value={managerName}
                  onChange={e => setManagerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm font-bold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">سرپرست ارشد و ناظر حقوقی قراردادها</label>
                <input
                  type="text"
                  value={supervisorName}
                  onChange={e => setSupervisorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm font-bold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] text-slate-400 mb-1">نشانی پستی دفتر مرکزی دپارتمان</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm font-medium focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-2">
                <label className="block text-[11px] text-slate-400">مناطق و محله‌های تحت پوشش دپارتمان</label>
                <div className="flex flex-wrap gap-2">
                  {TEHRAN_DISTRICTS.map(district => {
                    const isSelected = districtsCovered.includes(district);
                    return (
                      <button
                        key={district}
                        type="button"
                        onClick={() => toggleDistrict(district)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-purple-600 text-white font-black shadow-sm"
                            : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {district}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end">
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveLegal}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-l from-purple-500 to-indigo-600 hover:from-purple-400 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-500/20 transition-all disabled:opacity-50"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saving ? "در حال ذخیره‌سازی..." : "ذخیره اطلاعات رسمی دپارتمان"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
