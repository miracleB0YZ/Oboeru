import type { Exercise } from "./types";

export type GrammarTeachingNote = {
  thai: string;
  // One explanation per distractor, in the order of the original choices.
  comparisons: string[];
  takeaway: string;
  rule?: string;
  reason?: string;
  // All four choice IDs in their sentence order, for ★ assembly questions.
  assemblyOrder?: string[];
  completedSentence?: string;
  // Free-response questions have no distractors; compare forms instead.
  alternativeForms?: string;
};

export function withGrammarTeachingNote(exercise: Exercise, note: GrammarTeachingNote): Exercise {
  const distractors = exercise.choices?.filter((choice) => choice.id !== exercise.answer) ?? [];
  if (distractors.length !== note.comparisons.length) throw new Error(`Incomplete distractor notes: ${exercise.id}`);
  const [oldReason, oldRule] = exercise.explanation.split("\n\n");
  const rule = note.rule ?? oldRule;
  if (!rule || !note.thai || !note.takeaway || note.comparisons.some((text) => !text.trim())) throw new Error(`Incomplete grammar note: ${exercise.id}`);
  const blanks = exercise.prompt.match(/（　）/g) ?? [];
  const answers = blanks.length > 1 ? exercise.correctLabel.split("／") : [exercise.correctLabel];
  if (!note.assemblyOrder && !note.completedSentence && blanks.length !== answers.length) throw new Error(`Cannot complete grammar sentence: ${exercise.id}`);
  let answerIndex = 0;
  let sentence = exercise.prompt.replace(/（　）/g, () => answers[answerIndex++]);
  if (note.assemblyOrder) {
    const order = note.assemblyOrder;
    const choices = exercise.choices ?? [];
    if (order.length !== 4 || new Set(order).size !== 4 || order[2] !== exercise.answer ||
      choices.length !== 4 || order.some((id) => !choices.some((choice) => choice.id === id)) ||
      !/＿＿ ＿＿ ★ ＿＿/.test(exercise.prompt)) throw new Error(`Invalid teaching-note assembly order: ${exercise.id}`);
    sentence = exercise.prompt.replace("＿＿ ＿＿ ★ ＿＿", order.map((id) => choices.find((choice) => choice.id === id)!.label).join(""));
  }
  if (note.completedSentence) sentence = note.completedSentence;
  if (/（　）|＿＿|★/.test(sentence)) throw new Error(`Unfilled teaching sentence: ${exercise.id}`);
  if (!distractors.length && !note.alternativeForms?.trim()) throw new Error(`Missing alternative forms: ${exercise.id}`);
  return {
    ...exercise,
    explanationSource: "ai_generated",
    explanation: [
      `ประโยคเต็ม: ${sentence}`,
      `คำแปลไทย: ${note.thai}`,
      `หลักภาษา: ${rule}`,
      `ทำไมตอบข้อนี้: ${note.reason ?? oldReason}`,
      `เทียบตัวเลือกอื่น: ${note.alternativeForms ?? distractors.map((choice, index) => `${choice.id}.「${choice.label}」— ${note.comparisons[index]}`).join("\n")}`,
      `จำให้เข้าใจ: ${note.takeaway}`,
    ].join("\n\n"),
  };
}
