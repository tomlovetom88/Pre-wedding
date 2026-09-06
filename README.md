# Pre-wedding Online Invitation Card

การ์ดเชิญงานแต่งงานออนไลน์แบบ Interactive สำหรับมือถือ เปิดได้จาก `index.html` โดยไม่ต้องติดตั้ง dependency และพร้อมใช้บน GitHub Pages

## การปรับแต่ง

แก้ชื่อคู่บ่าวสาว วันที่ สถานที่ ที่อยู่ ลิงก์แผนที่ ข้อมูลของขวัญ และเพลงจาก `weddingConfig` ด้านบนของ `assets/js/main.js` วันที่ใช้ ISO เช่น `2027-01-01T09:00:00+07:00` ส่วนรายละเอียด Timeline แก้ใน `index.html`

รูปตัวอย่างอยู่ใน `assets/images/placeholders/` แทนที่ด้วยรูปจริงแล้วแก้ `src` ใน `index.html` ได้ รูปแนวตั้งแนะนำ 4:5 และแนวนอน 16:9 ปรับจุดโฟกัสรายรูปด้วย `object-position`

วางเพลง เช่น `wedding-song.mp3` ใน `assets/music/` แล้วตั้งค่า:

```js
musicFile: './assets/music/wedding-song.mp3'
```

เพลงจะไม่เล่นก่อนผู้ใช้โต้ตอบ หากไม่มีไฟล์ก็จะไม่เกิด error

## ทดสอบ

เปิด `index.html` โดยตรงหรือผ่าน static server แล้วทดสอบการแตะซอง 2 ครั้ง, Lightbox (ปุ่ม/ESC/Swipe), Countdown, Copy, RSVP และหน้าจอ 320–1440px

## GitHub Pages

สร้าง GitHub Repository ก่อน แล้วรัน:

```bash
git init
git add .
git commit -m "Initial pre-wedding invitation"
git branch -M main
git remote add origin <repository-url>
git push -u origin main
```

ไปที่ Repository → Settings → Pages → Build and deployment → Deploy from a branch → เลือก `main` และ `/(root)` → Save
