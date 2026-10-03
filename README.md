# Oboeru

เว็บไซต์ฝึกคำศัพท์ JLPT ที่จัดเนื้อหาเป็น **หนังสือ → บท → Lesson** และเก็บความคืบหน้าใน IndexedDB ของเบราว์เซอร์

## เริ่มใช้งาน

```bash
npm install
npm run dev
```

เปิด <http://localhost:3000> แล้วเลือก Lesson จากคลังหนังสือ

## เนื้อหาปัจจุบัน

- 新完全マスター N1 語彙, 1章 人間, 1課 และ 2課
- คำศัพท์พร้อมคำอธิบายภาษาญี่ปุ่นและคำแปลไทยที่กดเปิด/ซ่อนได้จากปุ่มลอย
- ตัวอย่างและแบบฝึกหัด Basic + Practical; ไม่รวม ウォーミングアップ
- กดตัวเลือกแล้วตรวจทันที หรือพิมพ์คำตอบแล้วกด Enter/“ตรวจคำตอบ” ข้อที่ตอบจะล็อกและแสดงเฉลย
- Learned นับตามคำศัพท์ที่ไม่ซ้ำในแต่ละ Lesson; การตอบผิดไม่เพิ่มคะแนนและตอบซ้ำไม่ได้

คำอธิบายภาษาญี่ปุ่น คำแปลไทย และคำอธิบายเสริมที่ไม่ได้อยู่ในเฉลยเป็นข้อความที่สร้างเพิ่มเติมและมีป้าย `AI-generated` ส่วนโจทย์/เฉลยอ้างอิงจาก PDF ที่ผู้ใช้ให้มา ควรทวนความถูกต้องกับต้นฉบับก่อนนำไปเผยแพร่

## ข้อมูลและการนำเข้า

คลังหนังสือเพิ่มข้อมูลหนังสือและ Lesson ว่างได้ สำหรับเนื้อหา Lesson แบบ JSON ขณะนี้ตัวตรวจรองรับเฉพาะหนังสือ `shin-kanzen-master-n1-goi` และ schema `shin-kanzen-master-n1-goi.lesson` เวอร์ชัน 1 เท่านั้น โดยแสดงตัวอย่างก่อนยืนยัน และไม่เขียนทับ Lesson ที่มีเนื้อหาแล้ว

คู่มือฉบับเต็มสำหรับให้ AI อ่าน PDF และสร้าง JSON อยู่ที่ [`docs/AI_PDF_EXTRACTION_GUIDE.md`](docs/AI_PDF_EXTRACTION_GUIDE.md) ภายในมีโครงหนังสือ กฎดึงข้อมูล checklist และ prompt พร้อมใช้

สำหรับ Gemini แนะนำ workflow สองรอบ—ทำ visual audit ก่อนแล้วค่อยสร้าง JSON—ตาม [`docs/GEMINI_PDF_EXTRACTION_PROMPTS.md`](docs/GEMINI_PDF_EXTRACTION_PROMPTS.md)

โครงไฟล์ขั้นต่ำ:

```json
{
  "schema": "shin-kanzen-master-n1-goi.lesson",
  "schemaVersion": 1,
  "lesson": {
    "id": "shin-kanzen-n1-goi-03",
    "bookId": "shin-kanzen-master-n1-goi",
    "chapterNumber": 1,
    "chapter": "1章 人間",
    "number": 3,
    "title": "タイトル",
    "vocabularyGroups": [
      { "id": "l3-group-1", "title": "語彙", "items": [
        { "id": "l3-word-1", "word": "言葉", "reading": "ことば", "thai": "คำ", "japaneseMeaning": "人が話したり書いたりするもの。" }
      ] }
    ],
    "examples": [],
    "exercises": []
  }
}
```

ก่อนย้ายเครื่องหรือเคลียร์ข้อมูลเบราว์เซอร์ ให้ใช้ **ส่งออกข้อมูล** เพื่อสำรองทั้งเนื้อหาและความคืบหน้า แล้วใช้ **นำเข้าข้อมูล** เพื่อกู้คืนไฟล์นั้น การจัดการลบ/แก้ไข/แทนที่เนื้อหายังไม่ได้เปิดใน UI เพื่อป้องกันการทับ progress โดยไม่ตั้งใจ

## ตรวจสอบโค้ด

```bash
npm run lint
npm run build
```
