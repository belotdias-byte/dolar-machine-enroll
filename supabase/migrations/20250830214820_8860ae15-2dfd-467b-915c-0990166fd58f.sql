
-- 1) Tabela de trials (período de teste de 20 dias por usuário)
create table if not exists public.trials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  started_at timestamptz not null default now(),
  ends_at timestamptz not null default (now() + interval '20 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trials_user_unique unique (user_id)
);

-- Índice para consultas por fim do teste
create index if not exists trials_ends_at_idx on public.trials (ends_at);

-- RLS
alter table public.trials enable row level security;

-- Políticas: usuários veem seu próprio trial
create policy "Users can view their own trial"
  on public.trials
  for select
  using (auth.uid() = user_id);

-- Políticas: admins veem todos
create policy "Admins can view all trials"
  on public.trials
  for select
  using (has_role(auth.uid(), 'admin'::app_role));

-- Políticas: usuários podem criar seu próprio trial (não será comum, pois o trigger cria automaticamente)
create policy "Users can create their own trial"
  on public.trials
  for insert
  with check (auth.uid() = user_id);

-- Políticas: somente admins podem atualizar trials (ex.: ajustes manuais)
create policy "Admins can update trials"
  on public.trials
  for update
  using (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para updated_at
drop trigger if exists trg_trials_set_timestamp on public.trials;
create trigger trg_trials_set_timestamp
  before update on public.trials
  for each row execute function public.update_updated_at_column();

-- 2) Função + trigger: ao inserir papel 'student' em user_roles, cria o trial (se não existir)
create or replace function public.create_trial_on_student_role()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  if new.role = 'student' then
    insert into public.trials (user_id)
    values (new.user_id)
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_create_trial_on_student_role on public.user_roles;
create trigger trg_create_trial_on_student_role
  after insert on public.user_roles
  for each row
  execute function public.create_trial_on_student_role();

-- 3) Backfill: cria trials para alunos existentes que ainda não tenham
insert into public.trials (user_id)
select ur.user_id
from public.user_roles ur
where ur.role = 'student'
on conflict (user_id) do nothing;
