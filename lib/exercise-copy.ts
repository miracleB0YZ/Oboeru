import type { Attempt, Exercise } from "./types";

/** Copy labels rather than internal choice IDs so the question is self-contained. */
export function exerciseAiText(exercise: Exercise, attempt: Attempt): string {
  const chosen = exercise.type === "choice"
    ? exercise.choices?.find((choice) => choice.id === attempt.answer)
    : undefined;
  const lines = [
    "ช่วยอธิบายแบบฝึกหัดภาษาญี่ปุ่นข้อนี้เป็นภาษาไทย ว่าทำไมเฉลยจึงถูก และคำตอบของฉันถูกหรือผิดอย่างไร หากมีตัวเลือกช่วยอธิบายความแตกต่างด้วย หากเฉลยหรือคำอธิบายเดิมไม่ถูกต้อง โปรดทักท้วงพร้อมเหตุผล",
    "", [exercise.group, exercise.title].filter(Boolean).join(" · "),
  ];
  if (exercise.passage) lines.push("", "บทอ่าน:", exercise.passage);
  lines.push("", "โจทย์:", exercise.prompt);
  if (exercise.hint) lines.push("คำใบ้ / คำสั่งเพิ่มเติม: " + exercise.hint);
  if (exercise.choices?.length) lines.push("", "ตัวเลือก:", ...exercise.choices.map((choice) => `${choice.id}. ${choice.label}`));
  lines.push("", "คำตอบของฉัน: " + (chosen ? `${chosen.id}. ${chosen.label}` : attempt.answer),
    "ผลตรวจในเว็บ: " + (attempt.correct ? "ถูก" : "ผิด"), "เฉลยในเว็บ: " + exercise.correctLabel);
  if (exercise.acceptedAnswers?.length) lines.push("คำตอบอื่นที่เว็บยอมรับ: " + exercise.acceptedAnswers.join(" / "));
  if (exercise.explanation) lines.push("", "คำอธิบายในเว็บ" + (exercise.explanationSource === "ai_generated" ? " (สร้างโดย AI)" : " (อ้างอิงเฉลย)") + ":", exercise.explanation);
  return lines.join("\n");
}

/** Failure is surfaced as a manual-copy field, never reported as success. */
export async function copyExerciseText(text: string): Promise<boolean> {
  try {
    if (!navigator.clipboard?.writeText) return false;
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
