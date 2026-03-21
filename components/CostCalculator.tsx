"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function CostCalculator() {
  const [calls, setCalls] = useState(1000000);
  const [tokens, setTokens] = useState(100);
  const [savings, setSavings] = useState(50);
  const costPer1k = 0.002;

  const monthlyBefore = (calls * tokens * costPer1k) / 1000;
  const monthlyAfter = (calls * tokens * (1 - savings / 100) * costPer1k) / 1000;
  const monthlySaved = monthlyBefore - monthlyAfter;
  const yearlySaved = monthlySaved * 12;

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      {/* Controls */}
      <div className="space-y-6">
        <SliderField
          label="API Calls per Month"
          value={calls}
          min={10000}
          max={10000000}
          step={10000}
          format={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : `${(v / 1000).toFixed(0)}K`}
          onChange={setCalls}
        />
        <SliderField
          label="Avg Tokens per Call"
          value={tokens}
          min={50}
          max={2000}
          step={50}
          format={(v) => `${v} tokens`}
          onChange={setTokens}
        />
        <SliderField
          label="Estimated Token Reduction"
          value={savings}
          min={20}
          max={70}
          step={5}
          format={(v) => `${v}%`}
          onChange={setSavings}
        />
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div
          className="rounded-xl p-5"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
        >
          <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: "var(--text-muted)" }}>
            Monthly Cost
          </p>
          <div className="space-y-3">
            <CostRow label="Without Brevit" value={monthlyBefore} color="var(--text-secondary)" />
            <CostRow label="With Brevit" value={monthlyAfter} color="var(--accent)" />
            <div className="h-px" style={{ background: "var(--border)" }} />
            <CostRow label="Monthly Savings" value={monthlySaved} color="var(--success)" bold />
          </div>
        </div>
        <motion.div
          key={yearlySaved.toFixed(0)}
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          className="rounded-xl p-5 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(126,248,216,0.08), rgba(167,139,250,0.08))",
            border: "1px solid rgba(126,248,216,0.2)",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>
            Annual Savings
          </p>
          <p className="text-4xl font-bold" style={{ color: "var(--accent)" }}>
            ${yearlySaved.toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            per year at {savings}% token reduction
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function SliderField({
  label, value, min, max, step, format, onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</label>
        <span className="text-sm font-mono font-semibold" style={{ color: "var(--accent)" }}>
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${((value - min) / (max - min)) * 100}%, var(--border) ${((value - min) / (max - min)) * 100}%, var(--border) 100%)`,
          outline: "none",
          WebkitAppearance: "none",
        }}
      />
    </div>
  );
}

function CostRow({ label, value, color, bold }: { label: string; value: number; color: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm" style={{ color: "var(--text-muted)" }}>{label}</span>
      <span className="text-sm font-mono font-semibold" style={{ color, fontWeight: bold ? 700 : 500 }}>
        ${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}
        <span className="text-xs font-normal opacity-70">/mo</span>
      </span>
    </div>
  );
}
