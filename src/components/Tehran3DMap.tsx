"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  TehranBuilding,
  TEHRAN_BUILDINGS,
  TEHRAN_DISTRICTS,
  getActiveUnitsInBuilding
} from "@/data/buildings";
import {
  Compass,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Building2,
  MapPin,
  Sparkles,
  Eye,
  Layers,
  Camera,
  Ruler,
  ShieldCheck,
  Check,
  Box
} from "lucide-react";

interface Tehran3DMapProps {
  onSelectBuilding: (building: TehranBuilding | null) => void;
  selectedBuildingId?: string | null;
  filterOnlyActive?: boolean;
  activeDistrictId?: string;
  onDistrictChange?: (districtId: string) => void;
  buildings?: TehranBuilding[];
  userRole?: "home_seeker" | "seller_agent";
  onOpen3DFront?: () => void;
}

// Middle-ground architectural styles (balanced between dark and light, with crystal-clear street typography)
const MAP_STYLES = {
  brightDark: "/styles/bright-dark-style.json",
  voyager: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
  cartoDark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
};

export default function Tehran3DMap({
  onSelectBuilding,
  selectedBuildingId,
  filterOnlyActive = false,
  activeDistrictId,
  onDistrictChange,
  buildings = TEHRAN_BUILDINGS,
  userRole = "home_seeker",
  onOpen3DFront
}: Tehran3DMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [styleMode, setStyleMode] = useState<"brightDark" | "voyager" | "cartoDark">("brightDark");
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [compassBearing, setCompassBearing] = useState<number>(0);
  const [isStreetLevel, setIsStreetLevel] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Setup 2D Cadastral Footprints & 3D Extrusion on MapLibre
  const configureBuildingLayers = useCallback((map: maplibregl.Map) => {
    // 1. Style 2D Cadastral building layer with crisp, bright slate boundaries
    if (map.getLayer("building")) {
      try {
        map.setPaintProperty("building", "fill-color", [
          "interpolate",
          ["linear"],
          ["zoom"],
          13,
          "#1e293b",
          16,
          "#334155"
        ]);
        map.setPaintProperty("building", "fill-outline-color", "#64748b");
        map.setPaintProperty("building", "fill-opacity", 0.92);
      } catch (e) {
        console.warn("Could not set custom building paint:", e);
      }
    }

    // 2. Add 3D Extruded Buildings Layer across Tehran (active from zoom 14.5+)
    if (map.getSource("openmaptiles") && !map.getLayer("3d-buildings-extrusion")) {
      const layers = map.getStyle().layers;
      let labelLayerId: string | undefined;
      if (layers) {
        for (let i = 0; i < layers.length; i++) {
          if (layers[i].type === "symbol" && layers[i].layout && (layers[i].layout as any)["text-field"]) {
            labelLayerId = layers[i].id;
            break;
          }
        }
      }

      try {
        map.addLayer(
          {
            id: "3d-buildings-extrusion",
            source: "openmaptiles",
            "source-layer": "building",
            type: "fill-extrusion",
            minzoom: 14.5,
            paint: {
              "fill-extrusion-color": [
                "interpolate",
                ["linear"],
                ["coalesce", ["get", "render_height"], ["*", ["coalesce", ["get", "levels"], 4], 3.2], 12],
                0,
                "#1e293b",
                15,
                "#334155",
                30,
                "#475569",
                60,
                "#64748b"
              ],
              "fill-extrusion-height": [
                "interpolate",
                ["linear"],
                ["zoom"],
                14.5,
                0,
                15.2,
                ["coalesce", ["get", "render_height"], ["*", ["coalesce", ["get", "levels"], 4], 3.2], 14]
              ],
              "fill-extrusion-base": [
                "interpolate",
                ["linear"],
                ["zoom"],
                14.5,
                0,
                15.2,
                ["coalesce", ["get", "render_min_height"], 0]
              ],
              "fill-extrusion-opacity": 0.95
            }
          },
          labelLayerId
        );
      } catch (err) {
        console.warn("Extrusion layer init error:", err);
      }
    }
  }, []);

  // Initialize MapLibre GL in 2D Top-Down Mode First
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let styleUrl = MAP_STYLES[styleMode];
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      const workerUrl = `${origin}/maplibre-gl-worker.js`;
      if (styleUrl.startsWith("/")) {
        styleUrl = `${origin}${styleUrl}`;
      }
      try {
        maplibregl.setWorkerUrl(workerUrl);
      } catch (e) {
        console.warn("setWorkerUrl fallback:", e);
      }
      try {
        (maplibregl as any).workerUrl = workerUrl;
      } catch {}
      try {
        if (maplibregl.getRTLTextPluginStatus() === "unavailable") {
          maplibregl.setRTLTextPlugin(`${origin}/mapbox-gl-rtl-text.min.js`, true);
        }
      } catch {}
    }

    // 2D FIRST: pitch: 0, bearing: 0, zoom: 15.5
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: [51.3734, 35.7876], // Sa'adat Abad / Tehran
      zoom: 15.5,
      pitch: 0, // Strictly 2D top-down initially
      bearing: 0,
      maxPitch: 80,
      attributionControl: false
    });

    mapRef.current = map;

    map.on("load", () => {
      setMapLoaded(true);
      configureBuildingLayers(map);
    });

    map.on("rotate", () => {
      setCompassBearing(map.getBearing());
    });

    map.on("pitch", () => {
      setIsStreetLevel(map.getPitch() > 40);
    });

    // CLICK ON ANY BUILDING PLACEHOLDER
    map.on("click", (e) => {
      const clickedLng = e.lngLat.lng;
      const clickedLat = e.lngLat.lat;

      // 1. Check if clicked near an existing registered building
      let matchedBuilding: TehranBuilding | undefined;
      for (const bldg of buildings) {
        const dLng = Math.abs(bldg.coordinates.lng - clickedLng);
        const dLat = Math.abs(bldg.coordinates.lat - clickedLat);
        // Approx within ~60 meters
        if (dLng < 0.0007 && dLat < 0.0007) {
          matchedBuilding = bldg;
          break;
        }
      }

      // 2. Query vector building polygons (both 2D and 3D)
      const buildingFeatures = map.queryRenderedFeatures(e.point, {
        layers: ["building", "3d-buildings-extrusion"].filter((l) => map.getLayer(l))
      });

      if (matchedBuilding) {
        onSelectBuilding(matchedBuilding);
        // Smooth camera descent from 2D down to street level
        map.flyTo({
          center: [matchedBuilding.coordinates.lng, matchedBuilding.coordinates.lat],
          zoom: 18.5,
          pitch: 74,
          bearing: -15,
          duration: 1600
        });
      } else if (buildingFeatures && buildingFeatures.length > 0) {
        // Dynamic building on-the-fly for real cadastral plot in Tehran
        const feat = buildingFeatures[0];
        const height = feat.properties?.render_height || (feat.properties?.levels ? feat.properties.levels * 3.2 : 18);
        const estimatedFloors = Math.max(3, Math.min(15, Math.round(height / 3.2)));
        const estimatedWidth = Math.round(14 + (Math.abs(clickedLng * 1000) % 10));

        const dynamicBuilding: TehranBuilding = {
          id: `cadastre-${feat.id || Math.round(clickedLat * 10000)}`,
          name: `ساختمان پلاک ثبتی ${Math.round(clickedLng * 100) % 60 + 1}`,
          district: "تهران (محدوده شهری)",
          street: "خیابان و کوچه ثبتی مجاور",
          plaque: `پلاک ${Math.round(clickedLng * 100) % 60 + 1}`,
          fullAddress: `تهران، مختصات کاداستر شهری ${clickedLat.toFixed(4)}°N, ${clickedLng.toFixed(4)}°E`,
          totalFloors: estimatedFloors,
          unitsCount: estimatedFloors * 2,
          age: 4,
          architecturalStyle: "modern-glass",
          amenities: {
            hasElevator: estimatedFloors > 3,
            hasParking: true,
            hasStorage: true,
            hasLobby: estimatedFloors > 5,
            hasLobbyMan: false,
            hasRoofGarden: false,
            hasPool: false,
            hasGym: false
          },
          coordinates: { lat: clickedLat, lng: clickedLng },
          worldPosition: { x: 0, z: 0 },
          dimensions: { width: estimatedWidth, depth: 20, height: height },
          floors: Array.from({ length: estimatedFloors }).map((_, idx) => {
            const fNum = estimatedFloors - idx;
            return {
              floorNumber: fNum,
              floorLabel: fNum === estimatedFloors ? `طبقه ${fNum} (بالاترین طبقه)` : `طبقه ${fNum}`,
              units: [
                {
                  id: `cad-u-${fNum}-1`,
                  unitNumber: `واحد ${fNum * 2 - 1} - شمالی`,
                  floor: fNum,
                  meters: 115,
                  bedrooms: 2,
                  status: "unlisted",
                  notes: "این واحد هنوز در سامانه قیمت‌گذاری نشده است"
                },
                {
                  id: `cad-u-${fNum}-2`,
                  unitNumber: `واحد ${fNum * 2} - جنوبی`,
                  floor: fNum,
                  meters: 120,
                  bedrooms: 2,
                  status: "occupied",
                  notes: "سکونت شخصی"
                }
              ]
            };
          })
        };

        onSelectBuilding(dynamicBuilding);
        // Smooth camera descent from 2D down to street level
        map.flyTo({
          center: [clickedLng, clickedLat],
          zoom: 18.5,
          pitch: 74,
          bearing: -15,
          duration: 1600
        });
      }
    });

    // Hover cursor
    map.on("mousemove", "building", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "building", () => {
      map.getCanvas().style.cursor = "";
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
    };
  }, []);

  // Update Custom HTML Cadastral Markers on the Map
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    buildings.forEach((bldg) => {
      const { rentUnits, saleUnits } = getActiveUnitsInBuilding(bldg);
      const totalActive = rentUnits.length + saleUnits.length;
      if (filterOnlyActive && totalActive === 0) return;

      const hasRent = rentUnits.length > 0;
      const hasSale = saleUnits.length > 0;
      const isSelected = selectedBuildingId === bldg.id;
      const frontageWidth = bldg.dimensions?.width || 18;

      const el = document.createElement("div");
      el.className = "group cursor-pointer select-none";

      const badgeColor =
        hasRent && hasSale
          ? "bg-purple-500 text-white border-purple-300 shadow-purple-500/30"
          : hasRent
          ? "bg-emerald-500 text-slate-950 border-emerald-300 shadow-emerald-500/30 font-black"
          : hasSale
          ? "bg-amber-500 text-slate-950 border-amber-300 shadow-amber-500/30 font-black"
          : "bg-slate-800 text-slate-300 border-slate-700";

      let priceLabel = "";
      if (hasRent && rentUnits[0].deposit) {
        priceLabel = `${rentUnits[0].deposit / 1000000}م ودیعه`;
      } else if (hasSale && saleUnits[0].totalPrice) {
        priceLabel = `${(saleUnits[0].totalPrice / 1000000000).toFixed(0)}میلیارد`;
      } else {
        priceLabel = bldg.name;
      }

      el.innerHTML = `
        <div class="relative flex flex-col items-center transition-all duration-300 ${
          isSelected ? "scale-115 z-40" : "hover:scale-105 z-20"
        }">
          <!-- Cadastral Price Pill -->
          <div class="px-2.5 py-1 rounded-xl shadow-2xl font-black text-[11px] whitespace-nowrap border flex items-center gap-1.5 ${badgeColor}">
            <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            <span>${priceLabel}</span>
            <span class="text-[9px] opacity-80 border-r border-black/20 pr-1 mr-0.5">${frontageWidth}م بر</span>
          </div>

          <!-- Pin Stem & Cadastral Dot -->
          <div class="w-2.5 h-2.5 rotate-45 -mt-1 shadow-md ${badgeColor}"></div>
          <div class="w-2.5 h-2.5 rounded-full ${isSelected ? "bg-amber-400 ring-4 ring-amber-400/50 scale-125" : "bg-amber-400"} mt-0.5 shadow-lg"></div>
        </div>
      `;

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectBuilding(bldg);
        // Smooth camera descent from 2D down to street level
        map.flyTo({
          center: [bldg.coordinates.lng, bldg.coordinates.lat],
          zoom: 18.5,
          pitch: 74,
          bearing: -15,
          duration: 1600
        });
      });

      const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([bldg.coordinates.lng, bldg.coordinates.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [buildings, filterOnlyActive, selectedBuildingId, onSelectBuilding]);

  // Handle building focus from parent
  useEffect(() => {
    if (!selectedBuildingId || !mapRef.current) return;
    const bldg = buildings.find((b) => b.id === selectedBuildingId);
    if (!bldg) return;

    mapRef.current.flyTo({
      center: [bldg.coordinates.lng, bldg.coordinates.lat],
      zoom: 18.5,
      pitch: 74,
      bearing: -15,
      duration: 1600
    });
  }, [selectedBuildingId, buildings]);

  // Handle district jump
  useEffect(() => {
    if (!activeDistrictId || !mapRef.current) return;
    const district = TEHRAN_DISTRICTS.find((d) => d.id === activeDistrictId);
    if (!district) return;

    mapRef.current.flyTo({
      center: [district.centerCoordinates.lng, district.centerCoordinates.lat],
      zoom: district.zoom || 15.5,
      pitch: 0, // Reset to 2D on district switch
      bearing: 0,
      duration: 1800
    });
  }, [activeDistrictId]);

  // Style change handler
  const handleStyleChange = (mode: "brightDark" | "voyager" | "cartoDark") => {
    if (!mapRef.current) return;
    setStyleMode(mode);
    let target = MAP_STYLES[mode];
    if (typeof window !== "undefined" && target.startsWith("/")) {
      target = `${window.location.origin}${target}`;
    }
    mapRef.current.setStyle(target);
    mapRef.current.once("style.load", () => {
      if (mapRef.current) {
        configureBuildingLayers(mapRef.current);
      }
    });
  };

  // Switch between 2D Top-Down & 3D Street Level Camera
  const toggleCamera2D3D = () => {
    if (!mapRef.current) return;
    const currentPitch = mapRef.current.getPitch();
    if (currentPitch > 25) {
      // Switch back to 2D Top-Down
      mapRef.current.flyTo({
        pitch: 0,
        bearing: 0,
        zoom: Math.max(15, mapRef.current.getZoom() - 1.5),
        duration: 1200
      });
    } else {
      // Descend to 3D Street Level
      mapRef.current.flyTo({
        pitch: 74,
        zoom: Math.min(18.5, mapRef.current.getZoom() + 1.5),
        bearing: -15,
        duration: 1400
      });
    }
  };

  const handleZoom = (delta: number) => {
    if (!mapRef.current) return;
    mapRef.current.easeTo({ zoom: mapRef.current.getZoom() + delta, duration: 300 });
  };

  const resetToFullTehran2D = () => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [51.3734, 35.7876],
      zoom: 14.5,
      pitch: 0, // Pure 2D
      bearing: 0,
      duration: 1500
    });
    onSelectBuilding(null);
  };

  const toggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const selectedBuilding = buildings.find((b) => b.id === selectedBuildingId);

  return (
    <div
      ref={mapContainerRef}
      className="relative w-full h-full bg-slate-950 overflow-hidden select-none"
    >
      {/* Top Left Navigation & Camera Modes (Moved to top-20 to sit comfortably below page header) */}
      <div className="absolute top-20 left-4 z-20 flex items-center gap-2 pointer-events-none">
        {/* Compass */}
        <div
          onClick={() => {
            if (mapRef.current) mapRef.current.resetNorthPitch({ duration: 800 });
          }}
          className="bg-slate-950/90 backdrop-blur-md p-2.5 rounded-2xl border border-slate-800 shadow-xl flex items-center gap-1.5 text-slate-300 text-xs font-mono pointer-events-auto cursor-pointer hover:bg-slate-900 transition-colors"
          title="جهت‌نمای جغرافیایی شمال تهران (قله توچال)"
        >
          <Compass
            className="w-4 h-4 text-amber-400 transition-transform duration-150"
            style={{ transform: `rotate(${-compassBearing}deg)` }}
          />
          <span className="font-bold text-amber-400">N</span>
        </div>

        {/* 2D / 3D Street Level Camera Angle Switcher */}
        <button
          onClick={toggleCamera2D3D}
          className={`pointer-events-auto px-3 py-2 rounded-2xl backdrop-blur-md border text-xs font-bold transition-all shadow-xl flex items-center gap-1.5 ${
            isStreetLevel
              ? "bg-amber-500 text-slate-950 border-amber-400 shadow-amber-500/20 font-black"
              : "bg-slate-950/90 hover:bg-slate-900 border-slate-800 text-slate-200"
          }`}
          title="تغییر دید بین نقشه ۲ بعدی کاداستر و نمای ۳ بعدی خیابانی"
        >
          {isStreetLevel ? (
            <>
              <Camera className="w-4 h-4 text-slate-950" />
              <span>نمای خیابانی (۳ بعدی)</span>
            </>
          ) : (
            <>
              <Layers className="w-4 h-4 text-amber-400" />
              <span>دید ۲ بعدی کاداستر</span>
            </>
          )}
        </button>

        {/* Theme Selector (Middle-Ground Slate Default) */}
        <div className="hidden sm:flex bg-slate-950/90 backdrop-blur-md p-1 rounded-2xl border border-slate-800 shadow-xl pointer-events-auto">
          <button
            onClick={() => handleStyleChange("brightDark")}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              styleMode === "brightDark"
                ? "bg-amber-500 text-slate-950 shadow-md font-black"
                : "text-slate-400 hover:text-white"
            }`}
            title="تم اسلیت متعادل بین تیره و روشن با نام‌های فوق‌العاده خوانا"
          >
            اسلیت متعادل
          </button>
          <button
            onClick={() => handleStyleChange("voyager")}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              styleMode === "voyager"
                ? "bg-amber-500 text-slate-950 shadow-md font-black"
                : "text-slate-400 hover:text-white"
            }`}
            title="تم کارتو وویجر شهری"
          >
            کارتو وویجر
          </button>
          <button
            onClick={() => handleStyleChange("cartoDark")}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              styleMode === "cartoDark"
                ? "bg-amber-500 text-slate-950 shadow-md font-black"
                : "text-slate-400 hover:text-white"
            }`}
            title="نقشه مشکی کاداستر"
          >
            کاداستر مشکی
          </button>
        </div>
      </div>

      {/* Prominent Floating Pill: "مشاهده نمای ۳ بعدی روبروی ساختمان" */}
      {selectedBuilding && onOpen3DFront && (
        <div className="absolute top-20 inset-x-0 z-20 flex justify-center pointer-events-none animate-in fade-in slide-in-from-top-4">
          <button
            onClick={onOpen3DFront}
            className="pointer-events-auto flex items-center gap-2.5 px-4 sm:px-6 py-2.5 rounded-full bg-gradient-to-l from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-2xl shadow-amber-500/30 transition-all hover:scale-105 border border-amber-300/40"
          >
            <Box className="w-4 h-4 animate-bounce" />
            <span>مشاهده نمای ۳ بعدی روبروی ساختمان: {selectedBuilding.name}</span>
            <span className="text-xs bg-slate-950 text-amber-400 px-2 py-0.5 rounded-full">
              {selectedBuilding.dimensions?.width || 18}م بر
            </span>
          </button>
        </div>
      )}

      {/* Standard Bottom-Right Navigation Stack (Reset, Zoom, Fullscreen) */}
      <div className="absolute bottom-6 right-4 z-20 flex items-center gap-2 pointer-events-auto">
        {/* Reset to 2D Top View */}
        <button
          onClick={resetToFullTehran2D}
          className="p-2.5 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors backdrop-blur-md shadow-xl flex items-center gap-1.5 text-xs font-semibold"
          title="بازنشانی به دید ۲ بعدی کل تهران"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">دید کل تهران</span>
        </button>

        {/* Zoom In / Out Buttons */}
        <div className="flex items-center bg-slate-950/90 backdrop-blur-md rounded-2xl border border-slate-800 p-1 shadow-xl">
          <button
            onClick={() => handleZoom(1)}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white"
            title="بزرگ‌نمایی"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-3 bg-slate-800 mx-0.5" />
          <button
            onClick={() => handleZoom(-1)}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white"
            title="کوچک‌نمایی"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="p-2.5 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors backdrop-blur-md shadow-xl"
          title={isFullscreen ? "خروج از تمام‌صفحه" : "تمام‌صفحه"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Bottom Map Legend (Placed at Bottom Center-Left) */}
      <div className="absolute bottom-6 left-4 z-20 pointer-events-none hidden md:flex items-center gap-3 bg-slate-950/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800 text-[11px] shadow-xl">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/20" />
          <span className="text-slate-300">رهن و اجاره</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-400/20" />
          <span className="text-slate-300">فروش نقدی</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 ring-2 ring-purple-400/20" />
          <span className="text-slate-300">چندین واحد</span>
        </div>
      </div>

      {/* Helper Notification Banner */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:flex items-center gap-2 bg-slate-950/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800 text-[11px] text-slate-300 shadow-xl">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>
          {userRole === "seller_agent"
            ? "روی هر ساختمانی کلیک کنید تا دوربین به دید خیابانی برود و بتوانید بر ساختمان و واحدها را قیمت‌گذاری کنید"
            : "روی هر پلاک کلیک کنید تا دوربین به دید خیابانی برود و نمای ۳ بعدی روبروی ساختمان باز شود"}
        </span>
      </div>
    </div>
  );
}
