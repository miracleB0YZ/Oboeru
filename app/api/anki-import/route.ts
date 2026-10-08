import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile, mkdir, copyFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

export const runtime = "nodejs";
const run = promisify(execFile);

function clean(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}

function isJapanese(value: string) {
  return /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/u.test(value);
}

async function command(program: string, args: string[]) {
  const result = await run(program, args, { windowsHide: true, maxBuffer: 20 * 1024 * 1024 });
  return result.stdout;
}

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return Response.json({ error: "กรุณาเลือกไฟล์ Anki" }, { status: 400 });
  if (file.size > 100 * 1024 * 1024) return Response.json({ error: "ไฟล์ใหญ่เกิน 100 MB" }, { status: 413 });
  const root = await mkdtemp(join(tmpdir(), "oboeru-anki-"));
  const archive = join(root, "deck.colpkg");
  const unpacked = join(root, "unpacked");
  try {
    await mkdir(unpacked, { recursive: true });
    await writeFile(archive, Buffer.from(await file.arrayBuffer()));
    await command("tar", ["-xf", archive, "-C", root]);
    const modern = join(root, "collection.anki21b");
    const database = modern;
    const decompressed = join(root, "collection.sqlite");
    try { await command("zstd", ["-d", "-f", database, "-o", decompressed]); } catch { await copyFile(database, decompressed); }
    const rows = await command("sqlite3", ["-separator", "\t", decompressed, "select flds from notes;"]);
    const fronts = [...new Set(rows.split(/\r?\n/).filter(Boolean).map((row) => clean(row.split("\x1f")[4] ?? "")).filter((front) => front && isJapanese(front)))];
    return Response.json({ count: fronts.length, fronts, source: "anki21b", field: "VocabKanji (field 5)" });
  } catch (error) {
    try {
      const rows = await command("sqlite3", ["-separator", "\t", join(root, "collection.anki2"), "select flds from notes;"]);
      const fronts = [...new Set(rows.split(/\r?\n/).filter(Boolean).map((row) => clean(row.split("\x1f")[4] ?? "")).filter((front) => front && isJapanese(front)))];
      if (fronts.length) return Response.json({ count: fronts.length, fronts, source: "anki2", field: "VocabKanji (field 5)" });
    } catch { /* return the original error below */ }
    return Response.json({ error: `อ่านไฟล์ Anki ไม่สำเร็จ: ${error instanceof Error ? error.message : "รูปแบบไฟล์ไม่รองรับ"}` }, { status: 422 });
  } finally { await rm(root, { recursive: true, force: true }); }
}
