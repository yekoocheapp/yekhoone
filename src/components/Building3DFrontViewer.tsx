"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  TehranBuilding,
  BuildingFloor,
  BuildingUnit,
  getActiveUnitsInBuilding
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
  DoorOpen,
  Car,
  Maximize2,
  Minimize2,
  Check,
  Info
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
  const [cameraView, setCameraView] = useState<"street" | "elevation" | "perspective" | "penthouse">("street");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Building geometry metrics
  const frontageWidth = building.dimensions?.width || 18;
  const numFloors = building.totalFloors;
  const floorHeight = 3.6;
  const buildingHeight = numFloors * floorHeight + 3.8; // Including ground floor lobby & parapet
  const buildingDepth = 14;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene setup with soft atmospheric fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090e1a);
    scene.fog = new THREE.FogExp2(0x090e1a, 0.009);
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 200);
    cameraRef.current = camera;

    // Initial position: Street level looking up at the front facade
    camera.position.set(0, 3, frontageWidth * 1.6);
    camera.lookAt(0, buildingHeight * 0.45, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting: Golden hour / bright dark luxury architectural lighting
    const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.7); // Cyan sky ambient
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfef08a, 1.8); // Warm sun
    sunLight.position.set(25, 45, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const streetLight = new THREE.PointLight(0xf59e0b, 1.2, 35); // Warm street glow
    streetLight.position.set(0, 4, 12);
    scene.add(streetLight);

    const facadeUplight = new THREE.SpotLight(0x38bdf8, 1.4, 40, Math.PI / 4, 0.4);
    facadeUplight.position.set(0, 0.5, 8);
    facadeUplight.target.position.set(0, buildingHeight * 0.5, 0);
    scene.add(facadeUplight);
    scene.add(facadeUplight.target);

    // 5. Materials
    const asphaltMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.9,
      metalness: 0.1
    });

    const sidewalkMaterial = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.75,
      metalness: 0.2
    });

    const curbMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.6
    });

    // Travertine marble / Luxury dark architectural facade material
    const facadeMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.25
    });

    const stonePillarsMaterial = new THREE.MeshStandardMaterial({
      color: 0x475569,
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
      emissiveIntensity: 0.15
    });

    const warmGlassMaterial = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.6,
      roughness: 0.2
    });

    const bronzeMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.3,
      metalness: 0.8
    });

    const greeneryMaterial = new THREE.MeshStandardMaterial({
      color: 0x059669,
      roughness: 0.8
    });

    // 6. Ground & Street Setup
    // Asphalt Street
    const streetGeo = new THREE.PlaneGeometry(80, 50);
    const streetMesh = new THREE.Mesh(streetGeo, asphaltMaterial);
    streetMesh.rotation.x = -Math.PI / 2;
    streetMesh.position.set(0, 0, 25);
    streetMesh.receiveShadow = true;
    scene.add(streetMesh);

    // Sidewalk
    const sidewalkGeo = new THREE.BoxGeometry(frontageWidth + 12, 0.35, 8);
    const sidewalkMesh = new THREE.Mesh(sidewalkGeo, sidewalkMaterial);
    sidewalkMesh.position.set(0, 0.175, 4);
    sidewalkMesh.receiveShadow = true;
    scene.add(sidewalkMesh);

    // Sidewalk Curb (Curved yellow/black street border)
    const curbGeo = new THREE.BoxGeometry(frontageWidth + 12, 0.4, 0.4);
    const curbMesh = new THREE.Mesh(curbGeo, curbMaterial);
    curbMesh.position.set(0, 0.2, 7.8);
    scene.add(curbMesh);

    // Building Group
    const buildingGroup = new THREE.Group();
    scene.add(buildingGroup);

    // Main Building Mass
    const mainMassGeo = new THREE.BoxGeometry(frontageWidth, buildingHeight, buildingDepth);
    const mainMassMesh = new THREE.Mesh(mainMassGeo, facadeMaterial);
    mainMassMesh.position.set(0, buildingHeight / 2, -buildingDepth / 2);
    mainMassMesh.castShadow = true;
    mainMassMesh.receiveShadow = true;
    buildingGroup.add(mainMassMesh);

    // Architectural Side Pillars (Frame of the Front Elevation)
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

    // 7. Ground Floor: Entrance Lobby & Garage Gate
    const lobbyHeight = 3.6;

    // Double Glass Entrance Doors
    const doorFrameGeo = new THREE.BoxGeometry(3.4, 2.7, 0.25);
    const doorFrame = new THREE.Mesh(doorFrameGeo, bronzeMetalMaterial);
    doorFrame.position.set(-frontageWidth * 0.25, 1.35, 0.15);
    buildingGroup.add(doorFrame);

    const glassDoorGeo = new THREE.PlaneGeometry(3.0, 2.4);
    const glassDoor = new THREE.Mesh(glassDoorGeo, warmGlassMaterial);
    glassDoor.position.set(-frontageWidth * 0.25, 1.35, 0.28);
    buildingGroup.add(glassDoor);

    // Lobby Awning / Canopy
    const canopyGeo = new THREE.BoxGeometry(4.2, 0.2, 1.8);
    const canopy = new THREE.Mesh(canopyGeo, stonePillarsMaterial);
    canopy.position.set(-frontageWidth * 0.25, 2.85, 0.9);
    canopy.castShadow = true;
    buildingGroup.add(canopy);

    // Automated Roll-Up Garage Gate
    const garageGateGeo = new THREE.BoxGeometry(4.6, 2.5, 0.15);
    const garageGateMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.85,
      roughness: 0.3
    });
    const garageGate = new THREE.Mesh(garageGateGeo, garageGateMat);
    garageGate.position.set(frontageWidth * 0.25, 1.25, 0.1);
    buildingGroup.add(garageGate);

    // Garage Warning LED Lamp
    const garageLampGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const garageLampMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const garageLamp = new THREE.Mesh(garageLampGeo, garageLampMat);
    garageLamp.position.set(frontageWidth * 0.25, 2.7, 0.25);
    buildingGroup.add(garageLamp);

    // 8. Stack of Residential Floors (Floor 1 to Top Floor)
    const floorSlabGeo = new THREE.BoxGeometry(frontageWidth + 0.4, 0.35, 1.2);

    for (let f = 1; f <= numFloors; f++) {
      const floorY = lobbyHeight + (f - 1) * floorHeight;

      // Floor Cornice / Slab Trim
      const slabMesh = new THREE.Mesh(floorSlabGeo, stonePillarsMaterial);
      slabMesh.position.set(0, floorY, 0.5);
      slabMesh.castShadow = true;
      slabMesh.receiveShadow = true;
      buildingGroup.add(slabMesh);

      // Balconies on the front facade
      const balconyWidth = (frontageWidth - 3) / 2;
      const balconyDepth = 1.4;
      const balconyHeight = 1.05;

      // Left Unit Balcony
      const leftBalconyBaseGeo = new THREE.BoxGeometry(balconyWidth, 0.25, balconyDepth);
      const leftBalconyBase = new THREE.Mesh(leftBalconyBaseGeo, stonePillarsMaterial);
      leftBalconyBase.position.set(-frontageWidth * 0.25, floorY + 0.15, balconyDepth / 2);
      leftBalconyBase.castShadow = true;
      buildingGroup.add(leftBalconyBase);

      // Left Balcony Glass Railing
      const leftRailingGeo = new THREE.BoxGeometry(balconyWidth, balconyHeight, 0.08);
      const leftRailing = new THREE.Mesh(leftRailingGeo, glassMaterial);
      leftRailing.position.set(-frontageWidth * 0.25, floorY + 0.15 + balconyHeight / 2, balconyDepth);
      buildingGroup.add(leftRailing);

      // Left Panoramic Windows
      const leftWindowGeo = new THREE.PlaneGeometry(balconyWidth - 0.4, floorHeight - 0.9);
      const isLeftUnitLit = (f + 1) % 2 === 0;
      const leftWindow = new THREE.Mesh(leftWindowGeo, isLeftUnitLit ? warmGlassMaterial : glassMaterial);
      leftWindow.position.set(-frontageWidth * 0.25, floorY + floorHeight * 0.5, 0.05);
      buildingGroup.add(leftWindow);

      // Right Unit Balcony
      const rightBalconyBase = new THREE.Mesh(leftBalconyBaseGeo, stonePillarsMaterial);
      rightBalconyBase.position.set(frontageWidth * 0.25, floorY + 0.15, balconyDepth / 2);
      rightBalconyBase.castShadow = true;
      buildingGroup.add(rightBalconyBase);

      // Right Balcony Glass Railing
      const rightRailing = new THREE.Mesh(leftRailingGeo, glassMaterial);
      rightRailing.position.set(frontageWidth * 0.25, floorY + 0.15 + balconyHeight / 2, balconyDepth);
      buildingGroup.add(rightRailing);

      // Right Panoramic Windows
      const isRightUnitLit = f % 2 === 0;
      const rightWindow = new THREE.Mesh(leftWindowGeo, isRightUnitLit ? warmGlassMaterial : glassMaterial);
      rightWindow.position.set(frontageWidth * 0.25, floorY + floorHeight * 0.5, 0.05);
      buildingGroup.add(rightWindow);
    }

    // 9. Rooftop Parapet, Penthouse Pergola & Roof Garden
    const roofY = lobbyHeight + numFloors * floorHeight;
    const parapetGeo = new THREE.BoxGeometry(frontageWidth + 0.6, 1.2, 0.4);
    const parapetMesh = new THREE.Mesh(parapetGeo, stonePillarsMaterial);
    parapetMesh.position.set(0, roofY + 0.6, 0.2);
    buildingGroup.add(parapetMesh);

    // Elevator Machine Room Penthouse
    const elevatorRoomGeo = new THREE.BoxGeometry(5, 3.2, 5);
    const elevatorRoom = new THREE.Mesh(elevatorRoomGeo, facadeMaterial);
    elevatorRoom.position.set(0, roofY + 1.6, -3);
    buildingGroup.add(elevatorRoom);

    // Green Roof Garden Planters if building has roof garden
    if (building.amenities?.hasRoofGarden) {
      const planterGeo = new THREE.BoxGeometry(frontageWidth * 0.7, 0.6, 0.8);
      const planter = new THREE.Mesh(planterGeo, greeneryMaterial);
      planter.position.set(0, roofY + 0.9, -0.6);
      buildingGroup.add(planter);
    }

    // 10. Street Trees & Planters
    for (const xPos of [-frontageWidth / 2 - 2.5, frontageWidth / 2 + 2.5]) {
      const trunkGeo = new THREE.CylinderGeometry(0.18, 0.25, 3, 8);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03 });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.set(xPos, 1.5, 5);
      scene.add(trunk);

      const leavesGeo = new THREE.DodecahedronGeometry(1.6);
      const leaves = new THREE.Mesh(leavesGeo, greeneryMaterial);
      leaves.position.set(xPos, 3.8, 5);
      scene.add(leaves);
    }

    // 11. Mouse Orbit & Interaction Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0;
    let targetPitchY = 3;

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

      targetRotY += dx * 0.006;
      targetPitchY = Math.max(1.5, Math.min(buildingHeight * 0.9, targetPitchY - dy * 0.04));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const currentDist = camera.position.distanceTo(new THREE.Vector3(0, buildingHeight * 0.45, 0));
      const newDist = Math.max(12, Math.min(55, currentDist + e.deltaY * 0.03));
      const dir = camera.position.clone().sub(new THREE.Vector3(0, targetPitchY, 0)).normalize();
      camera.position.copy(dir.multiplyScalar(newDist).add(new THREE.Vector3(0, targetPitchY, 0)));
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    dom.addEventListener("wheel", onWheel, { passive: false });

    // Touch support for mobile
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
      targetRotY += dx * 0.008;
      targetPitchY = Math.max(1.5, Math.min(buildingHeight * 0.9, targetPitchY - dy * 0.05));
    };
    const onTouchEnd = () => {
      isDragging = false;
    };
    dom.addEventListener("touchstart", onTouchStart);
    dom.addEventListener("touchmove", onTouchMove);
    dom.addEventListener("touchend", onTouchEnd);

    // 12. Animation Loop
    let angle = 0;
    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);

      // Smooth camera interpolation
      angle += (targetRotY - angle) * 0.08;
      const radius = frontageWidth * 1.55;
      camera.position.x = Math.sin(angle) * radius;
      camera.position.z = Math.cos(angle) * radius;
      camera.position.y += (targetPitchY - camera.position.y) * 0.08;
      camera.lookAt(0, buildingHeight * 0.45, 0);

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
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
  }, [building, frontageWidth, numFloors, buildingHeight]);

  // Set camera view angles
  const applyCameraPreset = (view: "street" | "elevation" | "perspective" | "penthouse") => {
    setCameraView(view);
    const camera = cameraRef.current;
    if (!camera) return;

    if (view === "street") {
      camera.position.set(0, 2.5, frontageWidth * 1.6);
      camera.lookAt(0, buildingHeight * 0.45, 0);
    } else if (view === "elevation") {
      camera.position.set(0, buildingHeight * 0.5, frontageWidth * 1.8);
      camera.lookAt(0, buildingHeight * 0.5, 0);
    } else if (view === "perspective") {
      camera.position.set(frontageWidth * 1.2, buildingHeight * 0.6, frontageWidth * 1.4);
      camera.lookAt(0, buildingHeight * 0.4, 0);
    } else if (view === "penthouse") {
      camera.position.set(0, buildingHeight * 0.95, frontageWidth * 1.1);
      camera.lookAt(0, buildingHeight * 0.85, 0);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={`fixed z-40 bg-slate-950 border border-slate-800 shadow-2xl transition-all duration-300 flex flex-col overflow-hidden select-none animate-in fade-in ${
        isFullscreen
          ? "inset-0"
          : "inset-x-2 sm:inset-x-8 bottom-3 sm:bottom-6 top-16 sm:top-20 rounded-3xl"
      }`}
    >
      {/* ==================== 3D HEADER OVERLAY ==================== */}
      <div className="absolute top-0 inset-x-0 z-30 p-3 sm:p-4 bg-gradient-to-b from-slate-950/95 via-slate-950/70 to-transparent flex items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2.5 pointer-events-auto">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                نمای ۳ بعدی روبروی ساختمان (بر اصلی)
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                {building.district} • {building.plaque}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-black text-white mt-0.5">
              {building.name}
            </h2>
          </div>
        </div>

        {/* Camera Preset Angles & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          {/* Street Level View (Eye Level) */}
          <button
            onClick={() => applyCameraPreset("street")}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              cameraView === "street"
                ? "bg-amber-500 text-slate-950 font-black shadow-md"
                : "bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800"
            }`}
            title="دید ناظر از پیاده‌رو (ارتفاع ۱.۷ متر)"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">دید از پیاده‌رو</span>
          </button>

          {/* Orthographic Elevation View */}
          <button
            onClick={() => applyCameraPreset("elevation")}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              cameraView === "elevation"
                ? "bg-amber-500 text-slate-950 font-black shadow-md"
                : "bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800"
            }`}
            title="دید روبروی نمای معمارانه"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden md:inline">نمای مستقیم</span>
          </button>

          {/* Perspective 3D Orbit */}
          <button
            onClick={() => applyCameraPreset("perspective")}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              cameraView === "perspective"
                ? "bg-amber-500 text-slate-950 font-black shadow-md"
                : "bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800"
            }`}
            title="دید پرسپکتیو ۳ بعدی و چرخش ۳۶۰ درجه"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">دید ۳ بعدی</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title={isFullscreen ? "کوچک‌نمایی" : "تمام‌صفحه"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close 3D Viewer */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="بازگشت به نقشه"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ==================== 3D CANVAS VIEWPORT ==================== */}
      <div className="relative flex-1 w-full h-full">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Architectural Dimension Ruler Across the 3D Building Front */}
        <div className="absolute top-16 sm:top-20 inset-x-4 sm:inset-x-12 z-20 pointer-events-none flex flex-col items-center">
          <div className="w-full max-w-2xl flex items-center justify-between text-xs font-mono font-bold text-amber-300 bg-slate-950/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-amber-500/40 shadow-xl">
            <div className="flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5 text-amber-400" />
              <span>عرض بر اصلی رو به خیابان:</span>
            </div>
            <span className="text-amber-400 font-black text-sm">
              ◀─── {formatPersianNumber(frontageWidth)} متر بر ساختمان ───▶
            </span>
            <span className="text-slate-300 font-normal hidden sm:inline">
              ارتفاع: {formatPersianNumber(Math.round(buildingHeight))} متر • {formatPersianNumber(numFloors)} طبقه
            </span>
          </div>
        </div>

        {/* Interactive 3D Floor & Unit Selector Overlay (Floating Sidebar) */}
        <div className="absolute bottom-4 right-4 sm:right-6 z-20 w-80 max-h-[60%] sm:max-h-[70%] overflow-y-auto bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 shadow-2xl space-y-2 pointer-events-auto">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-black text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>واحدهای روی نمای این ساختمان:</span>
            </span>
            <span className="text-[10px] text-slate-400">
              {formatPersianNumber(building.unitsCount)} واحد
            </span>
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {building.floors.map((floor) => (
              <div key={floor.floorNumber} className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 px-1 pt-1 flex items-center justify-between">
                  <span>{floor.floorLabel}</span>
                </div>
                {floor.units.map((unit) => {
                  const property = unit.propertyId
                    ? initialProperties.find((p) => p.id === unit.propertyId)
                    : undefined;

                  const isSelected = selectedUnit?.unit.id === unit.id;

                  return (
                    <div
                      key={unit.id}
                      onClick={() => {
                        setSelectedUnit({ unit, floor });
                        if (onSelectUnit) onSelectUnit(unit, floor);
                      }}
                      className={`p-2 rounded-xl border text-right cursor-pointer transition-all ${
                        isSelected
                          ? "bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/30"
                          : unit.status === "rent"
                          ? "bg-emerald-950/30 border-emerald-500/40 hover:border-emerald-500"
                          : unit.status === "sale"
                          ? "bg-amber-950/30 border-amber-500/40 hover:border-amber-500"
                          : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white truncate">{unit.unitNumber}</span>
                        {unit.status === "rent" && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                            رهن و اجاره
                          </span>
                        )}
                        {unit.status === "sale" && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                            فروش
                          </span>
                        )}
                        {unit.status === "occupied" && (
                          <span className="text-[10px] text-slate-400">سکونت</span>
                        )}
                        {unit.status === "unlisted" && (
                          <span className="text-[10px] text-indigo-300">ثبت نشده</span>
                        )}
                      </div>

                      {unit.status === "rent" && (
                        <div className="text-[11px] text-emerald-400 font-bold mt-1">
                          {formatPersianNumber((unit.deposit || (property?.deposit ?? 0)) / 1000000)}م ودیعه • {formatPersianNumber((unit.rent || (property?.rent ?? 0)) / 1000000)}م اجاره
                        </div>
                      )}

                      {unit.status === "sale" && (
                        <div className="text-[11px] text-amber-400 font-bold mt-1">
                          {formatPersianNumber(((unit.totalPrice || (property?.totalPrice ?? 0)) / 1000000000).toFixed(1))} میلیارد تومان
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Unit Action Bar in 3D */}
          {selectedUnit && (
            <div className="pt-2 border-t border-slate-800 space-y-2">
              {userRole === "seller_agent" ? (
                <button
                  onClick={() => onEditUnit && onEditUnit(selectedUnit.unit, selectedUnit.floor)}
                  className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>قیمت‌گذاری و مدیریت این واحد در ۳ بعدی</span>
                </button>
              ) : (
                selectedUnit.unit.propertyId ? (
                  <Link
                    href={`/property/${selectedUnit.unit.propertyId}`}
                    className="w-full py-2 rounded-xl bg-gradient-to-l from-amber-500 to-orange-500 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
                  >
                    <span>مشاهده کامل آگهی واحد</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <div className="text-[11px] text-slate-400 text-center py-1">
                    این واحد در حال حاضر ثبت یا آگهی نشده است
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* 3D Orbit Helper Hint */}
        <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800 text-[11px] text-slate-300 shadow-xl">
          <RotateCcw className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>با ماوس یا لمس صفحه بکشید تا دور نمای ۳ بعدی ساختمان بچرخید و ارتفاع را ببینید</span>
        </div>
      </div>
    </div>
  );
}
