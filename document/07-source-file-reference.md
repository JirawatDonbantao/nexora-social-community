# 7. สารบัญอ้างอิงไฟล์ต้นฉบับ

เอกสารนี้ใช้เป็นแผนที่ของ repository สำหรับผู้อ่านที่ต้องการรู้ว่าไฟล์ใดอยู่ที่ไหนและทำหน้าที่อะไร ไฟล์ generated หรือข้อมูลลับ เช่น `node_modules/`, `dist/`, `.env`, `test-results/` และ `playwright-report/` ไม่ถูกอธิบายทีละไฟล์ เพราะไม่ควรนำขึ้น GitHub

## Root ของโปรเจกต์

| ไฟล์/โฟลเดอร์ | หน้าที่ |
| --- | --- |
| `README.md` | คู่มือภาพรวมสำหรับ GitHub และลิงก์ไปเอกสารเชิงลึก |
| `document/` | เอกสาร 7 ส่วนและภาพหน้าจอของโปรเจกต์ |
| `.env.example` | รายชื่อตัวแปร Firebase ที่ต้องสร้างใน `.env` ของแต่ละเครื่อง โดยไม่มีค่าจริง |
| `.gitignore` | ป้องกัน `.env`, dependency, build output, asset ส่วนตัว และ report ไม่ให้ถูก track |
| `FIREBASE_SETUP.md` | ขั้นตอนย่อสำหรับเปิด Email/Password, Google และ Authorized domains |
| `index.html` | HTML shell, title, metadata, favicon และจุด mount `#root` |
| `package.json` | ชื่อโปรเจกต์ dependency และ npm scripts |
| `package-lock.json` | lock เวอร์ชัน dependency ที่ npm สร้างขึ้น ควรเก็บคู่กับ `package.json` |
| `vite.config.js` | เปิด React plugin ให้ Vite |
| `vitest.config.js` | ตั้ง Vitest ให้ใช้ jsdom และ test setup |
| `eslint.config.js` | กฎ ESLint สำหรับ JavaScript/JSX และ React hooks |
| `playwright.config.js` | ตั้ง E2E browser, viewport server และ Chrome channel |
| `e2e/nexora.spec.js` | Browser scenarios: routes, responsive, auth UI, search, post, comment, reaction และ stories |

## จุดเริ่มต้นของ React (`src/`)

| ไฟล์ | หน้าที่ |
| --- | --- |
| `main.jsx` | สร้าง React root, Browser Router และห่อทุก route ด้วย Auth Provider |
| `App.jsx` | หน้า `/`; เก็บ search query, toast timer, Navbar, Home และ footer |
| `App.css` | Style ของ app shell, toast และ footer |
| `brand.js` | ชื่อ Nexora, tagline และทางลัด import โลโก้/ไอคอนแบรนด์ |
| `constants.js` | profile เดโมที่กำลังใช้งานและ metadata ของ reaction 7 แบบ |
| `firebase.js` | อ่าน `VITE_FIREBASE_*`, initialize Firebase อย่างปลอดภัย และ export `auth` |

## หน้าและ component (`src/pages`, `src/components`)

### หน้าและ Auth

| ไฟล์ | หน้าที่ |
| --- | --- |
| `pages/Home.jsx` | เจ้าของ state ของ Feed: posts, comments, replies, reactions, shares, search result และ Post Modal |
| `components/AuthPortalLayout.jsx` | โครง Aurora ที่ Login/Signup ใช้ร่วมกัน รวม logo, copy และ Community Constellation |
| `components/Login.jsx` | เชื่อม Login form กับ Auth Context; redirect เมื่อเข้าสู่ระบบแล้ว |
| `components/LoginForm.jsx` | ฟอร์ม Email/Password, Google button, show/hide password และ validation ของ Login |
| `components/Signup.jsx` | เชื่อม Signup form กับ Auth Context; redirect เมื่อเข้าสู่ระบบแล้ว |
| `components/SignupForm.jsx` | ฟอร์ม Email, Password, Confirm Password, Google และ validation ของ Signup |

