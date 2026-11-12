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
  grad.addColorStop(0.28, "rgba(224, 242, 254, 0.8)");
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

interface HomeOrbitCluster {
  group: THREE.Group;
  core: THREE.Mesh;
  ringA: THREE.Mesh;
  ringB: THREE.Mesh;
  baseX: number;
  baseY: number;
  baseZ: number;
  phase: number;
  spinY: number;
  spinX: number;
}

export default function ThreeHomeBackdrop() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const container = containerRef.current;
    if (!wrapper || !container) return;

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
    renderer.toneMappingExposure = 1.18;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.pointerEvents = "none";

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.68;

    const camera = new THREE.PerspectiveCamera(46, initialW / initialH, 0.1, 90);
    camera.position.set(0, 0, 10.2);

    // Three-point ambient stage lighting shifting across homepage scroll
    const keyLight = new THREE.DirectionalLight(0xe0f2fe, 2.1);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const cyanLight = new THREE.PointLight(0x38bdf8, 22, 28);
    cyanLight.position.set(4.5, 1.5, 2.5);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight(0x8b5cf6, 24, 30);
    violetLight.position.set(-4.8, -3.2, 2.2);
    scene.add(violetLight);

    const amberLight = new THREE.PointLight(0xfbbf24, 18, 26);
    amberLight.position.set(3.8, -7.2, 2.4);
    scene.add(amberLight);

    const disposableGeos: THREE.BufferGeometry[] = [];
    const disposableMats: THREE.Material[] = [];
    const disposableTextures: THREE.Texture[] = [];

    const bokehTex = createSoftBokehTexture();
    if (bokehTex) disposableTextures.push(bokehTex);

    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // -------------------------------------------------------------------------
    // 1. ARCHITECTURAL KINETIC WAVE MESH (Sweeping Panoramic 3D Horizon Plane)
    // Gives the entire page a live undulating 3D topography behind cards
    // -------------------------------------------------------------------------
    const cols = initialMobile ? 28 : 44;
    const rows = initialMobile ? 18 : 26;
    const waveGeo = new THREE.PlaneGeometry(24, 15, cols, rows);
    waveGeo.rotateX(-Math.PI * 0.41);

    const posAttr = waveGeo.attributes.position as THREE.BufferAttribute;
    const baseWaveCoords = new Float32Array(posAttr.array.length);
    const waveColors = new Float32Array(posAttr.count * 3);

    const colSky = new THREE.Color(0x38bdf8);
    const colIndigo = new THREE.Color(0x6366f1);
    const colPurple = new THREE.Color(0xa855f7);
    const blendColor = new THREE.Color();

    for (let i = 0; i < posAttr.count; i++) {
      baseWaveCoords[i * 3] = posAttr.getX(i);
      baseWaveCoords[i * 3 + 1] = posAttr.getY(i);
      baseWaveCoords[i * 3 + 2] = posAttr.getZ(i);

      const nx = (posAttr.getX(i) + 12) / 24;
      if (nx < 0.5) {
        blendColor.copy(colSky).lerp(colIndigo, nx * 2);
      } else {
        blendColor.copy(colIndigo).lerp(colPurple, (nx - 0.5) * 2);
      }
      waveColors[i * 3] = blendColor.r;
      waveColors[i * 3 + 1] = blendColor.g;
      waveColors[i * 3 + 2] = blendColor.b;
    }

    waveGeo.setAttribute("color", new THREE.BufferAttribute(waveColors, 3));

    const waveMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      wireframe: true,
      transparent: true,
      opacity: initialMobile ? 0.11 : 0.165,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    waveMesh.position.set(0, -2.15, -4.6);
    worldGroup.add(waveMesh);
    disposableGeos.push(waveGeo);
    disposableMats.push(waveMat);

    // -------------------------------------------------------------------------
    // 2. FLOATING ARCHITECTURAL PRISMS & ORBITAL ASTROLABES (Sections 2 -> 6)
    // Placed thoughtfully along lateral gutters and section breaks down the page
    // -------------------------------------------------------------------------
    const clusterDefs = [
      {
        x: -5.45,
        y: -1.4,
        z: -2.5,
        radius: 0.78,
        ringR: 1.32,
        edgeColor: 0x38bdf8,
        emissive: 0x0284c7,
        phase: 0.4,
        spinY: 0.24,
        spinX: 0.14,
      },
      {
        x: 5.5,
        y: -4.15,
        z: -2.4,
        radius: 0.86,
        ringR: 1.44,
        edgeColor: 0x818cf8,
        emissive: 0x6366f1,
        phase: 1.9,
        spinY: -0.2,
        spinX: 0.16,
      },
      {
        x: -5.35,
        y: -7.05,
        z: -2.4,
        radius: 0.82,
        ringR: 1.38,
        edgeColor: 0xc084fc,
        emissive: 0x7c3aed,
        phase: 3.5,
        spinY: 0.22,
        spinX: -0.14,
      },
      {
        x: 5.25,
        y: -9.85,
        z: -2.2,
        radius: 0.76,
        ringR: 1.28,
        edgeColor: 0xfbbf24,
        emissive: 0xd97706,
        phase: 5.1,
        spinY: -0.25,
        spinX: 0.18,
      },
    ];

    const sharedCoreGeo = new THREE.OctahedronGeometry(1, 1);
    const sharedEdgesGeo = new THREE.EdgesGeometry(sharedCoreGeo);
    disposableGeos.push(sharedCoreGeo, sharedEdgesGeo);

    const clusters: HomeOrbitCluster[] = [];

    clusterDefs.forEach((def) => {
      const group = new THREE.Group();
      const lateral = initialMobile ? 0.54 : 1;
      const baseX = def.x * lateral;
      const baseZ = initialMobile ? def.z - 1.4 : def.z;
      group.position.set(baseX, def.y, baseZ);

      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x0f172a,
        emissive: def.emissive,
        emissiveIntensity: 0.22,
        metalness: 0.22,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        transparent: true,
        opacity: initialMobile ? 0.22 : 0.34,
        depthWrite: false,
      });

      const core = new THREE.Mesh(sharedCoreGeo, glassMat);
      core.scale.setScalar(def.radius);

      const edgeMat = new THREE.LineBasicMaterial({
        color: def.edgeColor,
        transparent: true,
        opacity: initialMobile ? 0.34 : 0.52,
      });
      core.add(new THREE.LineSegments(sharedEdgesGeo, edgeMat));
      group.add(core);

      const ringGeoA = new THREE.TorusGeometry(def.ringR, 0.02, 16, 100);
      const ringGeoB = new THREE.TorusGeometry(def.ringR * 0.78, 0.015, 16, 84);
      const ringMat = new THREE.MeshPhysicalMaterial({
        color: 0x1e293b,
        emissive: def.emissive,
        emissiveIntensity: 0.42,
        metalness: 0.88,
        roughness: 0.16,
        clearcoat: 1.0,
        transparent: true,
        opacity: initialMobile ? 0.42 : 0.72,
      });

      const ringA = new THREE.Mesh(ringGeoA, ringMat);
      ringA.rotation.set(1.02, 0.42, 0);
      group.add(ringA);

      const ringB = new THREE.Mesh(ringGeoB, ringMat);
      ringB.rotation.set(-0.74, 0.88, 0.25);
      group.add(ringB);

      disposableGeos.push(ringGeoA, ringGeoB);
      disposableMats.push(glassMat, edgeMat, ringMat);
      worldGroup.add(group);

      clusters.push({
        group,
        core,
        ringA,
        ringB,
        baseX,
        baseY: def.y,
        baseZ,
        phase: def.phase,
        spinY: def.spinY,
        spinX: def.spinX,
      });
    });

    // -------------------------------------------------------------------------
    // 3. GRAND CELESTIAL ASTROLABE RINGS IN DEEP SPACE (Sweeping Continuity)
    // -------------------------------------------------------------------------
    const grandRingsGroup = new THREE.Group();
    grandRingsGroup.position.set(0, -5.6, -6.2);

    const grandRingSpecs = [
      { r: 4.9, tube: 0.02, color: 0x38bdf8, rx: 1.24, ry: 0.36, opacity: 0.24 },
      { r: 6.1, tube: 0.018, color: 0x818cf8, rx: -0.95, ry: -0.45, opacity: 0.2 },
      { r: 7.3, tube: 0.015, color: 0xfbbf24, rx: 0.62, ry: 0.72, opacity: 0.16 },
    ];

    const grandRings: THREE.Mesh[] = [];
    grandRingSpecs.forEach((spec) => {
      const geo = new THREE.TorusGeometry(spec.r, spec.tube, 12, 140);
      const mat = new THREE.MeshBasicMaterial({
        color: spec.color,
        transparent: true,
        opacity: spec.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.set(spec.rx, spec.ry, 0);
      grandRingsGroup.add(mesh);
      grandRings.push(mesh);
      disposableGeos.push(geo);
      disposableMats.push(mat);
    });
    worldGroup.add(grandRingsGroup);

    // -------------------------------------------------------------------------
    // 4. VOLUMETRIC DEPTH STARFIELD & CONSTELLATION NODES
    // -------------------------------------------------------------------------
    const starCount = initialMobile ? 280 : 760;
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const palette = [
      new THREE.Color(0x7dd3fc),
      new THREE.Color(0xc4b5fd),
      new THREE.Color(0x93c5fd),
      new THREE.Color(0xfde68a),
      new THREE.Color(0xf8fafc),
    ];

    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 28;
      starPos[i * 3 + 1] = -Math.random() * 18 + 2.5;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 4.2;

      const c = palette[i % palette.length];
      starColors[i * 3] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: initialMobile ? 0.115 : 0.11,
      map: bokehTex ?? undefined,
      vertexColors: true,
      transparent: true,
      opacity: 0.72,
      alphaTest: 0.02,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(starGeo, starMat);
    worldGroup.add(starField);
    disposableGeos.push(starGeo);
    disposableMats.push(starMat);

    // -------------------------------------------------------------------------
    // 5. SCROLL-LINKED FADE & CAMERA CHOREOGRAPHY
    // Smoothly transitions from subtle ambient behind Hero -> full 3D canvas
    // across Sections 2..6 (never clashing with ThreeHeroScene at scrollY=0)
    // -------------------------------------------------------------------------
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const scrollState = { progress: 0, target: 0, fadeTarget: 0, fade: 0 };

    const updateScrollState = () => {
      const vh = window.innerHeight || 800;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - vh,
      );
      const y = window.scrollY;
      scrollState.target = Math.max(0, Math.min(1, y / maxScroll));

      // Fade in smoothly as the visitor scrolls past the upper Hero fold
      const rampStart = vh * 0.18;
      const rampEnd = vh * 0.78;
      const rawFade = (y - rampStart) / Math.max(1, rampEnd - rampStart);
      scrollState.fadeTarget = Math.max(0, Math.min(1, rawFade));
    };

    const handlePointerMove = (e: PointerEvent) => {
      pointer.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const updateCameraSizing = (w: number, h: number) => {
      const mobile = w < 768;
      camera.aspect = w / h;
      camera.fov = mobile ? 52 : 46;
      camera.position.z = mobile ? 11.4 : 10.2;
      camera.updateProjectionMatrix();
      renderer?.setSize(w, h);

      clusters.forEach((c, idx) => {
        const def = clusterDefs[idx];
        const lateral = mobile ? 0.54 : 1;
        c.baseX = def.x * lateral;
        c.baseZ = mobile ? def.z - 1.4 : def.z;
      });
    };

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      updateCameraSizing(w, h);
      updateScrollState();
    };

    updateScrollState();
    scrollState.fade = scrollState.fadeTarget;
    wrapper.style.opacity = String(scrollState.fade);

    window.addEventListener("scroll", updateScrollState, { passive: true });
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
      scrollState.fade += (scrollState.fadeTarget - scrollState.fade) * 0.08;

      wrapper.style.opacity = scrollState.fade.toFixed(3);

      if (scrollState.fade > 0.01) {
        const s = scrollState.progress;

        // Glide camera smoothly down alongside homepage Sections 1 -> 6
        const camY = -0.35 - s * 10.2 + pointer.y * 0.24;
        camera.position.x = pointer.x * 0.42 + Math.sin(s * Math.PI * 1.6) * 0.28;
        camera.position.y = camY;
        camera.lookAt(pointer.x * 0.14, camY - 0.18, -2.8);

        // Animate panoramic kinetic wave mesh following the lower camera frame
        waveMesh.position.y = camY - 2.35;
        const arr = posAttr.array as Float32Array;
        for (let i = 0; i < posAttr.count; i++) {
          const bx = baseWaveCoords[i * 3];
          const bz = baseWaveCoords[i * 3 + 2];
          const elevation =
            Math.sin(bx * 0.34 + elapsed * 0.65) * 0.42 +
            Math.cos(bz * 0.42 + elapsed * 0.52) * 0.36;
          arr[i * 3 + 1] = baseWaveCoords[i * 3 + 1] + elevation;
        }
        posAttr.needsUpdate = true;

        // Astrolabe clusters framing margins & refracting behind cards
        clusters.forEach((c) => {
          c.group.position.x = c.baseX + Math.sin(elapsed * 0.45 + c.phase) * 0.18;
          c.group.position.y = c.baseY + Math.cos(elapsed * 0.55 + c.phase) * 0.22;
          c.group.position.z = c.baseZ + Math.sin(elapsed * 0.35 + c.phase) * 0.14;

          c.core.rotation.y = elapsed * c.spinY + s * 1.4;
          c.core.rotation.x = elapsed * c.spinX;

          c.ringA.rotation.z += 0.0044;
          c.ringA.rotation.y = 0.42 + Math.sin(elapsed * 0.4 + c.phase) * 0.22;
          c.ringB.rotation.z -= 0.0052;
          c.ringB.rotation.x = -0.74 + Math.cos(elapsed * 0.36 + c.phase) * 0.22;
        });

        // Slow grand orbital astrolabe arcs centered in deep background
        grandRingsGroup.position.y = camY - 0.3;
        grandRings.forEach((ring, idx) => {
          ring.rotation.z = elapsed * (idx % 2 === 0 ? 0.065 : -0.05) + s * 0.6;
          ring.rotation.y += (idx % 2 === 0 ? 1 : -1) * 0.0008;
        });

        starField.rotation.y = elapsed * 0.012 + pointer.x * 0.035;
        starField.rotation.x = pointer.y * 0.025;

        // Dynamic lighting warmth curve from Section 2 (Cyan) -> 4 (Violet) -> 6 (Amber)
        cyanLight.position.y = camY + 1.4;
        violetLight.position.y = camY - 1.2;
        amberLight.position.y = camY - 2.6;
        cyanLight.intensity = 22 * (1 - s * 0.3);
        violetLight.intensity = 18 + Math.sin(s * Math.PI) * 14;
        amberLight.intensity = 10 + s * 16;

        renderer?.render(scene, camera);
      }

      if (!prefersReducedMotion) {
        frameId = window.requestAnimationFrame(renderFrame);
      }
    };

    if (prefersReducedMotion) {
      renderFrame();
    } else {
      frameId = window.requestAnimationFrame(renderFrame);
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateScrollState);
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
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-0"
    >
      <div ref={containerRef} className="h-full w-full" />
      {/* Subtle center vignette preserving razor-sharp contrast behind memory photos and section titles */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_68%_60%_at_50%_46%,rgba(3,6,20,0.44)_0%,transparent_76%)]" />
    </div>
  );
}
