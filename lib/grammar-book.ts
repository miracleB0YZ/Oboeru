import type { Book, Lesson } from "./types";
import { selectExercise } from "./exercise-builders";
import { grammarOneExplanation } from "./grammar-one-explanations";
import { enhanceGrammarExplanation } from "./grammar-detailed-explanations";
import { grammarTwoExercises } from "./grammar-two-exercises";
import { grammarThreeExercises } from "./grammar-three-exercises";
import { grammarFourExercises } from "./grammar-four-exercises";
import { grammarFiveExercises } from "./grammar-five-exercises";
import { grammarSixExercises } from "./grammar-six-exercises";
import { grammarSevenExercises } from "./grammar-seven-exercises";
import { grammarEightExercises } from "./grammar-eight-exercises";
import { grammarNineExercises } from "./grammar-nine-exercises";
import { grammarTenExercises } from "./grammar-ten-exercises";
import { grammarElevenExercises } from "./grammar-eleven-exercises";
import { grammarTwelveExercises } from "./grammar-twelve-exercises";
import { grammarThirteenExercises } from "./grammar-thirteen-exercises";
import { grammarFourteenExercises } from "./grammar-fourteen-exercises";
import { grammarFifteenExercises } from "./grammar-fifteen-exercises";
import { grammarSixteenExercises } from "./grammar-sixteen-exercises";
import { grammarSeventeenExercises } from "./grammar-seventeen-exercises";
import { grammarEighteenExercises } from "./grammar-eighteen-exercises";
import { grammarNineteenExercises } from "./grammar-nineteen-exercises";
import { grammarTwentyExercises } from "./grammar-twenty-exercises";
import { grammarTwentyOneExercises } from "./grammar-twenty-one-exercises";
import { grammarTwentyTwoExercises } from "./grammar-twenty-two-exercises";
import { grammarTwentyThreeExercises } from "./grammar-twenty-three-exercises";
import { grammarTwentyFourExercises } from "./grammar-twenty-four-exercises";
import { grammarTwentyFiveExercises } from "./grammar-twenty-five-exercises";
import { grammarTwentySixExercises } from "./grammar-twenty-six-exercises";
import { grammarReviewOneFive } from "./grammar-review-one-five";
import { grammarReviewOneTen } from "./grammar-review-one-ten";
import { grammarReviewOneFifteen } from "./grammar-review-one-fifteen";
import { grammarReviewOneTwenty } from "./grammar-review-one-twenty";
import { grammarReviewOneTwentySix } from "./grammar-review-one-twenty-six";
import { consolidationA, consolidationB, consolidationC, consolidationD, consolidationE, consolidationF, consolidationG } from "./grammar-consolidation";
import { grammarAssemblyOne, grammarAssemblyTwo } from "./grammar-assembly";

export const grammarBook: Book = {
  id: "shin-kanzen-master-n2-bunpou",
  title: "新完全マスター 文法 日本語能力試験 N2",
  category: "Grammar",
  jlptLevel: "N2",
  lessons: 48,
};

function grammarLesson(part: number, chapterNumber: number, chapter: string, number: number, title: string, patterns: string[]): Lesson {
  return {
    id: `shin-kanzen-n2-bunpou-p${part}-${String(number).padStart(2, "0")}`,
    bookId: grammarBook.id,
    chapterNumber,
    chapter,
    number,
    title,
    contentStatus: "index_only",
    vocabularyGroups: [],
    grammarPatterns: patterns.map((pattern, index) => ({ id: `n2g-p${part}-${String(number).padStart(2, "0")}-${index + 1}`, pattern })),
    examples: [],
    exercises: [],
  };
}

const part1Section1 = "第1部 文の文法1 · I ことがらを説明する";
const part1Section2 = "第1部 文の文法1 · II 主観を含めて説明する";
const part1Section3 = "第1部 文の文法1 · III 主観を述べる";

