import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Shield, Zap } from "lucide-react";
import { toast } from "sonner";

export const PaymentForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // This will need Stripe configuration
      toast.info("Funcionalidade de pagamento em desenvolvimento. Configure sua Stripe Secret Key.");
      
      // Future implementation:
      // const { data, error } = await supabase.functions.invoke('create-payment');
      // if (error) throw error;
      // window.open(data.url, '_blank');
      
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error("Erro ao processar pagamento");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-background-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Upgrade para o{" "}
            <span className="bg-gradient-gold bg-clip-text text-transparent">
              Acesso Completo
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-12">
            Desbloqueie todas as estratégias avançadas e tenha acesso vitalício ao conteúdo premium
          </p>

          <Card className="bg-card border-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-3">
                <CreditCard className="w-6 h-6 text-gold" />
                Plano Premium
              </CardTitle>
              <CardDescription>
                Acesso completo às estratégias da Máquina do Dólar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gold mb-2">R$ 497</div>
                <div className="text-sm text-muted-foreground">Pagamento único</div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-left">
                  <Zap className="w-5 h-5 text-gold flex-shrink-0" />
                  <span>Acesso vitalício a todas as aulas</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <Zap className="w-5 h-5 text-gold flex-shrink-0" />
                  <span>Estratégias avançadas de monetização</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <Zap className="w-5 h-5 text-gold flex-shrink-0" />
                  <span>Templates e planilhas exclusivas</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <Zap className="w-5 h-5 text-gold flex-shrink-0" />
                  <span>Suporte direto com Mário Bernardo</span>
                </div>
              </div>

              <Button 
                onClick={handlePayment}
                disabled={isLoading}
                size="lg"
                className="w-full bg-gradient-gold hover:bg-gradient-gold/90 text-gold-foreground font-semibold"
              >
                {isLoading ? "Processando..." : "Quero Acesso Completo"}
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                Pagamento 100% seguro via Stripe
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};