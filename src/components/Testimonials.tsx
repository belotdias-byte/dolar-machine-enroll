"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    text: "Estava travado, sem saber como dar o próximo passo. A mentoria da Máquina do Dólar me deu o conhecimento certo e a confiança para agir. Já fiz minha primeira venda e estou só começando!",
    name: "Ricardo Silva",
    role: "",
    image: "/lovable-uploads/4cb9741f-5323-445e-8616-b42d80f1c78f.png"
  },
  {
    text: "Já tinha feito várias mentorias antes, mas nunca vi resultados concretos. Com o Mário Bernardo, finalmente entendi o que estava fazendo de errado. Agora, minhas vendas online não param de crescer!",
    name: "Fernanda Souza",
    role: ""
  },
  {
    text: "Eu estava completamente perdido e sem noção de como vender online. A mentoria do Mário Bernardo foi a virada de chave. Hoje, estou vendo vendas acontecendo de forma constante.",
    name: "Carlos Oliveira",
    role: ""
  },
  {
    text: "Fiz a mentoria do Mário Bernardo e, pela primeira vez, senti que tudo fez sentido. O passo a passo foi fundamental para eu começar a vender online com segurança. Agora, meu negócio está decolando!",
    name: "Juliana Costa",
    role: ""
  },
  {
    text: "Transformei meu conhecimento em um negócio lucrativo. As aulas gratuitas já mudaram minha perspectiva sobre dinheiro online.",
    name: "Juliana Oliveira",
    role: "Mentora de Negócios"
  },
  {
    text: "Estruturei meu primeiro infoproduto seguindo as orientações e já vendi mais de R$ 50 mil no primeiro mês de lançamento.",
    name: "Pedro Almeida",
    role: "Especialista em Marketing"
  }
];

export const Testimonials = () => {
  return (
    <section className="py-20 bg-background-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            O que dizem os{" "}
            <span className="bg-gradient-gold bg-clip-text text-transparent">
              alunos
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Depoimentos reais de pessoas que transformaram suas vidas financeiras
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-card rounded-2xl p-6 h-full transition-all duration-300 hover:shadow-card group-hover:transform group-hover:scale-105 border border-transparent hover:border-gold/20">
                {/* Quote Icon */}
                <div className="mb-4">
                  <div className="w-8 h-8 bg-gradient-gold rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-gold-foreground"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
                    </svg>
                  </div>
                </div>

                {/* Testimonial Text */}
                <p className="text-muted-foreground italic mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="border-t border-border pt-4">
                  <div className="flex items-center gap-3">
                    {testimonial.image && (
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <div className="font-bold text-gold">
                        {testimonial.name}
                      </div>
                      {testimonial.role && (
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};