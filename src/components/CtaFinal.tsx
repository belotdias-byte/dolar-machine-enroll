"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RegistrationModal } from "@/components/RegistrationModal";
import { PaymentForm } from "@/components/PaymentForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CtaFinal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleRegistrationSuccess = () => {
    navigate("/sala-de-aulas");
  };

  return (
    <>
      <RegistrationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleRegistrationSuccess}
      />
    <section className="py-20 bg-gradient-gold relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-gold-foreground rounded-full" />
        <div className="absolute top-32 right-20 w-16 h-16 border-2 border-gold-foreground rounded-full" />
        <div className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-gold-foreground rounded-full" />
        <div className="absolute bottom-32 right-1/3 w-24 h-24 border-2 border-gold-foreground rounded-full" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl lg:text-6xl font-bold text-gold-foreground mb-8 leading-tight">
            Não Perca Esta{" "}
            <span className="italic">Oportunidade Única!</span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-gold-foreground/90 mb-4 leading-relaxed">
            Acesse agora as 6 aulas gratuitas da Máquina do Dólar
          </p>
          
          <p className="text-lg lg:text-xl text-gold-foreground/80 mb-12 leading-relaxed">
            Comece hoje a construir suas múltiplas fontes de receita online com estratégias comprovadas e sem enrolação
          </p>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            <div className="flex items-center justify-center gap-3 text-gold-foreground">
              <div className="w-6 h-6 bg-gold-foreground rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-semibold">100% Gratuito</span>
            </div>
            
            <div className="flex items-center justify-center gap-3 text-gold-foreground">
              <div className="w-6 h-6 bg-gold-foreground rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-semibold">Acesso Imediato</span>
            </div>
            
            <div className="flex items-center justify-center gap-3 text-gold-foreground">
              <div className="w-6 h-6 bg-gold-foreground rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-semibold">Sem Enrolação</span>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Button 
              variant="cta-final" 
              size="xl"
              className="animate-pulse hover:animate-none"
              onClick={() => setIsModalOpen(true)}
            >
              Quero Acessar Agora
            </Button>
          </motion.div>

          {/* Urgency Text */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-gold-foreground/70 text-sm mt-6"
          >
            ⚡ Conteúdo exclusivo por tempo limitado
          </motion.p>
        </motion.div>
      </div>
    </section>
    
    {/* Payment Form Section */}
    <PaymentForm />
    </>
  );
};