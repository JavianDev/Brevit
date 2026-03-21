"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

function useCountUp(target: number, duration = 2000, delay = 0) {
  const [value, setValue] = useState(target);
  const started = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const start = performance.now();
      const initial = target * 1.7;

      function frame(now: number) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(initial - (initial - target) * eased));
        if (progress < 1) requestAnimationFrame(frame);
      }

      if (!started.current) {
        started.current = true;
        requestAnimationFrame(frame);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [target, duration, delay]);

  return value;
}

export function HeroTokenCounter() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const tokens = useCountUp(inView ? 95 : 160, 2200, 400);
  const saving = Math.round(((160 - tokens) / 160) * 100);

  return (
    <div ref={ref} className="relative">
      {/* Before card */}
      <div
        className="rounded-xl p-4 mb-3 relative overflow-hidden"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>INPUT JSON</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}>
            160 tokens
          </span>
        </div>
        <pre className="text-xs font-mono leading-relaxed overflow-hidden" style={{ color: "var(--text-secondary)" }}>
{`{
  "friends": ["ana", "luis", "sam"],
  "hikes": [
    {"id":1,"name":"Blue Lake","km":7.5},
    {"id":2,"name":"Ridge View","km":9.2}
  ]
}`}
        </pre>
      </div>

      {/* Arrow */}
      <div className="flex items-center justify-center my-2 gap-2">
        <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, var(--accent))" }} />
        <span className="text-xs font-mono px-2" style={{ color: "var(--accent)" }}>brevity()</span>
        <div className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, var(--accent))" }} />
      </div>

      {/* After card */}
      <div
        className="rounded-xl p-4 relative overflow-hidden"
        style={{
          background: "rgba(126,248,216,0.04)",
          border: "1px solid rgba(126,248,216,0.15)",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono" style={{ color: "var(--accent)" }}>BREVIT OUTPUT</span>
          <motion.span
            key={tokens}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-xs px-2 py-0.5 rounded-full font-mono"
            style={{ background: "rgba(74,222,128,0.1)", color: "var(--success)" }}
          >
            {tokens} tokens {saving > 0 && `(−${saving}%)`}
          </motion.span>
        </div>
        <pre className="text-xs font-mono leading-relaxed" style={{ color: "var(--text-primary)" }}>
          <span style={{ color: "#a78bfa" }}>friends</span>
          <span style={{ color: "var(--text-muted)" }}>[3]:</span>
          <span style={{ color: "#c3e88d" }}>ana,luis,sam</span>{"\n"}
          <span style={{ color: "#a78bfa" }}>hikes</span>
          <span style={{ color: "var(--text-muted)" }}>[2]</span>
          <span style={{ color: "var(--accent)" }}>{"{"}</span>
          <span style={{ color: "#fb923c" }}>id,name,km</span>
          <span style={{ color: "var(--accent)" }}>{"}"}</span>
          <span style={{ color: "var(--text-muted)" }}>:</span>{"\n"}
          <span style={{ color: "#f5f5f5" }}>1,Blue Lake,7.5</span>{"\n"}
          <span style={{ color: "#f5f5f5" }}>2,Ridge View,9.2</span>
        </pre>
      </div>
    </div>
  );
}
