"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

interface RouteTheme {
  primary: number;
  secondary: number;
  warm: number;
}

const DEFAULT_THEME: RouteTheme = {
  primary: 0x38bdf8,
  secondary: 0x818cf8,
  warm: 0xfbbf24,
};

function getThemeForRoute(pathname: string): RouteTheme {
  if (pathname.startsWith("/journey")) {
    return { primary: 0x38bdf8, secondary: 0x818cf8, warm: 0xfbbf24 };
  }
  if (pathname.startsWith("/skills-projects")) {
    return { primary: 0x38bdf8, secondary: 0xfbbf24, warm: 0x8b5cf6 };
  }
  if (pathname.startsWith("/sports")) {
    return { primary: 0x38bdf8, secondary: 0x10b981, warm: 0xf59e0b };
  }
  if (pathname.startsWith("/activities")) {
    return { primary: 0x6366f1, secondary: 0x38bdf8, warm: 0xc084fc };
  }
  if (pathname.startsWith("/parties")) {
    return { primary: 0xe879f9, secondary: 0x8b5cf6, warm: 0xfbbf24 };
  }
  if (pathname.startsWith("/healthy-life")) {
    return { primary: 0x10b981, secondary: 0x14b8a6, warm: 0x38bdf8 };
  }
  if (pathname.startsWith("/workshops")) {
    return { primary: 0x8b5cf6, secondary: 0x6366f1, warm: 0x38bdf8 };
  }
  if (pathname.startsWith("/memories")) {
    return { primary: 0x818cf8, secondary: 0xf472b6, warm: 0xfbbf24 };
  }
  if (pathname.startsWith("/contact")) {
    return { primary: 0x38bdf8, secondary: 0x8b5cf6, warm: 0x10b981 };
  }
  return DEFAULT_THEME;
}

function createSoftBokehTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const grad = ctx.createRadialGradient(64, 64, 1, 64, 64, 62);
  grad.addColorStop(0, "rgba(255, 255, 255, 1)");
  grad.addColorStop(0.28, "rgba(224, 242, 254, 0.82)");
  grad.addColorStop(0.62, "rgba(99, 102, 241, 0.22)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.clearRect(0, 0, 128, 128);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(64, 64, 62, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

interface OrbitalSculpture {
  group: THREE.Group;
  core: THREE.Mesh;
  ringA: THREE.Mesh;
  ringB: THREE.Mesh;
  glassMat: THREE.MeshPhysicalMaterial;
  edgeMat: THREE.LineBasicMaterial;
  ringMat: THREE.MeshPhysicalMaterial;
  toneRole: "primary" | "secondary" | "warm";
  baseX: number;
  baseY: number;
  baseZ: number;
  phase: number;
  spinY: number;
  spinX: number;
}

export interface ThreeGlobalBackdropProps {
  routePath: string;
}

export default function ThreeGlobalBackdrop({
  routePath,
}: ThreeGlobalBackdropProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetThemeRef = useRef<RouteTheme>(getThemeForRoute(routePath));
  const refreshScrollRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    targetThemeRef.current = getThemeForRoute(routePath);
    const rafId = window.requestAnimationFrame(() => {
      refreshScrollRef.current?.();
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [routePath]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    const initialW = container.clientWidth || window.innerWidth;
    const initialH = container.clientHeight || window.innerHeight;
    const initialMobile = initialW < 768;

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, initialMobile ? 1.25 : 1.75),
    );
    renderer.setSize(initialW, initialH);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.16;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.pointerEvents = "none";
    renderer.domElement.style.opacity = "0";
    renderer.domElement.style.transition = "opacity 650ms ease";

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.68;

    const camera = new THREE.PerspectiveCamera(45, initialW / initialH, 0.1, 95);
    camera.position.set(0, 0.5, initialMobile ? 10.8 : 9.6);

    const initialTheme = targetThemeRef.current;

    // 3-point sculptural lighting reacting smoothly across routes & scroll depth
    const keyLight = new THREE.DirectionalLight(0xe0f2fe, 2.2);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const primaryLight = new THREE.PointLight(initialTheme.primary, 24, 28);
    primaryLight.position.set(4.8, 2.2, 2.4);
    scene.add(primaryLight);

    const secondaryLight = new THREE.PointLight(initialTheme.secondary, 24, 30);
    secondaryLight.position.set(-4.8, -2.2, 2.0);
    scene.add(secondaryLight);

    const warmLight = new THREE.PointLight(initialTheme.warm, 18, 26);
    warmLight.position.set(3.4, -6.2, 2.2);
    scene.add(warmLight);

    const disposableGeos: THREE.BufferGeometry[] = [];
    const disposableMats: THREE.Material[] = [];
    const disposableTextures: THREE.Texture[] = [];

    const bokehTex = createSoftBokehTexture();
    if (bokehTex) disposableTextures.push(bokehTex);

    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // -------------------------------------------------------------------------
    // 1. ARCHITECTURAL KINETIC TOPOGRAPHY MESH (Deep Background Flow)
    // -------------------------------------------------------------------------
    const cols = initialMobile ? 26 : 42;
    const rows = initialMobile ? 16 : 24;
    const waveGeo = new THREE.PlaneGeometry(25, 14.5, cols, rows);
    waveGeo.rotateX(-Math.PI * 0.42);

    const wavePosAttr = waveGeo.attributes.position as THREE.BufferAttribute;
    const baseWaveCoords = new Float32Array(wavePosAttr.array.length);
    const waveColors = new Float32Array(wavePosAttr.count * 3);

    const curPrimary = new THREE.Color(initialTheme.primary);
    const curSecondary = new THREE.Color(initialTheme.secondary);
    const curWarm = new THREE.Color(initialTheme.warm);
    const tmpColorA = new THREE.Color();
    const tmpColorB = new THREE.Color();
    const tmpColorC = new THREE.Color();

    for (let i = 0; i < wavePosAttr.count; i++) {
      baseWaveCoords[i * 3] = wavePosAttr.getX(i);
      baseWaveCoords[i * 3 + 1] = wavePosAttr.getY(i);
      baseWaveCoords[i * 3 + 2] = wavePosAttr.getZ(i);

      const nx = (wavePosAttr.getX(i) + 12.5) / 25;
      tmpColorA.copy(curPrimary).lerp(curSecondary, nx);
      waveColors[i * 3] = tmpColorA.r;
      waveColors[i * 3 + 1] = tmpColorA.g;
      waveColors[i * 3 + 2] = tmpColorA.b;
    }

    const waveColorAttr = new THREE.BufferAttribute(waveColors, 3);
    waveGeo.setAttribute("color", waveColorAttr);

    const waveMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      wireframe: true,
      transparent: true,
      opacity: initialMobile ? 0.08 : 0.13,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    waveMesh.position.set(0, -2.0, -5.4);
    worldGroup.add(waveMesh);
    disposableGeos.push(waveGeo);
    disposableMats.push(waveMat);

    // -------------------------------------------------------------------------
    // 2. DUAL SWEPT ORBITAL TRAJECTORY CURVES + STREAMING PHOTONS
    // Creates a dynamic 3D cosmic trajectory spanning header to footer
    // -------------------------------------------------------------------------
    const splineACurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(6.8, 3.8, -3.2),
      new THREE.Vector3(2.4, 1.3, -4.4),
      new THREE.Vector3(-4.2, -2.0, -3.6),
      new THREE.Vector3(1.8, -5.8, -4.2),
      new THREE.Vector3(-5.2, -9.2, -3.4),
    ]);

    const splineBCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-6.4, 3.2, -3.6),
      new THREE.Vector3(-2.1, 0.2, -4.6),
      new THREE.Vector3(4.5, -3.1, -3.5),
      new THREE.Vector3(-2.2, -6.4, -4.4),
      new THREE.Vector3(4.9, -9.6, -3.6),
    ]);

    const splineAGeo = new THREE.BufferGeometry().setFromPoints(
      splineACurve.getPoints(130),
    );
    const splineAMat = new THREE.LineBasicMaterial({
      color: initialTheme.primary,
      transparent: true,
      opacity: initialMobile ? 0.16 : 0.24,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    worldGroup.add(new THREE.Line(splineAGeo, splineAMat));

    const splineBGeo = new THREE.BufferGeometry().setFromPoints(
      splineBCurve.getPoints(130),
    );
    const splineBMat = new THREE.LineBasicMaterial({
      color: initialTheme.secondary,
      transparent: true,
      opacity: initialMobile ? 0.14 : 0.2,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    worldGroup.add(new THREE.Line(splineBGeo, splineBMat));

    disposableGeos.push(splineAGeo, splineBGeo);
    disposableMats.push(splineAMat, splineBMat);

    const photonCount = initialMobile ? 28 : 56;
    const photonPositions = new Float32Array(photonCount * 3);
    const photonOffsets = new Float32Array(photonCount);
    const tmpPoint = new THREE.Vector3();

    for (let i = 0; i < photonCount; i++) {
      photonOffsets[i] = i / photonCount;
    }

    const photonGeo = new THREE.BufferGeometry();
    const photonPosAttr = new THREE.BufferAttribute(photonPositions, 3);
    photonGeo.setAttribute("position", photonPosAttr);

    const photonMat = new THREE.PointsMaterial({
      size: initialMobile ? 0.18 : 0.22,
      map: bokehTex ?? undefined,
      color: initialTheme.primary,
      transparent: true,
      opacity: 0.82,
      alphaTest: 0.02,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const photonPoints = new THREE.Points(photonGeo, photonMat);
    worldGroup.add(photonPoints);
    disposableGeos.push(photonGeo);
    disposableMats.push(photonMat);

    // -------------------------------------------------------------------------
    // 3. STAGGERED FACETED ARCHITECTURAL CRYSTAL CLUSTERS (Outer Gutters)
    // Positioned in page margins so center PageHeader & cards remain spotless
    // -------------------------------------------------------------------------
    const coreOcta = new THREE.OctahedronGeometry(1, 0);
    const coreIcosa = new THREE.IcosahedronGeometry(1, 1);
    const coreDodeca = new THREE.DodecahedronGeometry(1, 0);
    const coreGeos = [coreOcta, coreIcosa, coreDodeca, coreIcosa];
    const edgeGeos = coreGeos.map((g) => new THREE.EdgesGeometry(g));
    disposableGeos.push(coreOcta, coreIcosa, coreDodeca, ...edgeGeos);

    const sculptureSpecs: {
      x: number;
      y: number;
      z: number;
      radius: number;
      ringR: number;
      toneRole: "primary" | "secondary" | "warm";
      phase: number;
      spinY: number;
      spinX: number;
    }[] = [
      {
        x: 5.2,
        y: 1.98,
        z: -1.9,
        radius: 0.78,
        ringR: 1.32,
        toneRole: "primary",
        phase: 0.3,
        spinY: 0.24,
        spinX: 0.15,
      },
      {
        x: -5.45,
        y: -0.95,
        z: -2.35,
        radius: 0.88,
        ringR: 1.44,
        toneRole: "secondary",
        phase: 2.0,
        spinY: -0.2,
        spinX: 0.14,
      },
      {
        x: 5.3,
        y: -3.85,
        z: -2.25,
        radius: 0.84,
        ringR: 1.38,
        toneRole: "primary",
        phase: 3.7,
        spinY: 0.22,
        spinX: -0.16,
      },
      {
        x: -5.1,
        y: -6.65,
        z: -2.15,
        radius: 0.78,
        ringR: 1.28,
        toneRole: "warm",
        phase: 5.2,
        spinY: -0.23,
        spinX: 0.17,
      },
    ];

    const sculptures: OrbitalSculpture[] = [];

    sculptureSpecs.forEach((spec, idx) => {
      const group = new THREE.Group();
      const lateralFactor = initialMobile ? 0.56 : 1;
      const baseX = spec.x * lateralFactor;
      const baseZ = initialMobile ? spec.z - 1.3 : spec.z;
      group.position.set(baseX, spec.y, baseZ);

      const accentHex =
        spec.toneRole === "primary"
          ? initialTheme.primary
          : spec.toneRole === "secondary"
            ? initialTheme.secondary
            : initialTheme.warm;

      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x0f172a,
        emissive: accentHex,
        emissiveIntensity: 0.2,
        metalness: 0.22,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        transparent: true,
        opacity: initialMobile ? 0.22 : 0.34,
        depthWrite: false,
      });

      const core = new THREE.Mesh(coreGeos[idx], glassMat);
      core.scale.setScalar(spec.radius);

      const edgeMat = new THREE.LineBasicMaterial({
        color: accentHex,
        transparent: true,
        opacity: initialMobile ? 0.32 : 0.5,
      });
      core.add(new THREE.LineSegments(edgeGeos[idx], edgeMat));
      group.add(core);

      const ringAGeo = new THREE.TorusGeometry(spec.ringR, 0.018, 16, 96);
      const ringBGeo = new THREE.TorusGeometry(spec.ringR * 0.78, 0.014, 16, 80);

      const ringMat = new THREE.MeshPhysicalMaterial({
        color: 0x1e293b,
        emissive: accentHex,
        emissiveIntensity: 0.4,
        metalness: 0.88,
        roughness: 0.18,
        clearcoat: 1.0,
        transparent: true,
        opacity: initialMobile ? 0.44 : 0.7,
      });

      const ringA = new THREE.Mesh(ringAGeo, ringMat);
      ringA.rotation.set(0.98, 0.44, 0);
      group.add(ringA);

      const ringB = new THREE.Mesh(ringBGeo, ringMat);
      ringB.rotation.set(-0.74, 0.86, 0.26);
      group.add(ringB);

      disposableGeos.push(ringAGeo, ringBGeo);
      disposableMats.push(glassMat, edgeMat, ringMat);
      worldGroup.add(group);

      sculptures.push({
        group,
        core,
        ringA,
        ringB,
        glassMat,
        edgeMat,
        ringMat,
        toneRole: spec.toneRole,
        baseX,
        baseY: spec.y,
        baseZ,
        phase: spec.phase,
        spinY: spec.spinY,
        spinX: spec.spinX,
      });
    });

    // -------------------------------------------------------------------------
    // 4. DEEP CELESTIAL ASTROLABE RINGS (Sweeping Backdrop Framing)
    // -------------------------------------------------------------------------
    const deepRingsGroup = new THREE.Group();
    deepRingsGroup.position.set(0, -1.5, -6.4);

    const deepRingDefs = [
      { r: 4.8, tube: 0.018, rx: 1.22, ry: 0.35, opacity: 0.19, role: "primary" as const },
      { r: 6.0, tube: 0.016, rx: -0.94, ry: -0.44, opacity: 0.16, role: "secondary" as const },
      { r: 7.2, tube: 0.014, rx: 0.64, ry: 0.72, opacity: 0.13, role: "warm" as const },
    ];

    const deepRings: {
      mesh: THREE.Mesh;
      mat: THREE.MeshBasicMaterial;
      role: "primary" | "secondary" | "warm";
    }[] = [];

    deepRingDefs.forEach((def) => {
      const geo = new THREE.TorusGeometry(def.r, def.tube, 12, 140);
      const colorHex =
        def.role === "primary"
          ? initialTheme.primary
          : def.role === "secondary"
            ? initialTheme.secondary
            : initialTheme.warm;
      const mat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: def.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.set(def.rx, def.ry, 0);
      deepRingsGroup.add(mesh);
      deepRings.push({ mesh, mat, role: def.role });
      disposableGeos.push(geo);
      disposableMats.push(mat);
    });
    worldGroup.add(deepRingsGroup);

    // -------------------------------------------------------------------------
    // 5. VOLUMETRIC BOKEH DEPTH STARFIELD
    // -------------------------------------------------------------------------
    const starCount = initialMobile ? 250 : 680;
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starPalette = [
      new THREE.Color(0x7dd3fc),
      new THREE.Color(0xc4b5fd),
      new THREE.Color(0x93c5fd),
      new THREE.Color(0xfde68a),
      new THREE.Color(0xf8fafc),
    ];

    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 26;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 24 - 2.6;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 4.4;

      const c = starPalette[i % starPalette.length];
      starColors[i * 3] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: initialMobile ? 0.11 : 0.105,
      map: bokehTex ?? undefined,
      vertexColors: true,
      transparent: true,
      opacity: 0.66,
      alphaTest: 0.02,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(starGeo, starMat);
    worldGroup.add(starField);
    disposableGeos.push(starGeo);
    disposableMats.push(starMat);

    // -------------------------------------------------------------------------
    // 6. SCROLL + POINTER PARALLAX + RESPONSIVE RESIZE LIFECYCLE
    // -------------------------------------------------------------------------
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const scrollState = { progress: 0, target: 0 };

    const updateScrollTarget = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      scrollState.target = Math.max(0, Math.min(1, window.scrollY / maxScroll));
    };
    refreshScrollRef.current = updateScrollTarget;

    const handlePointerMove = (e: PointerEvent) => {
      pointer.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const updateCameraLayout = (w: number, h: number) => {
      const mobile = w < 768;
      camera.aspect = w / h;
      camera.fov = mobile ? 52 : 45;
      camera.position.z = mobile ? 10.8 : 9.6;
      camera.updateProjectionMatrix();
      renderer?.setSize(w, h);

      sculptures.forEach((sObj, idx) => {
        const spec = sculptureSpecs[idx];
        const factor = mobile ? 0.56 : 1;
        sObj.baseX = spec.x * factor;
        sObj.baseZ = mobile ? spec.z - 1.3 : spec.z;
      });
    };

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      updateCameraLayout(w, h);
      updateScrollTarget();
    };

    updateScrollTarget();
    window.addEventListener("scroll", updateScrollTarget, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    let frameId = 0;
    const startTime = performance.now();

    const targetPrimary = new THREE.Color();
    const targetSecondary = new THREE.Color();
    const targetWarm = new THREE.Color();

    const renderFrame = () => {
      const elapsed = (performance.now() - startTime) * 0.001;
      const targetTheme = targetThemeRef.current;

      pointer.x += (pointer.targetX - pointer.x) * 0.045;
      pointer.y += (pointer.targetY - pointer.y) * 0.045;
      scrollState.progress += (scrollState.target - scrollState.progress) * 0.055;

      // Smooth route-to-route chromatic morphing without recreating WebGL resources
      targetPrimary.setHex(targetTheme.primary);
      targetSecondary.setHex(targetTheme.secondary);
      targetWarm.setHex(targetTheme.warm);

      curPrimary.lerp(targetPrimary, 0.04);
      curSecondary.lerp(targetSecondary, 0.04);
      curWarm.lerp(targetWarm, 0.04);

      primaryLight.color.copy(curPrimary);
      secondaryLight.color.copy(curSecondary);
      warmLight.color.copy(curWarm);
      splineAMat.color.copy(curPrimary);
      splineBMat.color.copy(curSecondary);
      photonMat.color.copy(curPrimary);

      const s = scrollState.progress;

      // Glide camera smoothly down alongside subpage sections
      const camY = 0.72 - s * 7.2 + pointer.y * 0.22;
      camera.position.x = pointer.x * 0.38 + Math.sin(s * Math.PI * 1.8) * 0.26;
      camera.position.y = camY;
      camera.lookAt(pointer.x * 0.14, camY - 0.16, -2.6);

      // Update undulating wireframe topography wave & route vertex gradient
      waveMesh.position.y = camY - 2.35;
      const wArr = wavePosAttr.array as Float32Array;
      const cArr = waveColorAttr.array as Float32Array;
      for (let i = 0; i < wavePosAttr.count; i++) {
        const bx = baseWaveCoords[i * 3];
        const bz = baseWaveCoords[i * 3 + 2];
        const elevation =
          Math.sin(bx * 0.34 + elapsed * 0.62) * 0.4 +
          Math.cos(bz * 0.42 + elapsed * 0.5) * 0.34;
        wArr[i * 3 + 1] = baseWaveCoords[i * 3 + 1] + elevation;

        const nx = (bx + 12.5) / 25;
        tmpColorB.copy(curPrimary).lerp(curSecondary, nx);
        cArr[i * 3] = tmpColorB.r;
        cArr[i * 3 + 1] = tmpColorB.g;
        cArr[i * 3 + 2] = tmpColorB.b;
      }
      wavePosAttr.needsUpdate = true;
      waveColorAttr.needsUpdate = true;

      // Animate streaming trajectory photons along both splines
      for (let i = 0; i < photonCount; i++) {
        const u = (photonOffsets[i] + elapsed * 0.055) % 1;
        const curve = i % 2 === 0 ? splineACurve : splineBCurve;
        curve.getPointAt(u, tmpPoint);
        photonPosAttr.setXYZ(i, tmpPoint.x, tmpPoint.y, tmpPoint.z);
      }
      photonPosAttr.needsUpdate = true;

      // Animate faceted architectural crystals & gimbal rings
      sculptures.forEach((sObj) => {
        sObj.group.position.x = sObj.baseX + Math.sin(elapsed * 0.46 + sObj.phase) * 0.16;
        sObj.group.position.y = sObj.baseY + Math.cos(elapsed * 0.54 + sObj.phase) * 0.2;
        sObj.group.position.z = sObj.baseZ + Math.sin(elapsed * 0.36 + sObj.phase) * 0.14;

        sObj.core.rotation.y = elapsed * sObj.spinY + s * 1.45;
        sObj.core.rotation.x = elapsed * sObj.spinX;

        sObj.ringA.rotation.z += 0.0044;
        sObj.ringA.rotation.y = 0.44 + Math.sin(elapsed * 0.4 + sObj.phase) * 0.22;
        sObj.ringB.rotation.z -= 0.0052;
        sObj.ringB.rotation.x = -0.74 + Math.cos(elapsed * 0.36 + sObj.phase) * 0.22;

        tmpColorC.copy(
          sObj.toneRole === "primary"
            ? curPrimary
            : sObj.toneRole === "secondary"
              ? curSecondary
              : curWarm,
        );
        sObj.edgeMat.color.copy(tmpColorC);
        sObj.glassMat.emissive.copy(tmpColorC);
        sObj.ringMat.emissive.copy(tmpColorC);
      });

      // Animate deep celestial astrolabe rings
      deepRingsGroup.position.y = camY - 0.25;
      deepRings.forEach((item, idx) => {
        item.mesh.rotation.z =
          elapsed * (idx % 2 === 0 ? 0.06 : -0.048) + s * 0.55;
        item.mesh.rotation.y += (idx % 2 === 0 ? 1 : -1) * 0.0008;
        item.mat.color.copy(
          item.role === "primary"
            ? curPrimary
            : item.role === "secondary"
              ? curSecondary
              : curWarm,
        );
      });

      // Drift volumetric starfield
      starField.rotation.y = elapsed * 0.012 + pointer.x * 0.036;
      starField.rotation.x = pointer.y * 0.026;

      // Dynamic depth spotlight intensities
      primaryLight.position.y = camY + 1.4;
      secondaryLight.position.y = camY - 1.2;
      warmLight.position.y = camY - 2.6;
      primaryLight.intensity = 22 * (1 - s * 0.28);
      secondaryLight.intensity = 18 + Math.sin(s * Math.PI) * 14;
      warmLight.intensity = 10 + s * 15;

      renderer?.render(scene, camera);

      if (!prefersReducedMotion) {
        frameId = window.requestAnimationFrame(renderFrame);
      }
    };

    if (prefersReducedMotion) {
      renderFrame();
    } else {
      frameId = window.requestAnimationFrame(renderFrame);
    }

    const revealFrame = window.requestAnimationFrame(() => {
      if (renderer) {
        renderer.domElement.style.opacity = "1";
      }
    });

    return () => {
      refreshScrollRef.current = null;
      window.cancelAnimationFrame(revealFrame);
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateScrollTarget);
      window.removeEventListener("pointermove", handlePointerMove);
      resizeObserver.disconnect();
      disposableGeos.forEach((g) => g.dispose());
      disposableMats.forEach((m) => m.dispose());
      disposableTextures.forEach((t) => t.dispose());
      envRT.dispose();
      roomEnv.dispose();
      pmremGenerator.dispose();
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div ref={containerRef} className="h-full w-full" />
      {/* Center readability dusk scrim so chapter headlines & cards remain razor-crisp */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_66%_56%_at_50%_26%,rgba(3,6,20,0.38)_0%,transparent_76%)]" />
    </div>
  );
}
