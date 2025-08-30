
import { useAuth } from "@/hooks/useAuth";
import { useTrial } from "@/hooks/useTrial";
import { Navigate } from "react-router-dom";
import { TrialExpired } from "./TrialExpired";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isLoading, isAdmin } = useAuth();
  const { trial, isLoading: trialLoading, isExpired } = useTrial();

  if (isLoading || trialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  // Se não é admin e o trial expirou, mostrar tela de expiração
  if (!requireAdmin && !isAdmin && isExpired) {
    return <TrialExpired />;
  }

  return <>{children}</>;
}
