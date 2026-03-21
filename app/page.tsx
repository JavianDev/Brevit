"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroTokenCounter } from "@/components/HeroTokenCounter";
import { MiniDemo } from "@/components/MiniDemo";
import { TokenSavingsChart } from "@/components/TokenSavingsChart";
import { InstallTabs } from "@/components/InstallTabs";
import { CostCalculator } from "@/components/CostCalculator";
import {
  Zap, Layers, FileText, Code2, Puzzle, BarChart3,
  ArrowRight, FlaskConical, ChevronRight, Shield, Globe
} from "lucide-react";

function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`max-w-6xl mx-auto px-5 ${className}`}>
      {children}
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="h-px w-6" style={{ background: "var(--accent)" }} />
      <span className="text-xs font-mono font-semibold uppercase tracking-widest" style={{ color: "var(--accent)" }}>
        {children}
      </span>
    </div>
  );
}

const FEATURES = [
  {
    icon: Layers,
    title: "JSON Flattening",
    desc: "Transform nested JSON into dot-notation key-value pairs. Uniform arrays become compact tabular format — up to 60% fewer tokens.",
  },
  {
    icon: FileText,
    title: "Abbreviation Engine",
    desc: "Detects repeated key prefixes and auto-generates @alias shortcuts. An additional 10–25% reduction on top of flattening.",
  },
  {
    icon: BarChart3,
    title: "TextRank Compression",
    desc: "Deterministic extractive summarization using PageRank-style graph scoring. Lossless by default, ratio-controlled when needed.",
  },
  {
    icon: Code2,
    title: "Multi-Language",
    desc: "Identical API across JavaScript/TypeScript, Python, and C#/.NET. Same patterns, same output, everywhere.",
  },
  {
    icon: Puzzle,
    title: "Extensible Plugins",
    desc: "Register custom optimization strategies. Hook into LangChain, Semantic Kernel, Azure AI, or any system you use.",
  },
  {
    icon: Zap,
    title: "Zero Config",
    desc: "One line to compress any data structure. Smart auto-detection picks the right strategy — no configuration required.",
  },
];

