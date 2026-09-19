# Web Shop — Telegram Web App + Admin Bot

A simple MVP e-commerce shop built as a Telegram Web App, with a Telegram bot for admin
product/category/order management and a small statistics dashboard.

## Stack

- **Frontend**: React + Vite (JavaScript), React Router, plain CSS
- **Backend**: Node.js + Express, MongoDB + Mongoose, JWT auth, bcryptjs
- **Bot**: Telegraf (Telegram Bot API)

No Redux/Zustand/GraphQL/WebSockets/Redis/Docker — kept intentionally simple.

## Project structure

```
client/   React + Vite web app (also runs as a Telegram Web App)
server/   Express API + Telegram bot (single Node process)
```

## Local development

1. `server/.env` — copy from `server/.env.example` and fill in real values (MongoDB Atlas URI, a
   long random `JWT_SECRET`, your Telegram bot token, your numeric Telegram user ID as
   `ADMIN_TELEGRAM_ID`, and admin login credentials for the seed script).
2. `client/.env` — copy from `client/.env.example` and set `VITE_API_URL` to the backend URL
   (`http://localhost:5000` for local dev).
3. Install and run:
   ```bash
   cd server && npm install && npm run dev
   cd client && npm install && npm run dev
   ```
4. Create the first admin user: `cd server && npm run create-admin`.

## Environment variables

**Backend** (`server/.env`):

| Variable | Purpose |
|---|---|
| `PORT` | HTTP port (most hosts inject this automatically) |
| `MONGODB_URI` | MongoDB Atlas connection string, including a database name |
| `JWT_SECRET` | Long random secret used to sign auth tokens |
| `CLIENT_URL` | Deployed frontend origin, used for CORS |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used only by `npm run create-admin` |
| `TELEGRAM_BOT_TOKEN` | Bot token from @BotFather |
| `ADMIN_TELEGRAM_ID` | Your numeric Telegram user ID — only this ID can use the admin bot |

**Frontend** (`client/.env`):

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of the deployed backend API |

Never commit real `.env` files — only the `.env.example` placeholders are tracked in git.

## Deployment

- **Frontend**: Vercel (static build of `client/`, see `client/vercel.json` for the SPA rewrite rule)
- **Backend**: Render (Node web service rooted at `server/`)
- **Database**: MongoDB Atlas (not self-hosted)
- **Bot**: runs inside the same backend process via long polling — no separate deployment needed

The backend's `CLIENT_URL` must match the deployed frontend origin exactly (no trailing slash) for
CORS to work. The frontend's `VITE_API_URL` must point at the deployed backend.
