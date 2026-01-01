import argparse
import json
import os
import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Literal, Optional, Tuple


CaseType = Literal["json", "text", "image", "pdf"]


@dataclass(frozen=True)
class FixtureCase:
    name: str
    type: CaseType
    input_path: Path
    intent: Optional[str] = None


def _load_manifest(manifest_path: Path) -> List[FixtureCase]:
    data = json.loads(manifest_path.read_text(encoding="utf-8"))
    cases = []
    for c in data.get("cases", []):
        cases.append(
            FixtureCase(
                name=c["name"],
                type=c["type"],
                input_path=Path(c["inputPath"]),
                intent=c.get("intent"),
            )
        )
    return cases


def _run(cmd: List[str]) -> Tuple[int, str, str]:
    try:
        p = subprocess.run(cmd, capture_output=True, text=True)
        return p.returncode, p.stdout, p.stderr
    except FileNotFoundError as e:
        return 127, "", str(e)


def _ensure_parent(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def _try_imports() -> Dict[str, bool]:
    ok = {}
    try:
        import PIL  # noqa: F401

        ok["pillow"] = True
    except Exception:
        ok["pillow"] = False
    try:
        import pytesseract  # noqa: F401

        ok["pytesseract"] = True
    except Exception:
        ok["pytesseract"] = False
    try:
        import pypdf  # noqa: F401

        ok["pypdf"] = True
    except Exception:
        ok["pypdf"] = False
    try:
        import reportlab  # noqa: F401

        ok["reportlab"] = True
    except Exception:
        ok["reportlab"] = False
    return ok


def _ensure_generated_inputs(repo_root: Path, cases: List[FixtureCase]) -> None:
    """
    We avoid committing binary fixtures. If a case references a PDF/image that
    doesn't exist, we generate a small deterministic one locally.
    """
    needs_image = any(c.type == "image" and not (repo_root / c.input_path).exists() for c in cases)
    needs_pdf = any(c.type == "pdf" and not (repo_root / c.input_path).exists() for c in cases)

    if not needs_image and not needs_pdf:
        return

    deps = _try_imports()
    if needs_image:
        if not deps.get("pillow") or not deps.get("pytesseract"):
            raise SystemExit(
                "Image fixtures are missing and cannot be generated.\n"
                "Install dependencies: pip install pillow pytesseract\n"
                "Also install Tesseract OCR and ensure `tesseract` is on PATH."
            )

        from PIL import Image, ImageDraw, ImageFont  # type: ignore

        # Deterministic invoice-like image
        img_path = repo_root / "tests/shared/inputs/images/invoice.png"
        _ensure_parent(img_path)
        img = Image.new("RGB", (900, 450), color=(255, 255, 255))
        d = ImageDraw.Draw(img)

        # Default bitmap font is fine; keeps this dependency-light and deterministic.
        try:
            font = ImageFont.load_default()
        except Exception:
            font = None

        lines = [
            "INVOICE",
            "Invoice #: INV-1001",
            "Date: 2026-01-01",
            "Customer: Jane Smith",
            "Total: $185.94",
        ]
        y = 40
        for line in lines:
            d.text((40, y), line, fill=(0, 0, 0), font=font)
            y += 45

        img.save(img_path)

    if needs_pdf:
        if not deps.get("reportlab"):
            raise SystemExit(
                "PDF fixtures are missing and cannot be generated.\n"
                "Install dependency: pip install reportlab"
            )

        from reportlab.lib.pagesizes import letter  # type: ignore
        from reportlab.pdfgen import canvas  # type: ignore

        pdf_path = repo_root / "tests/shared/inputs/pdf/invoice.pdf"
        _ensure_parent(pdf_path)

        c = canvas.Canvas(str(pdf_path), pagesize=letter)
        c.setFont("Helvetica", 14)
        c.drawString(72, 720, "INVOICE")
        c.setFont("Helvetica", 12)
        c.drawString(72, 690, "Invoice #: INV-2002")
        c.drawString(72, 670, "Date: 2026-01-01")
        c.drawString(72, 650, "Customer: Jane Smith")
        c.drawString(72, 630, "Total: $185.94")
        c.showPage()
        c.save()


def _extract_pdf_text(pdf_path: Path) -> str:
    from pypdf import PdfReader  # type: ignore

    reader = PdfReader(str(pdf_path))
    parts: List[str] = []
    for page in reader.pages:
        text = page.extract_text() or ""
        parts.append(text)
    # Normalize whitespace a bit
    combined = "\n".join(p.strip() for p in parts if p.strip())
    return combined.strip()


def _ocr_image(image_path: Path) -> str:
    # Prefer using pytesseract; also validate Tesseract exists.
    deps = _try_imports()
    if not deps.get("pytesseract") or not deps.get("pillow"):
        raise SystemExit("OCR requires: pip install pillow pytesseract")

    tesseract_cmd = shutil.which("tesseract")
    if not tesseract_cmd:
        # Common Windows install location (winget UB-Mannheim.TesseractOCR)
        candidates = [
            r"C:\Program Files\Tesseract-OCR\tesseract.exe",
            r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        ]
        for c in candidates:
            if Path(c).exists():
                tesseract_cmd = c
                break

    if not tesseract_cmd:
        raise SystemExit(
            "Tesseract not found (required for OCR).\n"
            "Install Tesseract and ensure it is on PATH, or installed at the default location:\n"
            r"  C:\Program Files\Tesseract-OCR\tesseract.exe"
        )

    code, _, err = _run([tesseract_cmd, "--version"])
    if code != 0:
        raise SystemExit(
            "Tesseract not found on PATH (required for OCR).\n"
            "Install Tesseract and ensure `tesseract --version` works.\n"
            f"Details: {err}"
        )

    import pytesseract  # type: ignore
    from PIL import Image  # type: ignore

    # Ensure pytesseract uses the resolved binary.
    pytesseract.pytesseract.tesseract_cmd = tesseract_cmd

    img = Image.open(image_path)
    text = pytesseract.image_to_string(img)
    return text.strip()


def _normalize_text(s: str) -> str:
    # Keep it simple and deterministic.
    lines = [ln.rstrip() for ln in s.replace("\r\n", "\n").replace("\r", "\n").split("\n")]
    # Drop excessive blank lines
    out: List[str] = []
    blank = 0
    for ln in lines:
        if ln.strip() == "":
            blank += 1
            if blank <= 1:
                out.append("")
        else:
            blank = 0
            out.append(ln)
    return "\n".join(out).strip() + "\n"


def _write_extracted_json(out_path: Path, input_path: Path) -> None:
    obj = json.loads(input_path.read_text(encoding="utf-8"))
    _ensure_parent(out_path)
    out_path.write_text(json.dumps(obj, indent=2) + "\n", encoding="utf-8")


def _write_extracted_text(out_path: Path, text: str) -> None:
    _ensure_parent(out_path)
    out_path.write_text(_normalize_text(text), encoding="utf-8")


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--manifest", default="tests/shared/file-fixtures.json")
    p.add_argument("--case", dest="case_name", default=None)
    p.add_argument("--out", dest="out_dir", default="tests/shared/extracted")
    args = p.parse_args()

    repo_root = Path(__file__).resolve().parents[2]
    manifest_path = repo_root / args.manifest
    out_dir = repo_root / args.out_dir

    cases = _load_manifest(manifest_path)
    if args.case_name:
        cases = [c for c in cases if c.name == args.case_name]
        if not cases:
            raise SystemExit(f'Unknown case "{args.case_name}" in manifest.')

    # Generate missing binary inputs (we don't commit them).
    _ensure_generated_inputs(repo_root, cases)

    deps = _try_imports()
    # For real extraction we require:
    if any(c.type == "pdf" for c in cases) and not deps.get("pypdf"):
        raise SystemExit("PDF extraction requires: pip install pypdf")
    if any(c.type == "pdf" for c in cases) and not deps.get("reportlab"):
        # reportlab is only required for generating missing PDFs; but we also want a clear message.
        pass

    # Clean output dir for repeatable runs.
    out_dir.mkdir(parents=True, exist_ok=True)

    for c in cases:
        src = repo_root / c.input_path
        if not src.exists():
            raise SystemExit(f"Missing input file: {src}")

        if c.type == "json":
            _write_extracted_json(out_dir / f"{c.name}.json", src)
        elif c.type == "text":
            _write_extracted_text(out_dir / f"{c.name}.txt", src.read_text(encoding="utf-8"))
        elif c.type == "pdf":
            text = _extract_pdf_text(src)
            _write_extracted_text(out_dir / f"{c.name}.txt", text)
        elif c.type == "image":
            text = _ocr_image(src)
            _write_extracted_text(out_dir / f"{c.name}.txt", text)
        else:
            raise SystemExit(f"Unsupported case type: {c.type}")

        # Always write small metadata for reporting.
        meta: Dict[str, Any] = {
            "name": c.name,
            "type": c.type,
            "inputPath": str(c.input_path).replace("\\", "/"),
            "intent": c.intent,
        }
        (out_dir / f"{c.name}.meta.json").write_text(json.dumps(meta, indent=2) + "\n", encoding="utf-8")

    print(f"OK: Preprocessed {len(cases)} case(s) into: {out_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


