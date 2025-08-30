"use client";

import { motion } from "framer-motion";
import { RegistrationModal } from "@/components/RegistrationModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const classes = [
  {
    title: "Fundamentos da Máquina do Dólar",
    description: "Descubra os pilares essenciais para criar sua primeira fonte de receita digital"
  },
  {
    title: "Cria Conta Na Clickbank",
    description: "Como encontrar nichos lucrativos e avaliar o potencial de mercado"
  },
  {
    title: "Como conectar seu Domínio no ClickFunnels",
    description: "Monte do zero um sistema que gera receita de forma automatizada"
  },
  {
    title: "Lançamento do Produto",
    description: "Múltiplas formas de transformar seu conhecimento em dinheiro"
  },
  {
    title: "Comunidade VIP",
    description: "A Academia de Mentoria 2.0 não é apenas um curso, é um espaço de aprendizado coletivo, troca de experiências e crescimento. A Academia de Mentoria 2.0 acredita que ninguém precisa caminhar sozinho e que, com o direcionamento certo, qualquer pessoa pode sair do zero e conquistar resultados consistentes."
  },
  {
    title: "Escalando Resultados",
    description: "Como multiplicar seus ganhos e criar um negócio sustentável"
  }
];

export const FreeClasses = () => {
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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            <span className="bg-gradient-gold bg-clip-text text-transparent">6 Aulas</span>{" "}
            100% Gratuitas
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Conteúdo exclusivo e prático para você começar a construir sua máquina de receita online hoje mesmo
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {classes.map((classItem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-card border-2 border-transparent hover:border-gold/30 rounded-2xl p-6 h-full transition-all duration-300 hover:shadow-gold group-hover:transform group-hover:scale-105">
                {/* Class Number */}
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-gold text-gold-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-gold/30 flex items-center justify-center group-hover:border-gold transition-colors">
                    <div className="w-3 h-3 bg-gold rounded-full group-hover:animate-pulse" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-gold transition-colors">
                  {classItem.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {classItem.description}
                </p>

                {/* Bottom decoration */}
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
                    <span>Aula Gratuita</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA after classes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-card border border-gold/20 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Pronto para começar sua jornada?
            </h3>
            <p className="text-muted-foreground mb-6">
              Acesse agora todas as 6 aulas gratuitas e comece a transformar sua vida financeira
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-gold text-gold-foreground px-8 py-4 rounded-full font-bold tracking-wide uppercase hover:shadow-elevated transition-all duration-300"
            >
              Assistir Agora
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
    </>
  );
};