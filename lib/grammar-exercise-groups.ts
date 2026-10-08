import { selectExercise } from "./exercise-builders";

export type GrammarExerciseGroup = {
  name: string;
  grammar: string;
  rows: Array<[prompt: string, options: string[], answer: number, reason: string]>;
};

export function buildGrammarExercises(lesson: number, groups: GrammarExerciseGroup[]) {
  return groups.flatMap((group, groupIndex) => group.rows.map(([prompt, options, answer, reason], index) => selectExercise({
    id: `n2g-p1-${String(lesson).padStart(2, "0")}-g${groupIndex + 1}-${index + 1}`,
    group: group.name,
    title: `${groupIndex + 1}-${index + 1}`,
    prompt, options, answer,
    explanation: `${reason}\n\n${group.grammar}`,
    explanationSource: "ai_generated",
  })));
}
