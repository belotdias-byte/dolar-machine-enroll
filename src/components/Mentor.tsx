"use client";

import { motion } from "framer-motion";
import marioImage from "@/assets/mentor-new.jpg";

export const Mentor = () => {
  return (
    <section className="py-20 bg-background-secondary">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-gold rounded-3xl blur-2xl opacity-20" />
              <img
                src={marioImage}
                alt="Mário Bernardo - Mentor"
                className="relative w-full max-w-md mx-auto rounded-2xl shadow-elevated"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                Conheça seu{" "}
                <span className="bg-gradient-gold bg-clip-text text-transparent">
                  Mentor
                </span>
              </h2>
              <h3 className="text-2xl font-semibold text-gold">Mário Bernardo</h3>
            </div>

            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                Empresário digital há mais de 10 anos, Mário Bernardo já ajudou milhares de pessoas 
                a construírem seus negócios online do zero.
              </p>
              
              <p>
                Especialista em criação de múltiplas fontes de receita, ele desenvolveu estratégias 
                comprovadas que transformaram a vida financeira de seus mentorados.
              </p>
              
              <p>
                Sua missão é desmistificar o mundo dos negócios digitais e ensinar de forma prática 
                e objetiva, sem enrolação.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gold">10+</div>
                <div className="text-sm text-muted-foreground">Anos de Experiência</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gold">5000+</div>
                <div className="text-sm text-muted-foreground">Alunos Impactados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gold">R$ 1M+</div>
                <div className="text-sm text-muted-foreground">Gerados pelos Alunos</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};