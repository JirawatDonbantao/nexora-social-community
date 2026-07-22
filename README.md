# Nexora Social Community

Nexora คือเว็บ Social Community สำหรับทดลองแนวคิดการเชื่อมต่อผู้คน การแบ่งปันเรื่องราว และการสร้างชุมชนออนไลน์ หน้าตาและรูปแบบการใช้งานได้รับแรงบันดาลใจจากแพลตฟอร์ม social feed แต่ได้รับการออกแบบแบรนด์และข้อมูลเดโมใหม่เป็น Nexora โดยไม่มีความเกี่ยวข้องกับ Facebook หรือ Meta

โปรเจกต์นี้เป็นผลงานจากรายวิชา [**การพัฒนาซอฟต์แวร์ด้วยเทคโนโลยี Front-End**]

ผู้พัฒนา: **Jirawat Donbantao**

## เว็บนี้ทำอะไรได้บ้าง

- อ่านและค้นหาโพสต์ในหน้า Home
- สร้างโพสต์ข้อความหรือแนบรูปภาพจากเครื่อง
- กด Reaction, แสดงความคิดเห็น, ตอบกลับ และแชร์โพสต์แบบเดโม
- สร้างและดู Stories
- ดูรายชื่อผู้ติดต่อ กลุ่มสนทนา และทางลัดชุมชนจากข้อมูลเดโม
- สมัครสมาชิกและเข้าสู่ระบบด้วย Email/Password หรือ Google ผ่าน Firebase Authentication
- ใช้งานได้ทั้ง Desktop, Tablet และ Mobile

> ข้อมูลโพสต์ คอมเมนต์ และ Story ที่สร้างในหน้าเว็บเก็บอยู่ในหน่วยความจำของ browser เพื่อการสาธิต จึงหายเมื่อรีเฟรชหน้า ส่วนสถานะเข้าสู่ระบบจัดการโดย Firebase Authentication

## หน้าหลัก

| หน้า | ที่อยู่ | หน้าที่ |
| --- | --- | --- |
| Home | `/` | Feed, Stories, การสร้างโพสต์, ค้นหา และผู้ติดต่อ |
| Login | `/login` | เข้าสู่ระบบด้วย Email/Password หรือ Google |
| Signup | `/signup` | สร้างบัญชีด้วย Email/Password หรือ Google |

## ภาพตัวอย่าง

| Home | Login | Signup |
| --- | --- | --- |
| ![หน้า Home](document/screenshots/01-home-desktop-1440.png) | ![หน้า Login](document/screenshots/04-login-desktop-1440.png) | ![หน้า Signup](document/screenshots/07-signup-desktop-1440.png) |

ภาพเพิ่มเติม รวมถึง Mobile และหน้าต่างฟีเจอร์ต่าง ๆ อยู่ที่ [document/screenshots](document/screenshots/)

## เทคโนโลยีที่ใช้

- **React 19** สำหรับสร้างส่วนติดต่อผู้ใช้
- **Vite** สำหรับพัฒนาและ build โปรเจกต์
- **React Router** สำหรับเส้นทางหน้าเว็บ
- **Firebase Authentication** สำหรับ Email/Password และ Google Sign-In
- **React Icons** สำหรับไอคอน
- **CSS** สำหรับ Nexora design system และ responsive layout
- **Vitest + Testing Library** สำหรับ unit test
- **Playwright** สำหรับทดสอบหน้าเว็บใน browser

## เริ่มใช้งานบนเครื่อง

ต้องมี Node.js รุ่นปัจจุบันและ npm ก่อน จากนั้นรันคำสั่งต่อไปนี้ในโฟลเดอร์โปรเจกต์

```bash
npm install
copy .env.example .env
npm run dev
```

เปิด URL ที่ Vite แสดงใน terminal โดยปกติคือ `http://localhost:5173`

ก่อนใช้ Firebase ให้ตั้งค่า `VITE_FIREBASE_*` ใน `.env` ตาม [คู่มือ Firebase](FIREBASE_SETUP.md) ห้ามนำ `.env` ขึ้น GitHub

คำสั่งสำคัญ:

```bash
npm run dev          # เปิดโหมดพัฒนา
npm run build        # สร้างไฟล์ production ใน dist/
npm run lint         # ตรวจรูปแบบและข้อผิดพลาดของโค้ด
npm run test         # รัน unit tests
npm run test:e2e     # รัน browser tests
npm run test:verify  # ตรวจครบ lint + test + build + e2e
```

## โครงสร้างโดยย่อ

```text
src/
  components/  ส่วนประกอบของหน้าจอและฟอร์ม
  pages/       หน้า Home และ state ของ Feed
  context/     สถานะ Firebase Authentication
  data/        รายชื่อ รูป และข้อมูลเดโม
  hooks/       พฤติกรรมที่ใช้ซ้ำ เช่น dialog และ reaction
  styles/      CSS แยกตามส่วนของ UI
  assets/      โลโก้ SVG, avatar, story และ reaction GIF
document/      คู่มือเชิงลึกและภาพหน้าจอ
e2e/           Playwright browser tests
```

## เอกสารเชิงลึก

1. [ภาพรวมโปรเจกต์](document/01-project-overview.md)
2. [เริ่มต้นและรันโปรเจกต์](document/02-getting-started.md)
3. [สถาปัตยกรรมและเส้นทาง](document/03-architecture-and-routes.md)
4. [ฟีเจอร์และคู่มือผู้ใช้](document/04-features-and-user-guide.md)
5. [Authentication และความปลอดภัย](document/05-authentication-and-security.md)
6. [ดีไซน์, Asset และ Style](document/06-design-assets-and-styles.md)
7. [สารบัญอ้างอิงไฟล์ต้นฉบับ](document/07-source-file-reference.md)

## ขอบเขตของ Demo

- ยังไม่มี Firebase Database หรือ Storage ดังนั้นโพสต์/รูปที่ผู้ใช้สร้างไม่ถูกบันทึกถาวร
- ปุ่ม Copy Link แจ้งว่าเป็นฟีเจอร์เดโม เพราะยังไม่มี URL รายโพสต์
- ปุ่มเมนูที่ยังไม่มีฟีเจอร์รองรับจะแสดงสถานะ Demo แทนการทำงานหลอกผู้ใช้
- การทดสอบ Google Sign-In จริงควรใช้บัญชีที่ผู้พัฒนาควบคุมเอง
