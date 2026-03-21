/**
 * Brevit Browser Edition
 * Self-contained TypeScript port of Brevit.js for in-browser use.
 * No external NLP dependencies — uses regex-based sentence splitting for TextRank.
 */

export const JsonOptimizationMode = {
  None: "None",
  Flatten: "Flatten",
  ToYaml: "ToYaml",
  Filter: "Filter",
} as const;

export const TextOptimizationMode = {
  None: "None",
  Clean: "Clean",
  SummarizeFast: "SummarizeFast",
  SummarizeHighQuality: "SummarizeHighQuality",
} as const;

export const ImageOptimizationMode = {
  None: "None",
  Ocr: "Ocr",
  Metadata: "Metadata",
} as const;

export type JsonMode = (typeof JsonOptimizationMode)[keyof typeof JsonOptimizationMode];
export type TextMode = (typeof TextOptimizationMode)[keyof typeof TextOptimizationMode];
export type ImageMode = (typeof ImageOptimizationMode)[keyof typeof ImageOptimizationMode];

export interface BrevitConfigOptions {
  jsonMode?: JsonMode;
  textMode?: TextMode;
  imageMode?: ImageMode;
  jsonPathsToKeep?: string[];
  longTextThreshold?: number;
  enableAbbreviations?: boolean;
  abbreviationThreshold?: number;
}

export class BrevitConfig {
  jsonMode: JsonMode;
  textMode: TextMode;
  imageMode: ImageMode;
  jsonPathsToKeep: string[];
  longTextThreshold: number;
  enableAbbreviations: boolean;
  abbreviationThreshold: number;

  constructor(options: BrevitConfigOptions = {}) {
    this.jsonMode = options.jsonMode ?? JsonOptimizationMode.Flatten;
    this.textMode = options.textMode ?? TextOptimizationMode.Clean;
    this.imageMode = options.imageMode ?? ImageOptimizationMode.Ocr;
    this.jsonPathsToKeep = options.jsonPathsToKeep ?? [];
    this.longTextThreshold = options.longTextThreshold ?? 500;
    this.enableAbbreviations = options.enableAbbreviations ?? true;
    this.abbreviationThreshold = options.abbreviationThreshold ?? 2;
  }
}

// ─── Semantic Compressor (TextRank without NLP library) ──────────────────────

const STOP_WORDS = new Set([
  "the","is","in","at","of","on","and","a","to","it","for","with","as",
  "by","this","that","are","was","be","or","an","if","not","but","from",
  "they","we","he","she","which","i","you","my","your","our","its","do",
  "did","have","has","had","will","would","can","could","should","shall",
]);

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function getTerms(sentence: string): Set<string> {
  const words = sentence
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
  return new Set(words);
}

function calculateSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const elem of a) if (b.has(elem)) intersection++;
  if (intersection === 0) return 0;
  const denom = Math.log(a.size) + Math.log(b.size);
  return intersection / (denom || 1);
}

function runTextRank(text: string, mode: "auto" | "ratio", ratio = 0.0): string {
  if (!text) return "";
  const sentences = splitSentences(String(text));
  if (sentences.length === 0) return text;

  const nodes = sentences.map((sent, id) => ({
    id,
    text: sent,
    terms: getTerms(sent),
    score: 1.0,
  }));

  const edges: number[][] = nodes.map(() => []);
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const sim = calculateSimilarity(nodes[i].terms, nodes[j].terms);
      if (sim > 0) {
        edges[i].push(j);
        edges[j].push(i);
      }
    }
  }

  const damping = 0.85;
  const base = 1 - damping;
  for (let iter = 0; iter < 20; iter++) {
    const newScores = nodes.map((n) => n.score);
    for (let i = 0; i < nodes.length; i++) {
      let sum = 0;
      for (const nb of edges[i]) {
        sum += nodes[nb].score / (edges[nb].length || 1);
      }
      newScores[i] = base + damping * sum;
    }
    nodes.forEach((n, i) => { n.score = newScores[i]; });
  }

  const kept = new Set<number>();
  if (mode === "auto" || ratio <= 0) {
    const avg = nodes.reduce((s, n) => s + n.score, 0) / (nodes.length || 1);
    nodes.forEach((n) => { if (n.score >= avg * 0.0) kept.add(n.id); });
    if (kept.size === 0) kept.add(nodes.reduce((p, c) => (c.score > p.score ? c : p)).id);
  } else {
    if (ratio >= 1) {
      nodes.forEach((n) => kept.add(n.id));
    } else {
      const sorted = [...nodes].sort((a, b) => b.score - a.score);
      const count = Math.max(1, Math.floor(nodes.length * ratio));
      sorted.slice(0, count).forEach((n) => kept.add(n.id));
    }
  }

  return nodes
    .filter((n) => kept.has(n.id))
    .map((n) => n.text)
    .join(" ");
}

// ─── YAML Serializer ──────────────────────────────────────────────────────────

