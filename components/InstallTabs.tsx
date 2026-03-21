"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";

const TABS = [
  {
    id: "js",
    label: "JavaScript",
    badge: "npm",
    command: "npm install brevit",
    code: `import { BrevitClient, BrevitConfig } from 'brevit';

const brevit = new BrevitClient();
const result = await brevit.brevity({
  user: { name: 'Jane', email: 'jane@example.com' },
  orders: [
    { id: 'ORD-001', status: 'SHIPPED', total: 79.98 },
    { id: 'ORD-002', status: 'PENDING', total: 29.99 }
  ]
});
// user.name:Jane
// user.email:jane@example.com
// orders[2]{id,status,total}:
// ORD-001,SHIPPED,79.98
// ORD-002,PENDING,29.99`,
  },
  {
    id: "py",
    label: "Python",
    badge: "pip",
    command: "pip install brevit",
    code: `from brevit import BrevitClient, BrevitConfig

brevit = BrevitClient()
result = await brevit.brevity({
    "user": {"name": "Jane", "email": "jane@example.com"},
    "orders": [
        {"id": "ORD-001", "status": "SHIPPED", "total": 79.98},
        {"id": "ORD-002", "status": "PENDING", "total": 29.99}
    ]
})
# user.name:Jane
# user.email:jane@example.com
# orders[2]{id,status,total}:
# ORD-001,SHIPPED,79.98`,
  },
  {
    id: "dotnet",
    label: ".NET",
    badge: "dotnet",
    command: "dotnet add package Brevit",
    code: `using Brevit;

var config = new BrevitConfig();
var brevit = new BrevitClient(
    config,
    new DefaultJsonOptimizer(),
    new DefaultTextOptimizer(),
    new DefaultImageOptimizer()
);

var result = await brevit.BrevityAsync(new {
    User = new { Name = "Jane", Email = "jane@example.com" },
    OrderCount = 2
});
// user.Name:Jane
// user.Email:jane@example.com
// OrderCount:2`,
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function doCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={doCopy}
      className="p-1.5 rounded-md transition-all"
      style={{ color: "var(--text-muted)", background: "rgba(255,255,255,0.05)" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span key="c" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <Check size={13} style={{ color: "var(--success)" }} />
          </motion.span>
        ) : (
          <motion.span key="n" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <Copy size={13} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export function InstallTabs() {
  const [active, setActive] = useState("js");
  const tab = TABS.find((t) => t.id === active)!;

  return (
    <div className="w-full">
      {/* Tab bar */}
      <div
        className="flex items-center gap-1 rounded-xl p-1 mb-0"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className="relative flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
            style={{ color: active === t.id ? "var(--text-primary)" : "var(--text-muted)" }}
          >
            {active === t.id && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 rounded-lg"
                style={{ background: "rgba(126,248,216,0.08)", border: "1px solid rgba(126,248,216,0.15)" }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span
              className="relative z-10 text-xs px-2 py-0.5 rounded-full font-mono"
              style={{
                background: active === t.id ? "rgba(126,248,216,0.15)" : "rgba(255,255,255,0.05)",
                color: active === t.id ? "var(--accent)" : "var(--text-muted)",
              }}
            >
              {t.badge}
            </span>
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Install command */}
      <div
        className="flex items-center justify-between px-4 py-3 mt-0 rounded-t-none rounded-b-none border-x border-b -mt-px"
        style={{
          background: "rgba(126,248,216,0.04)",
          borderColor: "rgba(126,248,216,0.12)",
        }}
      >
        <code className="text-sm font-mono" style={{ color: "var(--accent)" }}>
          $ {tab.command}
        </code>
        <CopyButton text={tab.command} />
      </div>

      {/* Code block */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="relative rounded-b-xl overflow-hidden border-x border-b"
          style={{
            background: "var(--bg-code)",
            borderColor: "rgba(126,248,216,0.12)",
          }}
        >
          <div className="absolute top-3 right-3">
            <CopyButton text={tab.code} />
          </div>
          <pre className="p-4 pt-3 text-xs font-mono leading-relaxed overflow-x-auto" style={{ color: "var(--text-secondary)" }}>
            <code>{tab.code}</code>
          </pre>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
