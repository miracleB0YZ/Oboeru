export function prepareAnkiText(input: string) {
  let text = input.replace(/^\uFEFF/u, "").replace(/\r\n?/g, "\n").split("\n").filter((line) => line.trim()).join("\n");
  const fenced = text.match(/^```[^\n]*\n([\s\S]*?)\n```$/u);
  if (fenced) text = fenced[1];
  // Do not trim individual rows: trailing tabs are empty Anki fields.
  const lines = text.split("\n").filter((line) => line.trim());
  const rows = lines.filter((line) => !line.startsWith("#"));
  const counts = rows.map((line) => line.split("\t").length);
  const errors: string[] = [];
  if (!rows.length) errors.push("กรุณาวางข้อมูลการ์ดก่อนดาวน์โหลด");
  if (counts.some((count) => count < 2)) errors.push("ข้อมูลต้องคั่นช่องด้วย Tab (TSV) ไม่ใช่ช่องว่างหรือตาราง Markdown");
  if (new Set(counts).size > 1) errors.push("จำนวนคอลัมน์แต่ละแถวไม่เท่ากัน กรุณาตรวจข้อมูลก่อนดาวน์โหลด");
  return { text: lines.join("\n") + "\n", count: rows.length, columns: counts[0] ?? 0, errors };
}

export function ankiExportFilename(input: string, extension: "txt" | "tsv") {
  const name = input.replace(/\.(txt|tsv)$/i, "").replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-").trim().replace(/[. ]+$/g, "");
  return (name || "Shinkanzen") + "." + extension;
}
