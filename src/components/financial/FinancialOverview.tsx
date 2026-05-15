import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  Target,
  AlertTriangle
} from "lucide-react";

const performanceData = [
  { month: "Jan", valor: 25000, meta: 30000 },
  { month: "Fev", valor: 32000, meta: 35000 },
  { month: "Mar", valor: 28000, meta: 30000 },
  { month: "Abr", valor: 42000, meta: 40000 },
  { month: "Mai", valor: 38000, meta: 42000 },
  { month: "Jun", valor: 45000, meta: 45000 },
];

const indicators = [
  { title: "Margem Bruta", value: "68.5%", change: +5.2, target: 70, status: "warning" as const, description: "Margem bruta sobre vendas" },
  { title: "Giro do Ativo", value: "1.8x", change: +0.3, target: 2, status: "success" as const, description: "Eficiência no uso dos ativos" },
  { title: "Liquidez Corrente", value: "2.1", change: -0.2, target: 2.5, status: "warning" as const, description: "Capacidade de pagamento a curto prazo" },
  { title: "ROI", value: "24.3%", change: +2.8, target: 25, status: "success" as const, description: "Retorno sobre investimento" }
];

export function FinancialOverview() {
  const maxVal = Math.max(...performanceData.map(d => Math.max(d.valor, d.meta)));

  return (
    <div className="space-y-6">
      <EnhancedCard variant="glass" className="p-6">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Performance vs Meta
            </CardTitle>
            <Badge variant="outline" className="text-primary border-primary">Semestre</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
            {performanceData.map((d) => {
              const valorPercent = (d.valor / maxVal) * 100;
              const metaPercent = (d.meta / maxVal) * 100;
              const atingiu = d.valor >= d.meta;
              return (
                <div key={d.month} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium w-8">{d.month}</span>
                    <span className={atingiu ? "text-success" : "text-warning"}>
                      {atingiu ? "✓ Meta atingida" : `Faltam R$ ${((d.meta - d.valor) / 1000).toFixed(0)}k`}
                    </span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${valorPercent}%` }} />
                    </div>
                    <div
                      className="absolute top-0 h-3 border-r-2 border-dashed border-success"
                      style={{ left: `${metaPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>R$ {(d.valor / 1000).toFixed(0)}k realizado</span>
                    <span>R$ {(d.meta / 1000).toFixed(0)}k meta</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-primary/10">
              <div className="text-2xl font-bold text-primary">R$ 210k</div>
              <div className="text-sm text-muted-foreground">Total Realizado</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-success/10">
              <div className="text-2xl font-bold text-success">R$ 222k</div>
              <div className="text-sm text-muted-foreground">Meta Total</div>
            </div>
          </div>
        </CardContent>
      </EnhancedCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {indicators.map((indicator, index) => (
          <EnhancedCard key={index} variant="bordered" className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">{indicator.title}</h3>
                <p className="text-sm text-muted-foreground">{indicator.description}</p>
              </div>
              <Badge 
                variant={indicator.status === "success" ? "default" : "secondary"}
                className={indicator.status === "success" ? "bg-success text-success-foreground" : ""}
              >
                {indicator.status === "success" ? "✓" : "!"}
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{indicator.value}</span>
                <div className={`flex items-center gap-1 text-sm ${
                  indicator.change > 0 ? "text-success" : "text-destructive"
                }`}>
                  {indicator.change > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {Math.abs(indicator.change)}%
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Meta: {indicator.target}%</span>
                  <span>{Math.round((parseFloat(indicator.value) / indicator.target) * 100)}% da meta</span>
                </div>
                <div className="bg-secondary rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      indicator.status === "success" ? "bg-success" : "bg-warning"
                    }`}
                    style={{ width: `${Math.min((parseFloat(indicator.value) / indicator.target) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </EnhancedCard>
        ))}
      </div>

      <EnhancedCard variant="gradient" className="p-6">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alertas Financeiros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-warning/10 border border-warning/20">
              <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-warning">Liquidez Abaixo da Meta</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  A liquidez corrente está em 2.1, abaixo da meta de 2.5. Considere reduzir despesas ou aumentar o capital de giro.
                </p>
                <Button variant="outline" size="sm" className="mt-2">Ver Detalhes</Button>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-info/10 border border-info/20">
              <TrendingUp className="h-5 w-5 text-info mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-info">Oportunidade de Investimento</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Com ROI de 24.3%, há margem para investimentos em expansão ou modernização.
                </p>
                <Button variant="outline" size="sm" className="mt-2">Explorar</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </EnhancedCard>
    </div>
  );
}
