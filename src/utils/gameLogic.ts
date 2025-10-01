import type { Problem, GameScore, GameSettings } from "../types/game";

export class GameLogic {
  static generateProblem(id: number, minFactor = 2, maxFactor = 10): Problem {
    const factor1 =
      Math.floor(Math.random() * (maxFactor - minFactor + 1)) + minFactor;
    const factor2 =
      Math.floor(Math.random() * (maxFactor - minFactor + 1)) + minFactor;

    return {
      id,
      factor1,
      factor2,
      answer: factor1 * factor2,
    };
  }

  static generateProblems(settings: GameSettings): Problem[] {
    const problems: Problem[] = [];

    for (let i = 0; i < settings.numberOfProblems; i++) {
      problems.push(
        this.generateProblem(i, settings.minFactor, settings.maxFactor)
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
