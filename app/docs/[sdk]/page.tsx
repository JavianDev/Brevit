"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DocsSidebar } from "@/components/DocsSidebar";
import { MultiLangCodeBlock, CodeBlock } from "@/components/MultiLangCodeBlock";
import { ExternalLink, ChevronRight } from "lucide-react";

type SDK = "javascript" | "python" | "dotnet";

// ── Code snippets per SDK ────────────────────────────────────────────────────

const INSTALL_CODE: Record<SDK, string> = {
  javascript: "npm install brevit",
  python: "pip install brevit",
  dotnet: "dotnet add package Brevit",
};

const QUICKSTART_TABS = {
  javascript: `import { BrevitClient, BrevitConfig } from 'brevit';

const brevit = new BrevitClient();

// Auto mode — Brevit picks the best strategy
const result = await brevit.brevity({
  user: { name: 'Jane', email: 'jane@example.com' },
  orders: [
    { id: 'ORD-001', status: 'SHIPPED', total: 79.98 },
    { id: 'ORD-002', status: 'PENDING', total: 29.99 }
  ]
});

console.log(result);
// user.name:Jane
// user.email:jane@example.com
// orders[2]{id,status,total}:
// ORD-001,SHIPPED,79.98
// ORD-002,PENDING,29.99`,
  python: `from brevit import BrevitClient, BrevitConfig
import asyncio

brevit = BrevitClient()

result = await brevit.brevity({
    "user": {"name": "Jane", "email": "jane@example.com"},
    "orders": [
        {"id": "ORD-001", "status": "SHIPPED", "total": 79.98},
        {"id": "ORD-002", "status": "PENDING", "total": 29.99}
    ]
})

print(result)
# user.name:Jane
# user.email:jane@example.com
# orders[2]{id,status,total}:
# ORD-001,SHIPPED,79.98
# ORD-002,PENDING,29.99`,
  dotnet: `using Brevit;

var config = new BrevitConfig();
var brevit = new BrevitClient(
    config,
    new DefaultJsonOptimizer(),
    new DefaultTextOptimizer(),
    new DefaultImageOptimizer()
);

var data = new {
    User = new { Name = "Jane", Email = "jane@example.com" },
    Orders = new[] {
        new { Id = "ORD-001", Status = "SHIPPED", Total = 79.98 },
        new { Id = "ORD-002", Status = "PENDING", Total = 29.99 }
    }
};

string result = await brevit.BrevityAsync(data);
Console.WriteLine(result);
// user.Name:Jane
// user.Email:jane@example.com
// orders[2]{Id,Status,Total}:
// ORD-001,SHIPPED,79.98
// ORD-002,PENDING,29.99`,
};

const CONFIG_CODE: Record<SDK, string> = {
  javascript: `import { BrevitClient, BrevitConfig, JsonOptimizationMode, TextOptimizationMode } from 'brevit';

const config = new BrevitConfig({
  // JSON optimization strategy
  jsonMode: JsonOptimizationMode.Flatten,  // Flatten | ToYaml | Filter | None

  // Text optimization strategy
  textMode: TextOptimizationMode.Clean,    // None | Clean | SummarizeFast | SummarizeHighQuality

  // For Filter mode: paths to keep
  jsonPathsToKeep: [],

  // Minimum characters before text optimization triggers
  longTextThreshold: 500,

  // Enable @alias=prefix abbreviations (v0.1.2+)
  enableAbbreviations: true,

  // Min times a prefix must repeat before getting an alias
  abbreviationThreshold: 2,
});

const brevit = new BrevitClient(config);`,
  python: `from brevit import BrevitClient, BrevitConfig, JsonOptimizationMode, TextOptimizationMode

config = BrevitConfig(
    # JSON optimization strategy
    json_mode=JsonOptimizationMode.Flatten,  # Flatten | ToYaml | Filter | None

    # Text optimization strategy
    text_mode=TextOptimizationMode.Clean,    # None | Clean | SummarizeFast | SummarizeHighQuality

    # For Filter mode: paths to keep
    json_paths_to_keep=[],

    # Minimum characters before text optimization triggers
    long_text_threshold=500,

    # Enable @alias=prefix abbreviations
    enable_abbreviations=True,

    # Min times a prefix must repeat before getting an alias
    abbreviation_threshold=2,
)

brevit = BrevitClient(config)`,
  dotnet: `using Brevit;

var config = new BrevitConfig(
    JsonMode: JsonOptimizationMode.Flatten,  // Flatten | ToYaml | Filter | None
    TextMode: TextOptimizationMode.Clean,    // None | Clean | SummarizeFast | SummarizeHighQuality
    ImageMode: ImageOptimizationMode.Ocr     // None | Ocr | Metadata
) {
    JsonPathsToKeep = new(),
    LongTextThreshold = 500,
    EnableAbbreviations = true,
    AbbreviationThreshold = 2
};

var brevit = new BrevitClient(
    config,
    new DefaultJsonOptimizer(),
    new DefaultTextOptimizer(),
    new DefaultImageOptimizer()
);`,
};

