import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 38,
          background: "linear-gradient(145deg, #171333, #030614)",
          border: "6px solid #8b5cf6",
          color: "white",
          fontSize: 58,
          fontWeight: 700,
          letterSpacing: -4,
        }}
      >
        KR
      </div>
    ),
    size,
  );
}
