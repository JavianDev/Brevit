"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
  variant?: "full" | "mark";
}

export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="32" height="32" rx="7" fill="#000000" />
      <rect width="32" height="32" rx="7" fill="url(#logo-bg)" opacity="0.3" />
      {/* Left vertical bar */}
      <rect x="7" y="6.5" width="3.2" height="19" rx="1.6" fill="#7EF8D8" />
      {/* B right side - upper bump */}
      <path
        d="M10.2 7 H20.5 C23.2 7 25.5 9 25.5 11.5 C25.5 14 23.2 16 20.5 16 H10.2"
        stroke="#7EF8D8"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* B right side - lower bump */}
      <path
        d="M10.2 16 H21 C23.8 16 26 18.2 26 21 C26 23.8 23.8 25.5 21 25.5 H10.2"
        stroke="#7EF8D8"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Compression arrow hint on middle bar */}
      <path
        d="M14 14.5 L17 16 L14 17.5"
        stroke="#7EF8D8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.5"
      />
      <defs>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7EF8D8" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Logo({ className, size = 32, showWordmark = true, variant = "full" }: LogoProps) {
  if (variant === "mark") {
    return <LogoMark size={size} className={className} />;
  }

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark size={size} />
      {showWordmark && (
        <span
          className="font-semibold tracking-tight"
          style={{
            fontSize: size * 0.65,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          brevit
        </span>
      )}
    </div>
  );
}
