"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import mammoth from "mammoth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Copy, Check, ChevronDown, Bot, Share2,
  Info, Loader2, RotateCcw, FileText, FileJson, FlaskConical, SlidersHorizontal, Tag, Upload,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { BrevitClient, BrevitConfig, JsonOptimizationMode } from "@/lib/brevit-browser";
import { puterChat, isPuterAvailable, PUTER_MODELS, type PuterModel } from "@/lib/puter";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

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
  articleText: {
    label: "Article Text",
    type: "text",
    content: `Artificial intelligence has transformed the way we interact with software. Large language models, or LLMs, can understand and generate human-like text with remarkable accuracy. However, using these models comes with significant costs that scale directly with the number of tokens processed.

Token optimization is the practice of reducing the number of tokens sent to an LLM without losing the essential information needed for the model to respond accurately. This can involve compressing JSON structures, removing redundant whitespace, or summarizing long text passages.

Brevit implements a suite of optimization techniques including dot-notation JSON flattening, tabular array compression, TextRank-based text summarization, and an intelligent abbreviation engine. Together, these techniques typically reduce token counts by 40 to 60 percent on real-world data.

The cost savings can be substantial. An application that processes one million LLM API calls per month at 100 tokens per call spends around two hundred dollars monthly at standard rates. With Brevit reducing the token count by 50 percent, that cost drops to one hundred dollars — saving twelve hundred dollars annually from a single line of code change.`,
  },
  researchPaper: {
    label: "AI Research Paper",
    type: "text",
    content: `Transformer architectures have fundamentally changed the landscape of natural language processing since the publication of Attention Is All You Need in 2017. The self-attention mechanism allows models to weigh the importance of different tokens in a sequence relative to each other, enabling parallel processing of input data.

Pre-training on large corpora followed by task-specific fine-tuning has become the dominant paradigm. Models like BERT demonstrated that bidirectional context understanding significantly improves performance on downstream tasks including question answering, sentiment analysis, and named entity recognition.

Scaling laws have shown that model performance improves predictably with increases in model size, dataset size, and compute budget. This has driven the development of increasingly large models, from GPT-2 with 1.5 billion parameters to GPT-4 with an estimated trillion or more parameters.

However, the computational cost of training and inference scales quadratically with sequence length due to the attention mechanism. Various approaches have been proposed to address this limitation, including sparse attention patterns, linear attention mechanisms, and sliding window approaches.

Recent research has focused on making large language models more efficient through techniques such as quantization, pruning, knowledge distillation, and mixture-of-experts architectures. These methods aim to reduce the computational requirements while maintaining model quality.

The emergence of instruction tuning and reinforcement learning from human feedback has improved the alignment of large language models with human preferences, making them more useful and safer for deployment in real-world applications.`,
  },
  legalContract: {
    label: "Legal Contract",
    type: "text",
    content: `This Software License Agreement ("Agreement") is entered into as of the date of acceptance by and between the Licensor, hereinafter referred to as "Company," and the end user, hereinafter referred to as "Licensee."

WHEREAS, the Company has developed certain proprietary software and related documentation; and WHEREAS, the Licensee desires to obtain a license to use such software subject to the terms and conditions set forth herein.

NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

Grant of License. Subject to the terms of this Agreement, the Company hereby grants to the Licensee a non-exclusive, non-transferable, revocable license to use the software solely for the Licensee's internal business purposes. The Licensee shall not sublicense, distribute, or otherwise make the software available to any third party without prior written consent.

Intellectual Property. All intellectual property rights in and to the software, including but not limited to copyrights, patents, trade secrets, and trademarks, shall remain the exclusive property of the Company. The Licensee acknowledges that the software contains trade secrets and proprietary information.

Limitation of Liability. In no event shall the Company be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to the use of the software, regardless of whether such damages were foreseeable.`,
  },
  supportTicket: {
    label: "Support Ticket",
    type: "text",
    content: `Customer reported that the dashboard loading time has increased significantly over the past week. Average page load went from 2 seconds to over 8 seconds. The issue appears to affect all users in the organization.

Steps to reproduce: Log into the application, navigate to the main dashboard page, and observe the loading spinner. The analytics widgets take the longest to render.

Investigation revealed that a recent database migration added several unindexed columns that are being queried in the dashboard aggregation pipeline. The query execution plan shows full table scans on the events table which contains over 50 million rows.

Recommended fix: Add composite indexes on the created_at and event_type columns, and implement query result caching with a 5-minute TTL for dashboard aggregations.`,
  },
};

