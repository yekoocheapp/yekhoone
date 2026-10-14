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
import BuildingFacadeView from "@/components/BuildingFacadeView";
import {
  Building2,
  MapPin,
  X,
  Layers,
  Home,
  CheckCircle2,
  Sparkles,
  Eye,
  Key,
  ShieldCheck,
  Compass,
  ArrowLeft,
  ChevronDown,
  Car,
  Maximize2,
  BedDouble,
  ExternalLink,
  PlusCircle,
  Phone,
  Ruler,
  Edit3,
  Lock
} from "lucide-react";

interface BuildingInspectorDrawerProps {
  building: TehranBuilding | null;
  onClose: () => void;
  onFocusFloor?: (floorNumber: number) => void;
  onRegisterUnit?: (building: TehranBuilding, floorNumber: number, unitName: string) => void;
  userRole?: "home_seeker" | "seller_agent";
  onEditBuilding?: () => void;
  onEditUnit?: (unit: BuildingUnit, floor: BuildingFloor) => void;
  onRequestAgentMode?: () => void;
}

export default function BuildingInspectorDrawer({
  building,
  onClose,
  onFocusFloor,
  onRegisterUnit,
  userRole = "home_seeker",
  onEditBuilding,
  onEditUnit,
  onRequestAgentMode
}: BuildingInspectorDrawerProps) {
  const [selectedFloorNum, setSelectedFloorNum] = useState<number | "all">("all");
  const [activeTab, setActiveTab] = useState<"facade" | "list">("facade");

  if (!building) return null;

  const { rentUnits, saleUnits } = getActiveUnitsInBuilding(building);
  const totalActiveListings = rentUnits.length + saleUnits.length;

  const displayedFloors =
    selectedFloorNum === "all"
      ? building.floors
      : building.floors.filter((f) => f.floorNumber === selectedFloorNum);

  return (
    <aside
      aria-label="شناسنامه دیجیتال ساختمان و نمای روبرو"
      className="fixed inset-y-0 left-0 w-full sm:w-[500px] md:w-[560px] bg-slate-950/95 backdrop-blur-2xl border-r border-slate-800 shadow-2xl z-50 flex flex-col transition-all duration-300 animate-in slide-in-from-left"
    >
      {/* ==================== TOP HEADER ==================== */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/60 flex items-start justify-between gap-3 shrink-0">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/5">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold">
                {building.district}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                {building.plaque}
              </span>
              {totalActiveListings > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {formatPersianNumber(totalActiveListings)} واحد فعال
                </span>
              )}
            </div>
            <h2 className="text-lg font-extrabold text-white truncate mt-1">
              {building.name}
            </h2>
            <p className="text-xs text-slate-400 flex items-center gap-1 truncate mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              {building.fullAddress}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
          title="بستن شناسنامه ساختمان"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* ==================== VIEW MODE TABS ==================== */}
      <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("facade")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "facade"
                ? "bg-amber-500 text-slate-950 shadow-md font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>نمای روبرو و بر ساختمان</span>
          </button>
          <button
            onClick={() => setActiveTab("list")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "list"
                ? "bg-amber-500 text-slate-950 shadow-md font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>فهرست تفکیکی واحدها</span>
          </button>
        </div>

        {/* Action Button for Landlord/Agent */}
        {userRole === "seller_agent" ? (
          <button
            onClick={onEditBuilding}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>ویرایش مشخصات</span>
          </button>
        ) : (
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            دید خیابانی
          </span>
        )}
      </div>

      {/* ==================== CONTENT BODY ==================== */}
      {activeTab === "facade" ? (
        <div className="flex-1 overflow-y-auto">
          <BuildingFacadeView
            building={building}
            userRole={userRole}
            onEditBuilding={onEditBuilding}
            onEditUnit={onEditUnit}
            onRequestAgentMode={onRequestAgentMode}
            onSelectUnit={(unit, floor) => {
              if (userRole === "seller_agent" && onEditUnit) {
                onEditUnit(unit, floor);
              }
            }}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Quick Metrics Bar */}
          <div className="px-5 py-3 border-b border-slate-800/60 bg-slate-900/30 grid grid-cols-3 gap-2 shrink-0 text-center">
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block">عرض بر ساختمان</span>
              <span className="text-sm font-bold text-amber-400">
                {formatPersianNumber(building.dimensions?.width || 18)} متر
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block">تعداد طبقات</span>
              <span className="text-sm font-bold text-white">
                {formatPersianNumber(building.totalFloors)} طبقه
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block">سن بنا</span>
              <span className="text-sm font-bold text-slate-300">
                {building.age === 0 ? "نوساز کلیدنخورده" : `${formatPersianNumber(building.age)} سال ساخت`}
              </span>
            </div>
          </div>

          {/* Amenities Chips */}
          <div className="px-5 py-2 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 text-xs">
            {building.amenities?.hasElevator && (
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 shrink-0">
                ✓ آسانسور
              </span>
            )}
            {building.amenities?.hasParking && (
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 shrink-0">
                ✓ پارکینگ سندی
              </span>
            )}
            {building.amenities?.hasStorage && (
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 shrink-0">
                ✓ انباری
              </span>
            )}
            {building.amenities?.hasRoofGarden && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 shrink-0">
                🌿 روف‌گاردن
              </span>
            )}
            {building.amenities?.hasPool && (
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 shrink-0">
                🏊‍♂️ استخر و سونا
              </span>
            )}
            {building.amenities?.hasLobbyMan && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 shrink-0">
                🛡️ لابی‌من ۲۴ ساعته
              </span>
            )}
          </div>

          {/* Floor Cutaway Filter Bar */}
          <div className="px-5 py-2.5 border-b border-slate-800/60 bg-slate-900/40 flex items-center justify-between gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-300">انتخاب طبقه:</span>
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setSelectedFloorNum("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedFloorNum === "all"
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                همه طبقات
              </button>
              {building.floors.map((floor) => (
                <button
                  key={floor.floorNumber}
                  onClick={() => setSelectedFloorNum(floor.floorNumber)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedFloorNum === floor.floorNumber
                      ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                      : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  ط {formatPersianNumber(floor.floorNumber)}
                </button>
              ))}
            </div>
          </div>

          {/* Units List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {displayedFloors.map((floor) => (
              <div
                key={floor.floorNumber}
                className="rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden shadow-lg"
              >
                <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-400 font-bold text-xs flex items-center justify-center">
                      {formatPersianNumber(floor.floorNumber)}
                    </div>
                    <span className="text-xs font-bold text-white">
                      {floor.floorLabel}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {formatPersianNumber(floor.units.length)} واحد
                  </span>
                </div>

                <div className="p-3 space-y-2">
                  {floor.units.map((unit) => {
                    const property = unit.propertyId
                      ? initialProperties.find((p) => p.id === unit.propertyId)
                      : undefined;

                    return (
                      <div
                        key={unit.id}
                        className={`p-3 rounded-xl border transition-all ${
                          unit.status === "rent"
                            ? "bg-emerald-950/20 border-emerald-500/40"
                            : unit.status === "sale"
                            ? "bg-amber-950/20 border-amber-500/40"
                            : "bg-slate-950/40 border-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <span className="text-xs font-bold text-white block">
                              {unit.unitNumber}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {formatPersianNumber(unit.meters)} متر • {formatPersianNumber(unit.bedrooms)} خواب
                            </span>
                          </div>

                          {unit.status === "rent" && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                              رهن و اجاره
                            </span>
                          )}
                          {unit.status === "sale" && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[11px] font-bold">
                              فروش نقدی
                            </span>
                          )}
                          {unit.status === "occupied" && (
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[11px]">
                              سکونت مالک
                            </span>
                          )}
                          {unit.status === "unlisted" && (
                            <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px]">
                              ثبت نشده
                            </span>
                          )}
                        </div>

                        {/* Pricing details */}
                        {unit.status === "rent" && (
                          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                            <span className="text-slate-400">ودیعه / اجاره:</span>
                            <span className="font-bold text-emerald-400">
                              {formatPersianNumber((unit.deposit || (property?.deposit ?? 0)) / 1000000)}م / {formatPersianNumber((unit.rent || (property?.rent ?? 0)) / 1000000)}م
                            </span>
                          </div>
                        )}

                        {unit.status === "sale" && (
                          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                            <span className="text-slate-400">قیمت کل:</span>
                            <span className="font-bold text-amber-400">
                              {formatPersianNumber(((unit.totalPrice || (property?.totalPrice ?? 0)) / 1000000000).toFixed(1))} میلیارد
                            </span>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                          {userRole === "seller_agent" ? (
                            <button
                              onClick={() => onEditUnit && onEditUnit(unit, floor)}
                              className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>مدیریت و تغییر قیمت</span>
                            </button>
                          ) : (
                            property ? (
                              <Link
                                href={`/property/${property.id}`}
                                className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                              >
                                <span>مشاهده آگهی و تماس</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            ) : (
                              <span className="text-[10px] text-slate-500">
                                {unit.notes || "سکونت شخصی"}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== FOOTER ==================== */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between gap-3 shrink-0">
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>نردبان سیستمیک هر ۴ ساعت یک‌بار خودکار</span>
        </div>

        {userRole === "seller_agent" ? (
          <button
            onClick={() => onEditUnit && onEditUnit(building.floors[0]?.units[0], building.floors[0])}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>قیمت‌گذاری واحد جدید</span>
          </button>
        ) : (
          onRequestAgentMode && (
            <button
              onClick={onRequestAgentMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold border border-slate-700 transition-colors"
            >
              <Key className="w-3.5 h-3.5" />
              <span>ورود مشاور / مالک</span>
            </button>
          )
        )}
      </div>
    </aside>
  );
}
