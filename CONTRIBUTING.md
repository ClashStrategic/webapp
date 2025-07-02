# Contributing to Clash Strategic™

We are thrilled you're interested in contributing to Clash Strategic™! Your contributions, big or small, are highly valued and help us improve the project for everyone. This guide will help you get started and navigate our contribution process.

## Table of Contents

- [Development Setup](#development-setup)
  - [Prerequisites](#prerequisites)
  - [Local Setup](#local-setup)
- [Technology Stack](#-technology-stack)
  - [Frontend](#frontend)
  - [Backend (Clash Strategic API)](#backend-clash-strategic-api)
  - [Development Tools](#development-tools)
  - [Build & Deployment](#build--deployment)
- [Project Structure](#project-structure)
- [Testing](#testing)
  - [Run Unit Tests](#run-unit-tests)
  - [Run E2E Tests](#run-e2e-tests)
  - [Code Coverage](#code-coverage)
- [Quick Start: Your First Contribution](#quick-start-your-first-contribution)
- [What Can You Contribute?](#what-can-you-contribute)
  - [Bug Fixes](#-bug-fixes)
  - [New Features](#-new-features)
  - [Documentation](#-documentation)
  - [Testing](#-testing)
- [Code Guidelines](#code-guidelines)
  - [JavaScript](#javascript)
  - [CSS](#css)
- [Commit Messages](#commit-messages)
  - [Commit Format Requirements](#commit-format-requirements)
  - [Examples](#examples)
  - [Why This Matters](#why-this-matters)
  - [Learn More](#learn-more)
- [Pull Request Process](#pull-request-process)
  - [PR Template](#pr-template)
- [Getting Help](#getting-help)
- [Code of Conduct](#code-of-conduct)
- [Recognition](#recognition)
- [First Time Contributors](#first-time-contributors)

---

## Development Setup

This section guides you through setting up your local development environment.

### Prerequisites

Before you begin, ensure you have the following installed:

- **XAMPP** (Apache + PHP) - [Download here](https://www.apachefriends.org/)
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)

### Local Setup

Follow these steps to get the project running on your machine:

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/ClashStrategic/webapp.git clash-strategic-webapp
    cd clash-strategic-webapp
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **XAMPP Setup**

    1.  **Start XAMPP** and enable Apache services.
    2.  **Copy the project** to your XAMPP `htdocs` directory:

        ```bash
        # Windows
        cp -r . C:/xampp/htdocs/clash-strategic-webapp/

        # macOS/Linux
        cp -r . /Applications/XAMPP/htdocs/clash-strategic-webapp/
        ```

4.  **Access the Application**

    Open your browser and navigate to:

    ```
    http://localhost/clash-strategic-webapp
    ```

## 🛠️ Technology Stack

Clash Strategic™ is built using the following technologies:

### Frontend

-   **JavaScript ES6+** - Modern JavaScript with modules for robust functionality.
-   **HTML5 & CSS3** - Semantic markup and responsive design for a great user experience.
-   **jQuery** - Used for efficient DOM manipulation and AJAX requests.
-   **Progressive Web App (PWA)** - Features like service worker, manifest, and offline support for enhanced reliability.

### Backend (Clash Strategic API)

The Clash Strategic API is a separate server that the web application interacts with to retrieve and store information.

-   **RESTful API** - A dedicated backend API handles all data retrieval and storage. [API Documentation (pending)](https://github.com/ClashStrategic/webapp/blob/main/API_ENDPOINTS.md)

### Development Tools

-   **Jest** - Our primary unit testing framework.
-   **Playwright** - Used for comprehensive end-to-end testing.
-   **ESLint** - Ensures code quality and consistency through linting.
-   **Babel** - Transpiles JavaScript code for broader browser compatibility.
-   **Semantic Release** - Automates versioning and release management.

### Build & Deployment

-   **Service Worker** - Manages caching and offline functionality for the PWA.
-   **XAMPP** - Serves as our local development environment.

## Project Structure

Understanding the project's directory structure will help you navigate the codebase:

```
clash-strategic-webapp/
├── src/                    # Source code
│   ├── css/               # Stylesheets
│   │   ├── base/         # Base styles (resets, typography, variables)
│   │   ├── objects/      # Component-specific styles (buttons, cards, forms)
│   │   └── skins/        # Theme-specific styles (color schemes, visual variations)
│   ├── js/               # JavaScript modules
│   │   ├── events/       # Event handlers (click, submit, other interactions)
│   │   ├── models/       # Data models (User, Deck, Card, etc.)
│   │   ├── utilsjs/      # Utility functions (API calls, configurations, cookies)
│   │   └── main.js       # Main application entry point
│   └── templates/        # HTML templates (views for different sections of the app)
├── static/               # Static assets
│   ├── media/           # Images, icons, audio files
│   └── fonts/           # Custom font files
├── tests/               # Test files
│   └── unit/           # Unit tests for individual functions/components
|   └── e2e/            # End-to-end tests for full user flows
├── sw.js               # Service worker script for PWA features
├── manifest.json       # PWA manifest file
├── index.html         # Main entry point for the application
├── home.html          # Primary application view
└── package.json       # Project dependencies and npm scripts
```

## Testing

We maintain a strong focus on testing to ensure code quality and stability.

### Run Unit Tests

To run all unit tests:

```bash
npm test
```

### Run E2E Tests

To execute end-to-end tests:

```bash
npx playwright test
```

### Code Coverage

To generate a code coverage report:

```bash
npm test -- --coverage
```

## Quick Start: Your First Contribution

Ready to make your first contribution? Follow these simple steps:

1.  **Fork the Repository**: Click the "Fork" button on the top right of our GitHub repository.
2.  **Clone Your Fork**:
    ```bash
    git clone https://github.com/YOUR_USERNAME/webapp.git
    cd webapp
    ```
3.  **Create a New Branch**:
    ```bash
    git checkout -b feature/your-feature-name
    ```
    (Replace `your-feature-name` with a descriptive name for your changes, e.g., `fix/login-bug` or `feat/dark-mode`).
4.  **Make Your Changes**: Implement your bug fix, new feature, or documentation improvement.
5.  **Test Your Changes**: Ensure your changes work as expected and don't introduce new issues. Run relevant tests (see [Testing](#testing)).
6.  **Commit Your Changes**:
    ```bash
    git add .
    git commit -m "type(scope): your descriptive commit message"
    ```
    (Refer to [Commit Messages](#commit-messages) for proper formatting).
7.  **Push to Your Fork**:
    ```bash
    git push origin feature/your-feature-name
    ```
8.  **Open a Pull Request**: Go to our [GitHub repository](https://github.com/ClashStrategic/webapp) and you'll see a prompt to open a new Pull Request from your branch.

## What Can You Contribute?

There are many ways to contribute to Clash Strategic™:

### 🐛 Bug Fixes

Found a bug? Help us squash it!

-   Check our [Issues page](https://github.com/ClashStrategic/webapp/issues) for existing bug reports.
-   If it's a new bug, please open a new issue with clear steps to reproduce.
-   Reproduce the issue locally using the [Development Setup](#development-setup).
-   Implement the fix and ensure it's thoroughly tested.
-   Submit a Pull Request with a clear description of the bug and your solution.

### ✨ New Features

Have an idea for an enhancement? We'd love to hear it!

-   **Deck analysis improvements**: Enhance how users analyze their decks.
-   **New card statistics**: Add more insightful data for cards.
-   **UI/UX enhancements**: Improve the overall user interface and experience.
-   **Performance optimizations**: Make the application faster and more efficient.
-   **Mobile responsiveness**: Ensure a seamless experience across all devices.

### 📚 Documentation

Good documentation is crucial!

-   Improve existing `README.md` files.
-   Add clear and concise code comments.
-   Create user guides or tutorials.
-   Contribute to the API documentation (currently pending).

### 🧪 Testing

Help us ensure the application is robust and reliable!

-   Add new unit tests using Jest.
-   Add new end-to-end tests using Playwright.
-   Improve existing test coverage.
-   Test the application on different devices and browsers.

## Code Guidelines

To maintain consistency and quality, please adhere to our coding standards:

### JavaScript

-   Use **ES6+ features** where appropriate.
-   Follow the **existing code style** within the project.
-   Add **JSDoc comments** for functions, classes, and complex logic.
-   Use **meaningful and descriptive variable names**.

### CSS

-   Follow the **BEM (Block-Element-Modifier) methodology** for clear, scalable, and maintainable stylesheets.
-   Utilize **CSS custom properties (variables)** for consistent theming.
-   Prioritize **responsive design** to ensure compatibility across devices.
-   Keep styles **modular and organized** within their respective `base`, `objects`, and `skins` directories.

## Commit Messages

**⚠️ IMPORTANT**: This project uses **Semantic Release** for automated versioning and releases. This means your commit messages directly impact our release process and changelog generation.

### Commit Format Requirements

Your commits **MUST** follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

-   **`type`**: Must be one of the following:
    -   `feat`: A new feature.
    -   `fix`: A bug fix.
    -   `docs`: Documentation only changes.
    -   `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semicolons, etc.).
    -   `refactor`: A code change that neither fixes a bug nor adds a feature.
    -   `perf`: A code change that improves performance.
    -   `test`: Adding missing tests or correcting existing tests.
    -   `build`: Changes that affect the build system or external dependencies (e.g., npm, webpack, gulp).
    -   `ci`: Changes to our CI configuration files and scripts (e.g., Travis, Circle, BrowserStack, SauceLabs).
    -   `chore`: Other changes that don't modify src or test files.
    -   `revert`: Reverts a previous commit.
-   **`scope` (optional)**: A noun describing the section of the codebase affected (e.g., `api`, `deck`, `ui`, `docs`).
-   **`description`**: A brief, imperative tense description of the change (e.g., "add new feature", not "added new feature").

### Examples

-   `feat: add new deck analysis feature`
-   `fix: resolve card loading issue`
-   `docs: update installation guide`
-   `test: add deck builder tests`
-   `feat(deck): add elixir cost calculator`
-   `fix(api): handle timeout errors properly`

### Why This Matters

-   **Automatic Releases**: Proper commit types (`feat`, `fix`, `feat!`, `fix!`) trigger automatic version bumps (minor, patch, major).
-   **Changelog Generation**: Automatically creates clean and informative release notes.
-   **Version Control**: Helps us understand the impact of each commit on the project's version.
-   **Breaking Changes**: Use `feat!` or `fix!` (with an exclamation mark) in the type/scope to indicate a breaking change, which will trigger a major version bump.

### Learn More

For detailed information about our semantic release setup, please refer to [README-semantic-release.md](README-semantic-release.md).

## Pull Request Process

Once you've made your changes and committed them, it's time to open a Pull Request (PR).

1.  **Update Documentation**: If your changes affect functionality, update any relevant documentation.
2.  **Add Tests**: For new features or bug fixes, ensure you've added appropriate unit and/or E2E tests.
3.  **Test Locally**: Always run all relevant tests locally to ensure everything works as expected.
4.  **Clear Description**: Provide a clear and concise description of your changes in the PR. Explain *what* you did and *why*.
5.  **Link Issues**: Reference any related issues (e.g., "Fixes #123", "Closes #456").

### PR Template

We suggest using a simple structure for your Pull Requests:

```markdown
### Description

A brief summary of the changes in this PR.

### Related Issues

Link any relevant issues (e.g., "Fixes #123", "Closes #456").
```

## Getting Help

Don't hesitate to reach out if you have questions or need assistance!

-   **Questions**: Open a [Discussion](https://github.com/ClashStrategic/webapp/discussions) on our GitHub repository.
-   **Bugs**: If you encounter a bug, please create an [Issue](https://github.com/ClashStrategic/webapp/issues).
-   **Ideas**: Share your ideas and suggestions by starting a [Discussion](https://github.com/ClashStrategic/webapp/discussions).

## Code of Conduct

To ensure a welcoming and inclusive community, we ask all contributors to adhere to our Code of Conduct:

-   Be respectful and inclusive of all community members.
-   Help others learn and grow.
-   Focus on constructive feedback and collaboration.
-   Keep discussions on topic and relevant to the project.

## Recognition

We appreciate all contributions! Contributors will be:

-   Listed in the `README.md` file.
-   Mentioned in release notes for their contributions.
-   Invited to join the core team for regular and significant contributors.

## First Time Contributors

If you're new to open source or this project, look for issues labeled:

-   `good first issue`
-   `help wanted`
-   `documentation`

These are excellent starting points to get familiar with the codebase and contribution process!

---

Thank you for contributing to the Clash Strategic community! 🎮✨
