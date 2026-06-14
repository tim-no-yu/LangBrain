# My First App

An app that lets you practice texting in Spanish with an AI tutor (Claude).

## Tech Stack
- Next.js 16 with App Router
- TypeScript
- Tailwind CSS
- Supabase (auth + Postgres database, via `@supabase/ssr` and `@supabase/supabase-js`)
- Anthropic SDK (`@anthropic-ai/sdk`)

## Project Structure

```
src/
  app/
    page.tsx                                  ← Redirects / → /dashboard
    layout.tsx
    globals.css
    (auth)/
      login/page.tsx                          ← Email/password login form
      signup/page.tsx                         ← Email/password signup form
    dashboard/
      page.tsx                                ← Conversation list (reads from DB)
    chat/
      page.tsx                                ← Live AI chat UI (client component)
    api/
      chat/
        route.ts                              ← Legacy POST handler (calls Claude)
        send/route.ts                         ← Active POST handler (calls Claude)
      avatars/route.ts                        ← GET all avatars
      conversations/
        route.ts                              ← GET list, POST create
        [id]/
          route.ts                            ← DELETE by id
          messages/route.ts                   ← GET messages for a conversation
      dashboard/
        route.ts                              ← GET user profile (mock data still)
        stats/route.ts                        ← GET stats (mock data still)
      invoices/route.ts                       ← GET invoices
  components/
    CreateAvatarForm.tsx                      ← Form to create a custom avatar
    LogoutButton.tsx                          ← Calls signOut(), redirects to /login
  lib/
    auth.ts                                   ← signUp / signIn / signOut helpers
    queries.ts                                ← All Supabase DB queries live here
    supabase/
      client.ts                               ← Browser Supabase client
      server.ts                               ← Server Supabase client (uses cookies)
  middleware.ts                               ← Route protection (auth redirects)
  types/
    chat.ts                                   ← Message type { role, content }
    database.ts                               ← Row + Insert types for every DB table

supabase/
  migrations/
    create_profiles.sql                       ← profiles table + user_role enum + trigger
    create_avatars_conversations_invoices.sql ← avatars, conversations, messages, invoices tables
    20260614000000_add_comprehension_to_conversations.sql ← adds comprehension smallint column

scripts/
  seed.ts                                     ← Creates test users + avatars (run once)
```

## Auth Flow

Auth is real — powered by Supabase email/password auth.

- `src/lib/auth.ts` — thin wrappers around `supabase.auth.signUp`, `signInWithPassword`, `signOut`
- `src/middleware.ts` — protects `/dashboard/*`; redirects unauthenticated users to `/login` and authenticated users away from `/login`/`/signup`
- Two Supabase clients exist for a reason:
  - `lib/supabase/client.ts` — browser client (used in client components and `lib/auth.ts`)
  - `lib/supabase/server.ts` — server client (reads cookies; used in API routes and server components)
- When a user signs up, a trigger in Postgres auto-creates a row in `public.profiles`

## Database Schema (summary)

All tables have RLS enabled. Queries in `lib/queries.ts` rely on RLS — no manual user filters needed.

| Table | Key columns |
|-------|-------------|
| `profiles` | `id` (= auth user id), `full_name`, `company_name`, `role` (client/admin) |
| `avatars` | `id`, `name`, `description`, `image_url`, `is_preset`, `profile_id` |
| `conversations` | `id`, `profile_id`, `avatar_id`, `title`, `comprehension` (0–100), `updated_at` |
| `messages` | `id`, `conversation_id`, `role` (user/assistant), `content` |
| `invoices` | `id`, `profile_id`, `status` (enum), `amount_due`, `due_date` |

`comprehension` is a nullable `smallint` with a CHECK constraint (0–100). Added in `20260614000000_add_comprehension_to_conversations.sql`.

## TypeScript Types (`src/types/`)

### `database.ts`
Contains `*Row` (select — all fields required) and `*Insert` (insert — DB-defaulted fields optional) for every table:
- `ProfileRow` / `ProfileInsert`
- `AvatarRow` / `AvatarInsert`
- `ConversationRow` / `ConversationInsert`
- `MessageRow` / `MessageInsert`
- `InvoiceRow` / `InvoiceInsert`
- Enums: `UserRole`, `InvoiceStatus`

### `chat.ts`
Only contains `Message = { role: "user" | "assistant"; content: string }`. Used by the chat UI and AI API routes.

## All DB Queries (`src/lib/queries.ts`)

All Supabase queries go here — never call Supabase directly from a component or API route.

- `getAvatars()` — presets first, then user's custom avatars
- `createCustomAvatar(name, description?, imageUrl?)`
- `getConversations()` — includes joined avatar fields + comprehension
- `createConversation(avatarId, title?)` → `ConversationRow`
- `deleteConversation(id)`
- `getMessages(conversationId)`
- `saveMessage(conversationId, role, content)`
- `getInvoices()`

## Environment Variables

```
ANTHROPIC_API_KEY=          ← console.anthropic.com
NEXT_PUBLIC_SUPABASE_URL=   ← Supabase project Settings > API
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=  ← used only by scripts/seed.ts — never expose to browser
```

`.env.local` is never committed. `.env.example` has blank placeholders.

## Migrations

Supabase migration files **must** follow the naming convention `<timestamp>_name.sql` (14-digit timestamp: `YYYYMMDDHHmmss`) or `npx supabase db push` will skip them. The two original files (`create_profiles.sql`, `create_avatars_conversations_invoices.sql`) don't follow this convention and were applied manually via the SQL editor.

## Seed Script

`scripts/seed.ts` creates one admin + three client users with 2–3 avatars each. Uses the service role key to call `supabase.auth.admin.createUser()` with `email_confirm: true`.

```
npx tsx scripts/seed.ts
```

Run from the project root. Requires `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.

Test accounts: `admin@dev.local`, `alice@dev.local`, `bob@dev.local`, `carol@dev.local` — all use password `Password123!`.

## Conventions
- Tailwind for all styling — no CSS modules
- Components use PascalCase (`MyComponent.tsx`), one per file
- API routes live in `src/app/api/`
- Import alias `@/` maps to `src/`

## What's Not Built Yet
- Individual conversation pages (`/dashboard/conversations/[id]`)
- `/api/dashboard` and `/api/dashboard/stats` still return hardcoded mock data
- Chat history doesn't persist between page refreshes
- `comprehension` score is stored in the DB but nothing sets or displays it yet
- No admin-only views or role-based UI gating
- Invoices API exists but no UI for it
