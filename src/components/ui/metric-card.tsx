import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    period: string;
  };
  variant?: "default" | "success" | "warning" | "info" | "premium";
  className?: string;
  animated?: boolean;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = "default",
  className,
  animated = true,
}: MetricCardProps) {
  const variantStyles = {
    default: "border-border bg-card",
    success: "border-success/30 bg-success/5 hover:bg-success/10",
    warning: "border-warning/30 bg-warning/5 hover:bg-warning/10",
    info: "border-info/30 bg-info/5 hover:bg-info/10",
    premium: "border-primary/30 bg-primary/5 hover:bg-primary/10 shadow-glow",
  };

  const iconStyles = {
    default: "text-muted-foreground bg-muted/20",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10", 
    info: "text-info bg-info/10",
    premium: "text-primary bg-primary/10",
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="w-3 h-3" />;
    if (value < 0) return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return "text-success";
    if (value < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  return (
    <Card className={cn(
      "glass-card p-6 transition-all duration-500 group focus-ring interactive-lift",
      animated && "card-hover animate-fade-in",
      variantStyles[variant],
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
            {title}
          </p>
          <div className="space-y-1">
            <p className={cn(
              "text-3xl font-bold text-foreground transition-all duration-300",
              animated && "group-hover:scale-105 group-hover:text-primary"
            )}>
              {value}
            </p>
            {subtitle && (
              <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                {subtitle}
              </p>
            )}
            {trend && (
              <div className={cn(
                "flex items-center gap-1.5 text-sm font-medium transition-all duration-300",
                getTrendColor(trend.value),
                "group-hover:scale-105"
              )}>
                <span className="transition-transform duration-300 group-hover:scale-110">
                  {getTrendIcon(trend.value)}
                </span>
                <span>
                  {trend.value > 0 ? "+" : ""}{trend.value}% {trend.period}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className={cn(
          "p-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
          iconStyles[variant],
          animated && "animate-float micro-glow"
        )}>
          {icon}
        </div>
      </div>
      
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
    </Card>
  );
}