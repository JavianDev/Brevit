"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CodeBlock } from "@/components/MultiLangCodeBlock";
import { Copy, Check, ArrowRight, Shield, FileText, Layers, BarChart3 } from "lucide-react";

function CopyableSnippet({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div
      className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-mono text-sm"
      style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(126,248,216,0.2)", color: "var(--accent)" }}
    >
      <code>{code}</code>
      <button
        onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        className="p-1.5 rounded-md flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}
      >
        {copied ? <Check size={12} style={{ color: "var(--success)" }} /> : <Copy size={12} />}
      </button>
    </div>
  );
}

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-20 scroll-mt-20">
      {children}
    </section>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-bold tracking-tight mb-5 pb-3 border-b" style={{ letterSpacing: "-0.02em", borderColor: "var(--border)" }}>
      {children}
    </h2>
  );
}

const FORMAT_EXAMPLES = [
  {
    title: "Key-Value (Flat Object)",
    desc: "Nested objects become dot-notation paths. No spaces around the colon.",
    input: '{"user": {"name": "Jane", "role": "admin"}}',
    output: "user.name:Jane\nuser.role:admin",
  },
  {
    title: "Primitive Array",
    desc: "Arrays of primitives use comma-separated format with count prefix.",
    input: '{"tags": ["ai", "nlp", "api"]}',
    output: "tags[3]:ai,nlp,api",
  },
  {
    title: "Tabular Array (Uniform Objects)",
    desc: "Arrays of same-schema objects use compact tabular format.",
    input: '{"items": [{"sku":"A1","qty":2},{"sku":"B3","qty":1}]}',
    output: "items[2]{sku,qty}:\nA1,2\nB3,1",
  },
  {
    title: "Abbreviations",
    desc: "Repeated prefixes get @alias shortcuts when it saves tokens net.",
    input: '{"user": {"name":"J","email":"j@x.com","role":"admin"}}',
    output: "@u=user\n@u.name:J\n@u.email:j@x.com\n@u.role:admin",
  },
];

const ANNOTATION_SYNTAX = [
  { syntax: "@alias=prefix", desc: "Define a prefix abbreviation. alias is 1–3 chars, prefix is the full path.", example: "@u=user.profile.settings" },
  { syntax: "key.path:value", desc: "Flattened key-value pair. Nested structure encoded via dot notation.", example: "user.settings.theme:dark" },
  { syntax: "key[n]:v1,v2,v3", desc: "Primitive array with element count n.", example: "tags[3]:ai,nlp,api" },
  { syntax: "key[n]{f1,f2}:", desc: "Tabular array header. Row data follows on subsequent lines.", example: "items[2]{sku,price}:" },
  { syntax: "[brevit:1.0]", desc: "Optional format header. Identifies the content as Brevit Format v1.0.", example: "[brevit:1.0]" },
];

