import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { MachineDollarMark } from "@/components/MachineDollarMark";
import { toast } from "sonner";
import { Shield } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (user && isAdmin) {
      navigate("/admin");
    } else if (user && !isAdmin) {
      // If user is logged in but not admin, redirect to student area
      navigate("/sala-de-aulas");
    }
  }, [user, isAdmin, navigate]);

  const cleanupAuthState = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  };

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
      toast.error("Preencha todos os campos");
      return;
    }

    setIsLoading(true);
    try {
      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      });

      if (error) throw error;

      if (data.user) {
        // Check if user has admin role
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (roleData) {
          toast.success("Login administrativo realizado com sucesso!");
          window.location.href = '/admin';
        } else {
          await supabase.auth.signOut();
          toast.error("Acesso negado. Credenciais de administrador inválidas.");
        }
      }
    } catch (error: any) {
      console.error('Admin auth error:', error);
      if (error.message.includes('Invalid login credentials')) {
        toast.error("Credenciais inválidas. Verifique email e senha de administrador.");
      } else {
        toast.error(error.message || "Erro no login administrativo");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <MachineDollarMark size={60} />
              <div className="absolute -top-2 -right-2 bg-gold text-gold-foreground rounded-full p-1">
                <Shield size={16} />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-gold bg-clip-text text-transparent">
            Painel Administrativo
          </h1>
          <p className="text-muted-foreground mt-2">
            Acesso restrito para administradores
          </p>
        </div>

        <Card className="border-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="text-gold" size={20} />
              Login Administrativo
            </CardTitle>
            <CardDescription>
              Credenciais de administrador necessárias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminAuth} className="space-y-4">
              <div>
                <Label htmlFor="adminEmail">Email de Administrador</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="border-gold/30 focus:border-gold"
                  required
                />
              </div>
              <div>
                <Label htmlFor="adminPassword">Senha de Administrador</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="border-gold/30 focus:border-gold"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-gold hover:opacity-90" 
                disabled={isLoading}
              >
                {isLoading ? "Verificando credenciais..." : "Acessar Painel"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center space-y-2">
          <button
            onClick={() => navigate('/auth')}
            className="text-sm text-muted-foreground hover:text-gold transition-colors block"
          >
            ← Voltar para login de estudantes
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-muted-foreground hover:text-gold transition-colors block"
          >
            ← Voltar para página inicial
          </button>
        </div>
      </motion.div>
    </div>
  );
}