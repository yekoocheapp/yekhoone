"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  getPropertyById,
  formatPersianNumber,
  initialProperties,
  Property
} from "@/data/properties";
import {
  ArrowRight,
  MapPin,
  Building2,
  Calendar,
  Maximize2,
  BedDouble,
  Car,
  Layers,
  ShieldCheck,
  Phone,
  MessageSquare,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Calculator,
  Compass,
  FileCheck2,
  Flame,
  Wind,
  Home,
  Check,
  Clock,
  Send,
  RotateCw,
  Cpu,
  Image as ImageIcon,
  Video,
  Eye,
  Sparkles as SparklesIcon
} from "lucide-react";
import VirtualTourViewer from "@/components/VirtualTourViewer";
import VideoTourPlayer from "@/components/VideoTourPlayer";
import { TourRoom } from "@/data/properties";

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const property = getPropertyById(id) || initialProperties[0];

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [phoneRevealed, setPhoneRevealed] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [mediaMode, setMediaMode] = useState<"photos" | "video" | "tour360">(
    property.hasVirtualTour ? "tour360" : "photos"
  );

  const tourRooms: TourRoom[] = property.virtualTour?.rooms || [
    {
      id: "living-room",
      name: "سالن پذیرایی و نشیمن",
      panoramaUrl: "",
      description: `${property.title} - سالن نورگیر اصلی`,
      hotspots: [
        {
          id: "h-win",
          title: "پنجره و نورگیر عالی",
          description: "نورگیر مستقیم با پنجره‌های دوجداره استاندارد.",
          type: "info",
          pitch: 5,
          yaw: 40
        },
        {
          id: "h-to-kitchen",
          title: "ورود به آشپزخانه",
          description: "دسترسی به کابینت‌ها و فضای پخت و پز",
          type: "portal",
          targetRoomId: "kitchen",
          pitch: -5,
          yaw: 120
        }
      ]
    },
    {
      id: "kitchen",
      name: "آشپزخانه و مطبخ",
      panoramaUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=2000&q=80",
      description: "آشپزخانه با متریال عالی و اتصالات مدرن",
      hotspots: [
        {
          id: "h-k-to-living",
          title: "بازگشت به پذیرایی",
          description: "ورود به سالن",
          type: "portal",
          targetRoomId: "living-room",
          pitch: -5,
          yaw: -60
        }
      ]
    }
  ];

  // Property-specific conversion slider
  const [customDeposit, setCustomDeposit] = useState<number>(
    property.deposit / 1000000
  );
  const baseTotalRahnMillions =
    property.deposit / 1000000 + (property.rent / 1000000) / 0.03;
  const calculatedRentMillions = Math.max(
    0,
    (baseTotalRahnMillions - customDeposit) * 0.03
  );

  const similarProperties = initialProperties.filter(
    (p) => p.id !== property.id && p.district === property.district
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-amber-400 transition-colors"
          >
            <ArrowRight className="w-4 h-4 text-amber-400" />
            <span>بازگشت به جستجوی املاک</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: property.title,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("لینک این ملک در کلیپ‌بورد کپی شد!");
                }
              }}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              title="اشتراک‌گذاری"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className={`p-2 rounded-xl bg-slate-900 border border-slate-800 transition-colors ${
                saved ? "text-red-500 fill-red-500" : "text-slate-300 hover:text-red-400"
              }`}
              title="نشان کردن ملک"
            >
              <Heart className={`w-4 h-4 ${saved ? "fill-red-500" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 flex-1 w-full">
        {/* Breadcrumb & Header Info */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link href="/" className="hover:text-slate-300">
              خانه
            </Link>
            <span>/</span>
            <span>تهران</span>
            <span>/</span>
            <span className="text-slate-300">{property.district}</span>
            <span>/</span>
            <span className="text-amber-400">کد فایل: YK-{property.id + 1040}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-snug">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-500 text-slate-950">
                {property.type === "rent" ? "رهن و اجاره" : "فروش قطعی"}
              </span>
              <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                تایید شده توسط کارشناس
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{property.address}</span>
            </div>

            <Link
              href={`/map?propertyId=${property.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all shadow-sm group"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
              <span>مشاهده پلاک این ساختمان در نقشه ۳ بعدی تهران</span>
            </Link>

            <span className="text-slate-600 mr-2">•</span>
            <span className="text-slate-500">{property.createdAt}</span>
            {property.lastAlgorithmicBump && (
              <>
                <span className="text-slate-600 mr-2">•</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-medium">
                  <RotateCw className="w-3 h-3 text-indigo-400" />
                  <span>نردبان هوشمند الگوریتمی: {property.lastAlgorithmicBump}</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Top Grid: Gallery & Sticky Contact Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1 & 2: Gallery & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* 3-Way Media Mode Switcher (Photos / Video / 360 Virtual Tour / 3D Map) */}
            <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {/* Mode 1: Static Photos */}
                <button
                  onClick={() => setMediaMode("photos")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    mediaMode === "photos"
                      ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                      : "bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/80"
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>تصاویر ({property.images.length})</span>
                </button>

                {/* Mode 2: Video Walkthrough */}
                <button
                  onClick={() => setMediaMode("video")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    mediaMode === "video"
                      ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                      : "bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/80"
                  }`}
                >
                  <Video className="w-4 h-4 text-red-400" />
                  <span>ویدیو تور ملک</span>
                  <span className="px-1.5 py-0.2 rounded-md bg-red-500/20 text-red-400 text-[10px] font-extrabold border border-red-500/30">
                    4K
                  </span>
                </button>

                {/* Mode 3: 360 Virtual Tour */}
                <button
                  onClick={() => setMediaMode("tour360")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    mediaMode === "tour360"
                      ? "bg-gradient-to-l from-indigo-500 via-purple-500 to-amber-500 text-white shadow-lg shadow-indigo-500/25"
                      : "bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/80"
                  }`}
                >
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>تور مجازی ۳۶۰°</span>
                  <span className="px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-extrabold border border-amber-500/30 animate-pulse">
                    فوق‌پیشرفته
                  </span>
                </button>

                {/* Mode 4: 3D Map Cadastral Twin */}
                <Link
                  href={`/map?propertyId=${property.id}`}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap bg-slate-950/80 text-amber-400 hover:text-white hover:bg-slate-800 border border-amber-500/30 shadow-sm"
                >
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>پلاک در نقشه ۳ بعدی</span>
                </Link>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 px-2">
                <SparklesIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>بازدید هوشمند بدون نیاز به حضور فیزیکی</span>
              </div>
            </div>

            {/* Media Mode 1: Static Photos Gallery */}
            {mediaMode === "photos" && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden p-2 sm:p-3 shadow-xl animate-in fade-in duration-200">
                {/* Main Image */}
                <div className="relative h-72 sm:h-96 md:h-[420px] w-full rounded-2xl overflow-hidden bg-slate-950">
                  <Image
                    src={property.images[activeImageIndex]}
                    alt={property.title}
                    fill
                    className="object-cover"
                    priority
                  />

                  {/* Left/Right Navigation */}
                  {property.images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setActiveImageIndex((prev) =>
                            prev === 0 ? property.images.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md transition-all shadow-lg"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          setActiveImageIndex((prev) =>
                            prev === property.images.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md transition-all shadow-lg"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Counter Pill */}
                  <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-xs font-medium border border-white/10">
                    {activeImageIndex + 1} از {property.images.length} تصویر
                  </div>
                </div>

                {/* Thumbnails Row */}
                {property.images.length > 1 && (
                  <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                    {property.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                          activeImageIndex === idx
                            ? "border-amber-500 scale-105 shadow-md"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={img}
                          alt="پیش‌نمایش تصویر"
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Media Mode 2: Video Walkthrough */}
            {mediaMode === "video" && (
              <div className="animate-in fade-in duration-200">
                <VideoTourPlayer
                  videoUrl={property.videoUrl}
                  posterImage={property.images[0]}
                  propertyTitle={property.title}
                  agentName={property.agentName}
                  agentPhone={property.agentPhone}
                  onBookVisit={() => setBookingModalOpen(true)}
                />
              </div>
            )}

            {/* Media Mode 3: 360° Interactive Virtual Tour */}
            {mediaMode === "tour360" && (
              <div className="animate-in fade-in duration-200">
                <VirtualTourViewer
                  rooms={tourRooms}
                  initialRoomId={property.virtualTour?.startingRoomId}
                  propertyTitle={property.title}
                />
              </div>
            )}

            {/* Quick Specs Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                <Maximize2 className="w-6 h-6 text-amber-400 mx-auto mb-1.5" />
                <span className="text-xs text-slate-400 block mb-0.5">متراژ</span>
                <span className="font-extrabold text-white text-base">
                  {formatPersianNumber(property.meters)} متر
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                <BedDouble className="w-6 h-6 text-amber-400 mx-auto mb-1.5" />
                <span className="text-xs text-slate-400 block mb-0.5">اتاق خواب</span>
                <span className="font-extrabold text-white text-base">
                  {formatPersianNumber(property.bedrooms)} خواب
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                <Layers className="w-6 h-6 text-amber-400 mx-auto mb-1.5" />
                <span className="text-xs text-slate-400 block mb-0.5">طبقه</span>
                <span className="font-extrabold text-white text-base">
                  {property.floor} از {property.totalFloors}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                <Calendar className="w-6 h-6 text-amber-400 mx-auto mb-1.5" />
                <span className="text-xs text-slate-400 block mb-0.5">سن بنا</span>
                <span className="font-extrabold text-white text-base">
                  {property.age === 0 ? "نوساز" : `${formatPersianNumber(property.age)} سال ساخت`}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
              <h2 className="text-lg font-bold text-white mb-3">توضیحات و مشخصات تکمیلی</h2>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line mb-6">
                {property.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800">
                {property.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Architectural & Engineering Details */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">امکانات و جزئیات سازه</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Car className="w-4 h-4 text-amber-400" />
                    پارکینگ اختصاصی:
                  </span>
                  <span className="font-bold text-white">
                    {property.hasParking ? "دارد (سندی بدون مزاحم)" : "ندارد"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    آسانسور:
                  </span>
                  <span className="font-bold text-white">
                    {property.hasElevator ? "دارد (اتوماتیک تمام‌استیل)" : "ندارد"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Home className="w-4 h-4 text-amber-400" />
                    انباری اختصاصی:
                  </span>
                  <span className="font-bold text-white">
                    {property.hasStorage ? "دارد (سندی)" : "ندارد"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-amber-400" />
                    جهت جغرافیایی:
                  </span>
                  <span className="font-bold text-white">{property.orientation}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Wind className="w-4 h-4 text-cyan-400" />
                    سیستم سرمایشی:
                  </span>
                  <span className="font-bold text-white">{property.coolingSystem}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    سیستم گرمایشی:
                  </span>
                  <span className="font-bold text-white">{property.heatingSystem}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    نوع کفپوش:
                  </span>
                  <span className="font-bold text-white">{property.flooring}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400 flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-emerald-400" />
                    وضعیت سند:
                  </span>
                  <span className="font-bold text-emerald-400">{property.deedStatus}</span>
                </div>
              </div>
            </div>

            {/* Rahn/Ejareh Custom Converter for this unit */}
            {property.type === "rent" && (
              <div className="bg-gradient-to-l from-indigo-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <Calculator className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-base text-white">
                    محاسبه‌گر پیشنهاد تبدیل رهن برای این واحد
                  </h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  می‌توانید میزان ودیعه را مطابق با بودجه خود تغییر دهید تا ببینید بر اساس فرمول عرف بازار (۳ درصد)، اجاره ماهانه چقدر تغییر می‌کند:
                </p>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-400">ودیعه پیشنهادی شما:</span>
                      <span className="font-bold text-amber-400 text-sm">
                        {formatPersianNumber(customDeposit)} میلیون تومان
                      </span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max={Math.round(baseTotalRahnMillions)}
                      step="50"
                      value={customDeposit}
                      onChange={(e) => setCustomDeposit(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block mb-0.5">اجاره ماهانه تخمینی:</span>
                      <span className="text-xl font-extrabold text-white">
                        {formatPersianNumber(Math.round(calculatedRentMillions))} میلیون تومان
                      </span>
                    </div>
                    <div className="text-left text-[11px] text-slate-500">
                      معادل رهن کامل: {formatPersianNumber(Math.round(baseTotalRahnMillions))} م
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Column 3: Sticky Pricing & Agent Card */}
          <div className="space-y-6">
            {/* Price Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl sticky top-20">
              <div className="mb-6 pb-6 border-b border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">شرایط مالی قرارداد</span>
                {property.type === "rent" ? (
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-slate-400 block">مبلغ ودیعه (رهن):</span>
                      <span className="text-2xl font-black text-white">
                        {formatPersianNumber(property.deposit)}
                        <span className="text-xs font-normal text-slate-400 mr-1.5">تومان</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">اجاره ماهانه:</span>
                      <span className="text-2xl font-black text-amber-400">
                        {property.rent === 0 ? "رهن کامل" : `${formatPersianNumber(property.rent)} تومان`}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs text-slate-400 block">قیمت کل معامله:</span>
                    <span className="text-2xl font-black text-amber-400">
                      {formatPersianNumber(property.totalPrice || 0)}
                      <span className="text-xs font-normal text-slate-400 mr-1.5">تومان</span>
                    </span>
                    {property.pricePerMeter && (
                      <span className="text-xs text-slate-500 block mt-1">
                        متری {formatPersianNumber(property.pricePerMeter)} تومان
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Agent Profile & Contact */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-base shrink-0">
                    {property.agentName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-sm">{property.agentName}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-[11px] text-slate-400">{property.agentRole}</p>
                    <p className="text-[11px] text-amber-400 font-semibold">{property.agencyName}</p>
                  </div>
                </div>

                {/* Rating & Performance Pill */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <span className="text-slate-400">امتیاز رضایت مشتریان:</span>
                  <span className="font-bold text-amber-400 flex items-center gap-1">
                    ★ {property.agentRating} ({property.agentDealsCount} معامله موفق)
                  </span>
                </div>

                {/* Direct Call Button */}
                {phoneRevealed ? (
                  <a
                    href={`tel:${property.agentPhone}`}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all"
                  >
                    <Phone className="w-5 h-5" />
                    <span dir="ltr">{property.agentPhone}</span>
                    <span className="text-xs font-medium mr-1">(تماس تلفنی)</span>
                  </a>
                ) : (
                  <button
                    onClick={() => setPhoneRevealed(true)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02]"
                  >
                    <Phone className="w-5 h-5" />
                    <span>نمایش شماره مستقیم مشاور</span>
                  </button>
                )}

                {/* Schedule Viewing CTA */}
                <button
                  onClick={() => setBookingModalOpen(true)}
                  className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>درخواست هماهنگی بازدید حضوری</span>
                </button>

                <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                  🛡️ تمامی اطلاعات این آگهی توسط تیم بازرسی «یه خونه» بررسی شده است. بدون پرداخت کمیسیون به پلتفرم.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <section className="mt-16 pt-10 border-t border-slate-900">
            <h2 className="text-xl font-bold text-white mb-6">
              فایل‌های ملکی مشابه در {property.district}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((sim) => (
                <Link
                  key={sim.id}
                  href={`/property/${sim.id}`}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all group block"
                >
                  <div className="relative h-48 w-full bg-slate-950">
                    <Image
                      src={sim.images[0]}
                      alt={sim.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors line-clamp-1 mb-2">
                      {sim.title}
                    </h3>
                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                      <span>{sim.meters} متر • {sim.bedrooms} خواب</span>
                      <span className="text-amber-400 font-bold">
                        {sim.rent === 0 ? "رهن کامل" : `${formatPersianNumber(sim.deposit)} ودیعه`}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ==================== BOOKING MODAL ==================== */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl animate-in fade-in zoom-in-95">
            <button
              onClick={() => {
                setBookingModalOpen(false);
                setBookingSuccess(false);
              }}
              className="absolute top-5 left-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            {bookingSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 mx-auto flex items-center justify-center text-emerald-400">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">درخواست شما ثبت شد!</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  مشاور مربوطه ({property.agentName}) طی ۱ ساعت آینده جهت هماهنگی نهایی ساعت بازدید با شما تماس خواهد گرفت.
                </p>
                <button
                  onClick={() => {
                    setBookingModalOpen(false);
                    setBookingSuccess(false);
                  }}
                  className="w-full mt-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  متشکرم، بازگشت
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">هماهنگی بازدید حضوری ملک</h3>
                    <p className="text-xs text-slate-400">مشاور: {property.agentName}</p>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setBookingSuccess(true);
                  }}
                  className="space-y-4 text-xs"
                >
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">نام و نام خانوادگی شما</label>
                    <input
                      required
                      type="text"
                      placeholder="مثال: علی رضایی"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">شماره تلفن همراه</label>
                    <input
                      required
                      type="tel"
                      placeholder="۰۹۱۲..."
                      dir="ltr"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-left"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">زمان پیشنهادی شما برای بازدید</label>
                    <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500">
                      <option>امروز عصر (ساعت ۱۷ الی ۲۰)</option>
                      <option>فردا صبح (ساعت ۱۰ الی ۱۳)</option>
                      <option>فردا عصر (ساعت ۱۷ الی ۲۰)</option>
                      <option>پایان هفته / پنج‌شنبه</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 rounded-xl bg-gradient-to-l from-amber-500 to-orange-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20"
                  >
                    ارسال درخواست بازدید
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
