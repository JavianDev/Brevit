import argparse
import html
import json
import os
from pathlib import Path
from typing import Dict, List, Optional


def read_text_if_exists(p: Path) -> Optional[str]:
    if not p.exists():
        return None
    return p.read_text(encoding="utf-8")


def load_meta(p: Path) -> Dict:
    if not p.exists():
        return {}
    return json.loads(p.read_text(encoding="utf-8"))


def gather_cases(outputs_root: Path) -> Dict[str, Dict[str, Dict[str, Optional[str]]]]:
    """
    Returns:
      { caseName: { lang: { 'brevit': str|None, 'llm': str|None, 'meta': json|{}, 'extractedPath': str|None } } }
    """
    cases: Dict[str, Dict[str, Dict[str, Optional[str]]]] = {}
    for lang in ["javascript", "python", "dotnet"]:
        lang_dir = outputs_root / lang
        if not lang_dir.exists():
            continue
        for meta_file in lang_dir.glob("*.meta.json"):
            name = meta_file.name.replace(".meta.json", "")
            cases.setdefault(name, {})
            meta = load_meta(meta_file)
            brevit = read_text_if_exists(lang_dir / f"{name}.brevit.txt")
            llm = read_text_if_exists(lang_dir / f"{name}.llm.txt")

            extracted_path = None
            for ext in ["json", "txt"]:
                p = lang_dir / f"{name}.extracted.{ext}"
                if p.exists():
                    extracted_path = p.name
                    break

            cases[name][lang] = {
                "brevit": brevit,
                "llm": llm,
                "meta_json": json.dumps(meta, indent=2) if meta else None,
                "extracted_file": extracted_path,
            }
    return cases


def render_html(cases: Dict[str, Dict[str, Dict[str, Optional[str]]]]) -> str:
    def esc(s: str) -> str:
        return html.escape(s, quote=False)

    rows: List[str] = []
    for case_name in sorted(cases.keys()):
        row = cases[case_name]
        meta_any = None
        for lang in ["javascript", "python", "dotnet"]:
            if lang in row and row[lang].get("meta_json"):
                meta_any = row[lang]["meta_json"]
                break

        rows.append(f"<h2>{esc(case_name)}</h2>")
        if meta_any:
            rows.append("<details><summary>meta</summary>")
            rows.append(f"<pre>{esc(meta_any)}</pre>")
            rows.append("</details>")

        rows.append('<div class="grid">')
        for lang in ["javascript", "python", "dotnet"]:
            data = row.get(lang, {})
            brevit = data.get("brevit") or ""
            llm = data.get("llm") or ""
            extracted = data.get("extracted_file")

            rows.append('<div class="card">')
            rows.append(f"<h3>{esc(lang)}</h3>")
            if extracted:
                rows.append(f'<div class="muted">extracted: <code>{esc(extracted)}</code></div>')
            rows.append("<h4>brevit</h4>")
            rows.append(f"<pre>{esc(brevit)}</pre>")
            rows.append("<h4>llm</h4>")
            rows.append(f"<pre>{esc(llm)}</pre>")
            rows.append("</div>")
        rows.append("</div>")

    body = "\n".join(rows)
    return f"""<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Brevit Fixtures Report</title>
    <style>
      body {{ font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; margin: 24px; }}
      h1 {{ margin: 0 0 16px 0; }}
      h2 {{ margin-top: 28px; }}
      .grid {{ display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }}
      .card {{ border: 1px solid #ddd; border-radius: 10px; padding: 12px; background: #fafafa; }}
      pre {{ background: #111; color: #eee; padding: 10px; border-radius: 8px; overflow: auto; max-height: 420px; }}
      code {{ background: #eee; padding: 2px 6px; border-radius: 6px; }}
      .muted {{ color: #555; font-size: 12px; margin-bottom: 8px; }}
      details > summary {{ cursor: pointer; }}
      @media (max-width: 1100px) {{ .grid {{ grid-template-columns: 1fr; }} }}
    </style>
  </head>
  <body>
    <h1>Brevit Fixtures Report</h1>
    <div class="muted">Generated from tests/outputs/{'{javascript,python,dotnet}'}</div>
    {body}
  </body>
</html>
"""


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--outputs", default="tests/outputs")
    ap.add_argument("--out", default="tests/outputs/report.html")
    args = ap.parse_args()

    repo_root = Path(__file__).resolve().parents[1]
    outputs_root = repo_root / args.outputs
    out_path = repo_root / args.out
    out_path.parent.mkdir(parents=True, exist_ok=True)

    cases = gather_cases(outputs_root)
    html_doc = render_html(cases)
    out_path.write_text(html_doc, encoding="utf-8")
    print(f"OK: Wrote report: {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


