"use client";

import { useState } from "react";
import type { Attempt, Exercise } from "@/lib/types";
import { combineBlankAnswers, splitAnswerBlanks } from "@/lib/inline-answer";

export default function MultiBlankAnswer({ exercise, attempt, onAnswer }: { exercise: Exercise; attempt?: Attempt; onAnswer: (value: string) => void }) {
  const parts = splitAnswerBlanks(exercise.prompt);
  const count = parts.filter((part) => "index" in part).length;
  const [drafts, setDrafts] = useState<string[]>(() => Array(count).fill(""));
  const submitted = Boolean(attempt);
  const displayed = attempt ? attempt.answer.split(/[／/]/u) : drafts;
  const answer = combineBlankAnswers(drafts);
  return <form className="text-answer inline-answer" onSubmit={(event) => {
    event.preventDefault();
    if (!submitted && answer) onAnswer(answer);
  }}>
    <p className="exercise-prompt" lang="ja">{parts.map((part, index) => "text" in part ? <span key={index}>{part.text}</span> : <span className="inline-answer-slot" key={index}>（<input
      className="inline-answer-input" lang="ja" autoComplete="off" disabled={submitted}
      value={displayed[part.index] ?? ""} placeholder={part.hint || "พิมพ์คำตอบ"}
      aria-label={`คำตอบ ${exercise.title} ช่อง ${part.index + 1}`}
      onChange={(event) => setDrafts((values) => values.map((value, position) => position === part.index ? event.target.value : value))}
      onKeyDown={(event) => { if (event.key === "Enter" && (event.nativeEvent.isComposing || event.keyCode === 229)) event.preventDefault(); }}
      style={{ width: `${Math.min(24, Math.max(8, (displayed[part.index]?.length ?? 0) * 2 + 2, part.hint.length * 2 + 2))}ch` }}
    />）</span>)}</p>
    <button type="submit" disabled={submitted || !answer}>ตรวจคำตอบ</button>
    <span className="answer-hint">{exercise.hint ?? "กรอกทุกช่อง แล้วกด Enter เพื่อตรวจพร้อมกันครั้งเดียว"}</span>
  </form>;
}
