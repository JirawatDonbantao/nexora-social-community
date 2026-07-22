# 5. Authentication และความปลอดภัย

## Firebase Authentication ที่ใช้

Nexora ใช้ Firebase Authentication เท่านั้น ไม่ได้เชื่อม Firestore, Realtime Database หรือ Firebase Storage

| วิธี | Firebase API |
| --- | --- |
| สมัครด้วย Email/Password | `createUserWithEmailAndPassword` |
| Login ด้วย Email/Password | `signInWithEmailAndPassword` |
| Login/Signup ด้วย Google | `GoogleAuthProvider` + `signInWithPopup` |
| Logout | `signOut` |
| ตรวจ session | `onAuthStateChanged` |

Google Sign-In ใช้ปุ่มเดียวกันทั้ง Login และ Signup หากเป็นบัญชีใหม่ Firebase จะสร้าง user ให้; หากเป็นบัญชีเดิม Firebase จะเข้าสู่ระบบให้

## ไฟล์ที่เกี่ยวข้อง

```text
src/firebase.js                    อ่าน config และสร้าง Firebase app/auth
src/context/UserAuthContext.jsx    expose auth actions และ auth state
src/context/useUserAuth.js         custom hook เพื่อเข้าถึง context
src/components/Login*.jsx          UI และ validation หน้า Login
src/components/Signup*.jsx         UI และ validation หน้า Signup
src/hooks/useAuthSubmission.js     pending/error/focus ที่ใช้ร่วมกัน
src/utils/authErrors.js            แปลง Firebase error เป็นข้อความไทย
```

## การตั้งค่า `.env`

ไฟล์ `.env.example` เป็นตัวอย่างชื่อ environment variable ที่ต้องใช้:

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

สร้าง `.env` บนเครื่องเองและใส่ค่า Web configuration จาก Firebase Console `firebase.js` ตรวจว่าค่าครบก่อน initialize Firebase และป้องกันการ initialize ซ้ำ

> ตัวแปรที่ขึ้นต้นด้วย `VITE_` จะถูกใช้ใน browser เมื่อ build จึงไม่ใช่ที่เก็บ secret แบบ Service Account ความปลอดภัยของ Firebase Web app ต้องพึ่ง provider ที่เปิดใช้, Authorized domains และกฎของบริการ Firebase ที่ใช้ร่วมกัน ห้ามเก็บ private key, Admin SDK JSON, OAuth token หรือรหัสผ่านจริงใน source

`.gitignore` ตั้งค่า ignore `.env`, `.env.*`, `node_modules`, `dist` และ artifact การทดสอบแล้ว โดยยกเว้น `.env.example` เพื่อให้ผู้ใช้ใหม่ตั้งค่าได้

## Firebase Console ที่ต้องตรวจ

1. Authentication → Sign-in method: เปิด **Email/Password** และ **Google**
2. Google provider: เลือก Project support email และบันทึก
3. Authentication → Settings → Authorized domains: ต้องมี `localhost` สำหรับพัฒนา และโดเมนจริงก่อน deploy
4. อย่าเพิ่ม Service Account ลง frontend

ดูคำสั่งแบบย่อที่ [FIREBASE_SETUP.md](../FIREBASE_SETUP.md)

## Validation และข้อความผิดพลาด

- Login ตรวจ email, password ว่าง และส่ง error Firebase เป็นภาษาไทย
- Signup ตรวจ email, password อย่างน้อย 6 ตัวอักษร และ confirm password ตรงกันก่อนเรียก Firebase
- รับมือ popup ถูกปิด/blocked, network, credential, unauthorized domain และ configuration ไม่ครบ โดยไม่แสดงรายละเอียดเทคนิคดิบให้ผู้ใช้
- ระหว่างส่งฟอร์ม ปุ่มและช่องกรอกถูก disable เพื่อป้องกันการส่งซ้ำ

## ความปลอดภัยของ upload รูป

ฟังก์ชัน `validateImageFile` ป้องกันชนิดไฟล์ไม่ตรงก่อนอ่านเป็น Data URL:

- รับเฉพาะ JPEG, PNG, WebP และ GIF
- จำกัดขนาดไม่เกิน 5 MiB
- ตรวจ magic bytes ของไฟล์ ไม่พึ่ง MIME type อย่างเดียว
- ปฏิเสธ SVG, PDF และไฟล์ที่ header ไม่ตรงชนิด
- อ่านด้วย `FileReader` และส่งข้อความไทยเมื่อ error หรือ abort

รูปไม่ถูกส่งไป backend และหายเมื่อรีเฟรชหน้า จึงไม่ควรใช้แทนระบบจัดเก็บไฟล์จริง

## สิ่งที่ไม่ควรทำก่อนขึ้น GitHub

- อย่า commit `.env` หรือ screenshot ที่มี email/password จริง
- อย่าแปะ Firebase Console, API token หรือ Service Account JSON ใน README/เอกสาร
- ใช้บัญชีที่ควบคุมเองเมื่อทดสอบ Google Sign-In
- ก่อนเผยแพร่ ตรวจ Authorized domains และเปิดเฉพาะ provider ที่ต้องใช้

อ่านต่อ: [เริ่มต้นและรันโปรเจกต์](02-getting-started.md) · [สารบัญอ้างอิงไฟล์](07-source-file-reference.md)
