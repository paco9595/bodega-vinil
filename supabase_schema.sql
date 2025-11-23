-- Create the vinyls table
create table public.vinyls (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  artist text not null,
  year text null,
  cover_image text null,
  discogs_id integer null,
  created_at timestamp with time zone not null default now(),
  constraint vinyls_pkey primary key (id)
);

-- Enable Row Level Security (RLS)
alter table public.vinyls enable row level security;

-- Create policies
create policy "Users can view their own vinyls" on public.vinyls
  for select using (auth.uid() = user_id);

create policy "Users can insert their own vinyls" on public.vinyls
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own vinyls" on public.vinyls
  for delete using (auth.uid() = user_id);
