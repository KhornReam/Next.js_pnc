"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type TimelineStageId = "year-1" | "year-2" | "my-future";

interface ThreeTimelineSceneProps {
  activeStage: TimelineStageId;
  overviewMode?: boolean;
  onSelectStage: (stageId: TimelineStageId) => void;
}

const STAGE_META: {
  id: TimelineStageId;
  code: string;
  label: string;
  sublabel: string;
  pos: THREE.Vector3;
  color: number;
  secondaryColor: number;
  ringColorA: number;
  ringColorB: number;
  auroraA: number;
  auroraB: number;
  hex: string;
}[] = [
  {
    id: "year-1",
    code: "01",
    label: "Year 1",
    sublabel: "The Beginning",
    pos: new THREE.Vector3(-3.35, -0.18, 0.25),
    color: 0x38bdf8,
    secondaryColor: 0x2563eb,
    ringColorA: 0x0284c7,
    ringColorB: 0x6366f1,
    auroraA: 0x1d4ed8,
    auroraB: 0x0ea5e9,
    hex: "#38bdf8",
  },
  {
    id: "year-2",
    code: "02",
    label: "Year 2",
    sublabel: "Growing & Developing",
    pos: new THREE.Vector3(0, 0.3, -0.32),
    color: 0x818cf8,
    secondaryColor: 0xa855f7,
    ringColorA: 0x6d28d9,
    ringColorB: 0x0284c7,
    auroraA: 0x5b21b6,
    auroraB: 0x38bdf8,
    hex: "#818cf8",
  },
  {
    id: "my-future",
    code: "03",
    label: "My Future",
    sublabel: "Software Engineer",
    pos: new THREE.Vector3(3.35, 0.72, 0.25),
    color: 0xfbbf24,
    secondaryColor: 0xd97706,
    ringColorA: 0xb45309,
    ringColorB: 0x6366f1,
    auroraA: 0xb45309,
    auroraB: 0x4f46e5,
    hex: "#fbbf24",
  },
];

