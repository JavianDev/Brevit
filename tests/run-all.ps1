# PowerShell script to run all Brevit tests

Write-Host "=== Running All Brevit Tests ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "--- JavaScript Tests ---" -ForegroundColor Yellow
Set-Location javascript
node test-basic.js
node test-complex.js
node test-abbreviations.js
Set-Location ..

Write-Host ""
Write-Host "--- Python Tests ---" -ForegroundColor Yellow
Set-Location python
python test_basic.py
python test_complex.py
python test_abbreviations.py
Set-Location ..

Write-Host ""
Write-Host "--- .NET Tests ---" -ForegroundColor Yellow
Set-Location dotnet
dotnet test
Set-Location ..

Write-Host ""
Write-Host "✅ All tests completed!" -ForegroundColor Green


