import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, AlertCircle, Clock, X } from "lucide-react";

export interface ProgressIndicatorProps {
  steps: {
    id: string;
    title: string;
    description?: string;
    status: "pending" | "current" | "completed" | "error";
  }[];
  orientation?: "horizontal" | "vertical";
  showLabels?: boolean;
  className?: string;
}

export function ProgressIndicator({
  steps,
  orientation = "horizontal",
  showLabels = true,
  className,
}: ProgressIndicatorProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="w-4 h-4" />;
      case "error":
        return <X className="w-4 h-4" />;
      case "current":
        return <Clock className="w-4 h-4" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-current" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success text-success-foreground border-success";
      case "error":
        return "bg-destructive text-destructive-foreground border-destructive";
      case "current":
        return "bg-primary text-primary-foreground border-primary animate-pulse";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  if (orientation === "vertical") {
    return (
      <div className={cn("space-y-4", className)}>
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",
                  getStatusStyles(step.status)
                )}
              >
                {getStatusIcon(step.status)}
              </div>
              {index < steps.length - 1 && (
                <div className="w-px h-8 bg-border mt-2" />
              )}
            </div>
            {showLabels && (
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground">
                  {step.title}
                </h4>
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center", className)}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",
                getStatusStyles(step.status)
              )}
            >
              {getStatusIcon(step.status)}
            </div>
            {showLabels && (
              <div className="mt-2 text-center">
                <div className="text-xs font-medium text-foreground">
                  {step.title}
                </div>
                {step.description && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </div>
                )}
              </div>
            )}
          </div>
          {index < steps.length - 1 && (
            <div className="flex-1 h-px bg-border mx-4" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}