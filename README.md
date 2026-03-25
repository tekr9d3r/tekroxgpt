# TekroxGPT

A personal AI chatbot built for ETHCC Cannes 2025. Instead of handing out business cards, people scan a QR code and chat with an AI that knows everything about me.

## What it does

- Chat interface powered by Claude Sonnet
- Personality and background loaded from `soul.md`
- Deployed as a web app — works on any phone browser

## Stack

- **Next.js 14** — frontend + API routes
- **Claude Sonnet 4.6** — AI responses (Anthropic API)
- **ElevenLabs** — text-to-speech (optional)
- **Tailwind CSS** — styling

## Setup

```bash
npm install
```

Create `.env.local`:

```
ANTHROPIC_API_KEY=your_key_here
ELEVENLABS_API_KEY=your_key_here
ELEVENLABS_VOICE_ID=your_voice_id_here
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
