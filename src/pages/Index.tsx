import { Hero } from "@/components/Hero";
import { Mentor } from "@/components/Mentor";
import { FreeClasses } from "@/components/FreeClasses";
import { VideoSection } from "@/components/VideoSection";
import { Testimonials } from "@/components/Testimonials";
import { CtaFinal } from "@/components/CtaFinal";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
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