const JSON_OPT_CODE: Record<SDK, string> = {
  javascript: `const brevit = new BrevitClient();

// Nested object → dot notation
const flat = await brevit.optimize({
  user: {
    id: "u-123",
    name: "Javian",
    contact: { email: "hi@example.com", phone: "+1-555-0123" }
  }
});
// user.id:u-123
// user.name:Javian
// user.contact.email:hi@example.com
// user.contact.phone:+1-555-0123

// Primitive array → comma-separated
const arr = await brevit.optimize({ tags: ["json", "llm", "api"] });
// tags[3]:json,llm,api

// Uniform object array → tabular format
const table = await brevit.optimize({
  products: [
    { sku: "A1", qty: 3, price: 9.99 },
    { sku: "B2", qty: 1, price: 24.99 },
  ]
});
// products[2]{sku,qty,price}:
// A1,3,9.99
// B2,1,24.99`,
  python: `brevit = BrevitClient()

# Nested object → dot notation
flat = await brevit.optimize({
    "user": {
        "id": "u-123",
        "name": "Javian",
        "contact": {"email": "hi@example.com", "phone": "+1-555-0123"}
    }
})
# user.id:u-123
# user.name:Javian
# user.contact.email:hi@example.com

# Uniform object array → tabular
table = await brevit.optimize({
    "products": [
        {"sku": "A1", "qty": 3, "price": 9.99},
        {"sku": "B2", "qty": 1, "price": 24.99},
    ]
})
# products[2]{sku,qty,price}:
# A1,3,9.99
# B2,1,24.99`,
  dotnet: `// Nested object → dot notation
var result = await brevit.OptimizeAsync(new {
    User = new {
        Id = "u-123",
        Name = "Javian",
        Contact = new { Email = "hi@example.com", Phone = "+1-555-0123" }
    }
});
// User.Id:u-123
// User.Name:Javian
// User.Contact.Email:hi@example.com

// Uniform object array → tabular
var tableResult = await brevit.OptimizeAsync(new {
    Products = new[] {
        new { Sku = "A1", Qty = 3, Price = 9.99 },
        new { Sku = "B2", Qty = 1, Price = 24.99 },
    }
});
// Products[2]{Sku,Qty,Price}:
// A1,3,9.99
// B2,1,24.99`,
};

