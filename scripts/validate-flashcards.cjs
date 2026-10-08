/* eslint-disable @typescript-eslint/no-require-imports -- Test TypeScript helpers and component interactions without a browser. */
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
const { markVocabularyLearned, unlearnedVocabulary } = require("../lib/vocabulary-flashcards.ts");
const Flashcards = require("../app/vocabulary-flashcards.tsx").default;
const items = [
  { id: "one", word: "利く", reading: "きく", japaneseMeaning: "役に立つ働きをする。", thai: "ได้ผล ใช้การได้" },
  { id: "two", word: "社交的", reading: "しゃこうてき", thai: "ชอบเข้าสังคม" },
  { id: "three", word: "Known", japaneseMeaning: "already known", thai: "รู้แล้ว" },
];
const original = { learnedIds: ["three", "other-lesson"], attempts: [{ exerciseId: "old" }], lastSection: "vocabulary", lastLessonId: "lesson-one", showThai: false, updatedAt: "old" };
assert.deepEqual(unlearnedVocabulary([...items, items[0]], original.learnedIds).map((item) => item.id), ["one", "two"]);
const added = markVocabularyLearned(original, "one");
assert.deepEqual(original.learnedIds, ["three", "other-lesson"]);
assert.deepEqual(added.learnedIds, ["three", "other-lesson", "one"]);
assert.deepEqual(markVocabularyLearned(added, "one").learnedIds, added.learnedIds, "Correct twice never toggles learned off");
assert.equal(added.attempts, original.attempts);
assert.equal(added.lastLessonId, original.lastLessonId);
const firstMarkup = renderToStaticMarkup(React.createElement(Flashcards, { items, learnedIds: original.learnedIds, showThai: false, async onLearned() { return true; } }));
assert.ok(firstMarkup.includes(items[0].japaneseMeaning));
assert.ok(!firstMarkup.includes(items[0].word), "Front must not show answer word");
assert.ok(!firstMarkup.includes(items[0].reading), "Front must not show reading");
assert.ok(!firstMarkup.includes("ตอบได้ · เก็บในเรียนรู้แล้ว"), "Must reveal before rating");
assert.ok(!firstMarkup.includes('class="flashcard-known"'), "Rating buttons are hidden before flipping");
assert.ok(firstMarkup.includes("เปิดแฟลชการ์ดจอใหญ่"));
const thaiMarkup = renderToStaticMarkup(React.createElement(Flashcards, { items, learnedIds: original.learnedIds, showThai: true, async onLearned() { return true; } }));
assert.ok(thaiMarkup.includes(items[0].thai));
const emptyMarkup = renderToStaticMarkup(React.createElement(Flashcards, { items: [], learnedIds: [], showThai: false, async onLearned() { return true; } }));
assert.ok(emptyMarkup.includes("ยังไม่เรียนรู้ 0 คำ"));
assert.ok(emptyMarkup.includes("Lesson นี้ยังไม่มีคำศัพท์"));
const allLearned = renderToStaticMarkup(React.createElement(Flashcards, { items, learnedIds: items.map((item) => item.id), showThai: false, async onLearned() { return true; } }));
assert.ok(allLearned.includes("เรียนรู้คำในบทนี้ครบแล้ว"));

