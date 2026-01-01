# Brevit - Quick Reference Guide

This document provides quick access to all published packages, repositories, and installation commands for the Brevit project.

## 📦 Published Packages

### Brevit.js (JavaScript/TypeScript)

- **Package Name**: `brevit`
- **Current Version**: `0.1.5`
- **npm Registry**: https://www.npmjs.com/package/brevit
- **Package Page**: https://www.npmjs.com/package/brevit/v/0.1.5
- **Installation**: 
  ```bash
  npm install brevit
  ```
- **GitHub Repository**: https://github.com/JavianDev/Brevit.js
- **Local Path**: `C:\Projects\Brevit\Brevit.js\`

### Brevit.py (Python)

- **Package Name**: `brevit`
- **Current Version**: `0.1.5`
- **PyPI Registry**: https://pypi.org/project/brevit/
- **Package Page**: https://pypi.org/project/brevit/0.1.5/
- **Installation**: 
  ```bash
  pip install brevit
  ```
- **GitHub Repository**: https://github.com/JavianDev/Brevit.py
- **Local Path**: `C:\Projects\Brevit\Brevit.py\`

### Brevit.NET (C# / .NET)

- **Package Name**: `Brevit`
- **Current Version**: `0.1.5`
- **NuGet Registry**: https://www.nuget.org/packages/Brevit
- **Package Page**: https://www.nuget.org/packages/Brevit/0.1.5
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
- **Latest Version**: 0.1.5
- **License**: MIT
- **Maintainer**: javiandev

### PyPI (Brevit.py)
- **Total Downloads**: Check at https://pypi.org/project/brevit/
- **Latest Version**: 0.1.5
- **License**: MIT
- **Author**: JavianDev

### NuGet (Brevit.NET)
- **Total Downloads**: Check at https://www.nuget.org/packages/Brevit
- **Latest Version**: 0.1.5
- **License**: MIT
- **Author**: JavianDev

## 🔄 Publishing Workflow

### To Publish Updates:

1. **Update Version** in respective config files:
   - `Brevit.js/package.json` → `"version": "0.1.x"`
   - `Brevit.py/pyproject.toml` → `version = "0.1.x"`
   - `Brevit.NET/Brevit.NET.csproj` → `<Version>0.1.x</Version>`

2. **Commit and Push** to GitHub:
   ```bash
   git add .
   git commit -m "Update version to 0.1.x"
   git push
   ```

3. **Publish Packages**:
   - **npm**: `cd Brevit.js && npm publish --access public`
   - **PyPI**: `cd Brevit.py && python -m build && python -m twine upload dist/brevit-0.1.x*`
   - **NuGet**: `cd Brevit.NET && dotnet pack -c Release && dotnet nuget push bin/Release/Brevit.0.1.x.nupkg --api-key <KEY> --source https://api.nuget.org/v3/index.json`

## 🔐 Authentication Tokens

### npm
- Token stored in npm config: `npm config get //registry.npmjs.org/:_authToken`

### PyPI
- Token: Use `TWINE_USERNAME=__token__` and `TWINE_PASSWORD=<token>`

### NuGet
- API Key: `oy2otmmhbn5jqzydngya5c4erkqcycqutivbcalpqranky`

## 📝 Version History

- **0.1.5** - Updated all documentation examples to show abbreviations enabled by default, removed examples without abbreviations, fixed package name consistency
- **0.1.4** - Updated README titles to use package names (brevit/Brevit) instead of folder names, fixed documentation consistency
- **0.1.3** - Added abbreviation feature, updated README documentation with abbreviation examples
- **0.1.2** - Initial release with abbreviation feature
- **0.1.1** - Initial release

## 📧 Contact & Support

- **Author**: JavianDev
- **Email**: support@javianpicardo.com
- **GitHub Issues**:
  - https://github.com/JavianDev/Brevit.js/issues
  - https://github.com/JavianDev/Brevit.py/issues
  - https://github.com/JavianDev/Brevit.NET/issues

---

*Last Updated: 2026-01-01*
*All packages maintained at version 0.1.5*

