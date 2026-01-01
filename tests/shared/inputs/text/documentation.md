# Brevit - Quick Notes

## Purpose
- Reduce token usage for LLM prompts
- Keep data readable
- Work across JavaScript, Python, and .NET

## Supported inputs (current repo)
- JSON objects / JSON strings
- Plain text
- Images (OCR is currently a stub in the libraries; real OCR is handled in tests via preprocess)
- PDFs (text extraction handled in tests via preprocess)

## Desired output
The output should be deterministic and easy to scan:
- key.path:value
- compact arrays
- tabular rows for uniform arrays


