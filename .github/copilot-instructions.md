# 🧮 Multiplication Table Trainer

A React educational game application with TypeScript, featuring timer-based difficulty levels and comprehensive E2E testing.

## Architecture Overview

This is a **single-page game application** with three distinct screen states managed by the `useGame` hook:

### Core Architecture Pattern

- **State-driven UI**: Game state (`"start" | "playing" | "finished"`) determines which component renders
- **Centralized game logic**: `GameLogic` class handles all calculations, scoring, and problem generation
- **Hook-based state management**: `useGame` hook manages game sessions, timing, and user interactions
- **Component isolation**: Each screen is a separate component with no direct dependencies

### Key Files & Responsibilities

- `src/hooks/useGame.ts` - **Central state manager**: Session state, timing logic, answer submission with feedback pausing
- `src/utils/gameLogic.ts` - **Pure functions**: Problem generation, scoring algorithms, weighted random factors
- `src/types/game.ts` - **Type definitions**: GameSession, Problem, DifficultyLevel enums
- `src/utils/settingsStorage.ts` - **Persistence layer**: localStorage with validation and error handling

## Development Patterns

### Timing & Performance System

```typescript
// Critical: Pause timing during feedback to prevent score inflation
const beginPause = useCallback(() => {
  if (pauseStartAt === null) setPauseStartAt(Date.now());
}, [pauseStartAt]);
```

- **Time tracking**: Real game time excludes feedback animation periods
- **Difficulty levels**: Control time pressure via `getTimePerProblem()`
- **Performance calculation**: Base score (accuracy) + time bonus - 2pts/second

### Problem Generation Logic

```typescript
// Weighted factor generation reduces frequency of 10x tables
private static generateWeightedFactor(minFactor: number, maxFactor: number): number {
  // 10 appears 10% as often as other numbers (more realistic practice)
}
```

### React Hook Dependencies

- Always include ALL dependencies in `useCallback`/`useEffect` arrays
- Use functional state updates for complex state transitions
- Manage timing intervals carefully to prevent memory leaks

## Development Commands

### Core Development

- `npm run dev` - Start Vite dev server (http://localhost:5173)
- `npm run build` - TypeScript compilation + Vite build
- `npm run type-check` - TypeScript validation without emit

### Code Quality (Runs on pre-commit)

- `npm run lint` - ESLint 9 flat config + TypeScript rules
- `npm run format` - Prettier formatting
- **Pre-commit hooks**: Husky + lint-staged automatically format/lint staged files

### E2E Testing (Critical for game logic validation)

- `npm run test:e2e` - Full cross-browser test suite
- `npm run test:e2e:ui` - Playwright UI for debugging
- `npm run test:e2e:debug` - Step-through debugging mode

## Testing Architecture

### Page Object Model

```typescript
// tests/pages/GameScreenPage.ts - Encapsulates all game screen interactions
async getTimeLeft() {
  // Returns null for unlimited time modes, number for timed modes
}
```

### Test Categories

- **Core flows**: Complete game sessions (input/multiple-choice modes)
- **Timing validation**: Difficulty-specific timer behavior and scoring accuracy
- **Cross-browser**: Chrome, Firefox, Safari, mobile viewports
- **Performance validation**: Score calculations with pause-adjusted timing

### Critical Test Patterns

- Use Page Object methods for all interactions (no direct locators in tests)
- Validate timing accuracy by checking pause-adjusted scores
- Test both game modes (input vs multiple-choice) for feature parity

## Configuration Specifics

### ESLint 9 Flat Configuration

- Modern flat config format (not legacy .eslintrc)
- TypeScript + React rules with Prettier integration
- Custom rules: `no-console: "warn"` (allowed for localStorage debugging)

### Tailwind CSS v4

- Custom animations in `tailwind.config.js`: `fade-in`, `bounce-gentle`, `slide-up`
- Component-specific CSS classes: `.problem-display`, `.answer-input`, `.feedback-pop`
- Color system: Custom primary/success/warning color palettes

### TypeScript Configuration

- Strict mode enabled with multiple tsconfig files
- Path-based imports (no relative imports for utils/types)
- Build-time type checking separated from development

## Common Gotchas

1. **Timer Management**: Always pause timing during feedback animations to maintain accurate scoring
2. **State Dependencies**: Include all hook dependencies to prevent stale closures
3. **localStorage Edge Cases**: Use try/catch blocks and provide fallback defaults
4. **Test Timing**: Use `page.waitForTimeout()` carefully - prefer element state waiting
5. **Multiple Choice**: Choices array must be shuffled after generation for randomness
