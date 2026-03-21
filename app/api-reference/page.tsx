"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChevronRight } from "lucide-react";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold tracking-tight mb-6 pb-3 border-b" style={{ letterSpacing: "-0.02em", borderColor: "var(--border)" }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function MethodCard({
  method, signature, returns, desc, params,
}: {
  method: string;
  signature: string;
  returns: string;
  desc: string;
  params?: { name: string; type: string; desc: string; optional?: boolean }[];
}) {
  return (
    <div className="rounded-xl overflow-hidden mb-4" style={{ border: "1px solid var(--border)" }}>
      <div className="px-4 py-3" style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid var(--border)" }}>
        <code className="text-sm font-mono font-semibold" style={{ color: "var(--accent)" }}>{method}</code>
        <span className="mx-2 text-xs" style={{ color: "var(--text-muted)" }}>→</span>
        <code className="text-xs font-mono" style={{ color: "#a78bfa" }}>{returns}</code>
      </div>
      <div className="px-4 py-4">
        <code className="block text-xs font-mono mb-3 px-3 py-2 rounded-lg overflow-x-auto" style={{ background: "rgba(0,0,0,0.4)", color: "var(--text-primary)" }}>
          {signature}
        </code>
        <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>{desc}</p>
        {params && params.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Parameters</p>
            {params.map((p) => (
              <div key={p.name} className="flex items-start gap-3 text-sm">
                <code className="font-mono text-xs px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: "rgba(126,248,216,0.08)", color: "var(--accent)" }}>
                  {p.name}{p.optional ? "?" : ""}
                </code>
                <code className="font-mono text-xs px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: "rgba(167,139,250,0.08)", color: "#a78bfa" }}>
                  {p.type}
                </code>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{p.desc}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ApiReferencePage() {
  return (
    <>
      <Navbar />
      <main className="pt-14 min-h-screen" style={{ background: "var(--bg)" }}>
        <div className="max-w-4xl mx-auto px-5 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm mb-8" style={{ color: "var(--text-muted)" }}>
            <Link href="/" style={{ color: "var(--text-muted)" }} onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"; }}>
              Home
            </Link>
            <ChevronRight size={13} />
            <span style={{ color: "var(--text-primary)" }}>API Reference</span>
          </div>

          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-3" style={{ letterSpacing: "-0.025em" }}>
              API Reference
            </h1>
            <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
              Complete reference for all three Brevit SDK implementations.
              All methods have equivalent signatures across JavaScript, Python, and .NET.
            </p>
          </div>

          {/* SDK quick links */}
          <div className="grid sm:grid-cols-3 gap-3 mb-12">
            {[
              { sdk: "javascript", label: "JavaScript SDK", badge: "npm install brevit", href: "/docs/javascript" },
              { sdk: "python", label: "Python SDK", badge: "pip install brevit", href: "/docs/python" },
              { sdk: "dotnet", label: ".NET SDK", badge: "dotnet add package Brevit", href: "/docs/dotnet" },
            ].map((item) => (
              <Link
                key={item.sdk}
                href={item.href}
                className="rounded-xl p-4 transition-all block"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(126,248,216,0.25)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)"; }}
              >
                <p className="font-medium text-sm mb-1">{item.label}</p>
                <code className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{item.badge}</code>
              </Link>
            ))}
          </div>

          {/* ── BrevitClient ──────────────────────────────────── */}
          <Section id="brevit-client" title="BrevitClient">
            <p className="mb-6 text-sm" style={{ color: "var(--text-secondary)" }}>
              The main client class. Accepts a <code className="font-mono text-xs" style={{ color: "var(--accent)" }}>BrevitConfig</code> and
              optional custom optimizers. All optimization methods return a compressed string.
            </p>

            <h3 className="text-lg font-semibold mb-4">Constructor</h3>
            <MethodCard
              method="new BrevitClient()"
              signature="new BrevitClient(config?: BrevitConfig, options?: { textOptimizer?, imageOptimizer? })"
              returns="BrevitClient"
              desc="Creates a new BrevitClient instance. All parameters are optional — no-arg constructor uses sensible defaults."
              params={[
                { name: "config", type: "BrevitConfig", desc: "Configuration object. Defaults to new BrevitConfig().", optional: true },
                { name: "options.textOptimizer", type: "Function", desc: "Custom text optimizer function. Overrides the built-in TextRank.", optional: true },
                { name: "options.imageOptimizer", type: "Function", desc: "Custom image optimizer function. Overrides the OCR stub.", optional: true },
              ]}
            />

            <h3 className="text-lg font-semibold mb-4 mt-8">Core Methods</h3>

            <MethodCard
              method="brevity()"
              signature="brevity(data: any, intent?: string): Promise<string>"
              returns="Promise<string>"
              desc="Auto mode. Analyzes the data structure and selects the optimal compression strategy automatically. Recommended entry point for most use cases."
              params={[
                { name: "data", type: "any", desc: "JSON string, object, array, text string, or ArrayBuffer/Uint8Array." },
                { name: "intent", type: "string", desc: "Optional hint about the goal (e.g. 'summarize for customer support').", optional: true },
              ]}
            />

            <MethodCard
              method="optimize()"
              signature="optimize(data: any, ratioOrIntent?: number | string, intent?: string): Promise<string>"
              returns="Promise<string>"
              desc="Explicit optimization. Routes by input type — JSON/objects go through the JSON pipeline, strings through TextRank. Supports optional ratio for text compression."
              params={[
                { name: "data", type: "any", desc: "JSON string, object, text string, or binary image data." },
                { name: "ratioOrIntent", type: "number | string", desc: "If number (0–1): ratio for TextRank sentence selection. If string: intent hint.", optional: true },
                { name: "intent", type: "string", desc: "Intent hint (use when also passing ratio as 2nd arg).", optional: true },
              ]}
            />

            <MethodCard
              method="compressText()"
              signature="compressText(text: string): Promise<string>"
              returns="Promise<string>"
              desc="Explicit TextRank AUTO mode. With autoThresholdMultiplier=0 (default), all sentences pass — lossless compression. Uses graph-based sentence scoring to preserve information order."
              params={[
                { name: "text", type: "string", desc: "Any plain-text string." },
              ]}
            />

            <MethodCard
              method="optimizeText()"
              signature="optimizeText(text: string, ratio: number): Promise<string>"
              returns="Promise<string>"
              desc="Explicit TextRank RATIO mode. Keeps only the top N% of sentences ranked by TextRank graph score. Deterministic — same input always produces same output."
              params={[
                { name: "text", type: "string", desc: "Any plain-text string." },
                { name: "ratio", type: "number", desc: "Fraction of sentences to keep (0.0–1.0). 0.5 = keep top 50%." },
              ]}
            />

            <MethodCard
              method="registerStrategy()"
              signature="registerStrategy(name: string, analyzer: Function, optimizer: Function): void"
              returns="void"
              desc="Register a custom optimization strategy. The analyzer scores how well the strategy fits the input (0–100), and the optimizer performs the transformation."
              params={[
                { name: "name", type: "string", desc: "Unique strategy identifier." },
                { name: "analyzer", type: "(data: any) => { score: number; reason: string }", desc: "Returns a score 0–100 indicating fit quality." },
                { name: "optimizer", type: "(data: any) => Promise<string>", desc: "Performs the optimization, returns compressed string." },
              ]}
            />
          </Section>

          {/* ── BrevitConfig ──────────────────────────────────── */}
          <Section id="brevit-config" title="BrevitConfig">
            <p className="mb-6 text-sm" style={{ color: "var(--text-secondary)" }}>
              Configuration options for the BrevitClient. All fields are optional with sensible defaults.
            </p>
            <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--border)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid var(--border)" }}>
                    <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Field</th>
                    <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Type</th>
                    <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Default</th>
                    <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { f: "jsonMode", t: "JsonOptimizationMode", d: "Flatten", desc: "How to optimize JSON structures." },
                    { f: "textMode", t: "TextOptimizationMode", d: "Clean", desc: "How to handle long text strings." },
                    { f: "imageMode", t: "ImageOptimizationMode", d: "Ocr", desc: "Image optimization mode." },
                    { f: "enableAbbreviations", t: "boolean", d: "true", desc: "Auto-abbreviate repeated key prefixes." },
                    { f: "abbreviationThreshold", t: "number", d: "2", desc: "Min repeats before an alias is created." },
                    { f: "longTextThreshold", t: "number", d: "500", desc: "Chars before text optimization triggers." },
                    { f: "jsonPathsToKeep", t: "string[]", d: "[]", desc: "Paths to keep in Filter mode." },
                  ].map((row, i) => (
                    <tr key={row.f} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                      <td className="px-4 py-3"><code className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(126,248,216,0.08)", color: "var(--accent)" }}>{row.f}</code></td>
                      <td className="px-4 py-3"><code className="font-mono text-xs" style={{ color: "#a78bfa" }}>{row.t}</code></td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>{row.d}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: "var(--text-secondary)" }}>{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* ── Enums ──────────────────────────────────────────── */}
          <Section id="enums" title="Enums">
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                {
                  name: "JsonOptimizationMode",
                  values: [
                    { v: "Flatten", desc: "Dot-notation flattening + tabular arrays. Default." },
                    { v: "ToYaml", desc: "Convert to YAML format." },
                    { v: "Filter", desc: "Keep only specified paths." },
                    { v: "None", desc: "No JSON optimization." },
                  ],
                },
                {
                  name: "TextOptimizationMode",
                  values: [
                    { v: "Clean", desc: "Clean whitespace and normalize. Default." },
                    { v: "SummarizeFast", desc: "Fast extractive summary." },
                    { v: "SummarizeHighQuality", desc: "Higher quality summarization." },
                    { v: "None", desc: "No text optimization." },
                  ],
                },
                {
                  name: "ImageOptimizationMode",
                  values: [
                    { v: "Ocr", desc: "Extract text via OCR. Default." },
                    { v: "Metadata", desc: "Extract image metadata only." },
                    { v: "None", desc: "No image optimization." },
                  ],
                },
              ].map((enumDef) => (
                <div key={enumDef.name} className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                  <div className="px-4 py-3 border-b" style={{ background: "rgba(255,255,255,0.03)", borderColor: "var(--border)" }}>
                    <code className="text-sm font-mono" style={{ color: "var(--accent)" }}>{enumDef.name}</code>
                  </div>
                  <div className="p-3 space-y-2">
                    {enumDef.values.map((v) => (
                      <div key={v.v}>
                        <code className="text-xs font-mono" style={{ color: "#a78bfa" }}>.{v.v}</code>
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{v.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Python / .NET equivalents note ──────────────────── */}
          <Section id="language-equivalents" title="Language Equivalents">
            <p className="mb-5 text-sm" style={{ color: "var(--text-secondary)" }}>
              All methods have direct equivalents in Python and .NET with idiomatic naming conventions.
            </p>
            <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--border)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid var(--border)" }}>
                    <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>JavaScript</th>
                    <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Python</th>
                    <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>.NET / C#</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["brevity(data)", "brevity(data)", "BrevityAsync(data)"],
                    ["optimize(data)", "optimize(data)", "OptimizeAsync(data)"],
                    ["compressText(text)", "compress_text(text)", "CompressTextAsync(text)"],
                    ["optimizeText(text, ratio)", "optimize_text(text, ratio)", "OptimizeTextAsync(text, ratio)"],
                    ["registerStrategy(name, fn, fn)", "register_strategy(name, fn, fn)", "RegisterStrategy(name, fn, fn)"],
                    ["new BrevitConfig({ enableAbbreviations })", "BrevitConfig(enable_abbreviations=True)", "new BrevitConfig { EnableAbbreviations = true }"],
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                      {row.map((cell, j) => (
                        <td key={j} className="px-4 py-3">
                          <code className="font-mono text-xs" style={{ color: j === 0 ? "#f7df1e" : j === 1 ? "#3776ab" : "#a78bfa" }}>
                            {cell}
                          </code>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Bottom links */}
          <div className="flex gap-3">
            <Link
              href="/playground"
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ background: "var(--accent)", color: "#000" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
            >
              Open Playground <ChevronRight size={14} />
            </Link>
            <Link
              href="/docs/javascript"
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)"; }}
            >
              Read Full Docs
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
