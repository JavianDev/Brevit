# Deployment Guide

## Current Status

### ✅ Pre-Deployment Checklist
- ✅ All projects build successfully locally
- ✅ All tests passing locally
- ✅ CI/CD pipelines configured
- ✅ Git repository initialized
- ✅ Remote repository configured: `https://github.com/JavianDev/Brevit.git`
- ⚠️ **Pending**: Email verification for `support@javianpicardo.com` in GitHub settings

## Why Pipelines Might Fail (Before First Push)

Pipelines haven't run yet because the code hasn't been pushed to GitHub. Once you push, here are potential issues and solutions:

### 1. .NET Pipeline Issues

**Potential Issues:**
- Test project path mismatch
- Missing test dependencies
- Build configuration issues

**Solutions:**
- ✅ Fixed: Test path corrected to `Brevit.NET.Tests/Brevit.NET.Tests.csproj`
- Ensure all NuGet packages are restored
- Verify .NET 8.0 SDK is available

**Test Locally:**
```bash
cd Brevit.NET
dotnet restore
dotnet build --configuration Release
dotnet test ../Brevit.NET.Tests/Brevit.NET.Tests.csproj
```

### 2. JavaScript Pipeline Issues

**Potential Issues:**
- Missing `package-lock.json` (using `npm install` instead of `npm ci`)
- Test script failures
- Node.js version compatibility

**Solutions:**
- ✅ Fixed: Changed `npm ci` to `npm install` (no lock file yet)
- Verify test script works: `npm test`
- Tests run on Node.js 18.x and 20.x

**Test Locally:**
```bash
cd Brevit.js
npm install
npm test
```

### 3. Python Pipeline Issues

**Potential Issues:**
- Missing pytest dependencies
- Python version compatibility
- Import path issues

**Solutions:**
- Ensure `pytest` and `pytest-asyncio` are installed
- Tests run on Python 3.8-3.12
- Package installed in editable mode: `pip install -e .`

**Test Locally:**
```bash
cd Brevit.py
pip install pytest pytest-asyncio
pip install -e .
pytest tests/ -v
```

## Deployment Steps

### Step 1: Verify Email in GitHub

**CRITICAL**: Before pushing, verify your email in GitHub:

1. Go to: https://github.com/settings/emails
2. Find `support@javianpicardo.com`
3. Either:
   - **Option A**: Make it public (uncheck "Keep my email addresses private")
   - **Option B**: Use GitHub's no-reply email: `JavianDev@users.noreply.github.com`

### Step 2: Push to GitHub

```bash
cd C:\Projects\Discussion\Brevit

# Verify configuration
git config user.name    # Should be: JavianDev
git config user.email    # Should be: support@javianpicardo.com

# Push to GitHub
git push -u origin main
```

If email privacy blocks the push, use:
```bash
git config user.email "JavianDev@users.noreply.github.com"
git commit --amend --reset-author --no-edit
git push -u origin main --force
```

### Step 3: Monitor CI/CD Pipelines

After pushing, check GitHub Actions:
1. Go to: https://github.com/JavianDev/Brevit/actions
2. Monitor pipeline runs
3. Fix any failures based on error messages

### Step 4: Package Deployment

#### Brevit.NET (NuGet)

**Prerequisites:**
- NuGet account: https://www.nuget.org/
- NuGet API key

**Deploy:**
```bash
cd Brevit.NET
dotnet pack --configuration Release
dotnet nuget push bin/Release/Brevit.NET.0.1.0.nupkg --api-key YOUR_API_KEY --source https://api.nuget.org/v3/index.json
```

**Package Name:** `Brevit.NET`

#### Brevit.js (npm)

**Prerequisites:**
- npm account: https://www.npmjs.com/
- npm login: `npm login`

**Deploy:**
```bash
cd Brevit.js
npm login
npm publish
```

**Package Name:** `brevit-js`

**Note:** Update `package.json` repository URL to match GitHub repo before publishing.

#### Brevit.py (PyPI)

**Prerequisites:**
- PyPI account: https://pypi.org/
- Install build tools: `pip install build twine`

**Deploy:**
```bash
cd Brevit.py
python -m build
twine upload dist/*
```

**Package Name:** `brevit-py`

**Note:** Update `pyproject.toml` repository URLs to match GitHub repo before publishing.

## Post-Deployment

### 1. Create GitHub Release

```bash
# Tag the release
git tag -a v0.1.0 -m "Initial release: Brevit v0.1.0"
git push origin v0.1.0

# Then create release on GitHub:
# https://github.com/JavianDev/Brevit/releases/new
```

### 2. Update Package Metadata

Before publishing packages, update:
- **Brevit.js/package.json**: Repository URL
- **Brevit.py/pyproject.toml**: Repository URLs
- **Brevit.NET**: Add NuGet package metadata to `.csproj`

### 3. Documentation

- ✅ README files complete
- ✅ API documentation included
- ✅ Examples provided
- Consider adding:
  - CHANGELOG.md
  - CONTRIBUTING.md
  - CODE_OF_CONDUCT.md

## Troubleshooting Pipeline Failures

### Common Issues:

1. **Test Failures**
   - Check test output in GitHub Actions logs
   - Run tests locally to reproduce
   - Fix failing tests

2. **Build Failures**
   - Verify all dependencies are specified
   - Check for missing files
   - Ensure build commands are correct

3. **Path Issues**
   - Verify working directories in workflows
   - Check file paths match repository structure
   - Ensure case sensitivity is correct (Linux runners)

4. **Version Compatibility**
   - .NET: Requires .NET 8.0 SDK
   - Node.js: Requires 18.x or 20.x
   - Python: Requires 3.8-3.12

## Next Steps After Successful Deployment

1. **Monitor Usage**
   - Track package downloads
   - Monitor GitHub issues
   - Collect user feedback

2. **Version Updates**
   - Follow semantic versioning (MAJOR.MINOR.PATCH)
   - Update version numbers before releases
   - Tag releases appropriately

3. **Continuous Integration**
   - Add code coverage reporting
   - Set up automated releases
   - Add dependency updates (Dependabot)

4. **Documentation**
   - Keep README files updated
   - Add migration guides for breaking changes
   - Create video tutorials (optional)

## Support

- **Issues**: https://github.com/JavianDev/Brevit/issues
- **Email**: support@javianpicardo.com
- **Documentation**: See README.md files in each library folder
