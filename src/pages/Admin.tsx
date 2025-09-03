import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Mail, Phone, Clock, AlertTriangle, LogOut, MessageSquare, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface Registration {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
}

interface UserWithTrial {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
  trial?: {
    id: string;
    started_at: string;
    ends_at: string;
    time_remaining: string;
    is_expired: boolean;
  };
}

interface LessonComment {
  id: string;
  comment: string;
  created_at: string;
  lesson_id: number;
  user_id: string;
  profiles: {
    full_name: string;
  };
}

export default function Admin() {
  const { signOut } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [usersWithTrials, setUsersWithTrials] = useState<UserWithTrial[]>([]);
  const [lessonComments, setLessonComments] = useState<LessonComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
    
    // Configurar escuta em tempo real para registrations e trials
    const registrationsChannel = supabase
      .channel('registrations-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'registrations'
        },
        (payload) => {
          console.log('Registration atualizada:', payload);
          fetchRegistrations(); // Re-fetch registrations
        }
      )
      .subscribe();

    const trialsChannel = supabase
      .channel('trials-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trials'
        },
        (payload) => {
          console.log('Trial atualizado:', payload);
          fetchUsersWithTrials(); // Re-fetch trials
        }
      )
      .subscribe();

    const commentsChannel = supabase
      .channel('comments-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lesson_comments'
        },
        (payload) => {
          console.log('Comentário atualizado:', payload);
          fetchLessonComments(); // Re-fetch comments
        }
      )
      .subscribe();

    // Ainda manter atualização a cada minuto como fallback
    const interval = setInterval(fetchData, 60000);
    
    return () => {
      supabase.removeChannel(registrationsChannel);
      supabase.removeChannel(trialsChannel);
      supabase.removeChannel(commentsChannel);
      clearInterval(interval);
    };
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchRegistrations(), 
        fetchUsersWithTrials(),
        fetchLessonComments()
      ]);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    setRegistrations(data || []);
  };

  const fetchUsersWithTrials = async () => {
    // Buscar usuários com trials (estudantes registrados)
    const { data, error } = await supabase
      .from("trials")
      .select(`
        id,
        user_id,
        started_at,
        ends_at,
        created_at,
        profiles!inner (
          full_name,
          phone
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar usuários com trials:", error);
      return;
    }

    const usersWithTrialsData: UserWithTrial[] = (data || []).map((trial: any) => {
      let timeRemaining = "";
      let isExpired = false;

      const now = new Date();
      const endDate = new Date(trial.ends_at);
      const diff = endDate.getTime() - now.getTime();

      if (diff <= 0) {
        isExpired = true;
        timeRemaining = "Expirado";
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
          timeRemaining = `${days}d ${hours}h`;
        } else if (hours > 0) {
          timeRemaining = `${hours}h ${minutes}m`;
        } else {
          timeRemaining = `${minutes}m`;
        }
      }

      return {
        id: trial.user_id,
        full_name: trial.profiles?.full_name || "Nome não informado",
        email: "Email disponível no painel do Supabase", 
        phone: trial.profiles?.phone || "Telefone não informado",
        created_at: trial.created_at,
        trial: {
          id: trial.id,
          started_at: trial.started_at,
          ends_at: trial.ends_at,
          time_remaining: timeRemaining,
          is_expired: isExpired
        }
      };
    });

    setUsersWithTrials(usersWithTrialsData);
  };

  const fetchLessonComments = async () => {
    const { data, error } = await supabase
      .from("lesson_comments")
      .select(`
        id,
        comment,
        created_at,
        lesson_id,
        user_id
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar comentários:", error);
      return;
    }

    // Buscar nomes dos usuários separadamente
    const commentsWithUsers: LessonComment[] = [];
    
    for (const comment of data || []) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", comment.user_id)
        .single();
        
      commentsWithUsers.push({
        ...comment,
        profiles: {
          full_name: profileData?.full_name || "Usuário desconhecido"
        }
      });
    }

    setLessonComments(commentsWithUsers);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getExpiredTrialsCount = () => {
    return usersWithTrials.filter(user => user.trial?.is_expired).length;
  };

  const getActiveTrialsCount = () => {
    return usersWithTrials.filter(user => user.trial && !user.trial.is_expired).length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background-secondary border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                Painel Administrativo
              </h1>
              <p className="text-muted-foreground mt-2">
                Máquina do Dólar - Gestão de Inscrições e Períodos de Teste
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={signOut}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Inscrições</CardTitle>
              <Users className="h-4 w-4 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gold">{registrations.length}</div>
              <p className="text-xs text-muted-foreground">
                pessoas cadastradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trials Ativos</CardTitle>
              <Clock className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {getActiveTrialsCount()}
              </div>
              <p className="text-xs text-muted-foreground">
                em período de teste
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trials Expirados</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {getExpiredTrialsCount()}
              </div>
              <p className="text-xs text-muted-foreground">
                período expirado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inscrições Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gold">
                {registrations.filter(r => 
                  new Date(r.created_at).toDateString() === new Date().toDateString()
                ).length}
              </div>
              <p className="text-xs text-muted-foreground">
                hoje
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Trials Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Períodos de Teste - Tempo Real</CardTitle>
          </CardHeader>
          <CardContent>
            {usersWithTrials.length === 0 ? (
              <div className="text-center py-12">
                <Clock size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  Nenhum usuário em período de teste encontrado
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {usersWithTrials.map((user) => (
                  <Card key={user.id} className="bg-background-secondary">
                    <CardContent className="p-4">
                      <div className="grid md:grid-cols-5 gap-4 items-center">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {user.full_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Iniciado: {user.trial ? formatDate(user.trial.started_at) : 'N/A'}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-gold" />
                          <span className="text-sm text-foreground">
                            {user.phone}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock size={16} className={user.trial?.is_expired ? "text-red-500" : "text-green-500"} />
                          <span className={`text-sm font-medium ${user.trial?.is_expired ? "text-red-500" : "text-green-500"}`}>
                            {user.trial?.time_remaining || 'N/A'}
                          </span>
                        </div>
                        
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Termina em:
                          </p>
                          <p className="text-sm text-foreground">
                            {user.trial ? formatDate(user.trial.ends_at) : 'N/A'}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <Badge variant={user.trial?.is_expired ? "destructive" : "default"}>
                            {user.trial?.is_expired ? "Expirado" : "Ativo"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lesson Comments */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Comentários das Aulas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lessonComments.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  Nenhum comentário encontrado
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {lessonComments.map((comment) => (
                  <Card key={comment.id} className="bg-background-secondary">
                    <CardContent className="p-4">
                      <div className="grid md:grid-cols-4 gap-4 items-start">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {comment.profiles?.full_name || "Usuário desconhecido"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(comment.created_at)}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Video size={16} className="text-gold" />
                          <span className="text-sm text-foreground">
                            Módulo {comment.lesson_id}
                          </span>
                        </div>
                        
                        <div className="md:col-span-2">
                          <p className="text-sm text-foreground bg-background rounded-lg p-3">
                            {comment.comment}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Registrations Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Todas as Inscrições (Leads)</CardTitle>
          </CardHeader>
          <CardContent>
            {registrations.length === 0 ? (
              <div className="text-center py-12">
                <Users size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  Nenhuma inscrição encontrada
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {registrations.map((registration) => (
                  <Card key={registration.id} className="bg-background-secondary">
                    <CardContent className="p-4">
                      <div className="grid md:grid-cols-4 gap-4 items-center">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {registration.full_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(registration.created_at)}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-gold" />
                          <span className="text-sm text-foreground">
                            {registration.email}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-gold" />
                          <span className="text-sm text-foreground">
                            {registration.phone}
                          </span>
                        </div>
                        
                        <div className="text-right">
                          <Badge variant="secondary">
                            Lead
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}