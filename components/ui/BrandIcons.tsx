import type { ReactNode } from "react";

export function GitHubIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function LinkedInIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" />
    </svg>
  );
}

export function FacebookIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12Z" />
    </svg>
  );
}

export function TelegramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38Z" />
    </svg>
  );
}

export function JavaScriptIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <rect width="24" height="24" rx="4" fill="#F7DF1E" />
      <path
        d="M13.6 17.6c.45.74 1.03 1.28 2.06 1.28.86 0 1.42-.43 1.42-1.03 0-.72-.57-.97-1.52-1.39l-.52-.22c-1.51-.64-2.51-1.45-2.51-3.15 0-1.57 1.2-2.76 3.06-2.76 1.33 0 2.28.46 2.97 1.67l-1.63 1.04c-.36-.64-.74-.9-1.34-.9-.61 0-1 .39-1 .9 0 .63.39.88 1.28 1.27l.52.22c1.77.76 2.78 1.54 2.78 3.28 0 1.88-1.48 2.91-3.47 2.91-1.94 0-3.2-.92-3.82-2.14l1.72-.98Zm-7.18.17c.33.58.62 1.07 1.34 1.07.69 0 1.12-.27 1.12-1.31V10.5h2.09v7.06c0 2.14-1.26 3.12-3.09 3.12-1.66 0-2.62-.86-3.11-1.89l1.65-1.02Z"
        fill="#111827"
      />
    </svg>
  );
}

export function TypeScriptIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <rect width="24" height="24" rx="4" fill="#3178C6" />
      <path
        d="M11.6 12.2H9.3v8.4H7.2v-8.4H4.9v-1.7h6.7v1.7Zm2.2 6.2c.46.53 1.18.88 2.02.88.86 0 1.37-.37 1.37-.92 0-.52-.39-.77-1.44-1.15l-.52-.19c-1.42-.51-2.29-1.22-2.29-2.74 0-1.57 1.22-2.67 3.04-2.67 1.18 0 2.12.34 2.81 1.03l-1.08 1.41c-.52-.43-1.07-.67-1.72-.67-.72 0-1.17.34-1.17.83 0 .52.42.75 1.36 1.1l.52.19c1.56.56 2.41 1.31 2.41 2.8 0 1.72-1.31 2.86-3.36 2.86-1.38 0-2.55-.47-3.25-1.28l1.28-1.48Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function PythonIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d="M11.9 2C8.6 2 8.8 3.45 8.8 3.45l.01 1.5h3.15v.45H7.55S5.4 5.15 5.4 8.5c0 3.35 1.88 3.23 1.88 3.23h1.12v-1.55s-.06-1.88 1.85-1.88h3.18s1.79.03 1.79-1.73V3.75S15.49 2 11.9 2Zm-1.77 1.02c.32 0 .58.26.58.58s-.26.58-.58.58a.58.58 0 0 1-.58-.58c0-.32.26-.58.58-.58Z"
        fill="#3776AB"
      />
      <path
        d="M12.1 22c3.3 0 3.1-1.45 3.1-1.45l-.01-1.5h-3.15v-.45h4.41s2.15.25 2.15-3.1c0-3.35-1.88-3.23-1.88-3.23H15.6v1.55s.06 1.88-1.85 1.88h-3.18s-1.79-.03-1.79 1.73v2.82S8.51 22 12.1 22Zm1.77-1.02a.58.58 0 0 1-.58-.58c0-.32.26-.58.58-.58s.58.26.58.58-.26.58-.58.58Z"
        fill="#FFD43B"
      />
    </svg>
  );
}

export function PhpIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <ellipse cx="12" cy="12" rx="11" ry="6.8" fill="#777BB4" />
      <text
        x="12"
        y="14.2"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="6.6"
        fontWeight="800"
        fontStyle="italic"
        fontFamily="system-ui, sans-serif"
      >
        php
      </text>
    </svg>
  );
}

