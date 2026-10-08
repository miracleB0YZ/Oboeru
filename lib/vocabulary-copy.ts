import type { VocabularyItem } from "./types";

/** Keep lesson order and card-level Learned status; export words only. */
export function unlearnedVocabularyWords(items: VocabularyItem[], learnedIds: string[]): string[] {
  const learned = new Set(learnedIds);
  const seen = new Set<string>();
  return items.filter((item) => {
    if (learned.has(item.id) || seen.has(item.id)) return false;
    seen.add(item.id);
    return Boolean(item.word.trim());
  }).map((item) => item.word.trim());
}