export const grammarLessons: Lesson[] = [
  grammarLesson(1, 1, part1Section1, 1, "～とき・～直後に", ["～際（に）", "～に際して・～にあたって", "～たとたん（に）", "～（か）と思うと・～（か）と思ったら", "～か～ないかのうちに"]),
  grammarLesson(1, 1, part1Section1, 2, "～している（進行中）", ["～最中だ", "～うちに", "～ばかりだ・～一方だ", "～（よ）うとしている", "～つつある", "～つつ"]),
  grammarLesson(1, 1, part1Section1, 3, "～後で", ["～てはじめて", "～上（で）", "～次第", "～て以来・～てこのかた", "～てからでないと・～てからでなければ"]),
  grammarLesson(1, 1, part1Section1, 4, "範囲の始まりと終わり・その間", ["～をはじめ（として）", "～からして", "～にわたって", "～を通じて・～を通して", "～限り", "～だけ"]),
  grammarLesson(1, 1, part1Section1, 5, "～だけ", ["～に限り", "～限り（は）", "～限りでは", "～に限って"]),
  grammarLesson(1, 1, part1Section1, 6, "～だけではなく・それに加えて", ["～に限らず", "～のみならず", "～ばかりか", "～はもとより", "～上（に）"]),
  grammarLesson(1, 1, part1Section1, 7, "～について・～を相手にして", ["～に関して", "～をめぐって", "～にかけては", "～に対して", "～にこたえて"]),
  grammarLesson(1, 1, part1Section1, 8, "～を基準にして", ["～をもとに（して）", "～に基づいて", "～に沿って", "～のもとで・～のもとに", "～向けだ"]),
  grammarLesson(1, 1, part1Section1, 9, "～に関連して・～に対応して", ["～につれて・～にしたがって", "～に伴って・～とともに", "～次第だ", "～に応じて", "～につけて"]),
  grammarLesson(1, 1, part1Section1, 10, "～や～など", ["～やら～やら", "～というか～というか", "～にしても～にしても・～にしろ～にしろ・～にせよ～にせよ", "～といった"]),

  grammarLesson(1, 2, part1Section2, 11, "～に関係なく・無視して", ["～を問わず", "～にかかわりなく・～にかかわらず", "～もかまわず", "～はともかく（として）", "～はさておき"]),
  grammarLesson(1, 2, part1Section2, 12, "強く否定する・強く否定しない", ["～わけがない", "～どころではない・～どころか", "～ものか", "～わけではない・～というわけではない", "～というものではない・～というものでもない"]),
  grammarLesson(1, 2, part1Section2, 13, "～（話題）は", ["～とは", "～といえば", "～というと・～といえば・～といったら", "～（のこと）となると", "～といったら"]),
  grammarLesson(1, 2, part1Section2, 14, "～けれど", ["～にもかかわらず", "～ものの・～とはいうものの", "～ながら（も）", "～つつ（も）", "～といっても", "～からといって"]),
  grammarLesson(1, 2, part1Section2, 15, "もしそうなら・たとえそうでも", ["～としたら・～とすれば・～とすると・～となったら・～となれば・～となると", "～ものなら", "～（よ）うものなら", "～ないことには", "～を抜きにしては", "～としても・～にしても・～にしろ・～にせよ"]),
  grammarLesson(1, 2, part1Section2, 16, "～だから（理由）－1", ["～によって", "～ものだから・～もので・～もの", "～おかげだ／～せいだ", "～あまり・あまりの～に", "～につき"]),
  grammarLesson(1, 2, part1Section2, 17, "～だから（理由）－2", ["～ことだし", "～のことだから", "～だけに", "～ばかりに", "～からには・～以上（は）・～上は"]),
  grammarLesson(1, 2, part1Section2, 18, "～できない・困難だ・～できる", ["～がたい", "～わけにはいかない・～わけにもいかない", "～かねる", "～ようがない", "～どころではない", "～得る／～得ない"]),
  grammarLesson(1, 2, part1Section2, 19, "～を見て評価すると・～の立場で評価すると", ["～わりに（は）", "～にしては", "～だけ（のことは）ある", "～として", "～にとって", "～にしたら・～にすれば・～にしてみれば・～にしても"]),
  grammarLesson(1, 2, part1Section2, 20, "結果はどうなったか", ["～たところ", "～きり", "～あげく", "～末（に）", "～ところだった", "～ずじまいだ"]),
  grammarLesson(1, 2, part1Section2, 21, "強く言う・軽く言う", ["～ぐらい・～くらい", "～など・～なんか・～なんて", "～まで・～までして・～てまで", "～として～ない", "～さえ", "～てでも"]),

  grammarLesson(1, 3, part1Section3, 22, "～だろうと思う", ["～とみえる", "～かねない", "～おそれがある", "～まい／～ではあるまいか", "～に違いない・～に相違ない", "～にきまっている"]),
  grammarLesson(1, 3, part1Section3, 23, "感想を言う・主張する", ["～ものだ", "～というものだ", "～にすぎない", "～にほかならない", "～に越したことはない", "～しかない・～よりほかない", "～べきだ／～べきではない"]),
  grammarLesson(1, 3, part1Section3, 24, "提案する・意志を表す", ["～（よ）うではないか", "～ことだ", "～ものだ／～ものではない", "～ことはない", "～まい／～（よ）うか～まいか", "～ものか"]),
  grammarLesson(1, 3, part1Section3, 25, "強くそう感じる・思いが強いられる", ["～てしかたがない・～てしょうがない・～てたまらない", "～てならない", "～ないではいられない・～ずにはいられない", "～ないわけに（は）いかない", "～ざるを得ない"]),
  grammarLesson(1, 3, part1Section3, 26, "願う・感動する", ["～たいものだ・～てほしいものだ", "～ものだ", "～ないもの（だろう）か", "～ものがある", "～ことだ", "～ことだろう・～ことか"]),

  grammarLesson(2, 4, "第2部 文の文法2", 1, "文の組み立て－1", ["決まった形"]),
  grammarLesson(2, 4, "第2部 文の文法2", 2, "文の組み立て－2", ["名詞を説明する形式"]),
  grammarLesson(2, 4, "第2部 文の文法2", 3, "文の組み立て－3", ["「～ない」がつく文法形式"]),

  grammarLesson(3, 5, "第3部 文章の文法", 1, "始めと終わりが正しく対応した文", ["始めと終わりが正しく対応した文"]),
  grammarLesson(3, 5, "第3部 文章の文法", 2, "時制", ["時制"]),
  grammarLesson(3, 5, "第3部 文章の文法", 3, "条件を表す文", ["条件を表す文"]),
  grammarLesson(3, 5, "第3部 文章の文法", 4, "視点を動かさない手段－1", ["動詞の使い方", "自動詞・他動詞の使い分け"]),
  grammarLesson(3, 5, "第3部 文章の文法", 5, "視点を動かさない手段－2", ["「～てくる・～ていく」の使い分け"]),
  grammarLesson(3, 5, "第3部 文章の文法", 6, "視点を動かさない手段－3", ["受身・使役・使役受身の使い分け"]),
  grammarLesson(3, 5, "第3部 文章の文法", 7, "視点を動かさない手段－4", ["「～てあげる・～てもらう・～てくれる」の使い分け"]),
  grammarLesson(3, 5, "第3部 文章の文法", 8, "指示表現", ["「こ・そ・あ」の使い分け"]),
  grammarLesson(3, 5, "第3部 文章の文法", 9, "「は・が」の使い分け", ["「は・が」の使い分け"]),
  grammarLesson(3, 5, "第3部 文章の文法", 10, "接続表現", ["接続表現"]),
  grammarLesson(3, 5, "第3部 文章の文法", 11, "省略・繰り返し・言い換え", ["省略", "繰り返し", "言い換え"]),
  grammarLesson(3, 5, "第3部 文章の文法", 12, "文体の一貫性", ["文体の一貫性"]),
];

