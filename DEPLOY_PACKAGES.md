# Package Deployment Guide

## ✅ Pre-Deployment Status

### Package Metadata Updated
- ✅ All repository URLs updated to `https://github.com/JavianDev/Brevit.git`
- ✅ Author information updated to `JavianDev <support@javianpicardo.com>`
- ✅ Package versions set to `0.1.0`

### Packages Built
- ✅ **Brevit.py**: Built successfully (`dist/brevit_py-0.1.0.tar.gz` and `.whl`)
- ✅ **Brevit.NET**: Ready to pack (build successful)
- ✅ **Brevit.js**: Ready to publish (no build required)

## Deployment Steps

### 1. Brevit.NET → NuGet

**Prerequisites:**
- NuGet account: https://www.nuget.org/
- NuGet API key: https://www.nuget.org/account/apikeys

**Steps:**
```bash
# From the root of the project (C:\Projects\Brevit)

# Build and pack
dotnet pack Brevit.NET/Brevit.NET.csproj --configuration Release --output ./artifacts

# Publish to NuGet
dotnet nuget push ./artifacts/*.nupkg --api-key YOUR_NUGET_API_KEY --source https://api.nuget.org/v3/index.json

```

**Package Name:** `Brevit.NET`  
**Package URL:** https://www.nuget.org/packages/Brevit.NET

---

### 2. Brevit.js → npm

**Prerequisites:**
- npm account: https://www.npmjs.com/
- npm login: `npm login`

**Steps:**
```bash
cd Brevit.js

# Login to npm (first time only)
npm login
# Enter your npm username, password, and email

# Verify package.json is correct
cat package.json

# Publish
npm publish

# For scoped packages (if needed):
# npm publish --access public
```

**Package Name:** `brevit`  
**Package URL:** https://www.npmjs.com/package/brevit

**Note:** Make sure you're logged in: `npm whoami`

---

### 3. Brevit.py → PyPI

**Prerequisites:**
- PyPI account: https://pypi.org/
- Install build tools: `pip install build twine`

**Steps:**
```bash
cd Brevit.py

# Build packages (already done, but can rebuild)
python -m build

# Upload to PyPI (TestPyPI first recommended)
# TestPyPI: https://test.pypi.org/
twine upload --repository testpypi dist/*

# If test upload successful, upload to production PyPI
twine upload dist/*

# Or use interactive login
twine upload dist/* --username YOUR_PYPI_USERNAME
```

**Package Name:** `brevit-py`  
**Package URL:** https://pypi.org/project/brevit-py/

**Note:** For first-time upload, consider testing on TestPyPI first:
```bash
twine upload --repository-url https://test.pypi.org/legacy/ dist/*
```

---

## Verification After Deployment

### NuGet
```bash
# Search for package
dotnet add package Brevit.NET --version 0.1.0

# Or check online
# https://www.nuget.org/packages/Brevit.NET
```

### npm
```bash
# Install package
npm install brevit-js

# Or check online
# https://www.npmjs.com/package/brevit-js
```

### PyPI
```bash
# Install package
pip install brevit-py

# Or check online
# https://pypi.org/project/brevit-py/
```

---

## Post-Deployment Checklist

- [ ] All packages published successfully
- [ ] Packages are searchable on their respective repositories
- [ ] Installation works: `dotnet add package`, `npm install`, `pip install`
- [ ] Update README files with installation instructions
- [ ] Create GitHub release: `git tag v0.1.0 && git push origin v0.1.0`
- [ ] Announce release on GitHub Discussions or social media

---

## Troubleshooting

### NuGet Issues
- **403 Forbidden**: Check API key permissions
- **409 Conflict**: Package version already exists (increment version)
- **401 Unauthorized**: API key expired or invalid

### npm Issues
- **403 Forbidden**: Package name already taken (change name in package.json)
- **401 Unauthorized**: Not logged in (`npm login`)
- **402 Payment Required**: Organization account needs paid plan for private packages

### PyPI Issues
- **403 Forbidden**: Package name already taken
- **401 Unauthorized**: Invalid credentials
- **400 Bad Request**: Package metadata issues (check pyproject.toml)

---

## Version Management

For future releases, update versions in:
- `Brevit.NET/Brevit.NET.csproj`: `<Version>0.1.1</Version>`
- `Brevit.js/package.json`: `"version": "0.1.1"`
- `Brevit.py/pyproject.toml`: `version = "0.1.1"`

Follow semantic versioning: `MAJOR.MINOR.PATCH`
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

---

## Quick Deploy Script

Create a `deploy.sh` (Linux/Mac) or `deploy.ps1` (Windows) script:

```bash
#!/bin/bash
# deploy.sh

echo "Deploying Brevit packages..."

# .NET
echo "Building Brevit.NET..."
cd Brevit.NET
dotnet pack --configuration Release
echo "Publish Brevit.NET manually: dotnet nuget push bin/Release/Brevit.NET.0.1.0.nupkg --api-key YOUR_KEY"

# JavaScript
echo "Publishing Brevit.js..."
cd ../Brevit.js
npm publish

# Python
echo "Publishing Brevit.py..."
cd ../Brevit.py
twine upload dist/*

echo "Deployment complete!"
```

---

## Support

If you encounter issues during deployment:
- Check package repository status pages
- Verify credentials and API keys
- Review package metadata for errors
- Check GitHub Actions for build status

**Contact:** support@javianpicardo.com
