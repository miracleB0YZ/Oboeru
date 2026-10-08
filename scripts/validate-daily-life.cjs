/* eslint-disable @typescript-eslint/no-require-imports -- Node CommonJS validation uses a TypeScript require hook. */
// Answer keys transcribed independently from the original booklet, page 3.
const fs = require("node:fs");
const assert = require("node:assert/strict");
const ts = require("typescript");
require.extensions[".ts"] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const { lessonDailyLife: lesson } = require("../lib/lesson-daily-life.ts");
const words = lesson.vocabularyGroups.flatMap((group) => group.items);
assert.equal(words.length, 63);
assert.equal(new Set(words.map((item) => item.id)).size, words.length);
assert.equal(new Set(words.map((item) => item.word)).size, words.length);
for (const item of words) {
  assert.ok(item.thai && item.japaneseMeaning && item.reading, item.id);
}
assert.equal(lesson.exercises.length, 31);
assert.equal(new Set(lesson.exercises.map((item) => item.id)).size, 31);
const keys = [
  "構える", "治安", "新築", "育児", "健やか", "悩まし",
  "3", "4", "2", "3", "4", "1", "2",
  "2", "3", "1", "3", "2", "1",
  "2", "2", "2", "2",
  "4", "2", "3", "2", "4", "2", "2", "4",
];
assert.deepEqual(lesson.exercises.map((item) => item.answer), keys);
for (const exercise of lesson.exercises) {
  assert.ok(exercise.explanation.trim(), exercise.id);
  if (exercise.type === "choice") {
    assert.ok(exercise.choices.some((choice) => choice.id === exercise.answer), exercise.id);
    assert.equal(exercise.correctLabel, exercise.choices.find((choice) => choice.id === exercise.answer).label);
  }
}
assert.equal(lesson.exercises.filter((item) => item.section === "basic").length, 23);
assert.equal(lesson.exercises.filter((item) => item.section === "practical").reduce((sum, item) => sum + item.points, 0), 20);
console.log("Daily life: 63 vocabulary cards, 31 exercises, original answer keys verified.");
