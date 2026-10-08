import { selectExercise, textExercise } from "./exercise-builders";
import type { Exercise, VocabularyGroup } from "./types";

export type VocabularyRow = [word: string, reading: string, thai: string, japaneseMeaning: string];
export type QuestionRow = [prompt: string, options: string[], answer: number, explanation: string];
export type ClozeRow = [prompt: string, answer: string, reading: string, explanation: string, alternatives?: string[]];
export function vocabularyGroup(prefix: string, key: string, title: string, rows: VocabularyRow[]): VocabularyGroup {
  return { id: prefix + "-vocab-" + key, title, items: rows.map(([word, reading, thai, japaneseMeaning], index) => ({
    id: prefix + "-vocab-" + key + "-" + (index + 1), word, reading, thai, japaneseMeaning,
  })) };
}
export function vocabularyQuestions(prefix: string, key: string, group: string, rows: QuestionRow[], section: "basic" | "practical" = "basic", points?: number): Exercise[] {
  return rows.map(([prompt, options, answer, explanation], index) => selectExercise({
    id: prefix + "-" + key + "-" + (index + 1), group, title: "ข้อ " + (index + 1), prompt, options, answer, explanation, section, points,
  }));
}
export function vocabularyCloze(prefix: string, passage: string, rows: ClozeRow[]): Exercise[] {
  return rows.map(([prompt, answer, reading, explanation, alternatives = []], index) => textExercise({
    id: prefix + "-cloze-" + (index + 1), group: "1 導入練習 · เติมรูปคำเต็มในประโยค", title: "ช่อง " + (index + 1),
    prompt, passage, answer, explanation, acceptedAnswers: [reading, ...alternatives],
    hint: "พิมพ์คำเต็มแทนวงเล็บทั้งหมด ไม่ใช่เฉพาะส่วนที่หายไป",
  }));
}
