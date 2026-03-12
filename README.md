# SUVIDHA — Smart Urban Virtual Interactive Digital Helpdesk Assistant
### C-DAC Smart City 2.0 · MeitY · Government of India

---

## Project Structure

```
suvidha/
├── src/
│   └── App.jsx              ← Complete React kiosk UI (single file, ~600 lines)
├── backend/
│   ├── main.py              ← FastAPI application entry point
│   ├── database.py          ← SQLAlchemy async models (PostgreSQL)
│   ├── requirements.txt
│   └── routers/
│       ├── auth.py          ← OTP auth + JWT issuance
│       ├── electricity.py   ← Bill pay, complaints, meter reading, outage
│       ├── gas.py           ← Cylinder booking, bill pay, connections
│       ├── water.py         ← Bill pay, tanker, sewage, complaints
│       ├── municipal.py     ← Property tax, certificates, trade license
│       └── admin.py         ← Protected analytics + kiosk management
├── package.json             ← Vite + React frontend
├── docker-compose.yml       ← Full stack: Postgres + Redis + API + Frontend
└── README.md
```

---

## Tech Stack

| Layer       | Technology                         |
|-------------|-------------------------------------|
| Frontend    | React 18 + Vite (no CSS framework) |
| Backend     | Python FastAPI + Uvicorn            |
| Database    | PostgreSQL 16 (async via asyncpg)   |
| Cache/OTP   | Redis 7                             |
| Auth        | JWT (PyJWT) + OTP via SMS gateway   |
| Deployment  | Docker Compose                      |

---

## Quick Start

### Option A — Docker (recommended)

```bash
cp .env.example .env          # Set JWT_SECRET
docker-compose up --build
```

- Frontend: http://localhost:3000
- API docs: http://localhost:8000/docs
- ReDoc:    http://localhost:8000/redoc

---

### Option B — Local Dev

**Frontend**
```bash
npm install
npm run dev        # → http://localhost:5173
```

**Backend**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## API Endpoints

| Method | Path                            | Description                  |
|--------|---------------------------------|------------------------------|
| POST   | /api/v1/auth/send-otp           | Send OTP to mobile           |
| POST   | /api/v1/auth/verify-otp         | Verify OTP → JWT token       |
| GET    | /api/v1/electricity/bill/{no}   | Fetch outstanding bill       |
| POST   | /api/v1/electricity/bill/pay    | Process payment              |
| POST   | /api/v1/electricity/complaint   | Lodge complaint              |
| POST   | /api/v1/gas/cylinder/book       | Book LPG cylinder            |
| POST   | /api/v1/water/tanker-request    | Request water tanker         |
| POST   | /api/v1/municipal/property-tax/pay | Pay property tax          |
| POST   | /api/v1/municipal/certificate/request | Apply for certificate  |
| GET    | /api/v1/admin/dashboard         | Analytics (admin only)       |

Full interactive docs at `/docs` (Swagger UI).

---

## Key Features

- **6-language UI** — English, Hindi, Marathi, Tamil, Telugu, Bengali
- **Secure Auth** — Mobile OTP + JWT (OAuth2-compatible)
- **4 Utility Departments** — Electricity, Gas, Water, Municipal (20+ tasks)
- **Bill Payments** — UPI, Card, Net Banking, Cash
- **Complaints & Service Requests** — Auto ref number + tracking
- **Document Services** — Birth/death certificates, trade license
- **Admin Dashboard** — Live KPIs, activity feed, kiosk health
- **Notification Ticker** — Real-time civic alerts
- **DPDP Act Compliant** — Encrypted sessions, OTP TTL, no data retention

---

## Judging Criteria Alignment

| Criterion              | Implementation                                     |
|------------------------|----------------------------------------------------|
| Functionality (40%)    | 20+ tasks across 4 departments, full payment flow  |
| Usability & Design (20%)| Dark theme, touch-optimized, multilingual, ticker  |
| Innovation (15%)       | Unified kiosk, real-time alerts, single codebase   |
| Security (15%)         | JWT auth, OTP TTL, DPDP compliance notes           |
| Documentation (10%)    | Swagger UI, README, inline code comments           |

---

*Developed for C-DAC SUVIDHA Hackathon 2026*
