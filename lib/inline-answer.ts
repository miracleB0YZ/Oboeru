import type { Exercise } from "./types";

export type AnswerBlankPart = { text: string } | { hint: string; index: number };
export function splitAnswerBlanks(prompt: string): AnswerBlankPart[] {
  const parts: AnswerBlankPart[] = [];
  let position = 0;
  let index = 0;
  for (const match of prompt.matchAll(/[（(]([^）)]*)[）)]/g)) {
    if (!/[\s\u3000①-⑳]/u.test(match[1])) continue;
    parts.push({ text: prompt.slice(position, match.index) }, { hint: match[1].trim(), index: index++ });
    position = match.index! + match[0].length;
  }
  parts.push({ text: prompt.slice(position) });
  return parts;
}

export function combineBlankAnswers(values: string[]): string | null {
  return values.length && values.every((value) => value.trim()) ? values.map((value) => value.trim()).join("／") : null;
}

// Hints stay in the placeholder; answers always replace the entire bracket.
export function splitAnswerBlank(prompt: string): { before: string; hint: string; after: string } | null {
  const blank = /[（(]([^）)]*)[）)]/g;
  for (const match of prompt.matchAll(blank)) {
    // Do not turn explanatory parentheses, such as (進行中), into an input.
    if (!/[\s\u3000①-⑳]/u.test(match[1])) continue;
    return { before: prompt.slice(0, match.index), hint: match[1].trim(), after: prompt.slice(match.index! + match[0].length) };
  }
  return null;
}

export type PassagePart = { text: string } | { exercise: Exercise; hint: string; number: string };
export function inlinePassageParts(exercises: Exercise[]): PassagePart[] | null {
  if (!exercises.length || exercises.some((item) => item.type !== "text" || !item.group?.includes("導入練習"))) return null;
  const passages = [...new Set(exercises.map((item) => item.passage).filter((item): item is string => Boolean(item)))];
  if (passages.length !== 1) return null;
  const passage = passages[0];
  const byNumber = new Map<string, Exercise>();
  for (const [index, exercise] of exercises.entries()) {
    const marker = splitAnswerBlank(exercise.prompt)?.hint.match(/[①-⑳]/u)?.[0] ?? (index < 20 ? String.fromCharCode(0x2460 + index) : undefined);
    if (!marker || byNumber.has(marker)) return null;
    byNumber.set(marker, exercise);
  }
  const parts: PassagePart[] = [];
  const seen = new Set<string>();
  let position = 0;
  for (const match of passage.matchAll(/[（(]([^）)]*)[）)]/g)) {
    const number = match[1].match(/[①-⑳]/u)?.[0];
    if (!number) continue;
    const exercise = byNumber.get(number);
    if (!exercise) return null;
    parts.push({ text: passage.slice(position, match.index) });
    parts.push({ exercise, hint: match[1].replace(number, "").trim(), number });
    seen.add(number);
    position = match.index! + match[0].length;
  }
  if (seen.size !== exercises.length) return null;
  parts.push({ text: passage.slice(position) });
  return parts;
}
