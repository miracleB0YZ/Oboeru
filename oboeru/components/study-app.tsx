"use client";

import { useState } from "react";
import type {
  Book,
  ExerciseGroup,
  ExerciseItem,
  Lesson,
  Option,
  Response,
} from "../lib/content-types";
import { isAnswered, isCorrect, summarize } from "../lib/grading";

const typeLabels: Record<ExerciseItem["type"], string> = {
  reading_input: "พิมพ์คำอ่าน",
  matching: "จับคู่คำ",
  word_bank_fill: "เติมคำจากคลัง",
  single_choice: "เลือกหนึ่งคำตอบ",
  synonym_choice: "คำใกล้เคียง",
  word_formation: "สร้างคำ",
  usage_choice: "เลือกการใช้คำ",
  reflection: "สะท้อนความคิด",
};
function Ruby({
  term,
  reading,
  show,
}: {
  term: string;
  reading?: string;
  show: boolean;
}) {
  return reading && show ? (
    <ruby>
      {term}
      <rt>{reading}</rt>
    </ruby>
  ) : (
    <>{term}</>
  );
}
function Demo() {
  return <span className="demo-tag">ข้อมูลสาธิต</span>;
}
function optionsFor(item: ExerciseItem, group: ExerciseGroup): Option[] {
  return "options" in item ? item.options : (group.wordBank ?? []);
}
function formatResponse(
  item: ExerciseItem,
  group: ExerciseGroup,
  response?: Response,
): string {
  if (item.type === "matching")
    return item.matchingItems.left
      .map(
        (l) =>
          `${l.text} → ${typeof response === "object" ? (item.matchingItems.right.find((r) => r.id === response[l.id])?.text ?? "ยังไม่จับคู่") : "ยังไม่จับคู่"}`,
      )
      .join(" / ");
  if (typeof response !== "string" || !response.trim()) return "ยังไม่ได้ตอบ";
  if (item.type === "reading_input" || item.type === "reflection")
    return response;
  return (
    optionsFor(item, group).find((o) => o.id === response)?.text ?? response
  );
}
function answerText(item: ExerciseItem, group: ExerciseGroup) {
  if (item.type === "reflection") return "";
  if (item.type === "reading_input") return item.answer.join(" / ");
  return formatResponse(item, group, item.answer);
}

