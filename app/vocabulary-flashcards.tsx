"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { unlearnedVocabulary } from "@/lib/vocabulary-flashcards";
import type { VocabularyItem } from "@/lib/types";

export default function VocabularyFlashcards({ items, learnedIds, showThai, onLearned }: {
  items: VocabularyItem[]; learnedIds: string[]; showThai: boolean; onLearned: (id: string) => Promise<boolean>;
}) {
  const [deck, setDeck] = useState(() => unlearnedVocabulary(items, learnedIds));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [remembered, setRemembered] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [large, setLarge] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const busy = useRef(false);
  const lastRated = useRef<VocabularyItem | null>(null);
  const card = deck[index];
  const remaining = unlearnedVocabulary(items, learnedIds).length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!large || !dialog) return;
    const previousOverflow = document.body.style.overflow;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [large]);

  const next = useCallback(() => {
    setIndex((current) => current + 1);
    setRevealed(false);
    setError("");
  }, []);
  const rate = useCallback(async (known: boolean) => {
    if (!card || !revealed || busy.current || lastRated.current === card) return;
    lastRated.current = card;
    if (!known) { next(); return; }
    busy.current = true;
    setSaving(true);
    setError("");
    try {
      if (!await onLearned(card.id)) {
        lastRated.current = null;
        setError("บันทึกไม่สำเร็จ คำนี้ยังไม่ถูกเพิ่มเป็นเรียนรู้แล้ว กรุณากดตอบได้อีกครั้ง");
        return;
      }
      setRemembered((current) => current + 1);
      next();
    } catch {
      lastRated.current = null;
      setError("บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง");
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }, [card, revealed, onLearned, next]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!card || saving || event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight" && event.key !== "ArrowUp" && event.key !== " ") return;
      if (event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable]:not([contenteditable='false']), [role='textbox'], [role='slider']")) return;
      const openDialog = document.querySelector("dialog[open]");
      if (openDialog && openDialog !== dialogRef.current) return;
      if (event.key === " " || event.key === "ArrowUp") {
        if (event.target instanceof Element && event.target.closest("button, a, [role='button']") && !event.target.closest("[data-flashcard-action]")) return;
        event.preventDefault();
        if (!revealed && !event.repeat) setRevealed(true);
        return;
      }
      if (!revealed || event.repeat) return;
      event.preventDefault();
      void rate(event.key === "ArrowRight");
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [card, revealed, saving, rate]);

  function restart() {
    lastRated.current = null;
    setDeck(unlearnedVocabulary(items, learnedIds));
    setIndex(0);
    setRemembered(0);
    setRevealed(false);
    setError("");
  }

  const content = <section className="vocabulary-flashcards" aria-label="แฟลชการ์ดคำศัพท์">
    <div className="flashcard-toolbar"><span>คำอธิบาย → คำศัพท์</span><button type="button" aria-expanded={large} aria-label={large ? "ย่อกลับหน้าบทเรียน" : "เปิดแฟลชการ์ดจอใหญ่"} onClick={() => setLarge((current) => !current)}>{large ? "✕ ย่อกลับ" : "⛶ จอใหญ่"}</button></div>
    <p className="flashcard-instructions">อ่านคำอธิบายแล้วนึกคำศัพท์ → พลิกดูเฉลย → กด “ตอบได้” เพื่อบันทึกเข้าเรียนรู้แล้ว · เฉพาะคำใน Lesson นี้ที่ยังไม่เรียนรู้</p>
    {card ? <>
      <div className="flashcard-progress"><span>การ์ด {index + 1}/{deck.length}</span><span>รอบนี้ตอบได้ {remembered} คำ</span></div>
      <div className={`vocabulary-flashcard${revealed ? " revealed" : ""}`} aria-live="polite">
        <span className="eyebrow">{revealed ? "คำศัพท์ · เฉลย" : "คำอธิบาย → คำนี้คืออะไร?"}</span>
        {revealed ? <>
          <h3 lang="ja">{card.word}</h3>
          {card.reading ? <p className="flashcard-reading" lang="ja">{card.reading}</p> : null}
          <p className="flashcard-thai">{card.thai}</p>
          {card.japaneseMeaning ? <p className="flashcard-definition" lang="ja">{card.japaneseMeaning}</p> : null}
        </> : <>
          <p className="flashcard-definition" lang={card.japaneseMeaning ? "ja" : "th"}>{card.japaneseMeaning || card.thai || "คำนี้ยังไม่มีคำอธิบาย"}</p>
          {showThai && card.japaneseMeaning ? <p className="flashcard-thai">{card.thai}</p> : null}
        </>}
      </div>
      <div className="flashcard-actions">
        {!revealed ? <button type="button" className="primary" data-flashcard-action aria-keyshortcuts="Space ArrowUp" autoFocus onClick={() => setRevealed(true)}>พลิกดูคำศัพท์ · ↑ / Spacebar</button> : <>
          <button type="button" className="flashcard-unknown" data-flashcard-action aria-keyshortcuts="ArrowLeft" disabled={saving} onClick={() => rate(false)}>← ยังจำไม่ได้<small>ข้ามก่อน · เก็บไว้ทวน</small></button>
          <button type="button" className="flashcard-known" data-flashcard-action aria-keyshortcuts="ArrowRight" disabled={saving} onClick={() => rate(true)}>{saving ? "กำลังบันทึก…" : "ตอบได้ →"}<small>เก็บในเรียนรู้แล้ว</small></button>
        </>}
      </div>
      {error ? <p className="flashcard-error" role="alert">{error}</p> : null}
    </> : <div className="flashcard-finished" role="status">
      <h3>{!items.length ? "Lesson นี้ยังไม่มีคำศัพท์" : remaining ? "จบรอบนี้แล้ว" : "เรียนรู้คำในบทนี้ครบแล้ว"}</h3>
      <p>รอบนี้ตอบได้ {remembered} คำ · ยังไม่เรียนรู้ {remaining} คำ</p>
      {remaining ? <button type="button" className="primary" onClick={restart}>ทวนคำที่ยังจำไม่ได้</button> : <p>{items.length ? "สถานะนี้เชื่อมกับปุ่ม “เรียนแล้ว” ในรายการคำศัพท์" : "เพิ่มเนื้อหา Lesson ก่อนเริ่มแฟลชการ์ด"}</p>}
    </div>}
  </section>;
  return <>
    {!large ? content : null}
    <dialog ref={dialogRef} className="flashcard-large" aria-label="แฟลชการ์ดจอใหญ่" onCancel={() => setLarge(false)} onClose={() => setLarge(false)}>{large ? content : null}</dialog>
  </>;
}
