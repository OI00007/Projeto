/**
 * ReportGenerator no Dashboard — atalho rápido que leva para a página de Relatórios.
 * A lógica completa de geração de PDF está em src/pages/Reports.tsx
 */
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, BarChart3, TrendingUp, Leaf, DollarSign } from "lucide-react";
import { getCurrentHarvestYear } from "@/lib/dateTime";

const TYPES = [
  { icon: DollarSign, label: "Financeiro",    color: "text-success" },
  { icon: BarChart3,  label: "Sensores",      color: "text-primary" },
  { icon: TrendingUp, label: "Produtividade", color: "text-warning" },
  { icon: Leaf,       label: "Completo",      color: "text-info"    },
];

export function ReportGenerator() {
  const navigate = useNavigate();

  return (
    <Card className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold">Relatórios</h3>
        <span className="text-xs text-muted-foreground">{getCurrentHarvestYear()}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {TYPES.map(({ icon: Icon, label, color }) => (
          <button
            key={label}
            onClick={() => navigate("/reports")}
            className="p-3.5 rounded-xl border border-border hover:border-primary/40 hover:bg-muted/20 text-left transition-all"
          >
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`h-4 w-4 ${color}`} />
              <span className="text-sm font-medium">{label}</span>
            </div>
            <p className="text-xs text-muted-foreground">Gerar PDF →</p>
          </button>
        ))}
      </div>

      <Button
        onClick={() => navigate("/reports")}
        className="w-full gradient-primary text-white"
      >
        <Download className="h-4 w-4 mr-2" />
        Abrir Gerador de Relatórios
      </Button>

      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>Acesse Relatórios para PDFs com dados reais e histórico de downloads.</span>
        </div>
      </div>
    </Card>
  );
}
