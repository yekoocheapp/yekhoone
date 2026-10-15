"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Tehran3DMap from "@/components/Tehran3DMap";
import BuildingInspectorDrawer from "@/components/BuildingInspectorDrawer";
import BuildingManagementModal from "@/components/BuildingManagementModal";
import {
  TehranBuilding,
  BuildingFloor,
  BuildingUnit,
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
  ChevronLeft,
  ChevronDown,
  UserCheck,
  Eye,
  Key,
  Ruler,
  User,
  Video
} from "lucide-react";

function MapPageContent() {
  const searchParams = useSearchParams();
  const [buildingsList, setBuildingsList] = useState<TehranBuilding[]>(TEHRAN_BUILDINGS);
  const [selectedBuilding, setSelectedBuilding] = useState<TehranBuilding | null>(null);
  const [activeDistrictId, setActiveDistrictId] = useState<string>("saadat-abad");
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterOnlyActive, setFilterOnlyActive] = useState<boolean>(false);

  // Strict Role-Based Permissions: 'home_seeker' (view-only) vs 'seller_agent' (management)
  const [userRole, setUserRole] = useState<"home_seeker" | "seller_agent">("home_seeker");

  // Building Management & Unit Pricing Modal State (for Sellers/Agents)
  const [manageModalOpen, setManageModalOpen] = useState<boolean>(false);
  const [editingUnit, setEditingUnit] = useState<BuildingUnit | null>(null);
  const [editingFloor, setEditingFloor] = useState<BuildingFloor | null>(null);

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
  const searchResults =
    searchQuery.trim() === ""
      ? []
      : buildingsList.filter((b) => {
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

  const handleSelectBuildingFromMap = (bldg: TehranBuilding | null) => {
    setSelectedBuilding(bldg);
  };

  // Agent/Seller edits building or unit
  const handleSaveBuildingUpdates = (updatedBuilding: TehranBuilding) => {
    setBuildingsList((prev) =>
      prev.map((b) => (b.id === updatedBuilding.id ? updatedBuilding : b))
    );
    setSelectedBuilding(updatedBuilding);
  };

  const handleOpenEditBuilding = () => {
    setEditingUnit(null);
    setEditingFloor(null);
    setManageModalOpen(true);
  };

  const handleOpenEditUnit = (unit: BuildingUnit, floor: BuildingFloor) => {
    setEditingUnit(unit);
    setEditingFloor(floor);
    setManageModalOpen(true);
  };

  const currentDistrict = TEHRAN_DISTRICTS.find((d) => d.id === activeDistrictId) || TEHRAN_DISTRICTS[0];

  return (
    <div className="relative w-screen h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans select-none">
      {/* ==================== TOP NAVIGATION OVERLAY ==================== */}
      <header className="absolute top-0 inset-x-0 z-30 pointer-events-none p-2.5 sm:p-4 transition-all duration-300 opacity-100 translate-y-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
          {/* Right Section: Logo, Home, and District Selector Dropdown */}
          <div className="flex items-center gap-2 pointer-events-auto shrink-0">
            <Link
              href="/"
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all backdrop-blur-md shadow-xl group"
              title="بازگشت به صفحه اصلی یه خونه"
            >
              <ArrowRight className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-xs font-bold hidden md:inline">صفحه اصلی</span>
            </Link>

            <Link
              href="/"
              className="flex items-center gap-2 bg-slate-950/90 backdrop-blur-md px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl border border-slate-800 shadow-xl"
            >
              <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-xl overflow-hidden border border-amber-500/30">
                <Image src="/logo.jpg" alt="یه خونه" fill className="object-cover" />
              </div>
              <span className="text-xs sm:text-sm font-extrabold bg-gradient-to-l from-amber-400 to-white bg-clip-text text-transparent">
                یه خونه
              </span>
            </Link>

            {/* Compact District Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDistrictDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-200 hover:text-white transition-all backdrop-blur-md shadow-xl text-xs font-bold"
                title="تغییر محله نقشه تهران"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="max-w-[75px] sm:max-w-none truncate">{currentDistrict.name}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    districtDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {districtDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDistrictDropdownOpen(false)}
                  />
                  <div className="absolute top-full mt-2 right-0 w-48 sm:w-52 bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 flex flex-col gap-1 max-h-64 overflow-y-auto">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-slate-500">
                      انتخاب محله تهران
                    </div>
                    {TEHRAN_DISTRICTS.map((dist) => (
                      <button
                        key={dist.id}
                        onClick={() => {
                          setActiveDistrictId(dist.id);
                          setSelectedBuilding(null);
                          setDistrictDropdownOpen(false);
                        }}
                        className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                          activeDistrictId === dist.id
                            ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
                            : "text-slate-300 hover:text-white hover:bg-slate-900"
                        }`}
                      >
                        <span>{dist.name}</span>
                        {activeDistrictId === dist.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Left Section: Role Switcher & Search */}
          <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
            {/* Search Box */}
            <div className="relative">
              <div className="flex items-center bg-slate-950/90 backdrop-blur-md rounded-2xl border border-slate-800 px-2.5 sm:px-3 py-1.5 sm:py-2 shadow-xl w-32 sm:w-44 md:w-56 focus-within:w-44 sm:focus-within:w-56 md:focus-within:w-64 focus-within:border-amber-500/50 transition-all">
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0 ml-1.5" />
                <input
                  type="text"
                  placeholder="جستجوی پلاک یا کوچه..."
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
                <div className="absolute top-full left-0 sm:right-0 mt-2 w-72 sm:w-80 bg-slate-950/95 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 max-h-72 overflow-y-auto space-y-1">
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
                          {b.street} • {b.plaque} • بر: {b.dimensions?.width || 18}م
                        </p>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-slate-600 group-hover:text-amber-400 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Strict Role Switcher: Home Seeker vs Seller/Agent */}
            <div className="flex items-center bg-slate-950/90 backdrop-blur-md p-1 rounded-2xl border border-slate-800 shadow-xl">
              <button
                onClick={() => setUserRole("home_seeker")}
                className={`px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 sm:gap-1.5 ${
                  userRole === "home_seeker"
                    ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="حالت بازدید و جستجوی ملک برای خریداران و مستاجران"
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">متقاضی مسکن</span>
                <span className="sm:hidden">متقاضی</span>
              </button>

              <button
                onClick={() => setUserRole("seller_agent")}
                className={`px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 sm:gap-1.5 ${
                  userRole === "seller_agent"
                    ? "bg-amber-500 text-slate-950 shadow-md font-black shadow-amber-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="حالت مشاور املاک و مالک جهت تعیین بر ساختمان و قیمت‌گذاری واحدها"
              >
                <Key className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">مالک و مشاور</span>
                <span className="sm:hidden">مشاور</span>
              </button>
            </div>

            {/* Direct Links to Neshasst & Profile */}
            <Link
              href="/neshasst"
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl bg-red-600/20 hover:bg-red-600 border border-red-500/40 text-red-400 hover:text-white transition-all text-xs font-bold flex items-center gap-1 shadow-lg shrink-0"
              title="اتاق نشست آنلاین (۴ نفره)"
            >
              <Video className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden lg:inline">نشست</span>
            </Link>

            <Link
              href="/profile"
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border border-slate-800 text-amber-400 hover:text-white transition-all text-xs font-bold flex items-center gap-1 shadow-lg shrink-0"
              title="پروفایل کاربری من"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">پروفایل</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ==================== 2D CADASTRAL MAP ==================== */}
      <main className="flex-1 w-full h-full relative">
        <Tehran3DMap
          onSelectBuilding={handleSelectBuildingFromMap}
          selectedBuildingId={selectedBuilding?.id}
          activeDistrictId={activeDistrictId}
          buildings={buildingsList}
          userRole={userRole}
        />
      </main>

      {/* ==================== 2D BUILDING FACADE & UNIT INSPECTOR DRAWER ==================== */}
      <BuildingInspectorDrawer
        building={selectedBuilding}
        onClose={() => setSelectedBuilding(null)}
        userRole={userRole}
        onEditBuilding={handleOpenEditBuilding}
        onEditUnit={handleOpenEditUnit}
        onRequestAgentMode={() => {
          setUserRole("seller_agent");
          setManageModalOpen(true);
        }}
      />

      {/* ==================== SELLER & AGENT MANAGEMENT MODAL ==================== */}
      {selectedBuilding && (
        <BuildingManagementModal
          isOpen={manageModalOpen}
          onClose={() => {
            setManageModalOpen(false);
            setEditingUnit(null);
            setEditingFloor(null);
          }}
          building={selectedBuilding}
          initialUnit={editingUnit}
          initialFloor={editingFloor}
          onSaveBuilding={handleSaveBuildingUpdates}
        />
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
          <span className="text-xs text-slate-400 font-bold">
            در حال بارگذاری نقشه ۲ بعدی کاداستر تهران...
          </span>
        </div>
      }
    >
      <MapPageContent />
    </Suspense>
  );
}