function Exercise({
  item,
  group,
  response,
  onChange,
  checked,
  onCheck,
  furigana,
}: {
  item: ExerciseItem;
  group: ExerciseGroup;
  response?: Response;
  onChange: (r: Response, commit?: boolean) => void;
  checked: boolean;
  onCheck: () => void;
  furigana: boolean;
}) {
  const [active, setActive] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const matchResponse = typeof response === "object" ? response : {};
  const answered = isAnswered(item, response);
  const correct = isCorrect(item, response);
  return (
    <article className="exercise-card" aria-labelledby={`title-${item.id}`}>
      <div className="card-top">
        <span className="type-tag" id={`title-${item.id}`}>
          {typeLabels[item.type]}
        </span>
        <span>
          {item.type === "reflection" ? "ไม่คิดคะแนน" : `${item.points} คะแนน`}
        </span>
        {item.contentOrigin === "demo_generated" && <Demo />}
      </div>
      {item.instruction && (
        <p lang="ja" className="jp instruction">
          {item.instruction}
        </p>
      )}
      {item.segments.length > 0 && (
        <p lang="ja" className="jp question">
          {item.segments.map((s, i) =>
            s.kind === "blank" ? (
              <span key={i} className="blank">
                （　）
              </span>
            ) : s.kind === "target" ? (
              <mark key={i}>
                <Ruby
                  term={s.text}
                  reading={
                    item.type === "reading_input" ? undefined : s.reading
                  }
                  show={furigana}
                />
              </mark>
            ) : (
              <span key={i}>
                <Ruby term={s.text} reading={s.reading} show={furigana} />
              </span>
            ),
          )}
        </p>
      )}
      {item.type === "reflection" ? (
        <>
          <label className="field-label" htmlFor={item.id}>
            คำตอบของคุณ (ภาษาไทยหรือญี่ปุ่น)
          </label>
          <textarea
            id={item.id}
            value={typeof response === "string" ? response : ""}
            onChange={(e) => {
              onChange(e.target.value);
              setSaved(false);
            }}
            rows={4}
          />
          <button
            className="secondary"
            disabled={!answered}
            onClick={() => setSaved(true)}
          >
            บันทึกคำตอบ
          </button>
          {saved && (
            <p role="status">
              บันทึกคำตอบในรอบเรียนนี้แล้ว · ไม่มีการตัดสินถูกผิด
            </p>
          )}
        </>
      ) : item.type === "reading_input" ? (
        <>
          <label className="field-label" htmlFor={item.id}>
            พิมพ์คำอ่านภาษาญี่ปุ่น
          </label>
          <input
            id={item.id}
            lang="ja"
            autoComplete="off"
            value={typeof response === "string" ? response : ""}
            disabled={checked}
            onChange={(e) => onChange(e.target.value)}
            onBlur={(e) => {
              if (e.target.value.trim()) onCheck();
            }}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.nativeEvent.isComposing &&
                e.keyCode !== 229 &&
                answered
              ) {
                e.preventDefault();
                onCheck();
              }
            }}
            placeholder="พิมพ์แล้วกด Enter หรือออกจากช่อง"
          />
        </>
      ) : item.type === "matching" ? (
        <>
          <p className="help">
            เลือกคำฝั่งซ้าย แล้วเลือกคำฝั่งขวา •
            เลือกคำที่จับคู่แล้วเพื่อเปลี่ยนคู่ได้
          </p>
          <div className="matching">
            <div>
              {item.matchingItems.left.map((l) => (
                <button
                  key={l.id}
                  className={`match-button ${active === l.id ? "active" : ""}`}
                  aria-pressed={active === l.id}
                  disabled={checked}
                  onClick={() => setActive(l.id)}
                >
                  <span lang="ja">{l.text}</span>
                  <small>
                    {item.matchingItems.right.find(
                      (r) => r.id === matchResponse[l.id],
                    )?.text ?? "รอเลือกคู่"}
                  </small>
                </button>
              ))}
            </div>
            <div>
              {item.matchingItems.right.map((r) => {
                const owner = Object.entries(matchResponse).find(
                  ([, id]) => id === r.id,
                )?.[0];
                const unavailable =
                  item.matchingItems.oneToOne &&
                  Boolean(owner && owner !== active);
                return (
                  <button
                    key={r.id}
                    className={`match-button ${owner ? "paired" : ""}`}
                    disabled={checked || !active || unavailable}
                    onClick={() => {
                      if (active) {
                        onChange({ ...matchResponse, [active]: r.id }, true);
                        setActive(null);
                      }
                    }}
                  >
                    <span lang="ja">{r.text}</span>
                    <small>
                      {owner
                        ? `คู่กับ ${item.matchingItems.left.find((l) => l.id === owner)?.text}`
                        : "ว่าง"}
                    </small>
                  </button>
                );
              })}
            </div>
          </div>
          <button
            className="quiet"
            disabled={checked || !Object.keys(matchResponse).length}
            onClick={() => {
              onChange({});
              setActive(null);
            }}
          >
            ล้างคู่ที่เลือก
          </button>
        </>
      ) : (
        <div className="option-list" role="group" aria-label="ตัวเลือกคำตอบ">
          {optionsFor(item, group).map((o, i) => (
            <button
              key={o.id}
              aria-pressed={response === o.id}
              className={`option ${response === o.id ? "selected" : ""}`}
              disabled={checked}
              onClick={() => onChange(o.id, true)}
            >
              <span className="option-index">{i + 1}</span>
              <span lang="ja">
                <Ruby term={o.text} reading={o.reading} show={furigana} />
              </span>
            </button>
          ))}
        </div>
      )}
      {item.type !== "reflection" && !checked && (
        <p className="help auto-check-note">
          {item.type === "matching"
            ? "ตรวจอัตโนมัติเมื่อจับคู่ครบ"
            : item.type === "reading_input"
              ? "ตรวจเมื่อกด Enter หรือออกจากช่องคำตอบ"
              : "เลือกคำตอบแล้วแสดงผลทันที"}
        </p>
      )}
      {checked && item.type !== "reflection" && (
        <div
          className={`feedback ${correct ? "correct" : "incorrect"}`}
          role="status"
        >
          <strong>
            {correct ? "✓ ถูกต้อง" : "✕ ยังไม่ถูกต้อง"} ·{" "}
            {correct ? item.points : 0}/{item.points} คะแนน
          </strong>
          <p>
            คำตอบของคุณ:{" "}
            <span lang="ja">{formatResponse(item, group, response)}</span>
          </p>
          <p>
            เฉลย: <span lang="ja">{answerText(item, group)}</span>
          </p>
          <div className="explanation">
            {item.explanation.contentOrigin === "demo_generated" && <Demo />}
            <p lang="ja">{item.explanation.text}</p>
          </div>
        </div>
      )}
    </article>
  );
}

