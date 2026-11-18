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
    floorPrimary: 0x38bdf8,
    floorSecondary: 0x6366f1,
    auroraA: 0x1d4ed8,
    auroraB: 0x0ea5e9,
  },
  {
    name: "Growth",
    rimA: 0xa855f7,
    rimB: 0x6366f1,
    edge: 0xe9d5ff,
    rimLight: 0xa855f7,
    halo: 0x8b5cf6,
    accentNode: 0xc084fc,
    floorPrimary: 0xa855f7,
    floorSecondary: 0x38bdf8,
    auroraA: 0x6d28d9,
    auroraB: 0x38bdf8,
  },
  {
    name: "Future",
    rimA: 0xfbbf24,
    rimB: 0xd97706,
    edge: 0xfef08a,
    rimLight: 0xf59e0b,
    halo: 0xfbbf24,
    accentNode: 0xfde047,
    floorPrimary: 0xf59e0b,
    floorSecondary: 0x38bdf8,
    auroraA: 0xb45309,
    auroraB: 0x4f46e5,
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
    renderer.domElement.style.opacity = "0";
    renderer.domElement.style.transition = "opacity 600ms ease";

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
      110,
    );

    // Multi-point studio lighting calibrated to real-world industrial 3D standards
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
    keyLight.position.set(6, 8, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x6366f1, 1.05);
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

    // =========================================================================
    // FULL-VIEWPORT ARCHITECTURAL 3D BACKGROUND ENVIRONMENT
    // =========================================================================
    const envGroup = new THREE.Group();
    scene.add(envGroup);

    // -------------------------------------------------------------------------
    // BG 1. VOLUMETRIC 3D ATMOSPHERIC AURORA & STUDIO DEPTH SHADER BACKDROP
    // -------------------------------------------------------------------------
    const auroraGeo = new THREE.PlaneGeometry(48, 28);
    const auroraMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPulse: { value: 0 },
        uColorA: { value: new THREE.Color(CHAPTER_THEMES[0].auroraA) },
        uColorB: { value: new THREE.Color(CHAPTER_THEMES[0].auroraB) },
        uPointer: { value: new THREE.Vector2(0, 0) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uPulse;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec2 uPointer;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;
          vec2 p = uv * 2.0 - 1.0;

          // Flowing silky 3D atmospheric curtains across the full horizon
          float ribbon1 = sin(p.x * 2.4 + uTime * 0.24 + sin(p.y * 2.1 - uTime * 0.18) * 1.15);
          float band1 = exp(-pow((p.y - 0.12 - ribbon1 * 0.26) * 3.1, 2.0));

          float ribbon2 = cos(p.x * 1.85 - uTime * 0.19 + sin(p.x * 1.3 + p.y * 1.6) * 0.85);
          float band2 = exp(-pow((p.y + 0.34 - ribbon2 * 0.22) * 3.4, 2.0));

          // Soft ambient volumetric light shaft behind hero right & upper-left
          float rightGlow = exp(-length((p - vec2(0.45 + uPointer.x * 0.06, 0.04 + uPointer.y * 0.04)) * vec2(1.15, 1.55)) * 2.0);
          float leftDepthGlow = exp(-length((p - vec2(-0.58 - uPointer.x * 0.04, 0.26)) * vec2(1.0, 1.45)) * 2.2);

          vec3 col = uColorA * (band1 * 0.34 + leftDepthGlow * 0.26)
                   + uColorB * (band2 * 0.28 + rightGlow * (0.36 + uPulse * 0.16));

          // Smooth outer vignette fade
          float edgeFade = smoothstep(1.25, 0.2, length(p * vec2(0.85, 1.05)));
          float alpha = clamp((band1 * 0.28 + band2 * 0.22 + rightGlow * 0.32 + leftDepthGlow * 0.22) * edgeFade, 0.0, 0.42);

          gl_FragColor = vec4(col, alpha);
        }
      `,
    });
    const auroraBackdrop = new THREE.Mesh(auroraGeo, auroraMat);
    auroraBackdrop.position.set(0, 0.6, -15.5);
    envGroup.add(auroraBackdrop);
    disposableGeos.push(auroraGeo);
    disposableMats.push(auroraMat);

    // -------------------------------------------------------------------------
    // BG 2. 3D PERSPECTIVE HOLOGRAPHIC TERRAIN & COORDINATE GRID FLOOR
    // Spans the entire hero bottom in authentic 3D depth with radar pulse wave
    // -------------------------------------------------------------------------
    const terrainGeo = new THREE.PlaneGeometry(
      46,
      30,
      isInitialMobile ? 38 : 68,
      isInitialMobile ? 26 : 44,
    );
    terrainGeo.rotateX(-Math.PI / 2);

    const terrainMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPulse: { value: 0 },
        uOriginX: { value: 2.6 },
        uColorPrimary: { value: new THREE.Color(CHAPTER_THEMES[0].floorPrimary) },
        uColorSecondary: {
          value: new THREE.Color(CHAPTER_THEMES[0].floorSecondary),
        },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      vertexShader: `
        uniform float uTime;
        uniform float uOriginX;
        varying vec2 vWorldXZ;
        varying float vElevation;
        varying float vDistFromCam;
        varying float vDistFromOrigin;

        void main() {
          vec3 pos = position;
          float waveA = sin(pos.x * 0.26 + uTime * 0.58) * 0.38;
          float waveB = cos(pos.z * 0.32 - uTime * 0.46) * 0.34;
          float waveC = sin((pos.x - pos.z) * 0.19 + uTime * 0.42) * 0.22;

          // Subtle architectural basin right under the hero sculpture
          float dHero = length(vec2(pos.x - uOriginX, pos.z + 5.2));
          float ripple = sin(dHero * 0.85 - uTime * 1.45) * 0.14 * exp(-dHero * 0.085);

          pos.y += waveA + waveB + waveC + ripple;

          vec4 worldPos = modelMatrix * vec4(pos, 1.0);
          vec4 mvPos = viewMatrix * worldPos;

          vWorldXZ = pos.xz;
          vElevation = pos.y;
          vDistFromCam = -mvPos.z;
          vDistFromOrigin = dHero;

          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uPulse;
        uniform vec3 uColorPrimary;
        uniform vec3 uColorSecondary;
        varying vec2 vWorldXZ;
        varying float vElevation;
        varying float vDistFromCam;
        varying float vDistFromOrigin;

        void main() {
          // Analytic anti-aliased dual-scale 3D architectural perspective grid
          vec2 minorUV = vWorldXZ * 0.72;
          vec2 g = abs(fract(minorUV - 0.5) - 0.5);
          float aaMinor = 0.022 + vDistFromCam * 0.0022;
          float mX = 1.0 - smoothstep(0.0, aaMinor, g.x);
          float mZ = 1.0 - smoothstep(0.0, aaMinor, g.y);
          float minorGrid = max(mX, mZ);
          float nodeDot = pow(mX * mZ, 1.35);

          vec2 majorUV = vWorldXZ * 0.18;
          vec2 mg = abs(fract(majorUV - 0.5) - 0.5);
          float aaMajor = 0.015 + vDistFromCam * 0.0014;
          float majX = 1.0 - smoothstep(0.0, aaMajor, mg.x);
          float majZ = 1.0 - smoothstep(0.0, aaMajor, mg.y);
          float majorGrid = max(majX, majZ);

          // Concentric data pulse ring sweeping outward from under the 3D core
          float scanWave = 0.5 + 0.5 * sin(vDistFromOrigin * 0.72 - uTime * 1.75);
          float scanRing = pow(scanWave, 7.0) * exp(-vDistFromOrigin * 0.065);

          // Elevation crest luminance
          float crest = smoothstep(-0.2, 0.75, vElevation);

          // Smooth radial & horizon distance fade (no hard edges anywhere)
          float radialFade = 1.0 - smoothstep(7.5, 22.0, length(vWorldXZ * vec2(0.88, 1.15)));
          float nearFade = smoothstep(2.2, 6.2, vDistFromCam);
          float farFade = 1.0 - smoothstep(14.5, 29.0, vDistFromCam);
          float visibility = radialFade * nearFade * farFade;

          vec3 baseCol = mix(uColorSecondary, uColorPrimary, clamp(crest * 0.75 + scanRing * 0.6, 0.0, 1.0));
          float intensity =
            minorGrid * 0.24 +
            majorGrid * 0.42 +
            nodeDot * 0.55 +
            scanRing * (0.48 + uPulse * 0.35) +
            crest * 0.06;

          float alpha = clamp(intensity * visibility, 0.0, 0.72);
          if (alpha < 0.005) discard;

          gl_FragColor = vec4(baseCol * (1.05 + scanRing * 0.55 + nodeDot * 0.45), alpha);
        }
      `,
    });

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.position.set(0, -2.95, -5.2);
    terrainMesh.rotation.x = 0.075;
    envGroup.add(terrainMesh);
    disposableGeos.push(terrainGeo);
    disposableMats.push(terrainMat);

    // -------------------------------------------------------------------------
    // BG 3. INTERACTIVE 3D NEURAL CONSTELLATION LATTICE (Full-Width Depth)
    // Adds authentic spatial 3D structure behind the left headline & upper sky
    // -------------------------------------------------------------------------
    const nodeCount = isInitialMobile ? 22 : 44;
    const nodeBases: {
      x: number;
      y: number;
      z: number;
      ampX: number;
      ampY: number;
      ampZ: number;
      speed: number;
      phase: number;
    }[] = [];

    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeColors = new Float32Array(nodeCount * 3);
    const nodePalette = [
      new THREE.Color(0x38bdf8),
      new THREE.Color(0x818cf8),
      new THREE.Color(0xc084fc),
      new THREE.Color(0xbae6fd),
    ];

    for (let i = 0; i < nodeCount; i++) {
      // Distribute organically across wide panoramic depth, favoring left/upper framing
      const lane = i / nodeCount;
      const spreadX = (Math.random() - 0.54) * 21.5;
      const spreadY = -1.6 + Math.random() * 6.8;
      const spreadZ = -4.8 - Math.random() * 6.5;

      nodeBases.push({
        x: spreadX,
        y: spreadY,
        z: spreadZ,
        ampX: 0.22 + (i % 4) * 0.08,
        ampY: 0.18 + (i % 3) * 0.09,
        ampZ: 0.16 + (i % 5) * 0.05,
        speed: 0.25 + (lane * 0.35),
        phase: i * 1.37,
      });

      nodePositions[i * 3] = spreadX;
      nodePositions[i * 3 + 1] = spreadY;
      nodePositions[i * 3 + 2] = spreadZ;

      const c = nodePalette[i % nodePalette.length];
      nodeColors[i * 3] = c.r;
      nodeColors[i * 3 + 1] = c.g;
      nodeColors[i * 3 + 2] = c.b;
    }

    const constellationGeo = new THREE.BufferGeometry();
    const constellationPosAttr = new THREE.BufferAttribute(nodePositions, 3);
    constellationGeo.setAttribute("position", constellationPosAttr);
    constellationGeo.setAttribute(
      "color",
      new THREE.BufferAttribute(nodeColors, 3),
    );

    const constellationMat = new THREE.PointsMaterial({
      size: isInitialMobile ? 0.16 : 0.18,
      map: bokehTex ?? undefined,
      vertexColors: true,
      transparent: true,
      opacity: 0.72,
      alphaTest: 0.02,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const constellationPoints = new THREE.Points(
      constellationGeo,
      constellationMat,
    );
    envGroup.add(constellationPoints);
    disposableGeos.push(constellationGeo);
    disposableMats.push(constellationMat);

    // Dynamic 3D filament links between nearby spatial nodes
    const maxSegments = isInitialMobile ? 70 : 180;
    const linePositions = new Float32Array(maxSegments * 2 * 3);
    const lineColors = new Float32Array(maxSegments * 2 * 3);
    const linkGeo = new THREE.BufferGeometry();
    const linkPosAttr = new THREE.BufferAttribute(linePositions, 3);
    const linkColAttr = new THREE.BufferAttribute(lineColors, 3);
    linkGeo.setAttribute("position", linkPosAttr);
    linkGeo.setAttribute("color", linkColAttr);
    linkGeo.setDrawRange(0, 0);

    const linkMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const constellationLinks = new THREE.LineSegments(linkGeo, linkMat);
    envGroup.add(constellationLinks);
    disposableGeos.push(linkGeo);
    disposableMats.push(linkMat);

    // -------------------------------------------------------------------------
    // BG 4. MONUMENTAL DEEP-SPACE ARCHITECTURAL ARCS (Unifies Left & Right)
    // -------------------------------------------------------------------------
    const deepArcGroup = new THREE.Group();
    deepArcGroup.position.set(0.5, 0.25, -9.2);

    const deepArcSpecs = [
      {
        r: 8.6,
        tube: 0.018,
        color: 0x38bdf8,
        rx: 1.2,
        ry: 0.3,
        rz: 0.16,
        opacity: 0.18,
        speed: 0.045,
      },
      {
        r: 11.1,
        tube: 0.015,
        color: 0x818cf8,
        rx: -0.94,
        ry: -0.34,
        rz: 0.22,
        opacity: 0.14,
        speed: -0.036,
      },
    ];

    const deepArcMeshes: {
      mesh: THREE.Mesh;
      mat: THREE.MeshBasicMaterial;
      speed: number;
    }[] = [];

    deepArcSpecs.forEach((spec) => {
      const arcGeo = new THREE.TorusGeometry(spec.r, spec.tube, 12, 160);
      const arcMat = new THREE.MeshBasicMaterial({
        color: spec.color,
        transparent: true,
        opacity: spec.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const arcMesh = new THREE.Mesh(arcGeo, arcMat);
      arcMesh.rotation.set(spec.rx, spec.ry, spec.rz);
      deepArcGroup.add(arcMesh);
      deepArcMeshes.push({ mesh: arcMesh, mat: arcMat, speed: spec.speed });
      disposableGeos.push(arcGeo);
      disposableMats.push(arcMat);
    });
    envGroup.add(deepArcGroup);

    // -------------------------------------------------------------------------
    // BG 5. HOLOGRAPHIC FLOOR PROJECTION RING (Grounds Floating 3D Sculpture)
    // -------------------------------------------------------------------------
    const floorAnchorGroup = new THREE.Group();
    floorAnchorGroup.position.set(layoutTarget.baseX, -2.42, 0);

    const anchorInnerGeo = new THREE.RingGeometry(1.08, 1.15, 72);
    const anchorOuterGeo = new THREE.RingGeometry(1.76, 1.8, 96);
    const anchorInnerMat = new THREE.MeshBasicMaterial({
      color: CHAPTER_THEMES[0].rimA,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.34,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const anchorOuterMat = new THREE.MeshBasicMaterial({
      color: CHAPTER_THEMES[0].rimB,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const anchorInnerRing = new THREE.Mesh(anchorInnerGeo, anchorInnerMat);
    anchorInnerRing.rotation.x = -Math.PI / 2;
    const anchorOuterRing = new THREE.Mesh(anchorOuterGeo, anchorOuterMat);
    anchorOuterRing.rotation.x = -Math.PI / 2;

    floorAnchorGroup.add(anchorInnerRing, anchorOuterRing);
    envGroup.add(floorAnchorGroup);
    disposableGeos.push(anchorInnerGeo, anchorOuterGeo);
    disposableMats.push(anchorInnerMat, anchorOuterMat);

    // =========================================================================
    // FOREGROUND HERO 3D SCULPTURE (Preserves Exact SAP-Scale Structure)
    // =========================================================================
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    updateHeroLayout(initialW, initialH);
    heroGroup.position.set(layoutTarget.baseX, layoutTarget.baseY, 0);
    heroGroup.scale.setScalar(layoutTarget.scale);
    floorAnchorGroup.position.x = layoutTarget.baseX;
    terrainMat.uniforms.uOriginX.value = layoutTarget.baseX;

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
    // 4. FLOATING CRYSTALLINE DIAMOND SATELLITES
    // -------------------------------------------------------------------------
    const crystalPlacements = [
      { x: -2.35, y: 2.15, z: -0.6, scale: 0.95, speed: 0.42 },
      { x: -0.65, y: 1.95, z: -1.2, scale: 0.72, speed: 0.35 },
      { x: 2.45, y: 1.35, z: -0.75, scale: 0.9, speed: -0.38 },
      { x: -2.65, y: -0.25, z: 0.45, scale: 0.82, speed: 0.4 },
      { x: 2.25, y: -1.45, z: -0.5, scale: 0.88, speed: -0.44 },
      { x: -1.45, y: -2.1, z: 0.85, scale: 0.8, speed: 0.36 },
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
    // 5. DUAL-DEPTH VOLUMETRIC BOKEH STARFIELD & NEAR ATMOSPHERIC DUST
    // -------------------------------------------------------------------------
    const starCount = isInitialMobile ? 280 : 720;
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
      starPos[i * 3] = (Math.random() - 0.5) * 32;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 18 + 1.0;
      starPos[i * 3 + 2] = -2.5 - Math.random() * 14;

      const c = palette[i % palette.length];
      starColors[i * 3] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: isInitialMobile ? 0.125 : 0.115,
      map: bokehTex ?? undefined,
      vertexColors: true,
      transparent: true,
      opacity: 0.76,
      alphaTest: 0.02,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const starField = new THREE.Points(starGeo, starMat);
    envGroup.add(starField);
    disposableGeos.push(starGeo);
    disposableMats.push(starMat);

    // Near parallax micro-dust motes floating gently through foreground air
    const dustCount = isInitialMobile ? 55 : 140;
    const dustPos = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 18;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 9.5;
      dustPos[i * 3 + 2] = -2.0 + Math.random() * 4.5;

      const c = palette[i % 3];
      dustColors[i * 3] = c.r;
      dustColors[i * 3 + 1] = c.g;
      dustColors[i * 3 + 2] = c.b;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute("color", new THREE.BufferAttribute(dustColors, 3));

    const dustMat = new THREE.PointsMaterial({
      size: isInitialMobile ? 0.075 : 0.07,
      map: bokehTex ?? undefined,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      alphaTest: 0.02,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const nearDust = new THREE.Points(dustGeo, dustMat);
    envGroup.add(nearDust);
    disposableGeos.push(dustGeo);
    disposableMats.push(dustMat);

    // -------------------------------------------------------------------------
    // 6. INTERACTIVE DRAG-TO-ORBIT INERTIA + MULTI-PLANE POINTER PARALLAX
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
    const targetFloorPrimary = new THREE.Color();
    const targetFloorSecondary = new THREE.Color();
    const targetAuroraA = new THREE.Color();
    const targetAuroraB = new THREE.Color();
    const linkTintA = new THREE.Color(0x38bdf8);
    const linkTintB = new THREE.Color(0x818cf8);

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

    const linkMaxDistSq = isInitialMobile ? 11.5 : 14.5;

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

        // Smooth color morphing across sculpture AND full-page 3D environment
        targetRimA.setHex(theme.rimA);
        targetRimB.setHex(theme.rimB);
        targetEdgeCol.setHex(theme.edge);
        targetLightCol.setHex(theme.rimLight);
        targetHaloCol.setHex(theme.halo);
        targetFloorPrimary.setHex(theme.floorPrimary);
        targetFloorSecondary.setHex(theme.floorSecondary);
        targetAuroraA.setHex(theme.auroraA);
        targetAuroraB.setHex(theme.auroraB);

        coreShaderMat.uniforms.uTime.value = elapsed;
        coreShaderMat.uniforms.uPulse.value = pulse;
        coreShaderMat.uniforms.uRimColorA.value.lerp(targetRimA, 0.045);
        coreShaderMat.uniforms.uRimColorB.value.lerp(targetRimB, 0.045);
        shellEdgesMat.color.lerp(targetEdgeCol, 0.045);
        cyanPointLight.color.lerp(targetLightCol, 0.045);
        haloMat.color.lerp(targetHaloCol, 0.045);

        terrainMat.uniforms.uTime.value = elapsed;
        terrainMat.uniforms.uPulse.value = pulse;
        terrainMat.uniforms.uOriginX.value +=
          (heroGroup.position.x - terrainMat.uniforms.uOriginX.value) * 0.08;
        terrainMat.uniforms.uColorPrimary.value.lerp(targetFloorPrimary, 0.04);
        terrainMat.uniforms.uColorSecondary.value.lerp(
          targetFloorSecondary,
          0.04,
        );

        auroraMat.uniforms.uTime.value = elapsed;
        auroraMat.uniforms.uPulse.value = pulse;
        auroraMat.uniforms.uColorA.value.lerp(targetAuroraA, 0.035);
        auroraMat.uniforms.uColorB.value.lerp(targetAuroraB, 0.035);
        auroraMat.uniforms.uPointer.value.set(pointer.x, pointer.y);

        anchorInnerMat.color.lerp(targetRimA, 0.045);
        anchorOuterMat.color.lerp(targetRimB, 0.045);
        linkTintA.lerp(targetFloorPrimary, 0.04);
        linkTintB.lerp(targetFloorSecondary, 0.04);

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

        // Camera breathing & multi-plane 3D parallax tracking
        camera.position.x += (pointer.x * 0.34 - camera.position.x) * 0.04;
        camera.position.y +=
          (0.18 +
            pointer.y * 0.22 +
            Math.sin(elapsed * 0.45) * 0.08 -
            camera.position.y) *
          0.04;
        camera.lookAt(pointer.x * 0.08, -0.04 + pointer.y * 0.05, -2.2);

        // Animate 3D Neural Constellation nodes & dynamic proximity filaments
        const nArr = constellationPosAttr.array as Float32Array;
        for (let i = 0; i < nodeCount; i++) {
          const b = nodeBases[i];
          nArr[i * 3] = b.x + Math.sin(elapsed * b.speed + b.phase) * b.ampX;
          nArr[i * 3 + 1] =
            b.y + Math.cos(elapsed * b.speed * 0.85 + b.phase) * b.ampY;
          nArr[i * 3 + 2] =
            b.z + Math.sin(elapsed * b.speed * 0.6 + b.phase) * b.ampZ;
        }
        constellationPosAttr.needsUpdate = true;

        const lPos = linkPosAttr.array as Float32Array;
        const lCol = linkColAttr.array as Float32Array;
        let segCount = 0;

        for (let i = 0; i < nodeCount && segCount < maxSegments; i++) {
          const ax = nArr[i * 3];
          const ay = nArr[i * 3 + 1];
          const az = nArr[i * 3 + 2];

          for (let j = i + 1; j < nodeCount && segCount < maxSegments; j++) {
            const bx = nArr[j * 3];
            const by = nArr[j * 3 + 1];
            const bz = nArr[j * 3 + 2];

            const dx = ax - bx;
            const dy = ay - by;
            const dz = az - bz;
            const dSq = dx * dx + dy * dy + dz * dz;

            if (dSq < linkMaxDistSq) {
              const fade = 1 - Math.sqrt(dSq / linkMaxDistSq);
              const idx = segCount * 6;
              lPos[idx] = ax;
              lPos[idx + 1] = ay;
              lPos[idx + 2] = az;
              lPos[idx + 3] = bx;
              lPos[idx + 4] = by;
              lPos[idx + 5] = bz;

              lCol[idx] = linkTintA.r * fade;
              lCol[idx + 1] = linkTintA.g * fade;
              lCol[idx + 2] = linkTintA.b * fade;
              lCol[idx + 3] = linkTintB.r * fade;
              lCol[idx + 4] = linkTintB.g * fade;
              lCol[idx + 5] = linkTintB.b * fade;
              segCount++;
            }
          }
        }
        linkGeo.setDrawRange(0, segCount * 2);
        linkPosAttr.needsUpdate = true;
        linkColAttr.needsUpdate = true;

        // Animate monumental deep-space rings
        deepArcMeshes.forEach((arc, idx) => {
          arc.mesh.rotation.z += arc.speed * 0.012;
          arc.mesh.rotation.y += (idx % 2 === 0 ? 1 : -1) * 0.0005;
          arc.mat.color.lerp(
            idx === 0 ? targetFloorPrimary : targetFloorSecondary,
            0.035,
          );
        });

        // Smooth non-overlapping sculpture placement + natural hovering bob
        heroGroup.position.x +=
          (layoutTarget.baseX - heroGroup.position.x) * 0.08;
        const bobY = layoutTarget.baseY + Math.sin(elapsed * 0.85) * 0.09;
        heroGroup.position.y += (bobY - heroGroup.position.y) * 0.08;

        // Sync holographic grounding rings beneath sculpture
        floorAnchorGroup.position.x = heroGroup.position.x;
        const anchorBreath = 1 + Math.sin(elapsed * 1.1) * 0.045 + pulse * 0.14;
        anchorInnerRing.scale.setScalar(anchorBreath);
        anchorOuterRing.scale.setScalar(1 + Math.cos(elapsed * 0.85) * 0.035);
        anchorInnerRing.rotation.z = elapsed * 0.18;
        anchorOuterRing.rotation.z = -elapsed * 0.12;

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

        // Dual-depth parallax starfield & floating air dust
        starField.rotation.y = elapsed * 0.01 + pointer.x * 0.025;
        starField.rotation.x = pointer.y * 0.018;
        nearDust.rotation.y = -elapsed * 0.018 + pointer.x * 0.06;
        nearDust.rotation.x = pointer.y * 0.04;
        nearDust.position.y = Math.sin(elapsed * 0.35) * 0.18;

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

    const revealFrame = window.requestAnimationFrame(() => {
      if (renderer) {
        renderer.domElement.style.opacity = "1";
      }
    });

    return () => {
      window.cancelAnimationFrame(revealFrame);
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
