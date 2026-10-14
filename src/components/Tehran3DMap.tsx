"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  TehranBuilding,
  TEHRAN_BUILDINGS,
  TEHRAN_DISTRICTS,
  DistrictShortcut,
  getActiveUnitsInBuilding
} from "@/data/buildings";
import {
  Compass,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sun,
  Moon,
  Sunset,
  Layers,
  Sparkles,
  Building2,
  MapPin,
  Eye,
  Filter,
  Check
} from "lucide-react";

interface Tehran3DMapProps {
  onSelectBuilding: (building: TehranBuilding | null) => void;
  selectedBuildingId?: string | null;
  filterOnlyActive?: boolean;
  activeDistrictId?: string;
  onDistrictChange?: (districtId: string) => void;
}

// OpenFreeMap styles with global 3D vector tile building data (unblocked, Cloudflare CDN)
const MAP_STYLES = {
  bright: "https://tiles.openfreemap.org/styles/bright",
  liberty: "https://tiles.openfreemap.org/styles/liberty",
  positron: "https://tiles.openfreemap.org/styles/positron"
};

export default function Tehran3DMap({
  onSelectBuilding,
  selectedBuildingId,
  filterOnlyActive = false,
  activeDistrictId,
  onDistrictChange
}: Tehran3DMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [styleMode, setStyleMode] = useState<"liberty" | "bright" | "positron">("liberty");
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [compassBearing, setCompassBearing] = useState<number>(-15);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [hoveredBuilding, setHoveredBuilding] = useState<TehranBuilding | null>(null);

  // Helper: Setup 3D Extruded Buildings Layer on MapLibre
  const setup3DBuildingsLayer = useCallback((map: maplibregl.Map) => {
    // Check if openmaptiles source exists
    if (!map.getSource("openmaptiles")) return;
    if (map.getLayer("3d-buildings")) return;

    // Find the first label layer to insert 3D buildings underneath labels
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

    // Add 3D Extrusion Layer for real Tehran buildings
    map.addLayer(
      {
        id: "3d-buildings",
        source: "openmaptiles",
        "source-layer": "building",
        type: "fill-extrusion",
        minzoom: 14,
        paint: {
          "fill-extrusion-color": [
            "interpolate",
            ["linear"],
            ["coalesce", ["get", "render_height"], ["*", ["coalesce", ["get", "levels"], 4], 3.2], 12],
            0,
            "#0f172a",
            20,
            "#1e293b",
            40,
            "#334155",
            80,
            "#475569"
          ],
          "fill-extrusion-height": [
            "interpolate",
            ["linear"],
            ["zoom"],
            14,
            0,
            14.05,
            ["coalesce", ["get", "render_height"], ["*", ["coalesce", ["get", "levels"], 4], 3.2], 12]
          ],
          "fill-extrusion-base": [
            "interpolate",
            ["linear"],
            ["zoom"],
            14,
            0,
            14.05,
            ["coalesce", ["get", "render_min_height"], 0]
          ],
          "fill-extrusion-opacity": 0.88
        }
      },
      labelLayerId
    );
  }, []);

  // Initialize MapLibre GL instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Explicitly configure Worker URL & RTL plugin for Next.js Turbopack
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      const workerUrl = `${origin}/maplibre-gl-worker.js`;
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

    // Center on Sa'adat Abad / Tehran
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES[styleMode],
      center: [51.3734, 35.7876],
      zoom: 16.2,
      pitch: 60,
      bearing: -15,
      maxPitch: 80,
      attributionControl: false
    });

    mapRef.current = map;

    map.on("load", () => {
      setMapLoaded(true);
      setup3DBuildingsLayer(map);
    });

    map.on("rotate", () => {
      setCompassBearing(map.getBearing());
    });

    // Real-time click on any real 3D building in Tehran
    map.on("click", (e) => {
      // 1. Check if user clicked an extruded 3D building
      const features = map.queryRenderedFeatures(e.point, { layers: ["3d-buildings"] });

      // 2. Check if click is near any registered building in TEHRAN_BUILDINGS
      let matchedBuilding: TehranBuilding | undefined;
      const clickedLng = e.lngLat.lng;
      const clickedLat = e.lngLat.lat;

      for (const bldg of TEHRAN_BUILDINGS) {
        const dLng = Math.abs(bldg.coordinates.lng - clickedLng);
        const dLat = Math.abs(bldg.coordinates.lat - clickedLat);
        // Approx within 0.0008 deg (~70 meters)
        if (dLng < 0.0008 && dLat < 0.0008) {
          matchedBuilding = bldg;
          break;
        }
      }

      if (matchedBuilding) {
        onSelectBuilding(matchedBuilding);
        map.flyTo({
          center: [matchedBuilding.coordinates.lng, matchedBuilding.coordinates.lat],
          zoom: 17.5,
          pitch: 65,
          duration: 1200
        });
      } else if (features && features.length > 0) {
        // Real building polygon in Tehran was clicked!
        const feat = features[0];
        const height = feat.properties?.render_height || (feat.properties?.levels ? feat.properties.levels * 3.2 : 18);
        const estimatedFloors = Math.max(3, Math.round(height / 3.2));

        // Create on-the-fly real cadastral building twin for Tehran
        const dynamicBuilding: TehranBuilding = {
          id: `osm-${feat.id || Math.round(clickedLat * 10000)}`,
          name: `ساختمان پلاک ثبتی ${Math.round(clickedLng * 100) % 50 + 1}`,
          district: "تهران (محدوده شهری)",
          street: "کوچه ثبتی مجاور",
          plaque: `پلاک ${Math.round(clickedLng * 100) % 50 + 1}`,
          fullAddress: `تهران، مختصات جغرافیایی ${clickedLat.toFixed(4)}°N, ${clickedLng.toFixed(4)}°E`,
          totalFloors: estimatedFloors,
          unitsCount: estimatedFloors * 2,
          age: 3,
          architecturalStyle: "modern-glass",
          amenities: {
            hasElevator: estimatedFloors > 3,
            hasParking: true,
            hasStorage: true,
            hasLobby: estimatedFloors > 5,
            hasLobbyMan: estimatedFloors > 6,
            hasRoofGarden: false,
            hasPool: false,
            hasGym: false
          },
          coordinates: { lat: clickedLat, lng: clickedLng },
          worldPosition: { x: 0, z: 0 },
          dimensions: { width: 18, depth: 20, height: height },
          floors: Array.from({ length: estimatedFloors }).map((_, idx) => {
            const fNum = estimatedFloors - idx;
            return {
              floorNumber: fNum,
              floorLabel: fNum === estimatedFloors ? `طبقه ${fNum} (بالاترین طبقه)` : `طبقه ${fNum}`,
              units: [
                {
                  id: `dyn-u-${fNum}-1`,
                  unitNumber: `واحد ${fNum * 2 - 1} - شمالی`,
                  floor: fNum,
                  meters: 110,
                  bedrooms: 2,
                  status: "unlisted",
                  notes: "این واحد هنوز در سامانه یه خونه ثبت نشده است"
                },
                {
                  id: `dyn-u-${fNum}-2`,
                  unitNumber: `واحد ${fNum * 2} - جنوبی`,
                  floor: fNum,
                  meters: 110,
                  bedrooms: 2,
                  status: "occupied",
                  notes: "سکونت شخصی"
                }
              ]
            };
          })
        };

        onSelectBuilding(dynamicBuilding);
        map.flyTo({
          center: [clickedLng, clickedLat],
          zoom: 17.5,
          pitch: 65,
          duration: 1000
        });
      }
    });

    // Hover cursor styling
    map.on("mousemove", "3d-buildings", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "3d-buildings", () => {
      map.getCanvas().style.cursor = "";
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
    };
  }, []);

  // Render Real 3D Custom HTML Markers for Registered Properties in Tehran
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    TEHRAN_BUILDINGS.forEach((bldg) => {
      const { rentUnits, saleUnits } = getActiveUnitsInBuilding(bldg);
      const totalActive = rentUnits.length + saleUnits.length;
      if (filterOnlyActive && totalActive === 0) return;

      const hasRent = rentUnits.length > 0;
      const hasSale = saleUnits.length > 0;
      const isSelected = selectedBuildingId === bldg.id;

      // Create Custom 3D Marker DOM Element
      const el = document.createElement("div");
      el.className = "group cursor-pointer select-none";

      const badgeColor = hasRent && hasSale
        ? "bg-purple-500 text-white border-purple-300"
        : hasRent
        ? "bg-emerald-500 text-slate-950 border-emerald-300"
        : hasSale
        ? "bg-amber-500 text-slate-950 border-amber-300"
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
        <div class="relative flex flex-col items-center transition-all duration-300 ${isSelected ? "scale-110 z-40" : "hover:scale-105 z-20"}">
          <!-- Price Badge Pill -->
          <div class="px-2.5 py-1 rounded-xl shadow-2xl font-black text-[11px] whitespace-nowrap border flex items-center gap-1.5 ${badgeColor}">
            <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span>${priceLabel}</span>
          </div>

          <!-- Pin stem & pulse aura -->
          <div class="w-3 h-3 rotate-45 -mt-1.5 shadow-md ${badgeColor}"></div>
          <div class="w-2.5 h-2.5 rounded-full bg-amber-400 mt-0.5 shadow-lg shadow-amber-500/50"></div>
        </div>
      `;

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectBuilding(bldg);
        map.flyTo({
          center: [bldg.coordinates.lng, bldg.coordinates.lat],
          zoom: 17.5,
          pitch: 65,
          duration: 1200
        });
      });

      const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([bldg.coordinates.lng, bldg.coordinates.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [filterOnlyActive, selectedBuildingId, onSelectBuilding]);

  // Handle building selection camera focus
  useEffect(() => {
    if (!selectedBuildingId || !mapRef.current) return;
    const bldg = TEHRAN_BUILDINGS.find((b) => b.id === selectedBuildingId);
    if (!bldg) return;

    mapRef.current.flyTo({
      center: [bldg.coordinates.lng, bldg.coordinates.lat],
      zoom: 17.5,
      pitch: 65,
      bearing: -20,
      duration: 1500
    });
  }, [selectedBuildingId]);

  // Handle district jump
  useEffect(() => {
    if (!activeDistrictId || !mapRef.current) return;
    const district = TEHRAN_DISTRICTS.find((d) => d.id === activeDistrictId);
    if (!district) return;

    mapRef.current.flyTo({
      center: [district.centerCoordinates.lng, district.centerCoordinates.lat],
      zoom: district.zoom || 16.3,
      pitch: district.pitch || 60,
      bearing: district.bearing || -15,
      duration: 2000
    });
  }, [activeDistrictId]);

  // Style change handler
  const handleStyleChange = (mode: "liberty" | "bright" | "positron") => {
    if (!mapRef.current) return;
    setStyleMode(mode);
    mapRef.current.setStyle(MAP_STYLES[mode]);
    mapRef.current.once("style.load", () => {
      if (mapRef.current) {
        setup3DBuildingsLayer(mapRef.current);
      }
    });
  };

  const handleZoom = (delta: number) => {
    if (!mapRef.current) return;
    mapRef.current.easeTo({ zoom: mapRef.current.getZoom() + delta, duration: 300 });
  };

  const resetView = () => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [51.3734, 35.7876],
      zoom: 14.5,
      pitch: 50,
      bearing: -15,
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

  return (
    <div
      ref={mapContainerRef}
      className="relative w-full h-full bg-slate-950 overflow-hidden select-none"
    >
      {/* Top Left Navigation Bar & Compass */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
        {/* Compass */}
        <div
          onClick={() => {
            if (mapRef.current) mapRef.current.resetNorthPitch({ duration: 800 });
          }}
          className="bg-slate-950/85 backdrop-blur-md p-2.5 rounded-2xl border border-slate-800 shadow-xl flex items-center gap-1.5 text-slate-300 text-xs font-mono pointer-events-auto cursor-pointer hover:bg-slate-900 transition-colors"
          title="جهت‌نمای جغرافیایی تهران (شمال به سمت قله توچال و شمیرانات)"
        >
          <Compass
            className="w-4 h-4 text-amber-400 transition-transform duration-150"
            style={{ transform: `rotate(${-compassBearing}deg)` }}
          />
          <span className="font-bold text-amber-400">N</span>
        </div>

        {/* Real Vector Map Themes (Liberty / Bright / Positron) */}
        <div className="bg-slate-950/85 backdrop-blur-md p-1 rounded-2xl border border-slate-800 shadow-xl flex items-center gap-1 pointer-events-auto">
          <button
            onClick={() => handleStyleChange("liberty")}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              styleMode === "liberty"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
            title="نقشه شهری کامل تهران با خیابان‌ها و کوچه‌ها"
          >
            شهری لیبرتی
          </button>
          <button
            onClick={() => handleStyleChange("bright")}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              styleMode === "bright"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
            title="نقشه شفاف روز"
          >
            روشن
          </button>
          <button
            onClick={() => handleStyleChange("positron")}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              styleMode === "positron"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
            title="نقشه مهندسی مینیمال"
          >
            مینیمال
          </button>
        </div>
      </div>

      {/* Top Right Quick Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 pointer-events-auto">
        {/* Reset Camera View */}
        <button
          onClick={resetView}
          className="p-2.5 rounded-2xl bg-slate-950/85 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors backdrop-blur-md shadow-xl flex items-center gap-1.5 text-xs font-semibold"
          title="بازنشانی دید کل تهران"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">کل تهران</span>
        </button>

        {/* Zoom In / Out Buttons */}
        <div className="flex items-center bg-slate-950/85 backdrop-blur-md rounded-2xl border border-slate-800 p-1 shadow-xl">
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
          className="p-2.5 rounded-2xl bg-slate-950/85 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors backdrop-blur-md shadow-xl"
          title={isFullscreen ? "خروج از تمام‌صفحه" : "تمام‌صفحه"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Bottom Map Legend */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-none hidden md:flex items-center gap-3 bg-slate-950/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800 text-[11px] shadow-xl">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/20" />
          <span className="text-slate-300">رهن و اجاره فعال</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-400/20" />
          <span className="text-slate-300">فروش نقدی فعال</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 ring-2 ring-purple-400/20" />
          <span className="text-slate-300">چندین آگهی</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
          <span className="text-slate-400">ساختمان‌های ۳ بعدی تهران</span>
        </div>
      </div>

      {/* Interactive Helper Hint */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:flex items-center gap-2 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-800 text-[11px] text-slate-300 shadow-xl">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>روی هر ساختمانی در خیابان‌های تهران کلیک کنید تا شناسنامه و طبقات آن باز شود</span>
      </div>
    </div>
  );
}
