"use client";

import { useState } from "react";
import { ankiExportFilename, prepareAnkiText } from "@/lib/anki-export";

export default function AnkiExport() {
  const [text, setText] = useState("");
  const [filename, setFilename] = useState("Shinkanzen");
  const [extension, setExtension] = useState<"txt" | "tsv">("txt");
  const [notice, setNotice] = useState("");
  const prepared = prepareAnkiText(text);
  function download() {
    if (prepared.errors.length) return;
    let url: string | undefined;
    try {
      url = URL.createObjectURL(new Blob([prepared.text], { type: "text/plain;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = ankiExportFilename(filename, extension);
      document.body.appendChild(link);
      link.click();
      link.remove();
      const downloadUrl = url;
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      setNotice("สร้างไฟล์แล้ว หากเบราว์เซอร์ถาม ให้เลือกบันทึก จากนั้นนำเข้าใน Anki");
    } catch {
      if (url) URL.revokeObjectURL(url);
      setNotice("ดาวน์โหลดไม่สำเร็จ ข้อมูลยังอยู่ในช่อง กรุณาลองใหม่");
    }
  }
  return <section className="management-panel anki-export-panel">
    <div><span className="eyebrow">Anki file exporter</span><h2>วางการ์ด → ดาวน์โหลดไฟล์ Anki</h2>
      <p>วางผลลัพธ์ TSV จาก AI โดยหนึ่งการ์ดต่อหนึ่งบรรทัด และแต่ละช่องคั่นด้วย Tab ไม่ต้องเปิด Notepad</p></div>
    <label htmlFor="anki-export-text">ข้อมูลการ์ด (TSV)</label>
    <textarea id="anki-export-text" value={text} onChange={(event) => { setText(event.target.value); setNotice(""); }}
      spellCheck={false} placeholder="วางข้อความ TSV ที่ได้จาก AI ที่นี่…" />
    <p className="anki-export-help">เก็บลำดับช่องตามการ์ด Tango เดิม รวมช่องว่างของเสียงและรูปภาพไว้ด้วย หากมีแท็ก ให้ใช้ Shinkanzen ในคอลัมน์ Tags ที่เตรียมมา ระบบไม่เติมแท็กหรือสร้างเนื้อหาใหม่</p>
    <div className="anki-export-options">
      <label>ชื่อไฟล์<input value={filename} onChange={(event) => setFilename(event.target.value)} /></label>
      <label>นามสกุล<select value={extension} onChange={(event) => setExtension(event.target.value as "txt" | "tsv")}><option value="txt">.txt (UTF-8 / Tab)</option><option value="tsv">.tsv (UTF-8 / Tab)</option></select></label>
    </div>
    {text.trim() ? <div aria-live="polite"><p>{prepared.count} การ์ด · {prepared.columns} คอลัมน์</p>{prepared.errors.map((error) => <p className="editor-error" key={error}>{error}</p>)}</div> : null}
    <button type="button" disabled={Boolean(prepared.errors.length)} onClick={download}>ดาวน์โหลด {ankiExportFilename(filename, extension)}</button>
    {notice ? <p role="status">{notice}</p> : null}
    <p className="anki-export-help">ใน Anki เลือก Import → ไฟล์นี้ → Note Type เดิม → ตัวคั่น Tab แล้วจับคู่คอลัมน์กับช่องและ Tags ให้ถูกต้อง ไฟล์นี้เป็นข้อความนำเข้า ไม่ใช่เด็ค .apkg และไม่มีไฟล์เสียงหรือรูปภาพแนบมา ข้อความไม่ถูกส่งไปหา AI</p>
  </section>;
}
