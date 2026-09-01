-- Run this in Supabase SQL Editor (Project -> SQL Editor -> New query)

-- Orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  status text not null default 'pending', -- pending | paid | shipped | delivered | cancelled | failed
  total_amount numeric not null,
  currency text not null default 'INR',
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  nimbuspost_awb text,
  nimbuspost_courier text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Order line items
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  quantity int not null,
  price numeric not null,
  weight_grams int default 200 -- used for shipment weight calc
);

-- Shipping address per order
create table if not exists shipping_addresses (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  full_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  pincode text not null,
  country text not null default 'India'
);

-- Simple admin flag on profiles (create a profiles table if you don't have one yet)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- Auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security
alter table orders enable row level security;
alter table order_items enable row level security;
alter table shipping_addresses enable row level security;
alter table profiles enable row level security;

-- Users can see only their own orders
create policy "Users read own orders" on orders
  for select using (auth.uid() = user_id);

create policy "Users read own order items" on order_items
  for select using (
    order_id in (select id from orders where user_id = auth.uid())
  );

create policy "Users read own shipping address" on shipping_addresses
  for select using (
    order_id in (select id from orders where user_id = auth.uid())
  );

create policy "Users read own profile" on profiles
  for select using (auth.uid() = id);

-- All writes (order creation, status updates, shipment creation) happen
-- server-side using the service_role key, which bypasses RLS by design.
-- Do NOT add public insert/update policies for these tables.