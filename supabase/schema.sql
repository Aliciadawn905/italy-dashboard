-- Italy Trip Dashboard Schema
-- Run this in your Supabase SQL Editor

create table if not exists flights (
  id uuid default gen_random_uuid() primary key,
  person text not null check (person in ('Alicia', 'Jamie')),
  direction text not null check (direction in ('outbound', 'return')),
  from_city text not null default '',
  to_city text not null default '',
  date text not null default '',
  airline text not null default '',
  flight_number text not null default '',
  status text not null default 'not_booked' check (status in ('not_booked', 'researching', 'booked')),
  notes text not null default '',
  created_at timestamptz default now()
);

create table if not exists itinerary (
  id uuid default gen_random_uuid() primary key,
  date text not null default '',
  city text not null default '',
  accommodation text not null default '',
  notes text not null default '',
  "order" int not null default 0,
  created_at timestamptz default now()
);

create table if not exists restaurants (
  id uuid default gen_random_uuid() primary key,
  name text not null default '',
  city text not null default '',
  cuisine text not null default '',
  price_range text not null default '$$' check (price_range in ('$', '$$', '$$$', '$$$$')),
  notes text not null default '',
  link text not null default '',
  favorited_by text[] not null default '{}',
  created_at timestamptz default now()
);

create table if not exists activities (
  id uuid default gen_random_uuid() primary key,
  name text not null default '',
  city text not null default '',
  date text not null default '',
  category text not null default 'other' check (category in ('tour', 'cooking', 'wine', 'museum', 'adventure', 'other')),
  notes text not null default '',
  link text not null default '',
  booked boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists notes (
  id uuid default gen_random_uuid() primary key,
  category text not null default 'general' check (category in ('idea', 'packing', 'transport', 'budget', 'general')),
  title text not null default '',
  content text not null default '',
  author text not null default '',
  created_at timestamptz default now()
);

-- Enable realtime for all tables
alter publication supabase_realtime add table flights;
alter publication supabase_realtime add table itinerary;
alter publication supabase_realtime add table restaurants;
alter publication supabase_realtime add table activities;
alter publication supabase_realtime add table notes;

-- Enable RLS but allow all access (no auth)
alter table flights enable row level security;
alter table itinerary enable row level security;
alter table restaurants enable row level security;
alter table activities enable row level security;
alter table notes enable row level security;

create policy "Allow all access on flights" on flights for all using (true) with check (true);
create policy "Allow all access on itinerary" on itinerary for all using (true) with check (true);
create policy "Allow all access on restaurants" on restaurants for all using (true) with check (true);
create policy "Allow all access on activities" on activities for all using (true) with check (true);
create policy "Allow all access on notes" on notes for all using (true) with check (true);
