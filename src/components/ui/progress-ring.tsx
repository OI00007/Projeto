import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: "sm" | "md" | "lg";
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "info";
}

export function ProgressRing({
  progress,
  size = "md",
  strokeWidth = 4,
  className,
  children,
  variant = "default"
}: ProgressRingProps) {
  const sizeConfig = {
    sm: { width: 40, height: 40, radius: 16 },
    md: { width: 60, height: 60, radius: 26 },
    lg: { width: 80, height: 80, radius: 36 }
  };

  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const colorConfig = {
    default: "stroke-primary",
    success: "stroke-success",
    warning: "stroke-warning", 
    info: "stroke-info"
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={config.width}
        height={config.height}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.width / 2}
          cy={config.height / 2}
          r={config.radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.3}
        />
        {/* Progress circle */}
        <circle
          cx={config.width / 2}
          cy={config.height / 2}
          r={config.radius}
          className={cn(colorConfig[variant], "transition-all duration-500 ease-out")}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}