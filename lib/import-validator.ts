import { book } from "./lesson-data";
import type { Exercise, Lesson, VocabularyGroup } from "./types";

export type LessonImport = {
  schema: "shin-kanzen-master-n1-goi.lesson";
  schemaVersion: 1;
  lesson: Lesson;
};

const record = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const nonempty = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

export function validateLessonImport(value: unknown): LessonImport {
  if (!record(value) || value.schema !== "shin-kanzen-master-n1-goi.lesson" || value.schemaVersion !== 1 || !record(value.lesson)) {
    throw new Error("Schema ต้องเป็น shin-kanzen-master-n1-goi.lesson เวอร์ชัน 1");
  }
  const lesson = value.lesson;
  if (lesson.bookId !== book.id || !nonempty(lesson.id) || !nonempty(lesson.title) || !nonempty(lesson.chapter)
    || !Number.isInteger(lesson.chapterNumber) || Number(lesson.chapterNumber) < 1
    || !Number.isInteger(lesson.number) || Number(lesson.number) < 1) {
    throw new Error("ข้อมูล Book, Chapter หรือ Lesson ไม่ถูกต้อง");
  }
  if (!Array.isArray(lesson.vocabularyGroups) || !Array.isArray(lesson.examples) || !Array.isArray(lesson.exercises)) {
    throw new Error("Lesson ต้องมี vocabularyGroups, examples และ exercises เป็น array");
  }
  if (lesson.vocabularyGroups.length === 0) throw new Error("Lesson ที่นำเข้าต้องมีคำศัพท์อย่างน้อยหนึ่งกลุ่ม");
  const groupIds = new Set<string>();
  const wordIds = new Map<string, string>();
  for (const group of lesson.vocabularyGroups as VocabularyGroup[]) {
    if (!record(group) || !nonempty(group.id) || !nonempty(group.title) || !Array.isArray(group.items) || groupIds.has(group.id)) {
      throw new Error("กลุ่มคำศัพท์มี ID ซ้ำหรือข้อมูลไม่ครบ");
    }
    groupIds.add(group.id);
    for (const item of group.items) {
      if (!record(item) || !nonempty(item.id) || !nonempty(item.word) || !nonempty(item.thai)) {
        throw new Error(`คำศัพท์ใน ${group.title} ต้องมี id, word และ thai`);
      }
      if (item.japaneseMeaning !== undefined && typeof item.japaneseMeaning !== "string") throw new Error(`japaneseMeaning ของ ${item.word} ต้องเป็นข้อความ`);
      const previousWord = wordIds.get(item.id);
      if (previousWord && previousWord !== item.word) throw new Error(`ID คำศัพท์ ${item.id} ถูกใช้กับคนละคำ`);
      wordIds.set(item.id, item.word);
    }
  }
  const exampleIds = new Set<string>();
  for (const example of lesson.examples) {
    if (!record(example) || !nonempty(example.id) || !nonempty(example.japanese) || !nonempty(example.thai) || exampleIds.has(example.id)) throw new Error("ตัวอย่างประโยคมี ID ซ้ำหรือข้อมูลไม่ครบ");
    exampleIds.add(example.id);
  }
  const exerciseIds = new Set<string>();
  for (const exercise of lesson.exercises as Exercise[]) {
    if (!record(exercise) || !nonempty(exercise.id) || !nonempty(exercise.prompt) || !nonempty(exercise.answer)
      || !nonempty(exercise.title) || !nonempty(exercise.correctLabel) || !nonempty(exercise.explanation) || exerciseIds.has(exercise.id)
      || (exercise.section !== "basic" && exercise.section !== "practical")
      || (exercise.type !== "text" && exercise.type !== "choice")) throw new Error("โจทย์มี ID ซ้ำหรือข้อมูลไม่ครบ");
    exerciseIds.add(exercise.id);
    if (exercise.acceptedAnswers !== undefined && (!Array.isArray(exercise.acceptedAnswers) || exercise.acceptedAnswers.some((answer) => !nonempty(answer)))) throw new Error(`คำตอบที่ยอมรับของโจทย์ ${exercise.id} ไม่ถูกต้อง`);
    if (exercise.type === "choice") {
      if (!Array.isArray(exercise.choices) || exercise.choices.length < 2) throw new Error(`โจทย์ ${exercise.id} ต้องมีอย่างน้อย 2 ตัวเลือก`);
      if (exercise.choices.some((choice) => !record(choice) || !nonempty(choice.id) || !nonempty(choice.label))) throw new Error(`ตัวเลือกโจทย์ ${exercise.id} ไม่สมบูรณ์`);
      const choiceIds = exercise.choices.map((choice) => choice.id);
      if (new Set(choiceIds).size !== choiceIds.length || !choiceIds.includes(exercise.answer)) throw new Error(`เฉลยโจทย์ ${exercise.id} ไม่ตรงกับตัวเลือก`);
    }
    if (exercise.explanationSource !== "original" && exercise.explanationSource !== "ai_generated") throw new Error(`โจทย์ ${exercise.id} ต้องระบุแหล่งคำอธิบาย`);
  }
  return value as LessonImport;
}
