import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { MachineDollarMark } from "@/components/MachineDollarMark";
import { toast } from "sonner";

export default function Auth() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Student form
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Admin form
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/sala-de-aulas");
      }
    }
  }, [user, isAdmin, navigate]);

  const cleanupAuthState = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  };

  const handleStudentAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail || !studentPassword) return;

    setIsLoading(true);
    try {
      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });

      if (isSignUp) {
        if (!studentName) {
          toast.error("Nome completo é obrigatório");
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: studentEmail,
          password: studentPassword,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: studentName,
              phone: studentPhone
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          // Add to registrations table (keeping existing functionality)
          await supabase.from('registrations').insert({
            full_name: studentName,
            email: studentEmail,
            phone: studentPhone || ''
          });

          // Add student role
          await supabase.from('user_roles').insert({
            user_id: data.user.id,
            role: 'student'
          });

          toast.success("Conta criada! Verifique seu email para confirmar.");
          window.location.href = '/sala-de-aulas';
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: studentEmail,
          password: studentPassword,
        });

        if (error) throw error;
        if (data.user) {
          window.location.href = '/sala-de-aulas';
        }
      }
    } catch (error: any) {
      console.error('Student auth error:', error);
      if (error.message.includes('Email already registered')) {
        toast.error("Email já cadastrado. Faça login ou use outro email.");
      } else if (error.message.includes('Invalid login credentials')) {
        toast.error("Credenciais inválidas. Verifique email e senha.");
      } else {
        toast.error(error.message || "Erro na autenticação");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) return;

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
          window.location.href = '/admin';
        } else {
          await supabase.auth.signOut();
          toast.error("Acesso negado. Usuário não é administrador.");
        }
      }
    } catch (error: any) {
      console.error('Admin auth error:', error);
      toast.error(error.message || "Erro no login administrativo");
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
            <MachineDollarMark size={60} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-gold bg-clip-text text-transparent">
            Máquina do Dólar
          </h1>
          <p className="text-muted-foreground mt-2">
            Acesse sua conta ou cadastre-se
          </p>
        </div>

        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student">Aluno</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="student">
            <Card>
              <CardHeader>
                <CardTitle>{isSignUp ? "Cadastrar como Aluno" : "Login Aluno"}</CardTitle>
                <CardDescription>
                  {isSignUp 
                    ? "Crie sua conta para acessar as aulas" 
                    : "Acesse suas aulas gratuitas"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleStudentAuth} className="space-y-4">
                  {isSignUp && (
                    <>
                      <div>
                        <Label htmlFor="studentName">Nome Completo *</Label>
                        <Input
                          id="studentName"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="studentPhone">Telefone</Label>
                        <Input
                          id="studentPhone"
                          value={studentPhone}
                          onChange={(e) => setStudentPhone(e.target.value)}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <Label htmlFor="studentEmail">Email</Label>
                    <Input
                      id="studentEmail"
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="studentPassword">Senha</Label>
                    <Input
                      id="studentPassword"
                      type="password"
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Carregando..." : (isSignUp ? "Criar Conta" : "Entrar")}
                  </Button>
                </form>
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-gold hover:underline"
                  >
                    {isSignUp ? "Já tem conta? Faça login" : "Não tem conta? Cadastre-se"}
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Login Administrativo</CardTitle>
                <CardDescription>
                  Acesso restrito para administradores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdminAuth} className="space-y-4">
                  <div>
                    <Label htmlFor="adminEmail">Email Admin</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="adminPassword">Senha</Label>
                    <Input
                      id="adminPassword"
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Carregando..." : "Entrar"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-muted-foreground hover:text-gold transition-colors"
          >
            ← Voltar para página inicial
          </button>
        </div>
      </motion.div>
    </div>
  );
}
