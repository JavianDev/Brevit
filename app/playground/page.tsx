"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Copy, Check, ChevronDown, Zap, Bot, Share2,
  Info, Loader2, RotateCcw, FileText, FileJson, FlaskConical, SlidersHorizontal, X
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { BrevitClient, BrevitConfig, JsonOptimizationMode } from "@/lib/brevit-browser";
import { estimateTokens } from "@/lib/utils";
import { puterChat, isPuterAvailable, PUTER_MODELS, type PuterModel } from "@/lib/puter";

// Dynamic import of Monaco Editor (SSR-unsafe)
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

// ── Sample data ───────────────────────────────────────────────────────────────
const SAMPLES: Record<string, { label: string; content: string; type: "json" | "text" }> = {
  ecommerce: {
    label: "E-Commerce Order",
    type: "json",
    content: `{
  "customer": {
    "id": "cust-789",
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "tier": "premium"
  },
  "order": {
    "id": "ORD-2024-5591",
    "status": "SHIPPED",
    "createdAt": "2024-01-15T10:30:00Z",
    "shippingAddress": {
      "street": "123 Maple Ave",
      "city": "Springfield",
      "state": "IL",
      "zip": "62701"
    },
    "items": [
      { "sku": "BOOT-42-BLK", "name": "Hiking Boots", "qty": 1, "price": 129.99 },
      { "sku": "SOCK-M-WOL", "name": "Wool Socks", "qty": 3, "price": 14.99 },
      { "sku": "PACK-35L-GRN", "name": "Backpack 35L", "qty": 1, "price": 89.99 }
    ],
    "subtotal": 264.96,
    "tax": 21.20,
    "total": 286.16
  }
}`,
  },
  userProfile: {
    label: "User Profile",
    type: "json",
    content: `{
  "user": {
    "id": "usr-1234",
    "username": "johndoe",
    "email": "john@example.com",
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "bio": "Software engineer and hiking enthusiast.",
      "avatar": "https://example.com/avatars/johndoe.jpg"
    },
    "preferences": {
      "theme": "dark",
      "language": "en",
      "notifications": { "email": true, "push": false, "sms": false }
    },
    "stats": {
      "postsCount": 142,
      "followersCount": 893,
      "followingCount": 256
    }
  }
}`,
  },
  articleText: {
    label: "Article Text",
    type: "text",
    content: `Artificial intelligence has transformed the way we interact with software. Large language models, or LLMs, can understand and generate human-like text with remarkable accuracy. However, using these models comes with significant costs that scale directly with the number of tokens processed.

Token optimization is the practice of reducing the number of tokens sent to an LLM without losing the essential information needed for the model to respond accurately. This can involve compressing JSON structures, removing redundant whitespace, or summarizing long text passages.

Brevit implements a suite of optimization techniques including dot-notation JSON flattening, tabular array compression, TextRank-based text summarization, and an intelligent abbreviation engine. Together, these techniques typically reduce token counts by 40 to 60 percent on real-world data.

The cost savings can be substantial. An application that processes one million LLM API calls per month at 100 tokens per call spends around two hundred dollars monthly at standard rates. With Brevit reducing the token count by 50 percent, that cost drops to one hundred dollars — saving twelve hundred dollars annually from a single line of code change.`,
  },
  hikeTrails: {
    label: "Hike Trails",
    type: "json",
    content: `{
  "region": "Pacific Northwest",
  "trails": [
    { "id": 1, "name": "Blue Lake Trail", "distanceKm": 7.5, "elevationGain": 320, "difficulty": "moderate", "rating": 4.8 },
    { "id": 2, "name": "Ridge Overlook", "distanceKm": 9.2, "elevationGain": 540, "difficulty": "hard", "rating": 4.9 },
    { "id": 3, "name": "Wildflower Loop", "distanceKm": 5.1, "elevationGain": 180, "difficulty": "easy", "rating": 4.6 },
    { "id": 4, "name": "Summit Pass", "distanceKm": 14.2, "elevationGain": 1200, "difficulty": "very hard", "rating": 4.7 },
    { "id": 5, "name": "Lakeside Path", "distanceKm": 3.8, "elevationGain": 90, "difficulty": "easy", "rating": 4.4 }
  ],
  "meta": { "lastUpdated": "2024-01-15", "source": "TrailDB v2" }
}`,
  },
};

