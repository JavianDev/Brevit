"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";

interface CodeTab {
  id: string;
  label: string;
  language: string;
  code: string;
}

interface MultiLangCodeBlockProps {
  tabs: CodeTab[];
  title?: string;
  className?: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="p-1.5 rounded-md transition-all"
      style={{ color: "var(--text-muted)", background: "rgba(255,255,255,0.05)" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
    >
      {copied ? <Check size={12} style={{ color: "var(--success)" }} /> : <Copy size={12} />}
    </button>
  );
}

const LANGUAGE_COLORS: Record<string, string> = {
  javascript: "#f7df1e",
  typescript: "#3178c6",
  python: "#3776ab",
  csharp: "#512bd4",
  bash: "#89e051",
  text: "#888",
};

function highlight(code: string, lang: string): React.ReactNode[] {
  const lines = code.split("\n");
  return lines.map((line, i) => {
    const isComment = line.trim().startsWith("//") || line.trim().startsWith("#");
    const isKeyword = /\b(import|from|const|let|var|async|await|return|class|new|if|else|for|function|def|using|var|public|private|static|void|string|int|bool|async|Task|List|Dictionary)\b/.test(line);
    
    return (
      <span key={i} className="block">
        {isComment ? (
          <span style={{ color: "#546e7a" }}>{line}</span>
        ) : (
          <span dangerouslySetInnerHTML={{
            __html: line
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/(\/\/.*|#.*$)/g, '<span style="color:#546e7a">$1</span>')
              .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, '<span style="color:#c3e88d">$1</span>')
              .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#f78c6c">$1</span>')
              .replace(/\b(import|from|const|let|var|async|await|return|class|new|using|public|private|static|void|def|self|await|Task)\b/g, '<span style="color:#c792ea">$1</span>')
              .replace(/\b(BrevitClient|BrevitConfig|JsonOptimizationMode|TextOptimizationMode|ImageOptimizationMode)\b/g, '<span style="color:#82aaff">$1</span>')
          }} />
        )}
      </span>
    );
  });
}

export function MultiLangCodeBlock({ tabs, title, className = "" }: MultiLangCodeBlockProps) {
  const [active, setActive] = useState(tabs[0]?.id);
  const tab = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div
      className={`rounded-xl overflow-hidden ${className}`}
      style={{ background: "var(--bg-code)", border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}
      >
        <div className="flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            {["#f87171", "#fb923c", "#4ade80"].map((c) => (
              <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.4 }} />
            ))}
          </div>
          {title && (
            <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{title}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className="text-xs px-2.5 py-1 rounded-md font-medium transition-all"
              style={{
                background: active === t.id ? "rgba(126,248,216,0.1)" : "transparent",
                color: active === t.id ? "var(--accent)" : "var(--text-muted)",
                border: active === t.id ? "1px solid rgba(126,248,216,0.2)" : "1px solid transparent",
              }}
            >
              {t.label}
            </button>
          ))}
          {tab && <CopyButton text={tab.code} />}
        </div>
      </div>

      {/* Code */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto">
            <code>{highlight(tab?.code ?? "", tab?.language ?? "")}</code>
          </pre>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function CodeBlock({ code, language = "text", title, className = "" }: {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}) {
  return (
    <MultiLangCodeBlock
      tabs={[{ id: "default", label: title ?? language, language, code }]}
      title={title}
      className={className}
    />
  );
}
