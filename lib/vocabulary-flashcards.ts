import type { Progress, VocabularyItem } from "./types";

export function unlearnedVocabulary(items: VocabularyItem[], learnedIds: string[]): VocabularyItem[] {
  const learned = new Set(learnedIds);
  return [...new Map(items.filter((item) => !learned.has(item.id)).map((item) => [item.id, item])).values()];
}

/** Answering successfully is additive, not the toggle used by the reading list. */
export function markVocabularyLearned(progress: Progress, id: string): Progress {
  return { ...progress, learnedIds: progress.learnedIds.includes(id) ? progress.learnedIds : [...progress.learnedIds, id], updatedAt: new Date().toISOString() };
}
