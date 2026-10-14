"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  TehranBuilding,
  BuildingFloor,
  BuildingUnit
} from "@/data/buildings";
import { formatPersianNumber, initialProperties } from "@/data/properties";
import Link from "next/link";
import {
  X,
  Camera,
  RotateCcw,
  Eye,
  Edit3,
  ExternalLink,
  Ruler,
  Building2,
  Sparkles,
  Layers,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Key,
  ShieldCheck
} from "lucide-react";

interface Building3DFrontViewerProps {
  building: TehranBuilding;
  userRole: "home_seeker" | "seller_agent";
  onClose: () => void;
  onSelectUnit?: (unit: BuildingUnit, floor: BuildingFloor) => void;
  onEditUnit?: (unit: BuildingUnit, floor: BuildingFloor) => void;
  onEditBuilding?: () => void;
  onRequestAgentMode?: () => void;
}

export default function Building3DFrontViewer({
  building,
  userRole,
  onClose,
  onSelectUnit,
  onEditUnit,
  onEditBuilding,
  onRequestAgentMode
}: Building3DFrontViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const reqIdRef = useRef<number | null>(null);

  const [selectedUnit, setSelectedUnit] = useState<{
    unit: BuildingUnit;
    floor: BuildingFloor;
  } | null>(null);
  const [cameraView, setCameraView] = useState<"elevation" | "street" | "perspective" | "penthouse">("elevation");
  const [unitsPanelOpen, setUnitsPanelOpen] = useState<boolean>(false);

  // Building geometry metrics
  const frontageWidth = building.dimensions?.width || 18;
  const numFloors = building.totalFloors;
  const floorHeight = 3.6;
  const buildingHeight = numFloors * floorHeight + 3.8; // Including ground floor lobby & parapet
  const buildingDepth = 14;

  const targetCenterY = buildingHeight * 0.48;
  const maxDim = Math.max(frontageWidth, buildingHeight);
  const fitDistance = Math.max(30, maxDim * 1.65);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene setup with soft atmospheric fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    scene.fog = new THREE.FogExp2(0x0f172a, 0.007);
    sceneRef.current = scene;

    // 2. Camera setup with framed distance
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 300);
    cameraRef.current = camera;
    camera.position.set(0, targetCenterY, fitDistance);
    camera.lookAt(0, targetCenterY, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting: Architectural golden hour with cyan sky ambient
    const ambientLight = new THREE.AmbientLight(0x7dd3fc, 0.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfef08a, 1.9);
    sunLight.position.set(30, 50, 35);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const streetLight = new THREE.PointLight(0xf59e0b, 1.4, 45);
    streetLight.position.set(0, 4, 15);
    scene.add(streetLight);

    const facadeUplight = new THREE.SpotLight(0x38bdf8, 1.6, 50, Math.PI / 4, 0.4);
    facadeUplight.position.set(0, 0.5, 12);
    facadeUplight.target.position.set(0, targetCenterY, 0);
    scene.add(facadeUplight);
    scene.add(facadeUplight.target);

    // 5. Materials
    const asphaltMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.9,
      metalness: 0.1
    });

    const sidewalkMaterial = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.7,
      metalness: 0.2
    });

    const curbMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.6
    });

    const facadeMaterial = new THREE.MeshStandardMaterial({
      color: 0x243044,
      roughness: 0.35,
      metalness: 0.25
    });

    const stonePillarsMaterial = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.4,
      metalness: 0.3
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transmission: 0.6,
      opacity: 0.85,
      transparent: true,
      roughness: 0.1,
      metalness: 0.8,
      ior: 1.5,
      emissive: 0x0284c7,
      emissiveIntensity: 0.18
    });

    const warmGlassMaterial = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.7,
      roughness: 0.2
    });

    const bronzeMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.3,
      metalness: 0.85
    });

    const greeneryMaterial = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.8
    });

    // 6. Ground & Street Setup
    const streetGeo = new THREE.PlaneGeometry(120, 70);
    const streetMesh = new THREE.Mesh(streetGeo, asphaltMaterial);
    streetMesh.rotation.x = -Math.PI / 2;
    streetMesh.position.set(0, 0, 35);
    streetMesh.receiveShadow = true;
    scene.add(streetMesh);

    const sidewalkGeo = new THREE.BoxGeometry(frontageWidth + 16, 0.35, 10);
    const sidewalkMesh = new THREE.Mesh(sidewalkGeo, sidewalkMaterial);
    sidewalkMesh.position.set(0, 0.175, 5);
    sidewalkMesh.receiveShadow = true;
    scene.add(sidewalkMesh);

    const curbGeo = new THREE.BoxGeometry(frontageWidth + 16, 0.4, 0.4);
    const curbMesh = new THREE.Mesh(curbGeo, curbMaterial);
    curbMesh.position.set(0, 0.2, 9.8);
    scene.add(curbMesh);

    // 7. Building Structure
    const buildingGroup = new THREE.Group();
    scene.add(buildingGroup);

    const mainMassGeo = new THREE.BoxGeometry(frontageWidth, buildingHeight, buildingDepth);
    const mainMassMesh = new THREE.Mesh(mainMassGeo, facadeMaterial);
    mainMassMesh.position.set(0, buildingHeight / 2, -buildingDepth / 2);
    mainMassMesh.castShadow = true;
    mainMassMesh.receiveShadow = true;
    buildingGroup.add(mainMassMesh);

    const pillarWidth = 0.9;
    const pillarDepth = 0.6;
    const leftPillarGeo = new THREE.BoxGeometry(pillarWidth, buildingHeight, pillarDepth);
    const leftPillar = new THREE.Mesh(leftPillarGeo, stonePillarsMaterial);
    leftPillar.position.set(-frontageWidth / 2 + pillarWidth / 2, buildingHeight / 2, 0.3);
    buildingGroup.add(leftPillar);

    const rightPillarGeo = new THREE.BoxGeometry(pillarWidth, buildingHeight, pillarDepth);
    const rightPillar = new THREE.Mesh(rightPillarGeo, stonePillarsMaterial);
    rightPillar.position.set(frontageWidth / 2 - pillarWidth / 2, buildingHeight / 2, 0.3);
    buildingGroup.add(rightPillar);

    // Ground Floor: Lobby & Garage
    const lobbyHeight = 3.6;
    const doorFrameGeo = new THREE.BoxGeometry(3.4, 2.7, 0.25);
    const doorFrame = new THREE.Mesh(doorFrameGeo, bronzeMetalMaterial);
    doorFrame.position.set(-frontageWidth * 0.25, 1.35, 0.15);
    buildingGroup.add(doorFrame);

    const glassDoorGeo = new THREE.PlaneGeometry(3.0, 2.4);
    const glassDoor = new THREE.Mesh(glassDoorGeo, warmGlassMaterial);
    glassDoor.position.set(-frontageWidth * 0.25, 1.35, 0.28);
    buildingGroup.add(glassDoor);

    const canopyGeo = new THREE.BoxGeometry(4.2, 0.2, 1.8);
    const canopy = new THREE.Mesh(canopyGeo, stonePillarsMaterial);
    canopy.position.set(-frontageWidth * 0.25, 2.85, 0.9);
    canopy.castShadow = true;
    buildingGroup.add(canopy);

    const garageGateGeo = new THREE.BoxGeometry(4.6, 2.5, 0.15);
    const garageGateMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.3 });
    const garageGate = new THREE.Mesh(garageGateGeo, garageGateMat);
    garageGate.position.set(frontageWidth * 0.25, 1.25, 0.1);
    buildingGroup.add(garageGate);

    // Stack of Residential Floors
    const floorSlabGeo = new THREE.BoxGeometry(frontageWidth + 0.4, 0.35, 1.2);

    for (let f = 1; f <= numFloors; f++) {
      const floorY = lobbyHeight + (f - 1) * floorHeight;
      const slabMesh = new THREE.Mesh(floorSlabGeo, stonePillarsMaterial);
      slabMesh.position.set(0, floorY, 0.5);
      slabMesh.castShadow = true;
      slabMesh.receiveShadow = true;
      buildingGroup.add(slabMesh);

      const balconyWidth = (frontageWidth - 3) / 2;
      const balconyDepth = 1.4;
      const balconyHeight = 1.05;

      // Left Unit
      const leftBalconyBaseGeo = new THREE.BoxGeometry(balconyWidth, 0.25, balconyDepth);
      const leftBalconyBase = new THREE.Mesh(leftBalconyBaseGeo, stonePillarsMaterial);
      leftBalconyBase.position.set(-frontageWidth * 0.25, floorY + 0.15, balconyDepth / 2);
      leftBalconyBase.castShadow = true;
      buildingGroup.add(leftBalconyBase);

      const leftRailingGeo = new THREE.BoxGeometry(balconyWidth, balconyHeight, 0.08);
      const leftRailing = new THREE.Mesh(leftRailingGeo, glassMaterial);
      leftRailing.position.set(-frontageWidth * 0.25, floorY + 0.15 + balconyHeight / 2, balconyDepth);
      buildingGroup.add(leftRailing);

      const leftWindowGeo = new THREE.PlaneGeometry(balconyWidth - 0.4, floorHeight - 0.9);
      const isLeftUnitLit = (f + 1) % 2 === 0;
      const leftWindow = new THREE.Mesh(leftWindowGeo, isLeftUnitLit ? warmGlassMaterial : glassMaterial);
      leftWindow.position.set(-frontageWidth * 0.25, floorY + floorHeight * 0.5, 0.05);
      buildingGroup.add(leftWindow);

      // Right Unit
      const rightBalconyBase = new THREE.Mesh(leftBalconyBaseGeo, stonePillarsMaterial);
      rightBalconyBase.position.set(frontageWidth * 0.25, floorY + 0.15, balconyDepth / 2);
      rightBalconyBase.castShadow = true;
      buildingGroup.add(rightBalconyBase);

      const rightRailing = new THREE.Mesh(leftRailingGeo, glassMaterial);
      rightRailing.position.set(frontageWidth * 0.25, floorY + 0.15 + balconyHeight / 2, balconyDepth);
      buildingGroup.add(rightRailing);

      const isRightUnitLit = f % 2 === 0;
      const rightWindow = new THREE.Mesh(leftWindowGeo, isRightUnitLit ? warmGlassMaterial : glassMaterial);
      rightWindow.position.set(frontageWidth * 0.25, floorY + floorHeight * 0.5, 0.05);
      buildingGroup.add(rightWindow);
    }

    // Rooftop Parapet
    const roofY = lobbyHeight + numFloors * floorHeight;
    const parapetGeo = new THREE.BoxGeometry(frontageWidth + 0.6, 1.2, 0.4);
    const parapetMesh = new THREE.Mesh(parapetGeo, stonePillarsMaterial);
    parapetMesh.position.set(0, roofY + 0.6, 0.2);
    buildingGroup.add(parapetMesh);

    const elevatorRoomGeo = new THREE.BoxGeometry(5, 3.2, 5);
    const elevatorRoom = new THREE.Mesh(elevatorRoomGeo, facadeMaterial);
    elevatorRoom.position.set(0, roofY + 1.6, -3);
    buildingGroup.add(elevatorRoom);

    if (building.amenities?.hasRoofGarden) {
      const planterGeo = new THREE.BoxGeometry(frontageWidth * 0.7, 0.6, 0.8);
      const planter = new THREE.Mesh(planterGeo, greeneryMaterial);
      planter.position.set(0, roofY + 0.9, -0.6);
      buildingGroup.add(planter);
    }

    // Street Trees
    for (const xPos of [-frontageWidth / 2 - 3, frontageWidth / 2 + 3]) {
      const trunkGeo = new THREE.CylinderGeometry(0.18, 0.25, 3.5, 8);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03 });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.set(xPos, 1.75, 6);
      scene.add(trunk);

      const leavesGeo = new THREE.DodecahedronGeometry(2);
      const leaves = new THREE.Mesh(leavesGeo, greeneryMaterial);
      leaves.position.set(xPos, 4.5, 6);
      scene.add(leaves);
    }

    // Mouse & Touch Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0;
    let targetPitchY = targetCenterY;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotY += dx * 0.005;
      targetPitchY = Math.max(2, Math.min(buildingHeight * 0.95, targetPitchY - dy * 0.04));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const currentDist = camera.position.distanceTo(new THREE.Vector3(0, targetCenterY, 0));
      const newDist = Math.max(16, Math.min(80, currentDist + e.deltaY * 0.04));
      const dir = camera.position.clone().sub(new THREE.Vector3(0, targetPitchY, 0)).normalize();
      camera.position.copy(dir.multiplyScalar(newDist).add(new THREE.Vector3(0, targetPitchY, 0)));
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    dom.addEventListener("wheel", onWheel, { passive: false });

    // Touch support
    let prevTouchX = 0;
    let prevTouchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevTouchX = e.touches[0].clientX;
        prevTouchY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - prevTouchX;
      const dy = e.touches[0].clientY - prevTouchY;
      prevTouchX = e.touches[0].clientX;
      prevTouchY = e.touches[0].clientY;
      targetRotY += dx * 0.006;
      targetPitchY = Math.max(2, Math.min(buildingHeight * 0.95, targetPitchY - dy * 0.05));
    };
    const onTouchEnd = () => {
      isDragging = false;
    };
    dom.addEventListener("touchstart", onTouchStart);
    dom.addEventListener("touchmove", onTouchMove);
    dom.addEventListener("touchend", onTouchEnd);

    // Animation Loop
    let angle = 0;
    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);

      angle += (targetRotY - angle) * 0.08;
      const currentRadius = fitDistance;
      camera.position.x = Math.sin(angle) * currentRadius;
      camera.position.z = Math.cos(angle) * currentRadius;
      camera.position.y += (targetPitchY - camera.position.y) * 0.08;
      camera.lookAt(0, targetCenterY, 0);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      dom.removeEventListener("wheel", onWheel);
      dom.removeEventListener("touchstart", onTouchStart);
      dom.removeEventListener("touchmove", onTouchMove);
      dom.removeEventListener("touchend", onTouchEnd);
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [building, frontageWidth, numFloors, buildingHeight, fitDistance, targetCenterY]);

  // Set camera view angles with proper framing
  const applyCameraPreset = (view: "elevation" | "street" | "perspective" | "penthouse") => {
    setCameraView(view);
    const camera = cameraRef.current;
    if (!camera) return;

    if (view === "elevation") {
      // Direct front elevation view framed cleanly
      camera.position.set(0, targetCenterY, fitDistance);
      camera.lookAt(0, targetCenterY, 0);
    } else if (view === "street") {
      // Pedestrian eye level across the street
      camera.position.set(0, 2.2, fitDistance * 0.85);
      camera.lookAt(0, targetCenterY * 0.8, 0);
    } else if (view === "perspective") {
      // Dynamic 3/4 isometric perspective
      camera.position.set(frontageWidth * 0.9, targetCenterY * 1.2, fitDistance * 0.9);
      camera.lookAt(0, targetCenterY, 0);
    } else if (view === "penthouse") {
      // Elevated penthouse & terrace angle
      camera.position.set(0, buildingHeight * 0.95, fitDistance * 0.7);
      camera.lookAt(0, buildingHeight * 0.85, 0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col select-none overflow-hidden animate-in fade-in">
      {/* ==================== CLEAN TOP NAVIGATION BAR ==================== */}
      <header className="h-16 px-4 sm:px-6 bg-slate-950/95 border-b border-slate-800 backdrop-blur-xl flex items-center justify-between gap-3 shrink-0 z-30">
        {/* Right side: Building Title, Plaque & Inline Frontage Badge */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm sm:text-base font-extrabold text-white truncate">
                {building.name}
              </h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                {building.plaque}
              </span>
              {/* Inline Frontage Width Pill */}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5" />
                <span>بر اصلی: {formatPersianNumber(frontageWidth)} متر</span>
              </span>
              <span className="text-[11px] text-slate-400 hidden lg:inline">
                ({formatPersianNumber(numFloors)} طبقه • ارتفاع: {formatPersianNumber(Math.round(buildingHeight))}م)
              </span>
            </div>
          </div>
        </div>

        {/* Center: Camera Preset Switcher */}
        <div className="hidden md:flex items-center gap-1 p-1 bg-slate-900 rounded-2xl border border-slate-800">
          <button
            onClick={() => applyCameraPreset("elevation")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              cameraView === "elevation"
                ? "bg-amber-500 text-slate-950 shadow-md font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>نمای مستقیم</span>
          </button>
          <button
            onClick={() => applyCameraPreset("street")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              cameraView === "street"
                ? "bg-amber-500 text-slate-950 shadow-md font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>دید پیاده‌رو</span>
          </button>
          <button
            onClick={() => applyCameraPreset("perspective")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              cameraView === "perspective"
                ? "bg-amber-500 text-slate-950 shadow-md font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>دید پرسپکتیو</span>
          </button>
          <button
            onClick={() => applyCameraPreset("penthouse")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              cameraView === "penthouse"
                ? "bg-amber-500 text-slate-950 shadow-md font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>پنت‌هاوس</span>
          </button>
        </div>

        {/* Left side: Role Action & Back to Map Button */}
        <div className="flex items-center gap-2">
          {userRole === "seller_agent" && onEditBuilding && (
            <button
              onClick={onEditBuilding}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>ویرایش ابعاد ساختمان</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs transition-all hover:scale-105 shadow-lg"
            title="خروج از نمای ۳ بعدی و بازگشت به نقشه کاداستر"
          >
            <ArrowRight className="w-4 h-4 text-amber-400" />
            <span>بازگشت به نقشه</span>
          </button>
        </div>
      </header>

      {/* ==================== 100% UNOBSTRUCTED 3D VIEWPORT ==================== */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        {/* Three.js Canvas Mount */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Mobile Camera Angle Quick Switcher */}
        <div className="md:hidden absolute top-3 inset-x-3 z-20 flex justify-center pointer-events-none">
          <div className="flex items-center gap-1 p-1 bg-slate-950/90 backdrop-blur-md rounded-xl border border-slate-800 shadow-xl pointer-events-auto">
            <button
              onClick={() => applyCameraPreset("elevation")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                cameraView === "elevation" ? "bg-amber-500 text-slate-950" : "text-slate-300"
              }`}
            >
              مستقیم
            </button>
            <button
              onClick={() => applyCameraPreset("street")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                cameraView === "street" ? "bg-amber-500 text-slate-950" : "text-slate-300"
              }`}
            >
              پیاده‌رو
            </button>
            <button
              onClick={() => applyCameraPreset("perspective")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                cameraView === "perspective" ? "bg-amber-500 text-slate-950" : "text-slate-300"
              }`}
            >
              ۳ بعدی
            </button>
          </div>
        </div>

        {/* Hint Pill at bottom-left */}
        <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-800 text-[11px] text-slate-300 shadow-lg">
          <RotateCcw className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>با ماوس یا لمس بچرخانید • کل نمای ساختمان با بر {formatPersianNumber(frontageWidth)} متر در دسترس است</span>
        </div>

        {/* ==================== COMPACT HORIZONTAL BOTTOM UNITS DOCK ==================== */}
        <div className="absolute bottom-4 right-4 sm:right-6 z-20 pointer-events-auto max-w-xl flex flex-col items-end gap-2">
          {/* Toggle Button */}
          <button
            onClick={() => setUnitsPanelOpen(!unitsPanelOpen)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 shadow-2xl backdrop-blur-md transition-all hover:border-amber-500/50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>واحدهای این ساختمان ({formatPersianNumber(building.unitsCount)} واحد)</span>
            {unitsPanelOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Expandable Horizontal Units Tray */}
          {unitsPanelOpen && (
            <div className="w-full bg-slate-950/95 backdrop-blur-2xl border border-slate-800 rounded-3xl p-3 shadow-2xl space-y-2 animate-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px] text-slate-400">
                <span>انتخاب واحد جهت مشاهده یا قیمت‌گذاری:</span>
                <span className="text-amber-400 font-bold">{building.district}</span>
              </div>

              {/* Horizontal Scrollable Units Cards */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {building.floors.flatMap((fl) =>
                  fl.units.map((unit) => {
                    const property = unit.propertyId
                      ? initialProperties.find((p) => p.id === unit.propertyId)
                      : undefined;

                    const isSelected = selectedUnit?.unit.id === unit.id;

                    return (
                      <div
                        key={unit.id}
                        onClick={() => {
                          setSelectedUnit({ unit, floor: fl });
                          if (onSelectUnit) onSelectUnit(unit, fl);
                        }}
                        className={`p-2.5 rounded-2xl border text-right cursor-pointer shrink-0 w-44 transition-all ${
                          isSelected
                            ? "bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/40"
                            : unit.status === "rent"
                            ? "bg-emerald-950/30 border-emerald-500/40 hover:border-emerald-500"
                            : unit.status === "sale"
                            ? "bg-amber-950/30 border-amber-500/40 hover:border-amber-500"
                            : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-white truncate">{unit.unitNumber}</span>
                          {unit.status === "rent" && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold">
                              رهن
                            </span>
                          )}
                          {unit.status === "sale" && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold">
                              فروش
                            </span>
                          )}
                          {unit.status === "occupied" && (
                            <span className="text-[9px] text-slate-400">سکونت</span>
                          )}
                          {unit.status === "unlisted" && (
                            <span className="text-[9px] text-indigo-300">ثبت نشده</span>
                          )}
                        </div>

                        <div className="text-[10px] text-slate-400">
                          {formatPersianNumber(unit.meters)} متر • ط {formatPersianNumber(fl.floorNumber)}
                        </div>

                        {unit.status === "rent" && (
                          <div className="text-[10px] text-emerald-400 font-bold mt-1 truncate">
                            {formatPersianNumber((unit.deposit || (property?.deposit ?? 0)) / 1000000)}م ودیعه
                          </div>
                        )}

                        {unit.status === "sale" && (
                          <div className="text-[10px] text-amber-400 font-bold mt-1 truncate">
                            {formatPersianNumber(((unit.totalPrice || (property?.totalPrice ?? 0)) / 1000000000).toFixed(1))} میلیارد
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Selected Unit Action Footer */}
              {selectedUnit && (
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="text-xs">
                    <span className="text-white font-bold">{selectedUnit.unit.unitNumber}:</span>{" "}
                    <span className="text-slate-400">{formatPersianNumber(selectedUnit.unit.meters)} متر</span>
                  </div>

                  {userRole === "seller_agent" ? (
                    <button
                      onClick={() => onEditUnit && onEditUnit(selectedUnit.unit, selectedUnit.floor)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md shadow-amber-500/20"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>قیمت‌گذاری این واحد</span>
                    </button>
                  ) : selectedUnit.unit.propertyId ? (
                    <Link
                      href={`/property/${selectedUnit.unit.propertyId}`}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-l from-amber-500 to-orange-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md shadow-amber-500/20"
                    >
                      <span>مشاهده آگهی</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <span className="text-[11px] text-slate-500">
                      {selectedUnit.unit.status === "occupied" ? "سکونت شخصی مالک" : "هنوز ثبت نشده"}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