function toYaml(obj: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);
  if (obj === null || obj === undefined) return "null";
  if (typeof obj === "boolean") return obj ? "true" : "false";
  if (typeof obj === "number") return String(obj);
  if (typeof obj === "string") {
    if (obj.includes("\n") || obj.includes(":") || obj.includes("#") || obj.includes("'") || obj.startsWith(" ") || obj.endsWith(" ")) {
      return `"${obj.replace(/"/g, '\\"')}"`;
    }
    return obj || '""';
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    return obj.map((item) => `${pad}- ${toYaml(item, indent + 1)}`).join("\n");
  }
  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) return "{}";
    return entries
      .map(([k, v]) => {
        const valStr = toYaml(v, indent + 1);
        const needsNewline = typeof v === "object" && v !== null && !Array.isArray(v) && Object.keys(v as object).length > 0;
        const arrNewline = Array.isArray(v) && (v as unknown[]).length > 0;
        return (needsNewline || arrNewline)
          ? `${pad}${k}:\n${valStr}`
          : `${pad}${k}: ${valStr}`;
      })
      .join("\n");
  }
  return String(obj);
}

// ─── BrevitClient ─────────────────────────────────────────────────────────────

export class BrevitClient {
  private _config: BrevitConfig;

  constructor(config: BrevitConfig = new BrevitConfig()) {
    this._config = config;
  }

  get config(): BrevitConfig {
    return this._config;
  }

  compressText(text: string): string {
    return runTextRank(text, "auto");
  }

  optimizeText(text: string, ratio = 0.0): string {
    return runTextRank(text, "ratio", ratio);
  }

  private _isUniformObjectArray(arr: unknown[]): { keys: string[] } | null {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const first = arr[0];
    if (typeof first !== "object" || first === null || Array.isArray(first)) return null;
    const firstKeys = Object.keys(first as object);
    const firstSet = new Set(firstKeys);
    for (let i = 1; i < arr.length; i++) {
      const item = arr[i];
      if (typeof item !== "object" || item === null || Array.isArray(item)) return null;
      const itemKeys = Object.keys(item as object);
      if (firstKeys.length !== itemKeys.length) return null;
      if (!itemKeys.every((k) => firstSet.has(k))) return null;
    }
    return { keys: firstKeys };
  }

  private _isPrimitiveArray(arr: unknown[]): boolean {
    if (!Array.isArray(arr) || arr.length === 0) return false;
    if (typeof arr[0] === "object" && arr[0] !== null) return false;
    return arr.every((item) => !(typeof item === "object" && item !== null));
  }

  private _escapeValue(value: unknown): string {
    const str = String(value);
    if (str.includes(",") || str.includes("\n") || str.includes('"')) {
      return `"${str.replace(/"/g, '\\"')}"`;
    }
    return str;
  }

  private _formatTabularArray(arr: Record<string, unknown>[], prefix: string): string {
    const keys = Object.keys(arr[0]);
    const header = `${prefix}[${arr.length}]{${keys.join(",")}}:`;
    const rows = arr.map((item) => keys.map((k) => this._escapeValue(item[k] ?? "null")).join(","));
    return `${header}\n${rows.join("\n")}`;
  }

  private _formatPrimitiveArray(arr: unknown[], prefix: string): string {
    return `${prefix}[${arr.length}]:${arr.map((v) => this._escapeValue(v)).join(",")}`;
  }

  private _flatten(node: unknown, prefix = "", output: string[] = []): void {
    if (typeof node === "object" && node !== null && !Array.isArray(node)) {
      Object.entries(node as Record<string, unknown>).forEach(([key, value]) => {
        const newPrefix = prefix ? `${prefix}.${key}` : key;
        this._flatten(value, newPrefix, output);
      });
    } else if (Array.isArray(node)) {
      const uniformCheck = this._isUniformObjectArray(node);
      if (uniformCheck) {
        output.push(this._formatTabularArray(node as Record<string, unknown>[], prefix));
        return;
      }
      if (this._isPrimitiveArray(node)) {
        output.push(this._formatPrimitiveArray(node, prefix));
        return;
      }
      node.forEach((item, index) => {
        this._flatten(item, `${prefix}[${index}]`, output);
      });
    } else {
      if (!prefix) prefix = "value";
      output.push(`${prefix}:${String(node)}`);
    }
  }

  private _generateAbbreviation(prefix: string, counter: number, usedAbbrs: Set<string>): string {
    const firstLetter = prefix.split(".")[0][0].toLowerCase();
    if (!usedAbbrs.has(firstLetter)) {
      usedAbbrs.add(firstLetter);
      return firstLetter;
    }
    const parts = prefix.split(".");
    if (parts.length > 1) {
      const multi = parts.map((p) => p[0]).join("").toLowerCase();
      if (!usedAbbrs.has(multi) && multi.length <= 3) {
        usedAbbrs.add(multi);
        return multi;
      }
    }
    let abbr = "";
    let num = counter;
    do {
      abbr = String.fromCharCode(97 + (num % 26)) + abbr;
      num = Math.floor(num / 26) - 1;
    } while (num >= 0);
    usedAbbrs.add(abbr);
    return abbr;
  }

