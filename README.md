# 🧮 Multiplication Table Trainer

A modern, interactive web application built with React, TypeScript, and Tailwind CSS that helps students practice multiplication tables and improve their mental math speed.

## ✨ Features

### Core Functionality

- **4 Difficulty Levels**: Unlimited, 20s, 15s, and 10s time limits per problem
- **2 Game Modes**: Manual input and multiple choice options
- **Random Problem Generation**: Creates multiplication problems using factors from 2-10
- **Smart Scoring System**: Calculates scores based on both accuracy and speed
- **Real-time Progress Tracking**: Shows current progress, correct answers, and elapsed time

### User Experience

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Beautiful animations and smooth transitions using Tailwind CSS
- **Keyboard Support**: Press Enter to submit answers
- **Auto-focus**: Input field automatically focused for seamless experience
- **Visual Feedback**: Immediate visual responses to user actions

## 🎯 How It Works

1. **Start Screen**: Choose difficulty level and game mode with responsive grid layout
2. **Game Session**: 10 random multiplication problems based on selected difficulty
3. **Real-time Feedback**: Progress bar, timer, and accuracy tracking
4. **Results Screen**: Final score, performance breakdown, and improvement tips

## 🏆 Difficulty Levels

- **🟢 Unlimited**: No time pressure - perfect for learning
- **🟡 Easy (20s)**: Moderate time limit for building confidence
- **🟠 Medium (15s)**: Standard challenge for regular practice
- **� Hard (10s)**: Quick thinking required for advanced users

## 🎮 Game Modes

- **✍️ Input Mode**: Type your answer using the number input
- **🎯 Multiple Choice**: Select from 4 possible answers

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd multiplication-trainer
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run format       # Format code with Prettier
npm run lint         # Run ESLint checks
npm run type-check   # Run TypeScript type checking

# End-to-End Testing
npm run test:e2e        # Run all E2E tests
npm run test:e2e:ui     # Run tests with Playwright UI
npm run test:e2e:headed # Run tests in headed mode
npm run test:e2e:debug  # Debug tests with Playwright
npm run test:e2e:report # View test report
```

### Code Quality Tools

This project uses industry-standard tools to enforce code quality:

#### Prettier

- **Configuration**: `.prettierrc` with consistent formatting rules
- **Auto-formatting**: Formats code on save in supported IDEs
- **Pre-commit**: Automatically formats staged files

#### ESLint

- **Modern Config**: ESLint 9 with flat configuration format
- **TypeScript Support**: Full integration with TypeScript
- **React Rules**: Specialized rules for React development
- **Auto-fix**: Many issues can be automatically resolved

#### Husky + lint-staged

- **Pre-commit Hooks**: Runs quality checks before each commit
- **Optimized**: Only processes staged files for faster execution
- **Quality Gate**: Prevents commits with formatting or linting issues

#### IDE Integration

- **VSCode**: Auto-formatting on save, extension recommendations
- **IntelliJ IDEA**: Prettier integration and code style settings
- **Consistent Experience**: Same formatting across all development environments

### End-to-End Testing

Comprehensive E2E testing suite built with Playwright:

#### Test Framework Features

- **Cross-browser Testing**: Chrome, Firefox, Safari, and mobile browsers
- **Page Object Model**: Maintainable test architecture with reusable components
- **Parallel Execution**: Fast test runs with parallel test execution
- **Rich Reporting**: HTML reports with screenshots, videos, and traces
- **CI/CD Ready**: Automated testing in GitHub Actions

#### Test Coverage

- **Complete Game Flows**: Start screen → Game session → Results screen
- **Difficulty Levels**: All 4 difficulty modes with timer validation
- **Game Modes**: Both input and multiple choice functionality
- **Scoring System**: Accuracy calculations and performance rankings
- **User Interactions**: Keyboard shortcuts, form validation, responsive design

#### Test Structure

```
tests/
├── pages/              # Page Object Models
│   ├── StartScreenPage.ts    # Start screen interactions
│   ├── GameScreenPage.ts     # Game screen interactions
│   └── ResultsScreenPage.ts  # Results screen interactions
├── utils/              # Test utilities
│   └── TestUtils.ts          # Helper functions and common operations
├── core-game-flow.spec.ts    # Complete game workflow tests
├── difficulty-levels.spec.ts # Timer and difficulty validation
├── game-modes.spec.ts        # Input vs multiple choice testing
└── scoring-validation.spec.ts # Score calculation verification
```

### Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite with fast HMR
- **Styling**: Tailwind CSS v4 with custom animations
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Type Safety**: Full TypeScript implementation
- **Code Quality**: ESLint 9, Prettier, Husky, lint-staged

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── StartScreen.tsx  # Welcome screen with difficulty/mode selection
│   ├── GameScreen.tsx   # Main game interface with timer
│   └── ResultsScreen.tsx # Score and results display
├── hooks/               # Custom React hooks
│   └── useGame.ts       # Game state management with difficulty logic
├── types/               # TypeScript type definitions
│   └── game.ts          # Game interfaces including difficulty levels
├── utils/               # Utility functions
│   └── gameLogic.ts     # Core game logic, scoring, and difficulty handling
└── index.css            # Global styles and Tailwind config

.vscode/                 # VSCode workspace settings
├── settings.json        # Auto-formatting and editor config
└── extensions.json      # Recommended extensions

.idea/                   # IntelliJ IDEA settings
├── codeStyles/          # Code style configurations
└── prettier.xml         # Prettier integration settings
```

## 🎮 Game Features

### Problem Generation

- Random multiplication problems from 2×2 to 10×10
- Ensures variety and appropriate difficulty progression
- No repeated problems in a single session
- Multiple choice options with smart distractor generation

### Performance Tracking

- Real-time timer display with difficulty-based limits
- Progress bar showing completion percentage
- Live accuracy tracking
- Motivational messages based on performance

### Scoring System

Your score is calculated based on:

- **Accuracy**: Correct answers out of total problems
- **Speed**: Time bonus for quick responses
- **Difficulty Multiplier**: Higher scores for harder difficulty levels
- **Performance Ranks**: From "Math Genius!" to "Keep Practicing!"

## 🎨 Design Highlights

- **Modern Gradient Backgrounds**: Beautiful blue-to-indigo gradients
- **Smooth Animations**: CSS animations for better user engagement
- **Responsive Grid Layout**: 2x2 grid for difficulty and mode selection
- **Interactive Elements**: Hover effects and button animations
- **Color-coded Feedback**: Different colors for various performance metrics
- **Mobile-first Design**: Optimized for touch interactions

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes following the established code style
4. Run quality checks: `npm run lint && npm run format && npm run type-check`
5. Commit your changes (pre-commit hooks will run automatically)
6. Push to your branch and create a Pull Request

### Code Style Guidelines

- Use TypeScript for all new code
- Follow the established Prettier configuration
- Ensure ESLint passes without warnings
- Add appropriate type definitions
- Write clear, descriptive commit messages

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
