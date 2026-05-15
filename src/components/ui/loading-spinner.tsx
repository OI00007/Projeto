import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  variant?: "default" | "dots" | "pulse" | "bars";
}

export function LoadingSpinner({ size = "md", className, variant = "default" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  if (variant === "dots") {
    return (
      <div className={cn("flex space-x-1", className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "rounded-full bg-primary animate-pulse-gentle",
              size === "sm" ? "w-1 h-1" : size === "md" ? "w-2 h-2" : size === "lg" ? "w-3 h-3" : "w-4 h-4"
            )}
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div
        className={cn(
          "rounded-full bg-primary animate-pulse-gentle",
          sizeClasses[size],
          className
        )}
      />
    );
  }

  if (variant === "bars") {
    return (
      <div className={cn("flex items-end space-x-1", className)}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "bg-primary animate-float",
              size === "sm" ? "w-0.5 h-2" : size === "md" ? "w-1 h-4" : size === "lg" ? "w-1.5 h-6" : "w-2 h-8"
            )}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-muted border-t-primary transition-smooth",
        sizeClasses[size],
        className
      )}
    />
  );
}

// Enhanced loading overlay
export function LoadingOverlay({ 
  isLoading, 
  children, 
  className,
  variant = "default",
  blur = true 
}: { 
  isLoading: boolean; 
  children: React.ReactNode; 
  className?: string;
  variant?: LoadingSpinnerProps["variant"];
  blur?: boolean;
}) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center bg-background/80 z-50 transition-smooth",
          blur && "backdrop-blur-sm"
        )}>
          <LoadingSpinner size="lg" variant={variant} />
        </div>
      )}
    </div>
  );
}

// Page Loading Component
export function PageLoading({ message = "Carregando..." }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-earth">
      <div className="text-center space-y-4">
        <LoadingSpinner size="xl" />
        <p className="text-muted-foreground animate-pulse-gentle">{message}</p>
      </div>
    </div>
  );
}