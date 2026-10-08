"use client";

import { useState } from "react";
import { inlinePassageParts } from "@/lib/inline-answer";
import { copyExerciseText, exerciseAiText } from "@/lib/exercise-copy";
import type { Attempt, Exercise } from "@/lib/types";

export function AnswerFeedback({ exercise, attempt }: { exercise: Exercise; attempt: Attempt }) {
  const [copyState, setCopyState] = useState<"idle" | "copying" | "copied" | "manual">("idle");
  const copyText = exerciseAiText(exercise, attempt);
  return <div className={`feedback ${attempt.correct ? "correct" : "wrong"}`} aria-live="polite">
    <div className="feedback-title"><strong>{attempt.correct ? "ถูกต้อง" : "ผิด — ข้อนี้ล็อกแล้ว"}</strong><span>เฉลย: <span lang="ja">{exercise.correctLabel}</span></span></div>
    {exercise.explanation.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}<small className="source-badge">{exercise.explanationSource === "original" ? "อ้างอิงคำอธิบายจากเฉลย" : "คำอธิบายเพิ่มเติม · AI-generated"}</small>
    <div className="exercise-copy-actions">
      <button type="button" className="exercise-copy-button" disabled={copyState === "copying"} onClick={async () => {
        setCopyState("copying");
        setCopyState(await copyExerciseText(copyText) ? "copied" : "manual");
      }}>{copyState === "copying" ? "กำลังคัดลอก…" : copyState === "copied" ? "✓ คัดลอกแล้ว · คัดลอกอีกครั้ง" : "คัดลอกไปถาม AI"}</button>
      <span role="status">{copyState === "copied" ? "วางในแชต AI ได้เลย" : copyState === "manual" ? "เบราว์เซอร์ไม่อนุญาตให้คัดลอก เลือกข้อความด้านล่างแล้วคัดลอกเองได้" : "รวมโจทย์ คำตอบของคุณ และเฉลย"}</span>
    </div>
    {copyState === "manual" ? <label className="exercise-copy-manual">ข้อความสำหรับถาม AI
      <textarea readOnly value={copyText} rows={8} autoFocus onFocus={(event) => event.currentTarget.select()} />
    </label> : null}
  </div>;
}

export default function IntroCloze({ exercises, attempts, onAnswer }: {
  exercises: Exercise[]; attempts: Map<string, Attempt>; onAnswer: (exercise: Exercise, value: string) => void;
}) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const parts = inlinePassageParts(exercises);
  if (!parts) return null;
  return <article className="exercise-card intro-cloze">
    <p className="cloze-instructions">พิมพ์คำเต็มตรงช่องคำใบ้ในบทอ่าน แล้วกด “ตรวจ” ของแต่ละช่อง หรือกด Enter · ส่งได้ครั้งเดียว</p>
    <div className="cloze-passage-text" lang="ja">{parts.map((part, index) => {
      if ("text" in part) return <span key={index}>{part.text}</span>;
      const { exercise, hint, number } = part;
      const attempt = attempts.get(exercise.id);
      const value = attempt?.answer ?? drafts[exercise.id] ?? "";
      return <form key={`${exercise.id}-${index}`} className={`cloze-slot${attempt ? attempt.correct ? " is-correct" : " is-wrong" : ""}`} onSubmit={(event) => {
        event.preventDefault();
        if (!attempt && value.trim()) onAnswer(exercise, value);
      }}>
        <label><span className="cloze-number">{number}</span><input lang="ja" aria-label={`คำตอบ ${exercise.title}`}
          value={value} disabled={Boolean(attempt)} placeholder={hint || "เติมคำ"} autoComplete="off"
          style={{ width: `${Math.min(24, Math.max(8, value.length * 2 + 2, hint.length * 2 + 2))}ch` }}
          onChange={(event) => setDrafts((current) => ({ ...current, [exercise.id]: event.target.value }))}
          onKeyDown={(event) => { if (event.key === "Enter" && (event.nativeEvent.isComposing || event.keyCode === 229)) event.preventDefault(); }}
        /></label><button type="submit" aria-label={`ตรวจคำตอบ ${exercise.title}`} disabled={Boolean(attempt) || !value.trim()}>{attempt ? attempt.correct ? "✓" : "✕" : "ตรวจ"}</button>
      </form>;
    })}</div>
    {exercises.filter((exercise) => attempts.has(exercise.id)).map((exercise) => <section key={exercise.id} className="cloze-feedback"><strong>{exercise.title}</strong><AnswerFeedback exercise={exercise} attempt={attempts.get(exercise.id)!} /></section>)}
  </article>;
}
