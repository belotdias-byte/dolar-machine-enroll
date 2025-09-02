
-- Limpa qualquer role 'admin' criada com UUID placeholder (se existir)
DELETE FROM public.user_roles
WHERE user_id = '00000000-0000-0000-0000-000000000001'::uuid
  AND role = 'admin';

-- Concede a role 'admin' ao usuário real pelo email informado
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role
FROM auth.users u
WHERE lower(u.email) = lower('chacalabuata@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;