export function Html5Icon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M4 3h16l-1.45 16.2L12 21l-6.55-1.8L4 3Z" fill="#E34F26" />
      <path d="M12 4.3v15.3l5.3-1.46L18.5 4.3H12Z" fill="#EF652A" />
      <path
        d="M7.2 7.5h9.6l-.22 2.1H9.5l.2 2.1h6.66l-.56 5.6L12 18.4l-3.8-1.1-.26-2.8h2.08l.14 1.38 1.84.5 1.84-.5.2-2.08H7.76L7.2 7.5Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function Css3Icon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M4 3h16l-1.45 16.2L12 21l-6.55-1.8L4 3Z" fill="#1572B6" />
      <path d="M12 4.3v15.3l5.3-1.46L18.5 4.3H12Z" fill="#33A9DC" />
      <path
        d="M7.3 7.5h9.4l-.2 2.1H9.7l.18 1.9h6.46l-.56 5.8-3.78 1.1-3.78-1.1-.25-2.7h2.06l.13 1.3 1.84.5 1.84-.5.22-2.2H7.9l-.2-2.1h6.48l.18-2H7.5l-.2-2.1Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function ReactIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="2.1" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="1.35" fill="none">
        <ellipse cx="12" cy="12" rx="9.5" ry="3.8" />
        <ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(120 12 12)" />
      </g>
    </svg>
  );
}

export function NextJsIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="10.2" fill="#090D16" stroke="#FFFFFF" strokeWidth="1.2" />
      <path d="M8.5 16.5V7.8h1.45l6.8 9.25-.98.65-5.85-7.95v6.75H8.5Z" fill="#FFFFFF" />
      <rect x="14.4" y="7.8" width="1.35" height="5.4" fill="#FFFFFF" />
    </svg>
  );
}

export function TailwindIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C15.61 7.15 14.47 6 12 6Zm-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C10.61 13.15 9.47 12 7 12Z"
        fill="#38BDF8"
      />
    </svg>
  );
}

export function VueIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M2 4h4l6 10.4L18 4h4L12 21 2 4Z" fill="#41B883" />
      <path d="M6 4h3.7L12 8l2.3-4H18l-6 10.4L6 4Z" fill="#35495E" />
    </svg>
  );
}

export function BootstrapIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <rect x="2" y="3" width="20" height="18" rx="4.5" fill="#7952B3" />
      <path
        d="M9 7.2h3.8c1.9 0 3.1.9 3.1 2.4 0 1-.55 1.8-1.5 2.1 1.25.28 2 1.15 2 2.38 0 1.72-1.32 2.72-3.45 2.72H9V7.2Zm2.05 3.9h1.55c.9 0 1.42-.43 1.42-1.15 0-.72-.52-1.13-1.42-1.13h-1.55v2.28Zm0 4.08h1.75c1.02 0 1.6-.46 1.6-1.26 0-.8-.58-1.25-1.6-1.25h-1.75v2.51Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function NodeJsIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d="M12 2 3.3 7v10L12 22l8.7-5V7L12 2Z"
        fill="#5FA04E"
      />
      <path
        d="M12 4.2 5.2 8.1v7.8L12 19.8l6.8-3.9V8.1L12 4.2Z"
        fill="#2C5123"
        opacity="0.32"
      />
      <text
        x="12"
        y="14.2"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="6.4"
        fontWeight="800"
        fontFamily="system-ui, sans-serif"
      >
        JS
      </text>
    </svg>
  );
}

export function LaravelIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d="M21.2 9.4 17.5 7.2 13.8 9.4v4.3l-3.7 2.15-3.7-2.15V5.1L2.7 7.25v8.6l7.4 4.3 7.4-4.3v-4.3l3.7-2.15Z"
        fill="none"
        stroke="#FF2D20"
        strokeWidth="1.65"
        strokeLinejoin="round"
      />
      <path
        d="M6.4 9.4 10.1 7.25v4.3l-3.7 2.15M10.1 15.85v4.3"
        fill="none"
        stroke="#FF2D20"
        strokeWidth="1.65"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RestApiIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="6" cy="12" r="2.4" fill="#38BDF8" />
      <circle cx="18" cy="6.5" r="2.4" fill="#818CF8" />
      <circle cx="18" cy="17.5" r="2.4" fill="#34D399" />
      <path
        d="M8.1 10.9 15.8 7.5M8.1 13.1l7.7 3.4"
        stroke="#93C5FD"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MySqlIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <ellipse cx="12" cy="6.2" rx="7.2" ry="2.7" fill="#00758F" stroke="#38BDF8" strokeWidth="1.2" />
      <path
        d="M4.8 6.2v11.2c0 1.5 3.22 2.7 7.2 2.7s7.2-1.2 7.2-2.7V6.2"
        stroke="#38BDF8"
        strokeWidth="1.35"
        fill="#00758F"
        fillOpacity="0.45"
      />
      <path
        d="M4.8 11.8c0 1.5 3.22 2.7 7.2 2.7s7.2-1.2 7.2-2.7"
        stroke="#F29111"
        strokeWidth="1.45"
      />
    </svg>
  );
}

