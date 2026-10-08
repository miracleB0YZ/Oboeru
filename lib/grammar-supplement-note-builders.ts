import type { Exercise } from "./types";
import type { GrammarTeachingNote } from "./grammar-teaching-note";

export type SupplementRow = [thai: string, rule: string, comparisons: string[] | string, takeaway: string, reason?: string];

export function supplementNotes(exercises: Exercise[], rows: SupplementRow[]): Record<string, GrammarTeachingNote> {
  if (exercises.length !== rows.length) throw new Error("Supplement teaching-note count mismatch");
  return Object.fromEntries(exercises.map((exercise, index) => {
    const [thai, rule, comparison, takeaway, reason] = rows[index];
    let completedSentence: string | undefined;
    if (exercise.type === "text") {
      // Remove the answer-line marker and the supplied conjugation hint, not sentence content.
      const prompt = exercise.prompt.replace(/（　）＿＿/g, "＿＿").replace(/（[^（）]+）$/, "");
      const answers = exercise.correctLabel.split("／");
      let answerIndex = 0;
      completedSentence = prompt.replace(/＿＿/g, () => answers[answerIndex++]);
      if (answerIndex !== answers.length) throw new Error(`Supplement blank mismatch: ${exercise.id}`);
    } else if (!exercise.prompt.includes("（　）")) {
      completedSentence = exercise.correctLabel;
      if (exercise.id.startsWith("n2g-consolidation-c-meaning-")) completedSentence = `${exercise.prompt.split("の意味")[0]}は「${exercise.correctLabel}」という意味です。`;
    }
    return [exercise.id, {
      thai, rule, takeaway, reason, completedSentence,
      comparisons: Array.isArray(comparison) ? comparison : [],
      alternativeForms: typeof comparison === "string" ? comparison : undefined,
    }];
  }));
}