export default function StandardPage() {
  return (
    <>
      <Navbar />
      <main className="pt-14 min-h-screen" style={{ background: "var(--bg)" }}>
        {/* Hero */}
        <div className="relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(126,248,216,0.07) 0%, transparent 70%)" }}
          />
          <div className="max-w-4xl mx-auto px-5 py-20 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: "rgba(126,248,216,0.08)", border: "1px solid rgba(126,248,216,0.2)" }}>
              <Shield size={13} style={{ color: "var(--accent)" }} />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--accent)" }}>
                The Brevit Format Specification · v1.0
              </span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-5" style={{ letterSpacing: "-0.03em" }}>
              A notation standard for
              <br />
              <span className="text-gradient">LLM-optimized data.</span>
            </h1>
            <p className="text-lg leading-relaxed mb-8 max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              The Brevit Format Specification (BFS) defines a structured, versioned notation for transmitting
              data to Large Language Models. Like OpenAPI for REST, BFS is both a library standard and
              a self-describing interchange format.
            </p>

            <CopyableSnippet code="[brevit:1.0]" />

            <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
              Add this header to any Brevit-compressed payload to make it self-describing.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-5 py-12">
          {/* Feature cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-20">
            {[
              { icon: FileText, title: "Self-Describing", desc: "The [brevit:1.0] header tells the LLM exactly how to parse the payload." },
              { icon: Layers, title: "Annotation-Based", desc: "@alias=prefix is a first-class syntax. LLMs understand it without training." },
              { icon: BarChart3, title: "Versioned", desc: "Spec versions are stable. Update your library without breaking existing prompts." },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl p-5"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
              >
                <item.icon size={18} className="mb-3" style={{ color: "var(--accent)" }} />
                <h3 className="font-semibold text-sm mb-1.5">{item.title}</h3>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* ── Format Overview ────────────────────────────────── */}
          <Section id="format">
            <Heading>Format Overview</Heading>
            <p className="mb-6 text-base" style={{ color: "var(--text-secondary)" }}>
              Brevit Format is a plain-text, line-oriented encoding of structured data. It&apos;s designed to be
              maximally token-efficient while remaining fully parseable by any LLM without special training.
            </p>
            <div className="space-y-6">
              {FORMAT_EXAMPLES.map((ex) => (
                <div
                  key={ex.title}
                  className="rounded-xl overflow-hidden"
                  style={{ border: "1px solid var(--border)" }}
                >
                  <div className="px-4 py-3" style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid var(--border)" }}>
                    <h3 className="font-medium text-sm">{ex.title}</h3>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{ex.desc}</p>
                  </div>
                  <div className="grid sm:grid-cols-2">
                    <div className="p-4 border-r" style={{ borderColor: "var(--border)" }}>
                      <p className="text-xs font-mono mb-2" style={{ color: "var(--text-muted)" }}>Input (JSON)</p>
                      <pre className="text-xs font-mono whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>{ex.input}</pre>
                    </div>
                    <div className="p-4" style={{ background: "rgba(126,248,216,0.02)" }}>
                      <p className="text-xs font-mono mb-2" style={{ color: "var(--accent)" }}>Brevit Output</p>
                      <pre className="text-xs font-mono whitespace-pre-wrap" style={{ color: "var(--text-primary)" }}>{ex.output}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Annotation Syntax ─────────────────────────────── */}
          <Section id="annotations">
            <Heading>Annotation Syntax Reference</Heading>
            <p className="mb-6 text-base" style={{ color: "var(--text-secondary)" }}>
              Brevit Format uses a small set of annotations. All annotations are valid UTF-8 plain text —
              no binary encoding, no escaping (except for commas and quotes inside values).
            </p>
            <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--border)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid var(--border)" }}>
                    <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Syntax</th>
                    <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Description</th>
                    <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Example</th>
                  </tr>
                </thead>
                <tbody>
                  {ANNOTATION_SYNTAX.map((row, i) => (
                    <tr key={row.syntax} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                      <td className="px-4 py-3">
                        <code className="text-xs font-mono px-2 py-1 rounded" style={{ background: "rgba(126,248,216,0.08)", color: "var(--accent)" }}>
                          {row.syntax}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: "var(--text-secondary)" }}>{row.desc}</td>
                      <td className="px-4 py-3">
                        <code className="text-xs font-mono" style={{ color: "#a78bfa" }}>{row.example}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 rounded-xl p-5" style={{ background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.2)" }}>
              <h3 className="font-semibold text-sm mb-3" style={{ color: "#a78bfa" }}>Value Escaping Rules</h3>
              <ul className="space-y-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                <li>• Values containing a comma must be quoted: <code className="font-mono text-xs" style={{ color: "var(--accent)" }}>"value,with,commas"</code></li>
                <li>• Values containing a quote must escape it: <code className="font-mono text-xs" style={{ color: "var(--accent)" }}>"value with \"quotes\""</code></li>
                <li>• Values containing newlines must be quoted: <code className="font-mono text-xs" style={{ color: "var(--accent)" }}>"line1\nline2"</code></li>
                <li>• All other values are unquoted: <code className="font-mono text-xs" style={{ color: "var(--accent)" }}>key:plain value here</code></li>
              </ul>
            </div>
          </Section>

          {/* ── How LLMs Parse Brevit ─────────────────────────── */}
          <Section id="spec">
            <Heading>How LLMs Parse Brevit Format</Heading>
            <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
              Brevit Format is designed to be immediately comprehensible to any instruction-following LLM
              without special training. The format mirrors patterns the model already sees in its training data:
            </p>
            <div className="space-y-4 mb-8">
              {[
                { title: "Dot notation is universal", desc: "Every LLM has seen thousands of examples of dot-notation property access in code. user.name:Jane is trivially parsed." },
                { title: "CSV is in every LLM's training data", desc: "Tabular format with column headers is recognizable as CSV-like. LLMs parse it as a table without prompting." },
                { title: "Abbreviations are self-documenting", desc: "@u=user at the top of a payload means 'when you see @u, expand to user'. This follows the LLM's understanding of variable declarations." },
                { title: "The [brevit:1.0] header is optional but recommended", desc: "Including the header in your system prompt tells the model to parse the content as Brevit Format v1.0 — making responses more consistent." },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 flex gap-4"
                  style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
                >
                  <span className="text-lg font-bold flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(126,248,216,0.1)", color: "var(--accent)", fontSize: "0.875rem" }}>
                    {i + 1}
                  </span>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <CodeBlock
              title="System Prompt Integration"
              language="text"
              code={`You will receive data in Brevit Format v1.0 [brevit:1.0].

Parsing rules:
- key.path:value → nested object path with value
- key[n]:v1,v2,v3 → array of n primitive values
- key[n]{f1,f2,...}: → tabular array header; n rows follow
- @alias=prefix → when you see @alias., expand to prefix.

Always interpret Brevit Format accurately. The data is semantically
equivalent to its original JSON form.`}
            />
          </Section>

          {/* ── Versioning ────────────────────────────────────── */}
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)" }}
          >
            <h3 className="text-xl font-bold mb-3">Versioning</h3>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              The Brevit Format Specification follows semantic versioning. Current stable version: <strong>1.0</strong>.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/playground"
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "var(--accent)", color: "#000" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
              >
                Try in Playground <ArrowRight size={14} />
              </Link>
              <Link
                href="/docs/javascript"
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.08)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)"; }}
              >
                Read the Docs
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
}
