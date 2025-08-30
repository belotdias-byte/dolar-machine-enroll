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
    </main>
  );
};

export default Index;
