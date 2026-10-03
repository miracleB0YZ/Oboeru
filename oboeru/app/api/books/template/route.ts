import { randomUUID } from "node:crypto";
import { book } from "../../../../data/n1-demo";
import { grammarBook } from "../../../../data/n2-grammar-demo";
import { levels, categories } from "../../../../lib/catalog";
import type { StudyLevel, StudyCategory } from "../../../../lib/content-types";
export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const level = params.get("level") ?? "N1",
    category = params.get("category") ?? "vocabulary";
  if (
    !levels.includes(level as StudyLevel) ||
    !categories.includes(category as StudyCategory)
  )
    return Response.json(
      { error: "เลือกระดับ N1, N2, N3 และประเภท grammar หรือ vocabulary" },
      { status: 400 },
    );
  const template = {
    ...(category === "grammar" ? grammarBook : book),
    id: `my-${level.toLowerCase()}-${category}-${randomUUID().slice(0, 8)}`,
    title: `${level} ${category === "grammar" ? "文法" : "単語"} · ตัวอย่างรูปแบบ`,
    level,
    category,
  };
  return new Response(JSON.stringify(template, null, 2) + "\n", {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${level}-${category}-template.json"`,
      "Cache-Control": "no-store",
    },
  });
}
