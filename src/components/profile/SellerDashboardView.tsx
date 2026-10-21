"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  KeyRound,
  Building,
  Building2,
  Home,
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
  Inbox,
  Eye,
  Check,
  X,
  Hammer,
  FileCheck2,
  SlidersHorizontal,
  DollarSign
} from "lucide-react";
import { formatPersianNumber } from "@/data/properties";

export default function SellerDashboardView() {
  const [activeTab, setActiveTab] = useState<"properties" | "proposals" | "neshasst" | "resume" | "settings">("properties");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Seller Profile State
  const [sellerType, setSellerType] = useState<"owner" | "builder">("owner");
  const [companyName, setCompanyName] = useState("");
  const [nationalId, setNationalId] = useState("۰۰۱۲۳۴۵۶۷۸");
  const [nationalIdVerified, setNationalIdVerified] = useState(true);
  const [deedVerified, setDeedVerified] = useState(true);
  const [isBarterAccepted, setIsBarterAccepted] = useState(true);
  const [barterTargetDescription, setBarterTargetDescription] = useState("تمایل به معاوضه با خودروهای خارجی یا زمین سنددار.");

  // Data
  const [ownedProperties, setOwnedProperties] = useState<any[]>([]);
  const [inboundProposals, setInboundProposals] = useState<any[]>([]);
  const [neshasstSessions, setNeshasstSessions] = useState<any[]>([]);
  const [builderProjects, setBuilderProjects] = useState<any[]>([]);

  // Project Modal for Builder
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDistrict, setNewProjectDistrict] = useState("سعادت‌آباد");
  const [newProjectUnits, setNewProjectUnits] = useState("۱۰");
  const [newProjectYear, setNewProjectYear] = useState("۱۴۰۲");
  const [newProjectStyle, setNewProjectStyle] = useState("مدرن مینیمال");

  // Inbound Action Toast
  const [actionToast, setActionToast] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadSellerData() {
      try {
        setLoading(true);
        const res = await fetch("/api/profile/seller");
        if (!res.ok) throw new Error("Failed to load seller profile");
        const data = await res.json();
        if (isMounted && data.success) {
          if (data.sellerProfile) {
            const sp = data.sellerProfile;
            if (sp.sellerType) setSellerType(sp.sellerType as any);
            if (sp.companyName) setCompanyName(sp.companyName);
            if (sp.nationalId) setNationalId(sp.nationalId);
            if (sp.nationalIdVerified !== undefined) setNationalIdVerified(sp.nationalIdVerified);
            if (sp.deedVerified !== undefined) setDeedVerified(sp.deedVerified);
            if (sp.isBarterAccepted !== undefined) setIsBarterAccepted(sp.isBarterAccepted);
            if (sp.barterTargetDescription) setBarterTargetDescription(sp.barterTargetDescription);
            if (sp.builderResumeJson) {
              try {
                const parsed = JSON.parse(sp.builderResumeJson);
                if (Array.isArray(parsed)) setBuilderProjects(parsed);
              } catch {}
            }
          }
          if (data.ownedProperties) setOwnedProperties(data.ownedProperties);
          if (data.inboundProposals) setInboundProposals(data.inboundProposals);
          if (data.neshasstSessions) setNeshasstSessions(data.neshasstSessions);
        }
      } catch (err: any) {
        console.error("Seller load error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadSellerData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Save Settings & Sub-persona
  const handleSaveProfile = async (newType?: "owner" | "builder") => {
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);
    const targetType = newType || sellerType;
    try {
      const res = await fetch("/api/profile/seller", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerType: targetType,
          companyName,
          nationalId,
          nationalIdVerified,
          deedVerified,
          isBarterAccepted,
          barterTargetDescription,
          builderResumeJson: builderProjects
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا در ذخیره‌سازی");
      if (newType) setSellerType(newType);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "خطا در برقراری ارتباط");
    } finally {
      setSaving(false);
    }
  };

  // Add Builder Project
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    const newProject = {
      id: `proj-${Date.now()}`,
      title: newProjectTitle.trim(),
      district: newProjectDistrict.trim(),
      unitsCount: Number(newProjectUnits) || 1,
      year: newProjectYear.trim(),
      style: newProjectStyle.trim(),
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    };

    const updated = [newProject, ...builderProjects];
    setBuilderProjects(updated);
    setIsAddingProject(false);
    setNewProjectTitle("");

    fetch("/api/profile/seller", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ builderResumeJson: updated })
    }).catch(() => {});
  };

  // Accept/Decline Inbound Proposal
  const handleProposalAction = (id: string, action: "accept" | "decline") => {
    if (action === "accept") {
      setActionToast("پیشنهاد مورد نظر تأیید شد و جهت هماهنگی جلسه نشست به سرپرست دپارتمان ارجاع گردید.");
    } else {
      setActionToast("پیشنهاد مورد نظر رد شد.");
    }
    setInboundProposals(prev => prev.filter(p => p.id !== id));
    setTimeout(() => setActionToast(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {actionToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 text-xs sm:text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{actionToast}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 text-xs sm:text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>مشخصات مالک و سازنده با موفقیت ذخیره شد.</span>
        </div>
      )}

      {/* Sub-Persona Selector Banner (مالک شخصی vs سازنده و شرکت ساختمانی) */}
      <div className="p-4 rounded-3xl bg-slate-900/80 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
            {sellerType === "builder" ? <Hammer className="w-5 h-5" /> : <Home className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white">
                {sellerType === "builder" ? "میز کار سازنده و شرکت ساختمانی" : "میز کار مالک شخصی و موجر مسکن"}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                {sellerType === "builder" ? "پروژه‌ها و مشارکت" : "فروش و رهن شخصی"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {sellerType === "builder"
                ? "مدیریت واحدهای نوساز، پیش‌فروش، شروط مشارکت در ساخت و ویترین رزومه سازنده."
                : "مدیریت فایل ملکی شخصی، بررسی پیشنهادات معاوضه تهاتر و هماهنگی جلسات نشست رسمی."}
            </p>
          </div>
        </div>

        {/* Persona Switch Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => handleSaveProfile("owner")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              sellerType === "owner"
                ? "bg-emerald-500 text-slate-950 font-black shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            مالک شخصی مسکن
          </button>
          <button
            type="button"
            onClick={() => handleSaveProfile("builder")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              sellerType === "builder"
                ? "bg-emerald-500 text-slate-950 font-black shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            سازنده و انبوه‌ساز
          </button>
        </div>
      </div>

      {/* KPI Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="block text-2xl font-black text-emerald-400">
            {formatPersianNumber(ownedProperties.length)}
          </span>
          <span className="text-xs text-slate-400 font-medium mt-1">املاک ثبت‌شده من</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="block text-2xl font-black text-amber-400">
            {formatPersianNumber(1420)}
          </span>
          <span className="text-xs text-slate-400 font-medium mt-1">بازدید خریداران</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="block text-2xl font-black text-cyan-400">
            {formatPersianNumber(inboundProposals.length)}
          </span>
          <span className="text-xs text-slate-400 font-medium mt-1">پیشنهاد تهاتر و مشارکت</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="block text-2xl font-black text-blue-400">
            {formatPersianNumber(neshasstSessions.length)}
          </span>
          <span className="text-xs text-slate-400 font-medium mt-1">جلسه نشست قرارداد</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("properties")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === "properties"
              ? "bg-gradient-to-l from-emerald-500 to-teal-600 text-slate-950 font-black shadow-md shadow-emerald-500/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>املاک و فایل‌های من ({formatPersianNumber(ownedProperties.length)})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("proposals")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === "proposals"
              ? "bg-gradient-to-l from-emerald-500 to-teal-600 text-slate-950 font-black shadow-md shadow-emerald-500/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>صندوق پیشنهادات دریافتی ({formatPersianNumber(inboundProposals.length)})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("neshasst")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === "neshasst"
              ? "bg-gradient-to-l from-emerald-500 to-teal-600 text-slate-950 font-black shadow-md shadow-emerald-500/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>جلسات نشست و قرارداد ({formatPersianNumber(neshasstSessions.length)})</span>
        </button>

        {sellerType === "builder" && (
          <button
            type="button"
            onClick={() => setActiveTab("resume")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === "resume"
                ? "bg-gradient-to-l from-emerald-500 to-teal-600 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Hammer className="w-4 h-4" />
            <span>رزومه و پروژه‌های سازنده ({formatPersianNumber(builderProjects.length)})</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === "settings"
              ? "bg-gradient-to-l from-emerald-500 to-teal-600 text-slate-950 font-black shadow-md shadow-emerald-500/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>احراز هویت و اسناد مالکیت</span>
        </button>
      </div>

      {/* TAB 1: Owned Properties */}
      {activeTab === "properties" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <span>املاک و آگهی‌های فعال شما</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                فایل‌های ثبت‌شده توسط شما که در دسترس هزاران متقاضی مسکن و مشاوران رسمی تهران قرار دارد.
              </p>
            </div>

            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-l from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>ثبت ملک یا پروژه جدید</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ownedProperties.map(prop => (
              <div
                key={prop.id}
                className="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-emerald-500/40 transition-all group"
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
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-500 text-slate-950 text-[10px] font-black">
                      منتشر شده
                    </span>
                    {prop.isBarter && (
                      <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-black">
                        آماده تهاتر
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-emerald-400 transition-colors">
                      {prop.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                      {prop.address}
                    </p>
                  </div>

                  {/* Analytics Bar */}
                  <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>{formatPersianNumber(340)} بازدید</span>
                    </span>
                    <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <Inbox className="w-3.5 h-3.5 text-amber-400" />
                      <span>{formatPersianNumber(2)} پیشنهاد تهاتر</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
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

      {/* TAB 2: Inbound Proposals */}
      {activeTab === "proposals" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-300">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              صندوق پیشنهادات تهاتر و مشارکت: پیشنهاداتی که متقاضیان و شرکت‌های سازنده مستقیماً برای فایل‌های ملکی شما ثبت کرده‌اند.
            </span>
          </div>

          {inboundProposals.length === 0 ? (
            <div className="text-center p-12 rounded-3xl bg-slate-900/40 border border-slate-800 max-w-md mx-auto space-y-3">
              <Inbox className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">پیشنهاد جدیدی در صندوق دریافت نشد</h3>
              <p className="text-xs text-slate-400">به محض ثبت پیشنهاد تهاتر یا مشارکت توسط کاربران، در این قسمت به شما اطلاع داده می‌شود.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {inboundProposals.map(prop => (
                <div
                  key={prop.id}
                  className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-amber-500/40 transition-all"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        {prop.type === "barter" ? "پیشنهاد معاوضه تهاتر" : "پیشنهاد مشارکت در ساخت"}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-white">
                        مربوط به: {prop.propertyTitle}
                      </h4>
                      <span className="text-[11px] text-slate-500">({prop.date})</span>
                    </div>

                    {/* Proposal Details Box */}
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-slate-400">دارایی پیشنهادی متقاضی:</span>
                        <span className="font-black text-amber-400">{prop.offeredAssetTitle}</span>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-slate-400">ارزش تخمینی / شرایط:</span>
                        <span className="text-white font-bold">{prop.offeredAssetValuation}</span>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-slate-400">شرایط نقدینگی و مابه‌التفاوت:</span>
                        <span className="text-emerald-400 font-bold">{prop.cashDelta}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>پیشنهاد دهنده: <strong className="text-white">{prop.senderName}</strong></span>
                      <span>شماره همراه: <strong className="text-white font-mono" dir="ltr">{prop.senderPhone}</strong></span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleProposalAction(prop.id, "accept")}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-l from-emerald-500 to-teal-600 hover:from-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-105"
                    >
                      <Check className="w-4 h-4" />
                      <span>قبول و هماهنگی نشست</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleProposalAction(prop.id, "decline")}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 text-xs font-semibold transition-all"
                    >
                      <X className="w-4 h-4" />
                      <span>رد پیشنهاد</span>
                    </button>
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
              جلسات قرارداد رسمی هماهنگ‌شده با حضور شما (مالک)، متقاضی و سرپرست حقوقی دپارتمان.
            </p>
          </div>

          {neshasstSessions.length === 0 ? (
            <div className="text-center p-12 rounded-3xl bg-slate-900/40 border border-slate-800 max-w-md mx-auto space-y-3">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">جلسه نشست فعالی ثبت نشده است</h3>
              <p className="text-xs text-slate-400">به محض توافق با یکی از خریداران، سرپرست دپارتمان اتاق قرارداد آنلاین را ایجاد می‌فرماید.</p>
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
                      <span>دپارتمان ناظر: {session.hostAgencyName}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-l from-emerald-500 to-teal-600 hover:from-emerald-400 text-slate-950 font-bold text-xs shrink-0 shadow-md shadow-emerald-500/20 transition-all hover:scale-105"
                  >
                    ورود به اتاق مذاکره و امضای قرارداد
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Builder Resume & Projects (Visible for Builder persona) */}
      {activeTab === "resume" && sellerType === "builder" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Hammer className="w-5 h-5 text-emerald-400" />
                <span>ویترین پروژه‌ها و رزومه ساختمانی سازنده</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                نمایش پروژه‌های شاخص اجرا شده جهت افزایش اعتماد مالکان در قراردادهای مشارکت در ساخت.
              </p>
            </div>

            {!isAddingProject && (
              <button
                type="button"
                onClick={() => setIsAddingProject(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-l from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن نمونه‌کار جدید</span>
              </button>
            )}
          </div>

          {/* Add Project Form */}
          {isAddingProject && (
            <form
              onSubmit={handleAddProject}
              className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-emerald-500/40 space-y-4 shadow-xl animate-in zoom-in-95"
            >
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>مشخصات پروژه اجرا شده</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">نام یا عنوان پروژه</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: برج‌باغ فرمانیه یا ساختمان گلستان"
                    value={newProjectTitle}
                    onChange={e => setNewProjectTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">منطقه / محله اجرا</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: سعادت‌آباد، علامه شمالی"
                    value={newProjectDistrict}
                    onChange={e => setNewProjectDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">تعداد واحدها</label>
                  <input
                    type="number"
                    value={newProjectUnits}
                    onChange={e => setNewProjectUnits(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">سبک معماری و متریال</label>
                  <input
                    type="text"
                    placeholder="مثال: مدرن با نمای کرتین‌وال و لابی مجلل"
                    value={newProjectStyle}
                    onChange={e => setNewProjectStyle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingProject(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  افزودن به ویترین رزومه
                </button>
              </div>
            </form>
          )}

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {builderProjects.map(proj => (
              <div
                key={proj.id}
                className="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden group hover:border-emerald-500/40 transition-all flex flex-col justify-between"
              >
                <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                  <Image
                    src={proj.image}
                    alt={proj.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-emerald-400 border border-slate-800">
                    {proj.district}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                  <p className="text-xs text-slate-400">{proj.style}</p>
                  <div className="flex justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                    <span>تعداد واحدها: {proj.unitsCount} واحد</span>
                    <span>سال اتمام: {proj.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Settings & Deed Verification */}
      {activeTab === "settings" && (
        <div className="max-w-2xl space-y-6">
          <div className="rounded-3xl bg-slate-900/50 border border-slate-800 p-5 sm:p-7 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>احراز هویت و تأییدیه اسناد مالکیت</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                تأیید کدملی و استعلام اسناد مالکیت از طریق ثبت اسناد رسمی، نشان «مالک تأیید شده» را برای املاک شما فعال می‌سازد.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">کد ملی مالک</label>
                <input
                  type="text"
                  value={nationalId}
                  onChange={e => setNationalId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm font-bold focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">نام شرکت یا برند سازنده (اختیاری)</label>
                <input
                  type="text"
                  placeholder="مثال: گروه ساختمانی حیدری"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="barterCheck"
                    checked={isBarterAccepted}
                    onChange={e => setIsBarterAccepted(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-slate-950 border-slate-800"
                  />
                  <label htmlFor="barterCheck" className="text-xs font-bold text-white cursor-pointer">
                    پذیرش تهاتر برای املاک من فعال باشد
                  </label>
                </div>

                {isBarterAccepted && (
                  <div className="pt-2">
                    <label className="block text-[11px] text-slate-400 mb-1">توضیحات و دارایی‌های مدنظر جهت معاوضه</label>
                    <textarea
                      rows={3}
                      value={barterTargetDescription}
                      onChange={e => setBarterTargetDescription(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs leading-relaxed focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end">
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSaveProfile()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-l from-emerald-500 to-teal-600 hover:from-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saving ? "در حال ذخیره‌سازی..." : "ذخیره تنظیمات مالک"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
