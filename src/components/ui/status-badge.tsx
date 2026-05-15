import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: "online" | "offline" | "warning" | "error" | "maintenance";
  children: React.ReactNode;
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({ 
  status, 
  children, 
  showDot = true, 
  className 
}: StatusBadgeProps) {
  const statusStyles = {
    online: "bg-success/10 text-success border-success/30 hover:bg-success/20",
    offline: "bg-muted text-muted-foreground border-border hover:bg-muted/80",
    warning: "bg-warning/10 text-warning border-warning/30 hover:bg-warning/20",
    error: "bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20",
    maintenance: "bg-info/10 text-info border-info/30 hover:bg-info/20",
  };

  const dotStyles = {
    online: "status-online",
    offline: "bg-muted-foreground",
    warning: "status-warning", 
    error: "status-error",
    maintenance: "bg-info animate-pulse-gentle",
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "transition-all duration-300 hover:scale-105",
        statusStyles[status],
        className
      )}
    >
      {showDot && (
        <div className={cn("status-dot mr-1.5", dotStyles[status])} />
      )}
      {children}
    </Badge>
  );
}