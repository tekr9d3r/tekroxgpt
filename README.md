# TekroxGPT

A personal AI chatbot built for ETHCC Cannes 2026. Instead of handing out business cards, and chating on TG,  people scan a QR code and chat with an AI that knows everything I know.

## What it does

- Chat interface powered by Claude Sonnet
- Personality and background loaded from `soul.md`
- Deployed as a web app — works on any phone browser

## Stack

- **Next.js 14** — frontend + API routes
- **Claude Haiku 4.5** — AI responses (Anthropic API)
- **Tailwind CSS** — styling

## Setup

```bash
npm install
```

Create `.env.local`:

```
ANTHROPIC_API_KEY=your_key_here
```

```bash
npm run dev
```

## Customise

Edit `soul.md` to make it yours — the AI reads it on every request, no rebuild needed.

## Deploy

```bash
npx vercel
```

Set the env vars in the Vercel dashboard and share the URL.
