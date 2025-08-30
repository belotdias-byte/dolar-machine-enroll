import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useTrial } from "@/hooks/useTrial";
import { Badge } from "@/components/ui/badge";

export function TrialTimer() {
  const { trial, isExpired, timeRemaining } = useTrial();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !trial) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Clock className="w-4 h-4 text-gold" />
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Período de teste:
        </span>
        <Badge 
          variant={isExpired ? "destructive" : "secondary"}
          className={isExpired ? "" : "bg-gold/20 text-gold border-gold/30"}
        >
          {timeRemaining}
        </Badge>
      </div>
    </div>
  );
}