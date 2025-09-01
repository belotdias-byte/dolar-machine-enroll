import { Hero } from "@/components/Hero";
import { Mentor } from "@/components/Mentor";
import { FreeClasses } from "@/components/FreeClasses";
import { VideoSection } from "@/components/VideoSection";
import { Testimonials } from "@/components/Testimonials";
import { CtaFinal } from "@/components/CtaFinal";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const handleAuth = () => {
    if (user) {
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/sala-de-aulas");
      }
    } else {
      navigate("/auth");
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Login/Access Button */}
      <div className="fixed top-4 right-4 z-50">
        <Button 
          variant="outline" 
          onClick={handleAuth}
          className="bg-background/80 backdrop-blur-sm"
        >
          {user ? (isAdmin ? "Painel Admin" : "Minha Área") : "Entrar / Cadastrar"}
        </Button>
      </div>

      <Hero />
      <Mentor />
      <FreeClasses />
      <VideoSection />
      <Testimonials />
      <CtaFinal />
      
      {/* Discrete admin access link in footer */}
      <footer className="bg-background-secondary py-4 border-t border-border/10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Máquina do Dólar. Todos os direitos reservados.
            <span className="text-xs text-muted-foreground/50 ml-4">
              <button
                onClick={() => navigate("/admin/login")}
                className="hover:text-gold transition-colors"
                style={{ fontSize: '10px' }}
              >
                •
              </button>
            </span>
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
