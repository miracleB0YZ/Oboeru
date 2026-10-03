import { book } from "./lesson-data";
import { grammarBook } from "./grammar-book";
import type { Exercise, Lesson, VocabularyGroup } from "./types";

export type LessonImport = {
  schema: "shin-kanzen-master-n1-goi.lesson" | "shin-kanzen-master-n2-bunpou.lesson";
  schemaVersion: 1;
  lesson: Lesson;
};

export type ImportQualityIssue = {
  code: string;
  severity: "error" | "warning";
  message: string;
};

const record = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const nonempty = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

export function validateLessonImport(value: unknown, editing?: { bookId: string }): LessonImport {
  if (!record(value) || (value.schema !== "shin-kanzen-master-n1-goi.lesson" && value.schema !== "shin-kanzen-master-n2-bunpou.lesson") || value.schemaVersion !== 1 || !record(value.lesson)) {
    throw new Error("Schema ต้องเป็น Lesson ของ Oboeru เวอร์ชัน 1 ที่รองรับ");
  }
  const lesson = value.lesson;
  const expectedBookId = editing?.bookId ?? (value.schema === "shin-kanzen-master-n2-bunpou.lesson" ? grammarBook.id : book.id);
  if (lesson.bookId !== expectedBookId || !nonempty(lesson.id) || !nonempty(lesson.title) || !nonempty(lesson.chapter)
    || !Number.isInteger(lesson.chapterNumber) || Number(lesson.chapterNumber) < 1
    || !Number.isInteger(lesson.number) || Number(lesson.number) < 1) {
    throw new Error("ข้อมูล Book, Chapter หรือ Lesson ไม่ถูกต้อง");
  }
  if (lesson.sourcePages !== undefined && (!Array.isArray(lesson.sourcePages) || lesson.sourcePages.some((page) => !Number.isInteger(page) || page < 1))) {
    throw new Error("sourcePages ต้องเป็น array ของเลขหน้าจำนวนเต็มตั้งแต่ 1 ขึ้นไป");
  }
  if (!Array.isArray(lesson.vocabularyGroups) || !Array.isArray(lesson.examples) || !Array.isArray(lesson.exercises)) {
    throw new Error("Lesson ต้องมี vocabularyGroups, examples และ exercises เป็น array");
  }
  if (!editing && value.schema === "shin-kanzen-master-n1-goi.lesson" && lesson.vocabularyGroups.length === 0) throw new Error("Lesson คำศัพท์ต้องมีคำศัพท์อย่างน้อยหนึ่งกลุ่ม");
  if (value.schema === "shin-kanzen-master-n2-bunpou.lesson") {
    if (!Array.isArray(lesson.grammarPatterns) || (!editing && lesson.grammarPatterns.length === 0)) throw new Error("Lesson Grammar ต้องมี grammarPatterns เป็นรายการไวยากรณ์");
    const grammarIds = new Set<string>();
    for (const item of lesson.grammarPatterns) {
      if (!record(item) || !nonempty(item.id) || !nonempty(item.pattern) || grammarIds.has(item.id)) throw new Error("grammarPatterns มี ID ซ้ำหรือข้อมูลไม่ครบ");
      grammarIds.add(item.id);
    }
    if (!editing && lesson.exercises.length === 0) throw new Error("Lesson Grammar ที่นำเข้าต้องมีแบบฝึกหัดและเฉลยอย่างน้อยหนึ่งข้อ");
  }
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
      if (item.reading !== undefined && typeof item.reading !== "string") throw new Error(`reading ของ ${item.word} ต้องเป็นข้อความ`);
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

export function analyzeLessonImport(value: LessonImport): ImportQualityIssue[] {
  const { lesson } = value;
  const issues: ImportQualityIssue[] = [];
  const add = (code: string, severity: ImportQualityIssue["severity"], message: string) => issues.push({ code, severity, message });
  const pages = [...new Set(lesson.sourcePages ?? [])].sort((a, b) => a - b);
  if (!pages.length) add("missing-source-pages", "warning", "ไม่ได้ระบุ sourcePages จึงตรวจไม่ได้ว่า AI อ่านครบทุกหน้าหรือไม่");
  if (pages.length && pages.length < 4) add("short-page-range", "warning", `พบ sourcePages เพียง ${pages.length} หน้า (${pages.join(", ")}) ขณะที่ Lesson ในเล่มนี้โดยทั่วไปมี 4 หน้า`);
  if (pages.some((page, index) => index > 0 && page !== pages[index - 1] + 1)) add("page-gap", "warning", `sourcePages ไม่ต่อเนื่อง (${pages.join(", ")}) อาจมีการข้ามทั้งหน้าขณะตัด ウォーミングアップ`);

  const isGrammar = value.schema === "shin-kanzen-master-n2-bunpou.lesson";
  const part = lesson.chapterNumber <= 3 ? 1 : lesson.chapterNumber === 4 ? 2 : 3;
  const canonicalId = isGrammar ? `shin-kanzen-n2-bunpou-p${part}-${String(lesson.number).padStart(2, "0")}` : `shin-kanzen-n1-goi-${String(lesson.number).padStart(2, "0")}`;
  if (lesson.id !== canonicalId) add("noncanonical-lesson-id", "warning", `Lesson ${lesson.number}課 ควรใช้ id “${canonicalId}” แต่ไฟล์ใช้ “${lesson.id}” ให้ตรวจว่า number เป็นเลข課ที่พิมพ์จริง`);

  const words = lesson.vocabularyGroups.flatMap((group) => group.items);
  const vocabularyText = new Set(words.map((item) => item.word));
  const suspiciousFormation = isGrammar ? [] : words.filter((item) => /〜.*[（(].*[、,].*[）)]/.test(item.word));
  if (suspiciousFormation.length) add("combined-word-formation", "error", `語形成 ถูกนำ pattern และหลายคำมารวมเป็น word เดียว: ${suspiciousFormation.slice(0, 3).map((item) => `「${item.word}」`).join("、")}`);
  const sentenceWords = isGrammar ? [] : words.filter((item) => /[。！？!?]/.test(item.word));
  if (sentenceWords.length) add("sentence-as-word", "error", `พบ word ที่มีเครื่องหมายจบประโยค: ${sentenceWords.slice(0, 3).map((item) => `「${item.word}」`).join("、")} ให้แยกเฉพาะช่วงตัวหนา`);

  const repeatedKana = new Set<string>();
  for (const example of lesson.examples) {
    for (const match of example.japanese.matchAll(/([ぁ-ゖ]{2})\1/g)) repeatedKana.add(match[0]);
  }
  const missingMimetics = isGrammar ? [] : [...repeatedKana].filter((candidate) => ![...vocabularyText].some((word) => word.includes(candidate)));
  if (missingMimetics.length) add("bold-candidate-only-in-examples", "warning", `พบคำเลียนเสียงใน examples แต่ไม่พบเป็น vocabulary item: ${missingMimetics.map((item) => `「${item}」`).join("、")} ให้ตรวจตัวหนาจากภาพ PDF`);

  const basic = lesson.exercises.filter((exercise) => exercise.section === "basic");
  const practical = lesson.exercises.filter((exercise) => exercise.section === "practical");
  const basicGroups = new Set(basic.map((exercise) => exercise.group ?? exercise.title));
  if (basic.length >= 5 && basicGroups.size === 1) add("single-basic-group", "warning", `基本練習 มี ${basic.length} ข้อแต่มีเพียงกลุ่มเดียว อาจขาดแบบจับคู่ คลังคำ 類義 หรือ 語形成`);
  if (!practical.length) add("missing-practical", "warning", "ไม่พบ 実践練習 ในไฟล์");
  if (!isGrammar && lesson.exercises.length < 20) add("low-exercise-count", "warning", `พบแบบฝึกหัดรวมเพียง ${lesson.exercises.length} ข้อ ให้เทียบจำนวนกับทุกกลุ่มใน PDF`);

  const passages = lesson.exercises.map((exercise) => exercise.passage).filter((passage): passage is string => Boolean(passage));
  const leaked = lesson.exercises.filter((exercise) => exercise.type === "text" && passages.some((passage) => [exercise.correctLabel, exercise.answer, ...(exercise.acceptedAnswers ?? [])].some((answer) => answer.length > 1 && passage.includes(answer))));
  if (leaked.length) add("answers-visible-in-passage", "error", `บทอ่านเปิดเผยคำตอบเต็มอย่างน้อย ${leaked.length} ข้อ (${leaked.slice(0, 5).map((exercise) => exercise.title).join(", ")}) ต้องคงช่องว่าง/คำใบ้ตามต้นฉบับ`);

  return issues;
}
