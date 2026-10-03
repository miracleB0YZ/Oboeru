"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { book, lesson as lessonOne } from "@/lib/lesson-data";
import { lessonTwo } from "@/lib/lesson-two";
import { analyzeLessonImport, validateLessonImport, type ImportQualityIssue, type LessonImport } from "@/lib/import-validator";
import { catalogRepository, createBackup, emptyProgress, progressRepository, restoreBackup } from "@/lib/storage";
import type { Attempt, Book, Catalog, Exercise, Lesson, Progress } from "@/lib/types";

const seededCatalog: Catalog = { books: [book], lessons: [lessonOne, lessonTwo] };
type Section = Progress["lastSection"];
const navigation: Array<{ id: Section; label: string; icon: string }> = [
  { id: "overview", label: "ภาพรวม", icon: "⌂" },
  { id: "library", label: "คลังหนังสือ", icon: "▤" },
  { id: "vocabulary", label: "คำศัพท์", icon: "あ" },
  { id: "examples", label: "ตัวอย่าง", icon: "文" },
  { id: "exercises", label: "แบบฝึกหัด", icon: "✓" },
];
const percentage = (value: number, total: number) => total ? Math.round(value * 100 / total) : 0;
const normalized = (value: string) => value.normalize("NFKC").trim();
const allVocabulary = (lesson: Lesson) => [...new Map(lesson.vocabularyGroups.flatMap((group) => group.items).map((item) => [item.id, item])).values()];

function ExerciseCard({ exercise, attempt, onAnswer }: { exercise: Exercise; attempt?: Attempt; onAnswer: (value: string) => void }) {
  const [draft, setDraft] = useState("");
  const submitted = Boolean(attempt);
  const sendText = () => { if (!submitted && draft.trim()) onAnswer(draft); };
  return <article className={`exercise-card ${submitted ? (attempt?.correct ? "is-correct" : "is-wrong") : ""}`}>
    {exercise.passage ? <div className="exercise-passage"><strong>ข้อความจากหนังสือ</strong><p lang="ja">{exercise.passage}</p></div> : null}
    <div className="exercise-heading"><span className="eyebrow">{exercise.title}</span>{exercise.points ? <span className="points">{exercise.points} คะแนน</span> : null}</div>
    <p className="exercise-prompt" lang="ja">{exercise.prompt}</p>
    {exercise.type === "choice" ? <div className="choices">{exercise.choices?.map((choice) => <button
      key={choice.id} type="button" disabled={submitted} onClick={() => onAnswer(choice.id)}
      className={`choice ${attempt?.answer === choice.id ? "selected" : ""} ${submitted && exercise.answer === choice.id ? "correct" : ""}`}
    ><span className="choice-key">{choice.id}</span><span lang="ja">{choice.label}</span></button>)}</div> : <form className="text-answer" onSubmit={(event) => { event.preventDefault(); sendText(); }}><input
      lang="ja" value={attempt?.answer ?? draft} disabled={submitted} onChange={(event) => setDraft(event.target.value)}
      onKeyDown={(event) => { if (event.key === "Enter" && event.nativeEvent.isComposing) event.preventDefault(); }}
      placeholder="พิมพ์คำตอบภาษาญี่ปุ่น" aria-label={`คำตอบ ${exercise.title}`}
    /><button type="submit" disabled={submitted || !draft.trim()}>ตรวจคำตอบ</button><span>{exercise.hint ?? "กด Enter หรือปุ่มตรวจคำตอบเพื่อส่งคำตอบครั้งเดียว"}</span></form>}
    {attempt ? <div className={`feedback ${attempt.correct ? "correct" : "wrong"}`} aria-live="polite">
      <div className="feedback-title"><strong>{attempt.correct ? "ถูกต้อง" : "ผิด — ข้อนี้ล็อกแล้ว"}</strong><span>เฉลย: <span lang="ja">{exercise.correctLabel}</span></span></div>
      <p>{exercise.explanation}</p><small className="source-badge">{exercise.explanationSource === "original" ? "อ้างอิงคำอธิบายจากเฉลย" : "คำอธิบายเพิ่มเติม · AI-generated"}</small>
    </div> : null}
  </article>;
}

