# GitHub Secrets Setup for Automated Deployment

## Required Secrets

To enable automated deployment, add these secrets to your GitHub repository:

### 1. NuGet API Key
- **Secret Name:** `NUGET_API_KEY`
- **How to Get:**
  1. Go to https://www.nuget.org/account/apikeys
  2. Create a new API key
  3. Set expiration (recommended: 1 year)
  4. Copy the API key value
- **Add to GitHub:**
  1. Go to: `https://github.com/JavianDev/Brevit/settings/secrets/actions`
  2. Click "New repository secret"
  3. Name: `NUGET_API_KEY`
  4. Value: Paste your NuGet API key
  5. Click "Add secret"

### 2. npm Token
- **Secret Name:** `NPM_TOKEN`
- **How to Get:**
  1. Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
  2. Click "Generate New Token"
  3. Select "Automation" token type
  4. Copy the token (starts with `npm_`)
- **Add to GitHub:**
  1. Go to: `https://github.com/JavianDev/Brevit/settings/secrets/actions`
  2. Click "New repository secret"
  3. Name: `NPM_TOKEN`
  4. Value: Paste your npm token
  5. Click "Add secret"

### 3. PyPI API Token
- **Secret Name:** `PYPI_API_TOKEN`
- **How to Get:**
  1. Go to https://pypi.org/manage/account/token/
  2. Click "Add API token"
  3. Set token name (e.g., "Brevit Deployment")
  4. Set scope: "Entire account" or specific project
  5. Copy the token (starts with `pypi-`)
- **Add to GitHub:**
  1. Go to: `https://github.com/JavianDev/Brevit/settings/secrets/actions`
  2. Click "New repository secret"
  3. Name: `PYPI_API_TOKEN`
  4. Value: Paste your PyPI token
  5. Click "Add secret"

## Deployment Workflows

### Automatic Deployment on Release

All three deployment workflows trigger automatically when you create a GitHub Release:

1. **Create a Release:**
   - Go to: `https://github.com/JavianDev/Brevit/releases/new`
   - Tag: `v0.1.0` (or your version)
   - Title: `Brevit v0.1.0`
   - Description: Release notes
   - Click "Publish release"

2. **Workflows Will Automatically:**
   - Build and test all projects
   - Package each library
   - Deploy to NuGet, npm, and PyPI

### Manual Deployment

You can also trigger deployment manually:

1. Go to: `https://github.com/JavianDev/Brevit/actions`
2. Select the workflow (e.g., "Deploy Brevit.NET to NuGet")
3. Click "Run workflow"
4. Select branch and click "Run workflow"

## Workflow Files

### `.github/workflows/deploy-dotnet.yml`
- **Triggers:** Release published or manual dispatch
- **Steps:**
  1. Restore dependencies
  2. Build and test
  3. Pack NuGet package
  4. Publish to NuGet using `NUGET_API_KEY`

### `.github/workflows/deploy-javascript.yml`
- **Triggers:** Release published or manual dispatch
- **Steps:**
  1. Install dependencies
  2. Run tests
  3. Publish to npm using `NPM_TOKEN`

### `.github/workflows/deploy-python.yml`
- **Triggers:** Release published or manual dispatch
- **Steps:**
  1. Install dependencies
  2. Run tests
  3. Build package
  4. Publish to PyPI using `PYPI_API_TOKEN`

## Verification

After deployment, verify packages are available:

- **NuGet:** https://www.nuget.org/packages/Brevit.NET
- **npm:** https://www.npmjs.com/package/brevit-js
- **PyPI:** https://pypi.org/project/brevit-py/

## Troubleshooting

### Workflow Fails with "Secret not found"
- Verify secret name matches exactly (case-sensitive)
- Check secret is added to the correct repository
- Ensure secret hasn't expired

### NuGet Push Fails
- Verify API key has correct permissions
- Check API key hasn't expired
- Ensure package version doesn't already exist

### npm Publish Fails
- Verify token has publish permissions
- Check if package name is already taken
- Ensure you're logged in: `npm whoami`

### PyPI Upload Fails
- Verify token hasn't expired
- Check package name availability
- Ensure token has correct scope

## Security Best Practices

1. **Never commit secrets** to the repository
2. **Use repository secrets** (not environment secrets) for single-repo deployments
3. **Rotate secrets regularly** (every 90 days recommended)
4. **Use least privilege** - only grant necessary permissions
5. **Monitor workflow runs** for unauthorized access

## Next Steps

1. ✅ Add all three secrets to GitHub
2. ✅ Create a GitHub Release (v0.1.0)
3. ✅ Monitor deployment workflows
4. ✅ Verify packages are published
5. ✅ Update installation instructions in READMEs

---

**Support:** support@javianpicardo.com

