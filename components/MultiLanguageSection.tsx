"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Copy, Check } from "lucide-react";

const LANGUAGES = [
  {
    name: "JavaScript",
    icon: "JS",
    color: "#f7df1e",
    install: "npm install brevit",
    code: `import Brevit from 'brevit';

const client = new Brevit();
const result = client.brevity(data);
console.log(result.compressed);`,
    badge: "npm",
    link: "https://www.npmjs.com/package/brevit",
  },
  {
    name: "Python",
    icon: "PY",
    color: "#3776ab",
    install: "pip install brevit",
    code: `from brevit import Brevit

client = Brevit()
result = client.brevity(data)
print(result.compressed)`,
    badge: "PyPI",
    link: "https://pypi.org/project/brevit/",
  },
  {
    name: ".NET",
    icon: "C#",
    color: "#512bd4",
    install: "dotnet add package Brevit",
    code: `using Brevit;

var client = new BrevitClient();
var result = client.Brevity(data);
Console.WriteLine(result.Compressed);`,
    badge: "NuGet",
    link: "https://www.nuget.org/packages/Brevit",
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      className="p-1 rounded transition-colors"
      style={{ color: "var(--text-muted)" }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  );
}

export function MultiLanguageSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="grid md:grid-cols-3 gap-4">
        {LANGUAGES.map((lang, i) => (
          <motion.div
            key={lang.name}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--border)" }}
          >
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold"
                  style={{ background: `${lang.color}22`, color: lang.color }}
                >
                  {lang.icon}
                </span>
                <span className="text-sm font-semibold">{lang.name}</span>
              </div>
              <a
                href={lang.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono px-2 py-0.5 rounded-full transition-opacity hover:opacity-80"
                style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
              >
                {lang.badge}
              </a>
            </div>

            <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
              <code className="text-xs font-mono flex-1" style={{ color: "var(--text-muted)" }}>
                $ {lang.install}
              </code>
              <CopyButton text={lang.install} />
            </div>

            <div className="p-4" style={{ background: "var(--bg-code)" }}>
              <pre className="text-xs leading-relaxed font-mono whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>
                {lang.code}
              </pre>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