export default function OboeruApp() {
  const [catalog, setCatalog] = useState<Catalog>(seededCatalog);
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const progressRef = useRef(progress);
  const [section, setSection] = useState<Section>("overview");
  const [lessonId, setLessonId] = useState(lessonOne.id);
  const [selectedBookId, setSelectedBookId] = useState(book.id);
  const [showThai, setShowThai] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<"all" | Book["category"]>("all");
  const [filter, setFilter] = useState<"all" | "basic" | "practical">("all");
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const answering = useRef(new Set<string>());
  const fileRef = useRef<HTMLInputElement>(null);
  const lessonFileRef = useRef<HTMLInputElement>(null);
  const [importPreview, setImportPreview] = useState<{ data: LessonImport; issues: ImportQualityIssue[] } | null>(null);
  const [importAccepted, setImportAccepted] = useState(false);

  useEffect(() => {
    Promise.all([progressRepository.get(), catalogRepository.get()]).then(([stored, available]) => {
      progressRef.current = stored;
      setProgress(stored);
      setCatalog(available);
      setSection(stored.lastSection);
      if (available.lessons.some((item) => item.id === stored.lastLessonId)) {
        setLessonId(stored.lastLessonId!);
        setSelectedBookId(available.lessons.find((item) => item.id === stored.lastLessonId)?.bookId ?? book.id);
      }
      setShowThai(stored.showThai ?? false);
      setReady(true);
    }).catch(() => { setNotice("ไม่สามารถเปิด IndexedDB ได้ กรุณาตรวจสิทธิ์การจัดเก็บของเบราว์เซอร์"); setReady(true); });
  }, []);

  const lessons = catalog.lessons;
  const activeLesson = lessons.find((item) => item.id === lessonId) ?? lessonOne;
  const selectedBook = catalog.books.find((item) => item.id === selectedBookId) ?? book;
  const vocab = allVocabulary(activeLesson);
  const learned = vocab.filter((item) => progress.learnedIds.includes(item.id)).length;
  const attempts = useMemo(() => new Map(progress.attempts.map((item) => [item.exerciseId, item])), [progress.attempts]);
  const answered = activeLesson.exercises.filter((item) => attempts.has(item.id)).length;
  const correct = activeLesson.exercises.filter((item) => attempts.get(item.id)?.correct).length;
  const bookLessons = lessons.filter((item) => item.bookId === selectedBookId);
  const bookLearned = bookLessons.reduce((sum, item) => sum + allVocabulary(item).filter((word) => progress.learnedIds.includes(word.id)).length, 0);
  const bookVocabulary = bookLessons.reduce((sum, item) => sum + allVocabulary(item).length, 0);
  const lastBookLesson = [...bookLessons].sort((a, b) => b.number - a.number)[0];
  const nextTemplateNumber = (lastBookLesson?.number ?? 0) + 1;
  const templateUrl = `/api/lesson-template?number=${nextTemplateNumber}&chapterNumber=${lastBookLesson?.chapterNumber ?? 1}&chapter=${encodeURIComponent(lastBookLesson?.chapter ?? "1章 人間")}`;

  async function save(next: Progress) {
    progressRef.current = next;
    setProgress(next);
    try { await progressRepository.save(next); } catch { setNotice("บันทึกข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง"); }
  }
  async function go(nextSection: Section, nextLessonId = lessonId) {
    setSection(nextSection);
    setLessonId(nextLessonId);
    setSelectedBookId(lessons.find((item) => item.id === nextLessonId)?.bookId ?? selectedBookId);
    setFilter("all");
    await save({ ...progressRef.current, lastSection: nextSection, lastLessonId: nextLessonId, showThai, updatedAt: new Date().toISOString() });
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  async function toggleTranslation() {
    const next = !showThai;
    setShowThai(next);
    await save({ ...progressRef.current, showThai: next, updatedAt: new Date().toISOString() });
  }
  async function toggleLearned(id: string) {
    const current = progressRef.current;
    const learnedIds = current.learnedIds.includes(id) ? current.learnedIds.filter((item) => item !== id) : [...current.learnedIds, id];
    await save({ ...current, learnedIds, updatedAt: new Date().toISOString() });
  }
  async function answer(exercise: Exercise, value: string) {
    const current = progressRef.current;
    if (current.attempts.some((item) => item.exerciseId === exercise.id) || answering.current.has(exercise.id)) return;
    answering.current.add(exercise.id);
    const answerValue = normalized(value);
    const accepted = [exercise.answer, ...(exercise.acceptedAnswers ?? [])].map(normalized);
    const attempt: Attempt = { id: exercise.id, exerciseId: exercise.id, answer: answerValue, correct: accepted.includes(answerValue), attemptedAt: new Date().toISOString() };
    await save({ ...current, attempts: [...current.attempts, attempt], updatedAt: new Date().toISOString() });
  }
  function exportBackup() {
    const payload = JSON.stringify(createBackup(progressRef.current, catalog), null, 2);
    const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
    const link = document.createElement("a"); link.href = url; link.download = `oboeru-backup-${new Date().toISOString().slice(0, 10)}.json`; link.click();
    URL.revokeObjectURL(url);
    setNotice("ส่งออกข้อมูลสำรองแล้ว");
  }
  async function importBackup(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return;
    try {
      const restored = await restoreBackup(JSON.parse(await file.text()));
      setCatalog(restored.catalog);
      progressRef.current = restored.progress; setProgress(restored.progress); setSection(restored.progress.lastSection);
      const restoredLesson = restored.catalog.lessons.find((item) => item.id === restored.progress.lastLessonId) ?? restored.catalog.lessons[0];
      setLessonId(restoredLesson?.id ?? lessonOne.id);
      setSelectedBookId(restoredLesson?.bookId ?? restored.catalog.books[0]?.id ?? book.id);
      setShowThai(restored.progress.showThai ?? false);
      setNotice("กู้คืนข้อมูลสำเร็จ");
    } catch (error) { setNotice(error instanceof Error ? error.message : "นำเข้าไฟล์ไม่สำเร็จ"); }
    event.target.value = "";
  }

  async function saveCatalog(next: Catalog) {
    const consistent = { ...next, books: next.books.map((item) => ({ ...item, lessons: next.lessons.filter((entry) => entry.bookId === item.id).length })) };
    await catalogRepository.save(consistent);
    setCatalog(consistent);
  }
  async function createBook(form: FormData) {
    const title = String(form.get("title") ?? "").trim();
    const category = String(form.get("category") ?? "Vocabulary") as Book["category"];
    const jlptLevel = String(form.get("jlptLevel") ?? "N1") as Book["jlptLevel"];
    if (!title) return;
    const id = `personal-book-${catalog.books.length + 1}`;
    const next: Book = { id, title, category, jlptLevel, lessons: 0 };
    await saveCatalog({ ...catalog, books: [...catalog.books, next] });
    setSelectedBookId(id);
    setCategoryFilter(category);
    setNotice(`เพิ่มหนังสือ “${title}” แล้ว`);
  }
  async function createEmptyLesson(form: FormData) {
    const title = String(form.get("title") ?? "").trim();
    const chapter = String(form.get("chapter") ?? "").trim();
    const chapterNumber = Number(form.get("chapterNumber"));
    const number = Number(form.get("number"));
    if (!title || !chapter || !Number.isInteger(chapterNumber) || chapterNumber < 1 || !Number.isInteger(number) || number < 1) { setNotice("กรอกชื่อบทและหมายเลข Lesson ให้ครบ"); return; }
    if (catalog.lessons.some((item) => item.bookId === selectedBookId && item.chapterNumber === chapterNumber && item.number === number)) { setNotice("Lesson หมายเลขนี้มีอยู่แล้วในบทนี้"); return; }
    const empty: Lesson = { id: `${selectedBookId}-chapter-${chapterNumber}-lesson-${number}`, bookId: selectedBookId, chapterNumber, chapter, number, title, contentStatus: "empty", vocabularyGroups: [], examples: [], exercises: [] };
    await saveCatalog({ ...catalog, lessons: [...catalog.lessons, empty] });
    setLessonId(empty.id);
    setNotice("เพิ่ม Lesson ว่างแล้ว สามารถนำเข้าเนื้อหาในภายหลัง");
  }
  async function previewLessonFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return;
    try {
      const parsed = validateLessonImport(JSON.parse(await file.text()));
      const existing = catalog.lessons.find((item) => item.id === parsed.lesson.id);
      if (existing && existing.contentStatus !== "empty") throw new Error("Lesson นี้มีเนื้อหาแล้ว การ Replace Content ต้องมีเวอร์ชันและการยืนยันแยกต่างหาก");
      const allIds = new Set(catalog.lessons.filter((item) => item.id !== parsed.lesson.id).flatMap((item) => [
        ...allVocabulary(item).map((word) => word.id), ...item.exercises.map((exercise) => exercise.id),
      ]));
      if (parsed.lesson.exercises.some((exercise) => allIds.has(exercise.id)) || allVocabulary(parsed.lesson).some((word) => allIds.has(word.id))) throw new Error("ID คำศัพท์หรือโจทย์ซ้ำกับ Lesson อื่น");
      const issues = analyzeLessonImport(parsed);
      setImportPreview({ data: parsed, issues });
      setImportAccepted(false);
      setNotice(issues.length ? `Schema ผ่าน แต่พบจุดที่ต้องตรวจ ${issues.length} รายการ` : "ตรวจ Schema และคุณภาพเบื้องต้นผ่านแล้ว กรุณาตรวจตัวอย่างก่อนยืนยันนำเข้า");
    } catch (error) { setImportPreview(null); setImportAccepted(false); setNotice(error instanceof Error ? error.message : "ไฟล์ JSON ไม่ถูกต้อง"); }
    event.target.value = "";
  }
  async function confirmLessonImport() {
    if (!importPreview) return;
    const blocking = importPreview.issues.some((issue) => issue.severity === "error");
    if (blocking) { setNotice("ยังนำเข้าไม่ได้ กรุณาแก้ข้อผิดพลาดสีแดงใน JSON ก่อน"); return; }
    if (importPreview.issues.length && !importAccepted) { setNotice("กรุณายืนยันว่าได้ตรวจคำเตือนทั้งหมดแล้ว"); return; }
    const incoming = { ...importPreview.data.lesson, contentStatus: "imported" as const };
    const next = { ...catalog, lessons: [...catalog.lessons.filter((item) => item.id !== incoming.id), incoming] };
    await saveCatalog(next);
    setImportPreview(null);
    await go("vocabulary", incoming.id);
    setSelectedBookId(incoming.bookId);
    setNotice(`นำเข้า ${incoming.number}課 ${incoming.title} แล้ว`);
  }

  if (!ready) return <main className="loading">กำลังเปิดคลังเรียนของคุณ…</main>;

  const exerciseGroups = activeLesson.exercises.filter((item) => filter === "all" || item.section === filter).reduce<Record<string, Exercise[]>>((groups, exercise) => {
    const inferred = exercise.title.startsWith("類義") ? "4 類義" : exercise.title.startsWith("語形成") ? "5 語形成" : exercise.title.match(/^実践 (\d)/)?.[1];
    const key = `${exercise.section === "basic" ? "II. 基本練習" : "III. 実践練習"} / ${exercise.group ?? (exercise.section === "practical" ? `${inferred} 練習` : inferred ?? exercise.title)}`;
    (groups[key] ??= []).push(exercise);
    return groups;
  }, {});

  return <div className="app-shell">
    <aside className="sidebar">
      <button className="brand" onClick={() => go("overview")}><span className="brand-mark">覚</span><span><strong>Oboeru</strong><small>จำให้แม่น เรียนให้ลึก</small></span></button>
      <nav aria-label="เมนูหลัก">{navigation.map((item) => <button key={item.id} className={section === item.id ? "active" : ""} onClick={() => go(item.id)}><span>{item.icon}</span>{item.label}</button>)}</nav>
      <div className="sidebar-footer"><button onClick={exportBackup}>ส่งออกข้อมูล</button><button onClick={() => fileRef.current?.click()}>นำเข้าข้อมูล</button><input ref={fileRef} hidden type="file" accept="application/json" onChange={importBackup} /><p><span className="status-dot" />เก็บข้อมูลในเครื่องนี้</p></div>
    </aside>

    <main className="main-content">
      <header className="topbar"><div><span className="breadcrumb">คลังหนังสือ / {catalog.books.find((item) => item.id === activeLesson.bookId)?.title ?? selectedBook.title} / {activeLesson.chapter} / {activeLesson.number}課</span><h1>{section === "overview" ? "ยินดีต้อนรับกลับมา" : navigation.find((item) => item.id === section)?.label}</h1></div><div className="header-actions"><button onClick={toggleTranslation}>{showThai ? "ซ่อน" : "ดู"}คำแปลไทย</button><div className="avatar">覚</div></div></header>
      {notice ? <button className="notice" onClick={() => setNotice("")}>{notice}<span>×</span></button> : null}

      {section === "overview" ? <div className="page-stack">
        <section className="hero-card"><div><span className="eyebrow">บทเรียนล่าสุด · {activeLesson.chapter}</span><h2 lang="ja">{activeLesson.number}課　{activeLesson.title}</h2><p>เลือกบทเรียนในคลังหนังสือ แล้วอ่านคำศัพท์และทำแบบฝึกหัดพร้อมเฉลยทันที</p><button className="primary" onClick={() => go("vocabulary")}>เรียนต่อ <span>→</span></button></div><div className="hero-character"><span>覚</span><span>語</span><span>人</span><span>間</span></div></section>
        <section className="metrics-grid"><article><div className="metric-symbol">語</div><div><span>คำศัพท์บทนี้ที่เรียนแล้ว</span><strong>{learned} <small>/ {vocab.length} คำ</small></strong></div></article><article><div className="metric-symbol">✓</div><div><span>แบบฝึกหัดบทนี้ที่ตอบแล้ว</span><strong>{answered} <small>/ {activeLesson.exercises.length} ข้อ</small></strong></div></article><article className="score-card"><span>ความถูกต้องบทนี้</span><strong>{percentage(correct, answered)}%</strong><small>{correct} ข้อถูก จาก {answered} ข้อที่ตอบ</small></article></section>
        <section><div className="section-title"><div><span className="eyebrow">Book library</span><h2>หนังสือของฉัน</h2></div><button className="text-link" onClick={() => go("library")}>ดูทุกบท →</button></div><BookSummary book={selectedBook} lessonCount={bookLessons.length} onOpen={() => go("library")} learned={bookLearned} total={bookVocabulary} /></section>
        <LessonPicker lessons={bookLessons} activeId={lessonId} onOpen={(id) => go("vocabulary", id)} progress={progress} />
      </div> : null}

      {section === "library" ? <div className="page-stack"><section className="lesson-heading"><span className="eyebrow">Books / Chapters / Lessons</span><h2>คลังหนังสือ</h2><p>เนื้อหาเรียงตามหนังสือ → บท → Lesson แต่ละ Lesson มีความคืบหน้าของตัวเอง</p></section>
        <div className="category-tabs" aria-label="กรองประเภทหนังสือ">{(["all", "Vocabulary", "Grammar"] as const).map((category) => <button key={category} className={categoryFilter === category ? "active" : ""} onClick={() => { setCategoryFilter(category); if (category !== "all" && selectedBook.category !== category) { const first = catalog.books.find((item) => item.category === category); if (first) setSelectedBookId(first.id); } }}>{category === "all" ? "ทั้งหมด" : category}</button>)}</div>
        {catalog.books.filter((item) => categoryFilter === "all" || item.category === categoryFilter).map((item) => { const itemLessons = lessons.filter((entry) => entry.bookId === item.id); const itemVocab = itemLessons.reduce((sum, entry) => sum + allVocabulary(entry).length, 0); const itemLearned = itemLessons.reduce((sum, entry) => sum + allVocabulary(entry).filter((word) => progress.learnedIds.includes(word.id)).length, 0); return <section key={item.id} className="library-book"><BookSummary book={item} lessonCount={itemLessons.length} learned={itemLearned} total={itemVocab} onOpen={() => setSelectedBookId(item.id)} />{selectedBookId === item.id ? <LessonPicker lessons={itemLessons} activeId={lessonId} onOpen={(id) => go("vocabulary", id)} progress={progress} /> : null}</section>; })}
        <details className="management-panel"><summary>เพิ่มหนังสือ</summary><form action={createBook}><label>ชื่อหนังสือ<input name="title" required placeholder="ชื่อหนังสือ" /></label><label>ประเภท<select name="category"><option>Vocabulary</option><option>Grammar</option></select></label><label>JLPT<select name="jlptLevel">{["N1","N2","N3","N4","N5"].map((level) => <option key={level}>{level}</option>)}</select></label><button type="submit">เพิ่มหนังสือ</button></form></details>
        {(categoryFilter === "all" || selectedBook.category === categoryFilter) ? <details className="management-panel"><summary>เพิ่ม Lesson ว่างใน “{selectedBook.title}”</summary><form action={createEmptyLesson}><label>บทที่<input name="chapterNumber" type="number" min="1" required defaultValue="1" /></label><label>ชื่อบท<input name="chapter" required placeholder="เช่น 1章 人間" /></label><label>Lesson ที่<input name="number" type="number" min="1" required /></label><label>ชื่อ Lesson<input name="title" required placeholder="เช่น 人間関係" /></label><button type="submit">เพิ่ม Lesson</button></form></details> : null}
        <div className="management-panel import-panel"><strong>นำเข้าเนื้อหา Lesson จาก JSON</strong><p>รองรับ Schema ของ 新完全マスター 語彙 N1 เท่านั้น ระบบจะตรวจโครงสร้าง หน้าที่ขาด คำศัพท์น่าสงสัย และคำตอบที่รั่วในบทอ่านก่อนบันทึก</p><div className="import-actions"><button onClick={() => lessonFileRef.current?.click()}>เลือกไฟล์ JSON</button>{selectedBook.id === book.id ? <a href={templateUrl}>ดาวน์โหลด Template สำหรับ {nextTemplateNumber}課</a> : null}</div><input ref={lessonFileRef} hidden type="file" accept="application/json,.json" onChange={previewLessonFile} />{importPreview ? <div className="import-preview"><strong>{importPreview.data.lesson.chapter} / {importPreview.data.lesson.number}課 {importPreview.data.lesson.title}</strong><p>{importPreview.data.lesson.vocabularyGroups.reduce((sum, group) => sum + group.items.length, 0)} คำ · {importPreview.data.lesson.examples.length} ตัวอย่าง · 基本 {importPreview.data.lesson.exercises.filter((exercise) => exercise.section === "basic").length} ข้อ · 実践 {importPreview.data.lesson.exercises.filter((exercise) => exercise.section === "practical").length} ข้อ</p><p>หน้าต้นฉบับ: {importPreview.data.lesson.sourcePages?.join(", ") || "ไม่ได้ระบุ"}</p>{importPreview.issues.length ? <div className="quality-report"><strong>รายงานคุณภาพก่อนนำเข้า</strong><ul>{importPreview.issues.map((issue) => <li key={`${issue.code}-${issue.message}`} className={issue.severity}>{issue.severity === "error" ? "ต้องแก้" : "ควรตรวจ"}: {issue.message}</li>)}</ul>{!importPreview.issues.some((issue) => issue.severity === "error") ? <label className="quality-confirm"><input type="checkbox" checked={importAccepted} onChange={(event) => setImportAccepted(event.target.checked)} />ฉันตรวจคำเตือนกับ PDF แล้วและยืนยันว่าข้อมูลถูกต้อง</label> : null}</div> : <p className="quality-pass">ไม่พบความผิดปกติจากการตรวจอัตโนมัติ</p>}<button disabled={importPreview.issues.some((issue) => issue.severity === "error") || (importPreview.issues.length > 0 && !importAccepted)} onClick={confirmLessonImport}>ยืนยันนำเข้า IndexedDB</button><button onClick={() => { setImportPreview(null); setImportAccepted(false); }}>ยกเลิก</button></div> : null}</div>
        <div className="library-note">เนื้อหา Lesson 1–2 ถูกเก็บใน IndexedDB หลังเปิดครั้งแรก · สำรองทั้งหนังสือ เนื้อหา และความคืบหน้าได้ด้วยปุ่ม “ส่งออกข้อมูล”</div>
      </div> : null}

      {(section === "vocabulary" || section === "examples" || section === "exercises") ? <div className="lesson-switcher"><button onClick={() => go("library")}>← คลังหนังสือ</button><select aria-label="เลือกบทเรียน" value={lessonId} onChange={(event) => go(section, event.target.value)}>{lessons.map((item) => <option key={item.id} value={item.id}>{item.chapter} · {item.number}課 {item.title}</option>)}</select></div> : null}

      {section === "vocabulary" ? <div className="reader-layout"><div className="reader-main"><section className="lesson-heading"><span className="eyebrow">{activeLesson.chapter}</span><h2 lang="ja">{activeLesson.number}課　{activeLesson.title}</h2><p>ความหมายญี่ปุ่นเป็นคำอธิบายเพิ่มเติม คำแปลไทยเปิดได้ด้วยปุ่มลอยขณะเลื่อนอ่าน</p></section>{!vocab.length ? <div className="library-note">Lesson นี้ยังไม่มีเนื้อหา กรุณานำเข้า JSON ในคลังหนังสือ</div> : null}{activeLesson.vocabularyGroups.map((group) => <section className="vocab-section" key={group.id}><div className="section-title"><h3 lang="ja">{group.title}</h3><span>{group.items.filter((item) => progress.learnedIds.includes(item.id)).length}/{group.items.length}</span></div><div className="vocab-grid">{group.items.map((item) => <article className={`vocab-card ${progress.learnedIds.includes(item.id) ? "learned" : ""}`} key={item.id}><div><h4 lang="ja">{item.word}</h4>{item.reading ? <span lang="ja">{item.reading}</span> : null}</div>{item.japaneseMeaning ? <p className="japanese-meaning" lang="ja">{item.japaneseMeaning}<small>日本語の説明 · AI-generated</small></p> : null}{showThai ? <p className="thai-meaning">{item.thai}<small>คำแปลไทย · AI-generated</small></p> : null}<button onClick={() => toggleLearned(item.id)} aria-pressed={progress.learnedIds.includes(item.id)}>{progress.learnedIds.includes(item.id) ? "✓ เรียนแล้ว" : "+ ทำเครื่องหมาย"}</button></article>)}</div></section>)}</div><aside className="reader-progress"><span className="eyebrow">ความคืบหน้าบทนี้</span><strong>{learned}/{vocab.length}</strong><div className="thin-progress"><span style={{ width: `${percentage(learned, vocab.length)}%` }} /></div><p>Learned คือสถานะที่คุณเลือกเอง</p></aside></div> : null}

      {section === "examples" ? <div className="reader-main single"><section className="lesson-heading"><span className="eyebrow">I. 言葉と例文</span><h2>{activeLesson.number}課　ตัวอย่างประโยค</h2><p>ประโยคญี่ปุ่นมาจากหนังสือ คำแปลไทยเป็นข้อมูลเสริม</p></section>{!activeLesson.examples.length ? <div className="library-note">Lesson นี้ยังไม่มีตัวอย่างประโยค</div> : null}<div className="example-list">{activeLesson.examples.map((item, index) => <article key={item.id}><span>{String(index + 1).padStart(2, "0")}</span><div><p lang="ja">{item.japanese}</p>{showThai ? <small>{item.thai} · <b>AI-generated</b></small> : <small>ใช้ปุ่ม “ดูคำแปลไทย” เพื่อเปิดคำแปล</small>}</div></article>)}</div></div> : null}

      {section === "exercises" ? <div className="reader-main single"><section className="lesson-heading exercise-intro"><div><span className="eyebrow">II–III. 練習 · {activeLesson.number}課</span><h2>แบบฝึกหัด</h2><p>เลือกคำตอบหรือตอบข้อความแล้วกด “ตรวจคำตอบ” คำตอบจะถูกตรวจและล็อกทันที</p></div><div className="score-summary"><strong>{correct}/{answered}</strong><span>ตอบถูก</span></div></section><div className="filter-row"><button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>ทั้งหมด ({activeLesson.exercises.length})</button><button className={filter === "basic" ? "active" : ""} onClick={() => setFilter("basic")}>基本練習</button><button className={filter === "practical" ? "active" : ""} onClick={() => setFilter("practical")}>実践練習</button></div><div className="exercise-list">{Object.entries(exerciseGroups).map(([group, items]) => <section key={group} className="exercise-group"><h3>{group}<span>{items.filter((item) => attempts.has(item.id)).length}/{items.length}</span></h3>{items.map((exercise) => <ExerciseCard key={exercise.id} exercise={exercise} attempt={attempts.get(exercise.id)} onAnswer={(value) => answer(exercise, value)} />)}</section>)}</div></div> : null}
    </main>
    {(section === "vocabulary" || section === "examples") ? <button className="floating-translation" onClick={toggleTranslation} aria-pressed={showThai}>{showThai ? "ไทย ✓ · ซ่อนคำแปล" : "ไทย · ดูคำแปล"}</button> : null}
  </div>;
}