const BADGES = [
  { label: "v1.0.2", color: "var(--accent)" },
  { label: "MIT", color: "var(--text-muted)" },
  { label: "JS · Python · .NET", color: "var(--text-muted)" },
  { label: "40–60% token savings", color: "var(--success)" },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="relative pt-14 overflow-hidden">
        {/* Grid background */}
        <div className="fixed inset-0 bg-grid opacity-100 pointer-events-none" />

        {/* ── Hero ───────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center">
          {/* Radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(126,248,216,0.07) 0%, transparent 70%)",
            }}
          />

          <div className="max-w-6xl mx-auto px-5 w-full py-24">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left */}
              <div>
                {/* Badge row */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {BADGES.map((b) => (
                    <span
                      key={b.label}
                      className="text-xs px-2.5 py-1 rounded-full font-mono"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: b.color,
                      }}
                    >
                      {b.label}
                    </span>
                  ))}
                </div>

                <h1
                  className="text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  Cut LLM costs by{" "}
                  <span className="text-gradient">60%.</span>
                  <br />
                  Without losing{" "}
                  <span style={{ color: "var(--text-secondary)" }}>meaning.</span>
                </h1>

                <p className="text-lg leading-relaxed mb-8 max-w-lg" style={{ color: "var(--text-secondary)" }}>
                  Brevit compresses structured data before it reaches your LLM — flattening JSON,
                  abbreviating repeated keys, and summarizing text. Same quality responses, fraction of the tokens.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/docs/javascript"
                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-150"
                    style={{ background: "var(--accent)", color: "#000" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
                  >
                    Get Started
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/playground"
                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-150"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "var(--text-primary)",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.08)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)"; }}
                  >
                    <FlaskConical size={14} />
                    Try Playground
                  </Link>
                </div>

                {/* Install strip */}
                <div
                  className="flex items-center gap-3 mt-8 px-4 py-3 rounded-xl w-fit"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <code className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>
                    npm install{" "}
                    <span style={{ color: "var(--accent)" }}>brevit</span>
                  </code>
                </div>
              </div>

              {/* Right — live token counter */}
              <div className="lg:pl-8">
                <HeroTokenCounter />
              </div>
            </div>
          </div>
        </section>

        {/* ── Live Demo ───────────────────────────────────────────── */}
        <Section className="py-24">
          <SectionLabel>Live Demo</SectionLabel>
          <h2 className="text-3xl font-bold tracking-tight mb-3" style={{ letterSpacing: "-0.02em" }}>
            See it in action
          </h2>
          <p className="text-base mb-8" style={{ color: "var(--text-secondary)" }}>
            Edit the JSON or paste your own. Brevit compresses instantly in your browser.
          </p>
          <div
            className="rounded-2xl p-6"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
            }}
          >
            <MiniDemo />
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/playground"
              className="inline-flex items-center gap-1.5 text-sm font-medium"
              style={{ color: "var(--accent)" }}
            >
              Open full playground <ChevronRight size={14} />
            </Link>
          </div>
        </Section>

        {/* ── Features ────────────────────────────────────────────── */}
        <Section className="py-24">
          <SectionLabel>Features</SectionLabel>
          <h2 className="text-3xl font-bold tracking-tight mb-12" style={{ letterSpacing: "-0.02em" }}>
            Everything you need to optimize LLM inputs
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className="rounded-xl p-5 transition-all duration-200 group"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(126,248,216,0.2)";
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(126,248,216,0.03)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLDivElement).style.background = "var(--bg-surface)";
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: "rgba(126,248,216,0.1)" }}
                >
                  <feature.icon size={18} style={{ color: "var(--accent)" }} />
                </div>
                <h3 className="font-semibold mb-2 text-sm">{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Token Savings Chart ─────────────────────────────────── */}
        <Section className="py-24" id="benchmarks">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <SectionLabel>Benchmarks</SectionLabel>
              <h2 className="text-3xl font-bold tracking-tight mb-4" style={{ letterSpacing: "-0.02em" }}>
                Real token savings, real data
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                Measured across realistic LLM workloads. Brevit consistently outperforms raw JSON and YAML,
                with tabular optimization delivering the highest compression ratios.
              </p>
              <ul className="space-y-3">
                {[
                  "40–60% average reduction across all data types",
                  "Up to 70% for primitive arrays",
                  "10–25% additional savings with abbreviation engine",
                  "Lossless by default — LLMs read Brevit format natively",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span className="mt-1 flex-shrink-0" style={{ color: "var(--success)" }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="rounded-2xl p-6"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
            >
              <TokenSavingsChart />
            </div>
          </div>
        </Section>

        {/* ── The Brevit Standard teaser ──────────────────────────── */}
        <Section className="py-20">
          <div
            className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(126,248,216,0.06) 0%, rgba(167,139,250,0.06) 100%)",
              border: "1px solid rgba(126,248,216,0.15)",
            }}
          >
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none"
              style={{ background: "rgba(126,248,216,0.08)", transform: "translate(30%, -30%)" }}
            />
            <div className="relative z-10 max-w-2xl">
              <span
                className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1 rounded-full mb-6"
                style={{
                  background: "rgba(126,248,216,0.1)",
                  border: "1px solid rgba(126,248,216,0.2)",
                  color: "var(--accent)",
                }}
              >
                <Shield size={11} />
                The Brevit Format Specification
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ letterSpacing: "-0.02em" }}>
                Brevit isn&apos;t just a library.
                <br />
                <span className="text-gradient">It&apos;s a notation standard.</span>
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                The Brevit Format Specification (BFS) defines a structured data notation optimized for LLM prompts —
                analogous to OpenAPI for REST APIs. Versioned, portable, and natively understood by any LLM.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/standard"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: "var(--accent)", color: "#000" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
                >
                  Read the Spec
                  <ArrowRight size={14} />
                </Link>
                <code
                  className="flex items-center px-4 py-3 rounded-xl text-sm font-mono"
                  style={{
                    background: "rgba(0,0,0,0.4)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "var(--accent)",
                  }}
                >
                  [brevit:1.0]
                </code>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Install Tabs ────────────────────────────────────────── */}
        <Section className="py-24">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <SectionLabel>Installation</SectionLabel>
              <h2 className="text-3xl font-bold tracking-tight mb-4" style={{ letterSpacing: "-0.02em" }}>
                One command to get started
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                Available on npm, PyPI, and NuGet. Same API design across all three — learn it once, use it everywhere.
              </p>
              <div className="space-y-3">
                {[
                  { icon: Globe, label: "JavaScript / TypeScript", href: "https://www.npmjs.com/package/brevit", badge: "npm" },
                  { icon: Code2, label: "Python 3.8+", href: "https://pypi.org/project/brevit/", badge: "PyPI" },
                  { icon: Code2, label: "C# / .NET 8", href: "https://www.nuget.org/packages/Brevit", badge: "NuGet" },
                ].map((pkg) => (
                  <a
                    key={pkg.label}
                    href={pkg.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(126,248,216,0.2)";
                      (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
                      (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)";
                    }}
                  >
                    <pkg.icon size={15} style={{ color: "var(--accent)" }} />
                    <span className="text-sm flex-1">{pkg.label}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-mono"
                      style={{ background: "rgba(126,248,216,0.1)", color: "var(--accent)" }}
                    >
                      {pkg.badge}
                    </span>
                  </a>
                ))}
              </div>
            </div>
            <InstallTabs />
          </div>
        </Section>

        {/* ── Cost Calculator ─────────────────────────────────────── */}
        <Section className="py-24" id="calculator">
          <SectionLabel>Cost Calculator</SectionLabel>
          <h2 className="text-3xl font-bold tracking-tight mb-3" style={{ letterSpacing: "-0.02em" }}>
            How much will you save?
          </h2>
          <p className="text-base mb-12" style={{ color: "var(--text-secondary)" }}>
            Adjust the sliders to estimate your annual savings with Brevit.
          </p>
          <CostCalculator />
        </Section>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <Section className="py-20">
          <div
            className="rounded-2xl text-center p-12"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
            }}
          >
            <h2 className="text-3xl font-bold tracking-tight mb-4" style={{ letterSpacing: "-0.02em" }}>
              Start optimizing today
            </h2>
            <p className="text-base mb-8 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
              Free, open source, zero configuration. Drop Brevit into any LLM pipeline in minutes.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/docs/javascript"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "var(--accent)", color: "#000" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
              >
                Read the Docs <ArrowRight size={14} />
              </Link>
              <Link
                href="/playground"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "var(--text-primary)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.08)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)"; }}
              >
                <FlaskConical size={14} />
                Open Playground
              </Link>
            </div>
          </div>
        </Section>

        <Footer />
      </main>
    </>
  );
}
