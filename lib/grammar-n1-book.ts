import type { Book, Lesson } from "./types";
import { grammarN1OneExercises } from "./grammar-n1-one-exercises";
import { grammarN1TwoExercises } from "./grammar-n1-two-exercises";
import { grammarN1ThreeExercises } from "./grammar-n1-three-exercises";
import { grammarN1FourExercises } from "./grammar-n1-four-exercises";
import { grammarN1ReviewOneFourExercises } from "./grammar-n1-review-one-four";
import { grammarN1FiveExercises } from "./grammar-n1-five-exercises";
import { grammarN1SixExercises } from "./grammar-n1-six-exercises";
import { grammarN1SevenExercises } from "./grammar-n1-seven-exercises";
import { grammarN1EightExercises } from "./grammar-n1-eight-exercises";
import { grammarN1ReviewOneEightExercises } from "./grammar-n1-review-one-eight";
import { grammarN1NineExercises } from "./grammar-n1-nine-exercises";
import { grammarN1TenExercises } from "./grammar-n1-ten-exercises";
import { grammarN1ElevenExercises } from "./grammar-n1-eleven-exercises";
import { grammarN1TwelveExercises } from "./grammar-n1-twelve-exercises";
import { grammarN1ReviewOneTwelveExercises } from "./grammar-n1-review-one-twelve";
import { grammarN1ThirteenExercises } from "./grammar-n1-thirteen-exercises";
import { grammarN1FourteenExercises } from "./grammar-n1-fourteen-exercises";
import { grammarN1FifteenExercises } from "./grammar-n1-fifteen-exercises";
import { grammarN1SixteenExercises } from "./grammar-n1-sixteen-exercises";
import { grammarN1ReviewOneSixteenExercises } from "./grammar-n1-review-one-sixteen";
import { grammarN1SeventeenExercises } from "./grammar-n1-seventeen-exercises";
import { grammarN1EighteenExercises } from "./grammar-n1-eighteen-exercises";
import { grammarN1NineteenExercises } from "./grammar-n1-nineteen-exercises";
import { grammarN1TwentyExercises } from "./grammar-n1-twenty-exercises";
import { grammarN1ReviewOneTwentyExercises } from "./grammar-n1-review-one-twenty";
import { grammarN1ConsolidationAExercises } from "./grammar-n1-consolidation-a";
import { grammarN1ConsolidationBExercises } from "./grammar-n1-consolidation-b";
import { grammarN1ConsolidationCExercises } from "./grammar-n1-consolidation-c";
import { grammarN1ConsolidationDExercises } from "./grammar-n1-consolidation-d";
import { grammarN1ConsolidationEExercises } from "./grammar-n1-consolidation-e";
import { grammarN1ConsolidationFExercises } from "./grammar-n1-consolidation-f";
import { grammarN1ConsolidationGExercises } from "./grammar-n1-consolidation-g";
import { grammarN1AssemblyOne, grammarN1AssemblyTwo, grammarN1AssemblyThree } from "./grammar-n1-assembly";
import { grammarN1PassageOne } from "./grammar-n1-passage-one";
import { grammarN1PassageTwo } from "./grammar-n1-passage-two";
import { grammarN1PassageThree } from "./grammar-n1-passage-three";
import { grammarN1PassageFour } from "./grammar-n1-passage-four";
import { grammarN1PassageFive } from "./grammar-n1-passage-five";
import { grammarN1PassageSix } from "./grammar-n1-passage-six";
import { grammarN1PassageSeven } from "./grammar-n1-passage-seven";
import { grammarN1PassageEight } from "./grammar-n1-passage-eight";

export const grammarN1Book: Book = {
  id: "shin-kanzen-master-n1-bunpou",
  title: "新完全マスター 文法 日本語能力試験 N1",
  category: "Grammar",
  jlptLevel: "N1",
  lessons: 44,
};

