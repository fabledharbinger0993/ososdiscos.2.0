# Osos Discos — DJ Booking Platform

A full-stack web platform for DJ bookings, gear rental, and live event management.

---

## Stack

| Layer      | Service              |
|------------|----------------------|
| Frontend   | Next.js → Vercel     |
| Backend    | Node/Express → Railway |
| Database   | MongoDB Atlas        |
| Domain/CDN | Cloudflare           |
| Local Dev  | Docker Compose       |

---

## Project Structure

```
ososdiscos/
├── docker-compose.yml
├── package.json          ← root convenience scripts only
├── .gitignore
├── README.md
│
├── frontend/             → Vercel deployment
│   ├── package.json
│   ├── tsconfig.json
│   ├── vercel.json
│   ├── next-env.d.ts
│   ├── Dockerfile
│   ├── pages/
│   │   ├── index.tsx         → /
│   │   ├── booking.tsx       → /booking
│   │   ├── gear.tsx          → /gear
│   │   └── admin/
│   │       ├── index.tsx     → /admin
│   │       └── login.tsx     → /admin/login
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── HeroCarousel.tsx
│   │   ├── SoundSection.tsx
│   │   ├── MovieReel.tsx
│   │   ├── PictureCarousel.tsx
│   │   ├── EventFlyers.tsx
│   │   ├── BioPanel.tsx
│   │   ├── EventCalendar.tsx
│   │   ├── CalendarWidget.tsx
│   │   ├── BookingForm.tsx
│   │   └── GearBuilder.tsx
│   └── styles/
│       └── theme.ts
│
└── backend/              → Railway deployment
    ├── package.json
    └── ...
```

---

## Local Development (Docker)

Runs frontend, backend, and a local MongoDB instance together.

```bash
docker-compose up --build
```

| Service  | URL                    |
|----------|------------------------|
| Frontend | http://localhost:3000  |
| Backend  | http://localhost:5000  |
| MongoDB  | localhost:27017        |

---

## Frontend Only

```bash
cd frontend
npm install
npm run dev
```

Requires `NEXT_PUBLIC_API_URL` set in a `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Environment Variables

Copy `.env.example` to `.env` in the backend folder and fill in your values.

Key variables:
- `MONGO_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — secret for admin auth tokens
- `NEXT_PUBLIC_API_URL` — backend API URL (set in Vercel dashboard for production)

---

## Deployment

- **Frontend** — push to GitHub, Vercel auto-deploys from `main`
- **Backend** — Railway watches the `/backend` folder and auto-deploys
- **DNS** — domain managed in Cloudflare, pointing to Vercel (frontend) and Railway (backend)