const ABBREV_CODE: Record<SDK, string> = {
  javascript: `const config = new BrevitConfig({ enableAbbreviations: true, abbreviationThreshold: 2 });
const brevit = new BrevitClient(config);

const result = await brevit.optimize({
  user: { name: "John", email: "john@example.com", role: "admin" },
  order: { id: "o-456", status: "SHIPPED", total: 99.99 }
});

// Output with abbreviations:
// @u=user
// @o=order
// @u.name:John
// @u.email:john@example.com
// @u.role:admin
// @o.id:o-456
// @o.status:SHIPPED
// @o.total:99.99

// Without abbreviations (disabled):
const noAbbrevConfig = new BrevitConfig({ enableAbbreviations: false });
const result2 = await new BrevitClient(noAbbrevConfig).optimize({ ... });
// user.name:John
// user.email:john@example.com
// ...`,
  python: `config = BrevitConfig(enable_abbreviations=True, abbreviation_threshold=2)
brevit = BrevitClient(config)

result = await brevit.optimize({
    "user": {"name": "John", "email": "john@example.com", "role": "admin"},
    "order": {"id": "o-456", "status": "SHIPPED", "total": 99.99}
})

# Output with abbreviations:
# @u=user
# @o=order
# @u.name:John
# @u.email:john@example.com
# @u.role:admin
# @o.id:o-456
# @o.status:SHIPPED
# @o.total:99.99`,
  dotnet: `var config = new BrevitConfig(
    JsonMode: JsonOptimizationMode.Flatten
) { EnableAbbreviations = true, AbbreviationThreshold = 2 };

var brevit = new BrevitClient(config, new DefaultJsonOptimizer(), ...);

var result = await brevit.OptimizeAsync(new {
    User = new { Name = "John", Email = "john@example.com", Role = "admin" },
    Order = new { Id = "o-456", Status = "SHIPPED", Total = 99.99 }
});

// @u=User
// @o=Order
// @u.Name:John
// @u.Email:john@example.com
// @u.Role:admin
// @o.Id:o-456
// @o.Status:SHIPPED
// @o.Total:99.99`,
};

const TEXT_OPT_CODE: Record<SDK, string> = {
  javascript: `const brevit = new BrevitClient();

// compressText() — AUTO mode (lossless by default)
// Runs TextRank analysis; with autoThresholdMultiplier=0, all sentences are kept.
const compressed = await brevit.compressText(longDocument);

// optimizeText() — RATIO mode (0.0 to 1.0)
// Keeps the top-ranked N% of sentences by TextRank score
const summary = await brevit.optimizeText(longDocument, 0.5);  // keeps 50%

// Through optimize() with ratio
const result = await brevit.optimize(longDocument, 0.3);  // keeps 30%

// Through brevity() — auto-detects text and routes to compressText
const auto = await brevit.brevity("This is a long article about AI...");`,
  python: `brevit = BrevitClient()

# compress_text() — AUTO mode (lossless)
compressed = await brevit.compress_text(long_document)

# optimize_text() — RATIO mode
summary = await brevit.optimize_text(long_document, 0.5)  # keeps 50%

# Through optimize() with ratio
result = await brevit.optimize(long_document, 0.3)  # keeps 30%

# brevity() — auto-detects and routes
auto = await brevit.brevity("This is a long article about AI...")`,
  dotnet: `// CompressTextAsync() — AUTO mode (lossless)
string compressed = await brevit.CompressTextAsync(longDocument);

// OptimizeTextAsync() — RATIO mode
string summary = await brevit.OptimizeTextAsync(longDocument, 0.5f);  // 50%

// Through OptimizeAsync() with ratio
string result = await brevit.OptimizeAsync(longDocument, 0.3f);

// BrevityAsync() — auto-detects text
string auto = await brevit.BrevityAsync("This is a long article about AI...");`,
};

const CUSTOM_STRATEGY_CODE: Record<SDK, string> = {
  javascript: `const brevit = new BrevitClient();

// Register a custom strategy
brevit.registerStrategy(
  'my-strategy',
  // Analyzer: returns score 0-100 for how well this strategy fits the data
  (data) => ({
    score: typeof data === 'object' && data.type === 'invoice' ? 95 : 0,
    reason: 'Invoice-specific optimization'
  }),
  // Optimizer: the actual transformation
  async (data) => {
    return \`INV#\${data.id} \${data.vendor} \$\${data.total}\`;
  }
);`,
  python: `brevit = BrevitClient()

# Register a custom strategy
def my_analyzer(data):
    if isinstance(data, dict) and data.get('type') == 'invoice':
        return {'score': 95, 'reason': 'Invoice-specific optimization'}
    return {'score': 0}

async def my_optimizer(data):
    return f"INV#{'{'}data['id']{'}'} {'{'}data['vendor']{'}'} {'{'}data['total']{'}'}"

brevit.register_strategy('my-strategy', my_analyzer, my_optimizer)`,
  dotnet: `// Register a custom strategy
brevit.RegisterStrategy(
    "my-strategy",
    // Analyzer
    data => data is InvoiceDto ? new StrategyScore { Score = 95 } : new StrategyScore { Score = 0 },
    // Optimizer
    async data => {
        var inv = (InvoiceDto)data;
        return $"INV#{'{'}inv.Id{'}'} {'{'}inv.Vendor{'}'} {'{'}inv.Total{'}'}";
    }
);`,
};

