# 2. เริ่มต้นและรันโปรเจกต์

เอกสารนี้อธิบายทั้งการเปิด Nexora ที่มีอยู่แล้ว และแนวทางเริ่มโปรเจกต์ React ลักษณะเดียวกันตั้งแต่ต้น

## สิ่งที่ต้องมี

- Node.js รุ่น LTS หรือรุ่นปัจจุบัน
- npm ที่ติดตั้งมากับ Node.js
- Firebase project เฉพาะกรณีต้องการทดสอบ Login/Signup จริง

ตรวจสอบเวอร์ชันด้วย:

```bash
node --version
npm --version
```

## เปิด Nexora บนเครื่อง

```bash
git clone <repository-url>
cd Jirawat
npm install
copy .env.example .env
npm run dev
```

Windows PowerShell ใช้คำสั่งนี้แทน `copy` ได้:

```powershell
Copy-Item .env.example .env
```

Vite จะแสดง URL ใน terminal ให้เปิดด้วย browser โดยทั่วไปเป็น `http://localhost:5173`

## ตั้งค่า Firebase อย่างปลอดภัย

1. เปิด `.env.example` เพื่อดูรายชื่อตัวแปร `VITE_FIREBASE_*`
2. สร้าง `.env` เฉพาะในเครื่อง และใส่ค่า Web configuration จาก Firebase Console
3. เปิด Email/Password และ Google ใน Firebase Authentication หากต้องการใช้ทั้งสองวิธี
4. ตรวจว่า `localhost` และโดเมนที่จะ deploy อยู่ใน Authorized domains
5. restart `npm run dev` หลังแก้ `.env`

`.env` ถูก ignore แล้ว ห้าม commit, ส่งในแชต หรือใส่ Service Account JSON ในโปรเจกต์ Front-End นี้ ดูรายละเอียดที่ [Authentication และความปลอดภัย](05-authentication-and-security.md)

## คำสั่งพัฒนา

| คำสั่ง | ใช้ทำอะไร |
| --- | --- |
| `npm run dev` | เปิด Vite development server พร้อม hot reload |
| `npm run build` | สร้าง bundle สำหรับ production ใน `dist/` |
| `npm run preview` | เปิดดู bundle ที่ build แล้วในเครื่อง |
| `npm run lint` | ตรวจข้อผิดพลาดและกฎคุณภาพโค้ดด้วย ESLint |
| `npm run test` | รัน unit tests ด้วย Vitest และ Testing Library |
| `npm run test:e2e` | รัน Playwright ทดสอบใน Chrome |
| `npm run test:verify` | รัน lint, test, build และ e2e ต่อเนื่อง |

## แนวทางเริ่มโปรเจกต์ลักษณะนี้จากศูนย์

คำสั่งต่อไปนี้เป็นแนวทางสร้าง React app ด้วย Vite ใหม่ ไม่ได้ใช้แทน source ของ Nexora ที่มีอยู่แล้ว

```bash
npm create vite@latest nexora-social-community -- --template react
cd nexora-social-community
npm install
npm install firebase react-router-dom react-icons prop-types
npm install -D vitest @testing-library/react @testing-library/user-event @playwright/test eslint
npm run dev
```

จากนั้นจึงแบ่งงานเป็น `pages`, `components`, `data`, `context`, `hooks`, `styles` และเพิ่ม Firebase config ผ่าน `.env` ก่อนต่อยอดฟีเจอร์

## เมื่อ build แล้ว

- `dist/` เป็น output ที่สร้างใหม่ได้ จึงไม่ต้องนำขึ้น GitHub
- Vite จะเปลี่ยนชื่อ asset เป็น hash เพื่อจัดการ cache
- Logo, SVG, avatar และ reaction ที่ import จาก `src/assets/` จะถูก bundle ไปพร้อมแอป

อ่านต่อ: [สถาปัตยกรรมและ Routes](03-architecture-and-routes.md) · [รายการไฟล์ทั้งหมด](07-source-file-reference.md)
