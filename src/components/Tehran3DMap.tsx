"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
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

export default function Tehran3DMap({
  onSelectBuilding,
  selectedBuildingId,
  filterOnlyActive = false,
  activeDistrictId,
  onDistrictChange
}: Tehran3DMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js instances stored in refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const buildingMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());

  // Interactive camera states
  const cameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 15, 0));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 15, 0));
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 95, 140));
  const isTransitioningRef = useRef<boolean>(false);

  // Drag & rotation controls
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const sphericalRef = useRef<{ radius: number; theta: number; phi: number }>({
    radius: 170,
    theta: 0,
    phi: Math.PI / 3.5
  });

  // Lighting & Day/Night states
  const [timeOfDay, setTimeOfDay] = useState<"day" | "sunset" | "night">("sunset");
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  // UI state
  const [hoveredBuilding, setHoveredBuilding] = useState<TehranBuilding | null>(null);
  const [compassAngle, setCompassAngle] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [beaconPulse, setBeaconPulse] = useState<number>(0);

  // Camera fly-to animation helper
  const flyTo = useCallback((targetPos: THREE.Vector3, lookAtTarget: THREE.Vector3) => {
    targetCamPosRef.current.copy(targetPos);
    targetLookAtRef.current.copy(lookAtTarget);
    isTransitioningRef.current = true;
  }, []);

  // Update lighting mode
  const applyLightingMode = useCallback((mode: "day" | "sunset" | "night", scene: THREE.Scene) => {
    if (!dirLightRef.current || !hemiLightRef.current || !ambientLightRef.current) return;

    if (mode === "day") {
      scene.background = new THREE.Color("#0f172a");
      scene.fog = new THREE.FogExp2("#0f172a", 0.0025);
      dirLightRef.current.color.set("#ffffff");
      dirLightRef.current.intensity = 1.4;
      dirLightRef.current.position.set(60, 100, 40);
      hemiLightRef.current.color.set("#93c5fd");
      hemiLightRef.current.groundColor.set("#334155");
      hemiLightRef.current.intensity = 0.9;
      ambientLightRef.current.intensity = 0.6;
    } else if (mode === "sunset") {
      scene.background = new THREE.Color("#180f24");
      scene.fog = new THREE.FogExp2("#180f24", 0.0028);
      dirLightRef.current.color.set("#fb923c");
      dirLightRef.current.intensity = 1.8;
      dirLightRef.current.position.set(100, 45, -50);
      hemiLightRef.current.color.set("#fdba74");
      hemiLightRef.current.groundColor.set("#1e1b4b");
      hemiLightRef.current.intensity = 0.7;
      ambientLightRef.current.intensity = 0.45;
    } else {
      // Cyber Night
      scene.background = new THREE.Color("#050814");
      scene.fog = new THREE.FogExp2("#050814", 0.0035);
      dirLightRef.current.color.set("#38bdf8");
      dirLightRef.current.intensity = 0.5;
      dirLightRef.current.position.set(-40, 80, -30);
      hemiLightRef.current.color.set("#1e293b");
      hemiLightRef.current.groundColor.set("#020617");
      hemiLightRef.current.intensity = 0.35;
      ambientLightRef.current.intensity = 0.25;
    }
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 600;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color("#180f24");
    scene.fog = new THREE.FogExp2("#180f24", 0.0028);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(0, 95, 140);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const hemiLight = new THREE.HemisphereLight(0xfdba74, 0x1e1b4b, 0.7);
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const dirLight = new THREE.DirectionalLight(0xfb923c, 1.8);
    dirLight.position.set(100, 60, -50);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 400;
    dirLight.shadow.camera.left = -200;
    dirLight.shadow.camera.right = 200;
    dirLight.shadow.camera.top = 200;
    dirLight.shadow.camera.bottom = -200;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // 5. Ground Plane (Tehran Urban Map Base)
    const groundGeo = new THREE.PlaneGeometry(600, 600, 40, 40);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // 6. Tehran Grid Lines & Street Avenues
    const gridHelper = new THREE.GridHelper(500, 50, 0x334155, 0x1e293b);
    gridHelper.position.y = 0.1;
    scene.add(gridHelper);

    // Main Expressways (Modarres, Hemmat, Niayesh / Hashemi Rafsanjani, Yadegar Imam)
    const roadMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
    const roadLineMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });

    // East-West Arterial (Hemmat / Niayesh)
    const ewRoad = new THREE.Mesh(new THREE.PlaneGeometry(500, 14), roadMat);
    ewRoad.rotation.x = -Math.PI / 2;
    ewRoad.position.set(0, 0.15, 0);
    scene.add(ewRoad);

    const ewLine = new THREE.Mesh(new THREE.PlaneGeometry(500, 0.8), roadLineMat);
    ewLine.rotation.x = -Math.PI / 2;
    ewLine.position.set(0, 0.2, 0);
    scene.add(ewLine);

    // North-South Arterials (Chamran / Yadegar Imam)
    const nsRoad1 = new THREE.Mesh(new THREE.PlaneGeometry(14, 500), roadMat);
    nsRoad1.rotation.x = -Math.PI / 2;
    nsRoad1.position.set(-60, 0.15, 0);
    scene.add(nsRoad1);

    const nsRoad2 = new THREE.Mesh(new THREE.PlaneGeometry(14, 500), roadMat);
    nsRoad2.rotation.x = -Math.PI / 2;
    nsRoad2.position.set(70, 0.15, 0);
    scene.add(nsRoad2);

    // 7. Alborz Mountain Range Horizon Backdrop (To the North, Z < -220)
    const mountainGroup = new THREE.Group();
    const mountainGeo = new THREE.ConeGeometry(50, 65, 5);
    const mountainMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      roughness: 0.95,
      metalness: 0.1,
      flatShading: true
    });
    const snowCapMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.5,
      flatShading: true
    });

    const mountainPositions = [
      { x: -180, z: -250, scale: 1.1, height: 75 },
      { x: -100, z: -270, scale: 1.4, height: 95 },
      { x: -20, z: -260, scale: 1.3, height: 88 },
      { x: 60, z: -280, scale: 1.6, height: 110 }, // Mount Damavand / Tochal
      { x: 150, z: -265, scale: 1.2, height: 80 },
      { x: 230, z: -250, scale: 1.0, height: 70 }
    ];

    mountainPositions.forEach((m) => {
      const peak = new THREE.Mesh(mountainGeo, mountainMat);
      peak.position.set(m.x, m.height / 2, m.z);
      peak.scale.set(m.scale, m.scale * (m.height / 65), m.scale);
      mountainGroup.add(peak);

      // Snow Cap
      const snow = new THREE.Mesh(new THREE.ConeGeometry(18 * m.scale, 20 * m.scale, 5), snowCapMat);
      snow.position.set(m.x, m.height - 8 * m.scale, m.z);
      mountainGroup.add(snow);
    });
    scene.add(mountainGroup);

    // 8. Generate 3D Buildings & Landmarks
    const bldgMap = new Map<string, THREE.Group>();

    TEHRAN_BUILDINGS.forEach((bldg) => {
      const bldgGroup = new THREE.Group();
      bldgGroup.position.set(bldg.worldPosition.x, 0, bldg.worldPosition.z);
      bldgGroup.name = bldg.id;
      bldgGroup.userData = { building: bldg };

      const { rentUnits, saleUnits } = getActiveUnitsInBuilding(bldg);
      const hasRent = rentUnits.length > 0;
      const hasSale = saleUnits.length > 0;

      // Base building geometry
      const { width, depth, height } = bldg.dimensions;
      const boxGeo = new THREE.BoxGeometry(width, height, depth);

      // Custom materials
      let baseColor = new THREE.Color(bldg.colorTheme?.facadeColor || "#e2e8f0");
      let windowColor = new THREE.Color(bldg.colorTheme?.windowColor || "#0284c7");

      const facadeMat = new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: 0.35,
        metalness: 0.25
      });

      const bodyMesh = new THREE.Mesh(boxGeo, facadeMat);
      bodyMesh.position.y = height / 2;
      bodyMesh.castShadow = true;
      bodyMesh.receiveShadow = true;
      bldgGroup.add(bodyMesh);

      // Floor Separation Slices (Horizontal Architectural Bands)
      const floorLineMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
      const floorHeight = height / bldg.totalFloors;
      for (let f = 1; f < bldg.totalFloors; f++) {
        const lineGeo = new THREE.BoxGeometry(width + 0.3, 0.4, depth + 0.3);
        const lineMesh = new THREE.Mesh(lineGeo, floorLineMat);
        lineMesh.position.y = f * floorHeight;
        bldgGroup.add(lineMesh);
      }

      // Rooftop Penthouse & HVAC Structures
      const roofCapGeo = new THREE.BoxGeometry(width * 0.5, 3.5, depth * 0.5);
      const roofCapMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.8
      });
      const roofCap = new THREE.Mesh(roofCapGeo, roofCapMat);
      roofCap.position.y = height + 1.75;
      roofCap.castShadow = true;
      bldgGroup.add(roofCap);

      // Rooftop Garden Greenery if present
      if (bldg.amenities.hasRoofGarden) {
        const pergolaGeo = new THREE.BoxGeometry(width * 0.35, 2, depth * 0.35);
        const pergolaMat = new THREE.MeshStandardMaterial({
          color: 0x059669,
          roughness: 0.9
        });
        const pergola = new THREE.Mesh(pergolaGeo, pergolaMat);
        pergola.position.set(width * 0.2, height + 1, -depth * 0.2);
        bldgGroup.add(pergola);
      }

      // Active Listing 3D Beacon Indicator (Glowing Aura & Pulsing Pin)
      if (hasRent || hasSale) {
        const beaconColor = hasRent && hasSale ? 0xa855f7 : hasRent ? 0x10b981 : 0xf59e0b;

        // Glowing floating diamond marker
        const markerGeo = new THREE.OctahedronGeometry(2.5, 0);
        const markerMat = new THREE.MeshStandardMaterial({
          color: beaconColor,
          emissive: beaconColor,
          emissiveIntensity: 0.85,
          roughness: 0.2,
          metalness: 0.8
        });
        const markerMesh = new THREE.Mesh(markerGeo, markerMat);
        markerMesh.position.y = height + 7.5;
        markerMesh.name = "beaconMarker";
        bldgGroup.add(markerMesh);

        // Ground Pulse Ring
        const ringGeo = new THREE.RingGeometry(width * 0.7, width * 0.8, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: beaconColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.4
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = -Math.PI / 2;
        ringMesh.position.y = 0.25;
        bldgGroup.add(ringMesh);
      }

      scene.add(bldgGroup);
      bldgMap.set(bldg.id, bldgGroup);
    });

    buildingMeshesRef.current = bldgMap;

    // 9. Additional background city building blocks for Tehran urban skyline depth
    const dummyBldgGeo = new THREE.BoxGeometry(12, 18, 12);
    const dummyMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8
    });

    const dummyPositions = [
      { x: -100, z: -120, h: 22 },
      { x: -120, z: -70, h: 16 },
      { x: -15, z: -110, h: 28 },
      { x: 25, z: -90, h: 32 },
      { x: 45, z: -140, h: 24 },
      { x: 95, z: -110, h: 35 },
      { x: -100, z: 20, h: 20 },
      { x: -110, z: 80, h: 18 },
      { x: -20, z: 70, h: 26 },
      { x: 20, z: 60, h: 30 },
      { x: 50, z: 90, h: 22 },
      { x: -20, z: 150, h: 15 },
      { x: -60, z: 140, h: 18 },
      { x: -120, z: 170, h: 16 }
    ];

    dummyPositions.forEach((pos) => {
      const mesh = new THREE.Mesh(dummyBldgGeo, dummyMat);
      mesh.scale.set(1, pos.h / 18, 1);
      mesh.position.set(pos.x, pos.h / 2, pos.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
    });

    // 10. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera transition (lerp)
      if (cameraRef.current && isTransitioningRef.current) {
        cameraRef.current.position.lerp(targetCamPosRef.current, 0.05);
        cameraTargetRef.current.lerp(targetLookAtRef.current, 0.05);
        cameraRef.current.lookAt(cameraTargetRef.current);

        if (
          cameraRef.current.position.distanceTo(targetCamPosRef.current) < 0.5 &&
          cameraTargetRef.current.distanceTo(targetLookAtRef.current) < 0.5
        ) {
          isTransitioningRef.current = false;
        }
      }

      // Animate active listing markers (floating rotation & bobbing)
      bldgMap.forEach((group) => {
        const marker = group.getObjectByName("beaconMarker");
        if (marker) {
          marker.rotation.y = elapsedTime * 1.5;
          marker.position.y = (group.userData.building?.dimensions.height || 20) + 7.5 + Math.sin(elapsedTime * 3) * 0.8;
        }
      });

      // Update compass orientation
      if (cameraRef.current) {
        const dir = new THREE.Vector3();
        cameraRef.current.getWorldDirection(dir);
        const angleDeg = Math.atan2(dir.x, dir.z) * (180 / Math.PI);
        setCompassAngle(angleDeg);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  // Update lighting when timeOfDay changes
  useEffect(() => {
    if (sceneRef.current) {
      applyLightingMode(timeOfDay, sceneRef.current);
    }
  }, [timeOfDay, applyLightingMode]);

  // Handle building selection camera focus
  useEffect(() => {
    if (!selectedBuildingId) return;
    const bldg = TEHRAN_BUILDINGS.find((b) => b.id === selectedBuildingId);
    if (!bldg || !cameraRef.current) return;

    const targetLook = new THREE.Vector3(
      bldg.worldPosition.x,
      bldg.dimensions.height * 0.6,
      bldg.worldPosition.z
    );
    const targetPos = new THREE.Vector3(
      bldg.worldPosition.x + 28,
      bldg.dimensions.height + 25,
      bldg.worldPosition.z + 32
    );

    flyTo(targetPos, targetLook);
  }, [selectedBuildingId, flyTo]);

  // Handle district jump
  useEffect(() => {
    if (!activeDistrictId) return;
    const district = TEHRAN_DISTRICTS.find((d) => d.id === activeDistrictId);
    if (!district) return;

    flyTo(
      new THREE.Vector3(district.cameraPosition.x, district.cameraPosition.y, district.cameraPosition.z),
      new THREE.Vector3(district.cameraTarget.x, district.cameraTarget.y, district.cameraTarget.z)
    );
  }, [activeDistrictId, flyTo]);

  // Pointer drag controls (Orbit, Pan, Tilt)
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;

    // Raycast on hover
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);

    let foundBuilding: TehranBuilding | null = null;

    for (const hit of intersects) {
      let curr: THREE.Object3D | null = hit.object;
      while (curr && !curr.userData.building) {
        curr = curr.parent;
      }
      if (curr && curr.userData.building) {
        foundBuilding = curr.userData.building as TehranBuilding;
        break;
      }
    }

    setHoveredBuilding(foundBuilding);

    // Camera orbit on drag
    if (isDraggingRef.current) {
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };

      sphericalRef.current.theta -= deltaX * 0.006;
      sphericalRef.current.phi -= deltaY * 0.006;
      sphericalRef.current.phi = Math.max(0.2, Math.min(Math.PI / 2.1, sphericalRef.current.phi));

      const radius = sphericalRef.current.radius;
      const theta = sphericalRef.current.theta;
      const phi = sphericalRef.current.phi;

      const newX = cameraTargetRef.current.x + radius * Math.sin(phi) * Math.sin(theta);
      const newY = cameraTargetRef.current.y + radius * Math.cos(phi);
      const newZ = cameraTargetRef.current.z + radius * Math.sin(phi) * Math.cos(theta);

      cameraRef.current.position.set(newX, newY, newZ);
      cameraRef.current.lookAt(cameraTargetRef.current);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    // If not dragged significantly, treat as Click
    const deltaX = Math.abs(e.clientX - previousMousePositionRef.current.x);
    const deltaY = Math.abs(e.clientY - previousMousePositionRef.current.y);

    if (deltaX < 5 && deltaY < 5 && hoveredBuilding) {
      onSelectBuilding(hoveredBuilding);
    }

    isDraggingRef.current = false;
  };

  // Zoom with Wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!cameraRef.current) return;

    sphericalRef.current.radius += e.deltaY * 0.12;
    sphericalRef.current.radius = Math.max(35, Math.min(320, sphericalRef.current.radius));

    const radius = sphericalRef.current.radius;
    const theta = sphericalRef.current.theta;
    const phi = sphericalRef.current.phi;

    const newX = cameraTargetRef.current.x + radius * Math.sin(phi) * Math.sin(theta);
    const newY = cameraTargetRef.current.y + radius * Math.cos(phi);
    const newZ = cameraTargetRef.current.z + radius * Math.sin(phi) * Math.cos(theta);

    cameraRef.current.position.set(newX, newY, newZ);
    cameraRef.current.lookAt(cameraTargetRef.current);
  };

  const handleZoom = (delta: number) => {
    if (!cameraRef.current) return;
    sphericalRef.current.radius += delta;
    sphericalRef.current.radius = Math.max(35, Math.min(320, sphericalRef.current.radius));

    const radius = sphericalRef.current.radius;
    const theta = sphericalRef.current.theta;
    const phi = sphericalRef.current.phi;

    const newX = cameraTargetRef.current.x + radius * Math.sin(phi) * Math.sin(theta);
    const newY = cameraTargetRef.current.y + radius * Math.cos(phi);
    const newZ = cameraTargetRef.current.z + radius * Math.sin(phi) * Math.cos(theta);

    cameraRef.current.position.set(newX, newY, newZ);
    cameraRef.current.lookAt(cameraTargetRef.current);
  };

  const resetView = () => {
    flyTo(new THREE.Vector3(0, 95, 140), new THREE.Vector3(0, 15, 0));
    sphericalRef.current = { radius: 170, theta: 0, phi: Math.PI / 3.5 };
    onSelectBuilding(null);
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
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      className="relative w-full h-full bg-slate-950 overflow-hidden select-none cursor-grab active:cursor-grabbing touch-none"
    >
      {/* 3D Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Top Left Navigation Bar & Compass */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
        {/* Compass */}
        <div
          className="bg-slate-950/85 backdrop-blur-md p-2.5 rounded-2xl border border-slate-800 shadow-xl flex items-center gap-1.5 text-slate-300 text-xs font-mono pointer-events-auto"
          title="جهت‌نمای جغرافیایی تهران (شمال به سمت قله توچال)"
        >
          <Compass
            className="w-4 h-4 text-amber-400 transition-transform duration-100"
            style={{ transform: `rotate(${-compassAngle}deg)` }}
          />
          <span className="font-bold text-amber-400">N</span>
        </div>

        {/* Day / Sunset / Night Toggle */}
        <div className="bg-slate-950/85 backdrop-blur-md p-1 rounded-2xl border border-slate-800 shadow-xl flex items-center gap-1 pointer-events-auto">
          <button
            onClick={() => setTimeOfDay("day")}
            className={`p-1.5 rounded-xl transition-all ${
              timeOfDay === "day"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
            title="روز (روشنایی آفتاب تهران)"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTimeOfDay("sunset")}
            className={`p-1.5 rounded-xl transition-all ${
              timeOfDay === "sunset"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
            title="غروب و عصرگاه طلایی"
          >
            <Sunset className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTimeOfDay("night")}
            className={`p-1.5 rounded-xl transition-all ${
              timeOfDay === "night"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
            title="شب و نورپردازی شهری"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top Right Quick Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 pointer-events-auto">
        {/* Reset Camera View */}
        <button
          onClick={resetView}
          className="p-2.5 rounded-2xl bg-slate-950/85 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors backdrop-blur-md shadow-xl flex items-center gap-1.5 text-xs font-semibold"
          title="بازنشانی زاویه دید کل تهران"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">دید کل تهران</span>
        </button>

        {/* Zoom In / Out Buttons */}
        <div className="flex items-center bg-slate-950/85 backdrop-blur-md rounded-2xl border border-slate-800 p-1 shadow-xl">
          <button
            onClick={() => handleZoom(-25)}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white"
            title="بزرگ‌نمایی"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-3 bg-slate-800 mx-0.5" />
          <button
            onClick={() => handleZoom(25)}
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

      {/* Hovered Building Tooltip (Interactive Floating Badge) */}
      {hoveredBuilding && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-slate-950/90 backdrop-blur-xl border border-amber-500/40 rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold">
                  {hoveredBuilding.district}
                </span>
                <span className="text-xs text-slate-400">
                  {hoveredBuilding.plaque}
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-white mt-0.5">
                {hoveredBuilding.name}
              </h3>
              <p className="text-[11px] text-slate-400">
                {hoveredBuilding.totalFloors} طبقه • کلیک برای مشاهده واحدها و وضعیت فروش/اجاره
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Map Legend */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-none hidden md:flex items-center gap-3 bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800 text-[11px] shadow-xl">
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
          <span className="text-slate-400">پلاک شهری ثبت‌شده</span>
        </div>
      </div>
    </div>
  );
}
