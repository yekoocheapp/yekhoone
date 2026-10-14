"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Search,
  MapPin,
  Building2,
  Home,
  Key,
  ShieldCheck,
  Phone,
  Calculator,
  PlusCircle,
  Sparkles,
  ChevronDown,
  BedDouble,
  Maximize2,
  Car,
  Layers,
  Heart,
  Share2,
  CheckCircle2,
  X,
  Compass,
  ArrowRightLeft,
  Building
} from "lucide-react";

// Mock verified property files across Tehran
interface Property {
  id: number;
  title: string;
  district: string;
  address: string;
  type: "rent" | "sale";
  propertyType: string;
  meters: number;
  bedrooms: number;
  floor: string;
  hasParking: boolean;
  hasElevator: boolean;
  hasStorage: boolean;
  deposit: number; // in Tomans
  rent: number;    // in Tomans
  totalPrice?: number;
  agencyName: string;
  agentName: string;
  agentPhone: string;
  isVerified: boolean;
  image: string;
  tags: string[];
}

const mockProperties: Property[] = [
  {
    id: 1,
    title: "آپارتمان ۱۲۰ متری، نورگیر عالی، علامه شمالی",
    district: "سعادت‌آباد",
    address: "سعادت‌آباد، خیابان علامه شمالی، کوچه هجدهم",
    type: "rent",
    propertyType: "آپارتمان مسکونی",
    meters: 120,
    bedrooms: 2,
    floor: "طبقه سوم (۲ واحدی)",
    hasParking: true,
    hasElevator: true,
    hasStorage: true,
    deposit: 600000000,
    rent: 32000000,
    agencyName: "املاک نوین سعادت‌آباد",
    agentName: "مهرداد عزیزی (مشاور ارشد)",
    agentPhone: "۰۹۱۲۳۴۵۶۷۸۹",
    isVerified: true,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    tags: ["نوساز", "لابی مجلل", "سرایداری ۲۴ ساعته"]
  },
  {
    id: 2,
    title: "واحد ۱۴۵ متری لوکس، فاز یک با تراس قابل چیدمان",
    district: "شهرک غرب",
    address: "شهرک غرب، بلوار ایران‌زمین، خیابان گلستان",
    type: "rent",
    propertyType: "آپارتمان مسکونی",
    meters: 145,
    bedrooms: 3,
    floor: "طبقه پنجم (تک‌واحدی)",
    hasParking: true,
    hasElevator: true,
    hasStorage: true,
    deposit: 1200000000,
    rent: 45000000,
    agencyName: "املاک دیپلمات غرب",
    agentName: "مهندس حسینی",
    agentPhone: "۰۹۱۹۸۷۶۵۴۳۲",
    isVerified: true,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    tags: ["مستر روم", "ویو ابدی", "استخر و سونا"]
  },
  {
    id: 3,
    title: "۸۵ متری خوش‌نقشه، سردار جنگل، بدون پرتی",
    district: "پونک",
    address: "پونک، سردار جنگل شمالی، کوچه شقایق",
    type: "rent",
    propertyType: "آپارتمان مسکونی",
    meters: 85,
    bedrooms: 2,
    floor: "طبقه دوم با آسانسور",
    hasParking: true,
    hasElevator: true,
    hasStorage: true,
    deposit: 850000000,
    rent: 0,
    agencyName: "املاک کاج پونک",
    agentName: "امیر رضایی",
    agentPhone: "۰۹۳۵۱۲۳۴۵۶۷",
    isVerified: true,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    tags: ["رهن کامل", "سالن پرده‌خور", "دسترسی عالی به اشرفی"]
  },
  {
    id: 4,
    title: "۹۵ متری نوساز، خیابان ابراهیمی با پارکینگ سندی",
    district: "مرزداران",
    address: "مرزداران، خیابان شهید ابراهیمی، بوستان دوم",
    type: "rent",
    propertyType: "آپارتمان مسکونی",
    meters: 95,
    bedrooms: 2,
    floor: "طبقه چهارم",
    hasParking: true,
    hasElevator: true,
    hasStorage: true,
    deposit: 400000000,
    rent: 22000000,
    agencyName: "املاک نگین مرزداران",
    agentName: "محسن یعقوبی",
    agentPhone: "۰۹۱۲۸۸۸۹۹۰۰",
    isVerified: true,
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
    tags: ["کابینت های‌گلاس", "پکیج و اسپیلت", "نورگیر مستقیم"]
  },
  {
    id: 5,
    title: "۱۸۰ متری مدرن، گل‌سنگ، فول مشاعات هتلینگ",
    district: "نیاوران",
    address: "نیاوران، خیابان گل‌سنگ، بن‌بست مینا",
    type: "sale",
    propertyType: "آپارتمان مسکونی",
    meters: 180,
    bedrooms: 3,
    floor: "طبقه ششم",
    hasParking: true,
    hasElevator: true,
    hasStorage: true,
    deposit: 0,
    rent: 0,
    totalPrice: 48000000000,
    agencyName: "املاک پایتخت شمیران",
    agentName: "سهراب کریمی",
    agentPhone: "۰۹۱۲۱۱۱۴۴۵۵",
    isVerified: true,
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
    tags: ["سند تک‌برگ", "روف‌گاردن ۳۶۰", "۲ پارکینگ سندی"]
  },
  {
    id: 6,
    title: "۷۰ متری بازسازی شده کامل، سازمان آب، مناسب زوج",
    district: "صادقیه",
    address: "صادقیه، فلکه اول، خیابان سازمان آب",
    type: "rent",
    propertyType: "آپارتمان مسکونی",
    meters: 70,
    bedrooms: 1,
    floor: "طبقه اول",
    hasParking: true,
    hasElevator: false,
    hasStorage: true,
    deposit: 250000000,
    rent: 16000000,
    agencyName: "املاک ستاره صادقیه",
    agentName: "بهروز مرادی",
    agentPhone: "۰۹۱۲۷۷۷۲۲۳۳",
    isVerified: true,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    tags: ["دسترسی ۲ دقیقه به مترو", "تخلیه آماده تحویل"]
  }
];

