"use client";

import React, { useState, useEffect } from "react";
import {
  TehranBuilding,
  BuildingFloor,
  BuildingUnit,
  UnitStatus
} from "@/data/buildings";
import { formatPersianNumber } from "@/data/properties";
import {
  X,
  Building2,
  Ruler,
  Layers,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Tag,
  Key,
  Home,
  Clock,
  Phone
} from "lucide-react";

interface BuildingManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  building: TehranBuilding;
  initialUnit?: BuildingUnit | null;
  initialFloor?: BuildingFloor | null;
  onSaveBuilding: (updatedBuilding: TehranBuilding) => void;
}

export default function BuildingManagementModal({
  isOpen,
  onClose,
  building,
  initialUnit,
  initialFloor,
  onSaveBuilding
}: BuildingManagementModalProps) {
  // Modal active tab: 'unit' (mark/price unit) or 'specs' (building dimensions & width)
  const [activeTab, setActiveTab] = useState<"unit" | "specs">(
    initialUnit ? "unit" : "specs"
  );

  // Building specs state
  const [bldgName, setBldgName] = useState(building.name);
  const [bldgPlaque, setBldgPlaque] = useState(building.plaque);
  const [frontageWidth, setFrontageWidth] = useState<number>(
    building.dimensions?.width || 18
  );
  const [totalFloors, setTotalFloors] = useState<number>(building.totalFloors);
  const [age, setAge] = useState<number>(building.age);
  const [amenities, setAmenities] = useState({ ...building.amenities });

  // Unit pricing state
  const [selectedFloorNum, setSelectedFloorNum] = useState<number>(
    initialFloor?.floorNumber || building.floors[0]?.floorNumber || 1
  );
  const [selectedUnitId, setSelectedUnitId] = useState<string>(
    initialUnit?.id || building.floors[0]?.units[0]?.id || ""
  );
  const [unitStatus, setUnitStatus] = useState<UnitStatus>(
    initialUnit?.status || "rent"
  );
  const [unitMeters, setUnitMeters] = useState<number>(initialUnit?.meters || 120);
  const [unitBedrooms, setUnitBedrooms] = useState<number>(
    initialUnit?.bedrooms || 2
  );
  const [deposit, setDeposit] = useState<string>(
    initialUnit?.deposit ? String(initialUnit.deposit / 1000000) : "500"
  );
  const [rent, setRent] = useState<string>(
    initialUnit?.rent ? String(initialUnit.rent / 1000000) : "25"
  );
  const [totalPrice, setTotalPrice] = useState<string>(
    initialUnit?.totalPrice
      ? String((initialUnit.totalPrice / 1000000000).toFixed(1))
      : "18.5"
  );
  const [contactPhone, setContactPhone] = useState<string>("09121234567");
  const [unitNotes, setUnitNotes] = useState<string>(initialUnit?.notes || "");
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Update selection if initial props change
  useEffect(() => {
    if (initialUnit) {
      setActiveTab("unit");
      setSelectedUnitId(initialUnit.id);
      setUnitStatus(initialUnit.status);
      setUnitMeters(initialUnit.meters);
      setUnitBedrooms(initialUnit.bedrooms);
      if (initialUnit.deposit) setDeposit(String(initialUnit.deposit / 1000000));
      if (initialUnit.rent) setRent(String(initialUnit.rent / 1000000));
      if (initialUnit.totalPrice)
        setTotalPrice(String((initialUnit.totalPrice / 1000000000).toFixed(1)));
      if (initialUnit.notes) setUnitNotes(initialUnit.notes);
    }
    if (initialFloor) {
      setSelectedFloorNum(initialFloor.floorNumber);
    }
  }, [initialUnit, initialFloor]);

  if (!isOpen) return null;

  // Handle Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Create a cloned building
    const updated: TehranBuilding = {
      ...building,
      name: bldgName,
      plaque: bldgPlaque,
      totalFloors: totalFloors,
      dimensions: {
        ...building.dimensions,
        width: Number(frontageWidth) || 18,
        height: totalFloors * 3.5 + 4
      },
      amenities: { ...amenities },
      floors: building.floors.map((fl) => {
        return {
          ...fl,
          units: fl.units.map((u) => {
            if (u.id === selectedUnitId) {
              return {
                ...u,
                status: unitStatus,
                meters: Number(unitMeters) || u.meters,
                bedrooms: Number(unitBedrooms) || u.bedrooms,
                deposit: unitStatus === "rent" ? Number(deposit) * 1000000 : undefined,
                rent: unitStatus === "rent" ? Number(rent) * 1000000 : undefined,
                totalPrice:
                  unitStatus === "sale" ? Number(totalPrice) * 1000000000 : undefined,
                notes: unitNotes || (unitStatus === "rent" ? "رهن و اجاره" : unitStatus === "sale" ? "فروش نقدی" : "سکونت مالک")
              };
            }
            return u;
          })
        };
      })
    };

    onSaveBuilding(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in select-none">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-7 relative text-slate-100 flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                پنل اختصاصی مالک و مشاور املاک
              </span>
              <span className="text-xs text-slate-400">
                {building.district}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-white mt-1">
              مدیریت و قیمت‌گذاری ساختمان: {building.name}
            </h3>
          </div>
        </div>

        {savedSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">
              اطلاعات با موفقیت ذخیره و روی نقشه به‌روزرسانی شد!
            </h4>
            <p className="text-xs text-slate-400 max-w-sm">
              نردبان خودکار سیستمیک هر ۴ ساعت یک‌بار برای این فایل فعال گردید.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            {/* Tab Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-950 border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab("unit")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "unit"
                    ? "bg-amber-500 text-slate-950 shadow-md font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>تعیین وضعیت و قیمت واحد</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("specs")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "specs"
                    ? "bg-amber-500 text-slate-950 shadow-md font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>بر ساختمان و ابعاد مهندسی</span>
              </button>
            </div>

            {/* TAB 1: UNIT PRICING & STATUS */}
            {activeTab === "unit" && (
              <div className="space-y-4 animate-in fade-in">
                {/* Select Floor & Unit */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">انتخاب طبقه</label>
                    <select
                      value={selectedFloorNum}
                      onChange={(e) => {
                        const fNum = Number(e.target.value);
                        setSelectedFloorNum(fNum);
                        const fl = building.floors.find((f) => f.floorNumber === fNum);
                        if (fl && fl.units[0]) {
                          setSelectedUnitId(fl.units[0].id);
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      {building.floors.map((fl) => (
                        <option key={fl.floorNumber} value={fl.floorNumber}>
                          {fl.floorLabel}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">انتخاب واحد</label>
                    <select
                      value={selectedUnitId}
                      onChange={(e) => {
                        const uId = e.target.value;
                        setSelectedUnitId(uId);
                        for (const fl of building.floors) {
                          const found = fl.units.find((u) => u.id === uId);
                          if (found) {
                            setUnitStatus(found.status);
                            setUnitMeters(found.meters);
                            setUnitBedrooms(found.bedrooms);
                            if (found.deposit) setDeposit(String(found.deposit / 1000000));
                            if (found.rent) setRent(String(found.rent / 1000000));
                            if (found.totalPrice)
                              setTotalPrice(String((found.totalPrice / 1000000000).toFixed(1)));
                            break;
                          }
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      {building.floors
                        .find((f) => f.floorNumber === selectedFloorNum)
                        ?.units.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.unitNumber} ({formatPersianNumber(u.meters)} متر)
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Deal Status Buttons */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">وضعیت ملک</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setUnitStatus("rent")}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        unitStatus === "rent"
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-sm"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      🟢 رهن و اجاره
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnitStatus("sale")}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        unitStatus === "sale"
                          ? "bg-amber-500/20 border-amber-500 text-amber-400 shadow-sm"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      🟡 فروش نقدی
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnitStatus("occupied")}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        unitStatus === "occupied"
                          ? "bg-slate-800 border-slate-600 text-slate-200"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      ⚪ سکونت مالک
                    </button>
                  </div>
                </div>

                {/* Meterage and Bedrooms */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">متراژ سندی (متر مربع)</label>
                    <input
                      type="number"
                      value={unitMeters}
                      onChange={(e) => setUnitMeters(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">تعداد اتاق خواب</label>
                    <input
                      type="number"
                      value={unitBedrooms}
                      onChange={(e) => setUnitBedrooms(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                {/* Price Fields */}
                {unitStatus === "rent" && (
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                    <div>
                      <label className="text-xs text-emerald-300 block mb-1">ودیعه (میلیون تومان)</label>
                      <input
                        type="number"
                        placeholder="مثال: ۵۰۰"
                        value={deposit}
                        onChange={(e) => setDeposit(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-emerald-300 block mb-1">اجاره ماهیانه (میلیون تومان)</label>
                      <input
                        type="number"
                        placeholder="مثال: ۲۵"
                        value={rent}
                        onChange={(e) => setRent(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>
                )}

                {unitStatus === "sale" && (
                  <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/30">
                    <label className="text-xs text-amber-300 block mb-1">قیمت کل اعلامی (میلیارد تومان)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="مثال: ۱۸.۵"
                      value={totalPrice}
                      onChange={(e) => setTotalPrice(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                )}

                {/* Contact Phone */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1">شماره تماس مستقیم مالک یا مشاور املاک</label>
                  <input
                    type="tel"
                    dir="ltr"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white text-right focus:outline-none focus:border-amber-500"
                    placeholder="۰۹۱۲..."
                  />
                </div>

                {/* Algorithmic Bumping Info Box */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center gap-2.5 text-xs text-slate-300">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>نردبان خودکار سیستمیک:</strong> این واحد هر ۴ ساعت یک‌بار بدون نیاز به اقدام کاربر در صدر نتایج منطقه قرار می‌گیرد.
                  </span>
                </div>
              </div>
            )}

            {/* TAB 2: BUILDING SPECS & FRONTAGE WIDTH */}
            {activeTab === "specs" && (
              <div className="space-y-4 animate-in fade-in">
                {/* Frontage Width in Meters */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Ruler className="w-4 h-4" />
                      <span>عرض بر ساختمان رو به خیابان (متر)</span>
                    </label>
                    <span className="text-xs font-mono font-bold text-white bg-slate-950 px-2.5 py-0.5 rounded-lg border border-amber-500/40">
                      {formatPersianNumber(frontageWidth)} متر
                    </span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="50"
                    step="1"
                    value={frontageWidth}
                    onChange={(e) => setFrontageWidth(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>۸ متر (قواره دنج)</span>
                    <span>۱۸ متر (متوسط شهری)</span>
                    <span>۵۰ متر (بر تجمیعی برج)</span>
                  </div>
                </div>

                {/* Building Name & Plaque */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">نام ساختمان یا مجتمع</label>
                    <input
                      type="text"
                      value={bldgName}
                      onChange={(e) => setBldgName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">پلاک ثبتی یا شهرداری</label>
                    <input
                      type="text"
                      value={bldgPlaque}
                      onChange={(e) => setBldgPlaque(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                {/* Floors Count & Age */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">تعداد کل طبقات مسکونی</label>
                    <input
                      type="number"
                      min="1"
                      max="40"
                      value={totalFloors}
                      onChange={(e) => setTotalFloors(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">سن بنا (سال ساخت)</label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                {/* Amenities Checkboxes */}
                <div>
                  <label className="text-xs text-slate-400 block mb-2">مشاعات و امکانات ساختمان</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {[
                      { key: "hasElevator", label: "آسانسور" },
                      { key: "hasParking", label: "پارکینگ سندی" },
                      { key: "hasStorage", label: "انباری اختصاصی" },
                      { key: "hasLobby", label: "لابی مجلل" },
                      { key: "hasLobbyMan", label: "لابی‌من ۲۴ ساعته" },
                      { key: "hasRoofGarden", label: "روف‌گاردن" },
                      { key: "hasPool", label: "استخر و سونا" },
                      { key: "hasGym", label: "سالن ورزشی" }
                    ].map((item) => (
                      <label
                        key={item.key}
                        className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-all ${
                          (amenities as any)[item.key]
                            ? "bg-amber-500/20 border-amber-500/40 text-white"
                            : "bg-slate-950 border-slate-800 text-slate-400"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={(amenities as any)[item.key]}
                          onChange={(e) =>
                            setAmenities((prev) => ({
                              ...prev,
                              [item.key]: e.target.checked
                            }))
                          }
                          className="accent-amber-500 w-3.5 h-3.5"
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer Submit */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
              >
                ذخیره تغییرات و اعمال روی نقشه
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
