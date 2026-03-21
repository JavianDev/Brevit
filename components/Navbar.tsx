"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X, ExternalLink, Github, Zap, BookOpen, Code2, FlaskConical, FileText, BarChart3, Layers } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Docs",
    items: [
      { label: "Getting Started", href: "/docs/javascript", icon: Zap, desc: "Install and set up Brevit" },
      { label: "JavaScript SDK", href: "/docs/javascript", icon: Code2, desc: "npm install brevit" },
      { label: "Python SDK", href: "/docs/python", icon: Code2, desc: "pip install brevit" },
      { label: ".NET SDK", href: "/docs/dotnet", icon: Code2, desc: "dotnet add package Brevit" },
      { label: "API Reference", href: "/api-reference", icon: BookOpen, desc: "Complete method reference" },
    ],
  },
  {
    label: "Standard",
    items: [
      { label: "The Brevit Format", href: "/standard#format", icon: FileText, desc: "BFS notation specification" },
      { label: "Annotation Syntax", href: "/standard#annotations", icon: Layers, desc: "@alias=prefix syntax" },
      { label: "Format Spec v1.0", href: "/standard#spec", icon: BarChart3, desc: "Versioned format definition" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Playground", href: "/playground", icon: FlaskConical, desc: "Try Brevit in your browser" },
      { label: "Benchmarks", href: "/#benchmarks", icon: BarChart3, desc: "Token savings data" },
      { label: "Changelog", href: "/#changelog", icon: FileText, desc: "Version history" },
      {
        label: "GitHub",
        href: "https://github.com/JavianDev",
        icon: Github,
        desc: "View source",
        external: true,
      },
    ],
  },
];

interface DropdownItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  desc: string;
  external?: boolean;
}

function DropdownMenu({ items, onClose }: { items: DropdownItem[]; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 rounded-xl overflow-hidden z-50"
      style={{
        background: "rgba(10,10,16,0.95)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(126,248,216,0.05)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="p-1.5">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            onClick={onClose}
            className="flex items-start gap-3 px-3 py-2.5 rounded-lg group transition-colors duration-150"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(126,248,216,0.06)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <span
              className="mt-0.5 p-1.5 rounded-md flex-shrink-0"
              style={{ background: "rgba(126,248,216,0.1)", color: "var(--accent)" }}
            >
              <item.icon size={14} />
            </span>
            <span>
              <span className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {item.label}
                {item.external && <ExternalLink size={11} className="inline ml-1 opacity-50" />}
              </span>
              <span className="block text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {item.desc}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

export function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <>
      <motion.nav
        ref={navRef}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(0,0,0,0.85)" : "transparent",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo size={28} showWordmark />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((nav) => (
              <div key={nav.label} className="relative">
                <button
                  onClick={() => setOpenMenu(openMenu === nav.label ? null : nav.label)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
                  style={{ color: openMenu === nav.label ? "var(--text-primary)" : "var(--text-secondary)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = openMenu === nav.label ? "var(--text-primary)" : "var(--text-secondary)"; e.currentTarget.style.background = "transparent"; }}
                >
                  {nav.label}
                  <ChevronDown
                    size={14}
                    className="transition-transform duration-200"
                    style={{ transform: openMenu === nav.label ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>
                <AnimatePresence>
                  {openMenu === nav.label && (
                    <DropdownMenu items={nav.items} onClose={() => setOpenMenu(null)} />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right side CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/playground"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
              style={{ color: "var(--text-secondary)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
            >
              <FlaskConical size={13} />
              Playground
            </Link>
            <Link
              href="/docs/javascript"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
              style={{ background: "var(--accent)", color: "#000" }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg"
            style={{ color: "var(--text-secondary)" }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-14 z-40 md:hidden"
            style={{
              background: "rgba(0,0,0,0.97)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="max-w-6xl mx-auto px-5 py-4 space-y-1">
              {NAV_ITEMS.map((nav) => (
                <div key={nav.label}>
                  <p className="text-xs font-semibold uppercase tracking-widest px-2 py-1.5" style={{ color: "var(--text-muted)" }}>
                    {nav.label}
                  </p>
                  {nav.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <item.icon size={14} style={{ color: "var(--accent)" }} />
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}
              <div className="pt-3 pb-2 flex flex-col gap-2">
                <Link
                  href="/playground"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium"
                  style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-primary)" }}
                  onClick={() => setMobileOpen(false)}
                >
                  <FlaskConical size={14} />
                  Playground
                </Link>
                <Link
                  href="/docs/javascript"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium"
                  style={{ background: "var(--accent)", color: "#000" }}
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
