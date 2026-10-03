# Prompt สำหรับ Gemini: ดึง PDF เข้า Oboeru แบบสองรอบ

Gemini มักอ่าน text layer ของ PDF จนข้อมูลตัวหนาหาย การขอ JSON ในครั้งเดียวจึงเสี่ยงต่อการรวมทั้งประโยคเป็น `word` และข้ามแบบฝึกหัดบางส่วน วิธีที่ควรใช้คือทำสองข้อความต่อเนื่องในแชตเดียวกัน

แนบไฟล์ต่อไปนี้ก่อนเริ่ม:

1. PDF เนื้อหาของ Lesson
2. PDF เฉลย
3. `AI_PDF_EXTRACTION_GUIDE.md`
4. ถ้าเป็นไปได้ แนบภาพ PNG ความละเอียดสูงของทุกหน้าเนื้อหาด้วย

## รอบที่ 1: ทำ Visual Audit ก่อน ห้ามสร้าง Lesson JSON

```text
งานรอบนี้เป็น VISUAL AUDIT เท่านั้น ห้ามสร้าง Lesson JSON ฉบับนำเข้า

อ่านทุกหน้าของ Lesson ด้วย vision จากภาพหน้า PDF ตรวจ typography, ตัวหนา, คอลัมน์, กล่อง, หัวข้อ และเลขหน้า ห้ามพึ่ง OCR/extracted text เพียงอย่างเดียว

สร้าง audit JSON รูปแบบนี้:
{
  "printedChapter": "ข้อความเลขและชื่อ章ที่เห็นบนหน้า",
  "printedLesson": "ข้อความเลข課และชื่อ Lesson ที่เห็นบนหน้า",
  "sourcePagesSeen": [เลขหน้าทุกหน้าที่ตรวจ รวมหน้าที่มีウォーミングアップ],
  "pages": [
    {
      "page": 14,
      "sections": [
        {
          "heading": "หัวข้อที่เห็น",
          "role": "vocabulary|examples|warming_up|basic|practical|answer_key|other",
          "rows": [
            {
              "sourceLine": "ข้อความทั้งบรรทัด",
              "boldSpans": ["ข้อความตัวหนาช่วงที่ 1", "ช่วงที่ 2"],
              "normalizedVocabulary": ["คำหรือวลีที่จะเป็น word"],
              "notes": "เหตุผลที่ตัดขอบเขตแบบนี้"
            }
          ]
        }
      ]
    }
  ],
  "exerciseInventory": [
    { "section": "basic|practical|warming_up", "group": "ชื่อกลุ่ม", "questionCount": 0, "questionNumbers": ["1", "2"] }
  ],
  "answerInventory": [
    { "lesson": "เลข課", "group": "ชื่อกลุ่ม", "answerCount": 0 }
  ],
  "uncertain": ["จุดที่ภาพไม่ชัดหรือไม่แน่ใจ"]
}

กฎสำคัญ:
- ตรวจทุกหน้า ห้ามตัดทั้งหน้าเพียงเพราะมี ウォーミングアップ อยู่บางส่วน
- warming_up ต้องอยู่ใน inventory เพื่อยืนยันว่ามองเห็น แต่จะไม่ถูกนำเข้าในรอบถัดไป
- ทุกข้อความตัวหนาในส่วนคำศัพท์ต้องปรากฏใน boldSpans
- ประโยคที่มีคำตัวหนา เช่น ひりひり ต้องมีทั้ง sourceLine และ boldSpans: ["ひりひり"]
- ห้ามใส่ประโยคทั้งบรรทัดใน normalizedVocabulary เว้นแต่ทั้งประโยคเป็นตัวหนาจริง
- 語形成 ให้แยก pattern และคำตัวอย่างแต่ละคำ ห้ามรวมเป็น "立ち〜 (立ち向かう、立ち寄る)"
- printedLesson ต้องคัดเลข 課 จากหน้าจริง ห้ามใช้ลำดับ Lesson ภายใน Chapter
- ถ้าดูตัวหนาไม่ออก ให้ใส่ใน uncertain ห้ามเดา

ตอบเป็น audit JSON เท่านั้น
```

ตรวจ audit ก่อนดำเนินต่อ โดยดูว่า:

- `sourcePagesSeen` มีครบทุกหน้าในช่วง
- คำตัวหนาทุกคำปรากฏใน `boldSpans`
- จำนวนข้อใน `exerciseInventory` ครบทุกกลุ่ม
- มี `warming_up` ใน audit แต่ไม่ปะปนกับ `basic`
- เลข `課` เป็นเลขที่พิมพ์บนหน้า

