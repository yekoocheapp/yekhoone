"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import {
  RotateCw,
  Maximize2,
  Minimize2,
  Compass,
  ZoomIn,
  ZoomOut,
  Info,
  DoorOpen,
  Sparkles,
  HelpCircle,
  X,
  Layers,
  ArrowRight
} from "lucide-react";
import { TourRoom, TourHotspot } from "@/data/properties";

interface VirtualTourViewerProps {
  rooms: TourRoom[];
  initialRoomId?: string;
  propertyTitle: string;
}

export default function VirtualTourViewer({
  rooms,
  initialRoomId,
  propertyTitle
}: VirtualTourViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const [currentRoomId, setCurrentRoomId] = useState<string>(
    initialRoomId || (rooms.length > 0 ? rooms[0].id : "")
  );
  const [activeHotspot, setActiveHotspot] = useState<TourHotspot | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const autoRotateRef = useRef<boolean>(true);
  autoRotateRef.current = autoRotate;

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [hotspotScreenPositions, setHotspotScreenPositions] = useState<
    { id: string; x: number; y: number; visible: boolean; hotspot: TourHotspot }[]
  >([]);

  // Three.js instances refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Interaction coordinates
  const lonRef = useRef<number>(0);
  const latRef = useRef<number>(0);
  const targetLonRef = useRef<number>(0);
  const targetLatRef = useRef<number>(0);
  const fovRef = useRef<number>(75);
  const isUserInteractingRef = useRef<boolean>(false);
  const onPointerDownPointerXRef = useRef<number>(0);
  const onPointerDownPointerYRef = useRef<number>(0);
  const onPointerDownLonRef = useRef<number>(0);
  const onPointerDownLatRef = useRef<number>(0);

  const currentRoom = rooms.find((r) => r.id === currentRoomId) || rooms[0];

  // ==================== PROCEDURAL HIGH-RES PANORAMA GENERATOR ====================
  // Generates 2048x1024 photorealistic equirectangular canvas textures instantly with ZERO network delay
  const createProceduralPanoramaTexture = useCallback((room: TourRoom): THREE.CanvasTexture => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    const isKitchen = room.id.includes("kitchen");
    const isBed = room.id.includes("bed");
    const isTerrace = room.id.includes("terrace");

    // 1. Base Wall & Ceiling Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    if (isTerrace) {
      bgGradient.addColorStop(0, "#0284c7"); // Vibrant Mediterranean sky
      bgGradient.addColorStop(0.35, "#38bdf8");
      bgGradient.addColorStop(0.48, "#bae6fd"); // Golden sunlight horizon
      bgGradient.addColorStop(0.52, "#64748b"); // Alborz mountain silhouettes
      bgGradient.addColorStop(0.55, "#334155"); // Balcony deck
      bgGradient.addColorStop(1, "#1e293b"); // Modern decking floor
    } else if (isKitchen) {
      bgGradient.addColorStop(0, "#0f172a"); // Dark slate ceiling
      bgGradient.addColorStop(0.2, "#1e293b");
      bgGradient.addColorStop(0.48, "#334155"); // Sleek Italian marble backsplash
      bgGradient.addColorStop(0.52, "#475569");
      bgGradient.addColorStop(1, "#020617"); // High-gloss dark granite floor
    } else if (isBed) {
      bgGradient.addColorStop(0, "#1c1917"); // Warm acoustic ceiling
      bgGradient.addColorStop(0.25, "#292524");
      bgGradient.addColorStop(0.48, "#44403c"); // Walnut wood panel walls
      bgGradient.addColorStop(0.52, "#57534e");
      bgGradient.addColorStop(1, "#1c1917"); // Dark herringbone oak parquet
    } else {
      // Grand Living Room (Saadat Abad Luxury Apartment)
      bgGradient.addColorStop(0, "#090d16"); // Deep luxury ceiling
      bgGradient.addColorStop(0.22, "#131c2e");
      bgGradient.addColorStop(0.48, "#1e293b"); // Warm grey walls
      bgGradient.addColorStop(0.52, "#334155");
      bgGradient.addColorStop(1, "#181410"); // Travertine marble floor
    }
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Horizon & Floor Tile Reflections
    const horizonY = canvas.height * 0.52;
    ctx.strokeStyle = "rgba(245, 158, 11, 0.2)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.lineTo(canvas.width, horizonY);
    ctx.stroke();

    // Perspective floor lines (giving realistic 3D room depth)
    ctx.strokeStyle = isTerrace ? "rgba(255, 255, 255, 0.12)" : "rgba(245, 158, 11, 0.15)";
    ctx.lineWidth = 1.5;
    for (let x = 0; x < canvas.width; x += 96) {
      ctx.beginPath();
      ctx.moveTo(x, horizonY);
      ctx.lineTo(x + (x - canvas.width / 2) * 0.8, canvas.height);
      ctx.stroke();
    }
    for (let y = horizonY + 30; y < canvas.height; y += 45) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // 3. Panoramic Windows with Tehran Skyline & Alborz Mountains
    const winX = canvas.width * 0.2;
    const winW = canvas.width * 0.45;
    const winY = canvas.height * 0.15;
    const winH = canvas.height * 0.37;

    // Window Sky & Mountains View
    const skyGrad = ctx.createLinearGradient(winX, winY, winX, winY + winH);
    skyGrad.addColorStop(0, "rgba(56, 189, 248, 0.8)");
    skyGrad.addColorStop(0.65, "rgba(224, 242, 254, 0.95)");
    skyGrad.addColorStop(0.8, "rgba(254, 240, 138, 0.6)");
    skyGrad.addColorStop(1, "rgba(203, 213, 225, 0.9)");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(winX, winY, winW, winH);

    // Mountain silhouettes in distance
    ctx.fillStyle = "rgba(100, 116, 139, 0.6)";
    ctx.beginPath();
    ctx.moveTo(winX, winY + winH * 0.8);
    ctx.lineTo(winX + winW * 0.2, winY + winH * 0.5);
    ctx.lineTo(winX + winW * 0.4, winY + winH * 0.65);
    ctx.lineTo(winX + winW * 0.65, winY + winH * 0.45);
    ctx.lineTo(winX + winW * 0.85, winY + winH * 0.6);
    ctx.lineTo(winX + winW, winY + winH * 0.75);
    ctx.lineTo(winX + winW, winY + winH);
    ctx.lineTo(winX, winY + winH);
    ctx.closePath();
    ctx.fill();

    // Window frames (Modern black aluminum thermal break)
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 10;
    ctx.strokeRect(winX, winY, winW, winH);
    for (let i = 1; i < 4; i++) {
      const barX = winX + (winW / 4) * i;
      ctx.beginPath();
      ctx.moveTo(barX, winY);
      ctx.lineTo(barX, winY + winH);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(winX, winY + winH * 0.7);
    ctx.lineTo(winX + winW, winY + winH * 0.7);
    ctx.stroke();

    // 4. Ceiling Recessed Spotlights & Ambient Glow
    const numSpots = 8;
    for (let i = 1; i <= numSpots; i++) {
      const spotX = (canvas.width / (numSpots + 1)) * i;
      const spotY = canvas.height * 0.1;
      const spotGlow = ctx.createRadialGradient(spotX, spotY, 2, spotX, spotY, 80);
      spotGlow.addColorStop(0, "rgba(254, 243, 199, 0.9)");
      spotGlow.addColorStop(0.3, "rgba(251, 191, 36, 0.3)");
      spotGlow.addColorStop(1, "rgba(251, 191, 36, 0)");
      ctx.fillStyle = spotGlow;
      ctx.beginPath();
      ctx.arc(spotX, spotY, 80, 0, Math.PI * 2);
      ctx.fill();

      // Spotlight fixture
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(spotX, spotY, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Linear LED Cove Lighting on Ceilings
    ctx.strokeStyle = "rgba(245, 158, 11, 0.5)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.06);
    ctx.lineTo(canvas.width, canvas.height * 0.06);
    ctx.stroke();

    // 6. Persian Room Branding Watermark
    ctx.font = "bold 56px Tahoma, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    ctx.textAlign = "center";
    ctx.fillText(`«یه خونه» • تور مجازی ۳۶۰° • ${room.name}`, canvas.width / 2, canvas.height * 0.38);

    ctx.font = "34px Tahoma, sans-serif";
    ctx.fillStyle = "rgba(251, 191, 36, 0.35)";
    ctx.fillText(room.description, canvas.width / 2, canvas.height * 0.44);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Update room texture smoothly without lag
  const applyRoomTexture = useCallback(
    (room: TourRoom) => {
      if (!sphereRef.current) return;
      // 1. Immediately apply photorealistic procedural texture (0 ms latency)
      const instantTexture = createProceduralPanoramaTexture(room);
      const mat = sphereRef.current.material as THREE.MeshBasicMaterial;
      mat.map = instantTexture;
      mat.needsUpdate = true;
      setIsLoading(false);

      // 2. If room has a local or remote texture, attempt background upgrade with short timeout
      if (room.panoramaUrl && !room.panoramaUrl.includes("githubusercontent")) {
        const loader = new THREE.TextureLoader();
        loader.crossOrigin = "anonymous";
        loader.load(
          room.panoramaUrl,
          (netTexture) => {
            netTexture.colorSpace = THREE.SRGBColorSpace;
            if (sphereRef.current) {
              const currentMat = sphereRef.current.material as THREE.MeshBasicMaterial;
              currentMat.map = netTexture;
              currentMat.needsUpdate = true;
            }
          },
          undefined,
          () => {
            // Keep procedural texture seamlessly
          }
        );
      }
    },
    [createProceduralPanoramaTexture]
  );

  // Initialize Three.js Scene ONCE on mount
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    // Use actual client sizes or sensible fallbacks
    const width = container.clientWidth || containerRef.current?.clientWidth || 800;
    const height = container.clientHeight || containerRef.current?.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(fovRef.current, width / height, 1, 1100);
    const cameraTarget = new THREE.Vector3(0, 0, 0);
    cameraRef.current = camera;

    // 3. Inverted Sphere for 360 Interior Panorama
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const material = new THREE.MeshBasicMaterial();
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    sphereRef.current = sphere;

    // 4. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.innerHTML = ""; // Clear any previous canvas
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 5. Apply Initial Room Texture Instantly
    const initialRoom = rooms.find((r) => r.id === currentRoomId) || rooms[0];
    if (initialRoom) {
      applyRoomTexture(initialRoom);
    }

    // 6. Smooth Animation Loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Auto-rotation when user is not dragging
      if (autoRotateRef.current && !isUserInteractingRef.current) {
        targetLonRef.current += 0.08;
      }

      // Inertia & damping
      lonRef.current += (targetLonRef.current - lonRef.current) * 0.1;
      latRef.current += (targetLatRef.current - latRef.current) * 0.1;
      latRef.current = Math.max(-85, Math.min(85, latRef.current));

      // Compass calculation
      const normalizedLon = ((lonRef.current % 360) + 360) % 360;
      setCompassHeading(Math.round(normalizedLon));

      const phi = THREE.MathUtils.degToRad(90 - latRef.current);
      const theta = THREE.MathUtils.degToRad(lonRef.current);

      cameraTarget.x = 500 * Math.sin(phi) * Math.cos(theta);
      cameraTarget.y = 500 * Math.cos(phi);
      cameraTarget.z = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(cameraTarget);
      renderer.render(scene, camera);

      // Project 3D Hotspot Coordinates to 2D Screen Coordinates
      const currentActiveRoom = rooms.find((r) => r.id === currentRoomId) || rooms[0];
      if (currentActiveRoom && currentActiveRoom.hotspots && container) {
        const cWidth = container.clientWidth;
        const cHeight = container.clientHeight;

        const positions = currentActiveRoom.hotspots.map((h) => {
          const hPhi = THREE.MathUtils.degToRad(90 - h.pitch);
          const hTheta = THREE.MathUtils.degToRad(h.yaw);

          const hPos = new THREE.Vector3(
            500 * Math.sin(hPhi) * Math.cos(hTheta),
            500 * Math.cos(hPhi),
            500 * Math.sin(hPhi) * Math.sin(hTheta)
          );

          const screenPos = hPos.clone().project(camera);
          const isFacing = screenPos.z < 1;
          const x = (screenPos.x * 0.5 + 0.5) * cWidth;
          const y = (-(screenPos.y * 0.5) + 0.5) * cHeight;

          return {
            id: h.id,
            x,
            y,
            visible: isFacing && x >= 0 && x <= cWidth && y >= 0 && y <= cHeight,
            hotspot: h
          };
        });

        setHotspotScreenPositions(positions);
      }
    };

    animate();

    // 7. Auto-Resize Handling with ResizeObserver
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;

      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []); // Run ONCE on mount

  // Update room when currentRoomId changes
  useEffect(() => {
    const targetRoom = rooms.find((r) => r.id === currentRoomId);
    if (targetRoom) {
      applyRoomTexture(targetRoom);
    }
  }, [currentRoomId, rooms, applyRoomTexture]);

  // Handle switching rooms via bottom pills or door hotspots
  const handleRoomChange = (roomId: string) => {
    if (roomId === currentRoomId) return;
    setCurrentRoomId(roomId);
    setActiveHotspot(null);
  };

  // Pointer drag controls (Mouse & Touch)
  const onPointerDown = (e: React.PointerEvent) => {
    isUserInteractingRef.current = true;
    onPointerDownPointerXRef.current = e.clientX;
    onPointerDownPointerYRef.current = e.clientY;
    onPointerDownLonRef.current = targetLonRef.current;
    onPointerDownLatRef.current = targetLatRef.current;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isUserInteractingRef.current) return;
    const deltaX = (e.clientX - onPointerDownPointerXRef.current) * 0.15;
    const deltaY = (e.clientY - onPointerDownPointerYRef.current) * 0.15;

    targetLonRef.current = onPointerDownLonRef.current - deltaX;
    targetLatRef.current = onPointerDownLatRef.current + deltaY;
  };

  const onPointerUp = () => {
    isUserInteractingRef.current = false;
  };

  // Wheel zoom
  const onWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    e.preventDefault();
    fovRef.current += e.deltaY * 0.05;
    fovRef.current = Math.max(45, Math.min(95, fovRef.current));
    cameraRef.current.fov = fovRef.current;
    cameraRef.current.updateProjectionMatrix();
  };

  const handleZoom = (delta: number) => {
    if (!cameraRef.current) return;
    fovRef.current = Math.max(45, Math.min(95, fovRef.current + delta));
    cameraRef.current.fov = fovRef.current;
    cameraRef.current.updateProjectionMatrix();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-3xl overflow-hidden select-none bg-slate-950 border border-slate-800 transition-all ${
        isFullscreen ? "h-screen rounded-none" : "h-[450px] sm:h-[540px] md:h-[600px]"
      }`}
    >
      {/* 3D WebGL Canvas Layer */}
      <div
        ref={canvasContainerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onWheel={onWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
      />

      {/* Top Header Bar */}
      <div className="absolute top-4 right-4 left-4 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Room Pill */}
          <div className="bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-800 shadow-xl flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white">{currentRoom.name}</span>
            <span className="text-slate-600">|</span>
            <span className="text-[10px] text-amber-400 font-medium">تور تعاملی ۳۶۰°</span>
          </div>

          {/* Compass Orientation */}
          <div
            className="bg-slate-950/85 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border border-slate-800 shadow-xl flex items-center gap-1.5 text-slate-300 text-xs font-mono"
            title="زاویه دید فعلی در ملک"
          >
            <Compass
              className="w-3.5 h-3.5 text-amber-400 transition-transform duration-100"
              style={{ transform: `rotate(${-compassHeading}deg)` }}
            />
            <span className="text-[11px] font-bold">{compassHeading}°</span>
          </div>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Help Button */}
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 rounded-xl bg-slate-950/85 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors backdrop-blur-md shadow-lg"
            title="راهنمای کار با تور مجازی"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </button>

          {/* Auto-Rotate Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold backdrop-blur-md transition-all shadow-lg ${
              autoRotate
                ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                : "bg-slate-950/85 border-slate-800 text-slate-400 hover:text-white"
            }`}
            title="چرخش خودکار ملایم"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin" : ""}`} style={{ animationDuration: '10s' }} />
            <span className="hidden sm:inline">چرخش خودکار</span>
          </button>

          {/* Zoom Buttons */}
          <div className="hidden sm:flex items-center bg-slate-950/85 backdrop-blur-md rounded-xl border border-slate-800 p-0.5">
            <button
              onClick={() => handleZoom(-10)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
              title="بزرگ‌نمایی (زووم)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom(10)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
              title="کوچک‌نمایی (دید بازتر)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-950/85 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors backdrop-blur-md shadow-lg"
            title={isFullscreen ? "خروج از تمام‌صفحه" : "حالت تمام‌صفحه"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Interactive 3D Hotspot Overlays */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {hotspotScreenPositions.map(({ id, x, y, visible, hotspot }) => {
          if (!visible) return null;

          const isPortal = hotspot.type === "portal";

          return (
            <div
              key={id}
              style={{
                position: "absolute",
                left: `${x}px`,
                top: `${y}px`,
                transform: "translate(-50%, -50%)"
              }}
              className="pointer-events-auto group cursor-pointer"
              onClick={() => {
                if (isPortal && hotspot.targetRoomId) {
                  handleRoomChange(hotspot.targetRoomId);
                } else {
                  setActiveHotspot(hotspot);
                }
              }}
            >
              {/* Outer pulsing ring */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isPortal
                    ? "bg-amber-500/20 border-2 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/40 hover:scale-125"
                    : "bg-indigo-500/20 border-2 border-indigo-400 text-indigo-300 shadow-lg shadow-indigo-500/40 hover:scale-125"
                }`}
              >
                {isPortal ? (
                  <DoorOpen className="w-5 h-5 animate-pulse" />
                ) : (
                  <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                )}
              </div>

              {/* Hover Badge Label */}
              <div
                className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-xl bg-slate-950/90 border backdrop-blur-md shadow-2xl whitespace-nowrap text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-all pointer-events-none ${
                  isPortal
                    ? "border-amber-500/40 text-amber-300"
                    : "border-indigo-500/40 text-indigo-300"
                }`}
              >
                <span>{hotspot.title}</span>
                {isPortal && <span className="mr-1 text-slate-400">← ورود</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Hotspot Info Popover Card */}
      {activeHotspot && activeHotspot.type === "info" && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 max-w-sm w-[90%] bg-slate-900/95 border border-indigo-500/40 rounded-3xl p-5 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-sm">{activeHotspot.title}</h4>
            </div>
            <button
              onClick={() => setActiveHotspot(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            {activeHotspot.description}
          </p>
          <button
            onClick={() => setActiveHotspot(null)}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            بستن پنجره جزئیات
          </button>
        </div>
      )}

      {/* Help Modal Overlay */}
      {showHelp && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-40 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-xs text-slate-300 leading-relaxed animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>راهنمای استفاده از تور مجازی ۳۶۰°</span>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                  <RotateCw className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block mb-0.5">چرخش ۳۶۰ درجه در فضا:</strong>
                  با کلیک و کشیدن ماوس (یا با لمس انگشت روی گوشی) می‌توانید آزادانه به اطراف، سقف و کف نگاه کنید.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                  <DoorOpen className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block mb-0.5">جابجایی بین اتاق‌ها (درب‌ها):</strong>
                  روی نقاط شناور با آیکون درب کلیک کنید تا بدون معطلی به سالن، آشپزخانه، خواب‌ها یا تراس منتقل شوید.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block mb-0.5">نقاط هوشمند مشخصات (Hotspots):</strong>
                  روی نشان‌های براق ضربه بزنید تا مشخصات فنی متریال، برند کابینت‌ها و پنجره‌ها را بخوانید.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
            >
              شروع گشت و گذار در ملک
            </button>
          </div>
        </div>
      )}

      {/* Bottom Room Selector Pill Bar */}
      <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between gap-3 pointer-events-none z-20">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none pointer-events-auto bg-slate-950/85 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-2xl">
          <span className="text-[11px] font-bold text-slate-400 px-2 hidden md:inline">
            اتاق‌ها و فضاها:
          </span>
          {rooms.map((room) => {
            const isActive = room.id === currentRoomId;
            return (
              <button
                key={room.id}
                onClick={() => handleRoomChange(room.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-gradient-to-l from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105"
                    : "bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{room.name}</span>
              </button>
            );
          })}
        </div>

        {/* Brand Watermark Badge */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-medium text-slate-400 pointer-events-auto shrink-0 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>تور ۳ بعدی هوشمند «یه خونه»</span>
        </div>
      </div>
    </div>
  );
}
