-- ============================================================
-- Daberha — Supabase Schema
-- Run this entire file in the Supabase SQL Editor
-- ============================================================

-- ─── Extensions ───────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─── Enums ────────────────────────────────────────────────
do $$ begin
  create type account_type as enum ('CURRENT', 'SAVINGS');
exception when duplicate_object then null; end $$;

do $$ begin
  create type transaction_type as enum ('INCOME', 'EXPENSE');
exception when duplicate_object then null; end $$;

do $$ begin
  create type recurring_interval as enum ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');
exception when duplicate_object then null; end $$;

do $$ begin
  create type transaction_status as enum ('PENDING', 'COMPLETED', 'FAILED');
exception when duplicate_object then null; end $$;

-- ─── Future enums (Phase 2+) ───────────────────────────────
do $$ begin
  create type goal_type as enum ('PERSONAL', 'SHARED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type goal_status as enum ('ACTIVE', 'COMPLETED', 'PAUSED', 'CANCELLED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type user_level as enum (
    'BEGINNER',   -- مبتدئ
    'ACTIVE',     -- نشيط
    'EXCELLENT',  -- ممتاز
    'PRO',        -- محترف
    'EXPERT'      -- خبير
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type budget_template as enum ('CUSTOM', 'RULE_50_30_20', 'RULE_70_20_10', 'ENVELOPE');
exception when duplicate_object then null; end $$;

-- ─── Tables ───────────────────────────────────────────────

-- Users
create table if not exists users (
  id             text        primary key default gen_random_uuid()::text,
  clerk_user_id  text        not null unique,
  email          text        not null unique,
  name           text        not null,
  image_url      text,

  -- Gamification (Phase 2)
  level          user_level  not null default 'BEGINNER',
  xp_points      integer     not null default 0,
  streak_days    integer     not null default 0,
  streak_shield  boolean     not null default false,
  last_activity  timestamptz,

  -- Onboarding
  onboarding_completed boolean not null default false,
  primary_goal   text,

  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Accounts
create table if not exists accounts (
  id          text          primary key default gen_random_uuid()::text,
  name        text          not null,
  type        account_type  not null,
  balance     numeric(12,2) not null default 0,
  is_default  boolean       not null default false,
  currency    text          not null default 'EGP',

  user_id     text          not null references users(id) on delete cascade,

  created_at  timestamptz   not null default now(),
  updated_at  timestamptz   not null default now()
);

create index if not exists accounts_user_id_idx on accounts(user_id);

-- Transactions
create table if not exists transactions (
  id                   text                not null primary key default gen_random_uuid()::text,
  type                 transaction_type    not null,
  amount               numeric(12,2)       not null,
  description          text,
  category             text                not null,
  receipt_url          text,
  tags                 text[]              default '{}',

  status               transaction_status  not null default 'COMPLETED',

  is_recurring         boolean             not null default false,
  recurring_interval   recurring_interval,
  next_recurring_date  timestamptz,
  last_processed       timestamptz,

  date                 timestamptz         not null,

  user_id              text                not null references users(id) on delete cascade,
  account_id           text                not null references accounts(id) on delete cascade,

  -- Goal contribution (Phase 2)
  goal_id              text,

  created_at           timestamptz         not null default now(),
  updated_at           timestamptz         not null default now()
);

create index if not exists transactions_user_id_idx    on transactions(user_id);
create index if not exists transactions_account_id_idx on transactions(account_id);
create index if not exists transactions_date_idx       on transactions(date desc);

-- Budgets
create table if not exists budgets (
  id                text            primary key default gen_random_uuid()::text,
  amount            numeric(12,2)   not null,
  template          budget_template not null default 'CUSTOM',

  -- 50/30/20 split percentages (stored as integers, e.g. 50, 30, 20)
  needs_percent     integer         not null default 50,
  wants_percent     integer         not null default 30,
  savings_percent   integer         not null default 20,

  user_id           text            not null unique references users(id) on delete cascade,

  last_alert_sent   timestamptz,

  created_at        timestamptz     not null default now(),
  updated_at        timestamptz     not null default now()
);

create index if not exists budgets_user_id_idx on budgets(user_id);

-- ─── Phase 2 Tables (create now, populate later) ──────────

-- Goals
create table if not exists goals (
  id              text          primary key default gen_random_uuid()::text,
  name            text          not null,
  description     text,
  target_amount   numeric(12,2) not null,
  current_amount  numeric(12,2) not null default 0,
  deadline        date,
  emoji           text,
  cover_url       text,

  type            goal_type     not null default 'PERSONAL',
  status          goal_status   not null default 'ACTIVE',

  owner_id        text          not null references users(id) on delete cascade,
  account_id      text          references accounts(id) on delete set null,

  created_at      timestamptz   not null default now(),
  updated_at      timestamptz   not null default now()
);

create index if not exists goals_owner_id_idx on goals(owner_id);

-- Shared goal members
create table if not exists goal_members (
  id        text        primary key default gen_random_uuid()::text,
  goal_id   text        not null references goals(id) on delete cascade,
  user_id   text        not null references users(id) on delete cascade,
  role      text        not null default 'MEMBER', -- OWNER | MEMBER
  joined_at timestamptz not null default now(),
  unique (goal_id, user_id)
);

-- Achievements
create table if not exists achievements (
  id          text        primary key default gen_random_uuid()::text,
  key         text        not null unique, -- e.g. 'first_transaction', 'streak_7'
  name_ar     text        not null,
  name_en     text        not null,
  description_ar text     not null,
  emoji       text        not null,
  xp_reward   integer     not null default 50,
  created_at  timestamptz not null default now()
);

-- User achievements (junction)
create table if not exists user_achievements (
  id             text        primary key default gen_random_uuid()::text,
  user_id        text        not null references users(id) on delete cascade,
  achievement_id text        not null references achievements(id) on delete cascade,
  earned_at      timestamptz not null default now(),
  unique (user_id, achievement_id)
);

create index if not exists user_achievements_user_id_idx on user_achievements(user_id);

-- ─── Triggers: updated_at ────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$ begin
  create trigger users_updated_at        before update on users        for each row execute function update_updated_at();
exception when duplicate_object then null; end $$;
do $$ begin
  create trigger accounts_updated_at     before update on accounts     for each row execute function update_updated_at();
exception when duplicate_object then null; end $$;
do $$ begin
  create trigger transactions_updated_at before update on transactions for each row execute function update_updated_at();
exception when duplicate_object then null; end $$;
do $$ begin
  create trigger budgets_updated_at      before update on budgets      for each row execute function update_updated_at();
exception when duplicate_object then null; end $$;
do $$ begin
  create trigger goals_updated_at        before update on goals        for each row execute function update_updated_at();
exception when duplicate_object then null; end $$;

-- ─── Row Level Security ───────────────────────────────────
-- NOTE: Daberha uses Clerk for auth (not Supabase Auth).
-- RLS is enabled but policies use service-role bypass for server actions.
-- If you later add Supabase Auth, replace the policies below.

alter table users             enable row level security;
alter table accounts          enable row level security;
alter table transactions      enable row level security;
alter table budgets           enable row level security;
alter table goals             enable row level security;
alter table goal_members      enable row level security;
alter table achievements      enable row level security;
alter table user_achievements enable row level security;

-- Service role bypasses RLS — used by Next.js server actions.
-- Public (anon) role gets no access.
create policy "service role only" on users             using (true) with check (true);
create policy "service role only" on accounts          using (true) with check (true);
create policy "service role only" on transactions      using (true) with check (true);
create policy "service role only" on budgets           using (true) with check (true);
create policy "service role only" on goals             using (true) with check (true);
create policy "service role only" on goal_members      using (true) with check (true);
create policy "service role only" on achievements      using (true) with check (true);
create policy "service role only" on user_achievements using (true) with check (true);

-- ─── Seed: Achievements ───────────────────────────────────
insert into achievements (key, name_ar, name_en, description_ar, emoji, xp_reward) values
  ('first_transaction',  'أول خطوة',      'First Step',       'سجّلت أول معاملة مالية',         '🎯', 50),
  ('streak_3',           '٣ أيام متتالية', '3-Day Streak',     'سجّلت ٣ أيام متواصلة',            '🔥', 75),
  ('streak_7',           'أسبوع كامل',    'Full Week',        'حافظت على streak أسبوع كامل',     '💪', 150),
  ('streak_30',          'شهر مستمر',     'Monthly Warrior',  'ثلاثون يوماً بدون انقطاع!',       '🏆', 500),
  ('budget_set',         'مُخطِّط ذكي',  'Smart Planner',    'أنشأت أول ميزانية شهرية',         '📊', 100),
  ('first_goal',         'حالم بجدية',    'Serious Dreamer',  'حددت أول هدف ادخاري',             '🌟', 100),
  ('goal_reached',       'وعد وفيت',      'Promise Keeper',   'وصلت لهدف ادخاري كامل',           '✅', 300),
  ('receipt_scan',       'محقق المصروف',  'Expense Detective','مسحت إيصالاً بالكاميرا',          '📸', 50),
  ('no_spend_day',       'يوم بدون صرف',  'Zero Spend Day',   'مرّ يوم كامل بدون مصروفات',      '🧊', 75),
  ('saved_500',          'ادخرت ٥٠٠ج',    'Saved 500 EGP',    'وصل رصيد التوفير ٥٠٠ جنيه',      '💰', 200),
  ('shared_goal',        'قوة الجماعة',   'Team Player',      'انضممت لهدف مشترك',               '🤝', 150)
on conflict (key) do nothing;

-- ─── RPCs (Stored Procedures) ───────────────────────────────────
-- Create a new transaction and update account balance atomically
create or replace function create_transaction_rpc(
  p_user_id text,
  p_account_id text,
  p_type transaction_type,
  p_amount numeric,
  p_description text,
  p_category text,
  p_receipt_url text,
  p_status transaction_status,
  p_is_recurring boolean,
  p_recurring_interval recurring_interval,
  p_next_recurring_date timestamptz,
  p_date timestamptz
) returns jsonb language plpgsql as $$
declare
  v_transaction_id text;
  v_balance_change numeric;
  v_new_transaction jsonb;
begin
  -- Calculate balance change
  if p_type = 'EXPENSE' then
    v_balance_change := -p_amount;
  else
    v_balance_change := p_amount;
  end if;

  -- Insert transaction
  insert into transactions (
    type, amount, description, category, receipt_url, status, 
    is_recurring, recurring_interval, next_recurring_date, 
    date, user_id, account_id
  ) values (
    p_type, p_amount, p_description, p_category, p_receipt_url, p_status,
    p_is_recurring, p_recurring_interval, p_next_recurring_date,
    p_date, p_user_id, p_account_id
  ) returning id into v_transaction_id;

  -- Update account balance
  update accounts
  set balance = balance + v_balance_change,
      updated_at = now()
  where id = p_account_id and user_id = p_user_id;

  -- Return the created transaction
  select to_jsonb(t) into v_new_transaction from transactions t where id = v_transaction_id;
  return v_new_transaction;
end;
$$;

-- Update transaction and account balance atomically
create or replace function update_transaction_rpc(
  p_transaction_id text,
  p_user_id text,
  p_account_id text,
  p_type transaction_type,
  p_amount numeric,
  p_description text,
  p_category text,
  p_receipt_url text,
  p_status transaction_status,
  p_is_recurring boolean,
  p_recurring_interval recurring_interval,
  p_next_recurring_date timestamptz,
  p_date timestamptz
) returns jsonb language plpgsql as $$
declare
  v_old_type transaction_type;
  v_old_amount numeric;
  v_old_balance_change numeric;
  v_new_balance_change numeric;
  v_net_balance_change numeric;
  v_updated_transaction jsonb;
begin
  -- Get old transaction details
  select type, amount into v_old_type, v_old_amount 
  from transactions 
  where id = p_transaction_id and user_id = p_user_id;

  if not found then
    raise exception 'Transaction not found';
  end if;

  -- Calculate balance changes
  if v_old_type = 'EXPENSE' then
    v_old_balance_change := -v_old_amount;
  else
    v_old_balance_change := v_old_amount;
  end if;

  if p_type = 'EXPENSE' then
    v_new_balance_change := -p_amount;
  else
    v_new_balance_change := p_amount;
  end if;

  v_net_balance_change := v_new_balance_change - v_old_balance_change;

  -- Update transaction
  update transactions set
    type = p_type,
    amount = p_amount,
    description = p_description,
    category = p_category,
    receipt_url = p_receipt_url,
    status = p_status,
    is_recurring = p_is_recurring,
    recurring_interval = p_recurring_interval,
    next_recurring_date = p_next_recurring_date,
    date = p_date,
    updated_at = now()
  where id = p_transaction_id and user_id = p_user_id;

  -- Update account balance
  update accounts
  set balance = balance + v_net_balance_change,
      updated_at = now()
  where id = p_account_id and user_id = p_user_id;

  -- Return the updated transaction
  select to_jsonb(t) into v_updated_transaction from transactions t where id = p_transaction_id;
  return v_updated_transaction;
end;
$$;

-- Bulk delete transactions and update account balances atomically
create or replace function bulk_delete_transactions_rpc(
  p_transaction_ids text[],
  p_user_id text
) returns boolean language plpgsql as $$
declare
  v_rec record;
  v_balance_change numeric;
begin
  -- Loop through the transactions to calculate balance changes
  for v_rec in 
    select account_id, type, amount 
    from transactions 
    where id = any(p_transaction_ids) and user_id = p_user_id
  loop
    if v_rec.type = 'EXPENSE' then
      v_balance_change := v_rec.amount; -- Reverse expense -> add balance
    else
      v_balance_change := -v_rec.amount; -- Reverse income -> subtract balance
    end if;

    -- Update account balance
    update accounts
    set balance = balance + v_balance_change,
        updated_at = now()
    where id = v_rec.account_id and user_id = p_user_id;
  end loop;

  -- Delete the transactions
  delete from transactions 
  where id = any(p_transaction_ids) and user_id = p_user_id;

  return true;
end;
$$;

-- ─── Done ─────────────────────────────────────────────────
