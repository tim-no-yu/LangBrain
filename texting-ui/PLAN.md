# Spanish AI Chat UI — Plan

## What We're Building

A clean, iMessage-style texting interface at `/chat` where users practice conversational Spanish with an AI tutor powered by Claude. The AI replies in Spanish with English translations and drops occasional inline grammar/vocabulary tips.

---

## Features

| Feature | Priority | Notes |
|---|---|---|
| Chat message UI (bubbles) | P0 | Core of the product |
| Send message + receive AI reply | P0 | Requires Claude API route |
| Inline tips (💡 Tip:) | P0 | Prompted via system prompt, no extra UI needed |
| Loading/typing indicator | P1 | "..." bubble while waiting |
| Auto-scroll to latest message | P1 | Quality of life |
| Back button to dashboard | P1 | Navigation |
| Dashboard "Begin practice" link | P1 | Connects existing dashboard to chat |
| Keyboard submit (Enter key) | P2 | Nice to have |

---

## Tech Stack Decisions

| Decision | Choice | Why |
|---|---|---|
| AI model | `claude-sonnet-4-6` | Best balance of speed and intelligence for conversation |
| API client | `@anthropic-ai/sdk` | Official SDK, handles auth and types |
| Styling | Tailwind CSS | Already in the project, no new deps |
| State management | React `useState` | Simple enough — no global state needed |
| Routing | Next.js App Router | Already in use |
| Data fetching | `fetch` to internal API route | Simple, no extra library |

No new UI libraries. No database — conversation lives in component state (each session starts fresh, which is fine for practice).

---

## Build Order (by priority)

### Phase 1 — Foundation (must do first)
These unblock everything else.

1. **Install dependency** — `npm install @anthropic-ai/sdk`
2. **Add env var** — `ANTHROPIC_API_KEY` in `.env.local`
3. **`src/types/chat.ts`** — Define `Message` type (`role`, `content`)

### Phase 2 — API Route
4. **`src/app/api/chat/route.ts`** — POST handler that:
   - Accepts `{ messages: Message[] }`
   - Calls Claude with system prompt (Spanish tutor, inline tips)
   - Returns `{ message: string }`

### Phase 3 — Chat UI
5. **`src/app/chat/page.tsx`** — Client component with:
   - Fixed header + back link
   - Scrollable message list (user bubbles right/blue, AI bubbles left/gray)
   - Fixed bottom input bar + Send button
   - Loading "..." indicator
   - Auto-scroll on new message

### Phase 4 — Connect the Dots
6. **`src/app/dashboard/page.tsx`** — Update "Begin practice" button to link to `/chat`

---

## System Prompt (used in API route)

> You are a friendly Spanish tutor helping the user practice conversational Spanish over text. Keep replies short like real texts. Reply in Spanish first, then put the English translation in parentheses on the next line. Occasionally (not every message) add a short inline tip starting with "💡 Tip:" about the grammar, vocabulary, or phrasing used. Be warm and encouraging.

---

## File Map

```
src/
  types/
    chat.ts              ← NEW: Message type
  app/
    api/
      chat/
        route.ts         ← NEW: Claude API route
    chat/
      page.tsx           ← NEW: Chat UI
    dashboard/
      page.tsx           ← EDIT: Link "Begin practice" to /chat
```

---

## Verification Checklist

- [ ] `npm install @anthropic-ai/sdk` succeeds
- [ ] `.env.local` has `ANTHROPIC_API_KEY`
- [ ] `npm run dev` starts without errors
- [ ] Dashboard → "Begin practice" → navigates to `/chat`
- [ ] Typing and sending a message shows user bubble
- [ ] AI reply appears with Spanish + English translation
- [ ] "..." typing indicator appears while waiting
- [ ] A 💡 Tip appears after a few exchanges
- [ ] Enter key submits the message