export default function HomePage() {
  const [dealType, setDealType] = useState<"all" | "rent" | "sale">("rent");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("همه");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [calculatorOpen, setCalculatorOpen] = useState<boolean>(false);
  const [submitModalOpen, setSubmitModalOpen] = useState<boolean>(false);
  const [contactModalProperty, setContactModalProperty] = useState<Property | null>(null);

  // Rahn-Ejareh Calculator states
  const [calcDeposit, setCalcDeposit] = useState<number>(500); // 500 million
  const [calcRent, setCalcRent] = useState<number>(15);       // 15 million
  const [calcRate, setCalcRate] = useState<number>(3);        // 3% standard rate

  const formatPrice = (num: number) => {
    return new Intl.NumberFormat("fa-IR").format(num);
  };

  // Convert Rahn to full Rahn
  const fullRahnEquivalent = calcDeposit + (calcRent / (calcRate / 100));
  // Convert Rahn to full Rent (assuming 100M deposit minimum)
  const fullRentEquivalent = (fullRahnEquivalent - 100) * (calcRate / 100);

  const districts = ["همه", "سعادت‌آباد", "شهرک غرب", "پونک", "مرزداران", "نیاوران", "صادقیه", "تهرانپارس", "پاسداران", "یوسف‌آباد"];

  const filteredProperties = mockProperties.filter((item) => {
    if (dealType !== "all" && item.type !== dealType) return false;
    if (selectedDistrict !== "همه" && item.district !== selectedDistrict) return false;
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* ==================== HEADER ==================== */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden shadow-lg shadow-amber-500/10 border border-amber-500/30">
              <Image
                src="/logo.jpg"
                alt="لوگو یه خونه"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-l from-amber-400 via-orange-300 to-white bg-clip-text text-transparent">
                  یه خونه
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                  ۱۰۰٪ رایگان
                </span>
              </div>
              <p className="text-[11px] text-slate-400">سامانه هوشمند املاک ایران (YeKhoone)</p>
            </div>
          </div>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => setDealType("rent")}
              className={`hover:text-amber-400 transition-colors ${dealType === "rent" ? "text-amber-400 font-bold" : ""}`}
            >
              رهن و اجاره
            </button>
            <button
              onClick={() => setDealType("sale")}
              className={`hover:text-amber-400 transition-colors ${dealType === "sale" ? "text-amber-400 font-bold" : ""}`}
            >
              خرید و فروش
            </button>
            <button
              onClick={() => setCalculatorOpen(true)}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors text-slate-300"
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              تبدیل رهن و اجاره
            </button>
            <button
              onClick={() => setSubmitModalOpen(true)}
              className="hover:text-amber-400 transition-colors"
            >
              پنل همکاران و آژانس‌ها
            </button>
          </nav>

          {/* Actions & Submission CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCalculatorOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400"
              title="محاسبه‌گر رهن و اجاره"
            >
              <Calculator className="w-5 h-5 text-amber-400" />
            </button>

            <button
              onClick={() => setSubmitModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">ثبت رایگان ملک</span>
              <span className="sm:hidden">ثبت ملک</span>
            </button>
          </div>
        </div>
      </header>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative pt-12 pb-16 px-4 lg:px-8 overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(245,158,11,0.08),transparent_50%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Mission Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>پایان هزینه‌های دیوار؛ ثبت نامحدود و رایگان برای تمام مشاوران کشور</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight mb-4">
            دنبال <span className="bg-gradient-to-l from-amber-400 to-orange-400 bg-clip-text text-transparent">یه خونه‌</span>ای؟
            <br />
            پیداش کردی!
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            سامانه بدون واسطه مسکن ایران با دسترسی مستقیم به بهترین مشاورین و مالکین.
            فایل‌های واقعی، لوکیشن دقیق روی نقشه، بدون هزینه ثبت آگهی.
          </p>

          {/* Search Box */}
          <div className="bg-slate-900/90 border border-slate-800 p-2 sm:p-3 rounded-2xl shadow-2xl shadow-slate-950/80 backdrop-blur-xl">
            {/* Top Deal Tabs */}
            <div className="flex items-center justify-start gap-2 mb-3 pb-2 border-b border-slate-800/80 text-xs font-semibold">
              <button
                onClick={() => setDealType("rent")}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  dealType === "rent"
                    ? "bg-amber-500 text-slate-950 font-bold shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                رهن و اجاره
              </button>
              <button
                onClick={() => setDealType("sale")}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  dealType === "sale"
                    ? "bg-amber-500 text-slate-950 font-bold shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                خرید آپارتمان
              </button>
              <button
                onClick={() => setDealType("all")}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  dealType === "all"
                    ? "bg-amber-500 text-slate-950 font-bold shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                همه فایل‌ها
              </button>
            </div>

            {/* Main Input Row */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="نام محله (مثلاً: سعادت‌آباد، پونک، نیاوران...)"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pr-11 pl-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/70 transition-colors"
                />
              </div>

              <div className="w-full sm:w-auto flex items-center gap-2">
                <button
                  onClick={() => setCalculatorOpen(true)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-sm font-medium border border-slate-700/60 transition-colors whitespace-nowrap"
                >
                  <ArrowRightLeft className="w-4 h-4 text-amber-400" />
                  تبدیل رهن
                </button>
              </div>
            </div>
          </div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-center gap-2.5 text-right">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">۱۰۰٪ رایگان</div>
                <div className="text-[10px] text-slate-400">بدون هزینه ثبت فایل</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-center gap-2.5 text-right">
              <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">لوکیشن دقیق</div>
                <div className="text-[10px] text-slate-400">جستجوی محله‌محور</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-center gap-2.5 text-right">
              <Phone className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">تماس مستقیم</div>
                <div className="text-[10px] text-slate-400">بدون واسطه اضافی</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-center gap-2.5 text-right">
              <Building2 className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">حمایت از مشاورین</div>
                <div className="text-[10px] text-slate-400">پنل ویژه آژانس‌ها</div>
              </div>
            </div>
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
              نمایش {filteredProperties.length} فایل تایید شده با قیمت کارشناسی
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>مرتب‌سازی: جدیدترین‌ها</span>
          </div>
        </div>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop) => (
            <article
              key={prop.id}
              className="bg-slate-900/70 border border-slate-800/80 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-slate-950/80 flex flex-col group"
            >
              {/* Photo Box */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-800">
                <Image
                  src={prop.image}
                  alt={prop.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                {/* Deal Tag */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 shadow">
                    {prop.type === "rent" ? "رهن و اجاره" : "فروش"}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-950/70 backdrop-blur-md text-white border border-white/10">
                    {prop.district}
                  </span>
                </div>

                {/* Verified Agency Badge */}
                <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] font-medium text-emerald-300">
                      {prop.agencyName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-400 transition-colors line-clamp-1 mb-2">
                    {prop.title}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="line-clamp-1">{prop.address}</span>
                  </p>

                  {/* Specs Pill row */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-800/80 text-xs text-slate-300 mb-4">
                    <div className="flex items-center justify-center gap-1.5 bg-slate-950/40 py-1.5 rounded-lg">
                      <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>{formatPrice(prop.meters)} متر</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 bg-slate-950/40 py-1.5 rounded-lg">
                      <BedDouble className="w-3.5 h-3.5 text-amber-400" />
                      <span>{formatPrice(prop.bedrooms)} خواب</span>
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
                          {formatPrice(prop.deposit)} تومان
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">اجاره ماهانه:</span>
                        <span className="font-extrabold text-amber-400 text-sm">
                          {prop.rent === 0 ? "رهن کامل" : `${formatPrice(prop.rent)} تومان`}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-slate-400">قیمت کل:</span>
                      <span className="font-extrabold text-amber-400 text-base">
                        {formatPrice(prop.totalPrice || 0)} تومان
                      </span>
                    </div>
                  )}

                  {/* Contact Button */}
                  <button
                    onClick={() => setContactModalProperty(prop)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 font-bold text-xs text-slate-200 transition-all border border-slate-700/60 hover:border-amber-500"
                  >
                    <Phone className="w-4 h-4" />
                    <span>تماس با مشاور ({prop.agentName.split(" ")[0]})</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ==================== UNCLE'S AGENCY RECRUITMENT BANNER ==================== */}
        <section className="mt-16 p-6 sm:p-10 rounded-3xl bg-gradient-to-l from-indigo-950 via-slate-900 to-slate-950 border border-amber-500/30 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold mb-4">
              <Building className="w-4 h-4" />
              ویژه مشاورین و آژانس‌های معاملات ملکی سراسر کشور
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              خسته از پرداخت هزینه‌های سنگین به دیوار؟
              <br />
              در <span className="text-amber-400">«یه خونه»</span> تمام فایل‌هایتان را رایگان ثبت کنید!
            </h3>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              ما پلتفرم «یه خونه» را برای حمایت از صنف مشاورین املاک ساختیم. هیچ پولی برای هر آگهی، ثبت فایل یا نردبان از شما گرفته نمی‌شود. مشتریان واقعی و بدون واسطه مستقیماً با آژانس شما تماس می‌گیرند.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setSubmitModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105"
              >
                + ثبت رایگان فایل جدید
              </button>
              <button
                onClick={() => setSubmitModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700 transition-colors"
              >
                ثبت نام و ایجاد پروفایل آژانس
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
              <p className="text-[11px] text-slate-500">پلتفرم هوشمند و رایگان معاملات مسکن در ایران</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <span>درباره یه خونه</span>
            <span>شرایط و قوانین</span>
            <span>راهنمای مشاورین</span>
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
                  <span className="font-bold text-white text-sm">{formatPrice(calcDeposit)} میلیون تومان</span>
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
                  <span className="font-bold text-amber-400 text-sm">{formatPrice(calcRent)} میلیون تومان</span>
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
                    {formatPrice(Math.round(fullRahnEquivalent))}
                  </span>
                  <span className="text-[11px] text-slate-400 mr-1">میلیون تومان</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-right">
                  <span className="text-xs text-slate-300 font-semibold block mb-1">معادل اجاره (با ۱۰۰م ودیعه):</span>
                  <span className="text-lg font-extrabold text-amber-400">
                    {formatPrice(Math.max(0, Math.round(fullRentEquivalent)))}
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
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">ثبت ۱۰۰٪ رایگان فایل ملکی</h3>
                <p className="text-xs text-slate-400">بدون نیاز به پرداخت ریالی هزینه به پلتفرم</p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("فایل شما با موفقیت به صورت رایگان در سامانه یه خونه ثبت شد!");
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
                  placeholder="مثال: املاک نوین سعادت‌آباد - مشاور حیدری"
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
                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
              >
                ثبت نهایی و انتشار رایگان در «یه خونه»
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
