import { grammarLessons } from "@/lib/grammar-book";

function positiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const grammarLesson = grammarLessons.find((item) => item.id === params.get("lessonId"));
  if (grammarLesson) {
    const template = {
      schema: "shin-kanzen-master-n2-bunpou.lesson",
      schemaVersion: 1,
      lesson: {
        ...grammarLesson,
        contentStatus: undefined,
        sourcePages: [],
        exercises: [
          {
            id: `${grammarLesson.id}-basic-1`,
            section: "basic",
            type: "choice",
            group: "REPLACE_EXERCISE_GROUP",
            title: "REPLACE_QUESTION_TITLE",
            prompt: "REPLACE_QUESTION_FROM_PDF",
            choices: [
              { id: "1", label: "REPLACE_CHOICE_1" },
              { id: "2", label: "REPLACE_CHOICE_2" },
              { id: "3", label: "REPLACE_CHOICE_3" },
              { id: "4", label: "REPLACE_CHOICE_4" },
            ],
            answer: "1",
            correctLabel: "REPLACE_CHOICE_1",
            explanation: "REPLACE_EXPLANATION_OR_ANSWER_REFERENCE",
            explanationSource: "original",
          },
        ],
      },
    };
    return new Response(`${JSON.stringify(template, null, 2)}\n`, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Disposition": `attachment; filename="${grammarLesson.id}-template.json"`,
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  }
  const number = positiveInteger(params.get("number"), 3);
  const chapterNumber = positiveInteger(params.get("chapterNumber"), 1);
  const chapter = params.get("chapter")?.trim() || `${chapterNumber}章 REPLACE_CHAPTER_NAME`;
  const padded = String(number).padStart(2, "0");
  const template = {
    schema: "shin-kanzen-master-n1-goi.lesson",
    schemaVersion: 1,
    lesson: {
      id: `shin-kanzen-n1-goi-${padded}`,
      bookId: "shin-kanzen-master-n1-goi",
      chapterNumber,
      chapter,
      number,
      title: "REPLACE_LESSON_TITLE",
      sourcePages: [],
      vocabularyGroups: [
        {
          id: `l${number}-replace-group-1`,
          title: "REPLACE_GROUP_TITLE",
          items: [
            {
              id: `l${number}-replace-word-1`,
              word: "REPLACE_BOLD_TARGET_ONLY",
              reading: "REPLACE_READING",
              thai: "REPLACE_THAI_MEANING",
              japaneseMeaning: "REPLACE_JAPANESE_EXPLANATION",
            },
          ],
        },
      ],
      examples: [
        {
          id: `l${number}-replace-example-1`,
          japanese: "REPLACE_FULL_EXAMPLE_SENTENCE",
          thai: "REPLACE_THAI_TRANSLATION",
        },
      ],
      exercises: [
        {
          id: `l${number}-replace-basic-1-1`,
          section: "basic",
          type: "text",
          group: "REPLACE_EXERCISE_GROUP",
          title: "ช่อง ①",
          prompt: "REPLACE_PROMPT_WITH_BLANK",
          answer: "REPLACE_ANSWER",
          acceptedAnswers: [],
          correctLabel: "REPLACE_ANSWER",
          explanation: "REPLACE_EXPLANATION",
          explanationSource: "ai_generated",
        },
      ],
    },
  };
  return new Response(`${JSON.stringify(template, null, 2)}\n`, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Disposition": `attachment; filename="oboeru-lesson-${padded}-template.json"`,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
