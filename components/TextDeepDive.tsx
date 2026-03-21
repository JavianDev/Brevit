"use client";

import { useState, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";

const SAMPLE_TEXT = `Artificial intelligence has transformed the way we interact with software. Large language models can understand and generate human-like text with remarkable accuracy. However, using these models comes with significant costs that scale directly with the number of tokens processed. Token optimization is the practice of reducing the number of tokens sent to an LLM without losing the essential information. This can involve compressing JSON structures, removing redundant whitespace, or summarizing long text passages. Brevit implements a suite of optimization techniques including dot-notation JSON flattening, tabular array compression, and TextRank-based text summarization. Together these techniques typically reduce token counts by 40 to 60 percent on real-world data. The cost savings can be substantial for high-volume applications.`;

function textRankCompress(text: string, ratio: number): { kept: boolean[]; sentences: string[] } {
  const sentences = text.match(/[^.!?]+[.!?]+/g)?.map(s => s.trim()) || [text];
  const n = sentences.length;
  if (n <= 1) return { kept: [true], sentences };

  const keepCount = Math.max(1, Math.round(n * ratio));
  const scores: number[] = sentences.map((s, i) => {
    let score = 0;
    const words = new Set(s.toLowerCase().split(/\s+/));
    for (let j = 0; j < n; j++) {
      if (j === i) continue;
      const other = new Set(sentences[j].toLowerCase().split(/\s+/));
      let overlap = 0;
      words.forEach(w => { if (other.has(w)) overlap++; });
      score += overlap / Math.log(words.size + other.size + 1);
    }
    return score;
  });

  const indexed = scores.map((s, i) => ({ s, i }));
  indexed.sort((a, b) => b.s - a.s);
  const keptSet = new Set(indexed.slice(0, keepCount).map(x => x.i));
  const kept = sentences.map((_, i) => keptSet.has(i));
  return { kept, sentences };
}

export function TextDeepDive() {
  const [ratio, setRatio] = useState(0.5);
  const [mode, setMode] = useState<"auto" | "ratio">("ratio");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const effectiveRatio = mode === "auto" ? 0.4 : ratio;
  const { kept, sentences } = textRankCompress(SAMPLE_TEXT, effectiveRatio);
  const original = sentences.length;
  const compressed = kept.filter(Boolean).length;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div
          className="rounded-xl p-5"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
        >
          <h4 className="text-sm font-semibold mb-2">How TextRank Works</h4>
          <ol className="text-sm space-y-2" style={{ color: "var(--text-secondary)" }}>
            <li className="flex gap-2">
              <span style={{ color: "var(--accent)" }}>1.</span>
              Split text into sentences and build a similarity graph
            </li>
            <li className="flex gap-2">
              <span style={{ color: "var(--accent)" }}>2.</span>
              Score each sentence using PageRank-style iterative scoring
            </li>
            <li className="flex gap-2">
              <span style={{ color: "var(--accent)" }}>3.</span>
              Keep top-ranked sentences based on the target ratio
            </li>
            <li className="flex gap-2">
              <span style={{ color: "var(--accent)" }}>4.</span>
              Preserve original order for coherent output
            </li>
          </ol>
        </div>

        <div
          className="rounded-xl p-5"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
        >
          <h4 className="text-sm font-semibold mb-3">Mode</h4>
          <div className="flex gap-2 mb-4">
            {(["auto", "ratio"] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: mode === m ? "var(--accent-dim)" : "var(--bg-card)",
                  border: `1px solid ${mode === m ? "var(--accent)" : "var(--border)"}`,
                  color: mode === m ? "var(--accent)" : "var(--text-secondary)",
                }}
              >
                {m === "auto" ? "AUTO" : "RATIO"}
              </button>
            ))}
          </div>
          {mode === "ratio" && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>Ratio</span>
                <span className="text-xs font-mono" style={{ color: "var(--accent)" }}>{(ratio * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={ratio}
                onChange={(e) => setRatio(Number(e.target.value))}
                className="w-full h-1 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, var(--accent) ${ratio * 100}%, var(--border) ${ratio * 100}%)` }}
              />
            </div>
          )}
          {mode === "auto" && (
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              AUTO mode calculates the optimal ratio based on text length and content density. For this sample: 40%.
            </p>
          )}
        </div>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--border)" }}
      >
        <div className="p-5" style={{ background: "var(--bg-code)" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              Sentence Selection Preview
            </span>
            <span className="text-xs font-mono" style={{ color: "var(--accent)" }}>
              {compressed}/{original} sentences kept
            </span>
          </div>
          <div className="text-sm leading-relaxed space-y-1">
            {sentences.map((s, i) => (
              <span
                key={i}
                className="inline"
                style={{
                  color: kept[i] ? "var(--accent)" : "var(--text-muted)",
                  opacity: kept[i] ? 1 : 0.4,
                  textDecoration: kept[i] ? "none" : "line-through",
                }}
              >
                {s}{" "}
              </span>
            ))}
          </div>
        </div>
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)" }}
        >
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Green = kept sentences, Strikethrough = removed
          </span>
          <span
            className="text-xs font-mono px-2 py-0.5 rounded-full"
            style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
          >
            {((1 - compressed / original) * 100).toFixed(0)}% reduced
          </span>
        </div>
      </div>
    </motion.div>
  );
}
