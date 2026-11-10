"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

function createBokehTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const grad = ctx.createRadialGradient(64, 64, 1, 64, 64, 62);
  grad.addColorStop(0, "rgba(255, 255, 255, 1)");
  grad.addColorStop(0.25, "rgba(224, 231, 255, 0.85)");
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

export default function ThreeHeroScene() {
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

    const isMobile = window.innerWidth < 768;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.4 : 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "pan-y";

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // Studio IBL environment map so metallic & glass 3D surfaces have true reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.72;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.15, isMobile ? 9.4 : 7.5);

    // Dramatic 3-point key, rim & fill lighting
    const keyLight = new THREE.DirectionalLight(0xe0e7ff, 2.8);
    keyLight.position.set(5, 6, 5);
    scene.add(keyLight);

    const cyanRim = new THREE.PointLight(0x38bdf8, 22, 22);
    cyanRim.position.set(-4.5, 2.5, 2.5);
    scene.add(cyanRim);

    const violetRim = new THREE.PointLight(0xa855f7, 24, 24);
    violetRim.position.set(4.5, -2.5, 2.5);
    scene.add(violetRim);

    const goldAccent = new THREE.PointLight(0xfbbf24, 14, 18);
    goldAccent.position.set(1.5, 4.2, -3);
    scene.add(goldAccent);

    const disposableGeos: THREE.BufferGeometry[] = [];
    const disposableMats: THREE.Material[] = [];
    const disposableTextures: THREE.Texture[] = [];

    const bokehTex = createBokehTexture();
    if (bokehTex) disposableTextures.push(bokehTex);

    // Master hero sculpture positioned on the right on desktop
    const heroGroup = new THREE.Group();
    heroGroup.position.set(isMobile ? 0 : 2.35, isMobile ? 0.55 : 0.0, 0);
    scene.add(heroGroup);

    // 1. Custom GLSL Fresnel + Animated Energy Core Sphere (deep obsidian center, blazing rim)
    const coreGeo = new THREE.SphereGeometry(0.92, 64, 64);
    const coreShaderMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uInnerColor: { value: new THREE.Color(0x070a1c) },
        uRimColorA: { value: new THREE.Color(0x38bdf8) },
        uRimColorB: { value: new THREE.Color(0xa855f7) },
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
        uniform vec3 uInnerColor;
        uniform vec3 uRimColorA;
        uniform vec3 uRimColorB;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec3 vLocalPos;

        void main() {
          float ndotv = clamp(dot(normalize(vNormal), normalize(vViewDir)), 0.0, 1.0);
          float fresnel = pow(1.0 - ndotv, 2.6);
          float band = 0.5 + 0.5 * sin(vLocalPos.y * 5.0 - uTime * 1.4 + vLocalPos.x * 3.0);
          vec3 rim = mix(uRimColorA, uRimColorB, band);
          float coreGlow = 0.12 * smoothstep(0.4, 1.0, band) * (1.0 - ndotv);
          vec3 finalColor = mix(uInnerColor, rim, clamp(fresnel * 1.18 + coreGlow, 0.0, 1.0));
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
    const coreSphere = new THREE.Mesh(coreGeo, coreShaderMat);
    heroGroup.add(coreSphere);
    disposableGeos.push(coreGeo);
    disposableMats.push(coreShaderMat);

    // 2. Sculpted Glass Geodesic Shell around the core (glossy translucent facets + crisp brushed metal edge cage)
    const shellGeo = new THREE.IcosahedronGeometry(1.36, 1);
    const shellGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e1b4b,
      metalness: 0.15,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      reflectivity: 1.0,
      transparent: true,
      opacity: 0.24,
      side: THREE.FrontSide,
      depthWrite: false,
    });
    const shellMesh = new THREE.Mesh(shellGeo, shellGlassMat);
    heroGroup.add(shellMesh);

    const shellEdgesGeo = new THREE.EdgesGeometry(shellGeo);
    const shellEdgesMat = new THREE.LineBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.45,
    });
    const shellEdges = new THREE.LineSegments(shellEdgesGeo, shellEdgesMat);
    shellMesh.add(shellEdges);
    disposableGeos.push(shellGeo, shellEdgesGeo);
    disposableMats.push(shellGlassMat, shellEdgesMat);

    // 3. True 3D Sculpted Metallic Gimbal Rings (real 3D tubular thickness + specular studio shine)
    const ringDefs = [
      {
        radius: 1.88,
        tube: 0.036,
        color: 0x1e293b,
        emissive: 0x0284c7,
        accentColor: 0x38bdf8,
        rotX: 1.05,
        rotY: 0.42,
        speedX: 0.0,
        speedY: 0.28,
        speedZ: 0.36,
      },
      {
        radius: 2.24,
        tube: 0.03,
        color: 0x1e1b4b,
        emissive: 0x7c3aed,
        accentColor: 0xc084fc,
        rotX: -0.78,
        rotY: 0.85,
        speedX: 0.18,
        speedY: -0.22,
        speedZ: -0.28,
      },
      {
        radius: 2.62,
        tube: 0.024,
        color: 0x1e293b,
        emissive: 0xd97706,
        accentColor: 0xfbbf24,
        rotX: 0.48,
        rotY: -0.92,
        speedX: -0.14,
        speedY: 0.18,
        speedZ: 0.22,
      },
    ];

    const ringItems: {
      group: THREE.Group;
      speedX: number;
      speedY: number;
      speedZ: number;
    }[] = [];

    ringDefs.forEach((def) => {
      const rGroup = new THREE.Group();
      rGroup.rotation.set(def.rotX, def.rotY, 0);

      const torusGeo = new THREE.TorusGeometry(def.radius, def.tube, 24, 140);
      const torusMat = new THREE.MeshPhysicalMaterial({
        color: def.color,
        emissive: def.emissive,
        emissiveIntensity: 0.3,
        metalness: 0.92,
        roughness: 0.16,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      });
      const torus = new THREE.Mesh(torusGeo, torusMat);
      rGroup.add(torus);

      // Luminous accent arc node riding on each 3D gimbal ring
      const nodeGeo = new RoundedBoxGeometry(0.14, 0.14, 0.14, 3, 0.03);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: def.accentColor,
        emissive: def.accentColor,
        emissiveIntensity: 1.15,
        metalness: 0.4,
        roughness: 0.2,
      });
      const nodeA = new THREE.Mesh(nodeGeo, nodeMat);
      nodeA.position.set(def.radius, 0, 0);
      rGroup.add(nodeA);

      const nodeB = new THREE.Mesh(nodeGeo, nodeMat);
      nodeB.position.set(-def.radius, 0, 0);
      rGroup.add(nodeB);

      disposableGeos.push(torusGeo, nodeGeo);
      disposableMats.push(torusMat, nodeMat);
      heroGroup.add(rGroup);
      ringItems.push({
        group: rGroup,
        speedX: def.speedX,
        speedY: def.speedY,
        speedZ: def.speedZ,
      });
    });

    // 4. Floating 3D Beveled Architectural Satellites orbiting at varied Z depths
    const satelliteCount = isMobile ? 5 : 8;
    const satGeo = new RoundedBoxGeometry(0.24, 0.24, 0.24, 4, 0.045);
    const satGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x312e81,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.22,
      metalness: 0.85,
      roughness: 0.12,
      clearcoat: 1.0,
    });
    const satEdgesGeo = new THREE.EdgesGeometry(satGeo);
    const satEdgesMat = new THREE.LineBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.55,
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
      const scale = 0.72 + (i % 3) * 0.22;
      mesh.scale.setScalar(scale);
      heroGroup.add(mesh);

      satellites.push({
        mesh,
        radius: 2.05 + (i % 4) * 0.36,
        angleOffset: (i / satelliteCount) * Math.PI * 2,
        speed: 0.28 + (i % 3) * 0.1,
        yAmp: 0.55 + (i % 2) * 0.45,
        tilt: (i % 2 === 0 ? 1 : -1) * (0.3 + i * 0.08),
      });
    }

    // 5. Soft depth bokeh starfield (circular particles, zero square artifacts)
    const starCount = isMobile ? 280 : 720;
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
      size: isMobile ? 0.13 : 0.11,
      map: bokehTex ?? undefined,
      vertexColors: true,
      transparent: true,
      opacity: 0.78,
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
        dragState.rotX = Math.max(-0.85, Math.min(0.85, dragState.rotX + dragState.velX));
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
    window.addEventListener("pointermove", handleWindowPointerMove, { passive: true });
    window.addEventListener("pointerup", handleWindowPointerUp);

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    let frameId = 0;
    const startTime = performance.now();

    const renderFrame = () => {
      const elapsed = (performance.now() - startTime) * 0.001;

      pointer.x += (pointer.targetX - pointer.x) * 0.05;
      pointer.y += (pointer.targetY - pointer.y) * 0.05;

      if (!dragState.isDragging) {
        dragState.rotY += dragState.velY;
        dragState.rotX = Math.max(-0.85, Math.min(0.85, dragState.rotX + dragState.velX));
        dragState.velY *= 0.94;
        dragState.velX *= 0.94;
      }

      coreShaderMat.uniforms.uTime.value = elapsed;

      heroGroup.rotation.y = elapsed * 0.14 + pointer.x * 0.25 + dragState.rotY;
      heroGroup.rotation.x = Math.sin(elapsed * 0.24) * 0.08 - pointer.y * 0.18 + dragState.rotX;
      heroGroup.position.y = (isMobile ? 0.55 : 0.0) + Math.sin(elapsed * 0.9) * 0.11;

      shellMesh.rotation.y = -elapsed * 0.18;
      shellMesh.rotation.z = elapsed * 0.11;

      ringItems.forEach((item) => {
        item.group.rotation.z += item.speedZ * 0.007;
        item.group.rotation.y += item.speedY * 0.003;
      });

      satellites.forEach((sat, idx) => {
        const theta = elapsed * sat.speed + sat.angleOffset;
        sat.mesh.position.x = Math.cos(theta) * sat.radius;
        sat.mesh.position.z = Math.sin(theta) * sat.radius;
        sat.mesh.position.y = Math.sin(theta + sat.tilt) * sat.yAmp;
        sat.mesh.rotation.x = elapsed * 0.6 + idx;
        sat.mesh.rotation.y = elapsed * 0.8;
      });

      starField.rotation.y = elapsed * 0.012 + pointer.x * 0.04;
      starField.rotation.x = pointer.y * 0.03;

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

    return () => {
      window.cancelAnimationFrame(frameId);
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
        className="pointer-events-none animate-pulse-slow absolute right-[10%] top-[18%] h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none animate-pulse-slow absolute left-[15%] bottom-[20%] h-64 w-64 rounded-full bg-sky-500/10 blur-3xl"
      />
      <div ref={containerRef} className="relative h-full w-full" />
    </div>
  );
}
