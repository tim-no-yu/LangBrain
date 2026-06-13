-- 1. Enum for user roles
create type public.user_role as enum ('client', 'admin');

-- 2. Profiles table
create table public.profiles (
  id           uuid references auth.users(id) on delete cascade primary key,
  full_name    text,
  company_name text,
  role         public.user_role not null default 'client',
  created_at   timestamptz not null default now()
);

-- 3. Row-level security — users can only read/update their own row
alter table public.profiles enable row level security;

create policy "users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 4. Trigger function: runs after a new row is inserted in auth.users
--    security definer lets it write to profiles even without an active session
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

-- 5. Attach the trigger to auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