const TAB_LABELS = ["brevit", "yaml", "json"];

// ── Token counting (accurate whitespace estimator) ────────────────────────────
function countTokens(text: string): number {
  if (!text) return 0;
  // Split on common token boundaries: whitespace, punctuation, special chars
  const tokens = text
    .replace(/\s+/g, " ")
    .trim()
    .split(/[\s{}[\]:,\n"'=@.]+/)
    .filter(Boolean);
  // Each punctuation character is roughly its own token
  const punctCount = (text.match(/[{}[\]:,\n"'=@.]/g) || []).length;
  return Math.max(1, Math.round(tokens.length * 0.75 + punctCount * 0.5));
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PlaygroundPage() {
  const [input, setInput] = useState(SAMPLES.ecommerce.content);
  const [inputType, setInputType] = useState<"json" | "text">("json");
  const [mode, setMode] = useState<"brevity" | "optimize" | "text">("brevity");
  const [ratio, setRatio] = useState(0.5);
  const [enableAbbrevs, setEnableAbbrevs] = useState(true);
  const [abbrevThreshold, setAbbrevThreshold] = useState(2);

  const [brevitOutput, setBrevitOutput] = useState("");
  const [yamlOutput, setYamlOutput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [activeOutTab, setActiveOutTab] = useState("brevit");
  const [hasRun, setHasRun] = useState(false);

  // LLM panel
  const [llmModel, setLlmModel] = useState<PuterModel>("gpt-4o-mini");
  const [llmPrompt, setLlmPrompt] = useState("Summarize the content and list 3 key takeaways.");
  const [originalResponse, setOriginalResponse] = useState("");
  const [brevitResponse, setBrevitResponse] = useState("");
  const [llmLoading, setLlmLoading] = useState(false);
  const [llmError, setLlmError] = useState("");
  const [llmPanelOpen, setLlmPanelOpen] = useState(false);
  const [puterLoaded, setPuterLoaded] = useState(false);

  // Copied state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Config panel
  const [configOpen, setConfigOpen] = useState(false);

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  const runBrevit = useCallback(() => {
    const config = new BrevitConfig({
      enableAbbreviations: enableAbbrevs,
      abbreviationThreshold: abbrevThreshold,
      jsonMode: JsonOptimizationMode.Flatten,
    });
    const client = new BrevitClient(config);

    let bOut = "";
    let yOut = "";
    let jOut = "";

    try {
      if (mode === "brevity") {
        bOut = client.brevity(input);
      } else if (mode === "optimize") {
        bOut = client.optimize(input);
      } else {
        bOut = client.optimizeText(input, ratio);
      }
    } catch (e) {
      bOut = `Error: ${String(e)}`;
    }

    try {
      yOut = client.toYaml(input);
    } catch (e) {
      yOut = `Error: ${String(e)}`;
    }

    try {
      const trimmed = input.trim();
      if ((trimmed.startsWith("{") && trimmed.endsWith("}")) ||
          (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
        const obj = JSON.parse(input);
        jOut = JSON.stringify(obj, null, 2);
      } else {
        jOut = input;
      }
    } catch {
      jOut = input;
    }

    setBrevitOutput(bOut);
    setYamlOutput(yOut);
    setJsonOutput(jOut);
    setHasRun(true);
  }, [input, mode, ratio, enableAbbrevs, abbrevThreshold]);

  // Run on mount
  useEffect(() => { runBrevit(); }, []);

  // Auto-run on input/config change (debounced)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { runBrevit(); }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, mode, ratio, enableAbbrevs, abbrevThreshold, runBrevit]);

  // Share URL
  function shareUrl() {
    const params = new URLSearchParams({
      input: encodeURIComponent(input),
      mode,
      ratio: String(ratio),
    });
    const url = `${window.location.origin}/playground?${params.toString()}`;
    navigator.clipboard.writeText(url);
    setCopiedKey("share");
    setTimeout(() => setCopiedKey(null), 2000);
  }

  // Load URL state on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const inp = params.get("input");
    if (inp) { try { setInput(decodeURIComponent(inp)); } catch { /* ignore */ } }
    const m = params.get("mode") as typeof mode;
    if (m) setMode(m);
    const r = params.get("ratio");
    if (r) setRatio(Number(r));
  }, []);

  // Run LLM comparison
  async function runLlmComparison() {
    if (!isPuterAvailable()) {
      setLlmError("Puter.js is still loading. Please wait a moment and try again.");
      return;
    }
    setLlmLoading(true);
    setLlmError("");
    setOriginalResponse("");
    setBrevitResponse("");
    try {
      const [orig, comp] = await Promise.all([
        puterChat(`${llmPrompt}\n\n${jsonOutput || input}`, llmModel),
        puterChat(`${llmPrompt}\n\n${brevitOutput}`, llmModel),
      ]);
      setOriginalResponse(orig);
      setBrevitResponse(comp);
    } catch (e) {
      setLlmError(String(e));
    } finally {
      setLlmLoading(false);
    }
  }

  const tokensBefore = countTokens(jsonOutput || input);
  const tokensAfter = countTokens(brevitOutput);
  const tokensBrevit = countTokens(brevitOutput);
  const tokensYaml = countTokens(yamlOutput);
  const savingPct = tokensBefore > 0 ? Math.round(((tokensBefore - tokensAfter) / tokensBefore) * 100) : 0;

  const outputs: Record<string, { label: string; content: string; tokens: number }> = {
    brevit: { label: "Brevit", content: brevitOutput, tokens: tokensBrevit },
    yaml: { label: "YAML", content: yamlOutput, tokens: tokensYaml },
    json: { label: "JSON", content: jsonOutput, tokens: tokensBefore },
  };

  return (
    <>
      <Script src="https://js.puter.com/v2/" onLoad={() => setPuterLoaded(true)} strategy="afterInteractive" />
      <Navbar />

      <main className="pt-14 min-h-screen" style={{ background: "var(--bg)" }}>
        {/* Header */}
        <div
          className="border-b px-5 py-4"
          style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.6)" }}
        >
          <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <FlaskConical size={16} style={{ color: "var(--accent)" }} />
                <h1 className="text-base font-semibold">Playground</h1>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ background: "rgba(126,248,216,0.08)", color: "var(--accent)", border: "1px solid rgba(126,248,216,0.15)" }}>
                  Brevit v1.0.2
                </span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                Runs entirely in your browser — no server, no API keys.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Sample selector */}
              <select
                onChange={(e) => {
                  const s = SAMPLES[e.target.value];
                  if (s) { setInput(s.content); setInputType(s.type); }
                }}
                className="text-xs px-3 py-1.5 rounded-lg outline-none cursor-pointer"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
              >
                <option value="">Load sample…</option>
                {Object.entries(SAMPLES).map(([key, s]) => (
                  <option key={key} value={key}>{s.label}</option>
                ))}
              </select>
              <button
                onClick={shareUrl}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
              >
                {copiedKey === "share" ? <Check size={12} style={{ color: "var(--success)" }} /> : <Share2 size={12} />}
                Share
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-5 py-6">
          {/* Top controls */}
          <div
            className="flex flex-wrap items-center gap-3 mb-5 p-3 rounded-xl"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)" }}
          >
            {/* Mode */}
            <div className="flex items-center gap-1">
              <span className="text-xs mr-1" style={{ color: "var(--text-muted)" }}>Mode:</span>
              {([["brevity", "brevity()"], ["optimize", "optimize()"], ["text", "optimizeText()"]] as const).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setMode(id)}
                  className="text-xs px-2.5 py-1.5 rounded-lg font-mono transition-all"
                  style={{
                    background: mode === id ? "rgba(126,248,216,0.1)" : "transparent",
                    color: mode === id ? "var(--accent)" : "var(--text-muted)",
                    border: mode === id ? "1px solid rgba(126,248,216,0.2)" : "1px solid transparent",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Ratio slider (only in text mode) */}
            <AnimatePresence>
              {mode === "text" && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex items-center gap-2 overflow-hidden"
                >
                  <span className="text-xs whitespace-nowrap" style={{ color: "var(--text-muted)" }}>Ratio:</span>
                  <input
                    type="range"
                    min={0.1} max={1.0} step={0.1}
                    value={ratio}
                    onChange={(e) => setRatio(Number(e.target.value))}
                    className="w-20 h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, var(--accent) ${ratio * 100}%, rgba(255,255,255,0.1) ${ratio * 100}%)`,
                      WebkitAppearance: "none",
                    }}
                  />
                  <span className="text-xs font-mono w-8" style={{ color: "var(--accent)" }}>{ratio.toFixed(1)}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Config button */}
            <button
              onClick={() => setConfigOpen(!configOpen)}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-all ml-auto"
              style={{
                background: configOpen ? "rgba(126,248,216,0.08)" : "transparent",
                color: configOpen ? "var(--accent)" : "var(--text-muted)",
                border: "1px solid transparent",
              }}
            >
              <SlidersHorizontal size={12} />
              Config
            </button>
          </div>

          {/* Config panel (collapsible) */}
          <AnimatePresence>
            {configOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-5"
              >
                <div
                  className="p-4 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(126,248,216,0.12)" }}
                >
                  <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableAbbrevs}
                        onChange={(e) => setEnableAbbrevs(e.target.checked)}
                        className="rounded"
                        style={{ accentColor: "var(--accent)" }}
                      />
                      <span style={{ color: "var(--text-secondary)" }}>Enable abbreviations</span>
                    </label>
                    {enableAbbrevs && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm" style={{ color: "var(--text-muted)" }}>Abbreviation threshold:</span>
                        <input
                          type="number"
                          min={1} max={10}
                          value={abbrevThreshold}
                          onChange={(e) => setAbbrevThreshold(Number(e.target.value))}
                          className="w-16 px-2 py-1 rounded-md text-sm font-mono text-center outline-none"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "var(--accent)" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Split pane: Input | Output */}
          <div className="grid lg:grid-cols-2 gap-5 mb-6">
            {/* Input panel */}
            <div
              className="rounded-xl overflow-hidden flex flex-col"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", minHeight: 480 }}
            >
              <div
                className="flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0"
                style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
              >
                <div className="flex items-center gap-2">
                  {/* Traffic lights */}
                  <div className="flex gap-1.5">
                    {["#f87171", "#fb923c", "#4ade80"].map((c) => (
                      <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.4 }} />
                    ))}
                  </div>
                  <span className="text-xs font-mono ml-2" style={{ color: "var(--text-muted)" }}>Input</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-mono"
                    style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}
                  >
                    ~{tokensBefore} tokens
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setInput("")}
                    className="p-1.5 rounded-md text-xs transition-all"
                    style={{ color: "var(--text-muted)" }}
                    title="Clear"
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
                  >
                    <RotateCcw size={12} />
                  </button>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <MonacoEditor
                  height="440px"
                  language={inputType === "json" ? "json" : "plaintext"}
                  theme="vs-dark"
                  value={input}
                  onChange={(v) => setInput(v ?? "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 12,
                    fontFamily: "var(--font-geist-mono, 'Courier New', monospace)",
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                    automaticLayout: true,
                    renderLineHighlight: "none",
                    overviewRulerLanes: 0,
                    hideCursorInOverviewRuler: true,
                    scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
                    padding: { top: 12, bottom: 12 },
                  }}
                />
              </div>
            </div>

            {/* Output panel */}
            <div
              className="rounded-xl overflow-hidden flex flex-col"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", minHeight: 480 }}
            >
              <div
                className="flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0"
                style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    {["#f87171", "#fb923c", "#4ade80"].map((c) => (
                      <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.4 }} />
                    ))}
                  </div>
                  <div className="flex gap-0.5 ml-2">
                    {TAB_LABELS.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveOutTab(tab)}
                        className="text-xs px-2.5 py-1 rounded-md font-mono transition-all"
                        style={{
                          background: activeOutTab === tab ? "rgba(126,248,216,0.1)" : "transparent",
                          color: activeOutTab === tab ? "var(--accent)" : "var(--text-muted)",
                          border: activeOutTab === tab ? "1px solid rgba(126,248,216,0.2)" : "1px solid transparent",
                        }}
                      >
                        {outputs[tab]?.label}
                        {activeOutTab === tab && (
                          <span className="ml-1.5 text-xs opacity-70">~{outputs[tab]?.tokens}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {activeOutTab === "brevit" && savingPct > 0 && (
                    <span
                      className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(74,222,128,0.12)", color: "var(--success)" }}
                    >
                      −{savingPct}%
                    </span>
                  )}
                  <button
                    onClick={() => copyText(outputs[activeOutTab]?.content ?? "", `out-${activeOutTab}`)}
                    className="p-1.5 rounded-md transition-all"
                    style={{ color: "var(--text-muted)", background: "rgba(255,255,255,0.05)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
                  >
                    {copiedKey === `out-${activeOutTab}` ? <Check size={12} style={{ color: "var(--success)" }} /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <pre
                  className="text-xs font-mono leading-relaxed whitespace-pre-wrap"
                  style={{ color: "var(--text-primary)" }}
                >
                  {outputs[activeOutTab]?.content || "Run brevity() to see output…"}
                </pre>
              </div>
            </div>
          </div>

          {/* Token comparison bar */}
          {hasRun && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-4 mb-6"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                  Token Comparison
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Estimated tokens (GPT-style)
                </span>
              </div>
              <div className="space-y-2">
                {[
                  { label: "JSON (original)", tokens: tokensBefore, color: "#555" },
                  { label: "YAML", tokens: tokensYaml, color: "#7e6baa" },
                  { label: "Brevit", tokens: tokensBrevit, color: "var(--accent)", highlight: true },
                ].map((item) => {
                  const pct = (item.tokens / tokensBefore) * 100;
                  return (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="text-xs w-28 flex-shrink-0 font-mono" style={{ color: "var(--text-muted)" }}>
                        {item.label}
                      </span>
                      <div className="flex-1 h-6 rounded overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="h-full flex items-center px-2"
                          style={{ background: item.color, minWidth: 32 }}
                        >
                          <span className="text-xs font-mono font-semibold" style={{ color: item.highlight ? "#000" : "#fff" }}>
                            {item.tokens}
                          </span>
                        </motion.div>
                      </div>
                      {item.highlight && savingPct > 0 && (
                        <span className="text-xs font-mono font-semibold w-14 flex-shrink-0" style={{ color: "var(--success)" }}>
                          −{savingPct}%
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* LLM Comparison Panel */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--border)" }}
          >
            <button
              onClick={() => setLlmPanelOpen(!llmPanelOpen)}
              className="w-full flex items-center justify-between px-5 py-4 transition-all"
              style={{
                background: llmPanelOpen ? "rgba(126,248,216,0.04)" : "rgba(255,255,255,0.02)",
                color: "var(--text-primary)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(126,248,216,0.04)"; }}
              onMouseLeave={(e) => {
                if (!llmPanelOpen) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.02)";
              }}
            >
              <div className="flex items-center gap-2">
                <Bot size={16} style={{ color: "var(--accent)" }} />
                <span className="font-medium text-sm">LLM Comparison</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(126,248,216,0.08)", color: "var(--accent)", border: "1px solid rgba(126,248,216,0.15)" }}>
                  via Puter.js
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Free · No API key · Runs in browser
                </span>
              </div>
              <ChevronDown
                size={16}
                style={{
                  color: "var(--text-muted)",
                  transform: llmPanelOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
            </button>

            <AnimatePresence>
              {llmPanelOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div
                    className="px-5 py-5 border-t"
                    style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.2)" }}
                  >
                    <div className="text-xs mb-4 flex items-start gap-2 p-3 rounded-lg" style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)", color: "var(--text-secondary)" }}>
                      <Info size={13} style={{ color: "#38bdf8", flexShrink: 0, marginTop: 1 }} />
                      Sends your input to an LLM via{" "}
                      <a href="https://developer.puter.com/tutorials/free-unlimited-openai-api/" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#38bdf8" }}>
                        Puter&apos;s free client-side API
                      </a>. No keys stored in this app.
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      {/* Model selector */}
                      <div>
                        <label className="block text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>Model</label>
                        <select
                          value={llmModel}
                          onChange={(e) => setLlmModel(e.target.value as PuterModel)}
                          className="w-full text-sm px-3 py-2 rounded-lg outline-none"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                        >
                          {PUTER_MODELS.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.label} — {m.description}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Prompt */}
                      <div>
                        <label className="block text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>Prompt / Task</label>
                        <input
                          value={llmPrompt}
                          onChange={(e) => setLlmPrompt(e.target.value)}
                          className="w-full text-sm px-3 py-2 rounded-lg outline-none"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                          placeholder="e.g. Summarize the content…"
                          onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(126,248,216,0.3)"; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mb-5">
                      <button
                        onClick={runLlmComparison}
                        disabled={llmLoading || !brevitOutput}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: "var(--accent)", color: "#000" }}
                      >
                        {llmLoading ? (
                          <><Loader2 size={14} className="animate-spin" /> Running comparison…</>
                        ) : (
                          <><Play size={14} /> Run comparison</>
                        )}
                      </button>
                      {(originalResponse || brevitResponse) && (
                        <button
                          onClick={() => { setOriginalResponse(""); setBrevitResponse(""); }}
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm transition-all"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
                        >
                          <RotateCcw size={13} /> Clear
                        </button>
                      )}
                    </div>

                    {llmError && (
                      <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}>
                        {llmError}
                      </div>
                    )}

                    {(originalResponse || brevitResponse || llmLoading) && (
                      <div className="grid sm:grid-cols-2 gap-4">
                        <ResponsePanel
                          label="Original Input Response"
                          tokens={tokensBefore}
                          content={originalResponse}
                          loading={llmLoading && !originalResponse}
                          onCopy={() => copyText(originalResponse, "orig-resp")}
                          copied={copiedKey === "orig-resp"}
                        />
                        <ResponsePanel
                          label="Brevit Compressed Response"
                          tokens={tokensAfter}
                          content={brevitResponse}
                          loading={llmLoading && !brevitResponse}
                          isCompressed
                          onCopy={() => copyText(brevitResponse, "comp-resp")}
                          copied={copiedKey === "comp-resp"}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </>
  );
}

function ResponsePanel({
  label, tokens, content, loading, isCompressed = false, onCopy, copied,
}: {
  label: string;
  tokens: number;
  content: string;
  loading: boolean;
  isCompressed?: boolean;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: isCompressed ? "1px solid rgba(126,248,216,0.2)" : "1px solid var(--border)",
        background: isCompressed ? "rgba(126,248,216,0.03)" : "rgba(255,255,255,0.02)",
      }}
    >
      <div
        className="flex items-center justify-between px-3 py-2 border-b"
        style={{ borderColor: isCompressed ? "rgba(126,248,216,0.15)" : "rgba(255,255,255,0.06)" }}
      >
        <div>
          <span className="text-xs font-medium" style={{ color: isCompressed ? "var(--accent)" : "var(--text-secondary)" }}>
            {label}
          </span>
          <span className="text-xs ml-2 font-mono" style={{ color: "var(--text-muted)" }}>
            ~{tokens} input tokens
          </span>
        </div>
        <button onClick={onCopy} className="p-1.5 rounded-md" style={{ color: "var(--text-muted)", background: "rgba(255,255,255,0.05)" }}>
          {copied ? <Check size={11} style={{ color: "var(--success)" }} /> : <Copy size={11} />}
        </button>
      </div>
      <div className="p-3 min-h-24 max-h-64 overflow-y-auto">
        {loading ? (
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
            <Loader2 size={12} className="animate-spin" />
            Waiting for response…
          </div>
        ) : (
          <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>
            {content || <span style={{ color: "var(--text-muted)" }}>—</span>}
          </p>
        )}
      </div>
    </div>
  );
}
