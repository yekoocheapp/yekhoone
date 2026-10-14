"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TehranBuilding,
  BuildingFloor,
  BuildingUnit,
  getActiveUnitsInBuilding
} from "@/data/buildings";
import {
  initialProperties,
  formatPersianNumber
} from "@/data/properties";
import {
  Ruler,
  Building2,
  Layers,
  Home,
  Key,
  DoorOpen,
  Car,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Edit3,
  PlusCircle,
  ShieldCheck,
  Eye,
  Info,
  Lock,
  Compass,
  ArrowUpDown,
  Phone,
  Check
} from "lucide-react";

interface BuildingFacadeViewProps {
  building: TehranBuilding;
  userRole: "home_seeker" | "seller_agent";
  onSelectUnit?: (unit: BuildingUnit, floor: BuildingFloor) => void;
  onEditBuilding?: () => void;
  onEditUnit?: (unit: BuildingUnit, floor: BuildingFloor) => void;
  onRequestAgentMode?: () => void;
}

export default function BuildingFacadeView({
  building,
  userRole,
  onSelectUnit,
  onEditBuilding,
  onEditUnit,
  onRequestAgentMode
}: BuildingFacadeViewProps) {
  const [activeUnitId, setActiveUnitId] = useState<string | null>(null);

  // Extract active rent/sale listings
  const { rentUnits, saleUnits } = getActiveUnitsInBuilding(building);
  const totalActive = rentUnits.length + saleUnits.length;

  // Frontage width in meters (default to dimensions.width or 16m)
  const frontageWidth = building.dimensions?.width || 18;
  const buildingHeight = building.dimensions?.height || building.totalFloors * 3.5 + 4;

  // Sort floors descending: top floor down to ground floor
  const sortedFloors = [...building.floors].sort(
    (a, b) => b.floorNumber - a.floorNumber
  );

  return (
    <div className="w-full flex flex-col bg-slate-950/90 text-slate-100 select-none">
      {/* ==================== ARCHITECTURAL DIMENSION RULER ==================== */}
      <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Ruler className="w-4 h-4 text-amber-400" />
            <span>عرض بر ساختمان (رو به خیابان اصلی):</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-black">
              {formatPersianNumber(frontageWidth)} متر بر
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
              ارتفاع: {formatPersianNumber(Math.round(buildingHeight))} متر
            </span>
          </div>
        </div>

        {/* Visual Engineering Dimension Line */}
        <div className="relative flex items-center justify-center my-1">
          <div className="w-full flex items-center">
            {/* Left Tick */}
            <div className="w-1.5 h-3 bg-amber-400 shrink-0" />
            <div className="h-[2px] bg-amber-500/60 flex-1 relative flex items-center justify-center">
              <span className="bg-slate-900 px-3 py-0.5 rounded border border-amber-500/40 text-[10px] font-mono font-bold text-amber-300 tracking-wider shadow-sm">
                ◀──── {formatPersianNumber(frontageWidth)} METER FRONTAGE ────▶
              </span>
            </div>
            {/* Right Tick */}
            <div className="w-1.5 h-3 bg-amber-400 shrink-0" />
          </div>
        </div>

        {/* Role Permissions Notification Bar */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {userRole === "seller_agent" ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1.5 text-[11px] text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-bold">دسترسی مالک و مشاور املاک فعال است:</span>
                <span className="text-slate-400 hidden sm:inline">برای قیمت‌گذاری یا ثبت واحد روی هر طبقه کلیک کنید</span>
              </div>
              {onEditBuilding && (
                <button
                  onClick={onEditBuilding}
                  className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 transition-colors"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>ویرایش ابعاد بنا</span>
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>حالت بازدیدکننده و خریدار (فقط خواندنی)</span>
              </div>
              {onRequestAgentMode && (
                <button
                  onClick={onRequestAgentMode}
                  className="text-[11px] text-amber-400 hover:text-amber-300 underline font-medium"
                >
                  مالک یا مشاور این ملک هستید؟
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ==================== ARCHITECTURAL BUILDING ELEVATION ==================== */}
      <div className="p-4 sm:p-5 overflow-y-auto max-h-[520px] space-y-3 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950">
        {/* Roof Level / Parapet */}
        <div className="relative rounded-t-2xl border-t-2 border-x-2 border-amber-500/30 bg-slate-900/80 p-2.5 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            <span className="text-[11px] font-bold text-slate-300">
              {building.amenities?.hasRoofGarden ? "🌿 پشت‌بام با روف‌گاردن و فضای سبز" : "بام ساختمان و تأسیسات مرکزی"}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">ROOFTOP</span>
        </div>

        {/* Stack of Floors (from highest floor to floor 1) */}
        {sortedFloors.map((floor) => {
          const isPenthouse = floor.floorNumber === building.totalFloors && building.totalFloors > 3;

          return (
            <div
              key={floor.floorNumber}
              className={`relative rounded-2xl border transition-all ${
                isPenthouse
                  ? "bg-slate-900/90 border-amber-500/40 shadow-amber-500/5"
                  : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
              } p-3 shadow-md`}
            >
              {/* Floor Header Label */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-black flex items-center justify-center border border-amber-500/20">
                    {formatPersianNumber(floor.floorNumber)}
                  </div>
                  <span className="text-xs font-bold text-white">
                    {floor.floorLabel}
                  </span>
                  {isPenthouse && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      پنت‌هاوس
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">
                  {formatPersianNumber(floor.units.length)} واحد در این طبقه
                </span>
              </div>

              {/* Units horizontally across the floor facade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {floor.units.map((unit) => {
                  const isUnitSelected = activeUnitId === unit.id;
                  const property = unit.propertyId
                    ? initialProperties.find((p) => p.id === unit.propertyId)
                    : undefined;

                  return (
                    <div
                      key={unit.id}
                      onClick={() => {
                        setActiveUnitId(unit.id);
                        if (onSelectUnit) onSelectUnit(unit, floor);
                      }}
                      className={`relative p-3 rounded-xl border text-right transition-all cursor-pointer group ${
                        unit.status === "rent"
                          ? "bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500/80 shadow-emerald-500/5"
                          : unit.status === "sale"
                          ? "bg-amber-950/20 border-amber-500/40 hover:border-amber-500/80 shadow-amber-500/5"
                          : unit.status === "occupied"
                          ? "bg-slate-950/50 border-slate-800/90 hover:border-slate-700"
                          : "bg-indigo-950/15 border-indigo-500/20 hover:border-indigo-500/50"
                      } ${isUnitSelected ? "ring-2 ring-amber-400 shadow-xl" : ""}`}
                    >
                      {/* Architectural Window Indicator */}
                      <div className="absolute top-2 left-2 flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <div className="w-2.5 h-3.5 rounded-sm bg-sky-400/20 border border-sky-400/40" />
                        <div className="w-2.5 h-3.5 rounded-sm bg-sky-400/20 border border-sky-400/40" />
                      </div>

                      {/* Unit Title & Status Pill */}
                      <div className="flex items-center justify-between gap-1 mb-1.5 pl-6">
                        <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                          {unit.unitNumber}
                        </span>

                        {unit.status === "rent" && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            رهن و اجاره
                          </span>
                        )}
                        {unit.status === "sale" && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            فروش نقدی
                          </span>
                        )}
                        {unit.status === "occupied" && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium shrink-0">
                            سکونت مالک
                          </span>
                        )}
                        {unit.status === "unlisted" && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium shrink-0">
                            ثبت نشده
                          </span>
                        )}
                      </div>

                      {/* Specs: Meters & Bedrooms */}
                      <p className="text-[11px] text-slate-400 mb-2">
                        {formatPersianNumber(unit.meters)} متر • {formatPersianNumber(unit.bedrooms)} خواب
                      </p>

                      {/* Pricing Tag if available */}
                      {unit.status === "rent" && (
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                          <span className="text-slate-400">ودیعه و اجاره:</span>
                          <span className="font-extrabold text-emerald-400">
                            {formatPersianNumber((unit.deposit || (property?.deposit ?? 0)) / 1000000)}م / {formatPersianNumber((unit.rent || (property?.rent ?? 0)) / 1000000)}م
                          </span>
                        </div>
                      )}

                      {unit.status === "sale" && (
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                          <span className="text-slate-400">قیمت کل:</span>
                          <span className="font-extrabold text-amber-400">
                            {formatPersianNumber(((unit.totalPrice || (property?.totalPrice ?? 0)) / 1000000000).toFixed(1))} میلیارد
                          </span>
                        </div>
                      )}

                      {/* Action buttons based on user role */}
                      <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2">
                        {userRole === "seller_agent" ? (
                          // Agent/Seller Mode Actions
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onEditUnit) onEditUnit(unit, floor);
                            }}
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition-all"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>مدیریت و قیمت‌گذاری واحد</span>
                          </button>
                        ) : (
                          // Home Seeker Mode Actions
                          property ? (
                            <Link
                              href={`/property/${property.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-gradient-to-l from-amber-500 to-orange-500 text-slate-950 text-[11px] font-bold shadow-md shadow-amber-500/10 hover:brightness-110 transition-all"
                            >
                              <span>مشاهده آگهی و تماس</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          ) : (
                            <div className="w-full text-center text-[10px] text-slate-500 py-1">
                              {unit.status === "occupied" ? "سکونت شخصی (عرضه نشده)" : "هنوز در سامانه قیمت‌گذاری نشده"}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* ==================== GROUND FLOOR / STREET LEVEL ==================== */}
        <div className="rounded-b-2xl border-b-2 border-x-2 border-slate-700 bg-slate-900/90 p-3.5 space-y-3 shadow-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-white flex items-center gap-1.5">
              <DoorOpen className="w-4 h-4 text-amber-400" />
              همکف و ورودی خیابان اصلی ({building.street})
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
              STREET LEVEL
            </span>
          </div>

          {/* Architectural Entrance & Garage Doors */}
          <div className="grid grid-cols-2 gap-3">
            {/* Main Entrance Door */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/30 flex flex-col items-center justify-center text-center gap-1 shadow-inner">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <DoorOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">درب ورودی و لابی</span>
              <span className="text-[10px] text-slate-400">
                {building.amenities?.hasLobbyMan ? "لابی‌من ۲۴ ساعته فعال" : "ورودی کدینگ دیجیتال"}
              </span>
            </div>

            {/* Garage Roll-Up Gate */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center text-center gap-1 shadow-inner">
              <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300">
                <Car className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-xs font-bold text-white">درب پارکینگ ریموت</span>
              <span className="text-[10px] text-slate-400">
                {building.amenities?.hasParking ? "پارکینگ اختصاصی سندی" : "بدون پارکینگ"}
              </span>
            </div>
          </div>

          {/* Sidewalk Curb */}
          <div className="w-full h-2 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded-full" />
        </div>
      </div>
    </div>
  );
}