type JsonMode = "flatten" | "yaml" | "raw" | "filter";

function countTokens(text: string): number {
  if (!text) return 0;
  const tokens = text.replace(/\s+/g, " ").trim().split(/[\s{}[\]:,\n"'=@.]+/).filter(Boolean);
  const punctCount = (text.match(/[{}[\]:,\n"'=@.]/g) || []).length;
  return Math.max(1, Math.round(tokens.length * 0.75 + punctCount * 0.5));
}

function extractAbbreviations(output: string): Record<string, string> {
  const map: Record<string, string> = {};
  const lines = output.split("\n");
  for (const line of lines) {
    const match = line.match(/^@(\w+)=(.+)$/);
    if (match) map[match[1]] = match[2];
  }
  return map;
}

function countSentences(text: string): number {
  return (text.match(/[^.!?]+[.!?]+/g) || [text]).length;
}

export default function PlaygroundPage() {
  const [input, setInput] = useState(SAMPLES.ecommerce.content);
  const [inputType, setInputType] = useState<"json" | "text">("json");
  const [ratio, setRatio] = useState(0.5);
  const [textMode, setTextMode] = useState<"auto" | "ratio">("ratio");
  const [enableAbbrevs, setEnableAbbrevs] = useState(true);
  const [abbrevThreshold, setAbbrevThreshold] = useState(2);
  const [jsonMode, setJsonMode] = useState<JsonMode>("flatten");
  const [brevitOutput, setBrevitOutput] = useState("");
  const [yamlOutput, setYamlOutput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [activeOutTab, setActiveOutTab] = useState("brevit");
  const [hasRun, setHasRun] = useState(false);
  const [abbreviationMap, setAbbreviationMap] = useState<Record<string, string>>({});

  const [llmModel, setLlmModel] = useState<PuterModel>("gpt-4o-mini");
  const [llmPrompt, setLlmPrompt] = useState("Summarize the content and list 3 key takeaways.");
  const [originalResponse, setOriginalResponse] = useState("");
  const [brevitResponse, setBrevitResponse] = useState("");
  const [llmLoading, setLlmLoading] = useState(false);
  const [llmError, setLlmError] = useState("");
  const [llmPanelOpen, setLlmPanelOpen] = useState(false);
  const [puterLoaded, setPuterLoaded] = useState(false);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [selectedSample, setSelectedSample] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  const allowedFileTypes = inputType === "json"
    ? [".json"]
    : [".txt", ".md", ".csv", ".docx"];

  async function parseDocx(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    return result.value.trim();
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploadedFileName("");
    setIsUploading(true);

    const lowerName = file.name.toLowerCase();
    const ext = lowerName.slice(lowerName.lastIndexOf("."));
    const isAllowed = allowedFileTypes.includes(ext);

    if (!isAllowed) {
      setUploadError(
        inputType === "json"
          ? "JSON mode only accepts .json files."
          : "Text mode accepts .txt, .md, .csv, or .docx files."
      );
      setIsUploading(false);
      e.target.value = "";
      return;
    }

    try {
      let nextInput = "";
      if (ext === ".docx") {
        nextInput = await parseDocx(file);
      } else {
        nextInput = await file.text();
      }

      if (inputType === "json") {
        const parsed = JSON.parse(nextInput);
        nextInput = JSON.stringify(parsed, null, 2);
      }

      setInput(nextInput);
      setUploadedFileName(file.name);
      setSelectedSample("");
    } catch (error) {
      if (inputType === "json") {
        setUploadError("Invalid JSON file. Please upload a valid .json file.");
      } else {
        setUploadError(`Could not read file: ${String(error)}`);
      }
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  const runBrevit = useCallback(() => {
    const modeMap: Record<string, string> = {
      flatten: JsonOptimizationMode.Flatten,
      yaml: JsonOptimizationMode.ToYaml,
      raw: JsonOptimizationMode.None,
      filter: JsonOptimizationMode.Flatten,
    };

    const config = new BrevitConfig({
      enableAbbreviations: enableAbbrevs,
      abbreviationThreshold: abbrevThreshold,
      jsonMode: (modeMap[jsonMode] ?? JsonOptimizationMode.Flatten) as typeof JsonOptimizationMode[keyof typeof JsonOptimizationMode],
    });
    const client = new BrevitClient(config);

    let bOut = "";
    let yOut = "";
    let jOut = "";

    try {
      if (inputType === "text") {
        const effectiveRatio = textMode === "auto" ? undefined : ratio;
        bOut = client.optimizeText(input, effectiveRatio ?? 0.4);
      } else {
        bOut = client.brevity(input);
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
    setAbbreviationMap(extractAbbreviations(bOut));
    setHasRun(true);
  }, [input, inputType, textMode, ratio, enableAbbrevs, abbrevThreshold, jsonMode]);

  useEffect(() => { runBrevit(); }, []);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { runBrevit(); }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, inputType, textMode, ratio, enableAbbrevs, abbrevThreshold, jsonMode, runBrevit]);

  function shareUrl() {
    const params = new URLSearchParams({
      input: encodeURIComponent(input),
      type: inputType,
      ratio: String(ratio),
    });
    const url = `${window.location.origin}/playground?${params.toString()}`;
    navigator.clipboard.writeText(url);
    setCopiedKey("share");
    setTimeout(() => setCopiedKey(null), 2000);
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const inp = params.get("input");
    if (inp) { try { setInput(decodeURIComponent(inp)); } catch { /* ignore */ } }
    const t = params.get("type") as "json" | "text";
    if (t) setInputType(t);
    const r = params.get("ratio");
    if (r) setRatio(Number(r));
  }, []);

  useEffect(() => {
    setSelectedSample("");
    setUploadError("");
    setUploadedFileName("");
    if (inputType === "text" && activeOutTab !== "brevit") {
      setActiveOutTab("brevit");
    }
  }, [inputType, activeOutTab]);

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

  const sentencesBefore = inputType === "text" ? countSentences(input) : 0;
  const sentencesAfter = inputType === "text" ? countSentences(brevitOutput) : 0;

  const TAB_LABELS = inputType === "json" ? ["brevit", "yaml", "json"] : ["brevit"];
  const sampleOptions = Object.entries(SAMPLES).filter(([, sample]) => sample.type === inputType);
  const outputs: Record<string, { label: string; content: string; tokens: number }> = {
    brevit: { label: "Brevit", content: brevitOutput, tokens: tokensBrevit },
    yaml: { label: "YAML", content: yamlOutput, tokens: tokensYaml },
    json: { label: "JSON", content: jsonOutput, tokens: tokensBefore },
  };

  const abbrevEntries = Object.entries(abbreviationMap);

  return (
    <>
      <Script src="https://js.puter.com/v2/" onLoad={() => setPuterLoaded(true)} strategy="afterInteractive" />
      <Navbar />

      <main className="pt-14 min-h-screen" style={{ background: "var(--bg)" }}>
        {/* Header */}
        <div
          className="border-b px-5 py-4"
          style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}
        >
          <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <FlaskConical size={16} style={{ color: "var(--accent)" }} />
                <h1 className="text-base font-semibold">Playground</h1>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid var(--accent)" }}>
                  Brevit v1.0.2
                </span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                Runs entirely in your browser — no server, no API keys.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={shareUrl}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background: "var(--hover-bg)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
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
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
          >
            {/* Input type tabs */}
            <div className="flex items-center gap-1">
              <span className="text-xs mr-1" style={{ color: "var(--text-muted)" }}>Input:</span>
              {([["json", "JSON", FileJson], ["text", "Text", FileText]] as const).map(([id, label, Icon]) => (
                <button
                  key={id}
                  onClick={() => setInputType(id as "json" | "text")}
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all"
                  style={{
                    background: inputType === id ? "var(--accent-dim)" : "transparent",
                    color: inputType === id ? "var(--accent)" : "var(--text-muted)",
                    border: inputType === id ? "1px solid var(--accent)" : "1px solid transparent",
                  }}
                >
                  <Icon size={12} />
                  {label}
                </button>
              ))}
            </div>

            <select
              value={selectedSample}
              onChange={(e) => {
                const key = e.target.value;
                setSelectedSample(key);
                const sample = SAMPLES[key];
                if (sample) {
                  setInput(sample.content);
                  setUploadError("");
                  setUploadedFileName("");
                }
              }}
              className="text-xs px-3 py-1.5 rounded-lg outline-none cursor-pointer"
              style={{ background: "var(--hover-bg)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            >
              <option value="">Load {inputType} sample…</option>
              {sampleOptions.map(([key, sample]) => (
                <option key={key} value={key}>
                  {sample.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-all"
              style={{ background: "var(--hover-bg)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
              title={`Upload ${inputType} file`}
              disabled={isUploading}
            >
              {isUploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
              {isUploading ? "Reading..." : "Upload"}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept={allowedFileTypes.join(",")}
              onChange={handleFileUpload}
              className="hidden"
            />

            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Allowed: {allowedFileTypes.join(", ")}
            </span>

            <div className="w-px h-5" style={{ background: "var(--border)" }} />

            {/* JSON mode selector */}
            {inputType === "json" && (
              <div className="flex items-center gap-1">
                <span className="text-xs mr-1" style={{ color: "var(--text-muted)" }}>JSON Mode:</span>
                {(["flatten", "yaml", "raw"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setJsonMode(m)}
                    className="text-xs px-2.5 py-1.5 rounded-lg font-mono transition-all capitalize"
                    style={{
                      background: jsonMode === m ? "var(--accent-dim)" : "transparent",
                      color: jsonMode === m ? "var(--accent)" : "var(--text-muted)",
                      border: jsonMode === m ? "1px solid var(--accent)" : "1px solid transparent",
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}

            {/* Text mode controls */}
            {inputType === "text" && (
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1">
                  <span className="text-xs mr-1" style={{ color: "var(--text-muted)" }}>Text Mode:</span>
                  {(["auto", "ratio"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setTextMode(m)}
                      className="text-xs px-2.5 py-1.5 rounded-lg font-mono transition-all uppercase"
                      style={{
                        background: textMode === m ? "var(--accent-dim)" : "transparent",
                        color: textMode === m ? "var(--accent)" : "var(--text-muted)",
                        border: textMode === m ? "1px solid var(--accent)" : "1px solid transparent",
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                {textMode === "ratio" && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>Ratio:</span>
                    <input
                      type="range"
                      min={0.1} max={1.0} step={0.05}
                      value={ratio}
                      onChange={(e) => setRatio(Number(e.target.value))}
                      className="w-28 h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, var(--accent) ${ratio * 100}%, var(--border) ${ratio * 100}%)`,
                        WebkitAppearance: "none",
                      }}
                    />
                    <span className="text-xs font-mono w-10" style={{ color: "var(--accent)" }}>{(ratio * 100).toFixed(0)}%</span>
                  </div>
                )}
              </div>
            )}

            {/* Config button */}
            <button
              onClick={() => setConfigOpen(!configOpen)}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-all ml-auto"
              style={{
                background: configOpen ? "var(--accent-dim)" : "transparent",
                color: configOpen ? "var(--accent)" : "var(--text-muted)",
                border: "1px solid transparent",
              }}
            >
              <SlidersHorizontal size={12} />
              Config
            </button>
          </div>

          {(uploadedFileName || uploadError) && (
            <div
              className="mb-5 px-3 py-2 rounded-lg text-xs flex flex-wrap items-center gap-2"
              style={{
                background: uploadError ? "rgba(248,113,113,0.08)" : "var(--bg-surface)",
                border: `1px solid ${uploadError ? "var(--danger)" : "var(--border)"}`,
                color: uploadError ? "var(--danger)" : "var(--text-secondary)",
              }}
            >
              {uploadError ? (
                <span>{uploadError}</span>
              ) : (
                <>
                  <span>Loaded file:</span>
                  <code style={{ color: "var(--accent)" }}>{uploadedFileName}</code>
                </>
              )}
            </div>
          )}

          {/* Config panel */}
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
                  style={{ background: "var(--bg-surface)", border: "1px solid var(--accent)" }}
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
                          style={{ background: "var(--bg-code)", border: "1px solid var(--border)", color: "var(--accent)" }}
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
                style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    {["var(--danger)", "var(--warning)", "var(--success)"].map((c) => (
                      <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.4 }} />
                    ))}
                  </div>
                  <span className="text-xs font-mono ml-2" style={{ color: "var(--text-muted)" }}>
                    {inputType === "json" ? "Input (JSON)" : "Input (Text)"}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-mono"
                    style={{ background: "var(--hover-bg)", color: "var(--text-muted)" }}
                  >
                    ~{tokensBefore} tokens
                    {inputType === "text" && ` · ${sentencesBefore} sentences`}
                  </span>
                </div>
                <button
                  onClick={() => setInput("")}
                  className="p-1.5 rounded-md text-xs transition-all"
                  style={{ color: "var(--text-muted)" }}
                  title="Clear"
                >
                  <RotateCcw size={12} />
                </button>
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
                style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    {["var(--danger)", "var(--warning)", "var(--success)"].map((c) => (
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
                          background: activeOutTab === tab ? "var(--accent-dim)" : "transparent",
                          color: activeOutTab === tab ? "var(--accent)" : "var(--text-muted)",
                          border: activeOutTab === tab ? "1px solid var(--accent)" : "1px solid transparent",
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
                      style={{ background: "var(--accent-dim)", color: "var(--success)" }}
                    >
                      −{savingPct}%
                    </span>
                  )}
                  {inputType === "text" && activeOutTab === "brevit" && (
                    <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                      {sentencesAfter}/{sentencesBefore} kept
                    </span>
                  )}
                  <button
                    onClick={() => copyText(outputs[activeOutTab]?.content ?? "", `out-${activeOutTab}`)}
                    className="p-1.5 rounded-md transition-all"
                    style={{ color: "var(--text-muted)", background: "var(--hover-bg)" }}
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
                  {outputs[activeOutTab]?.content || "Processing…"}
                </pre>
              </div>
            </div>
          </div>

          {/* Abbreviation Map */}
          {abbrevEntries.length > 0 && enableAbbrevs && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-4 mb-6"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Tag size={13} style={{ color: "var(--purple)" }} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--purple)" }}>
                  Abbreviation Map
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {abbrevEntries.map(([alias, expansion]) => (
                  <span
                    key={alias}
                    className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg"
                    style={{ background: "var(--purple-dim)", border: "1px solid var(--purple)", color: "var(--purple)" }}
                  >
                    @{alias}
                    <span style={{ color: "var(--text-muted)" }}>=</span>
                    <span style={{ color: "var(--text-secondary)" }}>{expansion}</span>
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Token comparison bar */}
          {hasRun && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-4 mb-6"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
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
                {(inputType === "json"
                  ? [
                      { label: "JSON (original)", tokens: tokensBefore, color: "var(--text-muted)" },
                      { label: "YAML", tokens: tokensYaml, color: "var(--purple)" },
                      { label: "Brevit", tokens: tokensBrevit, color: "var(--accent)", highlight: true },
                    ]
                  : [
                      { label: "Text (original)", tokens: tokensBefore, color: "var(--text-muted)" },
                      { label: "Brevit", tokens: tokensBrevit, color: "var(--accent)", highlight: true },
                    ]
                ).map((item) => {
                  const pct = tokensBefore > 0 ? (item.tokens / tokensBefore) * 100 : 0;
                  return (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="text-xs w-28 flex-shrink-0 font-mono" style={{ color: "var(--text-muted)" }}>
                        {item.label}
                      </span>
                      <div className="flex-1 h-6 rounded overflow-hidden" style={{ background: "var(--hover-bg)" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="h-full flex items-center px-2"
                          style={{ background: item.color, minWidth: 32 }}
                        >
                          <span className="text-xs font-mono font-semibold" style={{ color: item.highlight ? "#000" : "var(--bg)" }}>
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
                background: llmPanelOpen ? "var(--accent-dim)" : "var(--bg-surface)",
                color: "var(--text-primary)",
              }}
            >
              <div className="flex items-center gap-2">
                <Bot size={16} style={{ color: "var(--accent)" }} />
                <span className="font-medium text-sm">LLM Comparison</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid var(--accent)" }}>
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
                    style={{ borderColor: "var(--border)", background: "var(--bg-code)" }}
                  >
                    <div className="text-xs mb-4 flex items-start gap-2 p-3 rounded-lg" style={{ background: "var(--accent-dim)", border: "1px solid var(--accent)", color: "var(--text-secondary)" }}>
                      <Info size={13} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 1 }} />
                      Sends your input to an LLM via{" "}
                      <a href="https://developer.puter.com/tutorials/free-unlimited-openai-api/" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--accent)" }}>
                        Puter&apos;s free client-side API
                      </a>. No keys stored in this app.
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>Model</label>
                        <select
                          value={llmModel}
                          onChange={(e) => setLlmModel(e.target.value as PuterModel)}
                          className="w-full text-sm px-3 py-2 rounded-lg outline-none"
                          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                        >
                          {PUTER_MODELS.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.label} — {m.description}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>Prompt / Task</label>
                        <input
                          value={llmPrompt}
                          onChange={(e) => setLlmPrompt(e.target.value)}
                          className="w-full text-sm px-3 py-2 rounded-lg outline-none"
                          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                          placeholder="e.g. Summarize the content…"
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
                          style={{ background: "var(--hover-bg)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
                        >
                          <RotateCcw size={13} /> Clear
                        </button>
                      )}
                    </div>

                    {llmError && (
                      <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid var(--danger)", color: "var(--danger)" }}>
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
        border: isCompressed ? "1px solid var(--accent)" : "1px solid var(--border)",
        background: isCompressed ? "var(--accent-dim)" : "var(--bg-surface)",
      }}
    >
      <div
        className="flex items-center justify-between px-3 py-2 border-b"
        style={{ borderColor: isCompressed ? "var(--accent)" : "var(--border)" }}
      >
        <div>
          <span className="text-xs font-medium" style={{ color: isCompressed ? "var(--accent)" : "var(--text-secondary)" }}>
            {label}
          </span>
          <span className="text-xs ml-2 font-mono" style={{ color: "var(--text-muted)" }}>
            ~{tokens} input tokens
          </span>
        </div>
        <button onClick={onCopy} className="p-1.5 rounded-md" style={{ color: "var(--text-muted)", background: "var(--hover-bg)" }}>
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
