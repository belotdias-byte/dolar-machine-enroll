-- Tabela de comentários para as aulas
CREATE TABLE public.lesson_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id INTEGER NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilita RLS
ALTER TABLE public.lesson_comments ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view all lesson comments"
  ON public.lesson_comments
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own comments"
  ON public.lesson_comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.lesson_comments
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.lesson_comments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE TRIGGER update_lesson_comments_updated_at
  BEFORE UPDATE ON public.lesson_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índice para melhorar performance
CREATE INDEX lesson_comments_lesson_id_idx ON public.lesson_comments (lesson_id);
CREATE INDEX lesson_comments_user_id_idx ON public.lesson_comments (user_id);