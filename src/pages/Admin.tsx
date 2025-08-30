
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Mail, Phone, Clock, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

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

export default function Admin() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [usersWithTrials, setUsersWithTrials] = useState<UserWithTrial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
    
    // Atualizar dados a cada minuto para tempo real
    const interval = setInterval(fetchData, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([fetchRegistrations(), fetchUsersWithTrials()]);
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
    // Buscar usuários com papel de estudante e seus trials
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        id,
        user_id,
        full_name,
        phone,
        created_at,
        trials!inner (
          id,
          started_at,
          ends_at
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar usuários com trials:", error);
      return;
    }

    const usersWithTrialsData: UserWithTrial[] = (data || []).map((user: any) => {
      const trial = user.trials;
      let timeRemaining = "";
      let isExpired = false;

      if (trial) {
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
      }

      return {
        id: user.user_id,
        full_name: user.full_name || "Nome não informado",
        email: "Email não disponível", // Perfil não tem email, seria necessário join com auth.users
        phone: user.phone || "Telefone não informado",
        created_at: user.created_at,
        trial: trial ? {
          id: trial.id,
          started_at: trial.started_at,
          ends_at: trial.ends_at,
          time_remaining: timeRemaining,
          is_expired: isExpired
        } : undefined
      };
    });

    setUsersWithTrials(usersWithTrialsData);
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
          <h1 className="text-3xl font-bold bg-gradient-gold bg-clip-text text-transparent">
            Painel Administrativo
          </h1>
          <p className="text-muted-foreground mt-2">
            Máquina do Dólar - Gestão de Inscrições e Períodos de Teste
          </p>
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

        {/* Registrations Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Todas as Inscrições</CardTitle>
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
