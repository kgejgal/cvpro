-- Kanał pozyskania: pierwszy znacznik ?ref= zapisany na koncie (patrz src/components/SaveSignupRef.tsx).
-- Uruchom w Supabase -> SQL Editor (projekt CVbuilder). Bezpieczne do ponownego uruchomienia.
--
-- Nowa kolumna jest objęta istniejącym uprawnieniem UPDATE tabeli i polityką RLS (auth.uid() = id),
-- więc użytkownik zapisze znacznik tylko na własnym koncie. Trigger guard_profiles_plan dotyczy
-- wyłącznie kolumny plan i niczego tu nie zmienia. Ograniczenie długości chroni przed śmieciami.

alter table public.profiles add column if not exists signup_ref text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_signup_ref_len'
  ) then
    alter table public.profiles
      add constraint profiles_signup_ref_len check (signup_ref is null or char_length(signup_ref) <= 40);
  end if;
end $$;

-- Raport: rejestracje i płatni klienci według kanału (płatny = plan inny niż free).
-- select coalesce(signup_ref, '(brak)') as kanal,
--        count(*) as rejestracje,
--        count(*) filter (where plan <> 'free') as platni
-- from public.profiles
-- group by 1 order by 2 desc;