type ChapterRow = [title: string, page: number, patterns: string[]];
// Transcribed visually from the supplied scan's contents, PDF pages 5–8.
const chapters: ChapterRow[] = [
  ["時間関係", 8, ["～が早いか", "～や・～や否や", "～なり", "～そばから", "～てからというもの（は）", "～にあって"]],
  ["範囲の始まり・限度", 12, ["～を皮切りに（して）・～を皮切りとして", "～に至るまで", "～を限りに", "～をもって", "～といったところだ"]],
  ["限定・非限定・付加", 16, ["～をおいて", "～ならでは", "～にとどまらず", "～はおろか", "～もさることながら"]],
  ["例示", 20, ["～なり…なり", "～であれ…であれ・～であろうと…であろうと", "～といい…といい", "～といわず…といわず"]],
  ["関連・無関係", 26, ["～いかんだ", "～いかんにかかわらず・～いかんによらず・～いかんを問わず", "～をものともせず（に）", "～をよそに", "～ならいざしらず"]],
  ["様子", 30, ["～んばかりだ", "～とばかり（に）", "～ともなく・～ともなしに", "～ながらに（して）", "～きらいがある"]],
  ["付随行動", 34, ["～がてら", "～かたがた", "～かたわら"]],
  ["逆接", 36, ["～ところを", "～ものを", "～とはいえ", "～といえども", "～と思いきや"]],
  ["条件", 42, ["～とあれば", "～たら最後・～たが最後", "～ようでは", "～なしに（は）・～なしでは・～なくして（は）", "～くらいなら"]],
  ["逆接条件", 46, ["～（よ）うと（も）・～（よ）うが", "～（よ）うと～まいと・～（よ）うが～まいが", "～であれ・～であろうと", "～たところで", "～ば～で・～なら～で・～たら～たで"]],
  ["目的・手段", 50, ["～べく", "～んがため（に）", "～をもって"]],
  ["原因・理由", 52, ["～ばこそ", "～とあって", "～ではあるまいし", "～手前", "～ゆえ（に）"]],
  ["可能・不可能・禁止", 58, ["～にかたくない", "～に～ない・～（よ）うにも～ない", "～て（は）いられない", "～べくもない", "～べからず・～べからざる", "～まじき"]],
  ["話題・評価の基準", 62, ["～ときたら", "～ともなると・～ともなれば", "～ともあろう", "～たるもの（は）", "～なりに"]],
  ["比較対照", 66, ["～にひきかえ", "～にもまして", "～ないまでも"]],
  ["結末・最終の状態", 70, ["～に至って・～に至っても", "～に至っては", "～始末だ", "～っぱなしだ"]],
  ["強調", 76, ["～たりとも…ない", "～すら", "～だに", "～にして", "～あっての", "～からある・～からする・～からの"]],
  ["主張・断定", 80, ["～までもない", "～までだ・～までのことだ", "～ばそれまでだ", "～には当たらない", "～でなくてなんだろう（か）"]],
  ["評価・感想", 84, ["～に足る", "～に堪える・～に堪えない", "～といったらない", "～かぎりだ", "～極まる・～極まりない", "～とは"]],
  ["心情・強制的思い", 88, ["～てやまない", "～に堪えない", "～ないではすまない・～ずにはすまない", "～ないではおかない・～ずにはおかない", "～を禁じ得ない", "～を余儀なくされる・～を余儀なくさせる"]],
];

function lesson(part: number, number: number, chapterNumber: number, chapter: string, title: string, page: number, patterns: string[] = []): Lesson {
  return {
    id: `shin-kanzen-n1-bunpou-p${part}-${String(number).padStart(2, "0")}`,
    bookId: grammarN1Book.id, chapterNumber, chapter, number, title,
    contentStatus: "index_only", sourcePages: [page],
    vocabularyGroups: [], examples: [], exercises: [],
    grammarPatterns: patterns.map((pattern, index) => ({ id: `n1g-p${part}-${String(number).padStart(2, "0")}-pattern-${index + 1}`, pattern })),
  };
}

