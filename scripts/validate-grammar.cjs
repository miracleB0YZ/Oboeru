/* eslint-disable @typescript-eslint/no-require-imports -- Node CommonJS validation uses a TypeScript require hook. */
// Independently transcribed from the original answer key (別冊 pages 3–6).
const fs = require("node:fs");
const ts = require("typescript");
require.extensions[".ts"] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const { grammarLessons } = require("../lib/grammar-book.ts");
const { detailedGrammarNotes } = require("../lib/grammar-detailed-explanations.ts");
const { grammarAssemblyOne, grammarAssemblyTwo } = require("../lib/grammar-assembly.ts");
const consolidation = require("../lib/grammar-consolidation.ts");
const { withGrammarTeachingNote } = require("../lib/grammar-teaching-note.ts");
const assert = require("node:assert/strict");
const keys = [
  "b c a c a b c b c a c a b c b c a a b a b c c a a",
  "b b a a c c c a b c a b c c a a b b a c b a b c c a",
  "a a b c c a c a b b c c a b c a b c c b b a c a c",
  "b a a b a c c c c b a a c a b a b a c b b a c b c c",
  "b a c a b b a b c a c b c a c a b b a a a c a b",
  "a c c b c a b b c a a a b b a c a b a c c b a",
  "b b a a b c c b a c a b c b a a c a c b c b a",
  "a c c a a a c a b b c a a b b a c c a b c a",
  "b a b a b a c c b c b a c c b a a b b b a b b c c",
  "a a c b a c c c a b c b c a b c a c a",
  "c b a b c a b a c a b a c a b a a a b a b c b c",
  "c b a a c b a b b a c b a b a c a b c a b b a",
  "c a a b c b c a b a c a b b a a b b c a c a",
  "c a c b c a b a b a b a b c a c a c c b a b a c",
  "b a a c c a b a c b c c b c b a c a c c a b a b c",
  "b a b b c b a c a b c a a b b a c b c a c c b a",
  "a c b a b c b c a a c a c c b a b a c b c a b",
  "b c b a a a c b b a b a a a b a a b c b a c a c b",
  "b c b a c a b b a c a b c c a b a b c c a b b c a",
  "a b b a a c b c c a b b a c a a b c a b a c a c b b",
  "a b a b a c a c b a a b c a c b a a b c b b c a c b",
  "b a c b a b c b a c a a c c c a b a c a b b a c",
  "b | a c | c a b c | a b c | a c b b | a a b | c a c | b a c a c b",
  "a c | b a c | a b a b | a c b | a c b b | a c | c c a b c a",
  "b a c b c c a b a a b c b a c b c a c a b b a c",
  "a b c | b a a c | c b a a | b c | a b c a | c b c | b a a c b",
];
const reviews = { 5: "2 2 1 3 1 4 4 2 2 3 1 2 2 3 2", 10: "3 1 3 2 2 2 4 1 3 2 4 3 3 2 3", 15: "4 2 3 2 1 4 3 4 1 3 3 2 1 1 2", 20: "1 4 3 3 4 2 1 1 2 2 1 3 4 1 3", 26: "1 2 4 3 1 2 3 1 2 4 2 1 4 4 3" };
const errors = [];
const ids = new Set();
const explanationHeadings = ["ประโยคเต็ม:", "คำแปลไทย:", "หลักภาษา:", "ทำไมตอบข้อนี้:", "เทียบตัวเลือกอื่น:", "จำให้เข้าใจ:"];
const detailedExercises = grammarLessons.flatMap((lesson) => lesson.exercises).filter((exercise) => exercise.id.startsWith("n2g-p1-01-") || exercise.id in detailedGrammarNotes);
for (const exercise of detailedExercises) {
  const paragraphs = exercise.explanation.split("\n\n");
  if (paragraphs.length !== explanationHeadings.length || paragraphs.some((paragraph, index) => !paragraph.startsWith(explanationHeadings[index]) || paragraph.length <= explanationHeadings[index].length)) errors.push(`Incomplete lesson-one teaching note: ${exercise.id}`);
  if (!detailedGrammarNotes[exercise.id]?.completedSentence && (exercise.prompt.match(/（　）/g) ?? []).length === 1 && paragraphs[0] !== `ประโยคเต็ม: ${exercise.prompt.replace("（　）", exercise.correctLabel)}`) errors.push(`Incorrect completed sentence: ${exercise.id}`);
  if (/（　）|＿＿|★/.test(paragraphs[0])) errors.push(`Unfilled completed sentence: ${exercise.id}`);
  if (exercise.id === "n2g-p1-08-g1-2" && paragraphs[0] !== "ประโยคเต็ม: 漢字をもとにしてひらがなとカタカナができた。") errors.push("Incorrect two-blank completion");
  if (exercise.explanationSource !== "ai_generated") errors.push(`Teaching notes must not claim to be publisher explanations: ${exercise.id}`);
  for (const choice of exercise.choices ?? []) if (choice.id !== exercise.answer && !paragraphs[4].includes(choice.label)) errors.push(`Missing distractor comparison: ${exercise.id}/${choice.id}`);
}
for (const lesson of grammarLessons) for (const exercise of lesson.exercises) {
  if (ids.has(exercise.id)) errors.push(`Duplicate ID: ${exercise.id}`);
  ids.add(exercise.id);
  if (!exercise.explanation.trim()) errors.push(`Missing explanation: ${exercise.id}`);
  if (exercise.type === "choice" && exercise.choices?.find(choice => choice.id === exercise.answer)?.label !== exercise.correctLabel) errors.push(`Invalid choice: ${exercise.id}`);
}
for (const id of Object.keys(detailedGrammarNotes)) if (!ids.has(id)) errors.push(`Orphan detailed note: ${id}`);
const assemblyOrders = ["3 2 4 1", "2 4 3 1", "4 2 1 3", "2 1 4 3", "2 4 1 3", "4 1 3 2", "4 3 2 1", "4 2 1 3", "3 1 2 4", "4 1 3 2", "1 4 2 3", "3 4 1 2"];
grammarAssemblyOne.forEach((original, index) => {
  const enhanced = detailedExercises.find((exercise) => exercise.id === original.id);
  if (!enhanced) { errors.push(`Missing assembly teaching note: ${original.id}`); return; }
  const order = assemblyOrders[index].split(" ");
  const sentence = original.prompt.replace("＿＿ ＿＿ ★ ＿＿", order.map((id) => original.choices.find((choice) => choice.id === id).label).join(""));
  if (enhanced.explanation.split("\n\n")[0] !== `ประโยคเต็ม: ${sentence}`) errors.push(`Incorrect assembly sentence: ${original.id}`);
  for (const field of ["prompt", "answer", "correctLabel"]) if (enhanced[field] !== original[field]) errors.push(`Changed assembly ${field}: ${original.id}`);
  if (enhanced.answer !== order[2]) errors.push(`Incorrect star position: ${original.id}`);
});
const assemblyTwoOrders = ["3 1 4 2", "2 4 3 1", "4 2 1 3", "2 4 1 3", "2 3 4 1", "4 3 2 1", "4 1 3 2", "4 1 3 2", "2 4 3 1", "4 2 1 3", "1 4 3 2", "1 3 2 4"];
grammarAssemblyTwo.filter((exercise) => exercise.id.includes("-order-")).forEach((original, index) => {
  const enhanced = detailedExercises.find((exercise) => exercise.id === original.id);
  const order = assemblyTwoOrders[index].split(" ");
  const sentence = original.prompt.replace("＿＿ ＿＿ ★ ＿＿", order.map((id) => original.choices.find((choice) => choice.id === id).label).join(""));
  if (!enhanced || enhanced.explanation.split("\n\n")[0] !== `ประโยคเต็ม: ${sentence}`) errors.push(`Incorrect assembly-two sentence: ${original.id}`);
  if (original.answer !== order[2]) errors.push(`Incorrect assembly-two star: ${original.id}`);
});
// Explanations may change; exercise identity, questions, keys and accepted answers may not.
for (const original of [...grammarAssemblyOne, ...grammarAssemblyTwo, ...Object.values(consolidation).flat()]) {
  const enhanced = detailedExercises.find((exercise) => exercise.id === original.id);
  if (!enhanced) { errors.push(`Missing supplementary teaching note: ${original.id}`); continue; }
  for (const field of ["id", "type", "section", "group", "title", "prompt", "answer", "correctLabel", "choices", "acceptedAnswers"]) {
    if (JSON.stringify(enhanced[field]) !== JSON.stringify(original[field])) errors.push(`Changed supplementary ${field}: ${original.id}`);
  }
  if (original.type === "text") {
    let answerIndex = 0;
    const answers = original.correctLabel.split("／");
    const sentence = original.prompt.replace(/（　）＿＿/g, "＿＿").replace(/（[^（）]+）$/, "").replace(/＿＿/g, () => answers[answerIndex++]);
    if (answerIndex !== answers.length || enhanced.explanation.split("\n\n")[0] !== `ประโยคเต็ม: ${sentence}`) errors.push(`Incorrect free-response completion: ${original.id}`);
  }
}
const assemblySample = grammarAssemblyOne[0];
assert.throws(() => withGrammarTeachingNote(assemblySample, { ...detailedGrammarNotes[assemblySample.id], assemblyOrder: ["1", "1", "4", "3"] }), /Invalid teaching-note assembly order/);
assert.throws(() => withGrammarTeachingNote(assemblySample, { ...detailedGrammarNotes[assemblySample.id], assemblyOrder: ["3", "4", "2", "1"] }), /Invalid teaching-note assembly order/);
const textSample = consolidation.consolidationA[0];
assert.throws(() => withGrammarTeachingNote(textSample, { ...detailedGrammarNotes[textSample.id], alternativeForms: "" }), /Missing alternative forms/);
assert.throws(() => withGrammarTeachingNote(textSample, { ...detailedGrammarNotes[textSample.id], completedSentence: "未完成＿＿" }), /Unfilled teaching sentence/);
for (let number = 1; number <= 13; number++) {
  const id = `n2g-p2-2-noun-${number}`;
  if (!detailedExercises.some((exercise) => exercise.id === id)) errors.push(`Missing noun-modifier teaching note: ${id}`);
}
for (const number of Array.from({ length: 26 }, (_, index) => index + 1)) {
  for (const exercise of grammarLessons[number - 1].exercises) if (!detailedExercises.includes(exercise)) errors.push(`Detailed lesson ${number} is missing ${exercise.id}`);
}
for (const lesson of grammarLessons) for (const exercise of lesson.exercises) {
  if (!detailedExercises.includes(exercise)) errors.push(`Grammar teaching-note coverage missing: ${exercise.id}`);
}
keys.forEach((key, index) => {
  const lesson = grammarLessons[index];
  const exercises = lesson.exercises.filter(exercise => exercise.section === "basic");
  const expected = key.replaceAll("|", "").trim().split(/\s+/).map(letter => String(letter.charCodeAt(0) - 96));
  if (expected.length !== exercises.length) errors.push(`Lesson ${index + 1}: expected ${expected.length}, got ${exercises.length}`);
  exercises.forEach((exercise, i) => { if (exercise.answer !== expected[i]) errors.push(`${exercise.id}: expected ${expected[i]}, got ${exercise.answer}`); });
});
for (const [number, key] of Object.entries(reviews)) {
  const exercises = grammarLessons[Number(number) - 1].exercises.filter(exercise => exercise.section === "practical");
  const expected = key.split(" ");
  if (expected.length !== exercises.length) errors.push(`Review ${number}: count mismatch`);
  exercises.forEach((exercise, i) => { if (exercise.answer !== expected[i]) errors.push(`${exercise.id}: expected ${expected[i]}, got ${exercise.answer}`); });
}
if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
else console.log(`Validated ${ids.size} exercises, all 26 lesson keys and 5 review keys; ${detailedExercises.length} complete six-part teaching notes.`);
