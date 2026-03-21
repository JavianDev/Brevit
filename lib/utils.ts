import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function estimateTokens(text: string): number {
  if (!text) return 0;
  // GPT-style tokenizer approximation: ~4 chars per token, ~0.75 tokens per word
  const words = text.split(/\s+/).filter(Boolean).length;
  const chars = text.length;
  return Math.round((words * 0.75 + chars * 0.25) / 2 + chars / 4);
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}