export const grammarN1Lessons: Lesson[] = chapters.map(([title, page, patterns], index) => {
  const chapterNumber = index < 7 ? 1 : index < 17 ? 2 : 3;
  const section = ["I ことがらを説明する", "II 主観を含めて説明する", "III 主観を述べる"][chapterNumber - 1];
  return lesson(1, index + 1, chapterNumber, `第1部 文の文法1 · ${section}`, title, page, patterns);
});
grammarN1Lessons[0] = { ...grammarN1Lessons[0], contentStatus: "imported", sourcePages: [8, 9, 10, 11], exercises: grammarN1OneExercises };
grammarN1Lessons[1] = { ...grammarN1Lessons[1], contentStatus: "imported", sourcePages: [12, 13, 14, 15], exercises: grammarN1TwoExercises };
grammarN1Lessons[2] = { ...grammarN1Lessons[2], contentStatus: "imported", sourcePages: [16, 17, 18, 19], exercises: grammarN1ThreeExercises };
grammarN1Lessons[3] = { ...grammarN1Lessons[3], contentStatus: "imported", sourcePages: [20, 21, 22, 23, 24, 25], exercises: [...grammarN1FourExercises, ...grammarN1ReviewOneFourExercises] };
grammarN1Lessons[4] = { ...grammarN1Lessons[4], contentStatus: "imported", sourcePages: [26, 27, 28, 29], exercises: grammarN1FiveExercises };
grammarN1Lessons[5] = { ...grammarN1Lessons[5], contentStatus: "imported", sourcePages: [30, 31, 32, 33], exercises: grammarN1SixExercises };
grammarN1Lessons[6] = { ...grammarN1Lessons[6], contentStatus: "imported", sourcePages: [34, 35], exercises: grammarN1SevenExercises };
grammarN1Lessons[7] = { ...grammarN1Lessons[7], contentStatus: "imported", sourcePages: [36, 37, 38, 39, 40, 41], exercises: [...grammarN1EightExercises, ...grammarN1ReviewOneEightExercises] };
grammarN1Lessons[8] = { ...grammarN1Lessons[8], contentStatus: "imported", sourcePages: [42, 43, 44, 45], exercises: grammarN1NineExercises };
grammarN1Lessons[9] = { ...grammarN1Lessons[9], contentStatus: "imported", sourcePages: [46, 47, 48, 49], exercises: grammarN1TenExercises };
grammarN1Lessons[10] = { ...grammarN1Lessons[10], contentStatus: "imported", sourcePages: [50, 51], exercises: grammarN1ElevenExercises };
grammarN1Lessons[11] = { ...grammarN1Lessons[11], contentStatus: "imported", sourcePages: [52, 53, 54, 55, 56, 57], exercises: [...grammarN1TwelveExercises, ...grammarN1ReviewOneTwelveExercises] };
grammarN1Lessons[12] = { ...grammarN1Lessons[12], contentStatus: "imported", sourcePages: [58, 59, 60, 61], exercises: grammarN1ThirteenExercises };
grammarN1Lessons[13] = { ...grammarN1Lessons[13], contentStatus: "imported", sourcePages: [62, 63, 64, 65], exercises: grammarN1FourteenExercises };
grammarN1Lessons[14] = { ...grammarN1Lessons[14], contentStatus: "imported", sourcePages: [66, 67, 68, 69], exercises: grammarN1FifteenExercises };
grammarN1Lessons[15] = { ...grammarN1Lessons[15], contentStatus: "imported", sourcePages: [70, 71, 72, 73, 74, 75], exercises: [...grammarN1SixteenExercises, ...grammarN1ReviewOneSixteenExercises] };
grammarN1Lessons[16] = { ...grammarN1Lessons[16], contentStatus: "imported", sourcePages: [76, 77, 78, 79], exercises: grammarN1SeventeenExercises };
grammarN1Lessons[17] = { ...grammarN1Lessons[17], contentStatus: "imported", sourcePages: [80, 81, 82, 83], exercises: grammarN1EighteenExercises };
grammarN1Lessons[18] = { ...grammarN1Lessons[18], contentStatus: "imported", sourcePages: [84, 85, 86, 87], exercises: grammarN1NineteenExercises };
grammarN1Lessons[19] = { ...grammarN1Lessons[19], contentStatus: "imported", sourcePages: [88, 89, 90, 91, 92, 93], exercises: [...grammarN1TwentyExercises, ...grammarN1ReviewOneTwentyExercises] };

const consolidation: Array<[string, number]> = [
  ["A 動詞の意味に着目 - 1", 94], ["B 動詞の意味に着目 - 2", 98],
  ["C 古い言葉を使った言い方", 100], ["D「もの・こと・ところ」を使った言い方", 102],
  ["E 二つの言葉を組にする言い方", 104], ["F 助詞・複合助詞", 106], ["G 文法的性質の整理", 108],
];
grammarN1Lessons.push(...consolidation.map(([title, page], index) => lesson(1, 21 + index, 4, "第1部 文の文法1 · IV 文法形式の整理", title, page)));
grammarN1Lessons[20] = { ...grammarN1Lessons[20], contentStatus: "imported", sourcePages: [94, 95, 96, 97], exercises: grammarN1ConsolidationAExercises,
  grammarPatterns: ["～と相まって", "～をおして", "～にかこつけて", "～をかねて", "～にかまけて", "～に即して", "～に照らして", "～にのっとって", "～をひかえて", "～を踏まえて", "～を経て", "～にかかわる", "～にまつわる", "～にひきかえ"].map((pattern, index) => ({ id: `n1g-p1-21-pattern-${index + 1}`, pattern })) };
