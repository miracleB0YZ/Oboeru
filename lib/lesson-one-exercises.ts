import { selectExercise, textExercise } from "./exercise-builders";
import type { Exercise } from "./types";

const passage = "僕には親友が二人いる。一人は小林君だ。彼は、明るく気さくな（①ひと　）で、だれとでもすぐに仲良くなるタイプだ。大学のときは、サッカー部のキャプテンをしていて、先輩からは信頼され、後輩からは（②した　）ていた。誰からも（③はん　）を持たれることがない、とてもいいやつだ。もう一人は大村君だ。彼はあまり（④しゃこ　）ではなく、ちょっと（⑤ぶあ　）なところがある。そのために（⑥ド　）な性格だと誤解されることがあるが、実はとても優しいやつだ。僕が元気がないときは、いつも（⑦　）ましてくれるし、絶対に人を（⑧　つける）ようなことはしない。何に対しても真面目で、本当に（⑨し　）な男だと思う。性格の違う二人だが、どちらも僕にとっては大切な親友だ。";

const cloze: Array<[string, string, string, string[]?]> = [
  ["①", "気さくな（①ひと　）で、だれとでもすぐに仲良くなる", "人柄", ["ひとがら"]],
  ["②", "後輩からは（②した　）ていた", "慕われ", ["したわれ"]],
  ["③", "誰からも（③はん　）を持たれることがない", "反感", ["はんかん"]],
  ["④", "彼はあまり（④しゃこ　）ではなく", "社交的", ["しゃこうてき"]],
  ["⑤", "ちょっと（⑤ぶあ　）なところがある", "無愛想", ["ぶあいそう"]],
  ["⑥", "（⑥ド　）な性格だと誤解される", "ドライ"],
  ["⑦", "いつも（⑦　）てくれる", "励まし", ["はげまし"]],
  ["⑧", "絶対に人を（⑧　）ようなことはしない", "傷つける", ["きずつける"]],
  ["⑨", "本当に（⑨し　）な男だと思う", "真摯", ["しんし"]],
];

const matchingOne = ["持つ", "際立つ", "反発する", "いたわる"];
const matchingTwo = ["磨く", "にじみ出る", "かばう", "気兼ねする"];
const bankOne = ["謙虚", "気さく", "頑固"];
const bankTwo = ["さも", "根っから", "まさしく"];

export const lessonOneBasicExercises: Exercise[] = [
  ...cloze.map(([number, prompt, answer, acceptedAnswers], index) => textExercise({
    id: `basic-1-${index + 1}`, group: "1 導入練習 · บทอ่านเติมคำ", title: `ช่อง ${number}`,
    prompt, answer, acceptedAnswers, hint: "พิมพ์คำเต็ม แล้วกดตรวจคำตอบ (ส่งได้ครั้งเดียว)",
    passage: index === 0 ? passage : undefined,
  })),
  ...[
    ["父親に", 3], ["個性が", 2], ["好意を", 1],
  ].map(([left, answer], index) => selectExercise({ id: `basic-2-1-${index + 1}`, group: "2 連語 · ชุด 1", title: `คู่ ${index + 1}`, prompt: `「${left}」に続く言葉を選びなさい。`, options: matchingOne, answer: Number(answer) })),
  ...[
    ["友人を", 3], ["上司に", 4], ["個性を", 1], ["人柄が", 2],
  ].map(([left, answer], index) => selectExercise({ id: `basic-2-2-${index + 1}`, group: "2 連語 · ชุด 2", title: `คู่ ${index + 1}`, prompt: `「${left}」に続く言葉を選びなさい。`, options: matchingTwo, answer: Number(answer) })),
  ...[
    ["愛想がよくて、誰とでも（　）に話す。", 2],
    ["人に注意されたら（　）に反省しよう。", 1],
    ["（　）な性格で、自分の思った通りにしないと気が済まない。", 3],
  ].map(([prompt, answer], index) => selectExercise({ id: `basic-3-1-${index + 1}`, group: "3 意味 · คลังคำชุด 1", title: `ข้อ ${index + 1}`, prompt: String(prompt), options: bankOne, answer: Number(answer) })),
  ...[
    ["世の中に（　）悪い人はいないと思う。", 2],
    ["この写真は（　）私が撮ったものです。", 3],
    ["あの人は何もしなかったくせに（　）自分がすべてやったような顔をする。", 1],
  ].map(([prompt, answer], index) => selectExercise({ id: `basic-3-2-${index + 1}`, group: "3 意味 · คลังคำชุด 2", title: `ข้อ ${index + 1}`, prompt: String(prompt), options: bankTwo, answer: Number(answer) })),
];
