# 6. ดีไซน์, Asset และ Style

## Nexora Brand System

Nexora ใช้แนวทาง “social community ที่ดูเป็นเทคโนโลยีและเป็นมิตร” สีและเงาถูกเก็บเป็น CSS custom properties ใน `src/styles/variables.css`

| Token | ค่า | ความหมาย |
| --- | --- | --- |
| `--color-primary` | `#4F46E5` | Indigo สำหรับปุ่มและสถานะสำคัญ |
| `--color-secondary` | `#7C3AED` | Violet สำหรับแบรนด์และจุดเน้น |
| `--color-accent` | `#06B6D4` | Cyan สำหรับ connection/accent |
| `--color-background` | `#F5F7FB` | พื้นหลังอ่อน |
| `--color-surface` | `#FFFFFF` | Card และพื้นที่อ่านข้อมูล |
| `--gradient-brand` | Indigo → Violet → Cyan | ปุ่มหลักและภาพแบรนด์ |

Typography ใช้ `Noto Sans Thai` ร่วมกับ Inter เพื่ออ่านไทยและอังกฤษได้สม่ำเสมอ

## โลโก้และ favicon

| ตำแหน่ง | หน้าที่ |
| --- | --- |
| `src/assets/nexora/loop-horizontal.svg` | Wordmark บน Navbar และ Auth Portal |
| `src/assets/nexora/loop-icon.svg` | Icon บนมือถือและ Nexora AI avatar |
| `public/nexora/favicon.svg` / `.ico` | Browser tab |
| `public/nexora/apple-touch-icon.png` / `icon-512.png` | อุปกรณ์และ PWA-compatible icons |

`src/brand.js` เป็นจุดกลางสำหรับชื่อ Nexora, tagline และ asset โลโก้ จึงไม่ต้องกระจายข้อความแบรนด์ไปหลาย component

## Community Constellation

หน้า Login และ Signup ใช้ `community-constellation.svg` เป็นภาพประกอบ static ภายใน source:

- ใช้ node, เส้นเชื่อม, card แบบ abstract และ Loop motif
- ไม่มีตัวอักษร รูปคน การเคลื่อนไหว หรือ resource ภายนอก
- เป็น decorative image จึงใช้ `alt=""` และ `aria-hidden="true"`
- แสดงบน Desktop/Tablet และซ่อนเมื่อความกว้างไม่เกิน 767px เพื่อให้ mobile โฟกัสที่ฟอร์ม

## Demo assets

```text
src/assets/demo/avatars/  avatar WebP 5 แบบที่สลับใช้กับข้อมูลเดโม
src/assets/demo/          story cover SVG 4 แบบ
src/assets/reactions/     GIF reaction 7 แบบ
```

Asset ทั้งหมด import ผ่าน `src` ไม่ใช้ path รากแบบ `/img/` หรือ `/reaction/` จึงถูก Vite bundle และไม่หายหลัง build

## CSS แยกตามความรับผิดชอบ

| ไฟล์ | ดูแลส่วนใด |
| --- | --- |
| `variables.css` | token, reset และ font |
| `layout.css`, `responsive.css` | grid หลักและ breakpoint |
| `navbar.css`, `sidebar.css`, `contacts.css` | Navigation และแถบข้าง |
| `composer.css`, `post.css`, `post-modal.css` | Post, comment, modal และ reaction |
| `stories.css`, `story-creator.css`, `story-viewer.css` | Stories และ dialogs |
| `login.css` | Aurora Auth Portal, forms และ Community Constellation |
| `App.css` | toast และ footer ของ app |

## Responsive และ accessibility

- ใช้ `clamp`, `min`, CSS grid และ media queries รองรับ 1440px, 768px และ 375px
- บน mobile ซ่อน illustration ใน Auth Portal เพื่อไม่ให้ฟอร์มล้น
- ทุก interactive control มี focus state จาก `--focus-ring`
- `prefers-reduced-motion` ลด animation/transition สำหรับผู้ใช้ที่เลือกการเคลื่อนไหวน้อย
- Dialog ใช้ semantics และ focus management ผ่าน custom hook

อ่านต่อ: [ภาพรวมโปรเจกต์](01-project-overview.md) · [สารบัญอ้างอิงไฟล์](07-source-file-reference.md)
