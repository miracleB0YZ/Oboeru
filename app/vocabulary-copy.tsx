"use client";

import { useState } from "react";
import { copyExerciseText } from "@/lib/exercise-copy";

export default function VocabularyCopy({ words }: { words: string[] }) {
  const [state, setState] = useState<"idle" | "copying" | "copied" | "manual">("idle");
  const text = words.join("\n");
  return <section className="vocabulary-copy-panel" aria-label="คัดลอกคำศัพท์ที่ยังไม่เรียน">
    <div className="exercise-copy-actions">
      <button type="button" className="exercise-copy-button" disabled={!words.length || state === "copying"} onClick={async () => {
        setState("copying");
        setState(await copyExerciseText(text) ? "copied" : "manual");
      }}>{state === "copying" ? "กำลังคัดลอก…" : "คัดลอกศัพท์ที่ยังไม่เรียน"} ({words.length} คำ)</button>
      <span role="status">{!words.length ? "เรียนคำศัพท์บทนี้ครบแล้ว หรือบทนี้ยังไม่มีคำศัพท์" : state === "copied" ? `✓ คัดลอกแล้ว ${words.length} คำ` : state === "manual" ? "คัดลอกอัตโนมัติไม่ได้ เลือกข้อความด้านล่างเพื่อคัดลอกเองได้" : "เฉพาะคำศัพท์ของบทนี้ · คำละบรรทัด · ไม่รวมคำที่เรียนแล้ว"}</span>
    </div>
    {state === "manual" ? <label className="exercise-copy-manual">คำศัพท์ที่ยังไม่เรียน
      <textarea readOnly lang="ja" value={text} rows={8} autoFocus onFocus={(event) => event.currentTarget.select()} />
    </label> : null}
  </section>;
}
