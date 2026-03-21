"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroTokenCounter } from "@/components/HeroTokenCounter";
import { MiniDemo } from "@/components/MiniDemo";
import { TokenSavingsChart } from "@/components/TokenSavingsChart";
import { InstallTabs } from "@/components/InstallTabs";
import { CostCalculator } from "@/components/CostCalculator";
import { HowItWorks } from "@/components/HowItWorks";
import { JsonDeepDive } from "@/components/JsonDeepDive";
import { TextDeepDive } from "@/components/TextDeepDive";
import { AbbreviationShowcase } from "@/components/AbbreviationShowcase";
import { MultiLanguageSection } from "@/components/MultiLanguageSection";
import {
  Zap, Layers, FileText, Code2, Puzzle, BarChart3,
  ArrowRight, FlaskConical, ChevronRight, Shield, Globe,
  Copy, Check, CheckCircle2, AlertTriangle,
} from "lucide-react";

function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`max-w-7xl mx-auto px-5 ${className}`}>
      {children}
    </section>
  );
}

function FullBleedSection({
  children,
  className = "",
  id,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}) {
  return (
    <section id={id} className={`w-full ${className}`} style={style}>
      <div className="max-w-7xl mx-auto px-5">{children}</div>
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

function InstallBadge({ cmd, label }: { cmd: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={copy}
      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all group w-full text-left"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
      }}
    >
      <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
        {label}
      </span>
      <code className="text-xs font-mono flex-1 truncate" style={{ color: "var(--accent)" }}>
        {cmd}
      </code>
      <span style={{ color: "var(--text-muted)" }}>
        {copied ? <Check size={12} /> : <Copy size={12} />}
      </span>
    </button>
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

const GOOD_FOR = [
  "LLM prompt pipelines with structured JSON data",
  "RAG systems where context window is limited",
  "Batch document processing with high API call volume",
  "Any workload where reducing token count saves cost",
  "Multi-turn conversations with accumulated context",
  "Function calling / tool-use payloads with nested objects",
];

const NOT_FOR = [
  "Human-readable API responses — Brevit is for LLM input",
  "Data under ~100 tokens — overhead exceeds savings",
  "Strict JSON schema requirements downstream",
  "Real-time streaming where compression latency matters",
  "Binary data or media files",
  "Cases where output must be valid JSON",
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="relative pt-14 overflow-hidden">
        <div className="fixed inset-0 bg-grid opacity-100 pointer-events-none" />

        {/* ── Hero ───────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 80% 60% at 50% 0%, var(--accent-glow) 0%, transparent 70%)",
              opacity: 0.15,
            }}
          />

          <div className="max-w-[1400px] mx-auto px-5 w-full py-24">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex flex-wrap gap-2 mb-8">
                  {BADGES.map((b) => (
                    <span
                      key={b.label}
                      className="text-xs px-2.5 py-1 rounded-full font-mono"
                      style={{
                        background: "var(--hover-bg)",
                        border: "1px solid var(--border)",
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

                <div className="flex flex-wrap gap-3 mb-8">
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
                      background: "var(--hover-bg)",
                      border: "1px solid var(--border)",
                      color: "var(--text-primary)",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)"; }}
                  >
                    <FlaskConical size={14} />
                    Try Playground
                  </Link>
                </div>

                {/* Triple install strip */}
                <div className="grid sm:grid-cols-3 gap-2">
                  <InstallBadge cmd="npm install brevit" label="JS" />
                  <InstallBadge cmd="pip install brevit" label="PY" />
                  <InstallBadge cmd="dotnet add package Brevit" label=".NET" />
                </div>
              </div>

              <div className="lg:pl-8">
                <HeroTokenCounter />
              </div>
            </div>
          </div>
        </section>

        {/* ── How It Works ─────────────────────────────────────────── */}
        <FullBleedSection
          className="py-24"
          style={{ background: "var(--bg-surface)" }}
        >
          <SectionLabel>How It Works</SectionLabel>
          <h2 className="text-3xl font-bold tracking-tight mb-3" style={{ letterSpacing: "-0.02em" }}>
            Four steps from raw data to optimized output
          </h2>
          <p className="text-base mb-10" style={{ color: "var(--text-secondary)" }}>
            Brevit auto-detects your input type and applies the right compression strategy. No configuration needed.
          </p>
          <HowItWorks />
        </FullBleedSection>

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
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl p-5 transition-all duration-200 group"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)";
                  (e.currentTarget as HTMLDivElement).style.background = "var(--accent-dim)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLDivElement).style.background = "var(--bg-surface)";
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: "var(--accent-dim)" }}
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

        {/* ── JSON Deep Dive ──────────────────────────────────────── */}
        <FullBleedSection
          className="py-24"
          id="json-compression"
          style={{ background: "var(--bg-surface)" }}
        >
          <SectionLabel>JSON Compression</SectionLabel>
          <h2 className="text-3xl font-bold tracking-tight mb-3" style={{ letterSpacing: "-0.02em" }}>
            Four techniques for maximum JSON reduction
          </h2>
          <p className="text-base mb-10" style={{ color: "var(--text-secondary)" }}>
            Brevit analyzes your JSON structure and picks the most efficient encoding for each node.
          </p>
          <JsonDeepDive />
        </FullBleedSection>

        {/* ── Text Compression Deep Dive ──────────────────────────── */}
        <Section className="py-24" id="text-compression">
          <SectionLabel>Text Compression</SectionLabel>
          <h2 className="text-3xl font-bold tracking-tight mb-3" style={{ letterSpacing: "-0.02em" }}>
            TextRank extractive summarization
          </h2>
          <p className="text-base mb-10" style={{ color: "var(--text-secondary)" }}>
            Deterministic, graph-based sentence scoring. Keep the most important sentences, discard the rest.
          </p>
          <TextDeepDive />
        </Section>

        {/* ── Abbreviation Engine ─────────────────────────────────── */}
        <FullBleedSection
          className="py-24"
          id="abbreviation"
          style={{ background: "var(--bg-surface)" }}
        >
          <SectionLabel>Abbreviation Engine</SectionLabel>
          <h2 className="text-3xl font-bold tracking-tight mb-3" style={{ letterSpacing: "-0.02em" }}>
            Intelligent @alias generation
          </h2>
          <p className="text-base mb-10" style={{ color: "var(--text-secondary)" }}>
            Repeated key prefixes are automatically aliased. Brevit only abbreviates when it actually saves tokens.
          </p>
          <AbbreviationShowcase />
        </FullBleedSection>

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

        {/* ── Multi-Language ───────────────────────────────────────── */}
        <FullBleedSection
          className="py-24"
          style={{ background: "var(--bg-surface)" }}
        >
          <SectionLabel>Multi-Language</SectionLabel>
          <h2 className="text-3xl font-bold tracking-tight mb-3" style={{ letterSpacing: "-0.02em" }}>
            Same API. Three ecosystems.
          </h2>
          <p className="text-base mb-10" style={{ color: "var(--text-secondary)" }}>
            Learn Brevit once and use it in JavaScript, Python, or .NET. Identical patterns, identical output.
          </p>
          <MultiLanguageSection />
        </FullBleedSection>

        {/* ── When to Use ─────────────────────────────────────────── */}
        <Section className="py-24" id="when-to-use">
          <SectionLabel>Guidance</SectionLabel>
          <h2 className="text-3xl font-bold tracking-tight mb-10" style={{ letterSpacing: "-0.02em" }}>
            When to use Brevit
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div
              className="rounded-xl p-6"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <CheckCircle2 size={18} style={{ color: "var(--success)" }} />
                <h3 className="text-base font-semibold" style={{ color: "var(--success)" }}>
                  Perfect for
                </h3>
              </div>
              <ul className="space-y-3">
                {GOOD_FOR.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span className="mt-0.5 flex-shrink-0" style={{ color: "var(--success)" }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="rounded-xl p-6"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <AlertTriangle size={18} style={{ color: "var(--warning)" }} />
                <h3 className="text-base font-semibold" style={{ color: "var(--warning)" }}>
                  Consider alternatives
                </h3>
              </div>
              <ul className="space-y-3">
                {NOT_FOR.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span className="mt-0.5 flex-shrink-0" style={{ color: "var(--warning)" }}>⚠</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* ── The Brevit Standard teaser ──────────────────────────── */}
        <Section className="py-20">
          <div
            className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, var(--accent-dim) 0%, var(--purple-dim) 100%)",
              border: "1px solid var(--accent)",
            }}
          >
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none"
              style={{ background: "var(--accent-glow)", transform: "translate(30%, -30%)", opacity: 0.3 }}
            />
            <div className="relative z-10 max-w-2xl">
              <span
                className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1 rounded-full mb-6"
                style={{
                  background: "var(--accent-dim)",
                  border: "1px solid var(--accent)",
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
                    background: "var(--bg-code)",
                    border: "1px solid var(--border)",
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
                      background: "var(--hover-bg)",
                      border: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)";
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
                      style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
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
                  background: "var(--hover-bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)"; }}
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
