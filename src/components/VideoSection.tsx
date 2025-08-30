"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-br from-background via-background-secondary to-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Domine a{" "}
            <span className="bg-gradient-gold bg-clip-text text-transparent italic">
              Máquina do Dólar
            </span>{" "}
            e<br />
            Transforme Seu Conhecimento<br />
            em{" "}
            <span className="bg-gradient-gold bg-clip-text text-transparent italic">
              Lucros Reais!
            </span>
          </h2>
          
          <div className="w-24 h-1 bg-gradient-gold mx-auto mb-8" />
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Assista ao vídeo exclusivo do Mário Bernardo e descubra como estruturar seu negócio digital do zero
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-gradient-to-br from-gray-dark to-background-tertiary rounded-3xl p-2 shadow-elevated">
            <div className="relative aspect-video bg-background rounded-2xl overflow-hidden">
              {!isPlaying ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-background-secondary to-background-tertiary">
                  {/* Video Thumbnail */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-transparent to-transparent" />
                  
                  {/* Play Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsPlaying(true)}
                    className="relative z-10 bg-gradient-gold rounded-full p-6 shadow-gold hover:shadow-elevated transition-all duration-300 group"
                  >
                    <svg
                      className="w-12 h-12 text-gold-foreground ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </motion.button>
                  
                  {/* Video Info Overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4">
                      <h3 className="text-gold font-bold text-lg mb-1">
                        Aula Exclusiva: Primeiros Passos
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Descubra como começar do zero e criar sua primeira fonte de receita online
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <iframe
                  className="w-full h-full"
                  src="https://drive.google.com/file/d/SEU_VIDEO_ID_AQUI/preview"
                  title="Máquina do Dólar - Aula Exclusiva"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
          
          {/* Video Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <p className="text-muted-foreground text-sm italic">
              Sonho em realidade!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};