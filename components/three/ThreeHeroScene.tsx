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
    rimA: 0x38bdf8,
    rimB: 0x818cf8,
    edge: 0x7dd3fc,
    rimLight: 0x38bdf8,
    halo: 0x38bdf8,
  },
  {
    rimA: 0xa855f7,
    rimB: 0x38bdf8,
    edge: 0xc4b5fd,
    rimLight: 0xa855f7,
    halo: 0x8b5cf6,
  },
  {
    rimA: 0xfbbf24,
    rimB: 0x38bdf8,
    edge: 0xfde68a,
    rimLight: 0xf59e0b,
    halo: 0xfbbf24,
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
  grad.addColorStop(0.28, "rgba(224, 231, 255, 0.8)");
  grad.addColorStop(0.6, "rgba(99, 102, 241, 0.24)");
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
      Math.min(window.devicePixelRatio || 1, isInitialMobile ? 1.35 : 2)
    );
    renderer.setSize(initialW, initialH);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.28;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "pan-y";

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.76;

    const camera = new THREE.PerspectiveCamera(
      42,
      initialW / initialH,
      0.1,
      100
    );

    // 3-point lighting with reactive secondary stage accent
    const keyLight = new THREE.DirectionalLight(0xe0e7ff, 2.7);
    keyLight.position.set(5, 6, 5);
    scene.add(keyLight);

    const cyanRim = new THREE.PointLight(0x38bdf8, 22, 22);
    cyanRim.position.set(-4.0, 2.4, 2.8);
    scene.add(cyanRim);

    const reactiveRim = new THREE.PointLight(0x8b5cf6, 26, 24);
    reactiveRim.position.set(4.5, -2.2, 2.8);
    scene.add(reactiveRim);

    const topAccent = new THREE.PointLight(0xfbbf24, 12, 18);
    topAccent.position.set(1.5, 4.2, -2.5);
    scene.add(topAccent);

    const disposableGeos: THREE.BufferGeometry[] = [];
    const disposableMats: THREE.Material[] = [];
    const disposableTextures: THREE.Texture[] = [];

    const bokehTex = createBokehTexture();
    if (bokehTex) disposableTextures.push(bokehTex);

    const layoutTarget = {
      baseX: 2.6,
      baseY: 0.15,
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
        // Keep the entire 3D sculpture & satellites cleanly inside the right column
        // so orbiting rings never collide with left-hand typography.
        const rightCenter = halfW * 0.52;
        const maxAllowedRadius = Math.max(1.5, halfW * 0.44);
        const targetScale = Math.min(
          1.0,
          Math.max(0.68, maxAllowedRadius / 2.38)
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

    // 1. Custom GLSL Fresnel + Animated Energy Core Sphere
    const coreGeo = new THREE.SphereGeometry(0.86, 64, 64);
    const coreShaderMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPulse: { value: 0 },
        uInnerColor: { value: new THREE.Color(0x060919) },
        uRimColorA: { value: new THREE.Color(CHAPTER_THEMES[0].rimA) },
        uRimColorB: { value: new THREE.Color(CHAPTER_THEMES[0].rimB) },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec3 vLocalPos;
        void main() {
          vLocalPos = position;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
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
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec3 vLocalPos;

        void main() {
          float ndotv = clamp(dot(normalize(vNormal), normalize(vViewDir)), 0.0, 1.0);
          float fresnel = pow(1.0 - ndotv, 2.45);
          float wave = 0.5 + 0.5 * sin(vLocalPos.y * 5.2 - uTime * 1.65 + vLocalPos.x * 3.1);
          vec3 rim = mix(uRimColorA, uRimColorB, wave);
          float innerGlow = (0.14 + uPulse * 0.22) * smoothstep(0.35, 1.0, wave) * (1.0 - ndotv);
          vec3 finalColor = mix(uInnerColor, rim, clamp(fresnel * (1.16 + uPulse * 0.25) + innerGlow, 0.0, 1.0));
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
    const coreSphere = new THREE.Mesh(coreGeo, coreShaderMat);
    heroGroup.add(coreSphere);
    disposableGeos.push(coreGeo);
    disposableMats.push(coreShaderMat);

    // Optical center halo sprite
    const haloMat = new THREE.SpriteMaterial({
      map: bokehTex ?? undefined,
      color: CHAPTER_THEMES[0].halo,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const coreHalo = new THREE.Sprite(haloMat);
    coreHalo.scale.set(4.1, 4.1, 1);
    heroGroup.add(coreHalo);
    disposableMats.push(haloMat);

    // 2. Geodesic Glass Crystal Cage
    const shellGeo = new THREE.IcosahedronGeometry(1.26, 1);
    const shellGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e1b4b,
      metalness: 0.16,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      reflectivity: 1.0,
      transparent: true,
      opacity: 0.22,
      side: THREE.FrontSide,
      depthWrite: false,
    });
    const shellMesh = new THREE.Mesh(shellGeo, shellGlassMat);
    heroGroup.add(shellMesh);

    const shellEdgesGeo = new THREE.EdgesGeometry(shellGeo);
    const shellEdgesMat = new THREE.LineBasicMaterial({
      color: CHAPTER_THEMES[0].edge,
      transparent: true,
      opacity: 0.5,
    });
    const shellEdges = new THREE.LineSegments(shellEdgesGeo, shellEdgesMat);
    shellMesh.add(shellEdges);
    disposableGeos.push(shellGeo, shellEdgesGeo);
    disposableMats.push(shellGlassMat, shellEdgesMat);

    // 3. Precision Metallic Gimbal Rings (tighter cohesive proportions)
    const ringDefs = [
      {
        radius: 1.62,
        tube: 0.032,
        color: 0x1e293b,
        emissive: 0x0284c7,
        accentColor: 0x38bdf8,
        rotX: 1.04,
        rotY: 0.4,
        speedX: 0.06,
        speedY: 0.34,
        speedZ: 0.44,
      },
      {
        radius: 1.92,
        tube: 0.026,
        color: 0x1e1b4b,
        emissive: 0x7c3aed,
        accentColor: 0xc084fc,
        rotX: -0.78,
        rotY: 0.85,
        speedX: 0.22,
        speedY: -0.26,
        speedZ: -0.34,
      },
      {
        radius: 2.2,
        tube: 0.021,
        color: 0x1e293b,
        emissive: 0xd97706,
        accentColor: 0xfbbf24,
        rotX: 0.46,
        rotY: -0.88,
        speedX: -0.16,
        speedY: 0.22,
        speedZ: 0.28,
      },
    ];

    const ringItems: {
      group: THREE.Group;
      baseX: number;
      baseY: number;
      speedX: number;
      speedY: number;
      speedZ: number;
    }[] = [];

    const ringNodeGeo = new RoundedBoxGeometry(0.11, 0.11, 0.11, 3, 0.024);
    disposableGeos.push(ringNodeGeo);

    ringDefs.forEach((def) => {
      const rGroup = new THREE.Group();
      rGroup.rotation.set(def.rotX, def.rotY, 0);

      const torusGeo = new THREE.TorusGeometry(def.radius, def.tube, 24, 140);
      const torusMat = new THREE.MeshPhysicalMaterial({
        color: def.color,
        emissive: def.emissive,
        emissiveIntensity: 0.34,
        metalness: 0.92,
        roughness: 0.16,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      });
      rGroup.add(new THREE.Mesh(torusGeo, torusMat));

      const nodeMat = new THREE.MeshStandardMaterial({
        color: def.accentColor,
        emissive: def.accentColor,
        emissiveIntensity: 1.25,
        metalness: 0.4,
        roughness: 0.18,
      });
      const nodeA = new THREE.Mesh(ringNodeGeo, nodeMat);
      nodeA.position.set(def.radius, 0, 0);
      rGroup.add(nodeA);

      const nodeB = new THREE.Mesh(ringNodeGeo, nodeMat);
      nodeB.position.set(-def.radius, 0, 0);
      rGroup.add(nodeB);

      disposableGeos.push(torusGeo);
      disposableMats.push(torusMat, nodeMat);
      heroGroup.add(rGroup);
      ringItems.push({
        group: rGroup,
        baseX: def.rotX,
        baseY: def.rotY,
        speedX: def.speedX,
        speedY: def.speedY,
        speedZ: def.speedZ,
      });
    });

    // 4. Sleek Orbiting Sapphire Micro-Crystals (compact & luminous, never clunky)
    const satelliteCount = isInitialMobile ? 4 : 6;
    const satGeo = new THREE.OctahedronGeometry(0.13, 0);
    const satGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x312e81,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.45,
      metalness: 0.85,
      roughness: 0.1,
      clearcoat: 1.0,
    });
    const satEdgesGeo = new THREE.EdgesGeometry(satGeo);
    const satEdgesMat = new THREE.LineBasicMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.72,
    });
    disposableGeos.push(satGeo, satEdgesGeo);
    disposableMats.push(satGlassMat, satEdgesMat);

    const satellites: {
      mesh: THREE.Mesh;
      radius: number;
      angleOffset: number;
      speed: number;
      yAmp: number;
      tilt: number;
    }[] = [];

    for (let i = 0; i < satelliteCount; i++) {
      const mesh = new THREE.Mesh(satGeo, satGlassMat);
      mesh.add(new THREE.LineSegments(satEdgesGeo, satEdgesMat));
      const scale = 0.78 + (i % 3) * 0.18;
      mesh.scale.setScalar(scale);
      heroGroup.add(mesh);

      satellites.push({
        mesh,
        radius: 1.72 + (i % 3) * 0.28, // max radius = 2.28 (cleanly inside right bounds)
        angleOffset: (i / satelliteCount) * Math.PI * 2,
        speed: 0.36 + (i % 3) * 0.12,
        yAmp: 0.55 + (i % 2) * 0.35,
        tilt: (i % 2 === 0 ? 1 : -1) * (0.4 + i * 0.1),
      });
    }

    // 5. Soft bokeh depth starfield
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

    // Interactive pointer parallax + drag-to-spin 3D inertia
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
        dragState.velY = dx * 0.008;
        dragState.velX = dy * 0.006;
        dragState.rotY += dragState.velY;
        dragState.rotX = Math.max(
          -0.85,
          Math.min(0.85, dragState.rotX + dragState.velX)
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
      { rootMargin: "160px" }
    );
    visibilityObserver.observe(container);

    const renderFrame = () => {
      if (isHeroVisible) {
        const elapsed = (performance.now() - startTime) * 0.001;
        const theme =
          CHAPTER_THEMES[activeChapterRef.current] ?? CHAPTER_THEMES[0];

        pointer.x += (pointer.targetX - pointer.x) * 0.05;
        pointer.y += (pointer.targetY - pointer.y) * 0.05;

        // Smoothly decay stage-switch pulse wave
        pulseTriggerRef.current *= 0.945;
        const pulse = pulseTriggerRef.current;

        // Color morphing toward active chapter
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
        reactiveRim.color.lerp(targetLightCol, 0.045);
        haloMat.color.lerp(targetHaloCol, 0.045);

        if (!dragState.isDragging) {
          dragState.rotY += dragState.velY;
          dragState.rotX = Math.max(
            -0.85,
            Math.min(0.85, dragState.rotX + dragState.velX)
          );
          dragState.velY *= 0.94;
          dragState.velX *= 0.94;
        }

        // Automated camera subtle breathing & parallax drift
        camera.position.x += (pointer.x * 0.24 - camera.position.x) * 0.04;
        camera.position.y +=
          (0.12 + pointer.y * 0.16 + Math.sin(elapsed * 0.45) * 0.08 - camera.position.y) *
          0.04;

        // Smoothly maintain non-overlapping sculpture placement + gentle hover bob
        heroGroup.position.x += (layoutTarget.baseX - heroGroup.position.x) * 0.08;
        const bobY = layoutTarget.baseY + Math.sin(elapsed * 0.95) * 0.1;
        heroGroup.position.y += (bobY - heroGroup.position.y) * 0.08;

        const breathScale =
          layoutTarget.scale * (1 + Math.sin(elapsed * 1.1) * 0.014 + pulse * 0.045);
        heroGroup.scale.setScalar(
          heroGroup.scale.x + (breathScale - heroGroup.scale.x) * 0.09
        );

        heroGroup.rotation.y = elapsed * 0.16 + pointer.x * 0.22 + dragState.rotY;
        heroGroup.rotation.x =
          Math.sin(elapsed * 0.28) * 0.09 - pointer.y * 0.16 + dragState.rotX;

        shellMesh.rotation.y = -elapsed * 0.2;
        shellMesh.rotation.z = elapsed * 0.12;
        const shellPulse = 1 + pulse * 0.06;
        shellMesh.scale.setScalar(shellPulse);

        const haloScale = 4.0 + Math.sin(elapsed * 1.4) * 0.25 + pulse * 0.7;
        coreHalo.scale.set(haloScale, haloScale, 1);
        haloMat.opacity = 0.36 + pulse * 0.18;

        const pulseBoost = 1 + pulse * 2.2;
        ringItems.forEach((item, idx) => {
          item.group.rotation.z += item.speedZ * 0.008 * pulseBoost;
          item.group.rotation.y =
            item.baseY + elapsed * item.speedY * 0.35 + Math.sin(elapsed * 0.5 + idx) * 0.08;
          item.group.rotation.x =
            item.baseX + Math.cos(elapsed * 0.45 + idx) * 0.08;
        });

        satellites.forEach((sat, idx) => {
          const theta = elapsed * sat.speed * (1 + pulse * 0.4) + sat.angleOffset;
          sat.mesh.position.x = Math.cos(theta) * sat.radius;
          sat.mesh.position.z = Math.sin(theta) * sat.radius;
          sat.mesh.position.y = Math.sin(theta + sat.tilt) * sat.yAmp;
          sat.mesh.rotation.x = elapsed * 0.7 + idx;
          sat.mesh.rotation.y = elapsed * 0.9;
        });

        starField.rotation.y = elapsed * 0.014 + pointer.x * 0.035;
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
