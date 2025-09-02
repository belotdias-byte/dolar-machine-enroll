-- Ativar trigger para criar trials automaticamente quando usuário recebe role 'student'
CREATE OR REPLACE FUNCTION public.create_trial_on_student_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'student' THEN
    INSERT INTO public.trials (user_id)
    VALUES (NEW.user_id)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_create_trial_on_student_role
  AFTER INSERT ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_trial_on_student_role();

-- Criar trials para todos os usuários existentes que ainda não têm trial
INSERT INTO public.trials (user_id)
SELECT DISTINCT ur.user_id
FROM public.user_roles ur
WHERE ur.role = 'student'
  AND NOT EXISTS (
    SELECT 1 FROM public.trials t WHERE t.user_id = ur.user_id
  );

-- Habilitar Realtime para as tabelas necessárias
ALTER TABLE public.registrations REPLICA IDENTITY FULL;
ALTER TABLE public.trials REPLICA IDENTITY FULL;

-- Adicionar tabelas à publicação do Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.registrations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trials;

-- Criar trigger para atualizar updated_at automaticamente na tabela trials
CREATE TRIGGER update_trials_updated_at
  BEFORE UPDATE ON public.trials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Adicionar índices úteis para performance
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON public.registrations(created_at);
CREATE INDEX IF NOT EXISTS idx_trials_user_id ON public.trials(user_id);
CREATE INDEX IF NOT EXISTS idx_trials_ends_at ON public.trials(ends_at);