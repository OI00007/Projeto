import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { MetricCard } from "@/components/ui/metric-card";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target,
  AlertCircle,
  Calculator,
  PieChart,
  BarChart3,
  Calendar,
  Download,
  Filter,
  Plus,
  Activity
} from "lucide-react";

const kpiData = [
  { title: "EBITDA", value: "R$ 485k", change: 15.3, target: 500000, current: 485000, description: "Lucro antes de juros, impostos, depreciação e amortização", category: "profitability" },
  { title: "Margem EBITDA", value: "32.4%", change: 2.8, target: 35, current: 32.4, description: "Margem operacional ajustada", category: "efficiency" },
  { title: "Liquidez Imediata", value: "1.8", change: -0.2, target: 2.0, current: 1.8, description: "Capacidade de pagamento imediato", category: "liquidity" },
  { title: "Giro do Capital", value: "2.3x", change: 0.4, target: 2.5, current: 2.3, description: "Eficiência no uso do capital investido", category: "efficiency" }
];

const cashFlowProjection = [
  { month: "Jan", entrada: 185000, saida: 145000, saldo: 40000, acumulado: 40000 },
  { month: "Fev", entrada: 205000, saida: 158000, saldo: 47000, acumulado: 87000 },
  { month: "Mar", entrada: 195000, saida: 152000, saldo: 43000, acumulado: 130000 },
  { month: "Abr", entrada: 225000, saida: 168000, saldo: 57000, acumulado: 187000 },
  { month: "Mai", entrada: 240000, saida: 175000, saldo: 65000, acumulado: 252000 },
  { month: "Jun", entrada: 255000, saida: 182000, saldo: 73000, acumulado: 325000 },
  { month: "Jul", entrada: 270000, saida: 190000, saldo: 80000, acumulado: 405000 },
  { month: "Ago", entrada: 245000, saida: 185000, saldo: 60000, acumulado: 465000 },
  { month: "Set", entrada: 285000, saida: 198000, saldo: 87000, acumulado: 552000 },
  { month: "Out", entrada: 295000, saida: 205000, saldo: 90000, acumulado: 642000 },
  { month: "Nov", entrada: 315000, saida: 215000, saldo: 100000, acumulado: 742000 },
  { month: "Dez", entrada: 335000, saida: 225000, saldo: 110000, acumulado: 852000 }
];

const expenseBreakdown = [
  { name: "Insumos Agrícolas", value: 680000, percentage: 35.2 },
  { name: "Mão de Obra", value: 485000, percentage: 25.1 },
  { name: "Combustível", value: 280000, percentage: 14.5 },
  { name: "Manutenção", value: 195000, percentage: 10.1 },
  { name: "Financiamentos", value: 155000, percentage: 8.0 },
  { name: "Administrativo", value: 135000, percentage: 7.0 }
];

const profitabilityTrend = [
  { quarter: "Q1 2023", margem: 28.5, roi: 35.2, ebitda: 420000 },
  { quarter: "Q2 2023", margem: 31.2, roi: 42.1, ebitda: 465000 },
  { quarter: "Q3 2023", margem: 29.8, roi: 38.7, ebitda: 445000 },
  { quarter: "Q4 2023", margem: 33.1, roi: 45.3, ebitda: 495000 },
  { quarter: "Q1 2024", margem: 32.4, roi: 43.8, ebitda: 485000 }
];

const scenarioAnalysis = [
  { scenario: "Otimista", probability: 25, revenue: 2850000, profit: 980000, roi: 52.3, description: "Condições climáticas ideais + preços em alta" },
  { scenario: "Realista", probability: 50, revenue: 2450000, profit: 795000, roi: 43.8, description: "Condições normais de mercado e clima" },
  { scenario: "Pessimista", probability: 25, revenue: 2180000, profit: 590000, roi: 32.1, description: "Adversidades climáticas + preços em baixa" }
];

