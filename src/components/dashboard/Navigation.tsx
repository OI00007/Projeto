import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  MonitorSpeaker,
  DollarSign,
  Wrench,
  Calculator,
  Truck,
  Sprout,
  CircleDot,
} from "lucide-react";

const navItems = [
  { icon: BarChart3, label: "Dashboard", active: true },
  { icon: MonitorSpeaker, label: "Monitoramento" },
  { icon: DollarSign, label: "Financeiro" },
  { icon: Wrench, label: "Equipamentos" },
  { icon: Calculator, label: "Custos/Talhão" },
  { icon: Truck, label: "Frotas" },
];

export function Navigation() {
  return (
    <div className="glass-card p-6 mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary text-primary-foreground">
            <Sprout className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Sistema Argom</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <CircleDot className="h-4 w-4 text-success animate-pulse-gentle" />
            <span className="text-sm text-success font-medium">
              Sistema Online
            </span>
          </div>
          <Badge variant="outline" className="bg-background/50">
            domingo, 24 de agosto de 2025 às 13:04
          </Badge>
        </div>
      </div>

      <nav className="flex flex-wrap gap-2">
        {navItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Button
              key={index}
              variant={item.active ? "default" : "ghost"}
              size="sm"
              className={`flex items-center gap-2 ${
                item.active
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "hover:bg-muted/50"
              }`}
            >
              <IconComponent className="h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </div>
  );
}