function createSoftGlowTexture(
  rgbaInner: string,
  rgbaMid: string,
): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const grad = ctx.createRadialGradient(64, 64, 1, 64, 64, 62);
  grad.addColorStop(0, rgbaInner);
  grad.addColorStop(0.3, rgbaMid);
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.clearRect(0, 0, 128, 128);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(64, 64, 62, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function ThreeTimelineScene({
  activeStage,
  overviewMode = false,
  onSelectStage,
}: ThreeTimelineSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<Record<TimelineStageId, HTMLButtonElement | null>>({
    "year-1": null,
    "year-2": null,
    "my-future": null,
  });

  const activeStageRef = useRef<TimelineStageId>(activeStage);
  const overviewRef = useRef<boolean>(overviewMode);
  const onSelectRef = useRef(onSelectStage);
  const hoveringNodeRef = useRef(false);
  const pulseTriggerRef = useRef(0);

  useEffect(() => {
    if (activeStageRef.current !== activeStage) {
      activeStageRef.current = activeStage;
      pulseTriggerRef.current = 1;
    }
  }, [activeStage]);

  useEffect(() => {
    overviewRef.current = overviewMode;
  }, [overviewMode]);

  useEffect(() => {
    onSelectRef.current = onSelectStage;
  }, [onSelectStage]);

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

    const isMobile = window.innerWidth < 768;
    const width = container.clientWidth || 900;
    const height = container.clientHeight || 420;

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, isMobile ? 1.35 : 2),
    );
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.24;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // High-dynamic-range studio IBL reflections for realistic brushed metals & glass
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 1.15;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 110);
    camera.position.set(0, 1.35, isMobile ? 10.6 : 7.8);

    // Production multi-point studio lighting
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x6366f1, 1.0);
    fillLight.position.set(-6, -2, 4);
    scene.add(fillLight);

    const rimBacklight = new THREE.DirectionalLight(0x38bdf8, 2.2);
    rimBacklight.position.set(0, 5, -6);
    scene.add(rimBacklight);

    const coolRim = new THREE.PointLight(0x38bdf8, 22, 18);
    coolRim.position.set(-4.6, 2.2, 1.8);
    scene.add(coolRim);

    const violetRim = new THREE.PointLight(0xa855f7, 24, 20);
    violetRim.position.set(0, 2.8, 2.4);
    scene.add(violetRim);

    const warmRim = new THREE.PointLight(0xfbbf24, 22, 18);
    warmRim.position.set(4.6, 2.4, 1.8);
    scene.add(warmRim);

    const disposableGeos: THREE.BufferGeometry[] = [];
    const disposableMats: THREE.Material[] = [];
    const disposableTextures: THREE.Texture[] = [];

    const particleTex = createSoftGlowTexture(
      "rgba(255,255,255,1)",
      "rgba(125,211,252,0.55)",
    );
    const nodeGlowTex = createSoftGlowTexture(
      "rgba(255,255,255,0.92)",
      "rgba(129,140,248,0.26)",
    );
    if (particleTex) disposableTextures.push(particleTex);
    if (nodeGlowTex) disposableTextures.push(nodeGlowTex);

    // =========================================================================
    // 1. VOLUMETRIC 3D ATMOSPHERIC AURORA SKY BACKDROP
    // =========================================================================
    const auroraGeo = new THREE.PlaneGeometry(38, 18);
    const auroraMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPulse: { value: 0 },
        uColorA: { value: new THREE.Color(STAGE_META[0].auroraA) },
        uColorB: { value: new THREE.Color(STAGE_META[0].auroraB) },
        uFocusX: { value: -0.35 },
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
        uniform float uFocusX;
        varying vec2 vUv;

        void main() {
          vec2 p = vUv * 2.0 - 1.0;

          float wave1 = sin(p.x * 2.5 + uTime * 0.28 + sin(p.y * 2.2 - uTime * 0.2) * 1.1);
          float curtain1 = exp(-pow((p.y - 0.14 - wave1 * 0.24) * 3.0, 2.0));

          float wave2 = cos(p.x * 2.0 - uTime * 0.22 + sin(p.x * 1.5 + p.y * 1.6) * 0.85);
          float curtain2 = exp(-pow((p.y + 0.3 - wave2 * 0.2) * 3.2, 2.0));

          float focusSpot = exp(-length((p - vec2(uFocusX, 0.08)) * vec2(1.2, 1.8)) * 2.1);

          vec3 col = uColorA * (curtain1 * 0.38 + focusSpot * 0.22)
                   + uColorB * (curtain2 * 0.32 + focusSpot * (0.34 + uPulse * 0.2));

          float edgeFade = smoothstep(1.28, 0.18, length(p * vec2(0.86, 1.05)));
          float alpha = clamp((curtain1 * 0.28 + curtain2 * 0.22 + focusSpot * 0.34) * edgeFade, 0.0, 0.48);

          gl_FragColor = vec4(col, alpha);
        }
      `,
    });
    const auroraBackdrop = new THREE.Mesh(auroraGeo, auroraMat);
    auroraBackdrop.position.set(0, 1.2, -11.5);
    scene.add(auroraBackdrop);
    disposableGeos.push(auroraGeo);
    disposableMats.push(auroraMat);

    // =========================================================================
    // 2. 3D PERSPECTIVE HOLOGRAPHIC TERRAIN & COORDINATE GRID FLOOR
    // =========================================================================
    const terrainGeo = new THREE.PlaneGeometry(
      34,
      20,
      isMobile ? 32 : 56,
      isMobile ? 20 : 36,
    );
    terrainGeo.rotateX(-Math.PI / 2);

    const terrainMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPulse: { value: 0 },
        uActivePos: { value: new THREE.Vector2(STAGE_META[0].pos.x, STAGE_META[0].pos.z) },
        uPrimary: { value: new THREE.Color(STAGE_META[0].color) },
        uSecondary: { value: new THREE.Color(0x6366f1) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      vertexShader: `
        uniform float uTime;
        uniform vec2 uActivePos;
        varying vec2 vWorldXZ;
        varying float vElevation;
        varying float vDistFromCam;
        varying float vDistFromActive;

        void main() {
          vec3 pos = position;
          float dActive = length(pos.xz - uActivePos);

          // Organic low-amplitude 3D topography waves + active stage ripple
          float waveA = sin(pos.x * 0.36 + uTime * 0.55) * 0.16;
          float waveB = cos(pos.z * 0.42 - uTime * 0.45) * 0.14;
          float ripple = sin(dActive * 1.35 - uTime * 2.0) * 0.07 * exp(-dActive * 0.16);

          // Keep the immediate anchor zone level for clean pillar grounding
          float stageFlat = smoothstep(0.6, 2.8, dActive);
          pos.y += (waveA + waveB) * stageFlat + ripple;

          vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
          vWorldXZ = pos.xz;
          vElevation = pos.y;
          vDistFromCam = -mvPos.z;
          vDistFromActive = dActive;

          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uPulse;
        uniform vec3 uPrimary;
        uniform vec3 uSecondary;
        varying vec2 vWorldXZ;
        varying float vElevation;
        varying float vDistFromCam;
        varying float vDistFromActive;

        void main() {
          // Analytic anti-aliased dual-scale perspective architectural grid
          vec2 minorUV = vWorldXZ * 0.9;
          vec2 g = abs(fract(minorUV - 0.5) - 0.5);
          float aaMinor = 0.022 + vDistFromCam * 0.0024;
          float mX = 1.0 - smoothstep(0.0, aaMinor, g.x);
          float mZ = 1.0 - smoothstep(0.0, aaMinor, g.y);
          float minorGrid = max(mX, mZ);
          float nodeDot = pow(mX * mZ, 1.35);

          vec2 majorUV = vWorldXZ * 0.225;
          vec2 mg = abs(fract(majorUV - 0.5) - 0.5);
          float aaMajor = 0.015 + vDistFromCam * 0.0015;
          float majX = 1.0 - smoothstep(0.0, aaMajor, mg.x);
          float majZ = 1.0 - smoothstep(0.0, aaMajor, mg.y);
          float majorGrid = max(majX, majZ);

          // Active milestone radar pulse expanding across the 3D terrain floor
          float radarWave = 0.5 + 0.5 * sin(vDistFromActive * 1.05 - uTime * 2.1);
          float radarRing = pow(radarWave, 7.0) * exp(-vDistFromActive * 0.14);

          float crest = smoothstep(-0.15, 0.35, vElevation);
          float radialFade = 1.0 - smoothstep(5.5, 16.5, length(vWorldXZ * vec2(0.85, 1.25)));
          float farFade = 1.0 - smoothstep(10.0, 22.0, vDistFromCam);
          float visibility = radialFade * farFade;

          vec3 col = mix(uSecondary, uPrimary, clamp(crest * 0.65 + radarRing * 0.75 + smoothstep(-5.0, 5.0, vWorldXZ.x) * 0.25, 0.0, 1.0));
          float intensity =
            minorGrid * 0.24 +
            majorGrid * 0.44 +
            nodeDot * 0.58 +
            radarRing * (0.55 + uPulse * 0.4) +
            crest * 0.05;

          float alpha = clamp(intensity * visibility, 0.0, 0.74);
          if (alpha < 0.005) discard;

          gl_FragColor = vec4(col * (1.08 + radarRing * 0.55 + nodeDot * 0.4), alpha);
        }
      `,
    });

    const terrainFloor = new THREE.Mesh(terrainGeo, terrainMat);
    terrainFloor.position.set(0, -1.42, 0);
    scene.add(terrainFloor);
    disposableGeos.push(terrainGeo);
    disposableMats.push(terrainMat);

    // =========================================================================
    // 3. DEEP 3D NEURAL CONSTELLATION NETWORK & CELESTIAL ARCS (Sky Depth)
    // =========================================================================
    const bgNodeCount = isMobile ? 16 : 34;
    const bgNodeBases: {
      x: number;
      y: number;
      z: number;
      ampX: number;
      ampY: number;
      speed: number;
      phase: number;
    }[] = [];
    const bgNodePos = new Float32Array(bgNodeCount * 3);
    const bgNodeColors = new Float32Array(bgNodeCount * 3);
    const bgPalette = [
      new THREE.Color(0x38bdf8),
      new THREE.Color(0x818cf8),
      new THREE.Color(0xc084fc),
      new THREE.Color(0xfbbf24),
    ];

    for (let i = 0; i < bgNodeCount; i++) {
      const bx = (Math.random() - 0.5) * 18.5;
      const by = -0.3 + Math.random() * 4.8;
      const bz = -3.4 - Math.random() * 5.6;
      bgNodeBases.push({
        x: bx,
        y: by,
        z: bz,
        ampX: 0.16 + (i % 3) * 0.07,
        ampY: 0.14 + (i % 4) * 0.06,
        speed: 0.28 + (i / bgNodeCount) * 0.3,
        phase: i * 1.4,
      });
      bgNodePos[i * 3] = bx;
      bgNodePos[i * 3 + 1] = by;
      bgNodePos[i * 3 + 2] = bz;

      const c = bgPalette[i % bgPalette.length];
      bgNodeColors[i * 3] = c.r;
      bgNodeColors[i * 3 + 1] = c.g;
      bgNodeColors[i * 3 + 2] = c.b;
    }

    const bgConstGeo = new THREE.BufferGeometry();
    const bgConstPosAttr = new THREE.BufferAttribute(bgNodePos, 3);
    bgConstGeo.setAttribute("position", bgConstPosAttr);
    bgConstGeo.setAttribute("color", new THREE.BufferAttribute(bgNodeColors, 3));

    const bgConstMat = new THREE.PointsMaterial({
      size: isMobile ? 0.13 : 0.15,
      map: particleTex ?? undefined,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      alphaTest: 0.02,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(bgConstGeo, bgConstMat));
    disposableGeos.push(bgConstGeo);
    disposableMats.push(bgConstMat);

    const maxBgLinks = isMobile ? 48 : 120;
    const bgLinkPos = new Float32Array(maxBgLinks * 2 * 3);
    const bgLinkCol = new Float32Array(maxBgLinks * 2 * 3);
    const bgLinkGeo = new THREE.BufferGeometry();
    const bgLinkPosAttr = new THREE.BufferAttribute(bgLinkPos, 3);
    const bgLinkColAttr = new THREE.BufferAttribute(bgLinkCol, 3);
    bgLinkGeo.setAttribute("position", bgLinkPosAttr);
    bgLinkGeo.setAttribute("color", bgLinkColAttr);
    bgLinkGeo.setDrawRange(0, 0);

    const bgLinkMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.24,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    scene.add(new THREE.LineSegments(bgLinkGeo, bgLinkMat));
    disposableGeos.push(bgLinkGeo);
    disposableMats.push(bgLinkMat);

    // Distant framing celestial arcs behind the 3 milestones
    const deepArcGroup = new THREE.Group();
    deepArcGroup.position.set(0, 0.4, -7.2);
    const deepArcs: { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; speed: number }[] = [];
    [
      { r: 6.4, tube: 0.015, color: 0x38bdf8, rx: 1.18, ry: 0.28, opacity: 0.16, speed: 0.045 },
      { r: 8.2, tube: 0.013, color: 0x818cf8, rx: -0.92, ry: -0.36, opacity: 0.13, speed: -0.036 },
    ].forEach((spec) => {
      const aGeo = new THREE.TorusGeometry(spec.r, spec.tube, 12, 140);
      const aMat = new THREE.MeshBasicMaterial({
        color: spec.color,
        transparent: true,
        opacity: spec.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const aMesh = new THREE.Mesh(aGeo, aMat);
      aMesh.rotation.set(spec.rx, spec.ry, 0);
      deepArcGroup.add(aMesh);
      deepArcs.push({ mesh: aMesh, mat: aMat, speed: spec.speed });
      disposableGeos.push(aGeo);
      disposableMats.push(aMat);
    });
    scene.add(deepArcGroup);

    // =========================================================================
    // 4. ANIMATED FIBER-OPTIC GRADIENT ENERGY BRIDGE (Year 1 -> Year 2 -> Future)
    // =========================================================================
    const roadCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-5.6, -0.78, 0.72),
      STAGE_META[0].pos,
      new THREE.Vector3(-1.68, 0.06, -0.05),
      STAGE_META[1].pos,
      new THREE.Vector3(1.68, 0.54, -0.05),
      STAGE_META[2].pos,
      new THREE.Vector3(5.6, 1.18, 0.68),
    ]);

    const coreLineGeo = new THREE.TubeGeometry(roadCurve, 160, 0.024, 14, false);
    const coreLineMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uCol1: { value: new THREE.Color(0x38bdf8) },
        uCol2: { value: new THREE.Color(0x818cf8) },
        uCol3: { value: new THREE.Color(0xfbbf24) },
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
        uniform vec3 uCol1;
        uniform vec3 uCol2;
        uniform vec3 uCol3;
        varying vec2 vUv;

        void main() {
          float t = vUv.x;
          vec3 baseCol = t < 0.5
            ? mix(uCol1, uCol2, t * 2.0)
            : mix(uCol2, uCol3, (t - 0.5) * 2.0);

          // Traveling fiber-optic data pulses racing from Year 1 -> Future
          float pulseA = pow(0.5 + 0.5 * sin(t * 20.0 - uTime * 3.4), 6.0);
          float pulseB = pow(0.5 + 0.5 * sin(t * 9.0 - uTime * 1.9 + 1.5), 4.0);
          float edgeSoft = smoothstep(0.0, 0.08, t) * smoothstep(1.0, 0.92, t);

          vec3 finalCol = baseCol * (0.9 + pulseA * 1.15 + pulseB * 0.55) + vec3(0.35) * pulseA;
          gl_FragColor = vec4(finalCol, (0.72 + pulseA * 0.28) * edgeSoft);
        }
      `,
    });
    scene.add(new THREE.Mesh(coreLineGeo, coreLineMat));

    // Soft glass outer optical sheath
    const outerGlowGeo = new THREE.TubeGeometry(roadCurve, 120, 0.068, 12, false);
    const outerGlowMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    scene.add(new THREE.Mesh(outerGlowGeo, outerGlowMat));
    disposableGeos.push(coreLineGeo, outerGlowGeo);
    disposableMats.push(coreLineMat, outerGlowMat);

    // Streaming photon sparks racing along the trajectory spline
    const sparkCount = isMobile ? 30 : 62;
    const sparkPositions = new Float32Array(sparkCount * 3);
    const sparkColors = new Float32Array(sparkCount * 3);
    const sparkOffsets: number[] = [];
    const tmpCol = new THREE.Color();
    const c1 = new THREE.Color(0x38bdf8);
    const c2 = new THREE.Color(0x818cf8);
    const c3 = new THREE.Color(0xfbbf24);

    for (let i = 0; i < sparkCount; i++) {
      const off = i / sparkCount;
      sparkOffsets.push(off);
      if (off < 0.5) tmpCol.copy(c1).lerp(c2, off * 2);
      else tmpCol.copy(c2).lerp(c3, (off - 0.5) * 2);
      sparkColors[i * 3] = tmpCol.r;
      sparkColors[i * 3 + 1] = tmpCol.g;
      sparkColors[i * 3 + 2] = tmpCol.b;
    }

    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(sparkPositions, 3),
    );
    sparkGeo.setAttribute("color", new THREE.BufferAttribute(sparkColors, 3));
    const sparkMat = new THREE.PointsMaterial({
      size: 0.17,
      map: particleTex ?? undefined,
      vertexColors: true,
      transparent: true,
      opacity: 0.94,
      alphaTest: 0.02,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparkPoints);
    disposableGeos.push(sparkGeo);
    disposableMats.push(sparkMat);

    // =========================================================================
    // 5. PHOTOREALISTIC 3D MILESTONE MONUMENTS (Hero-Grade Craftsmanship)
    // =========================================================================
    const hitTargets: THREE.Object3D[] = [];

    interface StageMonument {
      root: THREE.Group;
      coreShader: THREE.ShaderMaterial;
      shellGroup: THREE.Group;
      ringAGroup: THREE.Group;
      ringBGroup: THREE.Group;
      satNodeA: THREE.Mesh;
      satNodeB: THREE.Mesh;
      halo: THREE.Sprite;
      floorRingInner: THREE.Mesh;
      floorRingOuter: THREE.Mesh;
      baseY: number;
    }

    const nodeGroups = {} as Record<TimelineStageId, StageMonument>;

    const sharedSatGeo = new RoundedBoxGeometry(0.088, 0.088, 0.088, 3, 0.02);
    disposableGeos.push(sharedSatGeo);

    STAGE_META.forEach((stage, index) => {
      const root = new THREE.Group();
      root.position.copy(stage.pos);

      // A. Realistic Rayleigh-Scattering Obsidian Core Sphere + Specular Glint
      const coreGeo = new THREE.SphereGeometry(0.34, 48, 48);
      const coreShader = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uSelected: { value: index === 0 ? 1.0 : 0.0 },
          uInner: { value: new THREE.Color(0x040714) },
          uRimA: { value: new THREE.Color(stage.color) },
          uRimB: { value: new THREE.Color(stage.secondaryColor) },
          uLightDir: { value: new THREE.Vector3(0.55, 0.8, 0.6).normalize() },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vViewDir;
          varying vec3 vLocalPos;
          void main() {
            vLocalPos = position;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vNormal = normalize(normalMatrix * normal);
            vViewDir = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform float uSelected;
          uniform vec3 uInner;
          uniform vec3 uRimA;
          uniform vec3 uRimB;
          uniform vec3 uLightDir;
          varying vec3 vNormal;
          varying vec3 vViewDir;
          varying vec3 vLocalPos;

          void main() {
            vec3 n = normalize(vNormal);
            vec3 v = normalize(vViewDir);
            float ndotv = clamp(dot(n, v), 0.0, 1.0);

            float fresnel = pow(1.0 - ndotv, 2.7);
            float latWave = sin(vLocalPos.y * 34.0 - uTime * 1.6 + vLocalPos.x * 4.0);
            float latGlow = smoothstep(0.84, 1.0, latWave) * (1.0 - ndotv) * (0.16 + uSelected * 0.14);

            vec3 halfVec = normalize(uLightDir + v);
            float specular = pow(max(0.0, dot(n, halfVec)), 44.0) * 0.48;

            float mixWave = 0.5 + 0.5 * sin(vLocalPos.y * 5.0 - uTime * 1.3 + vLocalPos.z * 3.5);
            vec3 rimCol = mix(uRimA, uRimB, mixWave);

            float rimAmt = fresnel * (1.28 + uSelected * 0.28) + latGlow;
            vec3 col = mix(uInner, rimCol, clamp(rimAmt, 0.0, 1.0));
            col += vec3(specular) * vec3(0.88, 0.94, 1.0);

            gl_FragColor = vec4(col, 1.0);
          }
        `,
      });
      const core = new THREE.Mesh(coreGeo, coreShader);
      root.add(core);

      // B. High-Density Geodesic Glass Lattice + Filigree Edges + Vertex Micro-Rivets
      const shellGroup = new THREE.Group();
      const shellGeo =
        index === 0
          ? new THREE.OctahedronGeometry(0.5, 1)
          : index === 1
            ? new THREE.IcosahedronGeometry(0.51, 1)
            : new THREE.IcosahedronGeometry(0.53, isMobile ? 1 : 2);

      const shellMat = new THREE.MeshPhysicalMaterial({
        color: 0x0f172a,
        emissive: stage.secondaryColor,
        emissiveIntensity: 0.14,
        metalness: 0.12,
        roughness: 0.07,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        reflectivity: 0.96,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      shellGroup.add(new THREE.Mesh(shellGeo, shellMat));

      const edgesGeo = new THREE.EdgesGeometry(shellGeo);
      const cageMat = new THREE.LineBasicMaterial({
        color: stage.color,
        transparent: true,
        opacity: 0.74,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      shellGroup.add(new THREE.LineSegments(edgesGeo, cageMat));

      const rivetMat = new THREE.PointsMaterial({
        size: 0.036,
        color: 0xf0f9ff,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      shellGroup.add(new THREE.Points(shellGeo, rivetMat));
      root.add(shellGroup);

      // C. Dual Precision Anodized Metallic Gimbal Rings + Orbiting Luminous Nodes
      const ringAGroup = new THREE.Group();
      ringAGroup.rotation.set(Math.PI * 0.36, 0.22, 0);

      const ringAGeo = new THREE.TorusGeometry(0.68, 0.022, 24, 120);
      const ringAMat = new THREE.MeshPhysicalMaterial({
        color: stage.ringColorA,
        emissive: stage.color,
        emissiveIntensity: 0.36,
        metalness: 0.96,
        roughness: 0.12,
        clearcoat: 1.0,
        clearcoatRoughness: 0.06,
      });
      ringAGroup.add(new THREE.Mesh(ringAGeo, ringAMat));

      const satMatA = new THREE.MeshStandardMaterial({
        color: stage.color,
        emissive: stage.color,
        emissiveIntensity: 1.5,
        metalness: 0.35,
        roughness: 0.14,
      });
      const satNodeA = new THREE.Mesh(sharedSatGeo, satMatA);
      const flareMatA = new THREE.SpriteMaterial({
        map: particleTex ?? undefined,
        color: stage.color,
        transparent: true,
        opacity: 0.72,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const flareA = new THREE.Sprite(flareMatA);
      flareA.scale.set(0.46, 0.46, 1);
      satNodeA.add(flareA);
      ringAGroup.add(satNodeA);
      root.add(ringAGroup);

      const ringBGroup = new THREE.Group();
      ringBGroup.rotation.set(-Math.PI * 0.28, 0.68, 0.2);

      const ringBGeo = new THREE.TorusGeometry(0.84, 0.016, 20, 120);
      const ringBMat = new THREE.MeshPhysicalMaterial({
        color: stage.ringColorB,
        emissive: stage.secondaryColor,
        emissiveIntensity: 0.26,
        metalness: 0.94,
        roughness: 0.14,
        clearcoat: 1.0,
      });
      ringBGroup.add(new THREE.Mesh(ringBGeo, ringBMat));

      const satMatB = new THREE.MeshStandardMaterial({
        color: 0xe0f2fe,
        emissive: stage.secondaryColor,
        emissiveIntensity: 1.3,
        metalness: 0.4,
        roughness: 0.16,
      });
      const satNodeB = new THREE.Mesh(sharedSatGeo, satMatB);
      satNodeB.scale.setScalar(0.82);
      ringBGroup.add(satNodeB);
      root.add(ringBGroup);

      // D. Soft Optical Planetary Corona Halo
      const spriteMat = new THREE.SpriteMaterial({
        map: nodeGlowTex ?? undefined,
        color: stage.color,
        transparent: true,
        opacity: 0.48,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const halo = new THREE.Sprite(spriteMat);
      halo.scale.set(2.3, 2.3, 1);
      root.add(halo);

      // E. Volumetric Holographic Anchor Tether & Dual Concentric Floor Rings
      const beamHeight = Math.max(0.4, stage.pos.y - -1.42 - 0.48);
      const beamGeo = new THREE.CylinderGeometry(
        0.008,
        0.026,
        beamHeight,
        12,
        1,
        true,
      );
      const beamMat = new THREE.MeshBasicMaterial({
        color: stage.color,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const beamMesh = new THREE.Mesh(beamGeo, beamMat);
      beamMesh.position.set(0, -0.48 - beamHeight * 0.5, 0);
      root.add(beamMesh);

      const floorY = -1.42 - stage.pos.y + 0.015;
      const floorRingInnerGeo = new THREE.RingGeometry(0.24, 0.29, 56);
      const floorRingInnerMat = new THREE.MeshBasicMaterial({
        color: stage.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const floorRingInner = new THREE.Mesh(
        floorRingInnerGeo,
        floorRingInnerMat,
      );
      floorRingInner.rotation.x = -Math.PI / 2;
      floorRingInner.position.set(0, floorY, 0);
      root.add(floorRingInner);

      const floorRingOuterGeo = new THREE.RingGeometry(0.46, 0.49, 64);
      const floorRingOuterMat = new THREE.MeshBasicMaterial({
        color: stage.secondaryColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.34,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const floorRingOuter = new THREE.Mesh(
        floorRingOuterGeo,
        floorRingOuterMat,
      );
      floorRingOuter.rotation.x = -Math.PI / 2;
      floorRingOuter.position.set(0, floorY, 0);
      root.add(floorRingOuter);

      // F. Invisible Raycast Hit Target
      const hitGeo = new THREE.SphereGeometry(1.0, 12, 12);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitSphere = new THREE.Mesh(hitGeo, hitMat);
      hitSphere.userData = { stageId: stage.id };
      root.add(hitSphere);
      hitTargets.push(hitSphere);

      scene.add(root);
      disposableGeos.push(
        coreGeo,
        shellGeo,
        edgesGeo,
        ringAGeo,
        ringBGeo,
        beamGeo,
        floorRingInnerGeo,
        floorRingOuterGeo,
        hitGeo,
      );
      disposableMats.push(
        coreShader,
        shellMat,
        cageMat,
        rivetMat,
        ringAMat,
        satMatA,
        flareMatA,
        ringBMat,
        satMatB,
        spriteMat,
        beamMat,
        floorRingInnerMat,
        floorRingOuterMat,
        hitMat,
      );

      nodeGroups[stage.id] = {
        root,
        coreShader,
        shellGroup,
        ringAGroup,
        ringBGroup,
        satNodeA,
        satNodeB,
        halo,
        floorRingInner,
        floorRingOuter,
        baseY: stage.pos.y,
      };
    });

    // =========================================================================
    // 6. AMBIENT DEPTH BOKEH STARFIELD
    // =========================================================================
    const dustCount = isMobile ? 180 : 420;
    const dustPos = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 22;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 8.5 + 0.8;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2.6;

      const c = bgPalette[i % bgPalette.length];
      dustColors[i * 3] = c.r;
      dustColors[i * 3 + 1] = c.g;
      dustColors[i * 3 + 2] = c.b;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute("color", new THREE.BufferAttribute(dustColors, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.085,
      map: particleTex ?? undefined,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      alphaTest: 0.02,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);
    disposableGeos.push(dustGeo);
    disposableMats.push(dustMat);

    // Pointer interactivity & raycasting
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();

    const getHits = (clientX: number, clientY: number) => {
      if (!renderer) return [];
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);
      return raycaster.intersectObjects(hitTargets, false);
    };

    const canvasEl = renderer.domElement;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvasEl.getBoundingClientRect();
      pointer.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      const hits = getHits(e.clientX, e.clientY);
      const isHovering = hits.length > 0;
      if (isHovering !== hoveringNodeRef.current) {
        hoveringNodeRef.current = isHovering;
        canvasEl.style.cursor = isHovering ? "pointer" : "default";
      }
    };

    const handleClick = (e: MouseEvent) => {
      const hits = getHits(e.clientX, e.clientY);
      if (hits.length > 0) {
        const id = hits[0].object.userData?.stageId as
          | TimelineStageId
          | undefined;
        if (id) onSelectRef.current(id);
      }
    };

    canvasEl.addEventListener("pointermove", handlePointerMove);
    canvasEl.addEventListener("click", handleClick);

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || 900;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    const lookAtCurrent = new THREE.Vector3(0, 0.15, 0);
    const lookAtTarget = new THREE.Vector3(0, 0.15, 0);
    const projectedVec = new THREE.Vector3();
    const tmpPoint = new THREE.Vector3();
    const targetScaleVec = new THREE.Vector3();
    const targetPrimaryCol = new THREE.Color();
    const targetAuroraA = new THREE.Color();
    const targetAuroraB = new THREE.Color();
    const bgTintA = new THREE.Color(0x38bdf8);
    const bgTintB = new THREE.Color(0x818cf8);

    const startTime = performance.now();
    let frameId = 0;
    let isStageVisible = true;
    const bgLinkMaxDistSq = isMobile ? 10.5 : 13.0;

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isStageVisible = entry.isIntersecting;
      },
      { rootMargin: "160px" },
    );
    visibilityObserver.observe(container);

    const animate = () => {
      if (isStageVisible) {
        const elapsed = (performance.now() - startTime) * 0.001;
        const active = activeStageRef.current;
        const isOverview = overviewRef.current;

        pulseTriggerRef.current *= 0.94;
        const pulse = pulseTriggerRef.current;

        pointer.x += (pointer.targetX - pointer.x) * 0.05;
        pointer.y += (pointer.targetY - pointer.y) * 0.05;

        const activeMeta =
          STAGE_META.find((s) => s.id === active) ?? STAGE_META[0];
        const focusFactor = isOverview ? 0.08 : 0.48;
        const camZ = isMobile
          ? isOverview
            ? 11.2
            : 9.4
          : isOverview
            ? 8.4
            : 6.45;

        const desiredCamX = activeMeta.pos.x * focusFactor + pointer.x * 0.36;
        const desiredCamY = activeMeta.pos.y * 0.35 + 1.18 + pointer.y * 0.22;

        camera.position.x += (desiredCamX - camera.position.x) * 0.055;
        camera.position.y += (desiredCamY - camera.position.y) * 0.055;
        camera.position.z += (camZ - camera.position.z) * 0.055;

        lookAtTarget.set(
          activeMeta.pos.x * (isOverview ? 0.08 : 0.46),
          activeMeta.pos.y * 0.38 + 0.05,
          0,
        );
        lookAtCurrent.lerp(lookAtTarget, 0.06);
        camera.lookAt(lookAtCurrent);

        // Smoothly morph volumetric sky & 3D terrain floor toward focused stage
        targetPrimaryCol.setHex(activeMeta.color);
        targetAuroraA.setHex(activeMeta.auroraA);
        targetAuroraB.setHex(activeMeta.auroraB);

        auroraMat.uniforms.uTime.value = elapsed;
        auroraMat.uniforms.uPulse.value = pulse;
        auroraMat.uniforms.uColorA.value.lerp(targetAuroraA, 0.04);
        auroraMat.uniforms.uColorB.value.lerp(targetAuroraB, 0.04);
        const targetFocusX = isOverview ? 0 : activeMeta.pos.x / 5.2;
        auroraMat.uniforms.uFocusX.value +=
          (targetFocusX - auroraMat.uniforms.uFocusX.value) * 0.05;

        terrainMat.uniforms.uTime.value = elapsed;
        terrainMat.uniforms.uPulse.value = pulse;
        terrainMat.uniforms.uPrimary.value.lerp(targetPrimaryCol, 0.045);
        terrainMat.uniforms.uActivePos.value.x +=
          (activeMeta.pos.x - terrainMat.uniforms.uActivePos.value.x) * 0.06;
        terrainMat.uniforms.uActivePos.value.y +=
          (activeMeta.pos.z - terrainMat.uniforms.uActivePos.value.y) * 0.06;

        coreLineMat.uniforms.uTime.value = elapsed;
        bgTintA.lerp(targetPrimaryCol, 0.04);

        // Animate deep background 3D constellation & filaments
        const bArr = bgConstPosAttr.array as Float32Array;
        for (let i = 0; i < bgNodeCount; i++) {
          const b = bgNodeBases[i];
          bArr[i * 3] = b.x + Math.sin(elapsed * b.speed + b.phase) * b.ampX;
          bArr[i * 3 + 1] =
            b.y + Math.cos(elapsed * b.speed * 0.85 + b.phase) * b.ampY;
        }
        bgConstPosAttr.needsUpdate = true;

        const blPos = bgLinkPosAttr.array as Float32Array;
        const blCol = bgLinkColAttr.array as Float32Array;
        let segCount = 0;
        for (let i = 0; i < bgNodeCount && segCount < maxBgLinks; i++) {
          const ax = bArr[i * 3];
          const ay = bArr[i * 3 + 1];
          const az = bArr[i * 3 + 2];
          for (let j = i + 1; j < bgNodeCount && segCount < maxBgLinks; j++) {
            const dx = ax - bArr[j * 3];
            const dy = ay - bArr[j * 3 + 1];
            const dz = az - bArr[j * 3 + 2];
            const dSq = dx * dx + dy * dy + dz * dz;
            if (dSq < bgLinkMaxDistSq) {
              const fade = 1 - Math.sqrt(dSq / bgLinkMaxDistSq);
              const idx = segCount * 6;
              blPos[idx] = ax;
              blPos[idx + 1] = ay;
              blPos[idx + 2] = az;
              blPos[idx + 3] = bArr[j * 3];
              blPos[idx + 4] = bArr[j * 3 + 1];
              blPos[idx + 5] = bArr[j * 3 + 2];
              blCol[idx] = bgTintA.r * fade;
              blCol[idx + 1] = bgTintA.g * fade;
              blCol[idx + 2] = bgTintA.b * fade;
              blCol[idx + 3] = bgTintB.r * fade;
              blCol[idx + 4] = bgTintB.g * fade;
              blCol[idx + 5] = bgTintB.b * fade;
              segCount++;
            }
          }
        }
        bgLinkGeo.setDrawRange(0, segCount * 2);
        bgLinkPosAttr.needsUpdate = true;
        bgLinkColAttr.needsUpdate = true;

        deepArcs.forEach((arc, idx) => {
          arc.mesh.rotation.z += arc.speed * 0.012;
          arc.mesh.rotation.y += (idx % 2 === 0 ? 1 : -1) * 0.0005;
        });

        const viewW = container.clientWidth || 900;
        const viewH = container.clientHeight || 420;

        STAGE_META.forEach((stage, idx) => {
          const n = nodeGroups[stage.id];
          const isSelected = stage.id === active && !isOverview;
          const targetScale = isSelected ? 1.24 : isOverview ? 1.0 : 0.88;
          targetScaleVec.setScalar(targetScale);
          n.root.scale.lerp(targetScaleVec, 0.08);
          n.root.position.y =
            n.baseY + Math.sin(elapsed * 1.15 + idx * 1.5) * 0.065;

          n.coreShader.uniforms.uTime.value = elapsed;
          const selTarget = isSelected ? 1.0 : 0.0;
          n.coreShader.uniforms.uSelected.value +=
            (selTarget - n.coreShader.uniforms.uSelected.value) * 0.08;

          n.shellGroup.rotation.y = -elapsed * 0.24;
          n.shellGroup.rotation.x = Math.sin(elapsed * 0.45 + idx) * 0.18;

          n.ringAGroup.rotation.z = elapsed * (isSelected ? 0.52 : 0.24);
          n.ringAGroup.rotation.y = 0.22 + Math.sin(elapsed * 0.35 + idx) * 0.14;
          n.ringBGroup.rotation.z = -elapsed * (isSelected ? 0.36 : 0.18);

          // Orbiting data nodes gliding smoothly along each ring track
          const angA = elapsed * (isSelected ? 0.9 : 0.45) + idx * 2.1;
          n.satNodeA.position.set(Math.cos(angA) * 0.68, Math.sin(angA) * 0.68, 0);
          n.satNodeA.rotation.z = angA;

          const angB = -elapsed * 0.55 + idx * 1.6;
          n.satNodeB.position.set(Math.cos(angB) * 0.84, Math.sin(angB) * 0.84, 0);
          n.satNodeB.rotation.z = angB;

          const targetHaloScale = isSelected ? 2.95 : 1.85;
          const nextHalo =
            n.halo.scale.x + (targetHaloScale - n.halo.scale.x) * 0.08;
          n.halo.scale.set(nextHalo, nextHalo, 1);

          const floorPulse = 1 + Math.sin(elapsed * 2.1 + idx) * 0.09;
          n.floorRingInner.scale.set(floorPulse, floorPulse, 1);
          n.floorRingOuter.scale.set(
            1 + Math.cos(elapsed * 1.6 + idx) * 0.06,
            1 + Math.cos(elapsed * 1.6 + idx) * 0.06,
            1,
          );
          n.floorRingInner.rotation.z = elapsed * 0.28;
          n.floorRingOuter.rotation.z = -elapsed * 0.18;

          const labelEl = labelRefs.current[stage.id];
          if (labelEl) {
            projectedVec.set(
              n.root.position.x,
              n.root.position.y + 1.02,
              n.root.position.z,
            );
            projectedVec.project(camera);
            const px = (projectedVec.x * 0.5 + 0.5) * viewW;
            const py = (-projectedVec.y * 0.5 + 0.5) * viewH;
            labelEl.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -100%)`;
          }
        });

        const posAttr = sparkGeo.getAttribute("position") as THREE.BufferAttribute;
        for (let i = 0; i < sparkCount; i++) {
          const t = (sparkOffsets[i] + elapsed * 0.05) % 1;
          roadCurve.getPointAt(t, tmpPoint);
          posAttr.setXYZ(i, tmpPoint.x, tmpPoint.y, tmpPoint.z);
        }
        posAttr.needsUpdate = true;

        dustPoints.rotation.y = elapsed * 0.012 + pointer.x * 0.025;
        dustPoints.rotation.x = pointer.y * 0.018;

        renderer?.render(scene, camera);
      }

      if (!prefersReducedMotion) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    if (prefersReducedMotion) {
      animate();
    } else {
      frameId = window.requestAnimationFrame(animate);
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      visibilityObserver.disconnect();
      canvasEl.removeEventListener("pointermove", handlePointerMove);
      canvasEl.removeEventListener("click", handleClick);
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
    <div className="relative h-full w-full overflow-hidden">
      <div
        ref={containerRef}
        className="h-full w-full"
        aria-label="Interactive 3D Timeline Constellation"
      />

      {/* Projected 3D Spatial HUD Tags */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {STAGE_META.map((stage) => {
          const isSelected = stage.id === activeStage && !overviewMode;
          return (
            <button
              key={stage.id}
              ref={(el) => {
                labelRefs.current[stage.id] = el;
              }}
              type="button"
              onClick={() => onSelectStage(stage.id)}
              className={`pointer-events-auto absolute left-0 top-0 flex items-center gap-2 rounded-xl border px-3 py-1.5 text-left backdrop-blur-md transition-colors duration-200 ${
                isSelected
                  ? "border-white/35 bg-slate-900/85 shadow-[0_8px_30px_rgba(0,0,0,0.55)]"
                  : "border-white/10 bg-slate-950/65 opacity-80 hover:border-white/25 hover:opacity-100"
              }`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: stage.hex,
                  boxShadow: `0 0 10px ${stage.hex}`,
                }}
              />
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-slate-400">
                    {stage.code}
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-xs font-semibold text-white">
                    {stage.label}
                  </span>
                </div>
                <span className="hidden font-mono text-[9px] text-slate-300 sm:block">
                  {stage.sublabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
