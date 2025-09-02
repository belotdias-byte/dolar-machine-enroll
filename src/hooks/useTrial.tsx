
import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Trial {
  id: string;
  user_id: string;
  started_at: string;
  ends_at: string;
  created_at: string;
  updated_at: string;
}

export function useTrial() {
  const { user } = useAuth();
  const [trial, setTrial] = useState<Trial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    fetchTrial();
    
    // Configurar escuta em tempo real para mudanças no trial do usuário
    const channel = supabase
      .channel('trial-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trials',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Trial atualizado em tempo real:', payload);
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            setTrial(payload.new as Trial);
          } else if (payload.eventType === 'DELETE') {
            setTrial(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    if (!trial) return;

    const updateTimeRemaining = () => {
      const now = new Date();
      const endDate = new Date(trial.ends_at);
      const diff = endDate.getTime() - now.getTime();

      if (diff <= 0) {
        setIsExpired(true);
        setTimeRemaining("Expirado");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else {
        setTimeRemaining(`${minutes}m`);
      }
    };

    // Atualizar imediatamente
    updateTimeRemaining();

    // Atualizar a cada minuto
    const interval = setInterval(updateTimeRemaining, 60000);

    return () => clearInterval(interval);
  }, [trial]);

  const fetchTrial = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("trials")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Erro ao buscar trial:", error);
        return;
      }

      setTrial(data);
    } catch (error) {
      console.error("Erro ao buscar trial:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    trial,
    isLoading,
    isExpired,
    timeRemaining,
    refetch: fetchTrial
  };
}