function flatten(element) {
  if (!element || typeof element !== "object") return [];
  return [element, ...[element.props?.children].flat(Infinity).flatMap(flatten)];
}
function label(element) {
  if (Array.isArray(element)) return element.map(label).join("");
  if (element && typeof element === "object") return label(element.props?.children);
  return element == null ? "" : String(element);
}
async function main() {
  const originalState = React.useState;
  const originalRef = React.useRef;
  const originalEffect = React.useEffect;
  const originalCallback = React.useCallback;
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  const originalElement = Object.getOwnPropertyDescriptor(globalThis, "Element");
  let effects = [];
  let keyboardCleanup;
  const listeners = new Set();
  let openDialog = null;
  class FakeElement {
    constructor(editable = false, interactive = false, action = false) { this.editable = editable; this.interactive = interactive; this.action = action; }
    closest(selector) {
      if (selector === "button, a, [role='button']") return this.interactive ? this : null;
      if (selector === "[data-flashcard-action]") return this.action ? this : null;
      return this.editable ? this : null;
    }
  }
  Object.defineProperty(globalThis, "Element", { configurable: true, value: FakeElement });
  Object.defineProperty(globalThis, "document", { configurable: true, value: {
    body: { style: { overflow: "scroll" } },
    querySelector() { return openDialog; },
    addEventListener(type, listener) { assert.equal(type, "keydown"); listeners.add(listener); },
    removeEventListener(type, listener) { assert.equal(type, "keydown"); listeners.delete(listener); },
  } });
  const slots = [];
  let cursor = 0;
  let tree;
  let progress = original;
  let success = false;
  let calls = 0;
  let release;
  React.useState = (initial) => {
    const key = cursor++;
    if (!(key in slots)) slots[key] = typeof initial === "function" ? initial() : initial;
    return [slots[key], (next) => { slots[key] = typeof next === "function" ? next(slots[key]) : next; }];
  };
  React.useRef = (initial) => {
    const key = cursor++;
    if (!(key in slots)) slots[key] = { current: initial };
    return slots[key];
  };
  React.useEffect = (callback) => { effects.push(callback); };
  React.useCallback = (callback) => callback;
  function render() {
    keyboardCleanup?.();
    effects = [];
    cursor = 0;
    tree = Flashcards({ items, learnedIds: progress.learnedIds, showThai: false, async onLearned(id) {
      calls++;
      if (!success) return false;
      if (release === "defer") await new Promise((resolve) => { release = resolve; });
      progress = markVocabularyLearned(progress, id);
      return true;
    } });
    keyboardCleanup = effects[1]();
    assert.equal(listeners.size, 1, "Renders replace the listener instead of accumulating handlers");
  }
  function key(key, extra = {}) {
    const event = { key, target: new FakeElement(), defaultPrevented: false, repeat: false, isComposing: false, preventDefault() { this.defaultPrevented = true; }, ...extra };
    for (const listener of listeners) listener(event);
    return event;
  }
  async function flush() { await Promise.resolve(); await Promise.resolve(); }
  function button(name) {
    return flatten(tree).find((node) => node.type === "button" && label(node).includes(name));
  }
  try {
    render();
    assert.equal(key("ArrowLeft").defaultPrevented, false, "Hidden answers cannot be rated");
    assert.equal(key("ArrowRight").defaultPrevented, false);
    assert.equal(calls, 0);
    assert.equal(button("พลิกดูคำศัพท์").props["aria-keyshortcuts"], "Space ArrowUp");
    assert.ok(label(button("พลิกดูคำศัพท์")).includes("Spacebar"));
    assert.equal(key("Enter").defaultPrevented, false, "Enter is no longer a global reveal shortcut");
    for (const extra of [{ repeat: true }, { isComposing: true }, { ctrlKey: true }, { metaKey: true }, { altKey: true }, { shiftKey: true }, { defaultPrevented: true }, { target: new FakeElement(true) }, { target: new FakeElement(false, true) }]) key(" ", extra);
    render();
    assert.ok(button("พลิกดูคำศัพท์"), "Spacebar guards preserve the hidden front and unrelated controls");
    for (const extra of [{ repeat: true }, { isComposing: true }, { ctrlKey: true }, { metaKey: true }, { altKey: true }, { shiftKey: true }, { defaultPrevented: true }, { target: new FakeElement(true) }, { target: new FakeElement(false, true) }]) key("ArrowUp", extra);
    render();
    assert.ok(button("พลิกดูคำศัพท์"), "Up-arrow guards preserve hidden front");
    openDialog = {};
    assert.equal(key(" ").defaultPrevented, false, "Another modal blocks Spacebar too");
    openDialog = null;
    button("จอใหญ่").props.onClick(); render();
    let dialog = flatten(tree).find((node) => node.type === "dialog");
    assert.ok(dialog.props.children, "Large mode moves card content into modal");
    assert.ok(label(tree).includes("การ์ด 1/2"));
    let opened = 0;
    let closed = 0;
    const modal = { open: false, showModal() { this.open = true; opened++; }, close() { this.open = false; closed++; } };
    dialog.props.ref.current = modal;
    const cleanup = effects[0]();
    assert.equal(opened, 1);
    assert.equal(document.body.style.overflow, "hidden");
    button("ย่อกลับ").props.onClick(); render(); cleanup();
    assert.equal(closed, 1);
    assert.equal(document.body.style.overflow, "scroll", "Closing restores original scroll style");
    assert.ok(button("จอใหญ่"));
    assert.equal(key("ArrowUp", { target: new FakeElement(false, true, true) }).defaultPrevented, true, "Up arrow reveals in normal mode without scrolling");
    render();
    assert.ok(label(tree).includes("利く"));
    key("ArrowUp"); key("ArrowUp", { repeat: true }); render();
    assert.ok(label(tree).includes("利く"), "Up arrow on the back keeps the current face");
    assert.equal(calls, 0, "Up arrow never rates a card");
    key(" ", { target: new FakeElement(false, true, true) });
    key(" ", { repeat: true }); render();
    assert.equal(calls, 0, "Spacebar on revealed rating buttons never marks learned");
    assert.ok(label(tree).includes("利く"), "Repeated Spacebar keeps the same revealed card");
    assert.equal(button("ยังจำไม่ได้").props.className, "flashcard-unknown");
    assert.equal(button("ตอบได้").props.className, "flashcard-known");
    const ratings = flatten(tree).filter((node) => node.props?.className === "flashcard-known" || node.props?.className === "flashcard-unknown");
    assert.deepEqual(ratings.map((node) => node.props.className), ["flashcard-unknown", "flashcard-known"], "Red button is left, green button is right");
    assert.deepEqual(ratings.map((node) => node.props["aria-keyshortcuts"]), ["ArrowLeft", "ArrowRight"], "Keyboard mapping matches red-left and green-right buttons");
    for (const extra of [{ repeat: true }, { isComposing: true }, { ctrlKey: true }, { metaKey: true }, { altKey: true }, { shiftKey: true }, { defaultPrevented: true }, { target: new FakeElement(true) }]) {
      key("ArrowLeft", extra);
      key("ArrowRight", extra);
    }
    assert.equal(calls, 0, "Held keys, composing, modifiers and editable targets never rate");
    assert.equal(key("ArrowDown").defaultPrevented, false, "Unrelated keys retain their browser action");
    openDialog = {};
    assert.equal(key("ArrowLeft").defaultPrevented, false, "Another modal blocks flashcard shortcuts");
    openDialog = null;
    button("จอใหญ่").props.onClick(); render();
    assert.ok(label(tree).includes("利く"), "Expanding preserves revealed face");
    dialog = flatten(tree).find((node) => node.type === "dialog");
    dialog.props.onCancel(); render();
    assert.ok(button("จอใหญ่"), "Escape/cancel exits large mode");
    assert.ok(label(tree).includes("利く"), "Closing preserves same card and face");
    button("จอใหญ่").props.onClick(); render();
    openDialog = modal;
    assert.equal(key("ArrowLeft").defaultPrevented, true, "Left arrow skips in large mode");
    key("ArrowLeft");
    render();
    assert.equal(calls, 0, "Unknown never marks learned");
    assert.ok(label(tree).includes("ชอบเข้าสังคม"), "Missing Japanese uses Thai definition");
    assert.ok(label(tree).includes("การ์ด 2/2"), "Duplicate key events cannot skip more than one card");
    key(" ", { repeat: true }); render();
    assert.ok(button("พลิกดูคำศัพท์"), "Held Spacebar cannot reveal the next card");
    assert.equal(key("ArrowUp").defaultPrevented, true, "Up arrow reveals the next card in large mode without scrolling"); render();
    assert.ok(label(tree).includes("社交的"));
    button("ย่อกลับ").props.onClick(); render();
    openDialog = null;
    assert.equal(key("ArrowRight").defaultPrevented, true, "Right arrow marks learned in normal mode");
    await flush(); render();
    assert.ok(label(tree).includes("บันทึกไม่สำเร็จ"));
    assert.ok(label(tree).includes("社交的"), "Failure retains current card");
    assert.ok(!progress.learnedIds.includes("two"));
    success = true;
    release = "defer";
    const pending = button("ตอบได้").props.onClick(); render();
    assert.equal(button("กำลังบันทึก").props.disabled, true);
    key("ArrowLeft"); key("ArrowRight"); key(" ");
    await button("กำลังบันทึก").props.onClick();
    assert.equal(calls, 2, "Rapid duplicate click calls saver only once");
    release(); await pending; render();
    assert.ok(progress.learnedIds.includes("two"));
    assert.ok(label(tree).includes("จบรอบนี้แล้ว"));
    assert.ok(label(tree).includes("ยังไม่เรียนรู้ 1 คำ"));
    button("ทวนคำที่ยังจำไม่ได้").props.onClick(); render();
    assert.ok(label(tree).includes("การ์ด 1/1"));
    button("พลิกดูคำศัพท์").props.onClick(); render();
    assert.ok(label(tree).includes("利く"));
    button("จอใหญ่").props.onClick(); render();
    openDialog = modal;
    assert.equal(key("ArrowRight").defaultPrevented, true, "Right arrow also saves in large mode");
    await flush(); render();
    assert.ok(label(tree).includes("เรียนรู้คำในบทนี้ครบแล้ว"));
    assert.deepEqual(progress.learnedIds, ["three", "other-lesson", "two", "one"]);
    assert.equal(key(" ").defaultPrevented, false, "Completed decks do not intercept Spacebar");
  } finally {
    keyboardCleanup?.();
    assert.equal(listeners.size, 0, "Unmount removes keyboard listener");
    React.useState = originalState;
    React.useRef = originalRef;
    React.useEffect = originalEffect;
    React.useCallback = originalCallback;
    if (originalDocument) Object.defineProperty(globalThis, "document", originalDocument);
    else delete globalThis.document;
    if (originalElement) Object.defineProperty(globalThis, "Element", originalElement);
    else delete globalThis.Element;
  }
  console.log("Flashcards: Spacebar reveal without scrolling, red-left skip, green-right learned, progress, save failure, modal, input guards and listener cleanup passed.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
