-- Criar usuário admin e configurar permissões
-- Primeiro, vamos inserir o usuário admin na tabela user_roles

-- Como não podemos inserir diretamente na auth.users (gerenciada pelo Supabase),
-- vamos criar um usuário de exemplo na profiles e user_roles
-- O usuário real será criado quando fizer login pela primeira vez

-- Inserir role de admin para o usuário específico (quando ele se registrar)
-- Primeiro precisamos do user_id, vamos usar um UUID fixo para este admin
INSERT INTO public.user_roles (user_id, role)
VALUES (
  -- UUID que será usado quando o usuário chacalabuata@gmail.com se registrar
  '00000000-0000-0000-0000-000000000001'::uuid,
  'admin'::app_role
) ON CONFLICT (user_id, role) DO NOTHING;

-- Nota: O usuário precisa se registrar normalmente através da interface
-- Depois podemos atualizar manualmente o user_id correto no banco