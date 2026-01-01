# Brevit Test Suite

This folder contains comprehensive test cases and examples to verify all Brevit capabilities across all three implementations (JavaScript, Python, and .NET).

## Test Structure

```
tests/
├── javascript/          # JavaScript/TypeScript test cases
├── python/              # Python test cases
├── dotnet/              # C# / .NET test cases
└── shared/              # Shared test data and expected outputs
```

## Running Tests

### JavaScript
```bash
cd tests/javascript
node test-basic.js
node test-complex.js
node test-abbreviations.js
```

### Python
```bash
cd tests/python
python test_basic.py
python test_complex.py
python test_abbreviations.py
```

### .NET
```bash
cd tests/dotnet
dotnet test
```

## Generating Comparable Outputs (JS/Python/.NET)

To generate consistent “fixture outputs” (useful for reviewing changes and LLM-readability), run:

```powershell
cd tests
.\run-fixtures.ps1 -Save
```

Outputs are written to:
- `tests/outputs/javascript/`
- `tests/outputs/python/`
- `tests/outputs/dotnet/`

To run a single fixture:

```powershell
cd tests
.\run-fixtures.ps1 -Save -Case complex
```

## Test Coverage

- ✅ Basic JSON flattening
- ✅ Complex nested structures
- ✅ Primitive arrays
- ✅ Object arrays (tabular format)
- ✅ Abbreviation feature
- ✅ Mixed data types
- ✅ Edge cases (null, empty, nested arrays)
- ✅ Text optimization
- ✅ Different optimization modes

