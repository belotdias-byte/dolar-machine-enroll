"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-hero flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-6 py-2 mb-8"
          >
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
            <span className="text-gold font-medium">Mentoria Exclusiva</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight"
          >
            Ativa a Sua{" "}
            <span className="bg-gradient-gold bg-clip-text text-transparent">
              Máquina do Dólar
            </span>
          </motion.h1>

          {/* Copy */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl text-muted-foreground mb-4 leading-relaxed"
          >
            Mentoria prática com <span className="text-gold font-semibold">Mário Bernardo</span>
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto"
          >
            Aprenda a criar múltiplas fontes de receita online e acesse as primeiras aulas gratuitas sem pagar nada. Estruturas testadas, sem enrolação.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Button 
              variant="hero" 
              size="xl"
              className="animate-glow"
            >
              Acessar Aulas Gratuitas
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-gold rounded-full" />
              <span className="text-sm">100% Gratuito</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-gold rounded-full" />
              <span className="text-sm">Sem Enrolação</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-gold rounded-full" />
              <span className="text-sm">Estruturas Testadas</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};