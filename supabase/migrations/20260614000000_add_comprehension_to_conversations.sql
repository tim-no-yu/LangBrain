alter table public.conversations
  add column comprehension smallint check (comprehension between 0 and 100);
