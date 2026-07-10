# Context for RGA Dashboard

สรุปบริบทของโปรเจค RGA (Return on Ad Spend) Dashboard

## วัตถุประสงค์
- มีระบบสมัครสมาชิก - ล็อคอินเข้าสู่ระบบ
- แต่ละบัญชีแยกข้อมูลของลูกค้าแต่ละรายอย่างชัดเจน (Tenant Isolation หรือ Multi-tenancy)
- ระบบวิเคราะห์ผลตอบแทนจากโฆษณา (ROAS) โดยรวมข้อมูลจากหลายแหล่ง เช่น Google Ads, GA4, และ Search Console
- ให้แดชบอร์ดสำหรับการวิเคราะห์แคมเปญ การติดตามค่าใช้จ่าย และการคำนวณ ROI/ROAS
- มี AI ช่วยคิดวิเคราะห์ 
- มีการเก็บข้อมูลไว้ใน database 
- มีการแจ้งเตือนต่างๆผ่าน email ที่สมัครเข้ามาหรือสามารถเปลี่ยน email ที่อยากให้ส่งแจ้งเตือนเองทีหลังได้
- รองรับ 2 ภาษา EN/TH (ค่าเริ่มต้น EN)


## โครงสร้างหลักของรีโพ
- `backend/` – NestJS API, Prisma ORM, สคริปต์ซิงก์ข้อมูล และ integration กับ Google APIs
- `frontend/` – React + TypeScript (Vite) สำหรับ UI และแดชบอร์ด
- `prisma/` – สคีมาและมิเกรชันของฐานข้อมูล
- `docs/` – เอกสารออกแบบ, คู่มือตรวจสอบ และรายงาน audit

## เทคโนโลยีหลัก
- Backend: NestJS, TypeScript, Prisma, PostgreSQL
- Frontend: React, TypeScript, Vite
- Integrations: Google Ads API, Google Analytics 4, Google Search Console
- Deployment: Docker, docker-compose

## การตั้งค่าและรัน (ย่อ)
1. ติดตั้ง dependencies (backend/frontend):

```
cd backend && npm install
cd ../frontend && npm install
```

2. ตั้งค่าตัวแปรแวดล้อม (.env) ตามคำแนะนำใน README และไฟล์ `prisma.config.ts`
3. รันมิเกรชันฐานข้อมูล (Prisma):

```
cd backend
npx prisma migrate dev
```

4. สตาร์ทในโหมดพัฒนา:

```
cd backend && npm run start:dev
cd frontend && npm run dev
```

5. สร้างและรันด้วย Docker:

```
docker-compose up --build
```

## ไฟล์สำคัญและตำแหน่งที่ควรดู
- การตั้งค่า Prisma: backend/prisma/ และ prisma.config.ts
- สคริปต์ debug และ OAuth: backend/debug_ads_oauth*.ts
- คู่มือการตั้งค่า: DEVELOPMENT_GUIDE.md, SUPABASE_SETUP_GUIDE.md
- แนวทาง Agent/งานอัตโนมัติ: AGENTS.md

## การทดสอบ
- Unit/integration tests อยู่ใน backend/test/ และ frontend/test/ (ใช้ Jest/Playwright ตาม repo)
- รันเทสต์: `npm run test` ในแต่ละแพ็กเกจตามที่ระบุใน `package.json`

## การปรับใช้งานและการผลิต
- ใช้ Dockerfile ในแต่ละแพ็กเกจ และ `docker-compose.yml` สำหรับการรันแบบรวม
- ตรวจสอบ environment variables สำหรับ OAuth และ API keys (อย่าเชื่อมโยงคีย์ในซอร์ส)

## การตัดสินใจด้านสถาปัตยกรรมที่สำคัญ
- ใช้ Prisma เป็น ORM เพื่อความปลอดภัยและมิเกรชันที่ชัดเจน
- แยก frontend/backend เป็น services ชัดเจน เพื่อให้สามารถสเกลแยกกันได้

## ข้อควรระวังและข้อจำกัดที่รู้แล้ว
- โควต้า Google APIs อาจจำกัดการซิงก์ข้อมูลจำนวนมาก — ต้องมีการจัดคิว/แบทช์
- การจัดการ refresh token ของ Google ต้องทดสอบในสภาพแวดล้อมจริง

## ผู้ติดต่อและแหล่งข้อมูลเพิ่มเติม
- ดู PROJECT_OVERVIEW.md, DEVELOPMENT_GUIDE.md และ AGENTS.md สำหรับรายละเอียดเชิงลึก
- หากต้องการข้อมูล OAuth/debug ให้ดูไฟล์ใน backend/ ที่ขึ้นต้นด้วย debug_ads_oauth

---
ไฟล์นี้เป็นเอกสารสรุปบริบทเพื่อช่วยผู้พัฒนาใหม่ให้เข้าใจภาพรวมของโปรเจคอย่างรวดเร็ว
