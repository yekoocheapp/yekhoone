"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Tehran3DMap from "@/components/Tehran3DMap";
import BuildingInspectorDrawer from "@/components/BuildingInspectorDrawer";
import {
  TehranBuilding,
  TEHRAN_BUILDINGS,
  TEHRAN_DISTRICTS,
  getBuildingById,
  getBuildingByPropertyId
} from "@/data/buildings";
import {
  Search,
  Building2,
  MapPin,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  X,
  PlusCircle,
  ShieldCheck,
  Compass,
  Layers,
  ChevronLeft
} from "lucide-react";

function MapPageContent() {
  const searchParams = useSearchParams();
  const [selectedBuilding, setSelectedBuilding] = useState<TehranBuilding | null>(null);
  const [activeDistrictId, setActiveDistrictId] = useState<string>("saadat-abad");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterOnlyActive, setFilterOnlyActive] = useState<boolean>(false);
  const [registerModalOpen, setRegisterModalOpen] = useState<boolean>(false);
  const [registerContext, setRegisterContext] = useState<{
    building?: TehranBuilding;
    floorNumber?: number;
    unitName?: string;
  }>({});

  // Registration form state
  const [regOwnerPhone, setRegOwnerPhone] = useState<string>("");
  const [regDealType, setRegDealType] = useState<"rent" | "sale">("rent");
  const [regDeposit, setRegDeposit] = useState<string>("");
  const [regRent, setRegRent] = useState<string>("");
  const [regPrice, setRegPrice] = useState<string>("");
  const [regSuccess, setRegSuccess] = useState<boolean>(false);

  // Parse query params for initial building or property focus
  useEffect(() => {
    const buildingIdParam = searchParams.get("buildingId");
    const propertyIdParam = searchParams.get("propertyId");

    if (propertyIdParam) {
      const bldg = getBuildingByPropertyId(Number(propertyIdParam));
      if (bldg) {
        setSelectedBuilding(bldg);
        return;
      }
    }

    if (buildingIdParam) {
      const bldg = getBuildingById(buildingIdParam);
      if (bldg) {
        setSelectedBuilding(bldg);
      }
    }
  }, [searchParams]);

  // Search filtered buildings
  const searchResults = searchQuery.trim() === ""
    ? []
    : TEHRAN_BUILDINGS.filter((b) => {
        const q = searchQuery.toLowerCase();
        return (
          b.name.toLowerCase().includes(q) ||
          b.district.toLowerCase().includes(q) ||
          b.street.toLowerCase().includes(q) ||
          b.plaque.toLowerCase().includes(q)
        );
      });

  const handleSelectBuildingFromSearch = (building: TehranBuilding) => {
    setSelectedBuilding(building);
    setSearchQuery("");
  };

  const handleRegisterUnit = (building: TehranBuilding, floorNumber: number, unitName: string) => {
    setRegisterContext({ building, floorNumber, unitName });
    setRegSuccess(false);
    setRegisterModalOpen(true);
  };

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegSuccess(true);
    setTimeout(() => {
      setRegisterModalOpen(false);
      setRegSuccess(false);
      setRegOwnerPhone("");
    }, 2500);
  };

  return (
    <div className="relative w-screen h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans">
      {/* ==================== TOP NAVIGATION OVERLAY ==================== */}
      <header className="absolute top-0 inset-x-0 z-30 pointer-events-none p-3 sm:p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Back Link */}
          <div className="flex items-center gap-2.5 pointer-events-auto">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-950/85 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all backdrop-blur-md shadow-xl group"
              title="بازگشت به صفحه اصلی یه خونه"
            >
              <ArrowRight className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-xs font-bold hidden sm:inline">صفحه اصلی</span>
            </Link>

            <Link href="/" className="flex items-center gap-2.5 bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800 shadow-xl">
              <div className="relative w-7 h-7 rounded-xl overflow-hidden border border-amber-500/30">
                <Image src="/logo.jpg" alt="یه خونه" fill className="object-cover" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold bg-gradient-to-l from-amber-400 to-white bg-clip-text text-transparent">
                  یه خونه
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold hidden md:inline">
                  نقشه ۳ بعدی تهران
                </span>
              </div>
            </Link>
          </div>

          {/* District Quick Switcher Bar (Desktop) */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md p-1 rounded-2xl border border-slate-800 shadow-xl pointer-events-auto">
            {TEHRAN_DISTRICTS.map((dist) => (
              <button
                key={dist.id}
                onClick={() => {
                  setActiveDistrictId(dist.id);
                  setSelectedBuilding(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeDistrictId === dist.id
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                {dist.name}
              </button>
            ))}
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Search Box */}
            <div className="relative">
              <div className="flex items-center bg-slate-950/85 backdrop-blur-md rounded-2xl border border-slate-800 px-3 py-1.5 shadow-xl w-48 sm:w-64 focus-within:w-72 focus-within:border-amber-500/50 transition-all">
                <Search className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                <input
                  type="text"
                  placeholder="جستجوی پلاک، کوچه یا محله..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Search Autocomplete Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-slate-950/95 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 max-h-72 overflow-y-auto space-y-1">
                  <div className="px-2 py-1 text-[11px] font-bold text-slate-400">
                    ساختمان‌های منطبق در تهران:
                  </div>
                  {searchResults.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => handleSelectBuildingFromSearch(b)}
                      className="w-full text-right p-2.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors flex items-center justify-between gap-2 group"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white group-hover:text-amber-400 truncate">
                            {b.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400">
                            {b.district}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {b.street} • {b.plaque}
                        </p>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-slate-600 group-hover:text-amber-400 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Listing Claim CTA */}
            <button
              onClick={() => {
                setRegisterContext({});
                setRegisterModalOpen(true);
              }}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>ثبت رایگان ملک</span>
            </button>
          </div>
        </div>

        {/* District Quick Switcher Bar (Mobile Carousel) */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 pointer-events-auto">
          {TEHRAN_DISTRICTS.map((dist) => (
            <button
              key={dist.id}
              onClick={() => {
                setActiveDistrictId(dist.id);
                setSelectedBuilding(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                activeDistrictId === dist.id
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-950/85 backdrop-blur-md text-slate-400 border border-slate-800"
              }`}
            >
              {dist.name}
            </button>
          ))}
        </div>
      </header>

      {/* ==================== 3D MAP ENGINE ==================== */}
      <main className="flex-1 w-full h-full relative">
        <Tehran3DMap
          onSelectBuilding={(bldg) => setSelectedBuilding(bldg)}
          selectedBuildingId={selectedBuilding?.id}
          activeDistrictId={activeDistrictId}
        />
      </main>

      {/* ==================== BUILDING DIGITAL TWIN INSPECTOR ==================== */}
      <BuildingInspectorDrawer
        building={selectedBuilding}
        onClose={() => setSelectedBuilding(null)}
        onRegisterUnit={handleRegisterUnit}
      />

      {/* ==================== FREE UNIT REGISTRATION MODAL ==================== */}
      {registerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 relative">
            <button
              onClick={() => setRegisterModalOpen(false)}
              className="absolute top-6 left-6 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {regSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white">
                  واحد با موفقیت روی نقشه ۳ بعدی ثبت شد!
                </h3>
                <p className="text-sm text-slate-300">
                  شناسنامه این واحد برای بررسی و فعال‌سازی در سامانه «یه خونه» ارسال گردید. نردبان خودکار هر ۴ ساعت برای این ملک فعال شد.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">
                      ثبت ۱۰۰٪ رایگان واحد روی نقشه ۳ بعدی
                    </h3>
                    <p className="text-xs text-slate-400">
                      بدون هزینه آگهی و با الگوریتم عادلانه نردبان خودکار
                    </p>
                  </div>
                </div>

                {registerContext.building && (
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      {registerContext.building.name} ({registerContext.building.district})
                    </div>
                    <div className="text-slate-400">
                      طبقه {registerContext.floorNumber || 1} • {registerContext.unitName || "واحد جدید"}
                    </div>
                  </div>
                )}

                {/* Deal Type Switcher */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegDealType("rent")}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${
                      regDealType === "rent"
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                        : "bg-slate-950 border-slate-800 text-slate-400"
                    }`}
                  >
                    رهن و اجاره
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegDealType("sale")}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${
                      regDealType === "sale"
                        ? "bg-amber-500/20 border-amber-500 text-amber-400"
                        : "bg-slate-950 border-slate-800 text-slate-400"
                    }`}
                  >
                    فروش نقدی
                  </button>
                </div>

                {/* Pricing Fields */}
                {regDealType === "rent" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">ودیعه (میلیون تومان)</label>
                      <input
                        type="number"
                        placeholder="مثال: ۵۰۰"
                        value={regDeposit}
                        onChange={(e) => setRegDeposit(e.target.value)}
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">اجاره ماهیانه (میلیون تومان)</label>
                      <input
                        type="number"
                        placeholder="مثال: ۲۰"
                        value={regRent}
                        onChange={(e) => setRegRent(e.target.value)}
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">قیمت کل (میلیارد تومان)</label>
                    <input
                      type="number"
                      placeholder="مثال: ۱۲"
                      value={regPrice}
                      onChange={(e) => setRegPrice(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}

                {/* Mobile Phone */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1">شماره تماس مالک یا مشاور</label>
                  <input
                    type="tel"
                    placeholder="۰۹۱۲..."
                    dir="ltr"
                    value={regOwnerPhone}
                    onChange={(e) => setRegOwnerPhone(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white text-right focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] mt-2"
                >
                  تایید و ثبت رایگان واحد روی نقشه ۳ بعدی
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen bg-slate-950 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 animate-spin">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-400">در حال بارگذاری موتور نقشه ۳ بعدی تهران...</span>
        </div>
      }
    >
      <MapPageContent />
    </Suspense>
  );
}
