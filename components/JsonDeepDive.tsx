"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Example {
  label: string;
  desc: string;
  input: string;
  output: string;
  savings: string;
}

const EXAMPLES: Example[] = [
  {
    label: "Dot-Notation",
    desc: "Nested objects become flat key:value pairs using dot separators.",
    input: `{
  "user": {
    "name": "Jane",
    "address": {
      "city": "NYC",
      "zip": "10001"
    }
  }
}`,
    output: `user.name:Jane
user.address.city:NYC
user.address.zip:10001`,
    savings: "42%",
  },
  {
    label: "Tabular Arrays",
    desc: "Uniform object arrays become compact tables with pipe-separated headers.",
    input: `[
  {"id":1,"name":"Blue Lake","dist":7.5},
  {"id":2,"name":"Ridge Top","dist":9.2},
  {"id":3,"name":"Meadow Loop","dist":5.1}
]`,
    output: `[3 items]
id|name|dist
1|Blue Lake|7.5
2|Ridge Top|9.2
3|Meadow Loop|5.1`,
    savings: "58%",
  },
  {
    label: "Primitive Arrays",
    desc: "Arrays of simple values become a compact comma-separated format with count.",
    input: `{
  "tags": ["javascript","python",
    "dotnet","ai","llm",
    "optimization","tokens"]
}`,
    output: `tags(7):javascript,python,dotnet,ai,llm,optimization,tokens`,
    savings: "64%",
  },
  {
    label: "Hybrid Arrays",
    desc: "Mixed-type arrays fall back to indexed notation with per-element flattening.",
    input: `{
  "items": [
    {"type":"text","value":"hello"},
    42,
    [1, 2, 3]
  ]
}`,
    output: `items[0].type:text
items[0].value:hello
items[1]:42
items[2](3):1,2,3`,
    savings: "35%",
  },
];

export function JsonDeepDive() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {EXAMPLES.map((ex, i) => (
          <button
            key={ex.label}
            onClick={() => setActive(i)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: active === i ? "var(--accent-dim)" : "var(--bg-surface)",
              border: `1px solid ${active === i ? "var(--accent)" : "var(--border)"}`,
              color: active === i ? "var(--accent)" : "var(--text-secondary)",
            }}
          >
            {ex.label}
          </button>
        ))}
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--border)" }}
      >
        <div className="grid md:grid-cols-2">
          <div className="p-5" style={{ background: "var(--bg-code)" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                Input JSON
              </span>
            </div>
            <pre className="text-sm leading-relaxed font-mono whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>
              {EXAMPLES[active].input}
            </pre>
          </div>
          <div className="p-5" style={{ background: "var(--bg-surface)", borderLeft: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--accent)" }}>
                Brevit Output
              </span>
              <span
                className="text-xs font-mono px-2 py-0.5 rounded-full"
                style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
              >
                {EXAMPLES[active].savings} saved
              </span>
            </div>
            <pre className="text-sm leading-relaxed font-mono whitespace-pre-wrap" style={{ color: "var(--accent)" }}>
              {EXAMPLES[active].output}
            </pre>
          </div>
        </div>
        <div
          className="px-5 py-3"
          style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)" }}
        >
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            <strong style={{ color: "var(--text-primary)" }}>{EXAMPLES[active].label}:</strong>{" "}
            {EXAMPLES[active].desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
