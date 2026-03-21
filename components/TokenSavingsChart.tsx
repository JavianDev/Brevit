"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const DATA = [
  {
    label: "E-Commerce Order",
    json: 160,
    yaml: 130,
    brevit: 72,
  },
  {
    label: "User Profile",
    json: 120,
    yaml: 100,
    brevit: 58,
  },
  {
    label: "Product Catalog",
    json: 240,
    yaml: 195,
    brevit: 88,
  },
];

const BARS = [
  { key: "json", label: "JSON", color: "#555" },
  { key: "yaml", label: "YAML", color: "#7e6baa" },
  { key: "brevit", label: "Brevit", color: "#7EF8D8" },
];

export function TokenSavingsChart() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const maxVal = Math.max(...DATA.flatMap((d) => [d.json, d.yaml, d.brevit]));

  return (
    <div ref={ref} className="w-full">
      {/* Legend */}
      <div className="flex items-center gap-5 mb-8">
        {BARS.map((bar) => (
          <div key={bar.key} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            <div className="w-3 h-3 rounded-sm" style={{ background: bar.color }} />
            {bar.label}
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="space-y-8">
        {DATA.map((item, i) => (
          <div key={item.label}>
            <div className="text-sm mb-3 font-medium" style={{ color: "var(--text-secondary)" }}>
              {item.label}
            </div>
            <div className="space-y-2">
              {BARS.map((bar) => {
                const val = item[bar.key as keyof typeof item] as number;
                const width = (val / maxVal) * 100;
                const saving =
                  bar.key === "brevit"
                    ? Math.round(((item.json - val) / item.json) * 100)
                    : null;
                return (
                  <div key={bar.key} className="flex items-center gap-3">
                    <span className="text-xs font-mono w-12 text-right flex-shrink-0" style={{ color: "var(--text-muted)" }}>
                      {bar.label}
                    </span>
                    <div className="flex-1 h-7 rounded-md overflow-hidden relative" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: inView ? `${width}%` : 0 }}
                        transition={{ duration: 0.8, delay: i * 0.1 + (bar.key === "brevit" ? 0.2 : 0), ease: "easeOut" }}
                        className="h-full rounded-md flex items-center px-2"
                        style={{ background: bar.color, minWidth: 40 }}
                      >
                        <span className="text-xs font-mono" style={{ color: bar.key === "brevit" ? "#000" : "#fff", fontWeight: 600 }}>
                          {val}
                        </span>
                      </motion.div>
                    </div>
                    {saving !== null && inView && (
                      <motion.span
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 + 0.6 }}
                        className="text-xs font-mono font-semibold flex-shrink-0"
                        style={{ color: "var(--success)" }}
                      >
                        −{saving}%
                      </motion.span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
