/* eslint-disable @typescript-eslint/no-require-imports -- Load local TS components in regression tests. */
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const assert = require("node:assert/strict");
const resolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
  return resolve.call(this, request.startsWith("@/") ? path.resolve(__dirname, "..", request.slice(2)) : request, ...args);
};
require.extensions[".ts"] = require.extensions[".tsx"] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename);
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { unlearnedVocabularyWords } = require("../lib/vocabulary-copy.ts");
const VocabularyCopy = require("../app/vocabulary-copy.tsx").default;
const items = [
  { id: "a", word: "社交的", thai: "เข้ากับคนง่าย", reading: "しゃこうてき" },
  { id: "b", word: " 利く ", thai: "ใช้ได้", japaneseMeaning: "働きがある" },
  { id: "b", word: "利く", thai: "ซ้ำการ์ดเดิม" },
  { id: "c", word: "融通", thai: "ความยืดหยุ่น" },
  { id: "empty", word: "  ", thai: "" },
];
assert.deepEqual(unlearnedVocabularyWords(items, ["a", "other-lesson"]), ["利く", "融通"]);
assert.deepEqual(unlearnedVocabularyWords(items, ["a", "b", "c"]), []);
assert.deepEqual(unlearnedVocabularyWords([], []), []);
assert.equal(unlearnedVocabularyWords(items, ["a"]).join("\n"), "利く\n融通");
assert.deepEqual(unlearnedVocabularyWords([items[0], { ...items[0], id: "another-card" }], ["a"]), ["社交的"], "Learned is tracked per card, not spelling");
const markup = renderToStaticMarkup(React.createElement(VocabularyCopy, { words: ["利く", "融通"] }));
assert.ok(markup.includes("คัดลอกศัพท์ที่ยังไม่เรียน"));
assert.ok(markup.includes("2 คำ"));
assert.ok(!markup.includes("disabled="));
const emptyMarkup = renderToStaticMarkup(React.createElement(VocabularyCopy, { words: [] }));
assert.ok(emptyMarkup.includes("disabled="));
assert.ok(emptyMarkup.includes('role="status"'));
console.log("Validated unlearned-only vocabulary copy, lesson order, card deduplication and empty UI.");
