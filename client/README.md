# Web Shop — Client

React + Vite frontend for the Telegram Web App shop. See the root [README.md](../README.md) for the full project overview, environment variables, and deployment notes.

## Local development

```bash
npm install
npm run dev
```

Requires a `.env` file (see `.env.example`) pointing `VITE_API_URL` at a running backend.

## Production build

```bash
npm run build
```

Output goes to `dist/`. `vercel.json` includes the SPA rewrite rule needed for client-side routing on Vercel.
