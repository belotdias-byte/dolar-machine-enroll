import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RegistrationModal = ({ isOpen, onClose, onSuccess }: RegistrationModalProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("registrations")
        .insert([{
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone
        }]);

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Email já cadastrado",
            description: "Este email já foi registrado. Redirecionando para a sala de aulas...",
          });
          onSuccess();
          onClose();
          return;
        }
        throw error;
      }

      toast({
        title: "Cadastro realizado!",
        description: "Bem-vindo! Redirecionando para a sala de aulas...",
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao registrar:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao realizar o cadastro. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-gold bg-clip-text text-transparent">
            Acesse as Aulas Gratuitas
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              placeholder="Seu nome completo"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="seu@email.com"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="(11) 99999-9999"
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            variant="hero"
            disabled={isLoading}
          >
            {isLoading ? "Cadastrando..." : "Acessar Aulas Gratuitas"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};