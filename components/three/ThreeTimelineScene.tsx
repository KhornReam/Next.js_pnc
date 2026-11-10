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
  hex: string;
}[] = [
  {
    id: "year-1",
    code: "01",
    label: "Year 1",
    sublabel: "The Beginning",
    pos: new THREE.Vector3(-3.35, -0.22, 0.25),
    color: 0x38bdf8,
    hex: "#38bdf8",
  },
  {
    id: "year-2",
    code: "02",
    label: "Year 2",
    sublabel: "Growing & Developing",
    pos: new THREE.Vector3(0, 0.28, -0.35),
    color: 0x818cf8,
    hex: "#818cf8",
  },
  {
    id: "my-future",
    code: "03",
    label: "My Future",
    sublabel: "Software Engineer",
    pos: new THREE.Vector3(3.35, 0.72, 0.25),
    color: 0xfbbf24,
    hex: "#fbbf24",
  },
];

function createSoftGlowTexture(rgbaInner: string, rgbaMid: string): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const grad = ctx.createRadialGradient(64, 64, 1, 64, 64, 62);
  grad.addColorStop(0, rgbaInner);
  grad.addColorStop(0.32, rgbaMid);
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

  useEffect(() => {
    activeStageRef.current = activeStage;
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

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.35 : 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // Studio IBL environment map for authentic 3D metallic & glass reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.78;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.3, isMobile ? 10.6 : 7.8);

    // Three-point lighting
    const keyLight = new THREE.DirectionalLight(0xe0e7ff, 2.5);
    keyLight.position.set(4, 7, 6);
    scene.add(keyLight);

    const coolRim = new THREE.PointLight(0x38bdf8, 18, 20);
    coolRim.position.set(-5, 2.5, -2);
    scene.add(coolRim);

    const violetRim = new THREE.PointLight(0x8b5cf6, 20, 22);
    violetRim.position.set(0, 3.5, 3);
    scene.add(violetRim);

    const warmRim = new THREE.PointLight(0xfbbf24, 16, 18);
    warmRim.position.set(5, 2.5, -1.5);
    scene.add(warmRim);

    const disposableGeos: THREE.BufferGeometry[] = [];
    const disposableMats: THREE.Material[] = [];
    const disposableTextures: THREE.Texture[] = [];

    // 1. Subtle architectural perspective grid floor with radial edge fade
    const gridPlaneGeo = new THREE.PlaneGeometry(24, 14, 1, 1);
    const gridShaderMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uColor: { value: new THREE.Color(0x6366f1) },
        uAccent: { value: new THREE.Color(0x38bdf8) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 uColor;
        uniform vec3 uAccent;
        void main() {
          vec2 coord = vUv * vec2(26.0, 15.0);
          vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
          float line = min(grid.x, grid.y);
          float gridAlpha = 1.0 - min(line, 1.0);

          vec2 centered = (vUv - 0.5) * vec2(1.9, 1.8);
          float dist = length(centered);
          float fade = smoothstep(0.95, 0.15, dist);

          vec3 col = mix(uColor, uAccent, smoothstep(0.0, 1.0, vUv.x));
          gl_FragColor = vec4(col, gridAlpha * fade * 0.22);
        }
      `,
    });
    const gridFloor = new THREE.Mesh(gridPlaneGeo, gridShaderMat);
    gridFloor.rotation.x = -Math.PI / 2;
    gridFloor.position.set(0, -1.38, 0);
    scene.add(gridFloor);
    disposableGeos.push(gridPlaneGeo);
    disposableMats.push(gridShaderMat);

    // 2. Sleek precision fiber-optic trajectory spline
    const roadCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-5.5, -0.78, 0.75),
      STAGE_META[0].pos,
      new THREE.Vector3(-1.68, 0.04, -0.05),
      STAGE_META[1].pos,
      new THREE.Vector3(1.68, 0.52, -0.05),
      STAGE_META[2].pos,
      new THREE.Vector3(5.5, 1.15, 0.7),
    ]);

    const coreLineGeo = new THREE.TubeGeometry(roadCurve, 140, 0.02, 12, false);
    const coreLineMat = new THREE.MeshPhysicalMaterial({
      color: 0x312e81,
      emissive: 0x818cf8,
      emissiveIntensity: 0.6,
      metalness: 0.85,
      roughness: 0.2,
    });
    scene.add(new THREE.Mesh(coreLineGeo, coreLineMat));

    const outerGlowGeo = new THREE.TubeGeometry(roadCurve, 110, 0.052, 10, false);
    const outerGlowMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.14,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    scene.add(new THREE.Mesh(outerGlowGeo, outerGlowMat));
    disposableGeos.push(coreLineGeo, outerGlowGeo);
    disposableMats.push(coreLineMat, outerGlowMat);

    // 3. Delicate streaming light motes along the trajectory
    const particleTex = createSoftGlowTexture("rgba(255,255,255,1)", "rgba(125,211,252,0.5)");
    const nodeGlowTex = createSoftGlowTexture("rgba(255,255,255,0.85)", "rgba(129,140,248,0.22)");
    if (particleTex) disposableTextures.push(particleTex);
    if (nodeGlowTex) disposableTextures.push(nodeGlowTex);

    const sparkCount = isMobile ? 26 : 46;
    const sparkPositions = new Float32Array(sparkCount * 3);
    const sparkOffsets: number[] = [];
    for (let i = 0; i < sparkCount; i++) {
      sparkOffsets.push(i / sparkCount);
    }
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
    const sparkMat = new THREE.PointsMaterial({
      size: 0.15,
      map: particleTex ?? undefined,
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.92,
      alphaTest: 0.02,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparkPoints);
    disposableGeos.push(sparkGeo);
    disposableMats.push(sparkMat);

    // 4. Studio-Lit 3D Architectural Milestone Monuments
    const hitTargets: THREE.Object3D[] = [];
    const nodeGroups: Record<
      TimelineStageId,
      {
        root: THREE.Group;
        core: THREE.Mesh;
        coreShader: THREE.ShaderMaterial;
        cage: THREE.LineSegments;
        ringA: THREE.Mesh;
        ringB: THREE.Mesh;
        halo: THREE.Sprite;
        floorRing: THREE.Mesh;
        baseY: number;
      }
    > = {} as Record<
      TimelineStageId,
      {
        root: THREE.Group;
        core: THREE.Mesh;
        coreShader: THREE.ShaderMaterial;
        cage: THREE.LineSegments;
        ringA: THREE.Mesh;
        ringB: THREE.Mesh;
        halo: THREE.Sprite;
        floorRing: THREE.Mesh;
        baseY: number;
      }
    >;

    STAGE_META.forEach((stage, index) => {
      const root = new THREE.Group();
      root.position.copy(stage.pos);

      // Fresnel Glowing Obsidian Core Sphere
      const coreGeo = new THREE.SphereGeometry(0.28, 36, 36);
      const coreShader = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uInner: { value: new THREE.Color(0x060918) },
          uRim: { value: new THREE.Color(stage.color) },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vViewDir;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vNormal = normalize(normalMatrix * normal);
            vViewDir = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          uniform vec3 uInner;
          uniform vec3 uRim;
          varying vec3 vNormal;
          varying vec3 vViewDir;
          void main() {
            float ndotv = clamp(dot(normalize(vNormal), normalize(vViewDir)), 0.0, 1.0);
            float fresnel = pow(1.0 - ndotv, 2.2);
            gl_FragColor = vec4(mix(uInner, uRim, fresnel * 1.15), 1.0);
          }
        `,
      });
      const core = new THREE.Mesh(coreGeo, coreShader);
      root.add(core);

      // Translucent Glass Polyhedral Shell + Edge Lattice
      const shellGeo =
        index === 0
          ? new THREE.OctahedronGeometry(0.42, 0)
          : index === 1
          ? new THREE.DodecahedronGeometry(0.44, 0)
          : new THREE.IcosahedronGeometry(0.45, 0);

      const shellMat = new THREE.MeshPhysicalMaterial({
        color: 0x0f172a,
        metalness: 0.2,
        roughness: 0.08,
        clearcoat: 1.0,
        reflectivity: 1.0,
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
      });
      const shellMesh = new THREE.Mesh(shellGeo, shellMat);
      root.add(shellMesh);

      const edgesGeo = new THREE.EdgesGeometry(shellGeo);
      const cageMat = new THREE.LineBasicMaterial({
        color: stage.color,
        transparent: true,
        opacity: 0.78,
      });
      const cage = new THREE.LineSegments(edgesGeo, cageMat);
      root.add(cage);

      // Sculpted Metallic Gyroscope Rings (real 3D thickness)
      const ringAGeo = new THREE.TorusGeometry(0.62, 0.022, 18, 96);
      const ringAMat = new THREE.MeshPhysicalMaterial({
        color: 0x1e293b,
        emissive: stage.color,
        emissiveIntensity: 0.28,
        metalness: 0.92,
        roughness: 0.16,
        clearcoat: 1.0,
      });
      const ringA = new THREE.Mesh(ringAGeo, ringAMat);
      ringA.rotation.set(Math.PI * 0.38, 0.2, 0);

      const satGeo = new RoundedBoxGeometry(0.08, 0.08, 0.08, 2, 0.015);
      const satMat = new THREE.MeshStandardMaterial({
        color: stage.color,
        emissive: stage.color,
        emissiveIntensity: 1.1,
      });
      const satNode = new THREE.Mesh(satGeo, satMat);
      satNode.position.set(0.62, 0, 0);
      ringA.add(satNode);
      root.add(ringA);

      const ringBGeo = new THREE.TorusGeometry(0.76, 0.015, 16, 96);
      const ringBMat = new THREE.MeshPhysicalMaterial({
        color: 0x334155,
        metalness: 0.9,
        roughness: 0.2,
        clearcoat: 1.0,
      });
      const ringB = new THREE.Mesh(ringBGeo, ringBMat);
      ringB.rotation.set(-Math.PI * 0.28, 0.65, 0);
      root.add(ringB);

      // Soft optical halo sprite
      const spriteMat = new THREE.SpriteMaterial({
        map: nodeGlowTex ?? undefined,
        color: stage.color,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const halo = new THREE.Sprite(spriteMat);
      halo.scale.set(2.2, 2.2, 1);
      root.add(halo);

      // Vertical anchor beam down to floor grid (y = -1.38)
      const beamHeight = stage.pos.y - -1.38;
      const beamPts = [
        new THREE.Vector3(0, -0.48, 0),
        new THREE.Vector3(0, -beamHeight, 0),
      ];
      const beamGeo = new THREE.BufferGeometry().setFromPoints(beamPts);
      const beamMat = new THREE.LineBasicMaterial({
        color: stage.color,
        transparent: true,
        opacity: 0.35,
      });
      root.add(new THREE.Line(beamGeo, beamMat));

      // Floor anchor ring
      const floorRingGeo = new THREE.RingGeometry(0.24, 0.28, 48);
      const floorRingMat = new THREE.MeshBasicMaterial({
        color: stage.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.55,
      });
      const floorRing = new THREE.Mesh(floorRingGeo, floorRingMat);
      floorRing.rotation.x = -Math.PI / 2;
      floorRing.position.set(0, -beamHeight + 0.01, 0);
      root.add(floorRing);

      // Invisible hit target for clean pointer raycasting
      const hitGeo = new THREE.SphereGeometry(0.95, 12, 12);
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
        satGeo,
        ringBGeo,
        beamGeo,
        floorRingGeo,
        hitGeo
      );
      disposableMats.push(
        coreShader,
        shellMat,
        cageMat,
        ringAMat,
        satMat,
        ringBMat,
        spriteMat,
        beamMat,
        floorRingMat,
        hitMat
      );

      nodeGroups[stage.id] = {
        root,
        core,
        coreShader,
        cage,
        ringA,
        ringB,
        halo,
        floorRing,
        baseY: stage.pos.y,
      };
    });

    // 5. Ambient depth bokeh starfield
    const dustCount = isMobile ? 160 : 340;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 18;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 7 + 0.6;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2.2;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.075,
      map: particleTex ?? undefined,
      color: 0xc7d2fe,
      transparent: true,
      opacity: 0.6,
      alphaTest: 0.02,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);
    disposableGeos.push(dustGeo);
    disposableMats.push(dustMat);

    // Pointer interactivity
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
        const id = hits[0].object.userData?.stageId as TimelineStageId | undefined;
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
    const startTime = performance.now();
    let frameId = 0;

    const animate = () => {
      const elapsed = (performance.now() - startTime) * 0.001;
      const active = activeStageRef.current;
      const isOverview = overviewRef.current;

      pointer.x += (pointer.targetX - pointer.x) * 0.05;
      pointer.y += (pointer.targetY - pointer.y) * 0.05;

      const activeMeta = STAGE_META.find((s) => s.id === active) ?? STAGE_META[0];
      const focusFactor = isOverview ? 0.08 : 0.48;
      const camZ = isMobile ? (isOverview ? 11.2 : 9.4) : isOverview ? 8.4 : 6.45;

      const desiredCamX = activeMeta.pos.x * focusFactor + pointer.x * 0.35;
      const desiredCamY = activeMeta.pos.y * 0.35 + 1.15 + pointer.y * 0.2;

      camera.position.x += (desiredCamX - camera.position.x) * 0.055;
      camera.position.y += (desiredCamY - camera.position.y) * 0.055;
      camera.position.z += (camZ - camera.position.z) * 0.055;

      lookAtTarget.set(
        activeMeta.pos.x * (isOverview ? 0.08 : 0.46),
        activeMeta.pos.y * 0.38 + 0.05,
        0
      );
      lookAtCurrent.lerp(lookAtTarget, 0.06);
      camera.lookAt(lookAtCurrent);

      const viewW = container.clientWidth || 900;
      const viewH = container.clientHeight || 420;

      STAGE_META.forEach((stage, idx) => {
        const n = nodeGroups[stage.id];
        const isSelected = stage.id === active && !isOverview;
        const targetScale = isSelected ? 1.24 : isOverview ? 1.0 : 0.86;
        n.root.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
        n.root.position.y = n.baseY + Math.sin(elapsed * 1.2 + idx * 1.5) * 0.06;

        n.cage.rotation.y = -elapsed * 0.25;
        n.cage.rotation.x = Math.sin(elapsed * 0.45 + idx) * 0.18;
        n.ringA.rotation.z = elapsed * (isSelected ? 0.78 : 0.3);
        n.ringB.rotation.z = -elapsed * 0.24;

        const targetHaloScale = isSelected ? 2.8 : 1.75;
        const currentHalo = n.halo.scale.x;
        const nextHalo = currentHalo + (targetHaloScale - currentHalo) * 0.08;
        n.halo.scale.set(nextHalo, nextHalo, 1);

        const floorPulse = 1 + Math.sin(elapsed * 2 + idx) * 0.08;
        n.floorRing.scale.set(floorPulse, floorPulse, 1);

        const labelEl = labelRefs.current[stage.id];
        if (labelEl) {
          projectedVec.set(n.root.position.x, n.root.position.y + 0.94, n.root.position.z);
          projectedVec.project(camera);
          const px = (projectedVec.x * 0.5 + 0.5) * viewW;
          const py = (-projectedVec.y * 0.5 + 0.5) * viewH;
          labelEl.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -100%)`;
        }
      });

      const posAttr = sparkGeo.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < sparkCount; i++) {
        const t = (sparkOffsets[i] + elapsed * 0.045) % 1;
        roadCurve.getPointAt(t, tmpPoint);
        posAttr.setXYZ(i, tmpPoint.x, tmpPoint.y, tmpPoint.z);
      }
      posAttr.needsUpdate = true;

      dustPoints.rotation.y = elapsed * 0.012;

      renderer?.render(scene, camera);
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
