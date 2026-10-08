/* eslint-disable @typescript-eslint/no-require-imports -- Test the TypeScript helper without a build. */
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const assert = require("node:assert/strict");
const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
  return resolveFilename.call(this, request.startsWith("@/") ? path.resolve(__dirname, "..", request.slice(2)) : request, ...args);
};
require.extensions[".ts"] = require.extensions[".tsx"] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename);
const { splitAnswerBlank, splitAnswerBlanks, combineBlankAnswers, inlinePassageParts } = require("../lib/inline-answer.ts");
assert.deepEqual(splitAnswerBlanks("説明（進行中）から（　）次に（② ヒント）。"), [{ text: "説明（進行中）から" }, { hint: "", index: 0 }, { text: "次に" }, { hint: "② ヒント", index: 1 }, { text: "。" }]);
assert.equal(combineBlankAnswers([" に ", "させられ"]), "に／させられ");
assert.equal(combineBlankAnswers(["に", " "]), null);
assert.equal(combineBlankAnswers([]), null);
assert.deepEqual(splitAnswerBlank("相手は（① なじみ）のマナブ君だ。"), { before: "相手は", hint: "① なじみ", after: "のマナブ君だ。" });
assert.deepEqual(splitAnswerBlank("気持ちが（　）いる。"), { before: "気持ちが", hint: "", after: "いる。" });
assert.deepEqual(splitAnswerBlank("単語 (2 hint ) の意味"), { before: "単語 ", hint: "2 hint", after: " の意味" });
assert.deepEqual(splitAnswerBlank("説明(進行中)は（⑤　やか）に。"), { before: "説明(進行中)は", hint: "⑤　やか", after: "に。" });
assert.equal(splitAnswerBlank("答えを記入してください。"), null);
assert.equal(splitAnswerBlank("説明（進行中）"), null);
for (const lesson of [...require("../lib/vocabulary-lessons.ts").vocabularyLessons, ...require("../lib/vocabulary-n2-book.ts").vocabularyN2Lessons]) {
  const intro = lesson.exercises.filter((item) => item.type === "text" && item.group?.includes("導入練習"));
  for (const exercise of intro) {
    assert.ok(splitAnswerBlank(exercise.prompt), exercise.id);
  }
  if (intro.length && intro.some((item) => item.passage)) {
    const parts = inlinePassageParts(intro);
    assert.ok(parts, lesson.title);
    assert.deepEqual([...new Set(parts.filter((part) => "exercise" in part).map((part) => part.exercise.id))], intro.map((item) => item.id), lesson.title);
  }
}
const sample = require("../lib/lesson-one-exercises.ts").lessonOneBasicExercises.filter((item) => item.type === "text");
assert.equal(inlinePassageParts(sample.slice(1)), null, "Never render a partial or mismatched passage");
assert.equal(inlinePassageParts([sample[0], sample[0]]), null, "Duplicate numbered blanks must fall back");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const IntroCloze = require("../app/intro-cloze.tsx").default;
const MultiBlankAnswer = require("../app/multi-blank-answer.tsx").default;
const multiple = { id: "two-blanks", type: "text", title: "สองช่อง", prompt: "部長（　）何度も書類を書き直し（　）た。", answer: "に／させられ" };
const untouchedMultiple = renderToStaticMarkup(React.createElement(MultiBlankAnswer, { exercise: multiple, onAnswer() {} }));
assert.equal((untouchedMultiple.match(/<input /g) ?? []).length, 2);
assert.equal((untouchedMultiple.match(/<form /g) ?? []).length, 1);
assert.ok(untouchedMultiple.includes('disabled=""'));
assert.ok(!untouchedMultiple.includes("させられ"), "No correct answer before submission");
const lockedMultiple = renderToStaticMarkup(React.createElement(MultiBlankAnswer, { exercise: multiple, attempt: { answer: "に／された", correct: false }, onAnswer() {} }));
assert.equal((lockedMultiple.match(/ disabled=""/g) ?? []).length, 3, "All inputs and submit lock after one attempt");
assert.ok(lockedMultiple.includes('value="に"') && lockedMultiple.includes('value="された"'));
const untouched = renderToStaticMarkup(React.createElement(IntroCloze, { exercises: sample, attempts: new Map(), onAnswer() {} }));
assert.equal((untouched.match(/<input /g) ?? []).length, 9);
assert.equal((untouched.match(/<form /g) ?? []).length, 9);
assert.ok(untouched.includes('placeholder="ひと"'));
assert.ok(!untouched.includes("เฉลย:"), "Never reveal answers before submitting");
assert.ok(untouched.indexOf("明るく気さくな") < untouched.indexOf("คำตอบ ช่อง ①"));
assert.ok(untouched.indexOf("คำตอบ ช่อง ①") < untouched.indexOf("だれとでもすぐに仲良くなる"));
const attempts = new Map([[sample[0].id, { exerciseId: sample[0].id, answer: "ผิด", correct: false }]]);
const submitted = renderToStaticMarkup(React.createElement(IntroCloze, { exercises: sample, attempts, onAnswer() {} }));
assert.equal((submitted.match(/ disabled=""/g) ?? []).length, 10, "Nine empty or submitted buttons plus one locked input");
assert.ok(submitted.includes("ผิด — ข้อนี้ล็อกแล้ว"));
assert.ok(submitted.includes("เฉลย:"));
assert.ok(submitted.includes(sample[0].answer));
Module._resolveFilename = resolveFilename;
console.log("Inline blank hints, context, fallback and all vocabulary introductory exercises passed.");
