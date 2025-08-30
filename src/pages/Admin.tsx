import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Registration {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
}

export default function Admin() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setRegistrations(data || []);
    } catch (error) {
      console.error("Erro ao buscar registros:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os registros.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
            Máquina do Dólar - Gestão de Inscrições
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
              <Calendar className="h-4 w-4 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gold">
                {registrations.filter(r => {
                  const date = new Date(r.created_at);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return date >= weekAgo;
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">
                últimos 7 dias
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Registrations Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Inscrições Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {registrations.length === 0 ? (
              <div className="text-center py-12">
                <Users size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  Nenhuma inscrição encontrada
                </p>
                <p className="text-muted-foreground text-sm">
                  As inscrições aparecerão aqui conforme forem realizadas
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
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold/10 text-gold">
                            Ativo
                          </span>
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