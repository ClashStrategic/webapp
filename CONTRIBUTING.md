# Contributing to Clash Strategic™

Thank you for your interest in contributing to Clash Strategic™! We welcome contributions from developers of all skill levels.

## Development Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **XAMPP** (Apache + PHP) - [Download here](https://www.apachefriends.org/)
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)

### Local Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/ClashStrategic/webapp.git clash-strategic-webapp
   cd clash-strategic-webapp
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **XAMPP Setup**

   1. **Start XAMPP** and enable Apache services
   2. **Copy the project** to your XAMPP htdocs directory:

      ```bash
      # Windows
      cp -r . C:/xampp/htdocs/clash-strategic-webapp/

      # macOS/Linux
      cp -r . /Applications/XAMPP/htdocs/clash-strategic-webapp/
      ```

4. **Access the Application**

   Open your browser and navigate to:

   ```
   http://localhost/clash-strategic-webapp
   ```

## 🛠️ Technology Stack

### Frontend

- **JavaScript ES6+** - Modern JavaScript with modules
- **HTML5 & CSS3** - Semantic markup and responsive design
- **jQuery** - DOM manipulation and AJAX requests
- **Progressive Web App** - Service worker, manifest, offline support

### Backend (Clash Strategic API)
The clash strategic api is the server that is requested with webapp to retrieve and store information.

- **RESTful API** - A dedicated backend API handles all data retrieval and storage. [API Documentation (pending)](https://github.com/ClashStrategic/webapp/blob/main/API_ENDPOINTS.md)

### Development Tools

- **Jest** - Unit testing framework
- **Playwright** - End-to-end testing
- **ESLint** - Code linting and quality
- **Babel** - JavaScript transpilation
- **Semantic Release** - Automated versioning and releases

### Build & Deployment

- **Service Worker** - Caching and offline functionality
- **XAMPP** - Local development environment

## Project Structure

```
clash-strategic-webapp/
├── src/                    # Source code
│   ├── css/               # Stylesheets
│   │   ├── base/         # Base styles
│   │   ├── objects/      # Component styles
│   │   └── skins/        # Theme styles
│   ├── js/               # JavaScript modules
│   │   ├── events/       # Event handlers
│   │   ├── models/       # Data models
│   │   ├── utilsjs/      # Utility functions
│   │   └── main.js       # Main application entry
│   └── templates/        # HTML templates
├── static/               # Static assets
│   ├── media/           # Images, icons, audio
│   └── fonts/           # Font files
├── tests/               # Test files
│   └── unit/           # Unit tests
|   └── e2e/            # End-to-end tests
├── sw.js               # Service worker
├── manifest.json       # PWA manifest
├── index.html         # Application entry point
├── home.html          # Main application view
└── package.json       # Dependencies and scripts
```

## Testing

### Run Unit Tests

```bash
npm test
```

### Run E2E Tests

```bash
npx playwright test
```

### Code Coverage

```bash
npm test -- --coverage
```

## Quick Start

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/webapp.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit: `git commit -m "Add your feature"`
7. Push: `git push origin feature/your-feature-name`
8. Open a Pull Request

## What Can You Contribute?

### 🐛 Bug Fixes

- Check [Issues](https://github.com/ClashStrategic/webapp/issues) for bugs
- Reproduce the issue locally
- Fix and test the solution
- Submit a PR with clear description

### ✨ New Features

- Deck analysis improvements
- New card statistics
- UI/UX enhancements
- Performance optimizations
- Mobile responsiveness

### 📚 Documentation

- Improve README
- Add code comments
- Create user guides
- API documentation

### 🧪 Testing

- Add unit tests (Jest)
- Add E2E tests (Playwright)
- Improve test coverage
- Test on different devices

## Code Guidelines

### JavaScript

- Use ES6+ features
- Follow existing code style
- Add JSDoc comments for functions
- Use meaningful variable names

### CSS

- Follow BEM methodology
- Use CSS custom properties
- Maintain responsive design
- Keep styles modular

## Commit Messages

**⚠️ IMPORTANT**: This project uses **Semantic Release** for automated versioning and releases.

### Commit Format Requirements

Your commits **MUST** follow conventional commit format:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Examples

- `feat: add new deck analysis feature`
- `fix: resolve card loading issue`
- `docs: update installation guide`
- `test: add deck builder tests`
- `feat(deck): add elixir cost calculator`
- `fix(api): handle timeout errors properly`

### Why This Matters

- **Automatic Releases**: Proper commits trigger automatic version bumps
- **Changelog Generation**: Creates beautiful release notes
- **Version Control**: `feat` = minor version, `fix` = patch version
- **Breaking Changes**: `feat!` or `fix!` = major version

### Learn More

For detailed information about our semantic release setup, see [README-semantic-release.md](README-semantic-release.md)

## Pull Request Process

1. **Update Documentation** - If you change functionality
2. **Add Tests** - For new features or bug fixes
3. **Test Locally** - Ensure everything works
4. **Clear Description** - Explain what and why
5. **Link Issues** - Reference related issues

### PR Template

We suggest using a simple structure for your Pull Requests.

```markdown
### Description

A brief summary of the changes in this PR.

### Related Issues

Link any relevant issues (e.g., "Fixes #123", "Closes #456").
```

## Getting Help

- **Questions**: Open a [Discussion](https://github.com/ClashStrategic/webapp/discussions)
- **Bugs**: Create an [Issue](https://github.com/ClashStrategic/webapp/issues)
- **Ideas**: Start a [Discussion](https://github.com/ClashStrategic/webapp/discussions)

## Code of Conduct

- Be respectful and inclusive
- Help others learn and grow
- Focus on constructive feedback
- Keep discussions on topic

## Recognition

Contributors will be:

- Listed in the README
- Mentioned in release notes
- Invited to join the core team (for regular contributors)

## First Time Contributors

Look for issues labeled:

- `good first issue`
- `help wanted`
- `documentation`

These are perfect for getting started!

---

Thank you for contributing to the Clash Strategic community! 🎮✨
