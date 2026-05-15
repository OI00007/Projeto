import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export const PasswordStrengthIndicator = ({ password, className }: PasswordStrengthIndicatorProps) => {
  const getStrength = (password: string) => {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    return score;
  };

  const getStrengthText = (score: number) => {
    if (score < 2) return { text: "Muito fraca", color: "bg-destructive" };
    if (score < 4) return { text: "Fraca", color: "bg-warning" };
    if (score < 5) return { text: "Boa", color: "bg-accent" };
    return { text: "Forte", color: "bg-success" };
  };

  if (!password) return null;

  const strength = getStrength(password);
  const { text, color } = getStrengthText(strength);
  const width = (strength / 6) * 100;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Força da senha:</span>
        <span className="text-xs font-medium">{text}</span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className={cn("h-2 rounded-full transition-all duration-300", color)}
          style={{ width: `${width}%` }}
        />
      </div>
      
      <div className="text-xs text-muted-foreground space-y-1">
        <div className="grid grid-cols-2 gap-2">
          <div className={cn("flex items-center", password.length >= 8 ? "text-success" : "text-muted-foreground")}>
            <span className="mr-1">{password.length >= 8 ? "✓" : "○"}</span>
            8+ caracteres
          </div>
          <div className={cn("flex items-center", /[A-Z]/.test(password) ? "text-success" : "text-muted-foreground")}>
            <span className="mr-1">{/[A-Z]/.test(password) ? "✓" : "○"}</span>
            Maiúscula
          </div>
          <div className={cn("flex items-center", /[a-z]/.test(password) ? "text-success" : "text-muted-foreground")}>
            <span className="mr-1">{/[a-z]/.test(password) ? "✓" : "○"}</span>
            Minúscula
          </div>
          <div className={cn("flex items-center", /[0-9]/.test(password) ? "text-success" : "text-muted-foreground")}>
            <span className="mr-1">{/[0-9]/.test(password) ? "✓" : "○"}</span>
            Número
          </div>
        </div>
      </div>
    </div>
  );
};