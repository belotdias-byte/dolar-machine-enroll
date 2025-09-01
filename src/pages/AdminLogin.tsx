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
import { Shield, UserPlus } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminName, setAdminName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
    
    if (isRegisterMode) {
      // Registration validation
      if (!adminName || !adminEmail || !adminPassword || !confirmPassword) {
        toast.error("Preencha todos os campos");
        return;
      }
      
      if (adminPassword !== confirmPassword) {
        toast.error("As senhas não coincidem");
        return;
      }
      
      if (adminPassword.length < 6) {
        toast.error("A senha deve ter pelo menos 6 caracteres");
        return;
      }
    } else {
      // Login validation
      if (!adminEmail || !adminPassword) {
        toast.error("Preencha todos os campos");
        return;
      }
    }

    setIsLoading(true);
    try {
      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });

      if (isRegisterMode) {
        // Register new admin
        const { data, error } = await supabase.auth.signUp({
          email: adminEmail,
          password: adminPassword,
          options: {
            emailRedirectTo: `${window.location.origin}/admin/login`,
            data: {
              full_name: adminName,
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          // Add admin role
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: data.user.id,
              role: 'admin'
            });

          if (roleError) {
            console.error('Error adding admin role:', roleError);
          }

          toast.success("Administrador registrado com sucesso! Verifique seu email para confirmar a conta.");
          setIsRegisterMode(false);
          setAdminName("");
          setConfirmPassword("");
        }
      } else {
        // Login existing admin
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
      }
    } catch (error: any) {
      console.error('Admin auth error:', error);
      if (error.message.includes('Invalid login credentials')) {
        toast.error("Credenciais inválidas. Verifique email e senha de administrador.");
      } else if (error.message.includes('User already registered')) {
        toast.error("Este email já está registrado. Tente fazer login.");
      } else {
        toast.error(error.message || `Erro no ${isRegisterMode ? 'registro' : 'login'} administrativo`);
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
            {isRegisterMode ? 'Registrar novo administrador' : 'Acesso restrito para administradores'}
          </p>
        </div>

        <Card className="border-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isRegisterMode ? <UserPlus className="text-gold" size={20} /> : <Shield className="text-gold" size={20} />}
              {isRegisterMode ? 'Registro Administrativo' : 'Login Administrativo'}
            </CardTitle>
            <CardDescription>
              {isRegisterMode ? 'Criar nova conta de administrador' : 'Credenciais de administrador necessárias'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminAuth} className="space-y-4">
              {isRegisterMode && (
                <div>
                  <Label htmlFor="adminName">Nome Completo</Label>
                  <Input
                    id="adminName"
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="Digite seu nome completo"
                    className="border-gold/30 focus:border-gold"
                    required
                  />
                </div>
              )}
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
                  placeholder={isRegisterMode ? "Mínimo 6 caracteres" : ""}
                  className="border-gold/30 focus:border-gold"
                  required
                />
              </div>
              {isRegisterMode && (
                <div>
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Digite a senha novamente"
                    className="border-gold/30 focus:border-gold"
                    required
                  />
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full bg-gradient-gold hover:opacity-90" 
                disabled={isLoading}
              >
                {isLoading 
                  ? (isRegisterMode ? "Registrando..." : "Verificando credenciais...")
                  : (isRegisterMode ? "Registrar Administrador" : "Acessar Painel")
                }
              </Button>
              
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(!isRegisterMode);
                    setAdminName("");
                    setConfirmPassword("");
                  }}
                  className="text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  {isRegisterMode 
                    ? "Já tem uma conta? Fazer login" 
                    : "Não tem conta? Registrar administrador"
                  }
                </button>
              </div>
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