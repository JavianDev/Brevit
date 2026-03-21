"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Play } from "lucide-react";
import { BrevitClient, BrevitConfig } from "@/lib/brevit-browser";
import { estimateTokens } from "@/lib/utils";

const SAMPLE = `{
  "customer": { "name": "Jane Smith", "email": "jane@example.com" },
  "order": {
    "id": "ORD-2024-001",
    "status": "SHIPPED",
    "items": [
      { "sku": "A-88", "qty": 1, "price": 29.99 },
      { "sku": "B-22", "qty": 2, "price": 49.99 }
    ]
  }
}`;

export function MiniDemo() {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [tokensBefore, setTokensBefore] = useState(0);
  const [tokensAfter, setTokensAfter] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const run = useCallback(() => {
    setIsRunning(true);
    const client = new BrevitClient(new BrevitConfig({ enableAbbreviations: true }));
    const result = client.brevity(input);
    setOutput(result);
    setTokensBefore(estimateTokens(input));
    setTokensAfter(estimateTokens(result));
    setTimeout(() => setIsRunning(false), 300);
  }, [input]);

  useEffect(() => {
    run();
  }, []);

  const saving = tokensBefore > 0 ? Math.round(((tokensBefore - tokensAfter) / tokensBefore) * 100) : 0;

  function copyOutput() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Input
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ background: "var(--hover-bg)", color: "var(--text-muted)" }}>
            ~{tokensBefore} tokens
          </span>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-52 rounded-xl p-4 text-xs font-mono resize-none outline-none focus:ring-1 transition-all"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            caretColor: "var(--accent)",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(126,248,216,0.3)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
          spellCheck={false}
        />
        <button
          onClick={run}
          disabled={isRunning}
          className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
          style={{ background: "var(--accent)", color: "#000" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
        >
          <Play size={13} />
          Run brevity()
        </button>
      </div>

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
            Brevit Output
          </span>
          <div className="flex items-center gap-2">
            {saving > 0 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs font-mono px-2 py-0.5 rounded-full font-semibold"
                style={{ background: "rgba(74,222,128,0.15)", color: "var(--success)" }}
              >
                −{saving}% tokens
              </motion.span>
            )}
            <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ background: "rgba(126,248,216,0.1)", color: "var(--accent)" }}>
              ~{tokensAfter} tokens
            </span>
          </div>
        </div>

        <div
          className="relative h-52 rounded-xl p-4 overflow-auto"
          style={{
            background: "rgba(126,248,216,0.03)",
            border: "1px solid rgba(126,248,216,0.12)",
          }}
        >
          <button
            onClick={copyOutput}
            className="absolute top-2 right-2 p-1.5 rounded-md transition-all"
            style={{ color: "var(--text-muted)", background: "var(--hover-bg)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span key="check" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                  <Check size={13} style={{ color: "var(--success)" }} />
                </motion.span>
              ) : (
                <motion.span key="copy" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                  <Copy size={13} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-primary)" }}>
            {output || "Click 'Run brevity()' to compress…"}
          </pre>
        </div>

        {/* Savings bar */}
        {saving > 0 && (
          <div className="mt-2 rounded-lg p-2.5" style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.1)" }}>
            <div className="flex justify-between text-xs mb-1" style={{ color: "var(--text-muted)" }}>
              <span>Token savings</span>
              <span style={{ color: "var(--success)" }}>{tokensBefore - tokensAfter} tokens saved ({saving}%)</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--hover-bg)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${saving}%` }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: "var(--success)" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
