-- Schema export from Supabase (updated to match actual DB)

-- ------------------------------------------------------
-- Table: public.vinyls
-- ------------------------------------------------------
create table if not exists public.vinyls (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  artist text not null,
  year text null,
  cover_image text null,
  discogs_id integer null,
  owned boolean not null default true,
  format text not null default 'vinyl',
  release_data jsonb null,
  created_at timestamp with time zone not null default now(),
  constraint vinyls_pkey primary key (id)
);

alter table public.vinyls enable row level security;

-- RLS policies for vinyls
create policy "Users can view their own vinyls" on public.vinyls
  for select using (auth.uid() = user_id);

create policy "Users can insert their own vinyls" on public.vinyls
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own vinyls" on public.vinyls
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete their own vinyls" on public.vinyls
  for delete using (auth.uid() = user_id);

-- ------------------------------------------------------
-- Table: public.shared_links
-- ------------------------------------------------------
create table if not exists public.shared_links (
  token character varying not null unique,
  page character varying not null,
  id bigint not null default nextval('shared_links_id_seq'::regclass),
  created_at timestamp without time zone null default now(),
  expires timestamp without time zone not null default (now() + '24:00:00'::interval),
  user_id uuid not null references auth.users (id),
  constraint shared_links_pkey primary key (id)
);

alter table public.shared_links enable row level security;

-- (Consider adding RLS policies for shared_links if this table is used in a multi-tenant way.)

-- ------------------------------------------------------
-- Table: public.genres
-- ------------------------------------------------------
create table if not exists public.genres (
  id uuid not null default gen_random_uuid(),
  name text not null unique,
  constraint genres_pkey primary key (id)
);

-- ------------------------------------------------------
-- Table: public.styles
-- ------------------------------------------------------
create table if not exists public.styles (
  id uuid not null default gen_random_uuid(),
  name text not null unique,
  constraint styles_pkey primary key (id)
);

-- ------------------------------------------------------
-- Table: public.vinyl_genres
-- ------------------------------------------------------
create table if not exists public.vinyl_genres (
  vinyl_id uuid not null references public.vinyls (id) on delete cascade,
  genre_id uuid not null references public.genres (id) on delete cascade,
  constraint vinyl_genres_pkey primary key (vinyl_id, genre_id)
);

-- ------------------------------------------------------
-- Table: public.vinyl_styles
-- ------------------------------------------------------
create table if not exists public.vinyl_styles (
  vinyl_id uuid not null references public.vinyls (id) on delete cascade,
  style_id uuid not null references public.styles (id) on delete cascade,
  constraint vinyl_styles_pkey primary key (vinyl_id, style_id)
);
