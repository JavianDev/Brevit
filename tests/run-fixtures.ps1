# Run shared fixtures through JS/Python/.NET and (optionally) save outputs.
param(
  [switch]$Save,
  [string]$Case,
  [switch]$Llm,
  [string]$Model = "llama3.1:8b"
)

$ErrorActionPreference = "Stop"

Write-Host "=== Brevit Fixtures Runner ===" -ForegroundColor Cyan

function Assert-OkExitCode([string]$Step) {
  if ($LASTEXITCODE -ne 0) {
    throw "Step failed ($Step) with exit code $LASTEXITCODE"
  }
}

# Help the current session find freshly-installed tools (PATH may not refresh automatically)
$tesseractDir = "C:\Program Files\Tesseract-OCR"
if (Test-Path $tesseractDir) {
  if ($env:PATH -notlike "*$tesseractDir*") { $env:PATH = "$tesseractDir;$env:PATH" }
}
$ollamaDir = "C:\Users\$env:USERNAME\AppData\Local\Programs\Ollama"
if (Test-Path $ollamaDir) {
  if ($env:PATH -notlike "*$ollamaDir*") { $env:PATH = "$ollamaDir;$env:PATH" }
}

Write-Host "`n--- Preprocess (PDF/Image -> extracted text) ---" -ForegroundColor Yellow
Push-Location $PSScriptRoot
if ($Case) { python .\shared\preprocess_files.py --case $Case } else { python .\shared\preprocess_files.py }
Assert-OkExitCode "preprocess_files.py"
Pop-Location

Write-Host "`n--- JavaScript ---" -ForegroundColor Yellow
Push-Location (Join-Path $PSScriptRoot "javascript")
if ($Save) {
  if ($Case) {
    if ($Llm) { node run-fixtures.js --save --case $Case --llm --model $Model } else { node run-fixtures.js --save --case $Case }
  } else {
    if ($Llm) { node run-fixtures.js --save --llm --model $Model } else { node run-fixtures.js --save }
  }
} else {
  if ($Case) {
    if ($Llm) { node run-fixtures.js --case $Case --llm --model $Model } else { node run-fixtures.js --case $Case }
  } else {
    if ($Llm) { node run-fixtures.js --llm --model $Model } else { node run-fixtures.js }
  }
}
Assert-OkExitCode "javascript run-fixtures.js"
Pop-Location

Write-Host "`n--- Python ---" -ForegroundColor Yellow
Push-Location (Join-Path $PSScriptRoot "python")
if ($Save) {
  if ($Case) {
    if ($Llm) { python run_fixtures.py --save --case $Case --llm --model $Model } else { python run_fixtures.py --save --case $Case }
  } else {
    if ($Llm) { python run_fixtures.py --save --llm --model $Model } else { python run_fixtures.py --save }
  }
} else {
  if ($Case) {
    if ($Llm) { python run_fixtures.py --case $Case --llm --model $Model } else { python run_fixtures.py --case $Case }
  } else {
    if ($Llm) { python run_fixtures.py --llm --model $Model } else { python run_fixtures.py }
  }
}
Assert-OkExitCode "python run_fixtures.py"
Pop-Location

Write-Host "`n--- .NET ---" -ForegroundColor Yellow
Push-Location (Join-Path $PSScriptRoot "dotnet\Brevit.FixturesRunner")
if ($Save) {
  if ($Case) {
    if ($Llm) { dotnet run -- --save --case $Case --llm --model $Model } else { dotnet run -- --save --case $Case }
  } else {
    if ($Llm) { dotnet run -- --save --llm --model $Model } else { dotnet run -- --save }
  }
} else {
  if ($Case) {
    if ($Llm) { dotnet run -- --case $Case --llm --model $Model } else { dotnet run -- --case $Case }
  } else {
    if ($Llm) { dotnet run -- --llm --model $Model } else { dotnet run }
  }
}
Assert-OkExitCode "dotnet fixtures runner"
Pop-Location

if ($Save) {
  Write-Host "`n--- Report ---" -ForegroundColor Yellow
  Push-Location $PSScriptRoot
  python .\generate-report.py
  Assert-OkExitCode "generate-report.py"
  Pop-Location
}

Write-Host "`nOK: Fixtures completed!" -ForegroundColor Green