const SDK_META: Record<SDK, { label: string; badge: string; install: string; pkg: string; registry: string; registryUrl: string; version: string }> = {
  javascript: { label: "JavaScript / TypeScript", badge: "npm", install: "npm install brevit", pkg: "brevit", registry: "npm", registryUrl: "https://www.npmjs.com/package/brevit", version: "1.0.2" },
  python: { label: "Python", badge: "pip", install: "pip install brevit", pkg: "brevit", registry: "PyPI", registryUrl: "https://pypi.org/project/brevit/", version: "1.0.2" },
  dotnet: { label: ".NET / C#", badge: "dotnet", install: "dotnet add package Brevit", pkg: "Brevit", registry: "NuGet", registryUrl: "https://www.nuget.org/packages/Brevit", version: "1.0.2" },
};

function DocSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-16 scroll-mt-20">
      <h2
        className="text-2xl font-bold tracking-tight mb-4 pb-3 border-b"
        style={{ letterSpacing: "-0.02em", borderColor: "var(--border)" }}
      >
        {title}
      </h2>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Note({ children, type = "info" }: { children: React.ReactNode; type?: "info" | "warning" | "tip" }) {
  const colors = {
    info: { bg: "rgba(56,189,248,0.06)", border: "rgba(56,189,248,0.2)", color: "#38bdf8", label: "Note" },
    warning: { bg: "rgba(251,146,60,0.06)", border: "rgba(251,146,60,0.2)", color: "#fb923c", label: "Warning" },
    tip: { bg: "rgba(74,222,128,0.06)", border: "rgba(74,222,128,0.2)", color: "var(--success)", label: "Tip" },
  }[type];
  return (
    <div
      className="rounded-lg px-4 py-3 text-sm"
      style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
    >
      <span className="font-semibold mr-2" style={{ color: colors.color }}>{colors.label}:</span>
      <span style={{ color: "var(--text-secondary)" }}>{children}</span>
    </div>
  );
}

