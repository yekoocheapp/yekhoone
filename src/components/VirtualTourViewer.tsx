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
  ChevronRight,
  Eye,
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
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

  // Helper to create a fallback high-quality architectural equirectangular canvas texture
  const createProceduralPanoramaTexture = useCallback((room: TourRoom): THREE.CanvasTexture => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Wall & ceiling gradient
    const wallGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    if (room.id.includes("kitchen")) {
      wallGradient.addColorStop(0, "#1e293b"); // Slate ceiling
      wallGradient.addColorStop(0.45, "#334155"); // Modern slate walls
      wallGradient.addColorStop(0.55, "#475569");
      wallGradient.addColorStop(1, "#0f172a"); // Polished dark stone floor
    } else if (room.id.includes("bed")) {
      wallGradient.addColorStop(0, "#292524"); // Warm wood tone ceiling
      wallGradient.addColorStop(0.45, "#44403c"); // Soft stone walls
      wallGradient.addColorStop(0.55, "#57534e");
      wallGradient.addColorStop(1, "#1c1917"); // Dark oak parquet floor
    } else if (room.id.includes("terrace")) {
      wallGradient.addColorStop(0, "#0369a1"); // Deep blue sky
      wallGradient.addColorStop(0.48, "#bae6fd"); // Horizon glow over Alborz mountains
      wallGradient.addColorStop(0.52, "#78716c"); // Balcony railing and mountain peaks
      wallGradient.addColorStop(1, "#292524"); // Luxury outdoor decking
    } else {
      // Default: Grand Living Room
      wallGradient.addColorStop(0, "#0f172a"); // Luxury dark ceiling with spotlights
      wallGradient.addColorStop(0.45, "#1e293b"); // Modern warm greige walls
      wallGradient.addColorStop(0.55, "#334155");
      wallGradient.addColorStop(1, "#1e1b18"); // Polished travertine/stone floor
    }
    ctx.fillStyle = wallGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid architectural perspective lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 2;
    for (let x = 0; x < canvas.width; x += 128) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Floor horizon line & luxury reflections
    ctx.strokeStyle = "rgba(245, 158, 11, 0.25)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.52);
    ctx.lineTo(canvas.width, canvas.height * 0.52);
    ctx.stroke();

    // Large floor-to-ceiling panoramic windows on one side
    const winX = canvas.width * 0.25;
    const winW = canvas.width * 0.35;
    const winY = canvas.height * 0.2;
    const winH = canvas.height * 0.32;

    const windowGrad = ctx.createLinearGradient(winX, winY, winX, winY + winH);
    windowGrad.addColorStop(0, "rgba(186, 230, 253, 0.45)");
    windowGrad.addColorStop(0.6, "rgba(255, 255, 255, 0.65)");
    windowGrad.addColorStop(1, "rgba(254, 240, 138, 0.3)");
    ctx.fillStyle = windowGrad;
    ctx.fillRect(winX, winY, winW, winH);

    // Window frame bars
    ctx.strokeStyle = "rgba(15, 23, 42, 0.85)";
    ctx.lineWidth = 8;
    ctx.strokeRect(winX, winY, winW, winH);
    ctx.beginPath();
    ctx.moveTo(winX + winW / 2, winY);
    ctx.lineTo(winX + winW / 2, winY + winH);
    ctx.stroke();

    // Room Label Ambient Text in Persian
    ctx.font = "bold 52px Tahoma, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.textAlign = "center";
    ctx.fillText(`«یه خونه» • تور مجازی ۳۶۰° • ${room.name}`, canvas.width / 2, canvas.height * 0.35);

    // Warm Spotlights on Ceiling
    for (let i = 1; i <= 6; i++) {
      const spotX = (canvas.width / 7) * i;
      const spotY = canvas.height * 0.12;
      const spotGrad = ctx.createRadialGradient(spotX, spotY, 2, spotX, spotY, 60);
      spotGrad.addColorStop(0, "rgba(254, 243, 199, 0.8)");
      spotGrad.addColorStop(1, "rgba(254, 243, 199, 0)");
      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.arc(spotX, spotY, 60, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Change room and load texture
  const loadRoomTexture = useCallback(
    (room: TourRoom) => {
      if (!sphereRef.current) return;
      setIsLoading(true);

      const textureLoader = new THREE.TextureLoader();
      textureLoader.crossOrigin = "anonymous";

      // Try loading panorama image
      textureLoader.load(
        room.panoramaUrl,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          if (sphereRef.current) {
            const mat = sphereRef.current.material as THREE.MeshBasicMaterial;
            mat.map = texture;
            mat.needsUpdate = true;
          }
          setIsLoading(false);
        },
        undefined,
        () => {
          // If network texture fails, fall back to procedural panorama texture
          const fallbackTexture = createProceduralPanoramaTexture(room);
          if (sphereRef.current) {
            const mat = sphereRef.current.material as THREE.MeshBasicMaterial;
            mat.map = fallbackTexture;
            mat.needsUpdate = true;
          }
          setIsLoading(false);
        }
      );
    },
    [createProceduralPanoramaTexture]
  );

  // Initialize Three.js Scene
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(fovRef.current, width / height, 1, 1100);
    const cameraTarget = new THREE.Vector3(0, 0, 0);
    cameraRef.current = camera;

    // 3. Sphere (Inside-out)
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Invert sphere so normals face inward

    const material = new THREE.MeshBasicMaterial();
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    sphereRef.current = sphere;

    // 4. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Load initial room
    const initRoom = rooms.find((r) => r.id === currentRoomId) || rooms[0];
    if (initRoom) {
      loadRoomTexture(initRoom);
    }

    // 5. Animation Loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Auto rotation when idle
      if (autoRotate && !isUserInteractingRef.current) {
        targetLonRef.current += 0.08;
      }

      // Smooth damping / inertia
      lonRef.current += (targetLonRef.current - lonRef.current) * 0.1;
      latRef.current += (targetLatRef.current - latRef.current) * 0.1;

      // Clamp latitude
      latRef.current = Math.max(-85, Math.min(85, latRef.current));

      // Update compass
      const normalizedLon = ((lonRef.current % 360) + 360) % 360;
      setCompassHeading(Math.round(normalizedLon));

      const phi = THREE.MathUtils.degToRad(90 - latRef.current);
      const theta = THREE.MathUtils.degToRad(lonRef.current);

      cameraTarget.x = 500 * Math.sin(phi) * Math.cos(theta);
      cameraTarget.y = 500 * Math.cos(phi);
      cameraTarget.z = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(cameraTarget);
      renderer.render(scene, camera);

      // Calculate 2D screen positions for hotspots
      if (currentRoom && currentRoom.hotspots && container) {
        const cWidth = container.clientWidth;
        const cHeight = container.clientHeight;

        const positions = currentRoom.hotspots.map((h) => {
          const hPhi = THREE.MathUtils.degToRad(90 - h.pitch);
          const hTheta = THREE.MathUtils.degToRad(h.yaw);

          const hPos = new THREE.Vector3(
            500 * Math.sin(hPhi) * Math.cos(hTheta),
            500 * Math.cos(hPhi),
            500 * Math.sin(hPhi) * Math.sin(hTheta)
          );

          // Project to 2D
          const screenPos = hPos.clone().project(camera);

          // Check if hotspot is facing the camera
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

    // 6. Resize handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
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
  }, [rooms, autoRotate, currentRoomId, loadRoomTexture]);

  // Handle switching rooms
  const handleRoomChange = (roomId: string) => {
    if (roomId === currentRoomId) return;
    setCurrentRoomId(roomId);
    setActiveHotspot(null);
    const targetRoom = rooms.find((r) => r.id === roomId);
    if (targetRoom) {
      loadRoomTexture(targetRoom);
    }
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
    fovRef.current = Math.max(40, Math.min(100, fovRef.current));
    cameraRef.current.fov = fovRef.current;
    cameraRef.current.updateProjectionMatrix();
  };

  // Zoom buttons
  const handleZoom = (delta: number) => {
    if (!cameraRef.current) return;
    fovRef.current = Math.max(40, Math.min(100, fovRef.current + delta));
    cameraRef.current.fov = fovRef.current;
    cameraRef.current.updateProjectionMatrix();
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
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

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-30 transition-opacity">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <RotateCw className="w-6 h-6 animate-spin" />
          </div>
          <span className="text-xs font-bold text-white tracking-wide">
            در حال بارگذاری تور مجازی ۳۶۰° ({currentRoom.name})...
          </span>
          <span className="text-[11px] text-slate-400">
            پردازش رندرهای کروی با شتاب‌دهنده گرافیکی WebGL
          </span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="absolute top-4 right-4 left-4 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Room Pill */}
          <div className="bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-800 shadow-xl flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white">{currentRoom.name}</span>
            <span className="text-slate-600">|</span>
            <span className="text-[10px] text-amber-400 font-medium">تور تعاملی ۳۶۰°</span>
          </div>

          {/* Compass Orientation */}
          <div
            className="bg-slate-950/80 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border border-slate-800 shadow-xl flex items-center gap-1.5 text-slate-300 text-xs font-mono"
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
            className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors backdrop-blur-md shadow-lg"
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
                : "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white"
            }`}
            title="چرخش خودکار ملایم"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin" : ""}`} style={{ animationDuration: '10s' }} />
            <span className="hidden sm:inline">چرخش خودکار</span>
          </button>

          {/* Zoom Buttons */}
          <div className="hidden sm:flex items-center bg-slate-950/80 backdrop-blur-md rounded-xl border border-slate-800 p-0.5">
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
            className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors backdrop-blur-md shadow-lg"
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
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span>تور ۳ بعدی هوشمند «یه خونه»</span>
        </div>
      </div>
    </div>
  );
}
