import { Cog, DollarSign } from "lucide-react";

interface MachineDollarMarkProps {
  size?: number;
  ariaLabel?: string;
}

export const MachineDollarMark = ({ 
  size = 40, 
  ariaLabel = "Ícone Máquina do Dólar" 
}: MachineDollarMarkProps) => {
  const innerSize = Math.round(size * 0.58);
  const frontSize = Math.round(size * 0.48);

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className="relative rounded-full flex items-center justify-center"
      style={{ 
        width: size, 
        height: size, 
        background: "hsl(var(--gold))",
        boxShadow: "var(--shadow-gold)"
      }}
    >
      <Cog
        size={innerSize}
        className="absolute animate-spin"
        style={{ 
          color: "hsl(var(--gold-foreground))",
          opacity: 0.6,
          animationDuration: "8s"
        }}
      />
      <DollarSign
        size={frontSize}
        className="absolute z-10"
        strokeWidth={3}
        style={{ color: "hsl(var(--background))" }}
      />
    </div>
  );
};