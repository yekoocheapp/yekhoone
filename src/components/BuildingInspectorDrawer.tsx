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
  Phone
} from "lucide-react";

interface BuildingInspectorDrawerProps {
  building: TehranBuilding | null;
  onClose: () => void;
  onFocusFloor?: (floorNumber: number) => void;
  onRegisterUnit?: (building: TehranBuilding, floorNumber: number, unitName: string) => void;
}

export default function BuildingInspectorDrawer({
  building,
  onClose,
  onFocusFloor,
  onRegisterUnit
}: BuildingInspectorDrawerProps) {
  const [selectedFloorNum, setSelectedFloorNum] = useState<number | "all">("all");

  if (!building) return null;

  const { rentUnits, saleUnits } = getActiveUnitsInBuilding(building);
  const totalActiveListings = rentUnits.length + saleUnits.length;

  const displayedFloors = selectedFloorNum === "all"
    ? building.floors
    : building.floors.filter((f) => f.floorNumber === selectedFloorNum);

  return (
    <aside
      aria-label="شناسنامه دیجیتال ساختمان"
      className="fixed inset-y-0 left-0 w-full sm:w-[460px] md:w-[500px] bg-slate-950/95 backdrop-blur-2xl border-r border-slate-800 shadow-2xl z-50 flex flex-col transition-all duration-300 animate-in slide-in-from-left"
    >
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/40 flex items-start justify-between gap-3 shrink-0">
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

      {/* Building Quick Metric Badges */}
      <div className="px-5 py-3 border-b border-slate-800/60 bg-slate-900/20 grid grid-cols-3 gap-2 shrink-0 text-center">
        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-[11px] text-slate-400 block">تعداد طبقات</span>
          <span className="text-sm font-bold text-white">
            {formatPersianNumber(building.totalFloors)} طبقه
          </span>
        </div>
        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-[11px] text-slate-400 block">کل واحدها</span>
          <span className="text-sm font-bold text-white">
            {formatPersianNumber(building.unitsCount)} واحد
          </span>
        </div>
        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-[11px] text-slate-400 block">سن بنا</span>
          <span className="text-sm font-bold text-amber-400">
            {building.age === 0 ? "نوساز کلیدنخورده" : `${formatPersianNumber(building.age)} سال ساخت`}
          </span>
        </div>
      </div>

      {/* Amenities Chips */}
      <div className="px-5 py-2.5 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 text-xs">
        {building.amenities.hasElevator && (
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 shrink-0">
            ✓ آسانسور
          </span>
        )}
        {building.amenities.hasParking && (
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 shrink-0">
            ✓ پارکینگ سندی
          </span>
        )}
        {building.amenities.hasStorage && (
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 shrink-0">
            ✓ انباری
          </span>
        )}
        {building.amenities.hasRoofGarden && (
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 shrink-0">
            🌿 روف‌گاردن
          </span>
        )}
        {building.amenities.hasPool && (
          <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 shrink-0">
            🏊‍♂️ استخر و سونا
          </span>
        )}
        {building.amenities.hasLobbyMan && (
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 shrink-0">
            🛡️ لابی‌من ۲۴ ساعته
          </span>
        )}
      </div>

      {/* Floor Cutaway Selector Bar */}
      <div className="px-5 py-3 border-b border-slate-800/60 bg-slate-900/40 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>برش طبقاتی دیجیتال تویین:</span>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              setSelectedFloorNum("all");
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedFloorNum === "all"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            همه
          </button>
          {building.floors.map((floor) => {
            const hasActiveInFloor = floor.units.some((u) => u.propertyId !== undefined);
            return (
              <button
                key={floor.floorNumber}
                onClick={() => {
                  setSelectedFloorNum(floor.floorNumber);
                  if (onFocusFloor) onFocusFloor(floor.floorNumber);
                }}
                className={`relative px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedFloorNum === floor.floorNumber
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                ط {formatPersianNumber(floor.floorNumber)}
                {hasActiveInFloor && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Floor & Units List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {displayedFloors.map((floor) => (
          <div
            key={floor.floorNumber}
            className="rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden shadow-lg transition-all hover:border-slate-700"
          >
            {/* Floor Header */}
            <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 font-bold text-xs flex items-center justify-center">
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

            {/* Units inside this Floor */}
            <div className="p-3 space-y-2.5">
              {floor.units.map((unit) => {
                const property = unit.propertyId
                  ? initialProperties.find((p) => p.id === unit.propertyId)
                  : undefined;

                return (
                  <div
                    key={unit.id}
                    className={`p-3 rounded-xl border transition-all ${
                      unit.status === "rent"
                        ? "bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500/70"
                        : unit.status === "sale"
                        ? "bg-amber-950/20 border-amber-500/40 hover:border-amber-500/70"
                        : "bg-slate-950/40 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {/* Unit Title & Status Pill */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-bold text-white truncate">
                          {unit.unitNumber}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {formatPersianNumber(unit.meters)} متر • {formatPersianNumber(unit.bedrooms)} خواب
                        </span>
                      </div>

                      {/* Status Tag */}
                      {unit.status === "rent" && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold shrink-0 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          رهن و اجاره
                        </span>
                      )}
                      {unit.status === "sale" && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[11px] font-bold shrink-0 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          برای فروش
                        </span>
                      )}
                      {unit.status === "occupied" && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[11px] font-medium shrink-0">
                          سکونت مالک
                        </span>
                      )}
                      {unit.status === "unlisted" && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-medium shrink-0">
                          ثبت نشده
                        </span>
                      )}
                    </div>

                    {/* Price and Details if Listed */}
                    {property && (
                      <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex flex-col gap-2">
                        {property.type === "rent" ? (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">ودیعه و اجاره:</span>
                            <span className="font-bold text-emerald-400">
                              {formatPersianNumber(property.deposit / 1000000)} م ودیعه / {formatPersianNumber(property.rent / 1000000)} م اجاره
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">قیمت کل:</span>
                            <span className="font-bold text-amber-400">
                              {formatPersianNumber((property.totalPrice || 0) / 1000000000)} میلیارد تومان
                            </span>
                          </div>
                        )}

                        {/* Badges: Virtual tour, algorithmic bump */}
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <div className="flex items-center gap-1.5">
                            {property.hasVirtualTour && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-semibold">
                                <Sparkles className="w-3 h-3 text-purple-400" />
                                تور مجازی ۳۶۰°
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400">
                              نردبان خودکار: {property.nextAlgorithmicBump}
                            </span>
                          </div>

                          {/* CTA Link to Full Property Listing */}
                          <Link
                            href={`/property/${property.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all hover:scale-105"
                          >
                            <span>مشاهده آگهی</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Unlisted Unit Claim Action */}
                    {!property && (
                      <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">
                          {unit.notes || "اطلاعات بیشتر در دسترس نیست"}
                        </span>
                        <button
                          onClick={() => {
                            if (onRegisterUnit) {
                              onRegisterUnit(building, floor.floorNumber, unit.unitNumber);
                            }
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 hover:underline"
                        >
                          <PlusCircle className="w-3 h-3" />
                          <span>ثبت رایگان این واحد</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Quick Action */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between gap-3 shrink-0">
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>ثبت و استعلام ۱۰۰٪ رایگان و شفاف</span>
        </div>

        <button
          onClick={() => {
            if (onRegisterUnit) {
              onRegisterUnit(building, 1, "واحد جدید");
            }
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>افزودن واحد به این ساختمان</span>
        </button>
      </div>
    </aside>
  );
}