export default function StudyApp({
  book,
  bookControls,
}: {
  book: Book;
  bookControls?: React.ReactNode;
}) {
  const lessons = book.parts.flatMap((p) =>
    p.chapters.flatMap((c) => c.lessons),
  );
  const [lessonId, setLessonId] = useState(lessons[0].id);
  const [screen, setScreen] = useState<
    "library" | "vocabulary" | "practice" | "results"
  >("library");
  const [furigana, setFurigana] = useState(true);
  const [thai, setThai] = useState(true);
  const [responses, setResponses] = useState<Record<string, Response>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [learned, setLearned] = useState<string[]>([]);
  const [retryIds, setRetryIds] = useState<string[] | null>(null);
  const [round, setRound] = useState(0);
  const lesson = lessons.find((l) => l.id === lessonId)!;
  const allItems = lesson.exerciseGroups.flatMap((g) => g.items);
  const activeItems = retryIds
    ? allItems.filter((i) => retryIds.includes(i.id))
    : allItems;
  const result = summarize(activeItems, responses);
  const allScored = lessons
    .flatMap((l) => l.exerciseGroups.flatMap((g) => g.items))
    .filter((i) => i.type !== "reflection");
  const completed = allScored.filter(
    (i) => checked[i.id] && isAnswered(i, responses[i.id]),
  ).length;
  const go = (next: typeof screen) => {
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const openLesson = (l: Lesson) => {
    setLessonId(l.id);
    setRetryIds(null);
    go("vocabulary");
  };
  const reset = () => {
    const ids = new Set(allItems.map((i) => i.id));
    setResponses((prev) =>
      Object.fromEntries(Object.entries(prev).filter(([id]) => !ids.has(id))),
    );
    setChecked((prev) =>
      Object.fromEntries(Object.entries(prev).filter(([id]) => !ids.has(id))),
    );
    setRetryIds(null);
    setRound((r) => r + 1);
    go("practice");
  };
  const finish = () => {
    setChecked((prev) => ({
      ...prev,
      ...Object.fromEntries(
        activeItems
          .filter(
            (i) => i.type !== "reflection" && isAnswered(i, responses[i.id]),
          )
          .map((i) => [i.id, true]),
      ),
    }));
    go("results");
  };
  const retry = (ids: string[]) => {
    setResponses((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([id]) => !ids.includes(id)),
      ),
    );
    setChecked((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([id]) => !ids.includes(id)),
      ),
    );
    setRetryIds(ids);
    setRound((r) => r + 1);
    go("practice");
  };
  const toggles = (
    <div className="toggles">
      <label>
        <input
          type="checkbox"
          checked={furigana}
          onChange={(e) => setFurigana(e.target.checked)}
        />{" "}
        ฟุริงานะ
      </label>
      <label>
        <input
          type="checkbox"
          checked={thai}
          onChange={(e) => setThai(e.target.checked)}
        />{" "}
        คำแปลไทย
      </label>
    </div>
  );
  return;
  <div className="app-shell">
    <aside className="sidebar">
      <button className="brand" onClick={() => go("library")}>
        <span>覚</span>oboeru.
      </button>
      <div className="level-label">
        พื้นที่เรียนส่วนตัว <b>N1</b>
      </div>
      <nav aria-label="หน้าจอ">
        <button
          aria-current={screen === "library" ? "page" : undefined}
          onClick={() => go("library")}
        >
          01 <span>บทเรียนทั้งหมด</span>
        </button>
        <button
          aria-current={screen === "vocabulary" ? "page" : undefined}
          onClick={() => go("vocabulary")}
        >
          02 <span>เรียนคำศัพท์</span>
        </button>
        <button
          aria-current={screen === "practice" ? "page" : undefined}
          onClick={() => go("practice")}
        >
          03 <span>ทำแบบฝึกหัด</span>
        </button>
        <button
          aria-current={screen === "results" ? "page" : undefined}
          onClick={finish}
        >
          04 <span>สรุปผล</span>
        </button>
      </nav>
      <div className="sidebar-note">
        <span lang="ja">少しずつ、着実に。</span>
        <p>ทีละคำ ทีละบท</p>
        <small>
          สถานะเรียนเก็บเฉพาะรอบนี้
          <br />
          รีเฟรชหน้าเพื่อเริ่มสถานะใหม่
        </small>
      </div>
    </aside>
    <div className="workspace">
      <header className="topline">
        <span>{screen === "library" ? "ห้องเรียนของคุณ" : lesson.title}</span>
        <span className="prototype">หนังสือในเครื่อง · {book.title}</span>
      </header>
      <main id="main-content">
        {screen === "library" ? (
          <>
            <div className="page-heading">
              <p className="eyebrow">日本語能力試験 N1</p>
              <h1>วันนี้ เรียนรู้เพิ่มอีกนิด</h1>
              <p>อ่านความหมายให้เข้าใจ แล้วฝึกใช้คำในบริบท</p>
            </div>
            <section className="stat-grid" aria-label="สถิติรอบเรียนนี้">
              <article>
                <span>แบบฝึกหัดที่ตรวจแล้ว</span>
                <strong>
                  {completed}
                  <small> / {allScored.length} ข้อ</small>
                </strong>
              </article>
              <article>
                <span>คำศัพท์ที่ทำเครื่องหมายว่าเรียนแล้ว</span>
                <strong>
                  {learned.length}
                  <small> คำ</small>
                </strong>
              </article>
              <article>
                <span>บทเรียนพร้อมฝึก</span>
                <strong>
                  {lessons.length}
                  <small> บทเรียน</small>
                </strong>
              </article>
            </section>
            <div className="section-heading">
              <h2>คลังบทเรียน</h2>
              <span>{book.title}</span>
            </div>
            {bookControls}
            {book.parts.map((part) => (
              <section className="part" key={part.id}>
                <h2>{part.title}</h2>
                {part.chapters.map((ch) => (
                  <div key={ch.id}>
                    <h3 lang="ja">{ch.title}</h3>
                    <div className="lesson-grid">
                      {ch.lessons.map((l) => (
                        <article className="lesson-card" key={l.id}>
                          <div className="card-top">
                            <span className="type-tag">
                              {l.kind === "thematic"
                                ? "คำศัพท์ตามหัวข้อ"
                                : "คำหลายความหมาย"}
                            </span>
                          </div>
                          <h3 lang="ja">{l.title}</h3>
                          <p>{l.thaiTitle}</p>
                          <div className="lesson-meta">
                            <span>{l.vocabulary.length} คำศัพท์</span>
                            <span>
                              {
                                l.exerciseGroups
                                  .flatMap((g) => g.items)
                                  .filter((i) => i.type !== "reflection").length
                              }{" "}
                              ข้อคิดคะแนน
                            </span>
                            <span>
                              {
                                l.exerciseGroups
                                  .flatMap((g) => g.items)
                                  .filter((i) => i.type === "reflection").length
                              }{" "}
                              คำถามเปิดบท
                            </span>
                          </div>
                          <button
                            className="primary"
                            onClick={() => openLesson(l)}
                          >
                            เริ่มเรียน
                          </button>
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            ))}
          </>
        ) : (
          <>
            <div className="page-heading">
              <p className="eyebrow">
                {screen === "vocabulary"
                  ? "言葉・例文"
                  : screen === "practice"
                    ? "練習"
                    : "学習の振り返り"}
              </p>
              <h1>
                {screen === "results" ? "สรุปผลการฝึก" : lesson.thaiTitle}
              </h1>
              <p lang="ja">
                {lesson.title}
                {retryIds ? " · ทบทวนเฉพาะข้อที่เลือก" : ""}
              </p>
            </div>
            {screen === "vocabulary" ? (
              <>
                {toggles}
                <div className="vocabulary-list">
                  {lesson.vocabulary.map((v, n) => (
                    <article className="vocab-card" key={v.id}>
                      <div className="vocab-heading">
                        <span className="word-number">
                          {String(n + 1).padStart(2, "0")}
                        </span>
                        <h2 lang="ja">
                          <Ruby
                            term={v.term}
                            reading={v.reading}
                            show={furigana}
                          />
                        </h2>
                        {v.contentOrigin === "demo_generated" && <Demo />}
                        <button
                          className={`secondary ${learned.includes(v.id) ? "learned" : ""}`}
                          aria-pressed={learned.includes(v.id)}
                          onClick={() =>
                            setLearned((prev) =>
                              prev.includes(v.id)
                                ? prev.filter((id) => id !== v.id)
                                : [...prev, v.id],
                            )
                          }
                        >
                          {learned.includes(v.id)
                            ? "✓ เรียนแล้ว"
                            : "ทำเครื่องหมายว่าเรียนแล้ว"}
                        </button>
                      </div>
                      {v.meanings.map((m, i) => (
                        <div className="meaning" key={m.id}>
                          <div className="card-top">
                            <strong>ความหมาย {i + 1}</strong>
                            {(m.definition.contentOrigin === "demo_generated" ||
                              m.thai.contentOrigin === "demo_generated" ||
                              m.examples.some(
                                (ex) =>
                                  ex.japanese.contentOrigin ===
                                    "demo_generated" ||
                                  ex.thai.contentOrigin === "demo_generated",
                              )) && <Demo />}
                          </div>
                          <p lang="ja" className="jp">
                            {m.definition.text}
                          </p>
                          {thai && <p className="translation">{m.thai.text}</p>}
                          {m.examples.map((ex, j) => (
                            <blockquote key={j}>
                              <p className="jp" lang="ja">
                                {ex.japanese.text}
                              </p>
                              {thai && (
                                <p className="translation">{ex.thai.text}</p>
                              )}
                            </blockquote>
                          ))}
                        </div>
                      ))}
                      {v.relatedTerms.map((t) => (
                        <p key={t.term}>
                          คำ
                          {t.relation === "opposite" ? "ตรงข้าม" : "ใกล้เคียง"}:{" "}
                          <span lang="ja">
                            <Ruby
                              term={t.term}
                              reading={t.reading}
                              show={furigana}
                            />
                          </span>{" "}
                          {t.contentOrigin === "demo_generated" && <Demo />}
                        </p>
                      ))}
                    </article>
                  ))}
                </div>
                <div className="bottom-actions">
                  <button className="secondary" onClick={() => go("library")}>
                    กลับบทเรียนทั้งหมด
                  </button>
                  <button
                    className="primary"
                    onClick={() => {
                      setRetryIds(null);
                      go("practice");
                    }}
                  >
                    ไปทำแบบฝึกหัด
                  </button>
                </div>
              </>
            ) : screen === "practice" ? (
              <>
                {toggles}
                <div className="practice-progress">
                  <span>
                    ตอบครบแล้ว{" "}
                    {
                      activeItems.filter(
                        (i) =>
                          i.type !== "reflection" &&
                          isAnswered(i, responses[i.id]),
                      ).length
                    }{" "}
                    /{" "}
                    {activeItems.filter((i) => i.type !== "reflection").length}{" "}
                    ข้อ
                  </span>
                  <button className="secondary" onClick={finish}>
                    ดูสรุปผล
                  </button>
                </div>
                {lesson.sections
                  .filter((s) => s.groupIds.length)
                  .map((section) => {
                    const groups = lesson.exerciseGroups.filter(
                      (g) =>
                        section.groupIds.includes(g.id) &&
                        g.items.some((i) => activeItems.includes(i)),
                    );
                    if (!groups.length) return null;
                    return (
                      <section key={section.id} className="exercise-section">
                        <h2 lang="ja">{section.title}</h2>
                        {groups.map((group) => (
                          <div key={group.id} className="exercise-group">
                            <div className="group-heading">
                              <h3>{group.title}</h3>
                              <p lang="ja">{group.instruction.text}</p>
                              {group.instruction.contentOrigin ===
                                "demo_generated" && <Demo />}
                              {group.wordBank && (
                                <div className="word-bank">
                                  <strong>คลังคำร่วม</strong>
                                  {group.wordBank.map((w) => (
                                    <span key={w.id} lang="ja">
                                      {w.text}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            {group.items
                              .filter((i) => activeItems.includes(i))
                              .map((item) => (
                                <Exercise
                                  key={`${round}-${item.id}`}
                                  item={item}
                                  group={group}
                                  response={responses[item.id]}
                                  onChange={(r, commit) => {
                                    setResponses((prev) => ({
                                      ...prev,
                                      [item.id]: r,
                                    }));
                                    if (
                                      commit &&
                                      item.type !== "reflection" &&
                                      isAnswered(item, r)
                                    )
                                      setChecked((prev) => ({
                                        ...prev,
                                        [item.id]: true,
                                      }));
                                  }}
                                  checked={Boolean(checked[item.id])}
                                  onCheck={() =>
                                    setChecked((prev) => ({
                                      ...prev,
                                      [item.id]: true,
                                    }))
                                  }
                                  furigana={furigana}
                                />
                              ))}
                          </div>
                        ))}
                      </section>
                    );
                  })}
                <div className="bottom-actions">
                  <button
                    className="secondary"
                    onClick={() => go("vocabulary")}
                  >
                    กลับไปอ่านคำศัพท์
                  </button>
                  <button className="primary" onClick={finish}>
                    ดูสรุปผล
                  </button>
                </div>
              </>
            ) : (
              <>
                <section className="result-hero">
                  <p>คะแนน{retryIds ? "รอบทบทวน" : "รอบนี้"}</p>
                  <strong>
                    {result.points}
                    <small> / {result.total}</small>
                  </strong>
                  <p>
                    ไม่นับคำถามปลายเปิด ·
                    จับคู่ต้องถูกครบทุกคู่จึงได้คะแนนข้อนั้น
                  </p>
                </section>
                <div className="stat-grid">
                  <article>
                    <span>✓ ถูก</span>
                    <strong>
                      {result.correct.length}
                      <small> ข้อ</small>
                    </strong>
                  </article>
                  <article>
                    <span>✕ ผิด</span>
                    <strong>
                      {result.wrong.length}
                      <small> ข้อ</small>
                    </strong>
                  </article>
                  <article>
                    <span>— ยังไม่ได้ตอบครบ</span>
                    <strong>
                      {result.unanswered.length}
                      <small> ข้อ</small>
                    </strong>
                  </article>
                </div>
                <div className="bottom-actions">
                  <button
                    className="primary"
                    disabled={!result.wrong.length}
                    onClick={() => retry(result.wrong.map((i) => i.id))}
                  >
                    ทำข้อผิดซ้ำ ({result.wrong.length})
                  </button>
                  <button
                    className="secondary"
                    disabled={!result.unanswered.length}
                    onClick={() => retry(result.unanswered.map((i) => i.id))}
                  >
                    ทำข้อที่ยังไม่ครบ ({result.unanswered.length})
                  </button>
                  <button className="secondary" onClick={reset}>
                    เริ่มใหม่ทั้งบท
                  </button>
                  <button className="quiet" onClick={() => go("library")}>
                    กลับบทเรียน
                  </button>
                </div>
                <h2>ทบทวนข้อผิดและข้อที่ยังไม่ครบ</h2>
                {[...result.wrong, ...result.unanswered].length === 0 ? (
                  <p className="notice">ตอบถูกครบทุกข้อในรอบนี้แล้ว</p>
                ) : (
                  [...result.wrong, ...result.unanswered].map((item) => {
                    const group = lesson.exerciseGroups.find((g) =>
                      g.items.some((i) => i.id === item.id),
                    )!;
                    return (
                      <article className="review-card" key={item.id}>
                        <h3>
                          {group.title} · {typeLabels[item.type]}
                        </h3>
                        <p lang="ja">
                          {item.segments
                            .map((s) =>
                              s.kind === "blank" ? "（　）" : s.text,
                            )
                            .join("") ||
                            item.instruction ||
                            "จับคู่คำที่ใช้ร่วมกัน"}
                        </p>
                        <p>
                          คำตอบของคุณ:{" "}
                          <span lang="ja">
                            {formatResponse(item, group, responses[item.id])}
                          </span>
                        </p>
                        <p>
                          เฉลย: <span lang="ja">{answerText(item, group)}</span>
                        </p>
                        {item.explanation.contentOrigin ===
                          "demo_generated" && <Demo />}
                        <p lang="ja">{item.explanation.text}</p>
                      </article>
                    );
                  })
                )}
              </>
            )}
          </>
        )}
      </main>
      <footer>
        Oboeru · ต้นแบบ N1 สำหรับทดลองเรียน · ไม่มีฐานข้อมูลหรือบริการภายนอก
      </footer>
    </div>
  </div>;
}