ถ้า audit ไม่ครบ ให้ส่งข้อความนี้ก่อน:

```text
Visual audit ยังไม่ครบ ให้กลับไปตรวจภาพทุกหน้าอีกครั้ง ห้ามสร้าง Lesson JSON จนกว่า sourcePagesSeen จะครบทุกหน้า ทุกช่วงตัวหนาจะอยู่ใน boldSpans และ exerciseInventory จะมีทุกกลุ่มที่เห็นบนหน้า
```

## รอบที่ 2: สร้าง JSON นำเข้าจาก Audit

เมื่อ audit ถูกต้องแล้ว ส่งข้อความนี้ในแชตเดิม:

```text
ใช้ visual audit ที่คุณเพิ่งสร้างเป็นหลักฐาน แล้วสร้าง Lesson JSON ตาม AI_PDF_EXTRACTION_GUIDE.md

ข้อบังคับ:
1. number และ lesson.id ต้องอิงเลข 課 ใน printedLesson ไม่ใช่ลำดับภายใน Chapter
2. sourcePages ต้องมีทุกหน้าที่ตรวจใน sourcePagesSeen แม้หน้าหนึ่งจะมี ウォーミングアップ
3. ตัดเฉพาะ exercise ที่ role เป็น warming_up ห้ามตัด basic/practical ส่วนอื่นในหน้าเดียวกัน
4. ทุก normalizedVocabulary ใน audit ต้องมี vocabulary item และห้ามใช้ sourceLine ทั้งประโยคเป็น word
5. ถ้าบรรทัดคำศัพท์เป็นประโยคที่มีคำตัวหนา ให้สร้าง vocabulary item จากคำตัวหนา และสามารถเก็บประโยคเต็มใน examples ด้วย
6. 語形成 ต้องใช้ pattern ที่ระดับ group และแต่ละคำตัวอย่างเป็น item แยก
7. จำนวน exercise ใน JSON ต้องเท่ากับผลรวม basic และ practical ใน exerciseInventory โดยไม่นับ warming_up
8. จับคู่เฉลยจาก PDF เฉลยตามเลข課 กลุ่ม และเลขข้อ ห้ามเดา
9. ถ้าเฉลยมีเพียงคำตอบและคุณเขียนคำอธิบายเอง ให้ใช้ explanationSource: ai_generated
10. ตรวจว่าไม่มี word ใดลงท้ายด้วย 。 หรือเป็นประโยคเต็มโดยไม่ได้รับรองจาก boldSpans
11. ตอบเป็น JSON object ฉบับเต็มเพียงอย่างเดียว ไม่มี Markdown ไม่มี audit และไม่มีข้อความอธิบาย
```

## Prompt ซ่อม `test.json` หรือ JSON ที่สร้างไปแล้ว

```text
JSON ที่แนบเป็นฉบับร่างและอาจถอดโครงสร้างภาพผิด ให้ซ่อมโดยเริ่มทำ visual audit ใหม่จาก PDF ทุกหน้า ไม่ใช่แก้จากความหมายของ JSON เดิมอย่างเดียว

ตรวจเป็นพิเศษ:
- sourcePages ต้องไม่ขาดหน้ากลางช่วง
- เลข lesson.number ต้องเป็นเลข課ที่พิมพ์จริง
- ID prefix ต้องสอดคล้องกับเลข課
- ประโยคที่มีคำตัวหนา เช่น ひりひり, ずきずき, きりきり, くらくら, がんがん, むかむか, げっそり ต้องสร้าง vocabulary item แยก ไม่ใช่อยู่ใน examples อย่างเดียว
- word ต้องเป็นตัวหนา/คำเป้าหมาย ไม่ใช่ข้อความทั้งบรรทัด
- อย่าข้ามแบบฝึกหัดทั้งหน้าเมื่อข้ามเฉพาะウォーミングアップ
- 語形成 ต้องแยก pattern และคำตัวอย่าง ไม่รวมทั้งหมดเป็น word เดียว
- exercise ทุกกลุ่มและทุกข้อต้องครบ และเฉลยต้องมาจากหน้าของ Lesson เดียวกัน

ทำ visual audit ภายในก่อน จากนั้นส่ง JSON นำเข้าฉบับเต็มเพียง object เดียว ห้ามใส่ Markdown หรือคำอธิบาย
```
