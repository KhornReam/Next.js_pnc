"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export interface ThreeHeroSceneProps {
  activeChapter?: 0 | 1 | 2;
}

const CHAPTER_THEMES = [
  {
    name: "Foundation",
    rimA: 0x38bdf8,
    rimB: 0x2563eb,
    edge: 0xbae6fd,
    rimLight: 0x38bdf8,
    halo: 0x38bdf8,
    accentNode: 0x38bdf8,
  },
  {
    name: "Growth",
    rimA: 0xa855f7,
    rimB: 0x6366f1,
    edge: 0xe9d5ff,
    rimLight: 0xa855f7,
    halo: 0x8b5cf6,
    accentNode: 0xc084fc,
  },
  {
    name: "Future",
    rimA: 0xfbbf24,
    rimB: 0xd97706,
    edge: 0xfef08a,
    rimLight: 0xf59e0b,
    halo: 0xfbbf24,
    accentNode: 0xfde047,
  },
] as const;

function createBokehTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const grad = ctx.createRadialGradient(64, 64, 1, 64, 64, 62);
  grad.addColorStop(0, "rgba(255, 255, 255, 1)");
  grad.addColorStop(0.22, "rgba(224, 242, 254, 0.85)");
  grad.addColorStop(0.55, "rgba(99, 102, 241, 0.28)");
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

function createFlareTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
  grad.addColorStop(0, "rgba(255, 255, 255, 1)");
  grad.addColorStop(0.35, "rgba(186, 230, 253, 0.7)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.clearRect(0, 0, 64, 64);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(32, 32, 30, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function ThreeHeroScene({
  activeChapter = 0,
}: ThreeHeroSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeChapterRef = useRef<0 | 1 | 2>(activeChapter);
  const pulseTriggerRef = useRef(0);

  useEffect(() => {
    if (activeChapterRef.current !== activeChapter) {
      activeChapterRef.current = activeChapter;
      pulseTriggerRef.current = 1;
    }
  }, [activeChapter]);

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
    const isInitialMobile = initialW < 1024;

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, isInitialMobile ? 1.35 : 2),
    );
    renderer.setSize(initialW, initialH);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.24;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "pan-y";

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // High dynamic range studio environment for rich, real-world metallic reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 1.12;

    const camera = new THREE.PerspectiveCamera(
      42,
      initialW / initialH,
      0.1,
      100,
    );

    // Multi-point studio lighting calibrated to real-world industrial 3D standards
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
    keyLight.position.set(6, 8, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x6366f1, 1.0);
    fillLight.position.set(-6, -3, 4);
    scene.add(fillLight);

    const rimBacklight = new THREE.DirectionalLight(0x38bdf8, 2.6);
    rimBacklight.position.set(0, 5, -6);
    scene.add(rimBacklight);

    // Accent point lights matching the 3 orbital rings
    const cyanPointLight = new THREE.PointLight(0x38bdf8, 22, 14);
    cyanPointLight.position.set(-2.8, 1.8, 2.4);
    scene.add(cyanPointLight);

    const violetPointLight = new THREE.PointLight(0xa855f7, 24, 14);
    violetPointLight.position.set(1.4, -1.2, 2.8);
    scene.add(violetPointLight);

    const amberPointLight = new THREE.PointLight(0xf59e0b, 18, 14);
    amberPointLight.position.set(-1.2, 3.2, 1.8);
    scene.add(amberPointLight);

    const disposableGeos: THREE.BufferGeometry[] = [];
    const disposableMats: THREE.Material[] = [];
    const disposableTextures: THREE.Texture[] = [];

    const bokehTex = createBokehTexture();
    if (bokehTex) disposableTextures.push(bokehTex);

    const flareTex = createFlareTexture();
    if (flareTex) disposableTextures.push(flareTex);

    const layoutTarget = {
      baseX: 2.6,
      baseY: 0.16,
      scale: 0.96,
      isMobile: isInitialMobile,
    };

    const updateHeroLayout = (w: number, h: number) => {
      const mobile = w < 1024;
      layoutTarget.isMobile = mobile;

      camera.aspect = w / h;
      camera.position.z = mobile ? 9.6 : 8.2;
      camera.updateProjectionMatrix();
      renderer?.setSize(w, h);

      const halfH =
        Math.tan(((camera.fov * Math.PI) / 180) * 0.5) * camera.position.z;
      const halfW = halfH * camera.aspect;

      if (mobile) {
        layoutTarget.baseX = 0;
        layoutTarget.baseY = 1.05;
        layoutTarget.scale = Math.min(0.84, Math.max(0.56, halfW / 3.4));
      } else {
        const rightCenter = halfW * 0.52;
        const maxAllowedRadius = Math.max(1.5, halfW * 0.44);
        const targetScale = Math.min(
          1.02,
          Math.max(0.7, maxAllowedRadius / 2.36),
        );
        layoutTarget.baseX = Math.max(rightCenter, maxAllowedRadius + 0.22);
        layoutTarget.baseY = 0.18;
        layoutTarget.scale = targetScale;
      }
    };

    // Master hero sculpture container
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    updateHeroLayout(initialW, initialH);
    heroGroup.position.set(layoutTarget.baseX, layoutTarget.baseY, 0);
    heroGroup.scale.setScalar(layoutTarget.scale);

    // -------------------------------------------------------------------------
    // 1. REALISTIC CORE SPHERE: Obsidian Body + Atmospheric Rayleigh Rim Glow
    // -------------------------------------------------------------------------
    const coreGeo = new THREE.SphereGeometry(0.98, 64, 64);
    const coreShaderMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPulse: { value: 0 },
        uInnerColor: { value: new THREE.Color(0x040714) },
        uRimColorA: { value: new THREE.Color(CHAPTER_THEMES[0].rimA) },
        uRimColorB: { value: new THREE.Color(CHAPTER_THEMES[0].rimB) },
        uLightDir: { value: new THREE.Vector3(0.6, 0.8, 0.6).normalize() },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec3 vLocalPos;
        varying vec3 vWorldNormal;
        void main() {
          vLocalPos = position;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
          vViewDir = normalize(-mvPosition.xyz);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uPulse;
        uniform vec3 uInnerColor;
        uniform vec3 uRimColorA;
        uniform vec3 uRimColorB;
        uniform vec3 uLightDir;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec3 vLocalPos;
        varying vec3 vWorldNormal;

        void main() {
          vec3 n = normalize(vNormal);
          vec3 v = normalize(vViewDir);
          float ndotv = clamp(dot(n, v), 0.0, 1.0);

          // Physical Rayleigh atmospheric rim scattering
          float atmosphericFresnel = pow(1.0 - ndotv, 2.85);

          // Subtle animated telemetry latitude lines
          float latWave = sin(vLocalPos.y * 32.0 - uTime * 1.2 + vLocalPos.x * 2.5);
          float latGlow = smoothstep(0.85, 1.0, latWave) * (1.0 - ndotv) * 0.18;

          // Studio directional specular sheen on dark sphere
          vec3 halfVec = normalize(uLightDir + v);
          float ndoth = max(0.0, dot(n, halfVec));
          float specular = pow(ndoth, 48.0) * 0.42;

          // Smooth planetary gradient from deep azure to violet
          float wave = 0.5 + 0.5 * sin(vLocalPos.y * 4.2 - uTime * 1.4 + vLocalPos.z * 3.0);
          vec3 rimGrad = mix(uRimColorA, uRimColorB, wave);

          // Layer atmospheric haze
          float rimIntensity = atmosphericFresnel * (1.35 + uPulse * 0.45);
          vec3 finalAtmosphere = mix(uInnerColor, rimGrad, clamp(rimIntensity + latGlow, 0.0, 1.0));
          finalAtmosphere += vec3(specular) * vec3(0.85, 0.92, 1.0);

          gl_FragColor = vec4(finalAtmosphere, 1.0);
        }
      `,
    });
    const coreSphere = new THREE.Mesh(coreGeo, coreShaderMat);
    heroGroup.add(coreSphere);
    disposableGeos.push(coreGeo);
    disposableMats.push(coreShaderMat);

    // Atmospheric outer planetary corona sprite
    const haloMat = new THREE.SpriteMaterial({
      map: bokehTex ?? undefined,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const coreHalo = new THREE.Sprite(haloMat);
    coreHalo.scale.set(4.2, 4.2, 1);
    heroGroup.add(coreHalo);
    disposableMats.push(haloMat);

    // -------------------------------------------------------------------------
    // 2. GEODESIC ARCHITECTURAL CAGE: Faceted Glass + Crisp White/Cyan Filigree
    // -------------------------------------------------------------------------
    // Subdivided icosahedron (320 triangular facets) matching reference density
    const shellGeo = new THREE.IcosahedronGeometry(1.35, 2);

    const shellGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      emissive: 0x1e1b4b,
      emissiveIntensity: 0.12,
      metalness: 0.1,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.95,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const shellMesh = new THREE.Mesh(shellGeo, shellGlassMat);
    heroGroup.add(shellMesh);

    // Delicate structural wireframe filaments
    const shellEdgesGeo = new THREE.EdgesGeometry(shellGeo);
    const shellEdgesMat = new THREE.LineBasicMaterial({
      color: 0xbae6fd,
      transparent: true,
      opacity: 0.62,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const shellEdges = new THREE.LineSegments(shellEdgesGeo, shellEdgesMat);
    shellMesh.add(shellEdges);

    // Micro-connector rivets at lattice vertices
    const shellPointsMat = new THREE.PointsMaterial({
      size: 0.042,
      color: 0xf0f9ff,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const shellPoints = new THREE.Points(shellGeo, shellPointsMat);
    shellMesh.add(shellPoints);

    disposableGeos.push(shellGeo, shellEdgesGeo);
    disposableMats.push(shellGlassMat, shellEdgesMat, shellPointsMat);

    // -------------------------------------------------------------------------
    // 3. THREE PRECISION ORBITAL RINGS & DYNAMIC ORBITING DATA NODES
    // Exactly matches the SAP scale and 3 distinct colors in reference image:
    // Outer: Polished Copper/Bronze | Middle: Electric Cyan | Inner: Neon Violet
    // -------------------------------------------------------------------------
    interface RingItem {
      group: THREE.Group;
      radius: number;
      nodes: {
        mesh: THREE.Mesh;
        speed: number;
        phase: number;
        flare?: THREE.Sprite;
      }[];
      torusMesh: THREE.Mesh;
      torusMat: THREE.MeshPhysicalMaterial;
      baseRotX: number;
      baseRotY: number;
      baseRotZ: number;
      precessionSpeedX: number;
      precessionSpeedY: number;
      precessionSpeedZ: number;
    }

    const ringNodeGeo = new RoundedBoxGeometry(0.12, 0.12, 0.12, 3, 0.026);
    disposableGeos.push(ringNodeGeo);

    const ringConfigs = [
      // Ring 0: Inner Royal Neon Violet (passes across front of core sphere)
      {
        radius: 1.62,
        tube: 0.024,
        color: 0x6d28d9,
        emissive: 0x7c3aed,
        emissiveIntensity: 0.42,
        accentColor: 0xe879f9,
        flareColor: 0xd946ef,
        rotX: 0.58,
        rotY: -0.92,
        rotZ: 0.42,
        speedX: 0.08,
        speedY: 0.28,
        speedZ: -0.22,
        nodes: [{ speed: 0.35, phase: 0.65, size: 1.0 }],
      },
      // Ring 1: Middle Electric Sky Blue / Cyan (wide inclined ellipse)
      {
        radius: 1.94,
        tube: 0.026,
        color: 0x0284c7,
        emissive: 0x0284c7,
        emissiveIntensity: 0.38,
        accentColor: 0x38bdf8,
        flareColor: 0x38bdf8,
        rotX: -0.72,
        rotY: 0.84,
        rotZ: -0.24,
        speedX: 0.24,
        speedY: -0.26,
        speedZ: 0.28,
        nodes: [
          { speed: -0.28, phase: 2.1, size: 0.95 },
          { speed: -0.28, phase: 5.2, size: 0.95 },
        ],
      },
      // Ring 2: Outer Polished Bronze / Copper (high diagonal sweep)
      {
        radius: 2.26,
        tube: 0.022,
        color: 0xb45309,
        emissive: 0x9a3412,
        emissiveIntensity: 0.32,
        accentColor: 0xfbbf24,
        flareColor: 0xf59e0b,
        rotX: 1.14,
        rotY: 0.46,
        rotZ: 0.16,
        speedX: -0.14,
        speedY: 0.22,
        speedZ: 0.24,
        nodes: [{ speed: 0.24, phase: 1.4, size: 1.08 }],
      },
    ];

    const ringItems: RingItem[] = [];

    ringConfigs.forEach((cfg) => {
      const rGroup = new THREE.Group();
      rGroup.rotation.set(cfg.rotX, cfg.rotY, cfg.rotZ);

      // Precision machined metallic torus
      const torusGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 28, 160);
      const torusMat = new THREE.MeshPhysicalMaterial({
        color: cfg.color,
        emissive: cfg.emissive,
        emissiveIntensity: cfg.emissiveIntensity,
        metalness: 0.96,
        roughness: 0.12,
        clearcoat: 1.0,
        clearcoatRoughness: 0.06,
      });
      const torusMesh = new THREE.Mesh(torusGeo, torusMat);
      rGroup.add(torusMesh);
      disposableGeos.push(torusGeo);
      disposableMats.push(torusMat);

      // Luminous rounded cube nodes orbiting along the ring track
      const ringNodeList: RingItem["nodes"] = [];

      cfg.nodes.forEach((nCfg) => {
        const nodeMat = new THREE.MeshStandardMaterial({
          color: cfg.accentColor,
          emissive: cfg.accentColor,
          emissiveIntensity: 1.45,
          metalness: 0.35,
          roughness: 0.14,
        });
        const nodeMesh = new THREE.Mesh(ringNodeGeo, nodeMat);
        nodeMesh.scale.setScalar(nCfg.size);
        disposableMats.push(nodeMat);

        // Soft optical flare sprite attached to each node
        const flareMat = new THREE.SpriteMaterial({
          map: flareTex ?? undefined,
          color: cfg.flareColor,
          transparent: true,
          opacity: 0.65,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const flareSprite = new THREE.Sprite(flareMat);
        flareSprite.scale.set(0.68, 0.68, 1);
        nodeMesh.add(flareSprite);
        disposableMats.push(flareMat);

        rGroup.add(nodeMesh);
        ringNodeList.push({
          mesh: nodeMesh,
          speed: nCfg.speed,
          phase: nCfg.phase,
          flare: flareSprite,
        });
      });

      heroGroup.add(rGroup);
      ringItems.push({
        group: rGroup,
        radius: cfg.radius,
        nodes: ringNodeList,
        torusMesh,
        torusMat,
        baseRotX: cfg.rotX,
        baseRotY: cfg.rotY,
        baseRotZ: cfg.rotZ,
        precessionSpeedX: cfg.speedX,
        precessionSpeedY: cfg.speedY,
        precessionSpeedZ: cfg.speedZ,
      });
    });

    // -------------------------------------------------------------------------
    // 4. FLOATING CRYSTALLINE DIAMOND SATELLITES (Exact Reference Placement)
    // -------------------------------------------------------------------------
    const crystalPlacements = [
      { x: -2.35, y: 2.15, z: -0.6, scale: 0.95, speed: 0.42, geoType: "octa" },
      { x: -0.65, y: 1.95, z: -1.2, scale: 0.72, speed: 0.35, geoType: "octa" },
      { x: 2.45, y: 1.35, z: -0.75, scale: 0.9, speed: -0.38, geoType: "octa" },
      { x: -2.65, y: -0.25, z: 0.45, scale: 0.82, speed: 0.4, geoType: "octa" },
      { x: 2.25, y: -1.45, z: -0.5, scale: 0.88, speed: -0.44, geoType: "octa" },
      { x: -1.45, y: -2.1, z: 0.85, scale: 0.8, speed: 0.36, geoType: "octa" },
    ];

    const crystalSharedGeo = new THREE.OctahedronGeometry(0.16, 0);
    const crystalSharedEdges = new THREE.EdgesGeometry(crystalSharedGeo);
    disposableGeos.push(crystalSharedGeo, crystalSharedEdges);

    const satellites: {
      group: THREE.Group;
      baseX: number;
      baseY: number;
      baseZ: number;
      rotSpeedX: number;
      rotSpeedY: number;
      orbitSpeed: number;
      phase: number;
    }[] = [];

    crystalPlacements.forEach((cp, idx) => {
      const cGroup = new THREE.Group();
      cGroup.position.set(cp.x, cp.y, cp.z);
      cGroup.scale.setScalar(cp.scale);

      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x1e1b4b,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.35,
        metalness: 0.82,
        roughness: 0.08,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.65,
      });

      const edgeMat = new THREE.LineBasicMaterial({
        color: 0xe0f2fe,
        transparent: true,
        opacity: 0.82,
      });

      const mesh = new THREE.Mesh(crystalSharedGeo, glassMat);
      mesh.add(new THREE.LineSegments(crystalSharedEdges, edgeMat));
      cGroup.add(mesh);

      disposableMats.push(glassMat, edgeMat);
      heroGroup.add(cGroup);

      satellites.push({
        group: cGroup,
        baseX: cp.x,
        baseY: cp.y,
        baseZ: cp.z,
        rotSpeedX: 0.5 + (idx % 3) * 0.25,
        rotSpeedY: 0.7 + (idx % 2) * 0.3,
        orbitSpeed: cp.speed,
        phase: idx * 1.05,
      });
    });

    // -------------------------------------------------------------------------
    // 5. VOLUMETRIC BOKEH DEPTH STARFIELD
    // -------------------------------------------------------------------------
    const starCount = isInitialMobile ? 240 : 640;
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const palette = [
      new THREE.Color(0x7dd3fc),
      new THREE.Color(0xc4b5fd),
      new THREE.Color(0x93c5fd),
      new THREE.Color(0xf8fafc),
    ];

    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 24;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 3;

      const c = palette[i % palette.length];
      starColors[i * 3] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: isInitialMobile ? 0.12 : 0.105,
      map: bokehTex ?? undefined,
      vertexColors: true,
      transparent: true,
      opacity: 0.72,
      alphaTest: 0.02,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);
    disposableGeos.push(starGeo);
    disposableMats.push(starMat);

    // -------------------------------------------------------------------------
    // 6. INTERACTIVE DRAG-TO-ORBIT INERTIA + POINTER PARALLAX
    // -------------------------------------------------------------------------
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const dragState = {
      isDragging: false,
      lastX: 0,
      lastY: 0,
      rotY: 0,
      rotX: 0,
      velY: 0,
      velX: 0,
    };

    const canvasEl = renderer.domElement;

    const handleWindowPointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      pointer.targetX = nx;
      pointer.targetY = ny;

      if (dragState.isDragging) {
        const dx = e.clientX - dragState.lastX;
        const dy = e.clientY - dragState.lastY;
        dragState.lastX = e.clientX;
        dragState.lastY = e.clientY;
        dragState.velY = dx * 0.0075;
        dragState.velX = dy * 0.0055;
        dragState.rotY += dragState.velY;
        dragState.rotX = Math.max(
          -0.85,
          Math.min(0.85, dragState.rotX + dragState.velX),
        );
      }
    };

    const handleCanvasPointerDown = (e: PointerEvent) => {
      dragState.isDragging = true;
      dragState.lastX = e.clientX;
      dragState.lastY = e.clientY;
      canvasEl.style.cursor = "grabbing";
    };

    const handleWindowPointerUp = () => {
      if (dragState.isDragging) {
        dragState.isDragging = false;
        canvasEl.style.cursor = "grab";
      }
    };

    canvasEl.style.cursor = "grab";
    canvasEl.addEventListener("pointerdown", handleCanvasPointerDown);
    window.addEventListener("pointermove", handleWindowPointerMove, {
      passive: true,
    });
    window.addEventListener("pointerup", handleWindowPointerUp);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      updateHeroLayout(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    const targetRimA = new THREE.Color();
    const targetRimB = new THREE.Color();
    const targetEdgeCol = new THREE.Color();
    const targetLightCol = new THREE.Color();
    const targetHaloCol = new THREE.Color();

    let frameId = 0;
    let isHeroVisible = true;
    const startTime = performance.now();

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isHeroVisible = entry.isIntersecting;
      },
      { rootMargin: "160px" },
    );
    visibilityObserver.observe(container);

    const renderFrame = () => {
      if (isHeroVisible) {
        const elapsed = (performance.now() - startTime) * 0.001;
        const theme =
          CHAPTER_THEMES[activeChapterRef.current] ?? CHAPTER_THEMES[0];

        pointer.x += (pointer.targetX - pointer.x) * 0.05;
        pointer.y += (pointer.targetY - pointer.y) * 0.05;

        // Smooth energy pulse wave on stage switch
        pulseTriggerRef.current *= 0.945;
        const pulse = pulseTriggerRef.current;

        // Smooth color morphing toward active chapter
        targetRimA.setHex(theme.rimA);
        targetRimB.setHex(theme.rimB);
        targetEdgeCol.setHex(theme.edge);
        targetLightCol.setHex(theme.rimLight);
        targetHaloCol.setHex(theme.halo);

        coreShaderMat.uniforms.uTime.value = elapsed;
        coreShaderMat.uniforms.uPulse.value = pulse;
        coreShaderMat.uniforms.uRimColorA.value.lerp(targetRimA, 0.045);
        coreShaderMat.uniforms.uRimColorB.value.lerp(targetRimB, 0.045);
        shellEdgesMat.color.lerp(targetEdgeCol, 0.045);
        cyanPointLight.color.lerp(targetLightCol, 0.045);
        haloMat.color.lerp(targetHaloCol, 0.045);

        // Inertial drag momentum damping
        if (!dragState.isDragging) {
          dragState.rotY += dragState.velY;
          dragState.rotX = Math.max(
            -0.85,
            Math.min(0.85, dragState.rotX + dragState.velX),
          );
          dragState.velY *= 0.935;
          dragState.velX *= 0.935;
        }

        // Camera breathing & parallax tracking
        camera.position.x += (pointer.x * 0.22 - camera.position.x) * 0.04;
        camera.position.y +=
          (0.12 +
            pointer.y * 0.15 +
            Math.sin(elapsed * 0.45) * 0.07 -
            camera.position.y) *
          0.04;

        // Smooth non-overlapping sculpture placement + natural hovering bob
        heroGroup.position.x +=
          (layoutTarget.baseX - heroGroup.position.x) * 0.08;
        const bobY = layoutTarget.baseY + Math.sin(elapsed * 0.85) * 0.09;
        heroGroup.position.y += (bobY - heroGroup.position.y) * 0.08;

        const breathScale =
          layoutTarget.scale *
          (1 + Math.sin(elapsed * 1.05) * 0.012 + pulse * 0.04);
        heroGroup.scale.setScalar(
          heroGroup.scale.x + (breathScale - heroGroup.scale.x) * 0.09,
        );

        // Slow master celestial precession
        heroGroup.rotation.y =
          elapsed * 0.12 + pointer.x * 0.2 + dragState.rotY;
        heroGroup.rotation.x =
          Math.sin(elapsed * 0.24) * 0.07 - pointer.y * 0.14 + dragState.rotX;

        // Counter-rotation of geodesic cage and micro-energy pulse
        shellMesh.rotation.y = -elapsed * 0.16;
        shellMesh.rotation.z = elapsed * 0.09;
        const shellPulse = 1 + pulse * 0.05;
        shellMesh.scale.setScalar(shellPulse);

        // Dynamic halo breathing
        const haloScale = 4.2 + Math.sin(elapsed * 1.2) * 0.22 + pulse * 0.65;
        coreHalo.scale.set(haloScale, haloScale, 1);
        haloMat.opacity = 0.38 + pulse * 0.16;

        // Multi-axis gyroscopic precession of rings and smooth orbital node motion
        const pulseBoost = 1 + pulse * 1.8;
        ringItems.forEach((item, idx) => {
          item.group.rotation.z =
            item.baseRotZ +
            elapsed * item.precessionSpeedZ * 0.07 * pulseBoost;
          item.group.rotation.y =
            item.baseRotY +
            elapsed * item.precessionSpeedY * 0.22 +
            Math.sin(elapsed * 0.4 + idx) * 0.06;
          item.group.rotation.x =
            item.baseRotX + Math.cos(elapsed * 0.35 + idx) * 0.06;

          // Orbiting data nodes gliding along the circular perimeter
          item.nodes.forEach((n) => {
            const angle = elapsed * n.speed * pulseBoost + n.phase;
            n.mesh.position.set(
              Math.cos(angle) * item.radius,
              Math.sin(angle) * item.radius,
              0,
            );
            n.mesh.rotation.z = angle + Math.PI / 2;

            if (n.flare) {
              const flarePulse = 0.68 + Math.sin(elapsed * 3.0 + idx) * 0.12;
              n.flare.scale.set(flarePulse, flarePulse, 1);
            }
          });
        });

        // Floating crystalline satellites drifting in microgravity
        satellites.forEach((sat, idx) => {
          const theta = elapsed * sat.orbitSpeed * 0.3 + sat.phase;
          sat.group.position.x = sat.baseX + Math.sin(theta) * 0.16;
          sat.group.position.y = sat.baseY + Math.cos(theta * 1.2) * 0.18;
          sat.group.position.z = sat.baseZ + Math.sin(theta * 0.8) * 0.12;

          sat.group.rotation.x = elapsed * sat.rotSpeedX + idx;
          sat.group.rotation.y = elapsed * sat.rotSpeedY;
          sat.group.rotation.z = Math.sin(elapsed * 0.5 + idx) * 0.25;
        });

        starField.rotation.y = elapsed * 0.012 + pointer.x * 0.035;
        starField.rotation.x = pointer.y * 0.025;

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
      visibilityObserver.disconnect();
      canvasEl.removeEventListener("pointerdown", handleCanvasPointerDown);
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
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
    <div className="pointer-events-auto absolute inset-0 h-full w-full overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none animate-pulse-slow absolute right-[8%] top-[18%] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.16)_0%,transparent_70%)]"
      />
      <div ref={containerRef} className="relative h-full w-full" />
    </div>
  );
}