  private _generateAbbreviations(paths: string[]): { map: Map<string, string>; definitions: string[] } {
    if (!this._config.enableAbbreviations) return { map: new Map(), definitions: [] };
    const counts = new Map<string, number>();
    paths.forEach((path) => {
      const parts = path.split(".");
      for (let i = 1; i < parts.length; i++) {
        const prefix = parts.slice(0, i).join(".");
        counts.set(prefix, (counts.get(prefix) ?? 0) + 1);
      }
    });
    const frequent = Array.from(counts.entries())
      .filter(([, count]) => count >= this._config.abbreviationThreshold)
      .sort((a, b) => (b[1] !== a[1] ? b[1] - a[1] : a[0].length - b[0].length));
    const map = new Map<string, string>();
    const definitions: string[] = [];
    let counter = 0;
    const used = new Set<string>();
    frequent.forEach(([prefix, count]) => {
      const abbr = this._generateAbbreviation(prefix, counter, used);
      const defCost = prefix.length + abbr.length + 3;
      const savings = (prefix.length - abbr.length - 1) * count;
      if (savings > defCost) {
        map.set(prefix, abbr);
        definitions.push(`@${abbr}=${prefix}`);
        counter++;
      }
    });
    return { map, definitions };
  }

  private _applyAbbreviations(path: string, map: Map<string, string>): string {
    if (!this._config.enableAbbreviations || map.size === 0) return path;
    let bestMatch = "";
    let bestAbbr = "";
    for (const [prefix, abbr] of map.entries()) {
      if (path.startsWith(prefix + ".") && prefix.length > bestMatch.length) {
        bestMatch = prefix;
        bestAbbr = abbr;
      }
    }
    if (bestMatch) return `@${bestAbbr}.${path.substring(bestMatch.length + 1)}`;
    return path;
  }

  private _flattenObject(obj: unknown): string {
    const output: string[] = [];
    this._flatten(obj, "", output);
    const paths = output.map((line) => {
      const colon = line.indexOf(":");
      if (colon > 0) {
        const pathPart = line.substring(0, colon);
        const bracket = pathPart.indexOf("[");
        return bracket > 0 ? pathPart.substring(0, bracket) : pathPart;
      }
      return line.split(":")[0];
    });
    const { map, definitions } = this._generateAbbreviations(paths);
    const abbreviated = output.map((line) => {
      const colon = line.indexOf(":");
      if (colon === -1) return line;
      const pathPart = line.substring(0, colon);
      const valuePart = line.substring(colon);
      const bracket = pathPart.indexOf("[");
      if (bracket > 0) {
        const base = pathPart.substring(0, bracket);
        const rest = pathPart.substring(bracket);
        return this._applyAbbreviations(base, map) + rest + valuePart;
      }
      return this._applyAbbreviations(pathPart, map) + valuePart;
    });
    return definitions.length > 0
      ? definitions.join("\n") + "\n" + abbreviated.join("\n")
      : abbreviated.join("\n");
  }

  optimize(rawData: unknown, ratioOrIntent: number | string | null = null): string {
    let inputObject: unknown = null;
    let ratio = 0.0;
    if (typeof ratioOrIntent === "number" && Number.isFinite(ratioOrIntent)) {
      ratio = ratioOrIntent;
    }
    if (typeof rawData === "string") {
      const trimmed = rawData.trim();
      if ((trimmed.startsWith("{") && trimmed.endsWith("}")) ||
          (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
        try {
          inputObject = JSON.parse(rawData);
        } catch { /* not JSON */ }
      }
      if (!inputObject) return this.optimizeText(rawData, ratio);
    } else if (typeof rawData === "object" && rawData !== null) {
      inputObject = rawData;
    } else {
      return String(rawData);
    }

    switch (this._config.jsonMode) {
      case JsonOptimizationMode.Flatten:
        return this._flattenObject(inputObject);
      case JsonOptimizationMode.ToYaml:
        return toYaml(inputObject);
      case JsonOptimizationMode.None:
      default:
        return JSON.stringify(inputObject);
    }
  }

  brevity(rawData: unknown): string {
    if (typeof rawData === "string") {
      const trimmed = rawData.trim();
      if ((trimmed.startsWith("{") && trimmed.endsWith("}")) ||
          (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
        try {
          const obj = JSON.parse(rawData);
          return this._flattenObject(obj);
        } catch { /* not JSON */ }
      }
      return this.compressText(rawData);
    }
    if (typeof rawData === "object" && rawData !== null) {
      return this._flattenObject(rawData);
    }
    return String(rawData);
  }

  toYaml(rawData: unknown): string {
    let obj = rawData;
    if (typeof rawData === "string") {
      try {
        const trimmed = rawData.trim();
        if ((trimmed.startsWith("{") && trimmed.endsWith("}")) ||
            (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
          obj = JSON.parse(rawData);
        }
      } catch { /* not JSON */ }
    }
    return toYaml(obj);
  }
}

export const defaultClient = new BrevitClient();
