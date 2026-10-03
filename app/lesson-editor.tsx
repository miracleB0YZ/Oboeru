"use client";

import { useEffect, useRef, useState } from "react";
import type { Book, Lesson } from "@/lib/types";

export default function LessonEditor({ lesson, book, onSave, onDelete, onClose }: {
  lesson: Lesson; book: Book;
  onSave: (lesson: Lesson) => Promise<void>;
  onDelete: () => Promise<void>;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [operation, setOperation] = useState<"delete" | "clear" | null>(null);
  const confirmButton = useRef<HTMLButtonElement>(null);
  const content = {
    sourcePages: lesson.sourcePages ?? [],
    vocabularyGroups: lesson.vocabularyGroups,
    ...(book.category === "Grammar" ? { grammarPatterns: lesson.grammarPatterns ?? [] } : {}),
    examples: lesson.examples,
    exercises: lesson.exercises,
  };
  useEffect(() => { dialog.current?.showModal(); }, []);
  useEffect(() => {
    if (operation) {
      dialog.current?.scrollTo({ top: 0 });
      confirmButton.current?.focus();
    }
  }, [operation]);

  async function confirmRemoval() {
    setError(""); setBusy(true);
    try {
      if (operation === "delete") await onDelete();
      else await onSave({ ...lesson, sourcePages: [], vocabularyGroups: [], grammarPatterns: book.category === "Grammar" ? [] : undefined, examples: [], exercises: [] });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "ลบไม่สำเร็จ"); }
    finally { setBusy(false); }
  }

  async function submit(form: FormData) {
    setError(""); setBusy(true);
    try {
      const parsed = JSON.parse(String(form.get("content")));
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("เนื้อหา JSON ต้องเป็น object");
      await onSave({
        ...lesson,
        sourcePages: parsed.sourcePages,
        vocabularyGroups: parsed.vocabularyGroups,
        grammarPatterns: parsed.grammarPatterns,
        examples: parsed.examples,
        exercises: parsed.exercises,
        chapterNumber: Number(form.get("chapterNumber")),
        chapter: String(form.get("chapter")).trim(),
        number: Number(form.get("number")),
        title: String(form.get("title")).trim(),
      });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "บันทึกไม่สำเร็จ"); }
    finally { setBusy(false); }
  }

  return <dialog ref={dialog} className="lesson-editor management-panel" aria-labelledby="lesson-editor-title" onCancel={(event) => { event.preventDefault(); if (!busy) onClose(); }}>
    <div className="section-title"><div><h2 id="lesson-editor-title">แก้ไข Lesson</h2><p>{book.title}</p></div><button type="button" disabled={busy} onClick={onClose} aria-label="ปิดการแก้ไข">×</button></div>
    {operation ? <div className="delete-confirm" role="alert">
      <strong>{operation === "delete" ? "ลบ Lesson ทั้งบท" : "ล้างเนื้อหาและเก็บ Lesson ไว้"}: {lesson.number}課 {lesson.title}?</strong>
      <p>{operation === "delete" ? "Lesson เนื้อหา และความคืบหน้าของบทนี้จะถูกลบ" : "คำศัพท์ ไวยากรณ์ ตัวอย่าง แบบฝึกหัด และความคืบหน้าของบทนี้จะถูกลบ โดยเก็บชื่อและหมายเลข Lesson ไว้"} กู้คืนได้จากไฟล์สำรองที่ส่งออกไว้ก่อนลบ</p>
      {error ? <p role="alert" className="editor-error">{error}</p> : null}
      <button ref={confirmButton} type="button" className="danger" disabled={busy} onClick={confirmRemoval}>{busy ? "กำลังลบ…" : operation === "delete" ? "ยืนยันลบ Lesson" : "ยืนยันล้างเนื้อหา"}</button>
      <button type="button" disabled={busy} onClick={() => { setOperation(null); setError(""); }}>ยกเลิกการลบ</button>
    </div> : null}
    <form hidden={operation !== null} onSubmit={(event) => { event.preventDefault(); void submit(new FormData(event.currentTarget)); }}>
      <fieldset disabled={busy} className="editor-fields">
        <label>บทที่<input name="chapterNumber" type="number" min="1" required defaultValue={lesson.chapterNumber} /></label>
        <label>ชื่อบท<input name="chapter" required defaultValue={lesson.chapter} /></label>
        <label>Lesson ที่<input name="number" type="number" min="1" required defaultValue={lesson.number} /></label>
        <label>ชื่อ Lesson<input name="title" required defaultValue={lesson.title} /></label>
        <label className="editor-content">เนื้อหา Lesson (JSON)<textarea name="content" required spellCheck={false} defaultValue={JSON.stringify(content, null, 2)} /></label>
      </fieldset>
      <p className="editor-help">แก้คำศัพท์ ตัวอย่าง และแบบฝึกหัดได้ใน JSON รหัสเดิมจะคงสถานะ Learned ไว้ ข้อที่เปลี่ยนโจทย์หรือตัวเลือก/เฉลยจะล้างผลคำตอบเฉพาะข้อนั้น</p>
      {error ? <p role="alert" className="editor-error">{error}</p> : null}
      <div className="editor-actions"><button type="submit" disabled={busy}>{busy ? "กำลังบันทึก…" : "บันทึกการแก้ไข"}</button><button type="button" disabled={busy} onClick={onClose}>ยกเลิก</button><button type="button" className="danger" disabled={busy} onClick={() => { setError(""); setOperation("clear"); }}>ล้างเนื้อหา</button><button type="button" className="danger" disabled={busy} onClick={() => { setError(""); setOperation("delete"); }}>ลบ Lesson</button></div>
    </form>
  </dialog>;
}
