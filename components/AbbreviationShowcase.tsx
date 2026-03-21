"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const STRATEGIES = [
  {
    name: "First Letter",
    desc: "Uses the first letter of the key prefix as the alias.",
    before: "customer.name:Jane\ncustomer.email:jane@ex.com\ncustomer.tier:premium",
    after: "@c=customer\nc.name:Jane\nc.email:jane@ex.com\nc.tier:premium",
    example: "customer → @c",
  },
  {
    name: "Acronym",
    desc: "For dotted prefixes, takes the first letter of each segment.",
    before: "order.shipping.street:123 Maple\norder.shipping.city:Springfield\norder.shipping.state:IL",
    after: "@os=order.shipping\nos.street:123 Maple\nos.city:Springfield\nos.state:IL",
    example: "order.shipping → @os",
  },
  {
    name: "Counter",
    desc: "Falls back to numbered aliases when letter-based ones collide.",
    before: "config.name:MyApp\nconfig.mode:dark\ncache.name:Redis\ncache.ttl:3600",
    after: "@c=config\n@c1=cache\nc.name:MyApp\nc.mode:dark\nc1.name:Redis\nc1.ttl:3600",
    example: "config → @c, cache → @c1",
  },
];

export function AbbreviationShowcase() {
  const [active, setActive] = useState(0);
  const [showBefore, setShowBefore] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const strategy = STRATEGIES[active];
  const beforeTokens = strategy.before.split(/\s+/).length;
  const afterTokens = strategy.after.split(/\s+/).length;
  const savings = ((1 - afterTokens / beforeTokens) * 100).toFixed(0);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="grid md:grid-cols-3 gap-3 mb-6">
        {STRATEGIES.map((s, i) => (
          <button
            key={s.name}
            onClick={() => setActive(i)}
            className="rounded-xl p-4 text-left transition-all"
            style={{
              background: active === i ? "var(--accent-dim)" : "var(--bg-surface)",
              border: `1px solid ${active === i ? "var(--accent)" : "var(--border)"}`,
            }}
          >
            <span
              className="text-sm font-semibold block mb-1"
              style={{ color: active === i ? "var(--accent)" : "var(--text-primary)" }}
            >
              {s.name}
            </span>
            <span className="text-xs block" style={{ color: "var(--text-muted)" }}>
              {s.example}
            </span>
          </button>
        ))}
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--border)" }}
      >
        <div className="flex items-center justify-between px-5 py-3" style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {strategy.desc}
          </p>
          <button
            onClick={() => setShowBefore(!showBefore)}
            className="text-xs font-mono px-3 py-1 rounded-lg transition-all"
            style={{
              background: "var(--hover-bg)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            {showBefore ? "Show After" : "Show Before"}
          </button>
        </div>

        <div className="p-5" style={{ background: "var(--bg-code)" }}>
          <pre className="text-sm leading-relaxed font-mono whitespace-pre-wrap">
            {(showBefore ? strategy.before : strategy.after).split("\n").map((line, i) => (
              <div key={i}>
                {line.startsWith("@") ? (
                  <span style={{ color: "var(--purple)" }}>{line}</span>
                ) : (
                  <span style={{ color: "var(--accent)" }}>{line}</span>
                )}
              </div>
            ))}
          </pre>
        </div>

        <div
          className="px-5 py-3 flex items-center gap-4"
          style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)" }}
        >
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${100 - Number(savings)}%`, background: "var(--accent)" }}
            />
          </div>
          <span className="text-xs font-mono" style={{ color: "var(--accent)" }}>
            ~{savings}% saved
          </span>
        </div>
      </div>
    </motion.div>
  );
}