### โครงหน้า Home

| ไฟล์ | หน้าที่ |
| --- | --- |
| `components/Navbar.jsx` | โลโก้, ช่องค้นหา, Auth links, profile และ logout/Demo controls |
| `components/Sidebar.jsx` | โปรไฟล์เดโม, รายการ navigation และ shortcuts |
| `components/ContactsSidebar.jsx` | Contacts และ group chats ที่กรองจาก search query |
| `components/Input.jsx` | Composer สำหรับข้อความ/รูป, preview, validation error และการส่ง post |
| `components/Stories.jsx` | State ของ stories, creator/viewer และเรื่องที่สร้างใน session |
| `components/StoryCreator.jsx` | Dialog สร้าง Story ข้อความหรือรูป |
| `components/StoryViewer.jsx` | Dialog แสดง Story และปุ่มปิด |

### Post, comment และ reaction

| ไฟล์ | หน้าที่ |
| --- | --- |
| `components/Post.jsx` | Card ของ post, menu, share, เปิด modal และส่ง event กลับ Home |
| `components/PostModal.jsx` | Dialog รายละเอียด post, comment, reply, sorting และ actions |
| `components/CommentItem.jsx` | แสดง comment, reply, เวลา และ interaction ของ comment |
| `components/ReactionBar.jsx` | ปุ่ม reaction ของ post พร้อม lazy reaction picker |
| `components/CommentReactionControl.jsx` | reaction picker สำหรับ comment หรือ reply |
| `components/ReactionIcon.jsx` | แสดง GIF/icon ของ reaction ที่เลือก |
| `components/StatsBar.jsx` | สถิติ reaction/comment/share และ action bar ใต้ post |
| `components/ShareMenu.jsx` | เมนู Share Now และ Copy Link demo |

### Test ของ component

| ไฟล์ | หน้าที่ |
| --- | --- |
| `CommentReactionControl.test.jsx` | keyboard และเลือก reaction ของ comment |
| `Input.test.jsx` | composer, upload validation และ IME behavior |
| `LoginForm.test.jsx` | Login validation, show/hide password, loading และ Google error |
| `PostModal.test.jsx` | comment/reply flow และ dialog behavior ของ post modal |
| `ReactionBar.test.jsx` | reaction picker ของ post และ keyboard flow |
| `Signup.test.jsx` | redirect หลัง Email signup หรือ Google flow ที่ mock แล้ว |
| `SignupForm.test.jsx` | Signup validation, password confirmation, loading และ Google error |
| `StoryDialogs.test.jsx` | Story Creator/Viewer, Escape และ focus behavior |

## Context และ custom hooks

| ไฟล์ | หน้าที่ |
| --- | --- |
| `context/authContext.js` | สร้าง `UserAuthContext` |
| `context/UserAuthContext.jsx` | Firebase listener และ public methods: signUp, logIn, Google, logOut |
| `context/useUserAuth.js` | hook สำหรับอ่าน Auth Context และป้องกันการใช้ผิด provider |
| `hooks/useAuthSubmission.js` | state pending/error, focus error และป้องกัน set state หลัง form ถูก unmount |
| `hooks/useDialogA11y.js` | focus trap, Escape, initial focus และคืน focus หลังปิด dialog |
| `hooks/useReactionPicker.js` | เปิด/ปิด picker จาก hover, focus, Arrow Down และ Escape |

## Data และ utility