grammarN1Lessons[21] = { ...grammarN1Lessons[21], contentStatus: "imported", sourcePages: [98, 99], exercises: grammarN1ConsolidationBExercises,
  grammarPatterns: ["～に至るまで", "～に至って", "～に至っては", "～の至り", "～には当たらない", "～を禁じ得ない", "～てはかなわない", "～に忍びない", "～に恥じない", "～てはばからない"].map((pattern, index) => ({ id: `n1g-p1-22-pattern-${index + 1}`, pattern })) };
grammarN1Lessons[22] = { ...grammarN1Lessons[22], contentStatus: "imported", sourcePages: [100, 101], exercises: grammarN1ConsolidationCExercises,
  grammarPatterns: ["～ず", "～んばかり", "～んがため", "～べからず", "～べく", "～べくもない", "～べくして", "～まい", "～かろう", "～まじき", "～たるもの", "～たりとも", "～ごとく・～ごとき", "～いかん"].map((pattern, index) => ({ id: `n1g-p1-23-pattern-${index + 1}`, pattern })) };
grammarN1Lessons[23] = { ...grammarN1Lessons[23], contentStatus: "imported", sourcePages: [102, 103], exercises: grammarN1ConsolidationDExercises,
  grammarPatterns: ["～てからというもの", "～というもの", "～ものを", "～ないものでもない", "～ものと思う", "～ものと思われる", "～をいいことに", "～といったところだ", "～ところを", "～たところで", "～にしたところで"].map((pattern, index) => ({ id: `n1g-p1-24-pattern-${index + 1}`, pattern })) };
grammarN1Lessons[24] = { ...grammarN1Lessons[24], contentStatus: "imported", sourcePages: [104, 105], exercises: grammarN1ConsolidationEExercises,
  grammarPatterns: ["～といい…といい", "～といわず…といわず", "～なり…なり", "～であれ…であれ", "～であろうと…であろうと", "～（よ）うが～まいが", "～ば～で・～たら～たで", "～に～ない", "～（よ）うにも～ない", "～つ…つ", "～ては…～ては…", "～かれ…かれ"].map((pattern, index) => ({ id: `n1g-p1-25-pattern-${index + 1}`, pattern })) };
grammarN1Lessons[25] = { ...grammarN1Lessons[25], contentStatus: "imported", sourcePages: [106, 107], exercises: grammarN1ConsolidationFExercises,
  grammarPatterns: ["～をもって", "～ばこそ", "～だに", "～すら", "～にして", "～とて", "～にて", "～やら", "～より"].map((pattern, index) => ({ id: `n1g-p1-26-pattern-${index + 1}`, pattern })) };
grammarN1Lessons[26] = { ...grammarN1Lessons[26], contentStatus: "imported", sourcePages: [108, 109], exercises: grammarN1ConsolidationGExercises,
  grammarPatterns: ["後件の制約", "一人称・三人称", "プラス・マイナスの評価"].map((pattern, index) => ({ id: `n1g-p1-27-pattern-${index + 1}`, pattern })) };
