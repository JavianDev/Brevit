import { BrevitClient, BrevitConfig, JsonOptimizationMode } from '../../Brevit.js/src/brevit.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseArgs(argv) {
  const args = {
    save: false,
    caseName: null,
    manifest: path.resolve(__dirname, '../shared/file-fixtures.json'),
    extractedDir: path.resolve(__dirname, '../shared/extracted'),
    llm: false,
    model: 'llama3.1:8b',
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--save') args.save = true;
    else if (a === '--case') args.caseName = argv[++i];
    else if (a === '--manifest') args.manifest = path.resolve(process.cwd(), argv[++i]);
    else if (a === '--extracted') args.extractedDir = path.resolve(process.cwd(), argv[++i]);
    else if (a === '--llm') args.llm = true;
    else if (a === '--model') args.model = argv[++i];
  }
  return args;
}

function loadManifest(manifestPath) {
  const raw = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const cases = raw.cases || [];
  return cases.map((c) => ({
    name: c.name,
    type: c.type,
    inputPath: c.inputPath,
    intent: c.intent ?? null,
  }));
}

function readExtractedCase(extractedDir, c) {
  if (c.type === 'json') {
    const p = path.join(extractedDir, `${c.name}.json`);
    const text = fs.readFileSync(p, 'utf-8');
    return { kind: 'json', value: JSON.parse(text), extractedPath: p };
  }
  // text/pdf/image are normalized to text by preprocess
  const p = path.join(extractedDir, `${c.name}.txt`);
  const text = fs.readFileSync(p, 'utf-8');
  return { kind: 'text', value: text, extractedPath: p };
}

async function callOllama({ model, prompt }) {
  let res;
  try {
    res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: { temperature: 0 },
      }),
    });
  } catch (e) {
    throw new Error(
      `Ollama is not reachable at http://localhost:11434.\n` +
      `Start it (e.g., "ollama serve") and ensure the model exists (e.g., "ollama pull ${model}").\n` +
      `Original error: ${String(e)}`
    );
  }
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Ollama error (${res.status}): ${body}`);
  }
  const data = await res.json();
  return String(data.response ?? '').trim();
}

function buildPrompt({ intent, brevitOutput }) {
  const intentLine = intent ? `Intent: ${intent}\n` : '';
  return (
    `You are a strict evaluator. Read the Brevit-optimized input and answer the intent.\n` +
    `${intentLine}` +
    `Return a concise, factual answer.\n\n` +
    `BrevitInput:\n` +
    `${brevitOutput}\n`
  );
}

async function run() {
  const { save, caseName, manifest, extractedDir, llm, model } = parseArgs(process.argv);

  const cases = loadManifest(manifest);

  const outDir = path.resolve(__dirname, '../outputs/javascript');
  if (save) fs.mkdirSync(outDir, { recursive: true });

  const brevit = new BrevitClient(new BrevitConfig({
    jsonMode: JsonOptimizationMode.Flatten,
    enableAbbreviations: true,
    abbreviationThreshold: 2,
  }));

  const selected = caseName ? cases.filter((c) => c.name === caseName) : cases;
  if (caseName && selected.length === 0) {
    throw new Error(`Unknown case "${caseName}". Available: ${cases.map((c) => c.name).join(', ')}`);
  }

  for (const c of selected) {
    const extracted = readExtractedCase(extractedDir, c);
    const output = await brevit.brevity(extracted.value);

    console.log(`=== Fixture: ${c.name} ===`);
    console.log('Output:');
    console.log(output);
    console.log('');

    if (save) {
      // Save extracted input for review
      const extractedCopyExt = extracted.kind === 'json' ? 'json' : 'txt';
      fs.copyFileSync(extracted.extractedPath, path.join(outDir, `${c.name}.extracted.${extractedCopyExt}`));

      // Save Brevit output
      fs.writeFileSync(path.join(outDir, `${c.name}.brevit.txt`), output + '\n', 'utf-8');

      // Save meta for report generation
      const metaPath = path.join(extractedDir, `${c.name}.meta.json`);
      if (fs.existsSync(metaPath)) {
        fs.copyFileSync(metaPath, path.join(outDir, `${c.name}.meta.json`));
      }

      if (llm) {
        const prompt = buildPrompt({ intent: c.intent, brevitOutput: output });
        const llmOut = await callOllama({ model, prompt });
        console.log('LLM Output:');
        console.log(llmOut);
        console.log('');
        fs.writeFileSync(path.join(outDir, `${c.name}.llm.txt`), llmOut + '\n', 'utf-8');
      }
    }
  }

  if (save) {
    console.log(`✅ Saved outputs to: ${outDir}`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});


