/* eslint-disable @typescript-eslint/no-require-imports -- Load TypeScript components for regression tests. */
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
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { exerciseAiText, copyExerciseText } = require("../lib/exercise-copy.ts");
const { AnswerFeedback, default: IntroCloze } = require("../app/intro-cloze.tsx");
const exercise = {
  id: "test", title: "ข้อ 1", group: "เติมคำ", type: "choice", prompt: "最近（　）寒くなった。",
  choices: [{ id: "1", label: "めっきり" }, { id: "2", label: "いずれ" }], answer: "1",
  correctLabel: "めっきり", explanation: "เปลี่ยนอย่างเห็นได้ชัด", explanationSource: "ai_generated",
};
const attempt = { exerciseId: "test", answer: "2", correct: false };
const text = exerciseAiText(exercise, attempt);
assert.ok(text.includes(exercise.prompt));
assert.ok(text.includes("1. めっきり\n2. いずれ"));
assert.ok(text.includes("คำตอบของฉัน: 2. いずれ"));
assert.ok(text.includes("ผลตรวจในเว็บ: ผิด"));
assert.ok(text.includes("เฉลยในเว็บ: めっきり"));
assert.ok(text.includes("(สร้างโดย AI)"));
assert.ok(text.includes("โปรดทักท้วงพร้อมเหตุผล"));
const writtenExercise = { ...exercise, type: "text", choices: undefined, passage: "บทอ่าน ①", hint: "พิมพ์รูปเต็ม", acceptedAnswers: ["読み方"] };
const writtenText = exerciseAiText(writtenExercise, { ...attempt, answer: "คำตอบที่พิมพ์", correct: true });
assert.ok(writtenText.includes("บทอ่าน:\nบทอ่าน ①"));
assert.ok(writtenText.includes("คำตอบของฉัน: คำตอบที่พิมพ์"));
assert.ok(writtenText.includes("ผลตรวจในเว็บ: ถูก"));
assert.ok(writtenText.includes("คำตอบอื่นที่เว็บยอมรับ: 読み方"));
assert.ok(!writtenText.includes("ตัวเลือก:"));
assert.ok(!exerciseAiText({ ...writtenExercise, explanationSource: "original" }, attempt).includes("สร้างโดย AI"));
const markup = renderToStaticMarkup(React.createElement(AnswerFeedback, { exercise, attempt }));
assert.ok(markup.includes("คัดลอกไปถาม AI"));
assert.ok(markup.includes('type="button"'));
const grammarSample = require("../lib/grammar-book.ts").grammarLessons[0].exercises[0];
const grammarMarkup = renderToStaticMarkup(React.createElement(AnswerFeedback, { exercise: grammarSample, attempt: { ...attempt, exerciseId: grammarSample.id } }));
assert.equal((grammarMarkup.match(/<p>/g) ?? []).length, 6, "Detailed grammar notes render as six readable paragraphs");
assert.ok(grammarMarkup.includes("คำแปลไทย:"));
assert.ok(grammarMarkup.includes("เทียบตัวเลือกอื่น:"));
const grammarCopyText = exerciseAiText(grammarSample, { ...attempt, exerciseId: grammarSample.id });
assert.ok(grammarCopyText.includes(grammarSample.explanation), "Copy-to-AI retains the entire teaching note");
const n1Sample = require("../lib/grammar-n1-book.ts").grammarN1Lessons[0].exercises[0];
const n1Attempt = { ...attempt, exerciseId: n1Sample.id };
const n1Markup = renderToStaticMarkup(React.createElement(AnswerFeedback, { exercise: n1Sample, attempt: n1Attempt }));
assert.equal((n1Markup.match(/<p>/g) ?? []).length, 6, "N1 feedback renders six teaching paragraphs");
assert.ok(exerciseAiText(n1Sample, n1Attempt).includes(n1Sample.explanation), "N1 copy-to-AI includes the complete explanation");
const allGrammar = require("../lib/grammar-book.ts").grammarLessons.flatMap((lesson) => lesson.exercises);
for (const id of ["n2g-consolidation-a-1", "n2g-consolidation-c-meaning-1", "n2g-consolidation-d-form-2", "n2g-consolidation-g-5", "n2g-p2-2-order-12"]) {
  const supplement = allGrammar.find((item) => item.id === id);
  assert.ok(supplement, `Missing UI sample: ${id}`);
  const submittedAttempt = { ...attempt, exerciseId: id };
  const feedback = renderToStaticMarkup(React.createElement(AnswerFeedback, { exercise: supplement, attempt: submittedAttempt }));
  assert.equal((feedback.match(/<p>/g) ?? []).length, 6, `Six teaching paragraphs render for ${id}`);
  assert.ok(exerciseAiText(supplement, submittedAttempt).includes(supplement.explanation), `Copy preserves supplementary note: ${id}`);
}
const sample = require("../lib/lesson-one-exercises.ts").lessonOneBasicExercises.filter((item) => item.type === "text");
const untouched = renderToStaticMarkup(React.createElement(IntroCloze, { exercises: sample, attempts: new Map(), onAnswer() {} }));
assert.ok(!untouched.includes("คัดลอกไปถาม AI"), "No copy/answer UI before submission");
const submitted = renderToStaticMarkup(React.createElement(IntroCloze, { exercises: sample, attempts: new Map([[sample[0].id, { ...attempt, exerciseId: sample[0].id }]]), onAnswer() {} }));
assert.ok(submitted.includes("คัดลอกไปถาม AI"), "Inline passage feedback shares the same copy button");

function find(element, type) {
  if (!element || typeof element !== "object") return undefined;
  if (element.type === type) return element;
  for (const child of [element.props?.children].flat(Infinity)) {
    const found = find(child, type);
    if (found) return found;
  }
}
async function main() {
  const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  const originalUseState = React.useState;
  let state = "idle";
  React.useState = () => [state, (next) => { state = next; }];
  const setNavigator = (value) => Object.defineProperty(globalThis, "navigator", { configurable: true, value });
  try {
    let copied;
    setNavigator({ clipboard: { async writeText(value) { copied = value; } } });
    assert.equal(await copyExerciseText(text), true);
    assert.equal(copied, text);
    await find(AnswerFeedback({ exercise, attempt }), "button").props.onClick();
    assert.equal(state, "copied");
    assert.equal(copied, text);
    state = "copying";
    assert.equal(find(AnswerFeedback({ exercise, attempt }), "button").props.disabled, true);
    state = "idle";
    setNavigator({ clipboard: { async writeText() { throw new Error("Permission denied"); } } });
    await find(AnswerFeedback({ exercise, attempt }), "button").props.onClick();
    assert.equal(state, "manual", "Never claim success if clipboard rejects");
    const fallback = find(AnswerFeedback({ exercise, attempt }), "textarea");
    assert.equal(fallback.props.value, text);
    assert.equal(fallback.props.readOnly, true);
    let selected = false;
    fallback.props.onFocus({ currentTarget: { select() { selected = true; } } });
    assert.equal(selected, true);
    setNavigator({});
    assert.equal(await copyExerciseText(text), false, "Unsupported clipboard uses manual fallback");
  } finally {
    React.useState = originalUseState;
    if (originalNavigator) Object.defineProperty(globalThis, "navigator", originalNavigator);
    else delete globalThis.navigator;
  }
  console.log("Exercise copy text, submitted UI, clipboard success/rejection and manual fallback passed.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