export function MongoDbIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d="M12.2 2.4c-.3.7-.7 1.1-1.3 1.7C8.4 6.4 7.2 9.4 7.5 13c.2 2.6 1.5 4.8 3.9 6.3l.4.3.2 2h.8l.2-2 .4-.3c2.3-1.5 3.6-3.7 3.8-6.3.3-3.6-.9-6.6-3.4-8.9-.6-.6-1-.9-1.6-1.7Z"
        fill="#47A248"
      />
      <path d="M12 6.8v12.8" stroke="#A7F3D0" strokeWidth="1.15" strokeLinecap="round" />
    </svg>
  );
}

export function GitIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d="M21.4 11.1 12.9 2.6a1.3 1.3 0 0 0-1.8 0L9.3 4.4l2.2 2.2a1.55 1.55 0 0 1 1.97 1.97l2.12 2.12a1.55 1.55 0 1 1-.93.9l-1.98-1.98v5.22a1.55 1.55 0 1 1-1.28-.04V9.48a1.55 1.55 0 0 1-.84-2.03L8.38 5.28 2.6 11.1a1.3 1.3 0 0 0 0 1.8l8.5 8.5a1.3 1.3 0 0 0 1.8 0l8.5-8.5a1.3 1.3 0 0 0 0-1.8Z"
        fill="#F05032"
      />
    </svg>
  );
}

export function FigmaIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M9 3h3v6H9a3 3 0 0 1 0-6Z" fill="#F24E1E" />
      <path d="M12 3h3a3 3 0 0 1 0 6h-3V3Z" fill="#FF7262" />
      <path d="M9 9h3v6H9a3 3 0 0 1 0-6Z" fill="#A259FF" />
      <circle cx="15" cy="12" r="3" fill="#1ABCFE" />
      <path d="M9 15h3v3a3 3 0 0 1-3-3Zm0 0a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1 0-6Z" fill="#0ACF83" />
    </svg>
  );
}

export function ThreeJsIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M4 19 12 4l8 15H4Z" stroke="#FFFFFF" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8 19l4-7.5L16 19M10 15.3h4" stroke="#38BDF8" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export function FramerMotionIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M4 3h16v6h-8L4 3Zm0 6h8l8 6H4V9Zm0 6h8v6l-8-6Z" fill="#BB4B96" />
    </svg>
  );
}

export interface TechVisualMeta {
  color: string;
  glow: string;
  bg: string;
  border: string;
  icon: ReactNode;
}