grammarN1Lessons.push(
  lesson(2, 1, 5, "第2部 文の文法2", "文の組み立て - 1 決まった形", 112),
  lesson(2, 2, 5, "第2部 文の文法2", "文の組み立て - 2 名詞を説明する形式", 114),
  lesson(2, 3, 5, "第2部 文の文法2", "文の組み立て - 3 接続に注意", 116),
);
[grammarN1AssemblyOne, grammarN1AssemblyTwo, grammarN1AssemblyThree].forEach((exercises, index) => {
  grammarN1Lessons[27 + index] = { ...grammarN1Lessons[27 + index], contentStatus: "imported", sourcePages: [112 + index * 2, 113 + index * 2], exercises,
    grammarPatterns: (index === 0 ? ["否定を伴う形式", "疑問詞を伴う形式", "数量を伴う形式"] : index === 1 ? ["名詞を後続する形式", "名詞修飾", "内容を表す「という」"] : ["名詞接続", "動詞辞書形接続", "複合形式の接続"]).map((pattern, number) => ({ id: `n1g-p2-${index + 1}-pattern-${number + 1}`, pattern })) };
});
const passages: Array<[string, number]> = [
  ["時制", 120], ["条件を表す文", 124], ["視点を動かさない手段 - 1 動詞・自動詞と他動詞", 128],
  ["視点を動かさない手段 - 2「～てくる・～ていく」", 132], ["視点を動かさない手段 - 3 受身・使役・使役受身", 136],
  ["視点を動かさない手段 - 4「～てあげる・～てもらう・～てくれる」", 140],
  ["指示表現「こ・そ・あ」", 144], ["「は・が」の使い分け", 148], ["接続表現", 152],
  ["省略・繰り返し・言い換え", 156], ["文体の一貫性", 160], ["話の流れを考える", 164],
];
grammarN1Lessons.push(...passages.map(([title, page], index) => lesson(3, index + 1, 6, "第3部 文章の文法", title, page)));
grammarN1Lessons[30] = { ...grammarN1Lessons[30], contentStatus: "imported", sourcePages: [120, 121, 122, 123], exercises: grammarN1PassageOne,
  grammarPatterns: ["現在形の特別な用法", "過去形の特別な用法", "反事実の「～ていた」", "名詞修飾節の時制"].map((pattern, index) => ({ id: `n1g-p3-01-pattern-${index + 1}`, pattern })) };
grammarN1Lessons[31] = { ...grammarN1Lessons[31], contentStatus: "imported", sourcePages: [124, 125, 126, 127], exercises: grammarN1PassageTwo,
  grammarPatterns: ["仮定・確定の条件", "反実仮想", "前置きの条件表現"].map((pattern, index) => ({ id: `n1g-p3-02-pattern-${index + 1}`, pattern })) };
grammarN1Lessons[32] = { ...grammarN1Lessons[32], contentStatus: "imported", sourcePages: [128, 129, 130, 131], exercises: grammarN1PassageThree,
  grammarPatterns: ["話者側の視点", "自動詞・他動詞", "相互動作の「～合う」"].map((pattern, index) => ({ id: `n1g-p3-03-pattern-${index + 1}`, pattern })) };
grammarN1Lessons[33] = { ...grammarN1Lessons[33], contentStatus: "imported", sourcePages: [132, 133, 134, 135], exercises: grammarN1PassageFour,
  grammarPatterns: ["方向の「～てくる・～ていく」", "心理的位置と視点", "時間の「～てくる・～ていく」"].map((pattern, index) => ({ id: `n1g-p3-04-pattern-${index + 1}`, pattern })) };
grammarN1Lessons[34] = { ...grammarN1Lessons[34], contentStatus: "imported", sourcePages: [136, 137, 138, 139], exercises: grammarN1PassageFive,
  grammarPatterns: ["受身", "使役", "使役受身", "自発の表現"].map((pattern, index) => ({ id: `n1g-p3-05-pattern-${index + 1}`, pattern })) };
grammarN1Lessons[35] = { ...grammarN1Lessons[35], contentStatus: "imported", sourcePages: [140, 141, 142, 143], exercises: grammarN1PassageSix,
  grammarPatterns: ["～てあげる", "～てもらう", "～てくれる", "～てもらえる", "～させてもらう"].map((pattern, index) => ({ id: `n1g-p3-06-pattern-${index + 1}`, pattern })) };
grammarN1Lessons[36] = { ...grammarN1Lessons[36], contentStatus: "imported", sourcePages: [144, 145, 146, 147], exercises: grammarN1PassageSeven,
  grammarPatterns: ["この・その・あの", "こう・そう", "こんな・そんな", "指示語と参照先"].map((pattern, index) => ({ id: `n1g-p3-07-pattern-${index + 1}`, pattern })) };
grammarN1Lessons[37] = { ...grammarN1Lessons[37], contentStatus: "imported", sourcePages: [148, 149, 150, 151], exercises: grammarN1PassageEight,
  grammarPatterns: ["主題の「は」", "主語の「が」", "既知情報・新情報", "主題内の主語"].map((pattern, index) => ({ id: `n1g-p3-08-pattern-${index + 1}`, pattern })) };
grammarN1Lessons.push(
  lesson(4, 1, 7, "模擬試験", "第1回", 170),
  lesson(4, 2, 7, "模擬試験", "第2回", 174),
);
