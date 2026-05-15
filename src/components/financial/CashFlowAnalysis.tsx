import { useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpCircle, 
  ArrowDownCircle,
  Calendar,
  DollarSign,
  AlertCircle,
  Target
} from "lucide-react";

const cashFlowData = [
  { mes: "Jan", entradas: 85000, saidas: 72000, saldoAcumulado: 13000 },
  { mes: "Fev", entradas: 92000, saidas: 78000, saldoAcumulado: 27000 },
  { mes: "Mar", entradas: 88000, saidas: 75000, saldoAcumulado: 40000 },
  { mes: "Abr", entradas: 110000, saidas: 85000, saldoAcumulado: 65000 },
  { mes: "Mai", entradas: 105000, saidas: 82000, saldoAcumulado: 88000 },
  { mes: "Jun", entradas: 118000, saidas: 90000, saldoAcumulado: 116000 },
  { mes: "Jul", entradas: 125000, saidas: 95000, saldoAcumulado: 146000 },
  { mes: "Ago", entradas: 120000, saidas: 88000, saldoAcumulado: 178000 },
  { mes: "Set", entradas: 135000, saidas: 102000, saldoAcumulado: 211000 },
  { mes: "Out", entradas: 140000, saidas: 105000, saldoAcumulado: 246000 },
  { mes: "Nov", entradas: 155000, saidas: 112000, saldoAcumulado: 289000 },
  { mes: "Dez", entradas: 165000, saidas: 118000, saldoAcumulado: 336000 }
];

const projectionData = [
  { mes: "Jan 24", realizado: 336000, projetado: 336000 },
  { mes: "Fev 24", realizado: null, projetado: 385000 },
  { mes: "Mar 24", realizado: null, projetado: 425000 },
  { mes: "Abr 24", realizado: null, projetado: 480000 },
  { mes: "Mai 24", realizado: null, projetado: 520000 },
  { mes: "Jun 24", realizado: null, projetado: 575000 }
];

const categories = [
  { name: "Receita de Vendas", type: "entrada", valor: 1240000, percentual: 85.2, variacao: 12.5 },
  { name: "Outras Receitas", type: "entrada", valor: 215000, percentual: 14.8, variacao: -2.1 },
  { name: "Custos Operacionais", type: "saida", valor: 680000, percentual: 58.5, variacao: -5.8 },
  { name: "Despesas Administrativas", type: "saida", valor: 180000, percentual: 15.5, variacao: 3.2 },
  { name: "Investimentos", type: "saida", valor: 302000, percentual: 26.0, variacao: 15.7 }
];

