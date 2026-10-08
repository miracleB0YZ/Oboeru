import { selectExercise, textExercise } from "./exercise-builders";
import { withGrammarTeachingNote } from "./grammar-teaching-note";
import type { Exercise } from "./types";

export type N1ExerciseRow = [prompt: string, options: string[], answer: number, thai: string, reason: string, comparisons: string[], takeaway: string];
export function n1ExerciseGroup(lesson: number, number: string, title: string, rule: string, rows: N1ExerciseRow[]): Exercise[] {
  return rows.map(([prompt, options, answer, thai, reason, comparisons, takeaway], index) => withGrammarTeachingNote(
    selectExercise({ id: `n1g-p1-${String(lesson).padStart(2, "0")}-g${number}-${index + 1}`, group: title,
      title: `練習 ${number}-${index + 1}`, prompt, options, answer, explanation: reason, explanationSource: "ai_generated" }),
    { thai, rule, reason, comparisons, takeaway },
  ));
}

export type N1TextRow = [prompt: string, answer: string, thai: string, reason: string, alternativeForms: string, takeaway: string, acceptedAnswers?: string[]];
export function n1TextGroup(lesson: number, number: string, title: string, rule: string, hint: string, rows: N1TextRow[]): Exercise[] {
  return rows.map(([prompt, answer, thai, reason, alternativeForms, takeaway, acceptedAnswers], index) => withGrammarTeachingNote(
    textExercise({ id: `n1g-p1-${String(lesson).padStart(2, "0")}-g${number}-${index + 1}`, group: title,
      title: `練習 ${number}-${index + 1}`, prompt, answer, acceptedAnswers, hint, explanation: reason }),
    { thai, rule, reason, comparisons: [], alternativeForms, takeaway },
  ));
}
