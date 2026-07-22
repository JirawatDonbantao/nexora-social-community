# 3. สถาปัตยกรรมและเส้นทางหน้าเว็บ

## ภาพรวมการไหลของโปรแกรม

```text
index.html
  └─ src/main.jsx
       ├─ UserAuthContextProvider
       └─ React Router
            ├─ /        → App → Navbar + Home + Toast
            ├─ /login   → Login → AuthPortalLayout + LoginForm
            └─ /signup  → Signup → AuthPortalLayout + SignupForm
```

`main.jsx` เป็นจุดเริ่มต้นของ React โดยห่อทุกหน้าด้วย `UserAuthContextProvider` เพื่อให้ Navbar, Login และ Signup เห็นสถานะ Authentication ชุดเดียวกัน

## Router

| Route | Component หลัก | หมายเหตุ |
| --- | --- | --- |
| `/` | `App.jsx` และ `pages/Home.jsx` | เปิด Feed ได้โดยไม่บังคับ Login |
| `/login` | `components/Login.jsx` | ถ้าเข้าสู่ระบบอยู่แล้วจะ redirect กลับ `/` |
| `/signup` | `components/Signup.jsx` | ถ้าเข้าสู่ระบบอยู่แล้วจะ redirect กลับ `/` |

โปรเจกต์ใช้ `createBrowserRouter` จึงเมื่อ deploy ต้องตั้ง host ให้ส่ง route ที่ไม่ใช่ `/` กลับไปที่ `index.html` ด้วย

## โครงสร้างหน้า Home

```text
App
 ├─ Navbar
 ├─ Home
 │   ├─ Sidebar
 │   ├─ Input (composer)
 │   ├─ Stories
 │   │   ├─ StoryCreator dialog
 │   │   └─ StoryViewer dialog
 │   ├─ Post[]
 │   │   └─ PostModal dialog → CommentItem[]
 │   └─ ContactsSidebar
 └─ Toast
```

`App.jsx` เก็บคำค้นหาและข้อความ toast ส่วน `Home.jsx` เป็นเจ้าของ state ที่เกี่ยวกับ Feed เช่น posts, comments, replies, reaction, share count และ post ที่เปิดใน modal

## การไหลของข้อมูลใน Feed

```text
Input → addPost → Home.posts → Post
Post → setReaction / addComment / sharePost → Home.posts
Post Modal → addReply / comment reactions → Home.posts
Navbar search → App.searchQuery → Home + ContactsSidebar
```

- `Home` สร้าง ID แบบ ref ที่เพิ่มขึ้นทีละค่า เพื่อไม่ขึ้นกับเวลาและลดโอกาสซ้ำ
- ทุกการแก้ post ใช้ state updater สร้าง object/array ใหม่แทนการแก้ข้อมูลเดิมโดยตรง
- `formatRelativeTime` รับเวลา `now` เพื่อแสดงเวลาสัมพัทธ์ของ post และ comment
- `setInterval` อัปเดต `now` ทุก 30 วินาที และ cleanup เมื่อ Home ถูกปิด

## Authentication flow

```text
LoginForm / SignupForm
       ↓
Login / Signup handlers
       ↓
UserAuthContextProvider
       ↓
Firebase Authentication
       ↓
onAuthStateChanged → user / loading → Navbar และ route
```

`UserAuthContextProvider` มี `signUp`, `logIn`, `logInWithGoogle` และ `logOut` ส่วน `useUserAuth` ทำให้ component เรียกใช้ context ได้สะดวก หน้า Auth ใช้ `useAuthSubmission` ร่วมกันเพื่อจัด pending state, error ภาษาไทย และการคืน focus ให้ข้อความผิดพลาด

## Dialog และ keyboard

Post Modal, Story Creator และ Story Viewer ใช้ `useDialogA11y` ร่วมกัน ซึ่งทำหน้าที่:

- ใส่ semantics ของ dialog
- โฟกัสปุ่มปิดเมื่อเปิด
- ดัก Tab ให้อยู่ภายใน dialog
- ปิดด้วย Escape
- คืน focus ไปยัง trigger เดิมเมื่อปิด

Reaction picker ใช้ `useReactionPicker` เพื่อเปิด/ปิดจาก mouse และ keyboard โดย render GIF เมื่อเปิดเท่านั้น

## ข้อมูลเดโมและ Asset

- `data/demoProfiles.js` เป็นแหล่งข้อมูลหลักของ profile, contacts, groups, shortcuts และ stories
- `contactsData.js`, `sidebarData.js`, `storiesData.js` re-export เฉพาะข้อมูลที่ component นั้นต้องใช้
- `constants.js` รวม profile ปัจจุบันและ reaction metadata
- ไฟล์ใน `assets/` import ผ่าน Vite ดังนั้น path จะถูกตรวจและ bundle ตอน build

## ขอบเขต state

| ส่วน | เก็บที่ไหน | อยู่ได้นานแค่ไหน |
| --- | --- | --- |
| สถานะ Login | Firebase Authentication | คงตาม session ของ Firebase |
| คำค้นหา / Toast | `App` | จนเปลี่ยนหรือรีเฟรชหน้า |
| Feed, comment, reply, share | `Home` | หายเมื่อรีเฟรช |
| Stories ที่สร้าง | `Stories` | หายเมื่อรีเฟรช |
| ฟอร์ม Auth | LoginForm/SignupForm | หายเมื่อออกจากหน้า |

อ่านต่อ: [ฟีเจอร์และคู่มือผู้ใช้](04-features-and-user-guide.md) · [สารบัญอ้างอิงไฟล์](07-source-file-reference.md)
