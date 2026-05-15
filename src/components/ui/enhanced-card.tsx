import { forwardRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";
import { LucideIcon } from "lucide-react";

interface EnhancedCardProps extends React.ComponentProps<typeof Card> {
  variant?: "default" | "glass" | "gradient" | "bordered" | "floating";
  icon?: LucideIcon;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  loading?: boolean;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "ghost";
  };
}

const EnhancedCard = forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, variant = "default", icon: Icon, badge, badgeVariant, loading, action, children, ...props }, ref) => {
    const variantClasses = {
      default: "bg-card shadow-soft hover-lift",
      glass: "glass shadow-medium hover-glow",
      gradient: "bg-gradient-card shadow-medium hover-lift",
      bordered: "border-2 border-primary/20 bg-card shadow-soft hover:border-primary/40 transition-smooth",
      floating: "bg-card shadow-hard hover:shadow-glow transition-smooth",
    };

    return (
      <Card
        ref={ref}
        className={cn(
          "relative overflow-hidden transition-smooth",
          variantClasses[variant],
          loading && "animate-pulse",
          className
        )}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 bg-muted/50 animate-shimmer" />
        )}
        
        {badge && (
          <Badge 
            variant={badgeVariant} 
            className="absolute top-2 right-2 z-10"
          >
            {badge}
          </Badge>
        )}
        
        {children}
        
        {action && (
          <CardFooter className="pt-0">
            <Button
              variant={action.variant || "default"}
              onClick={action.onClick}
              className="w-full"
              disabled={loading}
            >
              {action.label}
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  }
);

EnhancedCard.displayName = "EnhancedCard";

const EnhancedCardHeader = forwardRef<HTMLDivElement, React.ComponentProps<typeof CardHeader> & { icon?: LucideIcon }>(
  ({ className, icon: Icon, children, ...props }, ref) => (
    <CardHeader ref={ref} className={cn("flex flex-row items-center space-y-0 pb-2", className)} {...props}>
      {Icon && (
        <div className="p-2 rounded-lg bg-primary/10 text-primary mr-3">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div className="flex-1">{children}</div>
    </CardHeader>
  )
);

EnhancedCardHeader.displayName = "EnhancedCardHeader";

const EnhancedCardTitle = forwardRef<HTMLParagraphElement, React.ComponentProps<typeof CardTitle> & { gradient?: boolean }>(
  ({ className, gradient, ...props }, ref) => (
    <CardTitle
      ref={ref}
      className={cn(
        "text-lg font-semibold",
        gradient && "text-gradient",
        className
      )}
      {...props}
    />
  )
);

EnhancedCardTitle.displayName = "EnhancedCardTitle";

const EnhancedCardDescription = forwardRef<HTMLParagraphElement, React.ComponentProps<typeof CardDescription>>(
  ({ className, ...props }, ref) => (
    <CardDescription
      ref={ref}
      className={cn("text-sm text-muted-foreground mt-1", className)}
      {...props}
    />
  )
);

EnhancedCardDescription.displayName = "EnhancedCardDescription";

export {
  EnhancedCard,
  EnhancedCardHeader,
  EnhancedCardTitle,
  EnhancedCardDescription,
  CardContent as EnhancedCardContent,
  CardFooter as EnhancedCardFooter,
};