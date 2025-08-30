import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  user_id: string;
  lesson_id: number;
  comment: string;
  created_at: string;
  user_name?: string;
}

interface LessonCommentsProps {
  lessonId: number;
}

export function LessonComments({ lessonId }: LessonCommentsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (lessonId) {
      fetchComments();
    }
  }, [lessonId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('lesson_comments')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao buscar comentários:', error);
        setComments([]);
        return;
      }

      // Buscar profiles separadamente e mapear corretamente
      const commentsWithProfiles = await Promise.all(
        (data || []).map(async (comment) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', comment.user_id)
            .maybeSingle();
          
          return {
            ...comment,
            user_name: profile?.full_name || 'Usuário'
          };
        })
      );

      setComments(commentsWithProfiles);
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('lesson_comments')
        .insert({
          user_id: user.id,
          lesson_id: lessonId,
          comment: newComment.trim()
        });

      if (error) {
        console.error('Erro ao enviar comentário:', error);
        toast({
          title: "Erro",
          description: "Erro ao enviar comentário. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      setNewComment("");
      await fetchComments();
      toast({
        title: "Sucesso",
        description: "Comentário enviado com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao enviar comentário:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar comentário. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('lesson_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Erro ao deletar comentário:', error);
        toast({
          title: "Erro",
          description: "Erro ao deletar comentário. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      await fetchComments();
      toast({
        title: "Sucesso",
        description: "Comentário deletado com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
      toast({
        title: "Erro",
        description: "Erro ao deletar comentário. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          Comentários ({comments.length})
        </h3>
      </div>

      {/* Formulário para novo comentário */}
      {user && (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <Textarea
                placeholder="Deixe seu comentário sobre esta aula..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px] resize-none"
                disabled={isSubmitting}
              />
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={!newComment.trim() || isSubmitting}
                  className="flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Enviando...' : 'Enviar Comentário'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de comentários */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Carregando comentários...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Nenhum comentário ainda. Seja o primeiro a comentar!
            </p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-foreground">
                          {comment.user_name || 'Usuário'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-foreground whitespace-pre-wrap">
                        {comment.comment}
                      </p>
                    </div>
                    
                    {comment.user_id === user?.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}