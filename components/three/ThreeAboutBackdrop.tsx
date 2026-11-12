"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

function createSoftBokehTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const grad = ctx.createRadialGradient(64, 64, 1, 64, 64, 62);
  grad.addColorStop(0, "rgba(255, 255, 255, 1)");
  grad.addColorStop(0.28, "rgba(219, 234, 254, 0.78)");
  grad.addColorStop(0.62, "rgba(99, 102, 241, 0.2)");
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

interface FloatingPrism {
  group: THREE.Group;
  core: THREE.Mesh;
  outerRing: THREE.Mesh;
  innerRing: THREE.Mesh;
  baseX: number;
  baseY: number;
  baseZ: number;
  phase: number;
  rotSpeedY: number;
  rotSpeedX: number;
}

export default function ThreeAboutBackdrop() {
  const containerRef = useRef<HTMLDivElement>(null);

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
    renderer.domElement.style.transition = "opacity 700ms ease";

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.65;

    const camera = new THREE.PerspectiveCamera(45, initialW / initialH, 0.1, 80);
    camera.position.set(0, 0.4, 9.4);

    // Sculptural 3-point atmospheric lighting
    const skyLight = new THREE.DirectionalLight(0xe0f2fe, 2.2);
    skyLight.position.set(5, 7, 5);
    scene.add(skyLight);

    const cyanAccentLight = new THREE.PointLight(0x38bdf8, 22, 26);
    cyanAccentLight.position.set(4.5, 2.4, 2.2);
    scene.add(cyanAccentLight);

    const violetAccentLight = new THREE.PointLight(0x8b5cf6, 24, 28);
    violetAccentLight.position.set(-4.8, -2.5, 1.8);
    scene.add(violetAccentLight);

    const amberAccentLight = new THREE.PointLight(0xfbbf24, 16, 24);
    amberAccentLight.position.set(3.2, -5.8, 2.0);
    scene.add(amberAccentLight);

    const disposableGeos: THREE.BufferGeometry[] = [];
    const disposableMats: THREE.Material[] = [];
    const disposableTextures: THREE.Texture[] = [];

    const bokehTex = createSoftBokehTexture();
    if (bokehTex) disposableTextures.push(bokehTex);

    // Master world container driven gently by scroll progress
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // -------------------------------------------------------------------------
    // 1. ARCHITECTURAL HELIX CONSTELLATION (Full-Page Vertical Depth Flow)
    // Runs from Y = +3.2 down to Y = -7.6 so every scroll chapter has live 3D depth
    // -------------------------------------------------------------------------
    const STRAND_NODES = initialMobile ? 42 : 68;
    const strandA: THREE.Vector3[] = [];
    const strandB: THREE.Vector3[] = [];
    const baseRadiusX = initialMobile ? 2.75 : 4.85;

    for (let i = 0; i < STRAND_NODES; i++) {
      const t = i / (STRAND_NODES - 1);
      const y = 3.6 - t * 11.4;
      const angle = t * Math.PI * 3.2;
      const rx = baseRadiusX + Math.sin(t * Math.PI) * 0.9;
      const rz = 2.1;

      strandA.push(
        new THREE.Vector3(
          Math.cos(angle) * rx,
          y,
          Math.sin(angle) * rz - 2.6,
        ),
      );
      strandB.push(
        new THREE.Vector3(
          Math.cos(angle + Math.PI) * rx,
          y,
          Math.sin(angle + Math.PI) * rz - 2.6,
        ),
      );
    }

    // Dual kinetic filament lines + subtle cross-links
    const segmentPairs: number[] = [];
    const segmentColors: number[] = [];

    const colCyan = new THREE.Color(0x38bdf8);
    const colIndigo = new THREE.Color(0x818cf8);
    const colViolet = new THREE.Color(0xa855f7);
    const colAmber = new THREE.Color(0xfbbf24);

    const getScrollTint = (t: number, target: THREE.Color) => {
      if (t < 0.45) {
        target.copy(colCyan).lerp(colIndigo, t / 0.45);
      } else if (t < 0.78) {
        target.copy(colIndigo).lerp(colViolet, (t - 0.45) / 0.33);
      } else {
        target.copy(colViolet).lerp(colAmber, (t - 0.78) / 0.22);
      }
      return target;
    };

    const tempColA = new THREE.Color();
    const tempColB = new THREE.Color();

    const pushSegment = (
      p1: THREE.Vector3,
      p2: THREE.Vector3,
      t1: number,
      t2: number,
    ) => {
      segmentPairs.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
      getScrollTint(t1, tempColA);
      getScrollTint(t2, tempColB);
      segmentColors.push(
        tempColA.r,
        tempColA.g,
        tempColA.b,
        tempColB.r,
        tempColB.g,
        tempColB.b,
      );
    };

    for (let i = 0; i < STRAND_NODES - 1; i++) {
      const t1 = i / (STRAND_NODES - 1);
      const t2 = (i + 1) / (STRAND_NODES - 1);
      pushSegment(strandA[i], strandA[i + 1], t1, t2);
      pushSegment(strandB[i], strandB[i + 1], t1, t2);
      if (i % 3 === 0) {
        pushSegment(strandA[i], strandB[i], t1, t1);
      }
    }

    const helixLinesGeo = new THREE.BufferGeometry();
    helixLinesGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(segmentPairs, 3),
    );
    helixLinesGeo.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(segmentColors, 3),
    );

    const helixLinesMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: initialMobile ? 0.2 : 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const helixLines = new THREE.LineSegments(helixLinesGeo, helixLinesMat);
    worldGroup.add(helixLines);
    disposableGeos.push(helixLinesGeo);
    disposableMats.push(helixLinesMat);

    // Glowing crystal points at strand vertices
    const nodePositions = new Float32Array(STRAND_NODES * 2 * 3);
    const nodeColors = new Float32Array(STRAND_NODES * 2 * 3);
    for (let i = 0; i < STRAND_NODES; i++) {
      const t = i / (STRAND_NODES - 1);
      getScrollTint(t, tempColA);

      const pA = strandA[i];
      const idxA = i * 3;
      nodePositions[idxA] = pA.x;
      nodePositions[idxA + 1] = pA.y;
      nodePositions[idxA + 2] = pA.z;
      nodeColors[idxA] = tempColA.r;
      nodeColors[idxA + 1] = tempColA.g;
      nodeColors[idxA + 2] = tempColA.b;

      const pB = strandB[i];
      const idxB = (STRAND_NODES + i) * 3;
      nodePositions[idxB] = pB.x;
      nodePositions[idxB + 1] = pB.y;
      nodePositions[idxB + 2] = pB.z;
      nodeColors[idxB] = tempColA.r;
      nodeColors[idxB + 1] = tempColA.g;
      nodeColors[idxB + 2] = tempColA.b;
    }

    const nodePointsGeo = new THREE.BufferGeometry();
    nodePointsGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(nodePositions, 3),
    );
    nodePointsGeo.setAttribute(
      "color",
      new THREE.BufferAttribute(nodeColors, 3),
    );

    const nodePointsMat = new THREE.PointsMaterial({
      size: initialMobile ? 0.19 : 0.24,
      map: bokehTex ?? undefined,
      vertexColors: true,
      transparent: true,
      opacity: 0.78,
      alphaTest: 0.02,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const helixNodes = new THREE.Points(nodePointsGeo, nodePointsMat);
    worldGroup.add(helixNodes);
    disposableGeos.push(nodePointsGeo);
    disposableMats.push(nodePointsMat);

    // -------------------------------------------------------------------------
    // 2. POISED ARCHITECTURAL GLASS PRISMS (Framing Top, Mid & Lower Chapters)
    // Staggered diagonally in lateral margins & deep Z so headings stay legible
    // -------------------------------------------------------------------------
    const prismConfigs = [
      {
        x: 5.55,
        y: 1.92,
        z: -2.05,
        radius: 0.8,
        ringR: 1.32,
        edgeColor: 0x38bdf8,
        emissive: 0x0284c7,
        phase: 0.2,
        rotSpeedY: 0.22,
        rotSpeedX: 0.14,
      },
      {
        x: -5.35,
        y: -0.95,
        z: -2.4,
        radius: 0.9,
        ringR: 1.45,
        edgeColor: 0x818cf8,
        emissive: 0x6366f1,
        phase: 2.1,
        rotSpeedY: -0.19,
        rotSpeedX: 0.16,
      },
      {
        x: 5.25,
        y: -3.85,
        z: -2.35,
        radius: 0.84,
        ringR: 1.38,
        edgeColor: 0xc084fc,
        emissive: 0x7c3aed,
        phase: 4.0,
        rotSpeedY: 0.24,
        rotSpeedX: -0.13,
      },
      {
        x: -5.05,
        y: -6.45,
        z: -2.2,
        radius: 0.76,
        ringR: 1.25,
        edgeColor: 0xfbbf24,
        emissive: 0xd97706,
        phase: 5.4,
        rotSpeedY: -0.21,
        rotSpeedX: 0.18,
      },
    ];

    const sharedCoreGeo = new THREE.IcosahedronGeometry(1, 1);
    const sharedCoreEdgesGeo = new THREE.EdgesGeometry(sharedCoreGeo);
    disposableGeos.push(sharedCoreGeo, sharedCoreEdgesGeo);

    const floatingPrisms: FloatingPrism[] = [];

    prismConfigs.forEach((cfg) => {
      const pGroup = new THREE.Group();
      const lateralFactor = initialMobile ? 0.56 : 1;
      const baseX = cfg.x * lateralFactor;
      const baseZ = initialMobile ? cfg.z - 1.2 : cfg.z;

      pGroup.position.set(baseX, cfg.y, baseZ);

      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x111936,
        emissive: cfg.emissive,
        emissiveIntensity: 0.18,
        metalness: 0.2,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        transparent: true,
        opacity: initialMobile ? 0.24 : 0.34,
        depthWrite: false,
      });

      const coreMesh = new THREE.Mesh(sharedCoreGeo, glassMat);
      coreMesh.scale.setScalar(cfg.radius);

      const edgeMat = new THREE.LineBasicMaterial({
        color: cfg.edgeColor,
        transparent: true,
        opacity: initialMobile ? 0.32 : 0.48,
      });
      coreMesh.add(new THREE.LineSegments(sharedCoreEdgesGeo, edgeMat));
      pGroup.add(coreMesh);

      const outerGeo = new THREE.TorusGeometry(cfg.ringR, 0.018, 16, 96);
      const innerGeo = new THREE.TorusGeometry(cfg.ringR * 0.78, 0.014, 16, 80);

      const ringMat = new THREE.MeshPhysicalMaterial({
        color: 0x1e293b,
        emissive: cfg.emissive,
        emissiveIntensity: 0.38,
        metalness: 0.88,
        roughness: 0.18,
        clearcoat: 1.0,
        transparent: true,
        opacity: initialMobile ? 0.45 : 0.72,
      });

      const outerRing = new THREE.Mesh(outerGeo, ringMat);
      outerRing.rotation.set(0.95, 0.45, 0);
      pGroup.add(outerRing);

      const innerRing = new THREE.Mesh(innerGeo, ringMat);
      innerRing.rotation.set(-0.72, 0.85, 0.3);
      pGroup.add(innerRing);

      disposableGeos.push(outerGeo, innerGeo);
      disposableMats.push(glassMat, edgeMat, ringMat);
      worldGroup.add(pGroup);

      floatingPrisms.push({
        group: pGroup,
        core: coreMesh,
        outerRing,
        innerRing,
        baseX,
        baseY: cfg.y,
        baseZ,
        phase: cfg.phase,
        rotSpeedY: cfg.rotSpeedY,
        rotSpeedX: cfg.rotSpeedX,
      });
    });

    // -------------------------------------------------------------------------
    // 3. GRAND SWEPT TORUS-KNOT WAVE ARC (Centered Subtle Background Depth Geometry)
    // -------------------------------------------------------------------------
    const knotGeo = new THREE.TorusKnotGeometry(2.6, 0.48, 160, 20, 2, 3);
    const knotWireMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: initialMobile ? 0.055 : 0.09,
      depthWrite: false,
    });
    const knotMesh = new THREE.Mesh(knotGeo, knotWireMat);
    knotMesh.position.set(0, -2.5, -5.8);
    worldGroup.add(knotMesh);
    disposableGeos.push(knotGeo);
    disposableMats.push(knotWireMat);

    // -------------------------------------------------------------------------
    // 4. DEEP VOLUMETRIC BOKEH STARFIELD
    // -------------------------------------------------------------------------
    const starCount = initialMobile ? 280 : 720;
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
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 24 - 2.2;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 4.5;

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
      opacity: 0.65,
      alphaTest: 0.02,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const starField = new THREE.Points(starGeo, starMat);
    worldGroup.add(starField);
    disposableGeos.push(starGeo);
    disposableMats.push(starMat);

    // -------------------------------------------------------------------------
    // 5. SCROLL SYNCHRONIZATION + POINTER PARALLAX + RESIZE LIFECYCLE
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

    const handlePointerMove = (e: PointerEvent) => {
      pointer.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const updateResponsiveCamera = (w: number, h: number) => {
      const mobile = w < 768;
      camera.aspect = w / h;
      camera.fov = mobile ? 52 : 45;
      camera.position.z = mobile ? 10.6 : 9.4;
      camera.updateProjectionMatrix();
      renderer?.setSize(w, h);

      floatingPrisms.forEach((p, idx) => {
        const cfg = prismConfigs[idx];
        const factor = mobile ? 0.56 : 1;
        p.baseX = cfg.x * factor;
        p.baseZ = mobile ? cfg.z - 1.2 : cfg.z;
      });
    };

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      updateResponsiveCamera(w, h);
      updateScrollTarget();
    };

    updateScrollTarget();
    window.addEventListener("scroll", updateScrollTarget, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    let frameId = 0;
    const startTime = performance.now();

    const renderFrame = () => {
      const elapsed = (performance.now() - startTime) * 0.001;

      pointer.x += (pointer.targetX - pointer.x) * 0.045;
      pointer.y += (pointer.targetY - pointer.y) * 0.045;
      scrollState.progress += (scrollState.target - scrollState.progress) * 0.055;

      const s = scrollState.progress;

      // Subtle cinematic camera pan across the vertical constellation as you scroll
      camera.position.x = pointer.x * 0.36 + Math.sin(s * Math.PI * 2) * 0.25;
      camera.position.y = 0.75 - s * 6.45 + pointer.y * 0.22;
      camera.lookAt(
        pointer.x * 0.12,
        camera.position.y - 0.15,
        -2.6,
      );

      // Slow majestic rotation of the neural constellation helix around the page axis
      helixLines.rotation.y = elapsed * 0.08 + s * 1.1 + pointer.x * 0.08;
      helixNodes.rotation.y = helixLines.rotation.y;

      // Dynamic knot choreography deeper behind frosted glass cards
      knotMesh.rotation.y = elapsed * 0.075 + s * 1.2;
      knotMesh.rotation.x = Math.sin(elapsed * 0.12) * 0.28 + s * 0.65;
      knotMesh.rotation.z = elapsed * 0.04;

      // Floating faceted prisms in page margins
      floatingPrisms.forEach((p) => {
        p.group.position.x = p.baseX + Math.sin(elapsed * 0.45 + p.phase) * 0.16;
        p.group.position.y = p.baseY + Math.cos(elapsed * 0.55 + p.phase) * 0.2;
        p.group.position.z = p.baseZ + Math.sin(elapsed * 0.35 + p.phase) * 0.14;

        p.core.rotation.y = elapsed * p.rotSpeedY + s * 1.4;
        p.core.rotation.x = elapsed * p.rotSpeedX;

        p.outerRing.rotation.z += 0.0042;
        p.outerRing.rotation.y = 0.45 + Math.sin(elapsed * 0.4 + p.phase) * 0.22;
        p.innerRing.rotation.z -= 0.0055;
        p.innerRing.rotation.x = -0.72 + Math.cos(elapsed * 0.38 + p.phase) * 0.22;
      });

      // Gentle atmospheric starfield drift
      starField.rotation.y = elapsed * 0.012 + pointer.x * 0.04;
      starField.rotation.x = pointer.y * 0.028;

      // Scroll-aware spotlight warmth progression (Cyan -> Violet -> Warm Amber)
      cyanAccentLight.intensity = 22 * (1 - s * 0.35);
      violetAccentLight.intensity = 18 + Math.sin(s * Math.PI) * 14;
      amberAccentLight.intensity = 8 + s * 16;

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
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div ref={containerRef} className="h-full w-full" />
      {/* Center readability dusk scrim so typography & glass cards retain razor contrast */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_66%_58%_at_50%_24%,rgba(3,6,20,0.42)_0%,transparent_72%)]" />
    </div>
  );
}