export function AdvancedFinancialDashboard() {
  const [activeScenario, setActiveScenario] = useState("realista");

  const totalRevenue = 2450000;
  const totalProfit = 795000;
  const profitMargin = (totalProfit / totalRevenue) * 100;
  const maxEntrada = Math.max(...cashFlowProjection.map(m => m.entrada));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold font-display gradient-text-primary mb-2">Centro de Controle Financeiro</h1>
          <p className="text-muted-foreground text-lg">Análise avançada e projeções inteligentes</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-success border-success px-4 py-2">
            <TrendingUp className="w-4 h-4 mr-2" />+{profitMargin.toFixed(1)}% margem
          </Badge>
          <Button variant="outline" className="gap-2"><Filter className="w-4 h-4" />Filtros</Button>
          <Button variant="default" className="gap-2 button-premium"><Download className="w-4 h-4" />Relatório</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <MetricCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            subtitle={kpi.description}
            icon={
              kpi.category === "profitability" ? <DollarSign className="h-5 w-5" /> :
              kpi.category === "efficiency" ? <Target className="h-5 w-5" /> :
              <Activity className="h-5 w-5" />
            }
            trend={{ value: kpi.change, period: "vs trimestre anterior" }}
            variant={kpi.category === "profitability" ? "premium" : kpi.category === "efficiency" ? "success" : "warning"}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fluxo de Caixa - Tabela */}
        <EnhancedCard variant="floating" className="p-6">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Projeção de Fluxo de Caixa</CardTitle>
              <Badge variant="outline">12 meses</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {cashFlowProjection.map((m) => (
                <div key={m.month} className="flex items-center justify-between p-2 rounded-lg border text-sm hover:bg-muted/30 transition-colors">
                  <span className="font-medium w-10">{m.month}</span>
                  <span className="text-success">+R$ {(m.entrada / 1000).toFixed(0)}k</span>
                  <span className="text-destructive">-R$ {(m.saida / 1000).toFixed(0)}k</span>
                  <Badge variant={m.saldo > 60000 ? "default" : "secondary"} className={m.saldo > 60000 ? "bg-success text-success-foreground" : ""}>
                    R$ {(m.saldo / 1000).toFixed(0)}k
                  </Badge>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Entradas Previstas</div>
                <div className="text-lg font-bold text-success">R$ 3.05M</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Saídas Previstas</div>
                <div className="text-lg font-bold text-destructive">R$ 2.20M</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Saldo Final</div>
                <div className="text-lg font-bold text-primary">R$ 852k</div>
              </div>
            </div>
          </CardContent>
        </EnhancedCard>

        {/* Distribuição de Custos - Barras */}
        <EnhancedCard variant="glass" className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2"><PieChart className="h-5 w-5" />Análise de Custos Operacionais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseBreakdown.map((item, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">R$ {(item.value / 1000).toFixed(0)}k</span>
                      <Badge variant="outline" className="text-xs">{item.percentage}%</Badge>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${item.percentage * 2.8}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </EnhancedCard>
      </div>

      {/* Cenários */}
      <EnhancedCard variant="gradient" className="p-6">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5" />Análise de Cenários</CardTitle>
            <Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-2" />Novo Cenário</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scenarioAnalysis.map((scenario, index) => (
              <div 
                key={index}
                className={`p-6 rounded-xl border-2 transition-all cursor-pointer hover:shadow-lg ${
                  activeScenario === scenario.scenario.toLowerCase() ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setActiveScenario(scenario.scenario.toLowerCase())}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">{scenario.scenario}</h3>
                  <Badge variant={scenario.scenario === "Otimista" ? "default" : scenario.scenario === "Realista" ? "secondary" : "outline"}
                    className={scenario.scenario === "Otimista" ? "bg-success text-success-foreground" : ""}>{scenario.probability}%</Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">Receita</span><span className="font-semibold">R$ {(scenario.revenue / 1000000).toFixed(2)}M</span></div>
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">Lucro</span><span className="font-semibold text-success">R$ {(scenario.profit / 1000).toFixed(0)}k</span></div>
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">ROI</span><span className="font-semibold text-primary">{scenario.roi}%</span></div>
                </div>
                <p className="text-xs text-muted-foreground mt-4 leading-relaxed">{scenario.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </EnhancedCard>

      {/* Evolução da Rentabilidade - Tabela */}
      <EnhancedCard variant="bordered" className="p-6">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" />Evolução da Rentabilidade</CardTitle>
            <Badge variant="outline">Últimos 5 trimestres</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium text-muted-foreground">Trimestre</th>
                  <th className="text-right py-3 font-medium text-muted-foreground">Margem</th>
                  <th className="text-right py-3 font-medium text-muted-foreground">ROI</th>
                  <th className="text-right py-3 font-medium text-muted-foreground">EBITDA</th>
                  <th className="py-3 font-medium text-muted-foreground w-32">Performance</th>
                </tr>
              </thead>
              <tbody>
                {profitabilityTrend.map((row, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 font-medium">{row.quarter}</td>
                    <td className="py-3 text-right text-primary font-semibold">{row.margem}%</td>
                    <td className="py-3 text-right text-success font-semibold">{row.roi}%</td>
                    <td className="py-3 text-right font-semibold">R$ {(row.ebitda / 1000).toFixed(0)}k</td>
                    <td className="py-3"><Progress value={row.roi} className="h-2" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-4 border-t">
            <div className="text-center p-4 rounded-lg bg-primary/10">
              <div className="text-lg font-bold text-primary">32.4%</div>
              <div className="text-sm text-muted-foreground">Margem Atual</div>
              <div className="text-xs text-success mt-1">+3.9% vs Q1 2023</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-success/10">
              <div className="text-lg font-bold text-success">43.8%</div>
              <div className="text-sm text-muted-foreground">ROI Atual</div>
              <div className="text-xs text-success mt-1">+8.6% vs Q1 2023</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-info/10">
              <div className="text-lg font-bold text-info">R$ 485k</div>
              <div className="text-sm text-muted-foreground">EBITDA Atual</div>
              <div className="text-xs text-success mt-1">+15.5% vs Q1 2023</div>
            </div>
          </div>
        </CardContent>
      </EnhancedCard>

      {/* Alertas */}
      <EnhancedCard variant="floating" className="p-6">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5" />Alertas e Recomendações Inteligentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-warning">Liquidez em Atenção</h4>
                    <p className="text-sm text-muted-foreground mt-1">Liquidez imediata em 1.8, abaixo da meta de 2.0. Considere otimizar o capital de giro.</p>
                    <Button variant="outline" size="sm" className="mt-2">Analisar Soluções</Button>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-success mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-success">Oportunidade de Expansão</h4>
                    <p className="text-sm text-muted-foreground mt-1">Com ROI de 43.8% e fluxo positivo, há potencial para investimentos em modernização.</p>
                    <Button variant="outline" size="sm" className="mt-2">Explorar Opções</Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-info/10 border border-info/20">
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-info mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-info">Meta EBITDA Próxima</h4>
                    <p className="text-sm text-muted-foreground mt-1">Faltam apenas R$ 15k para atingir a meta de R$ 500k.</p>
                    <Button variant="outline" size="sm" className="mt-2">Ver Plano de Ação</Button>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                <div className="flex items-start gap-3">
                  <Calculator className="h-5 w-5 text-accent mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-accent">Análise Tributária</h4>
                    <p className="text-sm text-muted-foreground mt-1">Revise a estrutura tributária para otimizar a carga fiscal.</p>
                    <Button variant="outline" size="sm" className="mt-2">Consultar Especialista</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </EnhancedCard>
    </div>
  );
}
