import { useState, useEffect } from "react";
import { Send, MessageCircle, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Comment {
  id: string;
  user_id: string;
  lesson_id: number;
  comment: string;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

interface LessonCommentsProps {
  lessonId: number;
}

export function LessonComments({ lessonId }: LessonCommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [lessonId]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("lesson_comments")
        .select(`
          id,
          user_id,
          lesson_id,
          comment,
          created_at,
          profiles!lesson_comments_user_id_fkey(full_name)
        `)
        .eq("lesson_id", lessonId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("lesson_comments")
        .insert({
          user_id: user.id,
          lesson_id: lessonId,
          comment: newComment.trim(),
        });

      if (error) throw error;

      setNewComment("");
      fetchComments();
      toast.success("Comentário adicionado!");
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
      toast.error("Erro ao adicionar comentário");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editText.trim()) return;

    try {
      const { error } = await supabase
        .from("lesson_comments")
        .update({ comment: editText.trim() })
        .eq("id", commentId);

      if (error) throw error;

      setEditingId(null);
      setEditText("");
      fetchComments();
      toast.success("Comentário atualizado!");
    } catch (error) {
      console.error("Erro ao atualizar comentário:", error);
      toast.error("Erro ao atualizar comentário");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from("lesson_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      fetchComments();
      toast.success("Comentário removido!");
    } catch (error) {
      console.error("Erro ao remover comentário:", error);
      toast.error("Erro ao remover comentário");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-gold" />
        <h3 className="text-lg font-semibold text-foreground">
          Comentários ({comments.length})
        </h3>
      </div>

      {/* Form para novo comentário */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <Textarea
              placeholder="Deixe seu comentário sobre esta aula..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!newComment.trim() || isLoading}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isLoading ? "Enviando..." : "Comentar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de comentários */}
      <div className="space-y-4">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-foreground">
                        {comment.profiles?.full_name || "Usuário"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(comment.created_at)}
                      </p>
                    </div>
                    
                    {user?.id === comment.user_id && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingId(comment.id);
                            setEditText(comment.comment);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {editingId === comment.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="min-h-[80px] resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingId(null);
                            setEditText("");
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleEditComment(comment.id)}
                        >
                          Salvar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-foreground whitespace-pre-wrap">
                      {comment.comment}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {comments.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Seja o primeiro a comentar esta aula!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}