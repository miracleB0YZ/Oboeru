import type { Choice, Exercise } from "./types";

type TextOptions = { id: string; group: string; title: string; prompt: string; answer: string; acceptedAnswers?: string[]; hint?: string; passage?: string; explanation?: string };

export function textExercise(input: TextOptions): Exercise {
  return {
    id: input.id,
    section: "basic",
    type: "text",
    group: input.group,
    title: input.title,
    prompt: input.prompt,
    answer: input.answer,
    acceptedAnswers: input.acceptedAnswers,
    hint: input.hint,
    passage: input.passage,
    correctLabel: input.answer,
    explanation: input.explanation ?? `คำตอบจากเฉลยต้นฉบับคือ「${input.answer}」`,
    explanationSource: "ai_generated",
  };
}

type SelectOptions = { id: string; section?: "basic" | "practical"; group: string; title: string; prompt: string; options: string[]; answer: number; explanation?: string; explanationSource?: "original" | "ai_generated"; points?: number };

export function selectExercise(input: SelectOptions): Exercise {
  const choices: Choice[] = input.options.map((label, index) => ({ id: String(index + 1), label }));
  return {
    id: input.id,
    section: input.section ?? "basic",
    type: "choice",
    group: input.group,
    title: input.title,
    prompt: input.prompt,
    choices,
    answer: String(input.answer),
    correctLabel: input.options[input.answer - 1],
    explanation: input.explanation ?? `คำตอบจากเฉลยต้นฉบับคือ「${input.options[input.answer - 1]}」`,
    explanationSource: input.explanationSource ?? "ai_generated",
    points: input.points,
  };
}
