# Brevit - Quick Reference Guide

This document provides quick access to all published packages, repositories, and installation commands for the Brevit project.

## 📦 Published Packages

### Brevit.js (JavaScript/TypeScript)

- **Package Name**: `brevit`
- **Current Version**: `1.0.1`
- **npm Registry**: https://www.npmjs.com/package/brevit
- **Package Page**: https://www.npmjs.com/package/brevit/v/1.0.1
- **Installation**: 
  ```bash
  npm install brevit
  ```
- **GitHub Repository**: https://github.com/JavianDev/Brevit.js
- **Local Path**: `C:\Projects\Brevit\Brevit.js\`

### Brevit.py (Python)

- **Package Name**: `brevit`
- **Current Version**: `1.0.1`
- **PyPI Registry**: https://pypi.org/project/brevit/
- **Package Page**: https://pypi.org/project/brevit/1.0.1/
- **Installation**: 
  ```bash
  pip install brevit
  ```
- **GitHub Repository**: https://github.com/JavianDev/Brevit.py
- **Local Path**: `C:\Projects\Brevit\Brevit.py\`

### Brevit.NET (C# / .NET)

- **Package Name**: `Brevit`
- **Current Version**: `1.0.1`
- **NuGet Registry**: https://www.nuget.org/packages/Brevit
- **Package Page**: https://www.nuget.org/packages/Brevit/1.0.1
- **Installation**: 
  ```bash
  dotnet add package Brevit
  ```
  Or via Package Manager:
  ```
  Install-Package Brevit
  ```
- **GitHub Repository**: https://github.com/JavianDev/Brevit.NET
- **Local Path**: `C:\Projects\Brevit\Brevit.NET\`

## 🔗 Quick Links

### Package Registries
- **npm**: https://www.npmjs.com/package/brevit
- **PyPI**: https://pypi.org/project/brevit/
- **NuGet**: https://www.nuget.org/packages/Brevit

### GitHub Repositories
- **Brevit.js**: https://github.com/JavianDev/Brevit.js
- **Brevit.py**: https://github.com/JavianDev/Brevit.py
- **Brevit.NET**: https://github.com/JavianDev/Brevit.NET

### Documentation
- **Brevit.js README**: https://github.com/JavianDev/Brevit.js#readme
- **Brevit.py README**: https://github.com/JavianDev/Brevit.py#readme
- **Brevit.NET README**: https://github.com/JavianDev/Brevit.NET#readme

## 📁 Local Project Structure

```
C:\Projects\Brevit\
├── Brevit.js\          # JavaScript/TypeScript implementation
│   ├── src\            # Source code
│   ├── test\           # Test files
│   └── package.json    # npm package configuration
│
├── Brevit.py\          # Python implementation
│   ├── src\            # Source code
│   ├── tests\          # Test files
│   └── pyproject.toml  # Python package configuration
│
└── Brevit.NET\         # C# / .NET implementation
    ├── BrevitClient.cs # Main source code
    └── Brevit.NET.csproj # .NET project configuration
```

## 🚀 Quick Installation Commands

### JavaScript/TypeScript
```bash
npm install brevit
```

### Python
```bash
pip install brevit
```

### .NET
```bash
dotnet add package Brevit
```

## 📊 Package Statistics

### npm (Brevit.js)
- **Total Downloads**: Check at https://www.npmjs.com/package/brevit
- **Latest Version**: 1.0.1
- **License**: MIT
- **Maintainer**: javiandev

### PyPI (Brevit.py)
- **Total Downloads**: Check at https://pypi.org/project/brevit/
- **Latest Version**: 1.0.1
- **License**: MIT
- **Author**: JavianDev

### NuGet (Brevit.NET)
- **Total Downloads**: Check at https://www.nuget.org/packages/Brevit
- **Latest Version**: 1.0.1
- **License**: MIT
- **Author**: JavianDev

## 🔄 Publishing Workflow

### To Publish Updates:

1. **Update Version** in respective config files:
   - `Brevit.js/package.json` → `"version": "1.0.x"`
   - `Brevit.py/pyproject.toml` → `version = "1.0.x"`
   - `Brevit.NET/Brevit.NET.csproj` → `<Version>1.0.x</Version>`

2. **Commit and Push** to GitHub:
   ```bash
   git add .
   git commit -m "Release 1.0.x"
   git push
   ```

3. **Publish Packages**:
   - **npm**: `cd Brevit.js && npm publish --access public`
   - **PyPI**: `cd Brevit.py && python -m build && python -m twine upload dist/brevit-1.0.x*`
   - **NuGet**: `cd Brevit.NET && dotnet pack -c Release && dotnet nuget push bin/Release/Brevit.1.0.x.nupkg --api-key <NUGET_API_KEY> --source https://api.nuget.org/v3/index.json`

## 🔐 Authentication Tokens

### npm
- Token stored in npm config: `npm config get //registry.npmjs.org/:_authToken`

### PyPI
- Token: Use `TWINE_USERNAME=__token__` and `TWINE_PASSWORD=<token>`

### NuGet
- API Key: **DO NOT store secrets in this repo**. Use `dotnet nuget setapikey <KEY> --source https://api.nuget.org/v3/index.json` or a secure CI secret store.

## 📝 Version History

- **1.0.1** - Patch release: deterministic TextRank pipeline improvements; **auto mode is lossless by default**; ratio-based compression available via `optimizeText(..., ratio)` APIs.
- **1.0.0** - Major release: deterministic TextRank-based text processing + robust input routing (JSON vs plain text); new explicit text APIs across JS/.NET/Python.
- **0.1.5** - Legacy pre-1.0 releases

## 📧 Contact & Support

- **Author**: JavianDev
- **Email**: support@javianpicardo.com
- **GitHub Issues**:
  - https://github.com/JavianDev/Brevit.js/issues
  - https://github.com/JavianDev/Brevit.py/issues
  - https://github.com/JavianDev/Brevit.NET/issues

---

*Last Updated: 2026-01-12*
*All packages maintained at version 1.0.1*

