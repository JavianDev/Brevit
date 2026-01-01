import argparse
import asyncio
import json
import os
import sys
import urllib.request
from typing import Any, Dict, List, Optional, TypedDict

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../Brevit.py/src'))
from brevit import BrevitClient, BrevitConfig, JsonOptimizationMode  # noqa: E402


class ManifestCase(TypedDict, total=False):
    name: str
    type: str
    inputPath: str
    intent: Optional[str]


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("--save", action="store_true", help="Save outputs to tests/outputs/python/")
    p.add_argument("--case", dest="case_name", default=None, help="Run only a single fixture by name")
    p.add_argument("--manifest", default=os.path.join("..", "shared", "file-fixtures.json"))
    p.add_argument("--extracted", default=os.path.join("..", "shared", "extracted"))
    p.add_argument("--llm", action="store_true", help="Call local Ollama and save LLM output")
    p.add_argument("--model", default="llama3.1:8b", help="Ollama model name (e.g., llama3.1:8b)")
    return p.parse_args()


def load_manifest(manifest_path: str) -> List[ManifestCase]:
    with open(manifest_path, "r", encoding="utf-8") as f:
        raw = json.load(f)
    return raw.get("cases", [])


def read_extracted_case(extracted_dir: str, c: ManifestCase) -> tuple[str, Any, str]:
    name = c["name"]
    ctype = c["type"]
    if ctype == "json":
        p = os.path.join(extracted_dir, f"{name}.json")
        with open(p, "r", encoding="utf-8") as f:
            return "json", json.load(f), p
    p = os.path.join(extracted_dir, f"{name}.txt")
    with open(p, "r", encoding="utf-8") as f:
        return "text", f.read(), p


def build_prompt(intent: Optional[str], brevit_output: str) -> str:
    intent_line = f"Intent: {intent}\n" if intent else ""
    return (
        "You are a strict evaluator. Read the Brevit-optimized input and answer the intent.\n"
        f"{intent_line}"
        "Return a concise, factual answer.\n\n"
        "BrevitInput:\n"
        f"{brevit_output}\n"
    )


def call_ollama(model: str, prompt: str) -> str:
    payload: Dict[str, Any] = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "options": {"temperature": 0},
    }
    req = urllib.request.Request(
        "http://localhost:11434/api/generate",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            body = resp.read().decode("utf-8")
    except Exception as e:
        raise SystemExit(
            "Ollama is not reachable at http://localhost:11434.\n"
            f"Start it (e.g., `ollama serve`) and ensure the model exists (e.g., `ollama pull {model}`).\n"
            f"Original error: {e}"
        )
    data = json.loads(body)
    return str(data.get("response", "")).strip()


async def main():
    args = parse_args()
    here = os.path.dirname(__file__)
    manifest_path = os.path.abspath(os.path.join(here, args.manifest))
    extracted_dir = os.path.abspath(os.path.join(here, args.extracted))
    cases = load_manifest(manifest_path)

    out_dir = os.path.abspath(os.path.join(here, "..", "outputs", "python"))
    if args.save:
        os.makedirs(out_dir, exist_ok=True)

    brevit = BrevitClient(BrevitConfig(json_mode=JsonOptimizationMode.Flatten))

    selected = [c for c in cases if c["name"] == args.case_name] if args.case_name else cases
    if args.case_name and not selected:
        raise SystemExit(f'Unknown case "{args.case_name}". Available: {", ".join([c["name"] for c in cases])}')

    for c in selected:
        kind, value, extracted_path = read_extracted_case(extracted_dir, c)
        output = await brevit.brevity(value)

        name = c["name"]
        print(f"=== Fixture: {name} ===")
        print("Output:")
        print(output)
        print("")

        if args.save:
            extracted_ext = "json" if kind == "json" else "txt"
            shutil_path = os.path.join(out_dir, f"{name}.extracted.{extracted_ext}")
            with open(extracted_path, "rb") as src, open(shutil_path, "wb") as dst:
                dst.write(src.read())

            with open(os.path.join(out_dir, f"{name}.brevit.txt"), "w", encoding="utf-8") as f:
                f.write(output + "\n")

            meta_src = os.path.join(extracted_dir, f"{name}.meta.json")
            meta_dst = os.path.join(out_dir, f"{name}.meta.json")
            if os.path.exists(meta_src):
                with open(meta_src, "rb") as src, open(meta_dst, "wb") as dst:
                    dst.write(src.read())

            if args.llm:
                llm_out = call_ollama(args.model, build_prompt(c.get("intent"), output))
                print("LLM Output:")
                print(llm_out)
                print("")
                with open(os.path.join(out_dir, f"{name}.llm.txt"), "w", encoding="utf-8") as f:
                    f.write(llm_out + "\n")

    if args.save:
        print(f"Saved outputs to: {out_dir}")


if __name__ == "__main__":
    asyncio.run(main())