export function CashFlowAnalysis() {
  const totalEntradas = cashFlowData.reduce((acc, curr) => acc + curr.entradas, 0);
  const totalSaidas = cashFlowData.reduce((acc, curr) => acc + curr.saidas, 0);
  const fluxoLiquido = totalEntradas - totalSaidas;
  const saldoFinal = cashFlowData[cashFlowData.length - 1].saldoAcumulado;
  const maxEntrada = Math.max(...cashFlowData.map(d => d.entradas));

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10"><ArrowUpCircle className="h-5 w-5 text-success" /></div>
            <div><p className="text-sm text-muted-foreground">Total Entradas</p><p className="text-xl font-bold text-success">R$ {(totalEntradas / 1000).toFixed(0)}k</p></div>
          </div>
        </EnhancedCard>
        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10"><ArrowDownCircle className="h-5 w-5 text-destructive" /></div>
            <div><p className="text-sm text-muted-foreground">Total Saídas</p><p className="text-xl font-bold text-destructive">R$ {(totalSaidas / 1000).toFixed(0)}k</p></div>
          </div>
        </EnhancedCard>
        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><DollarSign className="h-5 w-5 text-primary" /></div>
            <div><p className="text-sm text-muted-foreground">Fluxo Líquido</p><p className="text-xl font-bold text-primary">R$ {(fluxoLiquido / 1000).toFixed(0)}k</p></div>
          </div>
        </EnhancedCard>
        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info/10"><Target className="h-5 w-5 text-info" /></div>
            <div><p className="text-sm text-muted-foreground">Saldo Atual</p><p className="text-xl font-bold text-info">R$ {(saldoFinal / 1000).toFixed(0)}k</p></div>
          </div>
        </EnhancedCard>
      </div>

      <Tabs defaultValue="fluxo" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fluxo">Fluxo de Caixa</TabsTrigger>
          <TabsTrigger value="categorias">Por Categoria</TabsTrigger>
          <TabsTrigger value="projecao">Projeção</TabsTrigger>
        </TabsList>

        <TabsContent value="fluxo">
          <EnhancedCard variant="floating" className="p-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle>Evolução do Fluxo de Caixa</CardTitle>
                <Badge variant="outline">Últimos 12 meses</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {cashFlowData.map((d) => {
                  const saldo = d.entradas - d.saidas;
                  return (
                    <div key={d.mes} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors text-sm">
                      <span className="font-medium w-10">{d.mes}</span>
                      <div className="flex-1 mx-4">
                        <div className="flex gap-1 h-4">
                          <div className="bg-success/70 rounded-sm h-full transition-all" style={{ width: `${(d.entradas / maxEntrada) * 50}%` }} />
                          <div className="bg-destructive/50 rounded-sm h-full transition-all" style={{ width: `${(d.saidas / maxEntrada) * 50}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-success">+R$ {(d.entradas / 1000).toFixed(0)}k</span>
                        <span className="text-destructive">-R$ {(d.saidas / 1000).toFixed(0)}k</span>
                        <Badge variant={saldo > 30000 ? "default" : "secondary"} className={saldo > 30000 ? "bg-success text-success-foreground" : ""}>
                          R$ {(saldo / 1000).toFixed(0)}k
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </EnhancedCard>
        </TabsContent>

        <TabsContent value="categorias">
          <EnhancedCard variant="bordered" className="p-6">
            <CardHeader className="pb-4"><CardTitle>Análise por Categoria</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map((category, index) => (
                  <div key={index} className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">{category.name}</h4>
                        <Badge variant={category.type === "entrada" ? "default" : "secondary"}>
                          {category.type === "entrada" ? "Entrada" : "Saída"}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">R$ {category.valor.toLocaleString()}</p>
                        <div className={`flex items-center gap-1 text-sm ${category.variacao > 0 ? "text-success" : "text-destructive"}`}>
                          {category.variacao > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {Math.abs(category.variacao)}%
                        </div>
                      </div>
                    </div>
                    <Progress value={category.percentual} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">{category.percentual}% do total</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </EnhancedCard>
        </TabsContent>

        <TabsContent value="projecao">
          <EnhancedCard variant="gradient" className="p-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle>Projeção de Fluxo de Caixa</CardTitle>
                <Badge variant="outline" className="text-primary border-primary">Próximos 6 meses</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {projectionData.map((d, i) => {
                  const maxP = 575000;
                  return (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border text-sm">
                      <span className="font-medium w-16">{d.mes}</span>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-700 ${d.realizado ? 'bg-primary' : 'bg-accent/50'}`}
                            style={{ width: `${((d.realizado || d.projetado) / maxP) * 100}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {d.realizado ? (
                          <Badge className="bg-primary text-primary-foreground">R$ {(d.realizado / 1000).toFixed(0)}k</Badge>
                        ) : (
                          <Badge variant="outline">R$ {(d.projetado / 1000).toFixed(0)}k (proj.)</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 p-4 rounded-lg bg-info/10 border border-info/20">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-info mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-info">Análise da Projeção</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Baseado no crescimento médio dos últimos 6 meses, a projeção indica um saldo de R$ 575k até junho/24.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </EnhancedCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
