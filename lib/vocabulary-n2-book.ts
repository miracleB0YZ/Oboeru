import type { Book } from "./types";
import { lessonN2Relatives } from "./lesson-n2-relatives";
import { lessonN2Personality } from "./lesson-n2-personality";
import { lessonN2Feelings } from "./lesson-n2-feelings";
import { lessonN2Food } from "./lesson-n2-food";
import { lessonN2Housework } from "./lesson-n2-housework";
import { lessonN2Health } from "./lesson-n2-health";
import { lessonN2Hobbies } from "./lesson-n2-hobbies";
import { lessonN2Travel } from "./lesson-n2-travel";
import { lessonN2TravelNature } from "./lesson-n2-travel-nature";
import { lessonN2School } from "./lesson-n2-school";
import { lessonN2Work } from "./lesson-n2-work";
import { lessonN2News } from "./lesson-n2-news";
import { lessonN2Computer } from "./lesson-n2-computer";
import { lessonN2Events } from "./lesson-n2-events";
import { lessonN2Incidents } from "./lesson-n2-incidents";
import { lessonN2Economy } from "./lesson-n2-economy";
import { lessonN2Politics } from "./lesson-n2-politics";
import { lessonN2Environment } from "./lesson-n2-environment";
import { lessonN2Science } from "./lesson-n2-science";
import { lessonN2Quantity } from "./lesson-n2-quantity";
import { lessonN2TimeSpace } from "./lesson-n2-time-space";
import { lessonN2PolysemousVerbsOne } from "./lesson-n2-polysemous-verbs-one";
import { lessonN2PolysemousVerbsTwo } from "./lesson-n2-polysemous-verbs-two";
import { lessonN2PolysemousAdjectivesNouns } from "./lesson-n2-polysemous-adjectives-nouns";
import { lessonN2SimilarAdverbsAdjectives } from "./lesson-n2-similar-adverbs-adjectives";
import { lessonN2SimilarNounsVerbs } from "./lesson-n2-similar-nouns-verbs";
import { lessonN2SimilarForms } from "./lesson-n2-similar-forms";
import { lessonN2DegreeTimeFrequency } from "./lesson-n2-degree-time-frequency";
import { lessonN2PairedAdverbs } from "./lesson-n2-paired-adverbs";
import { lessonN2OtherAdverbs } from "./lesson-n2-other-adverbs";
import { lessonN2Onomatopoeia } from "./lesson-n2-onomatopoeia";
export const vocabularyN2Lessons = [lessonN2Relatives, lessonN2Personality, lessonN2Feelings, lessonN2Food, lessonN2Housework, lessonN2Health, lessonN2Hobbies, lessonN2Travel, lessonN2TravelNature, lessonN2School, lessonN2Work, lessonN2News, lessonN2Computer, lessonN2Events, lessonN2Incidents, lessonN2Economy, lessonN2Politics, lessonN2Environment, lessonN2Science, lessonN2Quantity, lessonN2TimeSpace, lessonN2PolysemousVerbsOne];
vocabularyN2Lessons.push(lessonN2PolysemousVerbsTwo, lessonN2PolysemousAdjectivesNouns, lessonN2SimilarAdverbsAdjectives, lessonN2SimilarNounsVerbs, lessonN2SimilarForms, lessonN2DegreeTimeFrequency);
vocabularyN2Lessons.push(lessonN2PairedAdverbs, lessonN2OtherAdverbs, lessonN2Onomatopoeia);
export const vocabularyN2Book: Book = {
  id: "shin-kanzen-master-n2-goi", title: "新完全マスター 語彙 日本語能力試験 N2",
  category: "Vocabulary", jlptLevel: "N2", lessons: vocabularyN2Lessons.length,
};
