import ThreeAmbientMount from "@/components/three/ThreeAmbientMount";

export default function AmbientBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden"
    >
      {/* Route-aware WebGL backdrop; keep the layer clear so the 3D scene stays visible. */}
      <ThreeAmbientMount />
    </div>
  );
}
