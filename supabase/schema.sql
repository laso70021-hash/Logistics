-- Supabase Database Schema for LogiTrack

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  role text not null check (role in ('super_admin', 'admin', 'agent', 'customer')),
  full_name text,
  email text not null,
  station text,
  region text,
  active boolean default true,
  created_at timestamptz default now()
);

-- Handle new user signup automatically
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email, coalesce(new.raw_user_meta_data->>'role', 'customer'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- SHIPMENTS
create table shipments (
  id uuid default uuid_generate_v4() primary key,
  tracking_number text unique not null,
  status text not null check (status in ('order_created', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'exception')),
  origin text not null,
  destination text not null,
  item_name text not null,
  category text,
  quantity integer default 1,
  weight numeric,
  description text,
  sender_name text not null,
  sender_phone text,
  sender_email text,
  receiver_name text not null,
  receiver_phone text,
  receiver_email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);


-- SHIPMENT EVENTS
create table shipment_events (
  id uuid default uuid_generate_v4() primary key,
  shipment_id uuid references shipments(id) on delete cascade not null,
  status text not null,
  location text,
  note text,
  agent_id uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);


-- PROOF OF DELIVERY
create table proof_of_delivery (
  id uuid default uuid_generate_v4() primary key,
  shipment_id uuid references shipments(id) on delete cascade not null,
  receiver_name text not null,
  signature_url text,
  agent_id uuid references profiles(id) on delete set null,
  device_info text,
  created_at timestamptz default now()
);


-- ROW LEVEL SECURITY

alter table profiles enable row level security;
alter table shipments enable row level security;
alter table shipment_events enable row level security;
alter table proof_of_delivery enable row level security;

-- Profiles RLS
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);
create policy "Admins can update all profiles." on profiles for update using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);

-- Shipments RLS
create policy "Shipments are viewable by everyone" on shipments for select using (true);
create policy "Agents and admins can insert shipments" on shipments for insert with check (
  exists (select 1 from profiles where id = auth.uid() and role in ('agent', 'admin', 'super_admin'))
);
create policy "Agents and admins can update shipments" on shipments for update using (
  exists (select 1 from profiles where id = auth.uid() and role in ('agent', 'admin', 'super_admin'))
);

-- Shipment Events RLS
create policy "Events are viewable by everyone" on shipment_events for select using (true);
create policy "Agents and admins can insert events" on shipment_events for insert with check (
  exists (select 1 from profiles where id = auth.uid() and role in ('agent', 'admin', 'super_admin'))
);

-- Proof of Delivery RLS
create policy "POD are viewable by everyone" on proof_of_delivery for select using (true);
create policy "Agents and admins can insert POD" on proof_of_delivery for insert with check (
  exists (select 1 from profiles where id = auth.uid() and role in ('agent', 'admin', 'super_admin'))
);

-- Storage bucket for POD files
insert into storage.buckets (id, name, public) values ('app-files', 'app-files', false) on conflict do nothing;

create policy "Authenticated users can upload files" on storage.objects for insert with check (
  bucket_id = 'app-files' and auth.role() = 'authenticated'
);
create policy "Users can view own files" on storage.objects for select using (
  bucket_id = 'app-files' and (auth.uid()::text = (storage.foldername(name))[1] or exists(select 1 from profiles where id = auth.uid() and role in ('agent', 'admin', 'super_admin')))
);
