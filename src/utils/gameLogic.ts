import type { Problem, GameScore, GameSettings, GameMode } from "../types/game";

export class GameLogic {
  static generateProblem(
    id: number,
    minFactor = 2,
    maxFactor = 10,
    mode: GameMode = "input"
  ): Problem {
    const factor1 =
      Math.floor(Math.random() * (maxFactor - minFactor + 1)) + minFactor;
    const factor2 =
      Math.floor(Math.random() * (maxFactor - minFactor + 1)) + minFactor;

    const problem: Problem = {
      id,
      factor1,
      factor2,
      answer: factor1 * factor2,
    };

    // Generate multiple choice options if needed
    if (mode === "multiple-choice") {
      problem.choices = this.generateChoices(problem.answer);
    }

    return problem;
  }

  static generateChoices(correctAnswer: number): number[] {
    const choices = [correctAnswer];

    // Generate 2 wrong answers
    for (let i = 0; i < 2; i++) {
      let wrongAnswer: number;
      do {
        // Generate plausible wrong answers based on common mistakes
        const variation = Math.floor(Math.random() * 3) + 1;
        switch (variation) {
          case 1:
            // Add/subtract a small amount
            wrongAnswer =
              correctAnswer +
              (Math.random() < 0.5 ? -1 : 1) *
                (Math.floor(Math.random() * 10) + 1);
            break;
          case 2:
            // Multiply/divide by a small factor
            wrongAnswer = Math.floor(
              correctAnswer * (0.8 + Math.random() * 0.4)
            );
            break;
          case 3:
            // Common multiplication table errors
            wrongAnswer =
              correctAnswer +
              (Math.random() < 0.5 ? -10 : 10) *
                (Math.floor(Math.random() * 3) + 1);
            break;
          default:
            wrongAnswer = correctAnswer + (Math.random() < 0.5 ? -5 : 5);
        }

        // Ensure it's positive and not the same as correct answer or existing wrong answers
        wrongAnswer = Math.max(1, wrongAnswer);
      } while (choices.includes(wrongAnswer));

      choices.push(wrongAnswer);
    }

    // Shuffle the choices
    for (let i = choices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [choices[i], choices[j]] = [choices[j], choices[i]];
    }

    return choices;
  }

  static generateProblems(settings: GameSettings): Problem[] {
    const problems: Problem[] = [];

    for (let i = 0; i < settings.numberOfProblems; i++) {
      problems.push(
        this.generateProblem(
          i,
          settings.minFactor,
          settings.maxFactor,
          settings.mode
        )
      );
    }

    return problems;
  }

  static calculateScore(
    correctAnswers: number,
    totalProblems: number,
    timeElapsed: number
  ): GameScore {
    const accuracy = (correctAnswers / totalProblems) * 100;

    // Score calculation: Base score from accuracy + time bonus
    // Perfect accuracy gives 1000 points, time bonus reduces for slower times
    const baseScore = (correctAnswers / totalProblems) * 1000;
    const timeBonus = Math.max(0, 500 - timeElapsed * 2); // Lose 2 points per second
    const score = Math.round(baseScore + timeBonus);

    // Determine rank based on score
    let rank: string;
    if (score >= 1200) rank = "🏆 Math Genius!";
    else if (score >= 1000) rank = "🌟 Excellent!";
    else if (score >= 800) rank = "👍 Great Job!";
    else if (score >= 600) rank = "😊 Good Work!";
    else if (score >= 400) rank = "📚 Keep Practicing!";
    else rank = "💪 You Can Do Better!";

    return {
      correctAnswers,
      totalProblems,
      accuracy,
      timeElapsed,
      score,
      rank,
    };
  }

  static isAnswerCorrect(problem: Problem, userAnswer: number): boolean {
    return problem.answer === userAnswer;
  }

  static getMotivationalMessage(accuracy: number, timeElapsed: number): string {
    const isQuick = timeElapsed < 30;
    const isAccurate = accuracy >= 80;

    if (isQuick && isAccurate) {
      return "Lightning fast and accurate! You're on fire! 🔥";
    } else if (isAccurate) {
      return "Great accuracy! Try to go faster next time! ⚡";
    } else if (isQuick) {
      return "Super speedy! Focus on accuracy for an even better score! 🎯";
    } else {
      return "Keep practicing! Speed and accuracy come with time! 💪";
    }
  }
}
