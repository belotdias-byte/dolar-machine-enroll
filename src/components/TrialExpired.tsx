
import { motion } from "framer-motion";
import { AlertTriangle, Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MachineDollarMark } from "./MachineDollarMark";

export function TrialExpired() {
  const handleContact = () => {
    window.open("mailto:contato@maquinadodolar.com", "_blank");
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
        </div>

        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-red-800">
              Período de Teste Expirado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-red-700">
                <Clock className="w-5 h-5" />
                <span className="font-medium">20 dias de acesso gratuito encerrados</span>
              </div>
              
              <p className="text-muted-foreground">
                Seu período de teste de 20 dias chegou ao fim. Para continuar acessando 
                as aulas e conteúdos exclusivos, entre em contato conosco.
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleContact}
                className="w-full"
                variant="hero"
              >
                <Mail className="w-4 h-4 mr-2" />
                Entrar em Contato
              </Button>
              
              <Button 
                onClick={() => window.location.href = "/"}
                variant="outline"
                className="w-full"
              >
                Voltar à Página Inicial
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Dúvidas? Entre em contato em{" "}
                <a 
                  href="mailto:contato@maquinadodolar.com" 
                  className="text-gold hover:underline"
                >
                  contato@maquinadodolar.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
