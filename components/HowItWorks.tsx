"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Search, Layers, Tag, FileOutput } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Detect",
    desc: "Auto-routes your input — JSON objects, arrays, plain text, or mixed data — to the right optimization pipeline.",
    tokens: "1,247",
    color: "var(--accent)",
  },
  {
    icon: Layers,
    title: "Optimize",
    desc: "Flattens nested JSON to dot-notation, converts uniform arrays to tables, and applies TextRank to compress text.",
    tokens: "683",
    color: "var(--purple)",
  },
  {
    icon: Tag,
    title: "Abbreviate",
    desc: "Identifies repeated key prefixes and generates @alias definitions. Only abbreviates when it actually saves tokens.",
    tokens: "541",
    color: "var(--warning)",
  },
  {
    icon: FileOutput,
    title: "Output",
    desc: "Delivers compact Brevit-format output that any LLM can parse natively. No schema changes, no information lost.",
    tokens: "498",
    color: "var(--success)",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref}>
      <div className="grid md:grid-cols-4 gap-4">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className="relative rounded-xl p-5"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
            }}
          >
            {i < STEPS.length - 1 && (
              <div
                className="hidden md:block absolute top-1/2 -right-3 w-6 text-center z-10"
                style={{ color: "var(--text-muted)" }}
              >
                →
              </div>
            )}
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
              style={{ background: `color-mix(in srgb, ${step.color} 15%, transparent)` }}
            >
              <step.icon size={20} style={{ color: step.color }} />
            </div>
            <span
              className="text-xs font-mono uppercase tracking-widest mb-1 block"
              style={{ color: step.color }}
            >
              Step {i + 1}
            </span>
            <h3 className="text-base font-semibold mb-2">{step.title}</h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
              {step.desc}
            </p>
            <div
              className="text-xs font-mono px-3 py-1.5 rounded-lg inline-block"
              style={{ background: "var(--bg-code)", color: "var(--text-secondary)" }}
            >
              ~{step.tokens} tokens
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