const grammarOneExercises = [
  selectExercise({ id: "n2g-p1-01-g1-1", group: "1 ～際（に）", title: "1-1", prompt: "（　）際に、家の中で修理をするところがあるかどうか調べておく必要がある。", options: ["いい天気の", "大掃除の", "時間がある"], answer: 2 }),
  selectExercise({ id: "n2g-p1-01-g1-2", group: "1 ～際（に）", title: "1-2", prompt: "（　）際、音が出る電子辞書は大変便利です。", options: ["発音が難しい", "発音がわからない", "発音を調べる"], answer: 3 }),
  selectExercise({ id: "n2g-p1-01-g1-3", group: "1 ～際（に）", title: "1-3", prompt: "（　）際は、こちらのテーブルをお使いいただけます。", options: ["お食事の", "ご飯を食べる", "お一人様の"], answer: 1 }),
  selectExercise({ id: "n2g-p1-01-g1-4", group: "1 ～際（に）", title: "1-4", prompt: "（　）際は、以下のことに注意してください。", options: ["毎日学校へ行く", "寮での生活の", "健康診断を受ける"], answer: 3 }),
  selectExercise({ id: "n2g-p1-01-g1-5", group: "1 ～際（に）", title: "1-5", prompt: "地震の際は、（　）。", options: ["慌てずに行動しなければならない", "慌てちゃだめ", "慌てていない"], answer: 1 }),

  selectExercise({ id: "n2g-p1-01-g2-1", group: "2 ～に際して・～にあたって", title: "2-1", prompt: "父は（　）に際して、医者にいろいろ質問した。", options: ["病気が回復する", "手術を受ける", "毎日病院へ行く"], answer: 2 }),
  selectExercise({ id: "n2g-p1-01-g2-2", group: "2 ～に際して・～にあたって", title: "2-2", prompt: "研修旅行に際して、（　）。", options: ["体調が良くなかった", "天候が気がかりだった", "説明会が開かれた"], answer: 3 }),
  selectExercise({ id: "n2g-p1-01-g2-3", group: "2 ～に際して・～にあたって", title: "2-3", prompt: "（　）にあたって、必要な書類を準備した。", options: ["出勤する", "留学する", "図書館へ行く"], answer: 2 }),
  selectExercise({ id: "n2g-p1-01-g2-4", group: "2 ～に際して・～にあたって", title: "2-4", prompt: "新しいオフィスへの移転にあたりまして、（　）。", options: ["気持ちも新しくなりました", "非常にうれしいです", "一言ごあいさつ申し上げます"], answer: 3 }),

  selectExercise({ id: "n2g-p1-01-g3-1", group: "3 ～たとたん（に）", title: "3-1", prompt: "（　）とたん、眠くなった。", options: ["勉強が終わった", "勉強をした", "勉強をしていた"], answer: 1 }),
  selectExercise({ id: "n2g-p1-01-g3-2", group: "3 ～たとたん（に）", title: "3-2", prompt: "（　）とたんに、気分が悪くなってしまった。", options: ["ゴールに向かっていた", "ゴールに近くなった", "ゴールインした"], answer: 3 }),
  selectExercise({ id: "n2g-p1-01-g3-3", group: "3 ～たとたん（に）", title: "3-3", prompt: "彼女はわたしの顔を見たとたんに、（　）。", options: ["泣き出した", "あいさつした", "うれしそうだった"], answer: 1 }),
  selectExercise({ id: "n2g-p1-01-g3-4", group: "3 ～たとたん（に）", title: "3-4", prompt: "電車が駅に着いたとたん、（　）。", options: ["友達に電話をしよう", "乗客が大勢乗り込んできた", "乗りかえのホームに行った"], answer: 2 }),

  selectExercise({ id: "n2g-p1-01-g4-1", group: "4 ～（か）と思うと・～（か）と思ったら", title: "4-1", prompt: "（　）車から降りたかと思うと、海に向かって走り出した。", options: ["わたしは", "わたしたちは", "あの子は"], answer: 3 }),
  selectExercise({ id: "n2g-p1-01-g4-2", group: "4 ～（か）と思うと・～（か）と思ったら", title: "4-2", prompt: "さっきまで大雨が降っていたかと思うと、今は（　）。", options: ["雨は弱くなった", "太陽が出ている", "雨はさらに激しくなった"], answer: 2 }),
  selectExercise({ id: "n2g-p1-01-g4-3", group: "4 ～（か）と思うと・～（か）と思ったら", title: "4-3", prompt: "7時の時報が鳴ったかと思うと、（　）。", options: ["ニュースが始まる", "時計のベルも鳴っていた", "彼は突然立ち上がった"], answer: 3 }),
  selectExercise({ id: "n2g-p1-01-g4-4", group: "4 ～（か）と思うと・～（か）と思ったら", title: "4-4", prompt: "サッカーの試合が始まったかと思うと、テレビの前に（　）。", options: ["人が大勢集まってきた", "集まろうよ", "座っていいですか"], answer: 1 }),

  selectExercise({ id: "n2g-p1-01-g5-1", group: "5 ～か～ないかのうちに", title: "5-1", prompt: "弟は、やっと見つけた就職先なのに、（　）のうちに、もう辞めてしまった。", options: ["仕事を覚えたか覚えないか", "働いているかいないか", "友達がいるかいないか"], answer: 1 }),
  selectExercise({ id: "n2g-p1-01-g5-2", group: "5 ～か～ないかのうちに", title: "5-2", prompt: "あの学生は、試験が始まって（　）のうちに、教室を出ていった。", options: ["よく考えたか考えないか", "10分たったかたたないか", "頑張ったか頑張らないか"], answer: 2 }),
  selectExercise({ id: "n2g-p1-01-g5-3", group: "5 ～か～ないかのうちに", title: "5-3", prompt: "雨がやんだかやまないかのうちに、（　）。", options: ["せみが鳴き出した", "試合を再開しよう", "出発したい"], answer: 1 }),
  selectExercise({ id: "n2g-p1-01-g5-4", group: "5 ～か～ないかのうちに", title: "5-4", prompt: "森さんは部長の話が終わるか終わらないかのうちに、会議室の方へ（　）。", options: ["走っていってください", "走っていった", "走っていったほうがいい"], answer: 2 }),

  selectExercise({ id: "n2g-p1-01-mix-1", group: "1～5 総合", title: "総合 1", prompt: "一つの問題が（　）、すぐ次の問題を渡された。", options: ["終わった際に", "終わるにあたって", "終わったかと思うと"], answer: 3 }),
  selectExercise({ id: "n2g-p1-01-mix-2", group: "1～5 総合", title: "総合 2", prompt: "やっと来たバスに（　）、忘れ物に気がついた。", options: ["乗った際に", "乗るにあたって", "乗ったとたん"], answer: 3 }),
  selectExercise({ id: "n2g-p1-01-mix-3", group: "1～5 総合", title: "総合 3", prompt: "テニスコートをお使いになる（　）、事務所でロッカーのかぎをお受け取りください。", options: ["際は", "にあたって", "かならないかのうちに"], answer: 1 }),
  selectExercise({ id: "n2g-p1-01-mix-4", group: "1～5 総合", title: "総合 4", prompt: "選挙に（　）、大勢の方に協力を依頼した。", options: ["出るにあたって", "出たとたんに", "出たかと思うと"], answer: 1 }),
];

