/* eslint-disable @typescript-eslint/no-require-imports -- Load shipped TypeScript catalog data without a build. */
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const assert = require("node:assert/strict");
require.extensions[".ts"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  const testExports = filename === path.resolve(__dirname, "../lib/storage.ts") ? "\nexports.testCatalog = { initialCatalog, mergeBuiltInCatalog };" : "";
  module._compile(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText + testExports, filename);
};
const { initialCatalog, mergeBuiltInCatalog } = require("../lib/storage.ts").testCatalog;
const seed = initialCatalog();
assert.equal(new Set(seed.books.map((item) => item.id)).size, seed.books.length);
assert.equal(new Set(seed.lessons.map((item) => item.id)).size, seed.lessons.length);
for (const book of seed.books) {
  assert.equal(seed.lessons.filter((lesson) => lesson.bookId === book.id).length, book.lessons, book.title);
}
const old = { ...seed.lessons[0], title: "Outdated shipped lesson", exercises: [] };
const edited = { ...seed.lessons[1], title: "User edited lesson", exercises: [] };
const deleted = seed.lessons[2];
const customBook = { ...seed.books[0], id: "user-book", title: "User book", lessons: 1 };
const custom = { ...seed.lessons[0], id: "user-lesson", bookId: customBook.id, title: "User lesson" };
const stored = { books: [seed.books[0], customBook], lessons: [old, edited, custom], editedLessonIds: [edited.id], deletedLessonIds: [deleted.id] };
const merged = mergeBuiltInCatalog(stored);
assert.deepEqual(merged.lessons.find((item) => item.id === old.id), seed.lessons[0]);
assert.deepEqual(merged.lessons.find((item) => item.id === edited.id), edited);
assert.deepEqual(merged.lessons.find((item) => item.id === custom.id), custom);
assert.ok(!merged.lessons.some((item) => item.id === deleted.id));
assert.ok(merged.books.some((item) => item.id === "shin-kanzen-master-n2-goi"));
assert.ok(merged.books.some((item) => item.id === "shin-kanzen-master-n1-bunpou"), "N1 book appears in existing catalogs");
assert.equal(merged.lessons.find((item) => item.id === "shin-kanzen-n1-bunpou-p1-01").exercises.length, 24, "N1 exercises migrate into the existing catalog");
assert.deepEqual(merged.books.find((item) => item.id === customBook.id), customBook);
assert.deepEqual(mergeBuiltInCatalog(merged), merged);
const grammarOne = seed.lessons.find((lesson) => lesson.id === "shin-kanzen-n2-bunpou-p1-01");
const staleGrammar = { ...grammarOne, exercises: grammarOne.exercises.map((exercise) => ({ ...exercise, explanation: "Old explanation" })) };
const refreshedGrammar = mergeBuiltInCatalog({ ...seed, lessons: seed.lessons.map((lesson) => lesson.id === grammarOne.id ? staleGrammar : lesson) });
assert.deepEqual(refreshedGrammar.lessons.find((lesson) => lesson.id === grammarOne.id), grammarOne, "Existing untouched grammar lesson receives new explanations");
const customGrammar = mergeBuiltInCatalog({ ...seed, lessons: [staleGrammar], editedLessonIds: [grammarOne.id] });
assert.deepEqual(customGrammar.lessons.find((lesson) => lesson.id === grammarOne.id), staleGrammar, "User-edited grammar lessons are never overwritten");
const n2Book = seed.books.find((item) => item.id === "shin-kanzen-master-n2-goi");
assert.equal(n2Book.title, "新完全マスター 語彙 日本語能力試験 N2");
const renamed = mergeBuiltInCatalog({ ...seed, books: seed.books.map((item) => item.id === n2Book.id ? { ...item, title: "新完全マスター 語彙 日本語能力試験 N2" } : item) });
assert.equal(renamed.books.find((item) => item.id === n2Book.id).title, n2Book.title);
const shortTitle = mergeBuiltInCatalog({ ...seed, books: seed.books.map((item) => item.id === n2Book.id ? { ...item, title: "新完全 マスター" } : item) });
assert.equal(shortTitle.books.find((item) => item.id === n2Book.id).title, n2Book.title, "Previously saved short title receives the consistent N2 vocabulary title");
assert.deepEqual(shortTitle.lessons, seed.lessons, "Renaming the book preserves all lessons");
const personalized = mergeBuiltInCatalog({ ...seed, books: seed.books.map((item) => item.id === n2Book.id ? { ...item, title: "My N2 book" } : item) });
assert.equal(personalized.books.find((item) => item.id === n2Book.id).title, "My N2 book");
console.log("Catalog seeds, lesson counts, refresh, user edits, deletions and idempotence passed.");