export function getTechVisualMeta(name: string, size: "sm" | "md" = "md"): TechVisualMeta {
  const key = name.toLowerCase();
  const iconCls = size === "sm" ? "h-4 w-4" : "h-6 w-6";
  const dualCls = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";

  if (key.includes("javascript")) {
    return {
      color: "#F7DF1E",
      glow: "rgba(247, 223, 30, 0.24)",
      bg: "rgba(247, 223, 30, 0.12)",
      border: "rgba(247, 223, 30, 0.35)",
      icon: <JavaScriptIcon className={iconCls} />,
    };
  }
  if (key.includes("typescript")) {
    return {
      color: "#3178C6",
      glow: "rgba(49, 120, 198, 0.28)",
      bg: "rgba(49, 120, 198, 0.16)",
      border: "rgba(59, 130, 246, 0.42)",
      icon: <TypeScriptIcon className={iconCls} />,
    };
  }
  if (key.includes("python")) {
    return {
      color: "#FFD43B",
      glow: "rgba(55, 118, 171, 0.32)",
      bg: "rgba(55, 118, 171, 0.16)",
      border: "rgba(255, 212, 59, 0.38)",
      icon: <PythonIcon className={iconCls} />,
    };
  }
  if (key.includes("php")) {
    return {
      color: "#8993BE",
      glow: "rgba(119, 123, 180, 0.3)",
      bg: "rgba(119, 123, 180, 0.16)",
      border: "rgba(137, 147, 190, 0.42)",
      icon: <PhpIcon className={iconCls} />,
    };
  }
  if (key.includes("html")) {
    return {
      color: "#E34F26",
      glow: "rgba(227, 79, 38, 0.26)",
      bg: "rgba(227, 79, 38, 0.14)",
      border: "rgba(227, 79, 38, 0.38)",
      icon: (
        <span className="inline-flex items-center gap-1">
          <Html5Icon className={dualCls} />
          <Css3Icon className={dualCls} />
        </span>
      ),
    };
  }
  if (key.includes("react")) {
    return {
      color: "#61DAFB",
      glow: "rgba(97, 218, 251, 0.28)",
      bg: "rgba(97, 218, 251, 0.14)",
      border: "rgba(97, 218, 251, 0.4)",
      icon: <ReactIcon className={iconCls} />,
    };
  }
  if (key.includes("next")) {
    return {
      color: "#F8FAFC",
      glow: "rgba(248, 250, 252, 0.18)",
      bg: "rgba(255, 255, 255, 0.08)",
      border: "rgba(255, 255, 255, 0.3)",
      icon: <NextJsIcon className={iconCls} />,
    };
  }
  if (key.includes("tailwind")) {
    return {
      color: "#38BDF8",
      glow: "rgba(56, 189, 248, 0.28)",
      bg: "rgba(6, 182, 212, 0.16)",
      border: "rgba(56, 189, 248, 0.42)",
      icon: <TailwindIcon className={iconCls} />,
    };
  }
  if (key.includes("vue") || key.includes("bootstrap")) {
    return {
      color: "#41B883",
      glow: "rgba(65, 184, 131, 0.26)",
      bg: "rgba(65, 184, 131, 0.14)",
      border: "rgba(65, 184, 131, 0.38)",
      icon: (
        <span className="inline-flex items-center gap-1">
          <VueIcon className={dualCls} />
          <BootstrapIcon className={dualCls} />
        </span>
      ),
    };
  }
  if (key.includes("node")) {
    return {
      color: "#5FA04E",
      glow: "rgba(95, 160, 78, 0.28)",
      bg: "rgba(95, 160, 78, 0.15)",
      border: "rgba(95, 160, 78, 0.4)",
      icon: <NodeJsIcon className={iconCls} />,
    };
  }
  if (key.includes("laravel")) {
    return {
      color: "#FF2D20",
      glow: "rgba(255, 45, 32, 0.28)",
      bg: "rgba(255, 45, 32, 0.14)",
      border: "rgba(255, 45, 32, 0.38)",
      icon: <LaravelIcon className={iconCls} />,
    };
  }
  if (key.includes("rest") || key.includes("api")) {
    return {
      color: "#38BDF8",
      glow: "rgba(56, 189, 248, 0.26)",
      bg: "rgba(56, 189, 248, 0.14)",
      border: "rgba(56, 189, 248, 0.38)",
      icon: <RestApiIcon className={iconCls} />,
    };
  }
  if (key.includes("mysql") || key.includes("sql")) {
    return {
      color: "#F29111",
      glow: "rgba(0, 117, 143, 0.3)",
      bg: "rgba(0, 117, 143, 0.18)",
      border: "rgba(56, 189, 248, 0.4)",
      icon: <MySqlIcon className={iconCls} />,
    };
  }
  if (key.includes("mongo")) {
    return {
      color: "#47A248",
      glow: "rgba(71, 162, 72, 0.28)",
      bg: "rgba(71, 162, 72, 0.15)",
      border: "rgba(71, 162, 72, 0.4)",
      icon: <MongoDbIcon className={iconCls} />,
    };
  }
  if (key.includes("git")) {
    return {
      color: "#F05032",
      glow: "rgba(240, 80, 50, 0.26)",
      bg: "rgba(240, 80, 50, 0.14)",
      border: "rgba(240, 80, 50, 0.38)",
      icon: (
        <span className="inline-flex items-center gap-1">
          <GitIcon className={dualCls} />
          <GitHubIcon className={`${dualCls} text-white`} />
        </span>
      ),
    };
  }
  if (key.includes("figma")) {
    return {
      color: "#A259FF",
      glow: "rgba(162, 89, 255, 0.28)",
      bg: "rgba(162, 89, 255, 0.14)",
      border: "rgba(162, 89, 255, 0.38)",
      icon: <FigmaIcon className={iconCls} />,
    };
  }
  if (key.includes("three")) {
    return {
      color: "#38BDF8",
      glow: "rgba(56, 189, 248, 0.25)",
      bg: "rgba(56, 189, 248, 0.12)",
      border: "rgba(56, 189, 248, 0.35)",
      icon: <ThreeJsIcon className={iconCls} />,
    };
  }
  if (key.includes("framer")) {
    return {
      color: "#EC4899",
      glow: "rgba(236, 72, 153, 0.25)",
      bg: "rgba(187, 75, 150, 0.16)",
      border: "rgba(236, 72, 153, 0.38)",
      icon: <FramerMotionIcon className={iconCls} />,
    };
  }

  return {
    color: "#A5B4FC",
    glow: "rgba(129, 140, 248, 0.22)",
    bg: "rgba(99, 102, 241, 0.12)",
    border: "rgba(129, 140, 248, 0.32)",
    icon: <RestApiIcon className={iconCls} />,
  };
}
