-- SUPABASE USER ROLES MIGRATION

-- 1. Add 'email' and 'role' to profiles
alter table public.profiles 
  add column if not exists email text,
  add column if not exists role text default 'User';

-- 2. Update existing profiles with their email from auth.users (if any exist)
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id;

-- 3. Set wycliff.ontiri@gmail.com as Admin
update public.profiles
set role = 'Admin'
where email = 'wycliff.ontiri@gmail.com';

-- 4. Update the trigger to include email on new signups
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email, role)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    new.email,
    case when new.email = 'wycliff.ontiri@gmail.com' then 'Admin' else 'User' end
  );
  return new;
end;
$$;

-- 5. Row Level Security for Role Management
-- Drop existing update policy to replace it
drop policy if exists "Users can update own profile." on public.profiles;

-- Allow users to update their own profile EXCEPT role/email, or allow Admins to update ANY profile.
-- (Simplest approach for this scope: Just allow Admins to update the whole row of anyone, and users their own row)
create policy "Admins can update all profiles."
  on public.profiles for update 
  using ( 
    (select role from public.profiles where id = auth.uid()) = 'Admin' 
    or 
    auth.uid() = id 
  );

-- 6. SECURITY HARDENING: Prevent non-admins from updating their own 'role' or 'email'
create or replace function public.preserve_sensitive_profile_data()
returns trigger language plpgsql security definer as $$
begin
  if (select role from public.profiles where id = auth.uid()) != 'Admin' then
    new.email := old.email;
    new.role := old.role;
  end if;
  return new;
end;
$$;

drop trigger if exists before_profile_update on public.profiles;
create trigger before_profile_update
  before update on public.profiles
  for each row execute procedure public.preserve_sensitive_profile_data();