| ไฟล์ | หน้าที่ |
| --- | --- |
| `data/demoProfiles.js` | แหล่งข้อมูลหลักของ profile, contacts, groups, shortcuts และ story เดโม |
| `data/contactsData.js` | export contacts และ group chats สำหรับ ContactsSidebar |
| `data/sidebarData.js` | export shortcuts สำหรับ Sidebar |
| `data/storiesData.js` | export stories เริ่มต้นสำหรับ Stories |
| `utils/authErrors.js` | map Firebase/client error code เป็นข้อความไทยที่ไม่เผยข้อมูลเทคนิค |
| `utils/imageUpload.js` | ตรวจ MIME, ขนาด และ magic bytes; อ่านรูปเป็น Data URL |
| `utils/postUtils.js` | re-export profile/reactions และ format เวลาสัมพัทธ์ |
| `utils/authErrors.test.js` | ทดสอบ error mapping ที่ปลอดภัย |
| `utils/imageUpload.test.js` | ทดสอบชนิด ขนาด และ signature ของไฟล์รูป |
| `test/setup.js` | โหลด matcher ของ Testing Library ก่อน unit test |

## Styles (`src/styles/`)

| ไฟล์ | หน้าที่ |
| --- | --- |
| `variables.css` | design tokens, font import, reset และ global focus ring |
| `layout.css` | layout หลักของ Home และ Feed columns |
| `responsive.css` | breakpoint และการซ่อน/จัด layout สำหรับจอแคบ |
| `navbar.css` | Navbar, search และ Auth links |
| `sidebar.css` | Left sidebar และ shortcuts |
| `contacts.css` | Contacts/Group chat sidebar |
| `composer.css` | Composer และ preview รูป |
| `post.css` | Post card, reaction, comments และ share controls |
| `post-modal.css` | Post Modal และ input ใน modal |
| `stories.css` | Story cards, ring และ viewer trigger |
| `story-creator.css` | Dialog สร้าง Story |
| `story-viewer.css` | Dialog แสดง Story |
| `login.css` | Aurora Auth Portal, Login/Signup forms และ Community Constellation |

## Assets (`src/assets/`)

| ไฟล์/กลุ่ม | หน้าที่ |
| --- | --- |
| `nexora/loop-horizontal.svg` | Wordmark Nexora แบบแนวนอน |
| `nexora/loop-icon.svg` | Loop icon สำหรับ mobile และ avatar AI |
| `nexora/community-constellation.svg` | ภาพประกอบ static ของ Auth Portal |
| `demo/avatars/kian.webp`, `mira.webp`, `nara.webp`, `sora.webp`, `theo.webp` | avatar เดโม 5 แบบที่สลับใช้กับข้อมูลชื่อสมมติ |
| `demo/story-aurora.svg`, `story-orbit.svg`, `story-pulse.svg`, `story-violet.svg` | cover ของ Story เดโม 4 แบบ |
| `reactions/like.gif`, `love.gif`, `care.gif`, `haha.gif`, `wow.gif`, `sad.gif`, `angry.gif` | ภาพ reaction 7 แบบ; โหลดเมื่อเปิด picker |

## Public assets (`public/nexora/`)

| ไฟล์ | หน้าที่ |
| --- | --- |
| `favicon.svg` | favicon หลักของ browser |
| `favicon.ico` | fallback favicon |
| `apple-touch-icon.png` | ไอคอนเมื่อติดตั้งบน Apple device |
| `icon-512.png` | ไอคอนความละเอียดสูงสำหรับอุปกรณ์/metadata |

## โฟลเดอร์ที่ไม่ควรนำขึ้น GitHub

| โฟลเดอร์/ไฟล์ | เหตุผล |
| --- | --- |
| `.env` | มีค่า config เฉพาะเครื่อง |
| `node_modules/` | ติดตั้งใหม่ได้จาก `package-lock.json` |
| `dist/` | สร้างใหม่ได้จาก `npm run build` |
| `test-results/`, `playwright-report/` | ผลลัพธ์การทดสอบที่สร้างใหม่ได้ |
| `img/`, `reaction/` | ไฟล์ต้นทางส่วนตัว/เก่าที่ไม่ใช้ใน production bundle |

ดูภาพรวมก่อนที่ [README](../README.md) และดูรายละเอียดการทำงานที่ [สถาปัตยกรรม](03-architecture-and-routes.md)
