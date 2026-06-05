# Interactive Birthday Journey Website

A romantic, cinematic full-stack experience: password gate → memory journey → birthday message. Includes an admin dashboard for managing memories and the site password.

## Stack

- **Frontend:** React (Vite), React Router, Tailwind CSS v4, Framer Motion, typewriter-effect, canvas-confetti
- **Backend:** Node.js, Express, JWT, bcrypt, JSON file storage, local image uploads

## Project structure

```
bday-website/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── data/
│   ├── uploads/
│   └── server.js
└── frontend/
    └── src/
        ├── pages/
        ├── components/
        ├── services/
        └── hooks/
```

## Local setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set a strong `JWT_SECRET`.

Seed passwords (default website password: `birthday123`, admin: `admin` / `admin123`):

```bash
node scripts/seed.js
npm run dev
```

API runs at `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` and `/uploads` to the backend in development.

## API endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/verify-password` | Public |
| GET | `/api/memories` | Public |
| POST | `/api/admin/login` | Public |
| POST | `/api/admin/memory` | JWT |
| PUT | `/api/admin/memory/:id` | JWT |
| DELETE | `/api/admin/memory/:id` | JWT |
| PUT | `/api/admin/memory/reorder` | JWT |
| PUT | `/api/admin/password` | JWT |
| GET | `/api/message` | Public |
| PUT | `/api/admin/message` | JWT |
| POST | `/api/wishes` | Public |
| GET | `/api/admin/wishes` | JWT |
| DELETE | `/api/admin/wishes` | JWT |
| DELETE | `/api/admin/wishes/:id` | JWT |

## User flow

1. **/** — Landing page with password
2. **/journey** — One memory at a time (alternating layout on desktop)
3. **/message** — Birthday wish, confetti, option to make a wish
4. **/wish** — Write a private wish in the wish box

## Admin flow

1. **/admin** — Login
2. **/admin/dashboard** — CRUD memories, view/delete wishes, reorder, change site password, preview journey

## Deployment

### Backend (Render)

- Root directory: `backend`
- Build: `npm install`
- Start: `npm start`
- Env: `PORT`, `JWT_SECRET`, `FRONTEND_URL` (your Vercel URL), `NODE_ENV=production`
- Run seed once on deploy or commit seeded `data/admin.json` after local seed (do not commit real secrets)
- Use a **persistent disk** for `data/` and `uploads/` on Render so JSON and images survive restarts

### Frontend (Vercel)

- Root directory: `frontend`
- Build: `npm run build`
- Output: `dist`
- Env: `VITE_API_URL=https://your-api.onrender.com`

## Customize

1. Run seed, then change passwords in admin dashboard
2. Replace sample images in admin or upload your photos
3. Edit message text in **Admin → Message page** (heading, typewriter message, closing line)
4. Adjust colors in `frontend/src/index.css`

## Default credentials (after seed)

| Role | Value |
|------|--------|
| Journey password | `birthday123` |
| Admin username | `admin` |
| Admin password | `admin123` |

Change these before sharing the site publicly.
