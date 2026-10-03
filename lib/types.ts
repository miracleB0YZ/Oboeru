export type VocabularyItem = {
  id: string;
  word: string;
  reading?: string;
  thai: string;
  japaneseMeaning?: string;
};

export type VocabularyGroup = {
  id: string;
  title: string;
  pattern?: string;
  items: VocabularyItem[];
};

export type GrammarPattern = {
  id: string;
  pattern: string;
};

export type Choice = { id: string; label: string };

export type Exercise = {
  id: string;
  section: "basic" | "practical";
  type: "choice" | "text";
  group?: string;
  title: string;
  prompt: string;
  passage?: string;
  hint?: string;
  choices?: Choice[];
  answer: string;
  acceptedAnswers?: string[];
  correctLabel: string;
  explanation: string;
  explanationSource: "original" | "ai_generated";
  points?: number;
};

export type Lesson = {
  id: string;
  bookId: string;
  chapterNumber: number;
  chapter: string;
  number: number;
  title: string;
  contentStatus?: "empty" | "index_only" | "imported";
  sourcePages?: number[];
  vocabularyGroups: VocabularyGroup[];
  grammarPatterns?: GrammarPattern[];
  examples: { id: string; japanese: string; thai: string }[];
  exercises: Exercise[];
};

export type Book = {
  id: string;
  title: string;
  category: "Vocabulary" | "Grammar";
  jlptLevel: "N1" | "N2" | "N3" | "N4" | "N5";
  lessons: number;
};

export type Catalog = {
  books: Book[];
  lessons: Lesson[];
  deletedLessonIds?: string[];
  editedLessonIds?: string[];
};

export type Attempt = {
  id: string;
  exerciseId: string;
  answer: string;
  correct: boolean;
  attemptedAt: string;
};

export type Progress = {
  learnedIds: string[];
  attempts: Attempt[];
  lastSection: "overview" | "library" | "management" | "vocabulary" | "examples" | "exercises";
  lastLessonId?: string;
  showThai?: boolean;
  updatedAt: string;
};

export type BackupPayload = {
  format: "oboeru-backup";
  version: 1 | 2;
  exportedAt: string;
  progress: Progress;
  catalog?: Catalog;
};