function BookSummary({ book: item, lessonCount, learned, total, onOpen }: { book: Book; lessonCount: number; learned: number; total: number; onOpen: () => void }) {
  return <article className="book-card"><div className="book-cover"><small>日本語能力試験</small><strong>{item.id === book.id ? <>新完全<br />マスター</> : item.title}</strong><span>{item.category === "Vocabulary" ? "語彙" : "文法"}</span><b>{item.jlptLevel}</b></div><div className="book-info"><span className="pill">{item.category.toUpperCase()} · JLPT {item.jlptLevel}</span><h3 lang="ja">{item.title}</h3><p>{lessonCount} Lesson · {total ? "Imported" : "ยังไม่มีเนื้อหา"}</p><div className="thin-progress"><span style={{ width: `${percentage(learned, total)}%` }} /></div><div className="book-meta"><span>Learned {learned}/{total} คำ</span><button onClick={onOpen}>ดูบทเรียน →</button></div></div></article>;
}

function LessonPicker({ lessons, activeId, onOpen, progress }: { lessons: Lesson[]; activeId: string; onOpen: (id: string) => void; progress: Progress }) {
  const chapters = [...lessons].sort((a, b) => a.chapterNumber - b.chapterNumber || a.number - b.number).reduce<Record<string, Lesson[]>>((groups, item) => {
    const key = `${item.chapterNumber} ${item.chapter}`;
    (groups[key] ??= []).push(item);
    return groups;
  }, {});
  return <section className="lesson-picker"><div className="section-title"><div><span className="eyebrow">Chapter & lesson</span><h2>บทภายในหนังสือ</h2></div></div>{Object.entries(chapters).length ? Object.entries(chapters).map(([chapter, chapterLessons]) => <div className="chapter-panel" key={chapter}><h3 lang="ja">{chapterLessons?.[0]?.chapter}</h3><div className="lesson-list">{chapterLessons?.map((item) => { const total = allVocabulary(item).length; const learned = allVocabulary(item).filter((word) => progress.learnedIds.includes(word.id)).length; const answered = item.exercises.filter((exercise) => progress.attempts.some((attempt) => attempt.exerciseId === exercise.id)).length; const status = item.contentStatus === "empty" || (!total && !item.exercises.length) ? "Empty" : learned === total && answered === item.exercises.length ? "Completed" : learned || answered ? "In progress" : "Imported"; return <button key={item.id} className={`lesson-row ${item.id === activeId ? "selected" : ""}`} onClick={() => onOpen(item.id)}><span className="lesson-number">{String(item.number).padStart(2, "0")}</span><span className="lesson-details"><strong lang="ja">{item.number}課　{item.title}</strong><small>Learned {learned}/{total} · แบบฝึกหัด {answered}/{item.exercises.length}</small></span><span className="lesson-state">{status}</span><span className="lesson-arrow">→</span></button>; })}</div></div>) : <p className="library-note">ยังไม่มี Lesson ในหนังสือเล่มนี้</p>}</section>;
}
