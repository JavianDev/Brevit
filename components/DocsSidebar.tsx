"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "getting-started", label: "Getting Started" },
  { id: "installation", label: "Installation" },
  { id: "configuration", label: "Configuration" },
  { id: "json-optimization", label: "JSON Optimization" },
  { id: "abbreviations", label: "Abbreviations" },
  { id: "text-optimization", label: "Text Optimization" },
  { id: "image-optimization", label: "Image Optimization" },
  { id: "custom-strategies", label: "Custom Strategies" },
  { id: "api-reference", label: "API Reference" },
  { id: "examples", label: "Examples" },
];

const SDKS = [
  { id: "javascript", label: "JavaScript", badge: "npm" },
  { id: "python", label: "Python", badge: "pip" },
  { id: "dotnet", label: ".NET", badge: "dotnet" },
];

export function DocsSidebar({ activeSection }: { activeSection?: string }) {
  const pathname = usePathname();
  const currentSdk = pathname?.split("/")[2] || "javascript";

  return (
    <aside className="w-56 flex-shrink-0">
      {/* SDK Switcher */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
          SDK
        </p>
        <div className="space-y-0.5">
          {SDKS.map((sdk) => (
            <Link
              key={sdk.id}
              href={`/docs/${sdk.id}`}
              className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-sm transition-all"
              style={{
                background: currentSdk === sdk.id ? "rgba(126,248,216,0.08)" : "transparent",
                color: currentSdk === sdk.id ? "var(--accent)" : "var(--text-muted)",
              }}
            >
              {sdk.label}
              <span
                className="text-xs px-1.5 py-0.5 rounded font-mono"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "var(--text-muted)",
                }}
              >
                {sdk.badge}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
          Contents
        </p>
        <nav className="space-y-0.5">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm transition-all"
              style={{
                color: activeSection === section.id ? "var(--text-primary)" : "var(--text-muted)",
                background: activeSection === section.id ? "rgba(255,255,255,0.04)" : "transparent",
              }}
            >
              {activeSection === section.id && (
                <ChevronRight size={12} style={{ color: "var(--accent)", flexShrink: 0 }} />
              )}
              {section.label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
