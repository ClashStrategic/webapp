# Clash Strategic™ Web Application

<div align="center">
  <img src="./static/media/styles/logo/logo_banner.webp" alt="Clash Strategic Logo" width="400">
  
  [![Version](https://img.shields.io/badge/version-1.2.1-1B263B.svg)](https://github.com/ClashStrategic/webapp/releases)
  [![License](https://img.shields.io/badge/license-Apache%202.0-36CFC9.svg)](https://github.com/ClashStrategic/webapp/blob/main/LICENSE)
  [![PWA](https://img.shields.io/badge/PWA-In%20Development-FFC107.svg)](https://web.dev/progressive-web-apps/)
  [![Semantic Release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-FF5722.svg)](https://github.com/semantic-release/semantic-release)
  [![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-A8E6CF.svg)](https://github.com/ClashStrategic/webapp/blob/main/CONTRIBUTING.md)
</div>

## 📑 Table of Contents

- [About](#-about)
- [Key Features](#-key-features)
- [Live Demo](#-live-demo)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)
- [Support & Contact](#-support--contact)
- [Acknowledgments](#-acknowledgments)

## 📱 About

**Clash Strategic™** is a comprehensive Progressive Web Application (PWA) designed for the Clash Royale community. It provides strategic tools, deck building capabilities, card analysis, and community features to help players improve their gameplay and connect with other strategists.

### 🌟 Key Features

- **🏗️ Advanced Deck Builder**: Create, analyze, and optimize your Clash Royale decks
- **📊 Deck Analysis**: Get detailed statistics including elixir cost, cycle analysis, and strategic insights
- **🃏 Card Management**: Browse and manage all Clash Royale cards with detailed statistics
- **👥 Community Hub**: Connect with other players through chat and publications
- **📱 PWA Support**: Install as a native app on mobile and desktop devices
- **🔄 Real-time Updates**: Automatic content updates and notifications
- **🎮 Game Integration**: Direct deck copying to Clash Royale
- **🔐 Secure Authentication**: Google OAuth and guest access support
- **🌐 Offline Support**: Service worker enables offline functionality
- **📈 Performance Optimized**: Fast loading with intelligent caching

## 🚀 Live Demo

Visit the live application: [https://clashstrategic.great-site.net](https://clashstrategic.great-site.net)

## 🛠️ Technology Stack

### Frontend

- **JavaScript ES6+** - Modern JavaScript with modules
- **HTML5 & CSS3** - Semantic markup and responsive design
- **jQuery** - DOM manipulation and AJAX requests
- **Progressive Web App** - Service worker, manifest, offline support

### Backend

- **PHP** - Server-side logic and API endpoints
- **RESTful API** - Clean API architecture

### Development Tools

- **Jest** - Unit testing framework
- **Playwright** - End-to-end testing
- **ESLint** - Code linting and quality
- **Babel** - JavaScript transpilation
- **Semantic Release** - Automated versioning and releases

### Build & Deployment

- **Service Worker** - Caching and offline functionality
- **Webpack/Rollup** - Module bundling
- **XAMPP** - Local development environment

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **XAMPP** (Apache + PHP + MySQL) - [Download here](https://www.apachefriends.org/)
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ClashStrategic/webapp.git clash-strategic-webapp
cd clash-strategic-webapp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. XAMPP Setup

1. **Start XAMPP** and enable Apache and MySQL services
2. **Copy the project** to your XAMPP htdocs directory:

   ```bash
   # Windows
   cp -r . C:/xampp/htdocs/clash-strategic-webapp/

   # macOS/Linux
   cp -r . /Applications/XAMPP/htdocs/clash-strategic-webapp/
   ```

### 4. Database Configuration

1. Open **phpMyAdmin** (http://localhost/phpmyadmin)
2. Create a new database for the application
3. Configure your database connection in the API configuration files

### 5. Environment Configuration

The application automatically detects the environment:

- **Local**: `http://localhost/clash-strategic-webapp`
- **Production**: `https://clashstrategic.great-site.net`

### 6. Access the Application

Open your browser and navigate to:

```
http://localhost/clash-strategic-webapp
```

## 🎮 Usage

### Getting Started

1. **First Visit**: The application will install the service worker and cache resources
2. **Create Account**: Sign up with Google or continue as a guest
3. **Explore Features**: Navigate through different sections using the menu

### Deck Building

1. **Access Cards Section**: Click on the cards menu
2. **Select Cards**: Choose 8 cards and 1 tower card for your deck
3. **Analyze Deck**: Get instant analysis with elixir cost and cycle information
4. **Save Deck**: Store your deck for future reference
5. **Copy to Game**: Export your deck directly to Clash Royale

### Community Features

- **Publications**: Share strategies and deck ideas
- **Chat**: Communicate with other community members
- **User Profiles**: Customize your profile and track statistics

## 📁 Project Structure

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

## 🧪 Testing

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

## 🤝 Contributing

We welcome contributions from developers of all skill levels!

### Quick Start

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a Pull Request

### What You Can Contribute

- 🐛 Bug fixes
- ✨ New features
- 📚 Documentation
- 🧪 Tests
- 🎨 UI improvements

For detailed guidelines, setup instructions, and development tips, see our [**Contributing Guide**](CONTRIBUTING.md).

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/ClashStrategic/webapp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ClashStrategic/webapp/discussions)
- **Website**: [https://clashstrategic.great-site.net](https://clashstrategic.great-site.net)

## 🙏 Acknowledgments

- **Clash Royale** by Supercell for the amazing game
- **Community Contributors** who help improve the application
- **Open Source Libraries** that make this project possible

---

<div align="center">
  <p>💖 Thank you for being part of the Clash Strategic community</p>
  <p>
    <a href="#top">Back to Top ⬆️</a>
  </p>
</div>
