/* eslint-disable @typescript-eslint/no-require-imports -- Validate shipped TypeScript through a require hook. */
const fs = require("node:fs");
const ts = require("typescript");
const assert = require("node:assert/strict");
const path = require("node:path");
const Module = require("node:module");
const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
  return resolveFilename.call(this, request.startsWith("@/") ? path.resolve(__dirname, "..", request.slice(2)) : request, ...args);
};
require.extensions[".ts"] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const { grammarN1Book, grammarN1Lessons } = require("../lib/grammar-n1-book.ts");
const { grammarLessons } = require("../lib/grammar-book.ts");
const { grammarN1OneExercises } = require("../lib/grammar-n1-one-exercises.ts");
const { validateLessonImport, analyzeLessonImport } = require("../lib/import-validator.ts");
const { GET } = require("../app/api/lesson-template/route.ts");
assert.equal(grammarN1Book.jlptLevel, "N1");
assert.equal(grammarN1Book.lessons, 44);
assert.equal(grammarN1Lessons.length, 44);
assert.equal(new Set(grammarN1Lessons.map((lesson) => lesson.id)).size, 44);
assert.ok(grammarN1Lessons.every((lesson) => lesson.bookId === grammarN1Book.id));
assert.equal(grammarN1Lessons[0].contentStatus, "imported");
assert.deepEqual(grammarN1Lessons[0].sourcePages, [8, 9, 10, 11]);
assert.equal(grammarN1Lessons[0].grammarPatterns.length, 6);
const imported = grammarN1Lessons.filter((lesson) => lesson.contentStatus === "imported");
assert.equal(imported.length, 38);
assert.ok(grammarN1Lessons.filter((lesson) => lesson.contentStatus === "index_only").every((lesson) => !lesson.exercises.length), "Do not claim untranscribed lessons are imported");
// Independently read from 別冊 page 2, PDF page 194.
const key = "b a c | b b c | c b c | a b b | b a c | b a c | a b b c a a".replaceAll("|", "").trim().split(/\s+/).map((letter) => String(letter.charCodeAt(0) - 96));
assert.equal(grammarN1OneExercises.length, 24);
assert.deepEqual(grammarN1OneExercises.map((exercise) => exercise.answer), key);
const chapterKeys = [
  key,
  "a c b a b | c a b | a b c | a b c b | c c b | a a c c b",
  "c a b | a c c | b a c | a a b | b a | a b a b c",
  "b c a b | b a c | a b b a | b c a | b a b c b",
  "c c b a | a b c a | a b c c | a b c | c a b a | a b c c",
  "b a b c | c a b | a b b c a | b c a a | a c b c | a c b c",
  "b a c | c a b | b a a | c c a",
  "c b b | a c c a | c a b a | b a c | a c c | a c c b b a b",
  "b c c | c c b b | a b a b b | a c a | b c a b | c a b c a",
  "b b c a b | c c a c | a c c a | b a c a | c b b c | a a c",
  "b a a b | a c a | b a b | c a c",
  "b c c a c | c b a b | a b a c | b c a | c | a a c b c",
  "c a c | b a a a b | b a b c c | a b a | a b c | a a | a c b c",
  "c a b a | c a b b | a a c | c a b | a b b | a b c b c",
  "b b c a | a b a | c b a b | c a c b",
  "a c a a | b c | a b c | c b b a | b c a",
  "a c b a | c c b a | a b | a b c | b c | c c | a b b b a c",
  "b a c | b a c c | a a c | c a b | a a c | a b b c c",
  "c a c | b a b | a c a c | c c c a | c a a c | a c a | a c a c c",
  "c c b | a b c | c b c | a c b a | c b | c b a | b c b c a c",
];
for (const [index, answers] of chapterKeys.entries()) {
  const expected = typeof answers === "string" ? answers.replaceAll("|", "").trim().split(/\s+/).map((letter) => String(letter.charCodeAt(0) - 96)) : answers;
  assert.deepEqual(grammarN1Lessons[index].exercises.filter((exercise) => !exercise.group.startsWith("問題（")).map((exercise) => exercise.answer), expected, `Chapter ${index + 1} original keys`);
}
assert.deepEqual(grammarN1Lessons[3].exercises.filter((exercise) => exercise.group === "問題（1課～4課）").map((exercise) => exercise.answer), "1 1 3 2 4 4 3 4 4 3 3 4 2 1 4".split(" "));
assert.deepEqual(grammarN1Lessons[7].exercises.filter((exercise) => exercise.group === "問題（1課～8課）").map((exercise) => exercise.answer), "1 1 2 4 4 2 1 4 4 2 4 1 2 3 1".split(" "));
assert.deepEqual(grammarN1Lessons[11].exercises.filter((exercise) => exercise.group === "問題（1課～12課）").map((exercise) => exercise.answer), "3 3 2 1 1 2 3 4 2 3 2 1 4 1 4".split(" "));
assert.deepEqual(grammarN1Lessons[15].exercises.filter((exercise) => exercise.group === "問題（1課～16課）").map((exercise) => exercise.answer), "4 1 2 1 4 2 1 2 1 4 2 2 1 3 3".split(" "));
assert.deepEqual(grammarN1Lessons[19].exercises.filter((exercise) => exercise.group === "問題（1課～20課）").map((exercise) => exercise.answer), "2 4 3 2 4 3 2 3 3 1 4 2 4 1 1".split(" "));
assert.deepEqual(grammarN1Lessons[20].exercises.filter((exercise) => exercise.type === "text").map((exercise) => exercise.answer), ["に即した", "をおして", "にかまけて", "を経て", "をかねて", "に即して", "をかねた", "にかかわる", "にひきかえ", "に照らして", "にかこつけて", "を踏まえて", "にひかえて", "にまつわる", "にひかえた"]);
assert.deepEqual(grammarN1Lessons[20].exercises.filter((exercise) => exercise.type === "choice").map((exercise) => exercise.answer), "3 2 6 7 4 5 1 2 1 5 3 4".split(" "));
assert.deepEqual(grammarN1Lessons[21].exercises.filter((exercise) => exercise.type === "text").map((exercise) => exercise.answer), ["には当たらない", "の至りです", "に至って", "はばからない", "に至っては", "かなわない", "に忍びない", "に恥じない", "を禁じ得ない", "に至る"]);
assert.deepEqual(grammarN1Lessons[21].exercises.filter((exercise) => exercise.type === "choice").map((exercise) => exercise.answer), "5 1 4 2 3".split(" "));
assert.deepEqual(grammarN1Lessons[22].exercises.filter((exercise) => exercise.type === "choice").map((exercise) => exercise.answer), "3 1 2 7 4 5 6".split(" "));
assert.deepEqual(grammarN1Lessons[22].exercises.filter((exercise) => exercise.type === "text").map((exercise) => exercise.answer), ["つらかろう", "しよう／すまい", "許す", "せ", "とどまら", "負ける", "与える", "言わ", "せ", "打ち明けよう／打ち明けまい"]);
assert.deepEqual(grammarN1Lessons[23].exercises.map((exercise) => exercise.answer), "2 2 1 2 4 3 3 4 3 1".split(" "));
assert.deepEqual(grammarN1Lessons[24].exercises.filter((exercise) => exercise.type === "text").map((exercise) => exercise.answer), ["捨てるなりほかの人にあげるなり", "あったらあったで", "泣くに泣けない", "浮きつ沈みつ", "遅かれ早かれ", "景色の素晴らしさといい人々の優しさといい"]);
assert.deepEqual(grammarN1Lessons[24].exercises.filter((exercise) => exercise.type === "choice").map((exercise) => exercise.answer), "1 2 3 4 3".split(" "));
assert.deepEqual(grammarN1Lessons[25].exercises.filter((exercise) => exercise.type === "choice").map((exercise) => exercise.answer), "1 2 3 2 2".split(" "));
assert.deepEqual(grammarN1Lessons[25].exercises.filter((exercise) => exercise.type === "text").map((exercise) => exercise.answer), ["にて", "やら", "をもって", "だに", "こそ", "より", "すら", "にて", "にして", "とて"]);
assert.deepEqual(grammarN1Lessons[26].exercises.map((exercise) => exercise.answer), "1 2 2 2 1 1 1 2 2 1 2 1 1 2".split(" "));
const assemblyKeys = ["4 2 3 4 3 1 4 1 3 4 1 3", "3 1 3 2 4 1 3 3 2 4 3 4", "4 4 2 2 1 4 2 4 1 1 4 4"];
const assemblyOrders = [
  ["1 3 4 2", "1 4 2 3", "4 1 3 2", "3 1 4 2", "4 1 3 2", "3 2 1 4", "3 2 4 1", "3 2 1 4", "1 4 3 2", "3 2 4 1", "2 4 1 3", "1 4 3 2"],
  ["4 1 3 2", "2 3 1 4", "4 1 3 2", "1 4 2 3", "2 1 4 3", "2 3 1 4", "2 1 3 4", "1 4 3 2", "1 3 2 4", "1 2 4 3", "1 4 3 2", "2 1 4 3"],
  ["1 3 4 2", "2 1 4 3", "1 3 2 4", "1 4 2 3", "2 4 1 3", "3 1 4 2", "1 3 2 4", "1 3 4 2", "2 4 1 3", "2 3 1 4", "1 3 4 2", "3 1 4 2"],
];
const expectedAssemblySentences = new Map();
assemblyKeys.forEach((answers, index) => {
  const exercises = grammarN1Lessons[27 + index].exercises;
  assert.deepEqual(exercises.map((exercise) => exercise.answer), answers.split(" "));
  exercises.forEach((exercise, number) => {
    const order = assemblyOrders[index][number].split(" ");
    assert.equal(order[2], exercise.answer);
    expectedAssemblySentences.set(exercise.id, exercise.prompt.replace("＿＿ ＿＿ ★ ＿＿", order.map((id) => exercise.choices.find((choice) => choice.id === id).label).join("")));
  });
});
assert.deepEqual(grammarN1Lessons[30].exercises.filter((exercise) => exercise.type === "choice").map((exercise) => exercise.answer), "2 2 2 2 1 1 1 2 2 2 2 2 2 4 2 3 1".split(" "));
assert.deepEqual(grammarN1Lessons[30].exercises.filter((exercise) => exercise.type === "text").map((exercise) => exercise.answer), ["約束する", "思った", "選んでいれば", "なかった", "できなかった", "済ませていた", "流行する", "行く", "するべきだった", "行っていたら", "いじめられる", "いじめられた", "助かった", "ならなかった", "検討している", "出ていない"]);
assert.deepEqual(grammarN1Lessons[31].exercises.map((exercise) => exercise.answer), "1 2 2 1 2 1 1 2 2 2 1 1 1 2 4 3 1".split(" "));
assert.deepEqual(grammarN1Lessons[32].exercises.map((exercise) => exercise.answer), "2 1 2 1 1 2 2 1 2 2 1 2 1 2 1 1 2 1 1 1 1 1 1 1 1 2 1 2 1 2 1 1 2 1 3 4 1".split(" "));
assert.deepEqual(grammarN1Lessons[33].exercises.map((exercise) => exercise.answer), "2 1 1 2 1 2 1 2 1 2 1 1 1 1 1 2 2 2 1 1 2 1 1 2 2 3 1 1 4 2".split(" "));
assert.deepEqual(grammarN1Lessons[34].exercises.filter((exercise) => exercise.type === "choice").map((exercise) => exercise.answer), "4 3 4 2 3".split(" "));
assert.deepEqual(grammarN1Lessons[34].exercises.filter((exercise) => exercise.type === "text").map((exercise) => exercise.answer), ["引かれ", "咲かせて", "買って", "食われ", "迫って", "話す", "曇らせ", "心配させられる", "言った", "打たれ", "取らせ", "守る", "取られ", "取られる", "考えさせられる", "に追われ", "に揺られ", "を忘れ", "に／させられ", "報われた", "をさせる", "雇う", "雇用される", "が交わされる", "働かされた", "が／働かない", "を辞めさせる", "連載された", "捨てられた", "に飼われる", "観察する", "を批判した", "を感じさせる", "を思わせる", "評価され"]);
assert.deepEqual(grammarN1Lessons[35].exercises.filter((exercise) => exercise.type === "choice").map((exercise) => exercise.answer), "3 3 3 1 3 3 2 3 2 1 2 4 1 3 1".split(" "));
assert.deepEqual(grammarN1Lessons[35].exercises.filter((exercise) => exercise.type === "text").map((exercise) => exercise.answer), ["もらえる", "くれ", "あげて", "くれる", "もらえなく", "あげる", "くれる", "くれる", "もらう", "くれる", "もらう", "もらう"]);
assert.deepEqual(grammarN1Lessons[36].exercises.map((exercise) => exercise.answer), "2 2 1 1 2 1 2 2 1 1 2 1 2 2 2 2 1 3 2".split(" "));
const allExercises = imported.flatMap((lesson) => lesson.exercises);
assert.deepEqual(grammarN1Lessons[37].exercises.filter((exercise) => exercise.type === "text").map((exercise) => exercise.answer), ["は", "は", "は", "は", "が", "が", ...Array(5).fill("が"), "が", "が", "が", "が", "は", "が", "が", "が", "が", "が", "が", "は", "が", "が", "は", "が", "が", "は", "は", "が"]);
assert.deepEqual(grammarN1Lessons[37].exercises.filter((exercise) => exercise.type === "choice").map((exercise) => exercise.answer), ["1", "2", "1", "3", "1"]);
assert.equal(new Set(allExercises.map((exercise) => exercise.id)).size, allExercises.length);
const headings = ["ประโยคเต็ม:", "คำแปลไทย:", "หลักภาษา:", "ทำไมตอบข้อนี้:", "เทียบตัวเลือกอื่น:", "จำให้เข้าใจ:"];
const n2Ids = new Set(grammarLessons.flatMap((lesson) => lesson.exercises.map((exercise) => exercise.id)));
for (const exercise of allExercises) {
  assert.ok(!n2Ids.has(exercise.id), "N1 must not collide with N2 progress IDs");
  if (exercise.type === "choice") assert.equal(exercise.choices.find((choice) => choice.id === exercise.answer).label, exercise.correctLabel);
  else assert.equal(exercise.answer, exercise.correctLabel);
  assert.equal(exercise.explanationSource, "ai_generated");
  const paragraphs = exercise.explanation.split("\n\n");
  assert.equal(paragraphs.length, 6);
  paragraphs.forEach((paragraph, index) => assert.ok(paragraph.startsWith(headings[index]) && paragraph.length > headings[index].length));
  let answerIndex = 0;
  const answers = exercise.correctLabel.split("／");
  assert.equal(paragraphs[0], `ประโยคเต็ม: ${expectedAssemblySentences.get(exercise.id) ?? exercise.prompt.replace(/（　）/g, () => answers[answerIndex++])}`);
  for (const choice of (exercise.choices ?? []).filter((choice) => choice.id !== exercise.answer)) assert.ok(paragraphs[4].includes(choice.label));
}
const payload = { schema: "shin-kanzen-master-n1-bunpou.lesson", schemaVersion: 1, lesson: grammarN1Lessons[0] };
assert.equal(validateLessonImport(payload), payload);
assert.ok(!analyzeLessonImport(payload).some((issue) => issue.severity === "error" || issue.code === "noncanonical-lesson-id"));
assert.throws(() => validateLessonImport({ ...payload, schema: "shin-kanzen-master-n2-bunpou.lesson" }), /ข้อมูล Book/);
const n2Payload = { schema: "shin-kanzen-master-n2-bunpou.lesson", schemaVersion: 1, lesson: grammarLessons[0] };
assert.equal(validateLessonImport(n2Payload), n2Payload);
assert.ok(!analyzeLessonImport(n2Payload).some((issue) => issue.code === "noncanonical-lesson-id"));
async function checkTemplates() {
  for (const [id, schema, bookId] of [
    ["shin-kanzen-n1-bunpou-p1-01", payload.schema, grammarN1Book.id],
    ["shin-kanzen-n2-bunpou-p1-01", n2Payload.schema, grammarLessons[0].bookId],
  ]) {
    const response = GET(new Request(`http://localhost:3000/api/lesson-template?lessonId=${id}`));
    const template = await response.json();
    assert.equal(template.schema, schema);
    assert.equal(template.lesson.id, id);
    assert.equal(template.lesson.bookId, bookId);
    assert.equal(validateLessonImport(template), template);
  }
  console.log(`N1: 44 catalog lessons, ${imported.length} imported units, ${allExercises.length} original keys, six-part notes, import/template routing and N2 isolation passed.`);
}
checkTemplates().catch((error) => { console.error(error); process.exitCode = 1; });
