import type { Exercise } from "./types";
import { withGrammarTeachingNote, type GrammarTeachingNote } from "./grammar-teaching-note";
import { grammarTwoTeachingNotes } from "./grammar-two-teaching-notes";
import { grammarThreeTeachingNotes } from "./grammar-three-teaching-notes";
import { grammarFourTeachingNotes } from "./grammar-four-teaching-notes";
import { grammarFiveTeachingNotes } from "./grammar-five-teaching-notes";
import { grammarReviewOneFiveTeachingNotes } from "./grammar-review-one-five-teaching-notes";
import { grammarSixTeachingNotes } from "./grammar-six-teaching-notes";
import { grammarSevenTeachingNotes } from "./grammar-seven-teaching-notes";
import { grammarEightTeachingNotes } from "./grammar-eight-teaching-notes";
import { grammarNineTeachingNotes } from "./grammar-nine-teaching-notes";
import { grammarTenTeachingNotes } from "./grammar-ten-teaching-notes";
import { grammarReviewOneTenTeachingNotes } from "./grammar-review-one-ten-teaching-notes";
import { grammarElevenTeachingNotes } from "./grammar-eleven-teaching-notes";
import { grammarTwelveTeachingNotes } from "./grammar-twelve-teaching-notes";
import { grammarThirteenTeachingNotes } from "./grammar-thirteen-teaching-notes";
import { grammarFourteenTeachingNotes } from "./grammar-fourteen-teaching-notes";
import { grammarFifteenTeachingNotes } from "./grammar-fifteen-teaching-notes";
import { grammarReviewOneFifteenTeachingNotes } from "./grammar-review-one-fifteen-teaching-notes";
import { grammarSixteenTeachingNotes } from "./grammar-sixteen-teaching-notes";
import { grammarSeventeenTeachingNotes } from "./grammar-seventeen-teaching-notes";
import { grammarEighteenTeachingNotes } from "./grammar-eighteen-teaching-notes";
import { grammarNineteenTeachingNotes } from "./grammar-nineteen-teaching-notes";
import { grammarTwentyTeachingNotes } from "./grammar-twenty-teaching-notes";
import { grammarReviewOneTwentyTeachingNotes } from "./grammar-review-one-twenty-teaching-notes";
import { grammarTwentyOneTeachingNotes } from "./grammar-twenty-one-teaching-notes";
import { grammarTwentyTwoTeachingNotes } from "./grammar-twenty-two-teaching-notes";
import { grammarTwentyThreeTeachingNotes } from "./grammar-twenty-three-teaching-notes";
import { grammarTwentyFourTeachingNotes } from "./grammar-twenty-four-teaching-notes";
import { grammarTwentyFiveTeachingNotes } from "./grammar-twenty-five-teaching-notes";
import { grammarTwentySixTeachingNotes } from "./grammar-twenty-six-teaching-notes";
import { grammarReviewOneTwentySixTeachingNotes } from "./grammar-review-one-twenty-six-teaching-notes";
import { grammarNounModifierTeachingNotes } from "./grammar-noun-modifier-teaching-notes";
import { grammarAssemblyOneTeachingNotes } from "./grammar-assembly-one-teaching-notes";
import { consolidationATeachingNotes } from "./grammar-consolidation-a-teaching-notes";
import { consolidationBTeachingNotes } from "./grammar-consolidation-b-teaching-notes";
import { consolidationCTeachingNotes } from "./grammar-consolidation-c-teaching-notes";
import { consolidationDTeachingNotes } from "./grammar-consolidation-d-teaching-notes";
import { consolidationETeachingNotes } from "./grammar-consolidation-e-teaching-notes";
import { consolidationFTeachingNotes } from "./grammar-consolidation-f-teaching-notes";
import { consolidationGTeachingNotes } from "./grammar-consolidation-g-teaching-notes";
import { grammarAssemblyTwoTeachingNotes } from "./grammar-assembly-two-teaching-notes";

export const detailedGrammarNotes: Record<string, GrammarTeachingNote> = {
  ...grammarTwoTeachingNotes,
  ...grammarThreeTeachingNotes,
  ...grammarFourTeachingNotes,
  ...grammarFiveTeachingNotes,
  ...grammarReviewOneFiveTeachingNotes,
  ...grammarSixTeachingNotes,
  ...grammarSevenTeachingNotes,
  ...grammarEightTeachingNotes,
  ...grammarNineTeachingNotes,
  ...grammarTenTeachingNotes,
  ...grammarReviewOneTenTeachingNotes,
  ...grammarElevenTeachingNotes,
  ...grammarTwelveTeachingNotes,
  ...grammarThirteenTeachingNotes,
  ...grammarFourteenTeachingNotes,
  ...grammarFifteenTeachingNotes,
  ...grammarReviewOneFifteenTeachingNotes,
  ...grammarSixteenTeachingNotes,
  ...grammarSeventeenTeachingNotes,
  ...grammarEighteenTeachingNotes,
  ...grammarNineteenTeachingNotes,
  ...grammarTwentyTeachingNotes,
  ...grammarReviewOneTwentyTeachingNotes,
  ...grammarTwentyOneTeachingNotes,
  ...grammarTwentyTwoTeachingNotes,
  ...grammarTwentyThreeTeachingNotes,
  ...grammarTwentyFourTeachingNotes,
  ...grammarTwentyFiveTeachingNotes,
  ...grammarTwentySixTeachingNotes,
  ...grammarReviewOneTwentySixTeachingNotes,
  ...grammarNounModifierTeachingNotes,
  ...grammarAssemblyOneTeachingNotes,
  ...consolidationATeachingNotes,
  ...consolidationBTeachingNotes,
  ...consolidationCTeachingNotes,
  ...consolidationDTeachingNotes,
  ...consolidationETeachingNotes,
  ...consolidationFTeachingNotes,
  ...consolidationGTeachingNotes,
  ...grammarAssemblyTwoTeachingNotes,
};

export function enhanceGrammarExplanation(exercise: Exercise): Exercise {
  const note = detailedGrammarNotes[exercise.id];
  return note ? withGrammarTeachingNote(exercise, note) : exercise;
}