grammarLessons[0] = {
  ...grammarLessons[0],
  contentStatus: "imported",
  sourcePages: [8, 9, 10, 11],
  exercises: grammarOneExercises.map((exercise) => ({ ...exercise, explanation: grammarOneExplanation(exercise), explanationSource: "ai_generated" })),
};

grammarLessons[1] = {
  ...grammarLessons[1],
  contentStatus: "imported",
  sourcePages: [12, 13, 14, 15],
  exercises: grammarTwoExercises,
};

grammarLessons[2] = { ...grammarLessons[2], contentStatus: "imported", sourcePages: [16, 17, 18, 19], exercises: grammarThreeExercises };
grammarLessons[3] = { ...grammarLessons[3], contentStatus: "imported", sourcePages: [20, 21, 22, 23], exercises: grammarFourExercises };
grammarLessons[4] = { ...grammarLessons[4], contentStatus: "imported", sourcePages: [24, 25, 26, 27, 28, 29], exercises: [...grammarFiveExercises, ...grammarReviewOneFive] };
grammarLessons[5] = { ...grammarLessons[5], contentStatus: "imported", sourcePages: [30, 31, 32, 33], exercises: grammarSixExercises };
grammarLessons[6] = { ...grammarLessons[6], contentStatus: "imported", sourcePages: [34, 35, 36, 37], exercises: grammarSevenExercises };
grammarLessons[7] = { ...grammarLessons[7], contentStatus: "imported", sourcePages: [38, 39, 40, 41], exercises: grammarEightExercises };
grammarLessons[8] = { ...grammarLessons[8], contentStatus: "imported", sourcePages: [42, 43, 44, 45], exercises: grammarNineExercises };
grammarLessons[9] = { ...grammarLessons[9], contentStatus: "imported", sourcePages: [46, 47, 48, 49, 50, 51], exercises: [...grammarTenExercises, ...grammarReviewOneTen] };
grammarLessons[10] = { ...grammarLessons[10], contentStatus: "imported", sourcePages: [52, 53, 54, 55], exercises: grammarElevenExercises };
grammarLessons[11] = { ...grammarLessons[11], contentStatus: "imported", sourcePages: [56, 57, 58, 59], exercises: grammarTwelveExercises };
grammarLessons[12] = { ...grammarLessons[12], contentStatus: "imported", sourcePages: [60, 61, 62, 63], exercises: grammarThirteenExercises };
grammarLessons[13] = { ...grammarLessons[13], contentStatus: "imported", sourcePages: [64, 65, 66, 67], exercises: grammarFourteenExercises };
grammarLessons[14] = { ...grammarLessons[14], contentStatus: "imported", sourcePages: [68, 69, 70, 71, 72, 73], exercises: [...grammarFifteenExercises, ...grammarReviewOneFifteen] };
grammarLessons[15] = { ...grammarLessons[15], contentStatus: "imported", sourcePages: [74, 75, 76, 77], exercises: grammarSixteenExercises };
grammarLessons[16] = { ...grammarLessons[16], contentStatus: "imported", sourcePages: [78, 79, 80, 81], exercises: grammarSeventeenExercises };
grammarLessons[17] = { ...grammarLessons[17], contentStatus: "imported", sourcePages: [82, 83, 84, 85], exercises: grammarEighteenExercises };
grammarLessons[18] = { ...grammarLessons[18], contentStatus: "imported", sourcePages: [86, 87, 88, 89], exercises: grammarNineteenExercises };
grammarLessons[19] = { ...grammarLessons[19], contentStatus: "imported", sourcePages: [90, 91, 92, 93, 94, 95], exercises: [...grammarTwentyExercises, ...grammarReviewOneTwenty] };
grammarLessons[20] = { ...grammarLessons[20], contentStatus: "imported", sourcePages: [96, 97, 98, 99], exercises: grammarTwentyOneExercises };
grammarLessons[21] = { ...grammarLessons[21], contentStatus: "imported", sourcePages: [100, 101, 102, 103], exercises: grammarTwentyTwoExercises };
grammarLessons[22] = { ...grammarLessons[22], contentStatus: "imported", sourcePages: [104, 105, 106, 107], exercises: grammarTwentyThreeExercises };
grammarLessons[23] = { ...grammarLessons[23], contentStatus: "imported", sourcePages: [108, 109, 110, 111], exercises: grammarTwentyFourExercises };
grammarLessons[24] = { ...grammarLessons[24], contentStatus: "imported", sourcePages: [112, 113, 114, 115], exercises: grammarTwentyFiveExercises };
grammarLessons[25] = { ...grammarLessons[25], contentStatus: "imported", sourcePages: [116, 117, 118, 119, 120, 121], exercises: [...grammarTwentySixExercises, ...grammarReviewOneTwentySix] };
grammarLessons[26] = { ...grammarLessons[26], contentStatus: "imported", sourcePages: [140, 141], exercises: grammarAssemblyOne };
grammarLessons[27] = { ...grammarLessons[27], contentStatus: "imported", sourcePages: [142, 143, 144, 145], exercises: grammarAssemblyTwo };

