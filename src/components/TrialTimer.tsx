import { Clock } from "lucide-react";
import { useTrial } from "@/hooks/useTrial";

export function TrialTimer() {
  const { timeRemaining, isExpired, isLoading } = useTrial();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-background-secondary rounded-lg">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Carregando...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
      isExpired 
        ? 'bg-destructive/10 text-destructive' 
        : 'bg-primary/10 text-primary'
    }`}>
      <Clock className="w-4 h-4" />
      <div className="text-sm">
        <span className="font-medium">
          {isExpired ? 'Acesso Expirado' : 'Tempo restante:'}
        </span>
        {!isExpired && (
          <span className="ml-1 font-mono">
            {timeRemaining}
          </span>
        )}
      </div>
    </div>
  );
}