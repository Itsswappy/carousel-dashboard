-- Run this in Supabase SQL editor to set up tables + RLS

create table if not exists accounts (
  id uuid primary key,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  design text not null default 'minimal',
  accent_color text not null default '#FFE600',
  prompt text,
  created_at timestamptz not null default now()
);

create table if not exists carousels (
  id uuid primary key,
  user_id uuid references auth.users(id) on delete cascade,
  account_id uuid references accounts(id) on delete set null,
  title text not null,
  scheduled_date date not null,
  status text not null default 'draft',
  slides jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  ai_provider text not null default 'openai',
  ai_api_key text not null default ''
);

alter table accounts enable row level security;
alter table carousels enable row level security;
alter table settings enable row level security;

create policy "own accounts" on accounts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own carousels" on carousels for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own settings" on settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);