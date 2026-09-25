# ระบบบันทึกผู้มาติดต่อระดับองค์กร (Visitor Management System - VMS)
### พัฒนาด้วย Google Apps Script + Supabase + Google Gemini AI + GitHub Pages

ระบบบริหารจัดการผู้มาติดต่อครบวงจร รองรับทั้งหน้าจอ รปภ. (Mobile/iPad), หน้าจอเซ็นชื่อดิจิทัลสำหรับผู้รับการติดต่อ (Host Signature), และหน้าจอแดชบอร์ดผู้บริหาร/Admin (16:9 Widescreen)

---

## 🌟 ฟังก์ชันเด่นของระบบ

1. **สแกนกล้องสด 60 FPS บนมือถือ (ผ่าน GitHub Pages):**
   - แก้ปัญหาเบราว์เซอร์มือถือบล็อกกล้องสดใน iframe ของ Google Apps Script ได้ถาวร
   - เปิดกล้องสแกน QR Code บนมือถือ/แท็บเล็ตได้ลื่นไหลเหมือนแอปมือถือจริง
2. **ระบบลายเซ็นดิจิทัลรับรองการเข้าพบ (Host Digital Signature):**
   - ผู้รับการติดต่อ (เจ้าของบ้าน/แผนก) สแกน QR บนบัตรเพื่อเซ็นชื่อรับรองด้วยนิ้วมือบนมือถือ
   - ภาพลายเซ็นบันทึกจัดเก็บเข้าโฟลเดอร์ **Google Drive** ให้อัตโนมัติ (`VMS_Signatures/YYYY-MM/`)
   - Admin สามารถเลือก **เปิด / ปิด** ฟังก์ชันบังคับเซ็นชื่อนี้ได้ในหน้า Dashboard
   - หากเปิดใช้งาน รปภ. จะไม่สามารถสแกนคืนบัตรเพื่อให้ออกได้ จนกว่าผู้รับการติดต่อจะเซ็นรับรอง
3. **AI สกัดข้อมูลบัตรประชาชน (Gemini 3.1 Flash-Lite):**
   - ถ่ายภาพบัตร ปชช. แล้ว AI อ่านเลข 13 หลัก, ชื่อ-นามสกุล, ที่อยู่ กรอกลงฟอร์มอัตโนมัติในเสี้ยววินาที
4. **จัดทำและพิมพ์ QR Code บัตรผู้มาติดต่อ:**
   - ดาวน์โหลดไฟล์ภาพบัตรความละเอียดสูง (600x820 px)
   - คัดลอก Direct URL ของรูปภาพ QR Code ไปใช้งาน
   - สั่งพิมพ์การ์ดบัตรคล้องคอลงบนกระดาษ A4 พร้อมเส้นประสำหรับตัดใส่ซองบัตรมาตรฐาน

---

## 🚀 สถาปัตยกรรมของระบบ (Architecture)

```
[ Frontend บน GitHub Pages ] (ไม่ติด iframe สแกนกล้องสด 60 FPS)
   ├── index.html   --> จุดตรวจ รปภ. (สแกนเข้า, สแกนออก, ดูบัตรค้าง)
   ├── sign.html    --> ผู้รับการติดต่อสแกน QR เพื่อเซ็นชื่อรับรอง
   ├── admin.html   --> แดชบอร์ดผู้ดูแลระบบ (สถิติ, ข้อมูลทั้งหมด, จัดการบัตร, พิมพ์ QR)
   └── config.js    --> จุดกำหนดค่าการเชื่อมต่อ (Supabase + Google Apps Script API)
           │
           ├── [ Supabase REST API ]  --> จัดเก็บข้อมูลผู้มาติดต่อ และสถานะบัตร V-001...
           └── [ Google Apps Script ] --> จัดเก็บไฟล์รูปลายเซ็นลง Google Drive & Gemini AI OCR
```

---

## 🛠️ ขั้นตอนการติดตั้งและอัปโหลดขึ้น GitHub Pages (ใน 3 นาที)

### 1. นำไฟล์ขึ้น GitHub Repository
1. ไปที่ [GitHub.com](https://github.com) แล้วล็อกอินบัญชีของคุณ
2. กดปุ่ม **New Repository** (ตั้งชื่อ เช่น `vms-guard`)
3. เลือกเป็น **Public** แล้วกด **Create repository**
4. ทำการอัปโหลดไฟล์ในโฟลเดอร์นี้ขึ้นไป:
   - `index.html`
   - `admin.html`
   - `sign.html`
   - `config.js`
   - `supabase_schema.sql`

### 2. เปิดใช้งาน GitHub Pages
1. ในหน้า Repository บน GitHub ให้คลิกที่เมนู **Settings** (รูปเฟือง)
2. เมนูด้านซ้ายเลือก **Pages**
3. ที่หัวข้อ **Build and deployment > Branch**:
   - เลือก Branch เป็น `main` (หรือ `master`)
   - โฟลเดอร์เลือก `/ (root)`
   - กดปุ่ม **Save**
4. รอระบบประมวลผลประมาณ 1-2 นาที จะได้ลิงก์เว็บไซต์ เช่น:
   ```text
   https://<your-username>.github.io/<repository-name>/
   ```

### 3. ตรวจสอบการตั้งค่าใน `config.js`
เปิดไฟล์ `config.js` บน GitHub แล้วตรวจสอบว่า:
- `SUPABASE_URL`: URL ของโปรเจกต์ Supabase
- `SUPABASE_KEY`: Anon Public Key ของ Supabase
- `GAS_API_URL`: Web App URL ของ Google Apps Script ที่ Deploy ไว้

---

## 📱 ลิงก์การเข้าใช้งานระบบ

เมื่อเปิดใช้งานบน GitHub Pages แล้ว:

| ผู้ใช้งาน | URL ของหน้าจอ | คำอธิบาย |
| :--- | :--- | :--- |
| **เจ้าหน้าที่ รปภ.** | `https://<user>.github.io/<repo>/` | เปิดกล้องสแกน QR Code แบบสดได้ลื่นไหล ไม่ติด iframe |
| **ผู้รับการติดต่อ** | `https://<user>.github.io/<repo>/sign.html?pass=V-001` | หน้าเซ็นชื่อรับรองด้วยนิ้วมือบนมือถือ พร้อมบันทึกลงไดรฟ์ |
| **ผู้ดูแลระบบ (Admin)** | `https://<user>.github.io/<repo>/admin.html` | แดชบอร์ดสถิติ, ข้อมูลทั้งหมด, สวิตช์เปิดปิดระบบเซ็นชื่อ, พิมพ์บัตร QR |

*(หรือหากต้องการใช้งานผ่าน Google Apps Script โดยตรง สามารถเติมพารามิเตอร์ `?page=admin` หรือ `?page=sign&pass=V-001` ได้เช่นเดียวกัน)*

---

## 🗄️ คำสั่ง SQL สำหรับ Supabase (Migration)
หากเคยสร้างตารางใน Supabase ไว้แล้ว ให้เปิด **Supabase > SQL Editor** แล้วรันคำสั่ง 4 บรรทัดนี้เพื่อเพิ่มคอลัมน์ระบบลายเซ็น:

```sql
ALTER TABLE visitor_logs ADD COLUMN IF NOT EXISTS signed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE visitor_logs ADD COLUMN IF NOT EXISTS signed_by VARCHAR(150);
ALTER TABLE visitor_logs ADD COLUMN IF NOT EXISTS signature_url TEXT;
ALTER TABLE visitor_logs ADD COLUMN IF NOT EXISTS signature_status VARCHAR(20) DEFAULT 'PENDING';
```
