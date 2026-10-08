/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS enables loading TypeScript data modules without a separate build. */
const fs = require("node:fs");
const ts = require("typescript");
const assert = require("node:assert/strict");
require.extensions[".ts"] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const { vocabularyLessons } = require("../lib/vocabulary-lessons.ts");
const { vocabularyN2Lessons } = require("../lib/vocabulary-n2-book.ts");
// Independently transcribed from the original answer booklet.
const keys = {
  "shin-kanzen-n2-goi-p2-c5-l1": [
    ..."4 3 2 | 3 2 4 1 | 2 3 4 1 | 3 2 4 1 | 4 1 2 3 | 2 3 4 1 | 1 3 2 | 3 1 2 | 2 1 3 | 1 3 2 | 2 3 1 | 3 2 1 | 3 1 2 | 3 1 2".split(/[ |]+/),
    "した", "きっぱりと", "湿っている", "だ", "勉強した", "ひっそりとした",
    ..."3 2 2 1 4 4 3 2 3 1 | 3 2 2 4 3 | 2 2 4 1 4".split(/[ |]+/),
  ],
  "shin-kanzen-n2-goi-p2-c4-l3": "2 4 3 | 4 1 2 3 | 2 3 1 | 2 3 1 | 1 2 3 | 3 2 1 | 3 1 2 | 3 1 2 | 1 3 2 | 1 3 2 | 3 1 2 | 1 2 2 1 2 | 3 1 2 3 3 3 4 1 2 2 | 2 2 1 3 2 | 4 2 1 3 4".split(/[ |]+/),
  "shin-kanzen-n2-goi-p2-c4-l2": [
    ..."1 3 2 | 2 3 1 | 3 1 2 | 1 2 3 | 3 2 1 | 2 1 3 | 1 3 2 | 1 3 2 | 2 2 1 2 1 1 2".split(/[ |]+/),
    "面白くないです", "母親のように", "当たったら", "しないだろう", "いません",
    ..."3 3 4 1 4 2 3 2 3 3 | 1 3 2 2 1 | 4 3 1 1 4".split(/[ |]+/),
  ],
  "shin-kanzen-n2-goi-p2-c4-l1": [
    ..."1 3 2 | 3 1 2 | 2 3 1 | 3 2 1 | 3 1 2 | 3 2 1 | 2 1 3 | 2 1 3 | 1 2 3 | 2 2 1 1 2 1".split(/[ |]+/),
    "好きになりました", "いなくなる", "減少した",
    ..."1 2 1 4 2 3 4 2 1 3 | 3 1 3 3 4 | 3 4 1 3 2".split(/[ |]+/),
  ],
  "shin-kanzen-n2-goi-p2-c3-l1": "1 3 | 2 3 1 | 2 1 3 | 2 1 3 | 2 3 1 | 3 2 1 | 2 1 3 | 1 2 3 | 3 1 2 | 1 2 3 | 1 2 3 | 1 3 2 | 3 2 1 | 3 2 1 | 1 2 2 2 1 1 2 | 3 4 2 3 3 2 4 1 1 4 | 2 1 1 3 4 | 4 4 1 3 2".split(/[ |]+/),
  "shin-kanzen-n2-goi-p2-c2-l2": [
    ..."4 1 5 2 | 4 1 5 3 2 | 3 5 2 4 1 | 2 3 4 5 1".split(/[ |]+/),
    ..."試供品 きっかけ 分野 チャンス 使い道 打ち合わせ スケジュール トレーニング あがって 打ち消す 一致した 引き返す リラックスする 驚いた 言い張って 持ち直した 転居 伝言 サポート レジャー".split(" "),
    ..."4 2 5 3 | 2 1 4 5 3 | 4 1 3 3 2 2 2 1 2 2 4 3 1 3 2 3 2 1 4 3 2 1 2 4 1".split(/[ |]+/),
  ],
  "shin-kanzen-n2-goi-p2-c2-l1": "1 4 5 3 | 5 4 2 1 3 | 3 4 2 5 1 | 4 2 3 5 1 | 3 2 4 1 | 4 3 1 2 | 1 2 3 4 | 3 1 2 4 | 4 2 1 3 | 1 3 4 5 | 1 5 3 4 2 | 1 1 3 1 3 2 3 3 2 3 4 1 2 4 2 1 1 2 4 2 2 4 3 1 2".split(/[ |]+/),
  "shin-kanzen-n2-goi-p2-c1-l1": [
    ..."3 4 1 2 | 2 1 4 3 | 2 1 4 3 | 3 4 1 2".split(/[ |]+/),
    ..."傾いて 傾き 逆らって 逆らう 注いで 注いで 押さえた 押さえて 崩した 崩して 削って 削って 狂って 狂って 縛られて 縛られ つかんで つかむ 訴えて 訴えた つぶして つぶす 備えて 備えて 刻まれて 刻み 絞って 絞って 迫って 迫られて".split(" "),
    ..."2 4 1 4 1 3 3 2 2 4 | 3 2 3 2 2 | 1 4 1 1 2".split(/[ |]+/),
  ],
  "shin-kanzen-n2-goi-p2-c1-l2": [
    ..."5 4 3 6 | 5 1 6 3 2 4 | 4 1 3 5 6 2".split(/[ |]+/),
    ..."寄せて 寄せられて 寄せて 膨らんで 膨らんで 膨らんで にらんで にらんだ 積んで 積む はねて はねて はねて 振って 振られて 振って 解いて 解いて 解き とらえた とらえて はまって はまら 触れる 触れた ぶつかる ぶつかって ふさがって ふさがって 握る 握って".split(" "),
    ..."4 1 4 4 2 3 4 2 1 4 | 2 2 2 4 4 | 4 2 3 3 4".split(/[ |]+/),
  ],
  "shin-kanzen-n2-goi-p2-c1-l3": [
    ..."4 2 1 | 2 3 4 1 | 4 2 1 3".split(/[ |]+/),
    ..."険しく 険しい 粗くて 粗い 恐ろしい 恐ろしく くどい くどい 鈍く 鈍く 鈍い 鈍い 荒い 荒い 鋭い 鋭い 鋭く 鋭い 粗末な 粗末 純粋な 純粋な 穏やかな 穏やかな 勝手な 勝手に 勝手".split(" "),
    ..."形 幅 波 型 文句 陰 幅 裏 波 影".split(" "),
    ..."1 4 2 2 4 4 4 1 1 4 | 4 3 2 1 3 | 2 2 2 4 3".split(/[ |]+/),
  ],
  "shin-kanzen-n2-goi-c9-l2": ["かつて", "早朝", "日ごろ", "向かって", "そのうち", "今後", ..."4 2 3 4 1 3 2 | 3 2 1 1 3 2 | 1 2 | 2 3 | 2 4 1 3 4 2 4 3".split(/[ |]+/)],
  "shin-kanzen-n2-goi-c9-l1": ["豊富", "乏しい", "加わる", "高度", "大いに", ..."4 3 2 2 1 4 3 | 2 1 3 2 3 1 | 1 1 | 2 1 | 3 4 2 1 4 1 3 1".split(/[ |]+/)],
  "shin-kanzen-n2-goi-c8-l2": ["組み換え", "生物", "人工的", "消費者", "作物", "生産量", "組み換え", "安全", ..."1 4 3 2 1 4 3 | 2 1 3 1 3 2 | 2 2 | 1 2 | 1 3 1 3 1 2 3 2".split(/[ |]+/)],
  "shin-kanzen-n2-goi-c8-l1": ["地球温暖化", "変動", "環境保護", "リサイクル", "ペットボトル", "牛乳パック", "瓶", "回収", "排出量", "制限", "現状", ..."4 1 3 3 2 4 1 | 3 2 1 3 2 1 | 2 1 | 2 1 | 4 4 2 2 2 1 3 1".split(/[ |]+/)],
  "shin-kanzen-n2-goi-c7-l4": ["国家", "統一", "議論", "世紀", "制度", "憲法", "定められている", "植民地", "支配", "貴族", "権力", ..."4 3 2 4 2 1 3 | 2 1 3 2 3 1 | 1 1 | 2 1 | 1 4 4 1 2 2 4 2".split(/[ |]+/)],
  "shin-kanzen-n2-goi-c7-l3": ["不景気", "金融", "経済", "回復", "市場", "納められる", "税金", "収入", "負担", "強いられる", ..."4 1 2 3 2 4 1 | 2 3 1 3 1 2 | 2 2 | 2 2 | 1 3 2 4 3 4 1 4".split(/[ |]+/)],
  "shin-kanzen-n2-goi-c7-l2": ["ねらった", "遭う", "奪った", "詐欺", "行方", "再発防止", ..."4 3 2 3 2 1 4 | 3 2 1 1 2 3 | 1 1 | 2 2 | 4 3 1 1 3 2 2 4".split(/[ |]+/)],
  "shin-kanzen-n2-goi-c7-l1": ["ふさわしい", "交際", "承諾", "説得", "盛大な", "親戚", "のびのび", ..."4 1 3 3 1 4 2 | 2 1 3 2 1 3 | 2 1 | 2 3 | 3 2 1 1 2 3 4 2".split(/[ |]+/)],
  "shin-kanzen-n2-goi-c6-l2": ["メール", "添付", "ファイル", "モニター", "ソフト", "起動", "再起動", "操作", "ウイルス", "ウイルス", "ソフト", "インストール", "修理", "修理", "ウイルス", "ソフト", "インストール", ..."4 1 2 | 2 1 3 3 2 1 | 1 1 | 3 2 | 1 2 3 2 1 1 2 4".split(/[ |]+/)],
  "shin-kanzen-n2-goi-c6-l1": ["メディア", "放送", "流れる", "映像", "記者", "取材", "記事", "詳しく", "正確", "メディア", ..."2 4 3 2 4 1 3 | 1 2 3 3 1 2 | 2 1 | 3 1 | 3 1 3 2 1 2 1 1".split(/[ |]+/)],
  "shin-kanzen-n2-goi-c5-l2": ["入社", "就職活動", "一流企業", "月給", "研修", "資本金", "経営", ..."3 4 2 2 4 1 3 | 2 3 1 2 1 3 | 2 2 | 2 1 | 3 1 3 2 2 3 4 4".split(/[ |]+/)],
  "shin-kanzen-n2-goi-c5-l1": ["学科", "担当", "成績", "進学", "実験", "まとめ", "論文", ..."3 4 2 4 1 2 3 | 3 1 2 2 3 1 | 2 1 | 1 1 | 1 2 3 2 2 3 4 1".split(/[ |]+/)],
  "shin-kanzen-n2-goi-c4-l2": ["盆地", "蒸し暑い", "凍える", "見下ろす", "眺め", "水平線", "ふもと", "紅葉", ..."3 2 4 1 3 4 2 | 1 3 2 3 1 2 | 2 1 | 2 3 | 1 2 2 4 4 1 3 1".split(/[ |]+/)],
  "shin-kanzen-n2-goi-c4-l1": ["滞在", "出迎えて", "日程", "往復", "待ち合わせる", "パスポート", "免税店", ..."2 4 3 4 2 1 3 | 1 3 2 2 3 1 | 1 1 | 3 2 | 2 4 4 1 3 2 4 2".split(/[ |]+/)],
  "shin-kanzen-n2-goi-c3-l1": ["応援", "ベテラン", "引退", "芝居", "役者", "舞台", "セリフ", "粗筋", ..."4 2 1 2 4 1 3 | 2 3 1 1 2 3 | 2 1 | 3 1 | 2 1 2 2 1 1 4 1".split(/[ |]+/)],
  "shin-kanzen-n2-goi-c2-l3": ["腰掛け", "立ち上がる", "診察", "休養", "たまらない", "睡眠不足", "不規則", "調子", ..."4 2 1 4 3 1 2 | 1 3 2 3 1 2 | 2 2 | 2 1 | 2 1 3 3 2 2 4 1".split(/[ |]+/)],
  "shin-kanzen-n2-goi-c2-l2": ["縫って", "編んで", "ふいて", "ぴかぴか", "揚げた", "献立", "炊く", "散らかって", ..."3 1 4 2 4 3 1 | 1 3 2 3 2 1 | 2 2 | 2 1 | 4 1 3 1 3 2 3 2".split(/[ |]+/)],
  "shin-kanzen-n2-goi-c2-l1": ["さっぱり", "香り", "食欲", "行列", "しつこい", "もたれる", "好き好き", ..."3 1 2 3 2 1 4 | 3 2 1 2 1 3 | 1 2 | 1 2 | 2 4 3 4 4 3 4 1".split(/[ |]+/)],
  "shin-kanzen-n2-goi-c1-l3": ["あこがれて", "誤解", "避ける", "嫌う", "見かけて", "うらやまし", "申し訳ない", "解けて", "仲直り", ..."2 1 4 3 2 4 1 | 2 3 1 1 3 2 | 2 2 | 2 1 | 3 4 4 1 1 4 4 2".split(/[ |]+/)],
  "shin-kanzen-n2-goi-c1-l2": ["ユーモア", "しゃれ", "消極的", "慎重", "のんびり", "要領", "飽きる", "長所", ..."3 4 1 3 1 2 4 | 2 3 1 3 2 1 | 1 2 | 2 1 | 1 1 3 4 3 2 1 4".split(/[ |]+/)],
  "shin-kanzen-n2-goi-c1-l1": ["一人っ子", "仲良し", "付き合い", "集まり", "懐かし", "後輩", "仕事仲間", ..."2 4 3 3 1 2 4 | 1 3 2 3 1 2 | 1 2 | 2 1 | 2 3 2 3 2 4 4 3".split(/[ |]+/)],
  "shin-kanzen-n1-goi-mock-1": "4 3 2 1 4 2 2 | 3 2 2 1 2 3 | 3 2 1 3 4 1".split(/[ |]+/),
  "shin-kanzen-n1-goi-mock-2": "4 3 4 4 2 4 2 | 4 2 4 2 4 3 | 2 3 4 1 3 4".split(/[ |]+/),
  "shin-kanzen-n1-goi-p2-c7-l3": "6 4 5 1 3 2 | 2 6 3 5 4 1 | 8 5 4 6 2 1 3 7 | 6 7 10 1 2 8 9 3 4 5 | 5 1 10 7 6 2 3 9 4 8 11 | 2 2 1 1 1 2 1 2 | 2 1 2 1 1 1 1 1 | 4 3 1 1 1 3 2 2 4 3 3 2 2 1 1 | 2 3 2 2 2".split(/[ |]+/),
  "shin-kanzen-n1-goi-p2-c7-l2": "4 3 1 2 5 3 1 4 2 | 1 2 3 3 1 2 3 2 1 3 1 2 3 1 2 | 2 2 1 2 1 | 6 4 3 1 2 8 5 7 | 3 1 4 3 3 3 2 2 1 1 4 3 2 | 2 3 2 | 4 2 1".split(/[ |]+/),
  "shin-kanzen-n1-goi-p2-c7-l1": "4 3 1 2 3 5 4 1 2 | 3 2 1 1 3 2 3 2 1 2 3 1 | 2 2 2 1 1 1 1 2 | 3 4 2 6 5 1 | 1 2 3 4 2 1 4 2 3 4 1 4 4 | 1 2 1 | 3 1 2".split(/[ |]+/),
  "shin-kanzen-n1-goi-p2-c6-l2": "1 2 2 2 1 2 1 | 4 3 1 2 2 1 4 3 1 4 3 2 | 3 4 2 | 2 1 2 1 4 | 3 1 3 4 3 2 2 2 4 1 1 4 4 3".split(/[ |]+/),
  "shin-kanzen-n1-goi-p2-c6-l1": "2 1 1 1 2 2 1 | 4 1 2 3 4 3 1 2 1 3 4 2 | 4 3 3 | 1 2 2 2 4 | 1 3 4 4 1 3 2 2 3 3 2 4 4 4".split(/[ |]+/),
  "shin-kanzen-n1-goi-p2-c5-l2": "1 3 2 3 4 1 2 2 3 1 4 | 2 1 3 3 2 1 2 3 1 3 1 2 2 1 3 3 2 1 | 2 1 1 2 2 2 1 | 1 1 2 3 1 2 | 3 3 3 1 3 4 4 3 4 2 | 4 2 4 4 1 | 1 3 4 4 2".split(/[ |]+/),
  "shin-kanzen-n1-goi-p2-c5-l1": "1 2 3 1 4 3 2 4 2 3 1 3 1 4 2 4 3 2 1 3 2 1 4 4 3 2 1 | 2 1 3 3 1 2 3 2 1 2 3 1 | 1 2 3 2 1 2 1 | 1 2 1 2 3 2 | 1 3 2 3 2 4 3 1 4 4 | 1 2 3 1 2 | 3 1 4 1 1".split(/[ |]+/),
  "shin-kanzen-n1-goi-p2-c4-l3": "3 4 2 4 3 2 1 | 3 1 2 1 3 2 1 2 3 2 3 1 1 2 3 1 3 2 3 1 2 2 3 1 3 2 1 | 2 1 2 1 2 | 2 1 1 3 3 3 2 3 2 2 | 2 2 4 2 3 | 3 4 1 2 4".split(/[ |]+/),
  "shin-kanzen-n1-goi-p2-c4-l2": "3 1 2 1 3 2 3 1 2 1 2 3 | 2 1 3 1 3 2 3 1 2 1 3 2 | 1 2 2 3 2 3 1 | 1 1 2 2 2 | 1 1 1 4 3 3 2 4 2 2 | 3 4 3 3 2 | 3 3 1 4 3".split(/[ |]+/),
  "shin-kanzen-n1-goi-p2-c4-l1": "1 3 2 3 2 1 2 3 1 1 3 2 | 3 1 2 3 1 2 2 3 1 3 2 1 3 2 1 | 2 1 1 2 2 1 | 1 2 3 | 4 4 1 2 4 2 2 2 4 3 | 2 4 2 2 4 | 3 2 4 1 4".split(/[ |]+/),
  "shin-kanzen-n1-goi-p2-c3-l2": "2 1 1 3 2 3 1 2 3 1 2 2 1 3 3 2 1 | 2 3 1 2 1 3 3 1 2 3 1 2 2 1 3 2 3 1 2 1 3 1 2 3 | 2 2 1 3 1 2 3 | 3 1 1 2 4 2 3 4 4 3 | 3 3 4 4 4 | 2 2 1 4 2".split(/[ |]+/),
  "shin-kanzen-n1-goi-p2-c3-l1": "3 2 4 3 4 1 2 4 3 2 1 2 1 4 3 3 1 2 4 2 4 3 1 4 3 2 1 | 2 1 3 2 1 3 3 1 2 3 1 2 1 3 2 | 2 1 3 2 1 | 1 2 3 2 | 3 1 1 3 2 3 3 3 1 1 | 3 2 2 3 2 | 3 4 4 1 4".split(/[ |]+/),
  "shin-kanzen-n1-goi-p2-c2-l2": "5 4 2 1 4 3 1 5 2 2 1 5 4 2 1 5 3 4 | 1 4 3 2 2 3 4 1 3 1 4 2 3 2 1 4 1 2 3 4 | 1 2 3 4 3 5 2 1 4 | 2 1 1 1 2 4 2 2 4 4 4 2 1 1 3 1 1 2 2 1 4 3 4 1 2".split(/[ |]+/),
  "shin-kanzen-n1-goi-p2-c2-l1": "5 2 3 1 4 2 1 3 5 4 5 1 3 2 4 3 5 1 2 | 3 4 1 2 3 4 1 2 1 2 3 4 1 4 3 2 4 3 1 2 | 2 3 4 1 4 1 5 2 3 | 4 2 2 3 1 4 1 3 1 2 4 4 1 4 3 3 4 4 3 3 4 1 3 1 2".split(/[ |]+/),
  "shin-kanzen-n1-goi-p2-c1-l2": [..."2 1 4 2 1 3 4 4 1 2 3 2 1 4 3".split(" "), ..."ひびいて ひびいて あおぎ あおいだ もむ もまれ うえて うえた はじく はじかれて こたえる こたえられ こって こった もがいて もがいて かすんで かすんで はかる はかって つのって つのる もれれ もれて".split(" "), ..."2 1 3 2 1 3 2 | 2 2 4 1 3 3 1 4 2 1 4 2 4 | 2 3 3 | 3 2 1".split(/[ |]+/)],
  "shin-kanzen-n1-goi-p2-c1-l1": "3 5 4 1 6 2 6 4 1 2 5 3 | 3 4 2 3 4 1 2 4 3 2 1 3 2 4 1 | 2 1 2 2 2 1 1 2 2 2 1 1 2 1 | 1 3 3 1 2 4 1 3 1 1 4 1 3 | 3 4 1 | 2 1 2".split(/[ |]+/),
  "shin-kanzen-n1-goi-c9-l2": ["合意", "思惑", "要因", "一変", "妥協", "対等", ..."1 4 3 3 1 2 4 2 1 3 3 2 1 2 1 3 1 2 4 4 1 3 3 1 3".split(" ")],
  "shin-kanzen-n1-goi-c9-l1": ["向かい", "面して", "時折", "振り", "にわかに", "かねて", ..."1 3 2 2 4 3 1 3 2 1 3 1 2 1 2 3 2 1 3 3 2 3 3 1 2".split(" ")],
  "shin-kanzen-n1-goi-c8-l2": ["原子力", "水力", "多様化", "太陽光", "変換", "ソーラーパネル", ..."2 4 1 4 1 3 2 2 1 3 1 2 3 2 1 3 1 2 3 1 4 2 3 1 4".split(" ")],
  "shin-kanzen-n1-goi-c8-l1": ["高温多湿", "暴風雨", "降り積もる", "温暖", ..."4 1 3 4 1 3 2 1 3 2 3 1 2 2 2 2 1 4 1 2 3 3 2 4 1".split(" ")],
  "shin-kanzen-n1-goi-c7-l3": ["雇用", "年金", "加入", "少子化", "平均寿命", "高齢化", ..."4 3 2 4 1 2 3 2 1 3 3 2 1 1 2 3 3 3 2 3 1 4 1 3 2".split(" ")],
  "shin-kanzen-n1-goi-c7-l2": ["緩和", "申請", "形成", "侵略", "遺跡", "唱える", "措置", ..."1 4 2 3 2 1 4 1 2 3 1 3 2 2 1 3 2 4 2 2 3 4 1 3 1".split(" ")],
  "shin-kanzen-n1-goi-c7-l1": ["重工業", "繊維工業", "軽工業", "従事", "水産業", "林業", ..."1 4 3 1 4 3 2 1 3 2 1 2 3 1 1 1 2 2 4 3 1 4 3 3 4".split(" ")],
  "shin-kanzen-n1-goi-c6-l1": ["検索", "掲載", "書き込んで", "特集", "評判", ..."3 4 2 4 3 2 1 2 3 1 1 3 2 2 1 2 1 1 4 3 2 3 1 4 2".split(" ")],
  "shin-kanzen-n1-goi-c5-l1": ["雇用", "突破", "非正規", "解雇", "介護福祉士", "看護師", ..."4 2 3 2 1 4 3 3 1 2 2 3 1 1 2 3 1 4 3 2 1 1 3 2 4".split(" ")],
  "shin-kanzen-n1-goi-c4-l1": ["校風", "中高一貫", "予備校", "志し", "模範的", "奨学金", "課外活動", ..."4 1 3 2 4 1 3 1 3 2 3 2 1 1 2 2 2 3 1 1 2 3 2 3 2".split(" ")],
  "shin-kanzen-n1-goi-c2-l2": ["くらくら", "寒気", "聴診器", "はれ", "点滴", "不摂生", "衰え", "処方", "安静", "高熱", "感染", ..."3 2 1 3 4 1 2 3 1 2 3 2 1 2 1 1 1 3 4 1 1 2 4 1 3".split(" ")],
  "shin-kanzen-n1-goi-c3-l1": ["書評", "待望", "新刊", "長編小説", "打ち込ん", "大胆", "描写", "壮大", "独創的", ..."3 2 4 2 4 3 1 2 1 3 2 3 1 1 2 1 2 3 2 1 1 2 1 3 4".split(" ")],
};
const ids = new Set();
for (const lesson of [...vocabularyLessons, ...vocabularyN2Lessons]) {
  assert.ok(!ids.has(lesson.id), "Duplicate lesson ID " + lesson.id);
  ids.add(lesson.id);
  for (const exercise of lesson.exercises) {
    assert.ok(!ids.has(exercise.id), "Duplicate exercise ID " + exercise.id);
    ids.add(exercise.id);
    assert.ok(exercise.explanation && exercise.explanation.trim(), exercise.id);
    if (exercise.type === "choice") {
      const choice = exercise.choices.find((item) => item.id === exercise.answer);
      assert.ok(choice, exercise.id);
      if (keys[lesson.id]) assert.equal(choice.label, exercise.correctLabel, exercise.id);
    }
  }
  if (keys[lesson.id]) {
    assert.deepEqual(lesson.exercises.map((item) => item.answer), keys[lesson.id], lesson.title);
    assert.equal(lesson.exercises.filter((item) => item.section === "practical").reduce((sum, item) => sum + item.points, 0), lesson.id.includes("-mock-") ? 50 : lesson.id.includes("-goi-p2-") ? 25 : 20);
    const words = lesson.vocabularyGroups.flatMap((item) => item.items);
    assert.equal(new Set(words.map((item) => item.word)).size, words.length, lesson.title);
    for (const item of words) {
      assert.ok(!ids.has(item.id), "Duplicate vocabulary ID " + item.id);
      ids.add(item.id);
      assert.ok(item.reading && item.thai && item.japaneseMeaning, item.id);
    }
  }
  console.log(lesson.title + ": " + lesson.vocabularyGroups.flatMap((item) => item.items).length + " words, " + lesson.exercises.length + " exercises");
}
console.log("Vocabulary IDs, content, choices and new lesson answer keys passed.");