export default function DocsPage() {
  const params = useParams();
  const sdk = (params?.sdk as SDK) ?? "javascript";
  const meta = SDK_META[sdk] ?? SDK_META.javascript;

  const quickstartTabs = [
    { id: "js", label: "JavaScript", language: "javascript", code: QUICKSTART_TABS.javascript },
    { id: "py", label: "Python", language: "python", code: QUICKSTART_TABS.python },
    { id: "dotnet", label: ".NET", language: "csharp", code: QUICKSTART_TABS.dotnet },
  ];
  const defaultTab = sdk === "python" ? "py" : sdk === "dotnet" ? "dotnet" : "js";

  const codeTabs = (codes: Record<SDK, string>) => [
    { id: "js", label: "JavaScript", language: "javascript", code: codes.javascript },
    { id: "py", label: "Python", language: "python", code: codes.python },
    { id: "dotnet", label: ".NET", language: "csharp", code: codes.dotnet },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-14 min-h-screen" style={{ background: "var(--bg)" }}>
        <div className="max-w-6xl mx-auto px-5 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm mb-8" style={{ color: "var(--text-muted)" }}>
            <Link href="/" style={{ color: "var(--text-muted)" }} onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"; }}>
              Home
            </Link>
            <ChevronRight size={13} />
            <Link href="/docs/javascript" style={{ color: "var(--text-muted)" }} onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"; }}>
              Docs
            </Link>
            <ChevronRight size={13} />
            <span style={{ color: "var(--text-primary)" }}>{meta.label}</span>
          </div>

          <div className="flex gap-12">
            {/* Sidebar */}
            <DocsSidebar />

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Page header */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-mono"
                    style={{ background: "rgba(126,248,216,0.1)", color: "var(--accent)", border: "1px solid rgba(126,248,216,0.2)" }}
                  >
                    {meta.badge} · {meta.pkg} · v{meta.version}
                  </span>
                  <a
                    href={meta.registryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs transition-colors"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"; }}
                  >
                    View on {meta.registry} <ExternalLink size={10} />
                  </a>
                </div>
                <h1 className="text-4xl font-bold tracking-tight mb-3" style={{ letterSpacing: "-0.025em" }}>
                  {meta.label} SDK
                </h1>
                <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
                  Brevit for {meta.label} — compress JSON, text, and binary data before sending to LLMs.
                  Reduce token costs by 40–60% with zero configuration.
                </p>
              </div>

              {/* ── Getting Started ─────────────────────────────── */}
              <DocSection id="getting-started" title="Getting Started">
                <p style={{ color: "var(--text-secondary)" }}>
                  Brevit is a drop-in library that transforms your data into a token-efficient format before it reaches your LLM.
                  It works on JSON structures, plain text, and binary image data — and it&apos;s completely lossless by default.
                </p>
                <Note type="tip">
                  Not sure which SDK to use? All three have identical output. Pick the one that matches your stack.
                </Note>
              </DocSection>

              {/* ── Installation ────────────────────────────────── */}
              <DocSection id="installation" title="Installation">
                <CodeBlock
                  code={`$ ${meta.install}`}
                  language="bash"
                  title="Terminal"
                />
                <p style={{ color: "var(--text-secondary)" }}>
                  {sdk === "javascript" && "Requires Node.js 18+ or a modern browser. ESM and CommonJS both supported."}
                  {sdk === "python" && "Requires Python 3.8+. Depends on networkx>=3.2 for TextRank graph processing."}
                  {sdk === "dotnet" && "Targets .NET 8. Available as a NuGet package. Depends on System.Text.Json."}
                </p>

                {/* Quick start */}
                <MultiLangCodeBlock
                  tabs={quickstartTabs}
                  title="Quick Start"
                />
              </DocSection>

              {/* ── Configuration ───────────────────────────────── */}
              <DocSection id="configuration" title="Configuration">
                <p style={{ color: "var(--text-secondary)" }}>
                  Pass a config object to <code className="font-mono text-sm px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.06)", color: "var(--accent)" }}>BrevitConfig</code> to
                  customize optimization behavior. All fields have sensible defaults — zero config is required for most use cases.
                </p>
                <MultiLangCodeBlock
                  tabs={codeTabs(CONFIG_CODE)}
                  title="Configuration"
                />
                <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--border)" }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid var(--border)" }}>
                        <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Option</th>
                        <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Default</th>
                        <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { opt: "jsonMode", def: "Flatten", desc: "How to optimize JSON. Flatten produces dot-notation key-value pairs." },
                        { opt: "textMode", def: "Clean", desc: "How to handle long text strings in JSON values." },
                        { opt: "imageMode", def: "Ocr", desc: "Image optimization — OCR extracts text from images." },
                        { opt: "enableAbbreviations", def: "true", desc: "Auto-abbreviate repeated key prefixes with @alias syntax." },
                        { opt: "abbreviationThreshold", def: "2", desc: "Min times a prefix must repeat before it gets an alias." },
                        { opt: "longTextThreshold", def: "500", desc: "Char count threshold before text optimization triggers." },
                      ].map((row, i) => (
                        <tr key={row.opt} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                          <td className="px-4 py-3"><code className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(126,248,216,0.08)", color: "var(--accent)" }}>{row.opt}</code></td>
                          <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>{row.def}</td>
                          <td className="px-4 py-3 text-sm" style={{ color: "var(--text-secondary)" }}>{row.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </DocSection>

              {/* ── JSON Optimization ───────────────────────────── */}
              <DocSection id="json-optimization" title="JSON Optimization">
                <p style={{ color: "var(--text-secondary)" }}>
                  Brevit&apos;s JSON optimizer uses a smart detection pipeline: nested objects become dot-notation paths,
                  uniform object arrays become compact tabular format, and primitive arrays become comma-separated.
                </p>

                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { title: "Nested Objects", desc: 'user: { name: "J" }', out: "user.name:J", savings: "~38%" },
                    { title: "Primitive Arrays", desc: '["a", "b", "c"]', out: "arr[3]:a,b,c", savings: "~70%" },
                    { title: "Object Arrays", desc: "[{ id:1 }, { id:2 }]", out: "arr[2]{id}:\n1\n2", savings: "~60%" },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-xl p-4"
                      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
                    >
                      <h4 className="font-medium text-sm mb-2">{item.title}</h4>
                      <pre className="text-xs font-mono mb-2" style={{ color: "var(--text-muted)" }}>{item.desc}</pre>
                      <div className="text-xs" style={{ color: "var(--accent)" }}>↓</div>
                      <pre className="text-xs font-mono mt-1" style={{ color: "var(--text-primary)" }}>{item.out}</pre>
                      <div
                        className="mt-2 text-xs font-mono px-2 py-0.5 rounded-full inline-block"
                        style={{ background: "rgba(74,222,128,0.1)", color: "var(--success)" }}
                      >
                        {item.savings} savings
                      </div>
                    </div>
                  ))}
                </div>

                <MultiLangCodeBlock tabs={codeTabs(JSON_OPT_CODE)} title="JSON Optimization Examples" />
              </DocSection>

              {/* ── Abbreviations ───────────────────────────────── */}
              <DocSection id="abbreviations" title="Abbreviation Engine">
                <p style={{ color: "var(--text-secondary)" }}>
                  When the same key prefix appears ≥ <code className="font-mono text-xs px-1 rounded" style={{ background: "rgba(255,255,255,0.06)", color: "var(--accent)" }}>abbreviationThreshold</code> times,
                  Brevit creates a short alias and replaces the prefix throughout — saving an additional 10–25% on top of flattening.
                </p>
                <Note type="info">
                  Abbreviations are only created when the token savings exceed the cost of writing the definition.
                  If abbreviating wouldn&apos;t save tokens net, the prefix is left as-is.
                </Note>
                <MultiLangCodeBlock tabs={codeTabs(ABBREV_CODE)} title="Abbreviation Examples" />
                <div
                  className="rounded-xl p-5"
                  style={{ background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.2)" }}
                >
                  <h4 className="font-semibold text-sm mb-3" style={{ color: "#a78bfa" }}>Alias Generation Strategy</h4>
                  <ol className="space-y-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <li className="flex gap-2"><span className="font-mono text-xs mt-0.5" style={{ color: "#a78bfa" }}>1.</span> First letter of root segment: <code className="font-mono text-xs" style={{ color: "var(--accent)" }}>user → u</code></li>
                    <li className="flex gap-2"><span className="font-mono text-xs mt-0.5" style={{ color: "#a78bfa" }}>2.</span> First letter of each dot-segment: <code className="font-mono text-xs" style={{ color: "var(--accent)" }}>order.items → oi</code></li>
                    <li className="flex gap-2"><span className="font-mono text-xs mt-0.5" style={{ color: "#a78bfa" }}>3.</span> Counter-based fallback: <code className="font-mono text-xs" style={{ color: "var(--accent)" }}>a, b, c … z, aa, ab…</code></li>
                  </ol>
                </div>
              </DocSection>

              {/* ── Text Optimization ───────────────────────────── */}
              <DocSection id="text-optimization" title="Text Optimization">
                <p style={{ color: "var(--text-secondary)" }}>
                  Brevit uses a deterministic TextRank / PageRank-style algorithm over sentence similarity graphs.
                  No LLM is required — it&apos;s purely extractive and always produces the same output for the same input.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-xl p-4" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                    <h4 className="font-medium text-sm mb-2">AUTO Mode</h4>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      With <code className="font-mono" style={{ color: "var(--accent)" }}>autoThresholdMultiplier = 0.0</code>,
                      all sentences pass the threshold → lossless by default.
                    </p>
                  </div>
                  <div className="rounded-xl p-4" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                    <h4 className="font-medium text-sm mb-2">RATIO Mode</h4>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Pass a ratio 0.0–1.0 to keep the top N% of sentences ranked by TextRank graph score.
                    </p>
                  </div>
                </div>
                <MultiLangCodeBlock tabs={codeTabs(TEXT_OPT_CODE)} title="Text Optimization Examples" />
              </DocSection>

              {/* ── Image Optimization ──────────────────────────── */}
              <DocSection id="image-optimization" title="Image Optimization">
                <Note type="warning">
                  Image OCR is a stub in the current release. The interface is defined and ready to plug in
                  Azure AI Vision, Tesseract, or any OCR provider via a custom optimizer.
                </Note>
                <p style={{ color: "var(--text-secondary)" }}>
                  Pass a <code className="font-mono text-xs px-1 rounded" style={{ background: "rgba(255,255,255,0.06)", color: "var(--accent)" }}>Uint8Array</code> (JS),
                  <code className="font-mono text-xs px-1 rounded mx-1" style={{ background: "rgba(255,255,255,0.06)", color: "var(--accent)" }}>bytes</code> (Python), or
                  <code className="font-mono text-xs px-1 rounded" style={{ background: "rgba(255,255,255,0.06)", color: "var(--accent)" }}>byte[]</code> (.NET)
                  to the client and Brevit will route it through the configured image optimizer.
                </p>
              </DocSection>

              {/* ── Custom Strategies ───────────────────────────── */}
              <DocSection id="custom-strategies" title="Custom Strategies">
                <p style={{ color: "var(--text-secondary)" }}>
                  Extend Brevit with your own optimization logic. Register a strategy with an <em>analyzer</em> that scores
                  how well it fits the data, and an <em>optimizer</em> that performs the transformation.
                </p>
                <MultiLangCodeBlock tabs={codeTabs(CUSTOM_STRATEGY_CODE)} title="Custom Strategy Registration" />
              </DocSection>

              {/* ── API Reference ───────────────────────────────── */}
              <DocSection id="api-reference" title="API Reference">
                <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
                  Core methods available on <code className="font-mono text-sm" style={{ color: "var(--accent)" }}>BrevitClient</code>.
                  All async methods return <code className="font-mono text-xs" style={{ color: "var(--accent)" }}>Promise&lt;string&gt;</code> (JS/Python) or <code className="font-mono text-xs" style={{ color: "var(--accent)" }}>Task&lt;string&gt;</code> (.NET).
                </p>
                <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--border)" }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid var(--border)" }}>
                        <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Method</th>
                        <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { m: "brevity(data)", desc: "Auto-selects best strategy based on data analysis. Recommended entry point." },
                        { m: "optimize(data, ratio?)", desc: "Main pipeline: routes by type (JSON/text/image/POCO). Optional ratio for text." },
                        { m: "compressText(text)", desc: "Explicit TextRank AUTO mode — lossless by default." },
                        { m: "optimizeText(text, ratio)", desc: "Explicit TextRank RATIO mode — keeps top N% of sentences." },
                        { m: "registerStrategy(name, analyzer, optimizer)", desc: "Register a custom optimization strategy for use in brevity()." },
                      ].map((row, i) => (
                        <tr key={row.m} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                          <td className="px-4 py-3"><code className="font-mono text-xs px-2 py-1 rounded" style={{ background: "rgba(126,248,216,0.08)", color: "var(--accent)" }}>{row.m}</code></td>
                          <td className="px-4 py-3 text-sm" style={{ color: "var(--text-secondary)" }}>{row.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4">
                  <Link
                    href="/api-reference"
                    className="inline-flex items-center gap-1.5 text-sm font-medium"
                    style={{ color: "var(--accent)" }}
                  >
                    View full API reference <ChevronRight size={14} />
                  </Link>
                </div>
              </DocSection>

              {/* ── Examples ────────────────────────────────────── */}
              <DocSection id="examples" title="Real-World Examples">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { title: "E-Commerce Orders", desc: "Compress customer orders and product data for LLM analysis." },
                    { title: "Document Processing", desc: "Summarize legal documents and contracts before LLM review." },
                    { title: "RAG Pipelines", desc: "Optimize retrieval chunks before injecting into LLM context." },
                    { title: "Customer Support", desc: "Compress ticket history and chat logs for agent context." },
                  ].map((ex) => (
                    <div
                      key={ex.title}
                      className="rounded-xl p-4"
                      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
                    >
                      <h4 className="font-medium text-sm mb-1.5">{ex.title}</h4>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{ex.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Link
                    href="/playground"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: "var(--accent)", color: "#000" }}
                  >
                    Try the Playground
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </DocSection>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
