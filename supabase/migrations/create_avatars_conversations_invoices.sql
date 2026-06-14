-- ============================================================
-- AVATARS
-- preset rows have profile_id = NULL (visible to all users)
-- custom rows have profile_id set (visible only to that user)
-- ============================================================

create table public.avatars (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  image_url   text,
  is_preset   boolean not null default false,
  profile_id  uuid references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),

  -- a custom avatar must be linked to a profile; a preset must not be
  constraint avatars_preset_xor_profile check (
    (is_preset = true  and profile_id is null) or
    (is_preset = false and profile_id is not null)
  )
);

create index avatars_profile_id_idx on public.avatars(profile_id);

alter table public.avatars enable row level security;

-- everyone can see presets
create policy "anyone can view preset avatars"
  on public.avatars for select
  using (is_preset = true);

-- users can see their own custom avatars
create policy "users can view own custom avatars"
  on public.avatars for select
  using (auth.uid() = profile_id);

-- users can create custom avatars for themselves
create policy "users can insert own custom avatars"
  on public.avatars for insert
  with check (auth.uid() = profile_id and is_preset = false);

-- users can update their own custom avatars
create policy "users can update own custom avatars"
  on public.avatars for update
  using (auth.uid() = profile_id and is_preset = false);

-- users can delete their own custom avatars
create policy "users can delete own custom avatars"
  on public.avatars for delete
  using (auth.uid() = profile_id and is_preset = false);


-- ============================================================
-- CONVERSATIONS
-- one row = one chat session between a user and an avatar
-- ============================================================

create table public.conversations (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  avatar_id   uuid not null references public.avatars(id) on delete restrict,
  title       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index conversations_profile_id_idx on public.conversations(profile_id);
create index conversations_avatar_id_idx  on public.conversations(avatar_id);

-- keep updated_at current whenever a row changes
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger conversations_updated_at
  before update on public.conversations
  for each row execute procedure public.touch_updated_at();

alter table public.conversations enable row level security;

create policy "users can view own conversations"
  on public.conversations for select
  using (auth.uid() = profile_id);

create policy "users can insert own conversations"
  on public.conversations for insert
  with check (auth.uid() = profile_id);

create policy "users can delete own conversations"
  on public.conversations for delete
  using (auth.uid() = profile_id);


-- ============================================================
-- MESSAGES
-- individual turns within a conversation
-- cascade-deleted when their conversation is deleted
-- ============================================================

create table public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role            text not null check (role in ('user', 'assistant')),
  content         text not null,
  created_at      timestamptz not null default now()
);

create index messages_conversation_id_idx on public.messages(conversation_id);

alter table public.messages enable row level security;

-- users reach messages through the conversation they own
create policy "users can view own messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and c.profile_id = auth.uid()
    )
  );

create policy "users can insert own messages"
  on public.messages for insert
  with check (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and c.profile_id = auth.uid()
    )
  );


-- ============================================================
-- INVOICES
-- ============================================================

create type public.invoice_status as enum (
  'draft', 'pending', 'paid', 'overdue', 'cancelled'
);

create table public.invoices (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  status      public.invoice_status not null default 'draft',
  amount_due  numeric(10, 2) not null check (amount_due >= 0),
  due_date    date,
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index invoices_profile_id_idx on public.invoices(profile_id);
create index invoices_status_idx      on public.invoices(status);

create trigger invoices_updated_at
  before update on public.invoices
  for each row execute procedure public.touch_updated_at();

alter table public.invoices enable row level security;

create policy "users can view own invoices"
  on public.invoices for select
  using (auth.uid() = profile_id);

-- clients cannot create or delete invoices — admin does that
-- add an admin policy later once admin auth is wired up
