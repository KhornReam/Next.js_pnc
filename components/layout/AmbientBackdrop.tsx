import ThreeAmbientMount from "@/components/three/ThreeAmbientMount";

export default function AmbientBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden"
    >
      {/* 1. Deep Zenith Horizon Spotlight */}
      <div className="absolute inset-x-0 -top-48 h-[560px] bg-[radial-gradient(ellipse_75%_65%_at_50%_15%,rgba(79,70,229,0.22),rgba(56,189,248,0.08)_45%,transparent_75%)]" />

      {/* 2. Radial-Masked Architectural Grid & Precision Micro Dot Matrix */}
      <div className="backdrop-radial-mask cosmic-grid-bg absolute inset-0 opacity-85" />
      <div className="backdrop-radial-mask backdrop-dot-matrix absolute inset-0 opacity-35" />

      {/* 3. Balanced, GPU-Composited Atmospheric Nebulae */}
      <div className="animate-aurora-primary absolute -left-32 top-[16%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.12)_0%,transparent_70%)] sm:h-[540px] sm:w-[540px]" />
      <div className="animate-aurora-secondary absolute -right-28 top-[32%] h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.13)_0%,transparent_70%)] sm:h-[600px] sm:w-[600px]" />

      {/* 4. Subtle Footer Nadir Horizon Glow */}
      <div className="absolute inset-x-0 bottom-0 h-[380px] bg-[radial-gradient(ellipse_70%_70%_at_50%_100%,rgba(59,130,246,0.11),rgba(99,102,241,0.06)_48%,transparent_78%)]" />

      {/* 5. Persistent Route-Aware Full-Page 3D WebGL Backdrop (Subpages) */}
      <ThreeAmbientMount />

      {/* 6. Desktop Architectural Layout Column Guides (max-w-7xl) */}
      <div className="mx-auto hidden h-full max-w-7xl justify-between px-4 sm:px-6 lg:flex lg:px-8">
        <div className="h-full w-px bg-gradient-to-b from-white/[0.05] via-indigo-300/[0.045] to-transparent" />
        <div className="h-full w-px bg-gradient-to-b from-white/[0.05] via-indigo-300/[0.045] to-transparent" />
      </div>

      {/* 7. Soft Top-Edge & Side Readability Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_115%_95%_at_50%_45%,transparent_55%,rgba(2,4,12,0.55)_100%)]" />
    </div>
  );
}
