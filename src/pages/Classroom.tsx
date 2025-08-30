import { motion } from "framer-motion";
import { Play, Clock, CheckCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MachineDollarMark } from "@/components/MachineDollarMark";
import { useAuth } from "@/hooks/useAuth";
import { TrialTimer } from "@/components/TrialTimer";
import { LessonComments } from "@/components/LessonComments";
import { useState } from "react";

const modules = [
  {
    id: 1,
    title: "Módulo de Aula 1",
    subtitle: "Fundamentos da Máquina do Dólar",
    duration: "45 min",
    description: "Aprenda os conceitos fundamentais para começar sua jornada digital",
    videoUrl: "https://drive.google.com/file/d/1PM8HFIMCpImct_S9yLJ68rYlLa6YUhNa/preview"
  },
  {
    id: 2,
    title: "Módulo de Aula 2",
    subtitle: "Cria Conta Na Clickbank",
    duration: "38 min",
    description: "Descubra as principais formas de gerar receita na internet",
    videoUrl: "https://drive.google.com/file/d/1qI4wIPaVcVqQmYzE880zg2QBSlS1PsDN/preview"
  },
  {
    id: 3,
    title: "Módulo de Aula 3",
    subtitle: "Como conectar seu Domínio no ClickFunnels",
    duration: "42 min",
    description: "Como atrair e converter seu público-alvo em clientes",
    videoUrl: "https://drive.google.com/file/d/1s-doWVmSrQ2PLKtXnK22dMyEFm12UfBg/preview"
  },
  {
    id: 4,
    title: "Módulo de Aula 4",
    subtitle: "Cria Conta Na Clickbank",
    duration: "35 min",
    description: "Sistematize seus processos para crescer sem trabalhar mais",
    videoUrl: "https://drive.google.com/file/d/1meEScH9Q-Nwxrf1SjIVLhvEKMCKpdDAx/preview"
  },
  {
    id: 5,
    title: "Módulo de Aula 5",
    subtitle: "Lançamento do Produto",
    duration: "30 min",
    description: "Como dar o próximo passo na sua jornada empreendedora",
    videoUrl: "https://drive.google.com/file/d/1meEScH9Q-Nwxrf1SjIVLhvEKMCKpdDAx/preview"
  }
];

export default function Classroom() {
  const { signOut, user } = useAuth();
  const [selectedModule, setSelectedModule] = useState<number | null>(1);

  const selectedModuleData = modules.find(m => m.id === selectedModule);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background-secondary border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MachineDollarMark size={40} />
              <h1 className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                Máquina do Dólar - Sala de Aulas
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <TrialTimer />
              {user && (
                <span className="text-sm text-muted-foreground">
                  Olá, {user.email}
                </span>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={signOut}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Modules List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Módulos do Curso
            </h2>
            
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-card ${
                    selectedModule === module.id 
                      ? 'bg-gold/10 border-gold' 
                      : 'bg-card hover:bg-card/80'
                  }`}
                  onClick={() => setSelectedModule(module.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {module.videoUrl ? (
                          <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                            <Play size={16} className="text-gold-foreground ml-0.5" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                            <Clock size={16} className="text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1">
                          {module.title}
                        </h3>
                        <p className="text-sm text-gold mb-1">
                          {module.subtitle}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {module.duration}
                        </p>
                      </div>
                      
                      {module.videoUrl && (
                        <CheckCircle size={16} className="text-gold flex-shrink-0" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Video Player */}
          <div className="lg:col-span-2">
            {selectedModuleData ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <h2 className="text-3xl font-bold text-foreground">
                    {selectedModuleData.title}
                  </h2>
                  <h3 className="text-xl text-gold">
                    {selectedModuleData.subtitle}
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedModuleData.description}
                  </p>
                </div>

                <div className="bg-card rounded-xl overflow-hidden shadow-card">
                  {selectedModuleData.videoUrl ? (
                    <div className="aspect-video">
                      <iframe
                        src={selectedModuleData.videoUrl}
                        width="100%"
                        height="100%"
                        allow="autoplay"
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-background-secondary flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <Clock size={48} className="text-muted-foreground mx-auto" />
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            Em Breve
                          </h3>
                          <p className="text-muted-foreground">
                            Este módulo será liberado em breve
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Module Info */}
                <div className="bg-card rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Clock size={20} className="text-gold" />
                      <span className="text-foreground">
                        Duração: {selectedModuleData.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="bg-card rounded-xl p-6">
                  <LessonComments lessonId={selectedModuleData.id} />
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-96 bg-card rounded-xl">
                <p className="text-muted-foreground">
                  Selecione um módulo para começar
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}