// A–G are unnumbered in the book; 27+ keeps them after lesson 26 in the UI.
grammarLessons.push(
  { ...grammarLesson(1, 3, "第1部 文の文法1 · IV 文法形式の整理", 27, "A 元の言葉に着目", ["～に際して", "～にあたって", "～にわたって", "～を通じて・～を通して", "～に限って", "～に関して", "～をめぐって", "～に対して", "～にこたえて", "～に基づいて", "～に沿って", "～にしたがって", "～につれて", "～に伴って", "～に応じて", "～によって", "～において", "～に先立って"]), contentStatus: "imported", sourcePages: [122, 123], exercises: consolidationA },
  { ...grammarLesson(1, 3, "第1部 文の文法1 · IV 文法形式の整理", 28, "B「言う・する」を使った言い方", ["～といった", "～といえば・～というと・～といったら", "～といっても", "～からといって", "～とはいいながら", "～からして", "～としたら・～とすれば・～とすると", "～にしても・～にしろ", "～にしては", "～にしたら・～にすれば", "～からすると・～からいうと"]), contentStatus: "imported", sourcePages: [124, 125], exercises: consolidationB },
  { ...grammarLesson(1, 3, "第1部 文の文法1 · IV 文法形式の整理", 29, "C 古い言葉を使った言い方", ["～もかまわず", "～を問わず", "～にかかわらず・～にもかかわらず", "～ずじまいだ", "～ずにはいられない", "～ざるを得ない", "～べきだ・～べきではない", "～まい・～ではあるまいか", "～つつ・～つつある", "～にせよ"]), contentStatus: "imported", sourcePages: [126, 127], exercises: consolidationC },
  { ...grammarLesson(1, 3, "第1部 文の文法1 · IV 文法形式の整理", 30, "D「もの・こと」を使った言い方", ["～ものか", "～というものではない", "～ものの・～とはいうものの", "～ものなら・～（よ）うものなら", "～もので・～ものだから", "～ものだ・～というものだ", "～たいものだ・～てほしいものだ", "～ないもの（だろう）か", "～ものがある", "～（のこと）となると", "～ないことには", "～ことだし・～のことだから", "～ことだ・～ことはない", "～ことだろう・～ことか", "～こと", "～ことなく", "～ことに", "～ことは～が", "～ということだ・～とのことだ"]), contentStatus: "imported", sourcePages: [128, 129, 130, 131], exercises: consolidationD },
  { ...grammarLesson(1, 3, "第1部 文の文法1 · IV 文法形式の整理", 31, "E「わけ・ところ」を使った言い方", ["～わけがない", "～わけではない・～というわけではない", "～わけにはいかない", "～ないわけにはいかない", "～わけだ・～というわけだ", "～どころではない", "～どころか", "～たところ", "～ところだった", "～ところから・～ことから"]), contentStatus: "imported", sourcePages: [132, 133], exercises: consolidationE },
  { ...grammarLesson(1, 3, "第1部 文の文法1 · IV 文法形式の整理", 32, "F 二つの言葉を組にする言い方・助詞", ["～やら～やら", "～というか～というか", "～にしても～にしても・～にしろ～にしろ・～にせよ～にせよ", "～だの～だの", "～か～ないかのうちに", "～（よ）うか～まいか", "～とは", "～ぐらい・～くらい", "～など・～なんか・～なんて", "～まで・～までして", "～として～ない", "～さえ", "～のみ"]), contentStatus: "imported", sourcePages: [134, 135], exercises: consolidationF },
  { ...grammarLesson(1, 3, "第1部 文の文法1 · IV 文法形式の整理", 33, "G 文法的性質の整理", ["事実か気持ちが入っているか", "自分か他者か", "プラスイメージかマイナスイメージか"]), contentStatus: "imported", sourcePages: [136, 137], exercises: consolidationG },
);

// Upgrade only reviewed exercises; stable IDs keep attempts and custom lessons intact.
for (const lesson of grammarLessons) lesson.exercises = lesson.exercises.map(enhanceGrammarExplanation);
