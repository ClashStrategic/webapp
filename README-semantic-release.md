# Semantic Release Configuration

This project uses **semantic-release** to automate the versioning and release process. The configuration includes a custom plugin that automatically updates the service worker.

## Current Configuration

### Configured Plugins (in execution order):

1. **@semantic-release/commit-analyzer** - Analyzes commits to determine the release type
2. **@semantic-release/release-notes-generator** - Generates release notes
3. **@semantic-release/npm** - Updates `package.json` and `package-lock.json` (without publishing)
4. **@semantic-release/changelog** - Generates/updates CHANGELOG.md
5. **./update-sw-version.js** - **Custom plugin** that updates the service worker
6. **@semantic-release/git** - Commits file changes
7. **@semantic-release/github** - Creates the release on GitHub

## Custom Plugin: update-sw-version.js

### Functionality

The custom plugin `update-sw-version.js` automatically updates two constants in the `sw.js` file:

- **VERSION**: Updated with the new release version
- **DATETIME**: Updated with the current date and time in ISO format

### Affected Files

During a release, the following are automatically updated:

- `package.json` - New version
- `package-lock.json` - New version
- `sw.js` - New VERSION and DATETIME
- `CHANGELOG.md` - New release notes

### Example Changes in sw.js

**Before release:**
```javascript
const VERSION = '0.4.1';
const DATETIME = '2024-01-01T00:00:00.000Z';
```

**After release (e.g., v1.2.3):**
```javascript
const VERSION = '1.2.3';
const DATETIME = '2025-05-26T14:08:27.271Z';
```

## Usage

### Conventional Commits

For semantic-release to work correctly, use conventional commits:

```bash
# For patch release (0.4.1 → 0.4.2)
git commit -m "fix: fixes service worker cache issue"

# For minor release (0.4.1 → 0.5.0)
git commit -m "feat: adds new notification functionality"

# For major release (0.4.1 → 1.0.0)
git commit -m "feat!: completely changes API"
# or
git commit -m "feat: new API

BREAKING CHANGE: The old API is no longer compatible"
```

### Run Release

```bash
# Automatic release (in CI/CD)
npx semantic-release

# Dry-run release (for testing)
npx semantic-release --dry-run
```

## Testing

To test the custom plugin:

```bash
node test-sw-update.js
```

This script:
1. Simulates a release with a test version
2. Verifies that VERSION and DATETIME are updated correctly
3. Restores the original content

## CI/CD Configuration

Ensure the following environment variables are configured:

- `GITHUB_TOKEN` - GitHub token with write permissions
- `NPM_TOKEN` - npm token (if planning to publish)

## Troubleshooting

### Plugin cannot find sw.js
- Verify that the `sw.js` file exists in the project root
- Verify that it contains the `VERSION` and `DATETIME` constants

### Changes are not committed
- Verify that `sw.js` is included in the `assets` of the `@semantic-release/git` plugin
- Verify that there are no errors in the custom plugin

### Service worker does not update in the browser
- The service worker should automatically detect the new version
- Check browser logs to see if the new version is being installed
- DATETIME helps identify when the current version was compiled
