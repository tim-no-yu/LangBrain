# My First App

An app that lets you practice texting in Spanish with an AI tutor (Claude).

## Tech Stack
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Anthropic SDK (`@anthropic-ai/sdk`) — already installed

## Project Structure

```
src/
  app/
    page.tsx                        ← Redirects / → /dashboard
    dashboard/
      page.tsx                      ← Conversation list (mock data, no auth yet)
    chat/
      page.tsx                      ← Live AI chat UI (client component)
    api/
      chat/
        route.ts                    ← POST handler, calls Claude
  types/
    chat.ts                         ← Message type { role, content }
  components/                       ← Empty for now, add reusable UI here
  lib/                              ← Empty for now, add utilities here
```

## Key Files Explained

### `src/app/dashboard/page.tsx`
Shows a list of conversations with avatars, last message, time, and unread blue dot.
- Data is hardcoded mock data at the top of the file — replace with real DB later
- Username is hardcoded as `mockUser` — replace with real auth later
- Conversation rows link to `/dashboard/conversations/[id]` — those pages don't exist yet
- "+ New chat" button links to `/chat`

### `src/app/chat/page.tsx`
iMessage-style chat UI. Client component (`"use client"`) because it uses React state.
- `messages` state holds the full conversation history
- On send: appends user message → calls `/api/chat` → appends AI reply
- Shows a `...` loading bubble while waiting
- Auto-scrolls to latest message via `useRef`
- Enter key submits (Shift+Enter for newline)
- Conversation resets on page refresh (no persistence yet)

### `src/app/api/chat/route.ts`
Next.js API route. Receives `{ messages: Message[] }`, calls Claude, returns `{ message: string }`.
- Model: `claude-sonnet-4-6`
- System prompt makes Claude act as a Spanish tutor (Spanish reply + English translation + occasional 💡 tips)
- API key is read from `ANTHROPIC_API_KEY` in `.env.local`

### `src/types/chat.ts`
```ts
type Message = { role: "user" | "assistant"; content: string }
```
Shared between the chat UI and the API route.

## Environment Variables

- `.env.local` — never committed, holds real keys
- `.env.example` — committed, shows what keys are needed (blank values)

```
ANTHROPIC_API_KEY=   ← get from console.anthropic.com
```

## Conventions
- Use Tailwind for all styling — no CSS files
- Components use PascalCase (`MyComponent.tsx`)
- One component per file
- Use TypeScript for everything
- API routes live in `src/app/api/`

## What's Not Built Yet
- Authentication (username is hardcoded)
- Individual conversation pages (`/dashboard/conversations/[id]`)
- Real conversation data (dashboard uses mock data)
- "Log out" button (renders but does nothing)
- Persistent chat history (resets on refresh)
