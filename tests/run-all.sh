#!/bin/bash

echo "=== Running All Brevit Tests ==="
echo ""

echo "--- JavaScript Tests ---"
cd javascript
node test-basic.js
node test-complex.js
node test-abbreviations.js
cd ..

echo ""
echo "--- Python Tests ---"
cd python
python test_basic.py
python test_complex.py
python test_abbreviations.py
cd ..

echo ""
echo "--- .NET Tests ---"
cd dotnet
dotnet test
cd ..

echo ""
echo "✅ All tests completed!"


