# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

# 🧮 Multiplication Table Trainer

A modern, interactive web application built with React, TypeScript, and Tailwind CSS that helps students practice multiplication tables and improve their mental math speed.

## ✨ Features

- **Random Problem Generation**: Creates multiplication problems using factors from 2-10
- **Smart Scoring System**: Calculates scores based on both accuracy and speed
- **Real-time Progress Tracking**: Shows current progress, correct answers, and elapsed time
- **Motivational Feedback**: Provides encouraging messages and performance ranks
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Beautiful animations and smooth transitions using Tailwind CSS

## 🎯 How It Works

1. **Start Screen**: Instructions and motivation to begin training
2. **Game Session**: 10 random multiplication problems (2×2 to 10×10)
3. **Real-time Feedback**: Progress bar, timer, and accuracy tracking
4. **Results Screen**: Final score, performance breakdown, and improvement tips

## 🏆 Scoring System

Your score is calculated based on:
- **Accuracy**: Correct answers out of total problems
- **Speed**: Time bonus for quick responses (loses 2 points per second)
- **Performance Ranks**:
  - 🏆 Math Genius! (1200+ points)
  - 🌟 Excellent! (1000+ points)
  - 👍 Great Job! (800+ points)
  - 😊 Good Work! (600+ points)
  - 📚 Keep Practicing! (400+ points)
  - 💪 You Can Do Better! (below 400 points)

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

### Building for Production

```bash
npm run build
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom animations
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Type Safety**: Full TypeScript implementation

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── StartScreen.tsx  # Welcome screen with instructions
│   ├── GameScreen.tsx   # Main game interface
│   └── ResultsScreen.tsx # Score and results display
├── hooks/               # Custom React hooks
│   └── useGame.ts       # Game state management
├── types/               # TypeScript type definitions
│   └── game.ts          # Game-related interfaces
├── utils/               # Utility functions
│   └── gameLogic.ts     # Core game logic and scoring
└── styles/
    └── index.css        # Global styles and Tailwind config
```

## 🎮 Game Features

### Problem Generation
- Random multiplication problems from 2×2 to 10×10
- Ensures variety and appropriate difficulty progression
- No repeated problems in a single session

### User Experience
- **Keyboard Support**: Press Enter to submit answers
- **Input Validation**: Only accepts numeric input
- **Auto-focus**: Input field automatically focused for seamless experience
- **Visual Feedback**: Immediate visual responses to user actions

### Performance Tracking
- Real-time timer display
- Progress bar showing completion percentage
- Live accuracy tracking
- Motivational messages based on performance

## 🎨 Design Highlights

- **Modern Gradient Backgrounds**: Beautiful blue-to-indigo gradients
- **Smooth Animations**: CSS animations for better user engagement
- **Responsive Cards**: Clean, card-based layout that works on all devices
- **Interactive Elements**: Hover effects and button animations
- **Color-coded Feedback**: Different colors for various performance metrics

## 🚀 Future Enhancements

- **Difficulty Levels**: Easy (2-5), Medium (2-8), Hard (2-12)
- **Custom Settings**: User-defined number of problems and time limits
- **Progress History**: Track improvement over time
- **Achievements System**: Badges for milestones and streaks
- **Sound Effects**: Audio feedback for correct/incorrect answers
- **Multiplayer Mode**: Compete with friends in real-time

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
