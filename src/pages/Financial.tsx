import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { EnhancedCard } from "@/components/ui/enhanced-card";
import { MetricCard } from "@/components/ui/metric-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AdvancedFinancialDashboard } from "@/components/financial/AdvancedFinancialDashboard";
import { ExpenseTracker } from "@/components/financial/ExpenseTracker";
import { BudgetPlanner } from "@/components/financial/BudgetPlanner";
import { CashFlowAnalysis } from "@/components/financial/CashFlowAnalysis";
import { ProfitabilityAnalysis } from "@/components/financial/ProfitabilityAnalysis";
import { TransactionManager } from "@/components/financial/TransactionManager";
import { FinancialInsights } from "@/components/financial/FinancialInsights";
import { CommoditiesWidget } from "@/components/dashboard/CommoditiesWidget";
import { ExportButtons } from "@/components/ExportButtons";
import { formatCurrency } from "@/lib/exportUtils";
import { useFinancialData } from "@/contexts/FarmDataContext";
import {
  DollarSign, 
  TrendingUp, 
  PieChart,
  BarChart3,
  Calculator,
  Target,
  Calendar,
  Filter
} from "lucide-react";

const expenseCategories = [
  { name: "Sementes", value: 85000, color: "hsl(var(--primary))" },
  { name: "Fertilizantes", value: 65000, color: "hsl(var(--success))" },
  { name: "Combustível", value: 45000, color: "hsl(var(--warning))" },
  { name: "Mão de obra", value: 120000, color: "hsl(var(--info))" },
  { name: "Manutenção", value: 35000, color: "hsl(var(--accent))" },
  { name: "Outros", value: 25000, color: "hsl(var(--muted-foreground))" }
];

const cropProfitability = [
  { cultura: "Soja", area: 150, custo: 180000, receita: 280000, roi: 55.6 },
  { cultura: "Milho", area: 100, custo: 120000, receita: 180000, roi: 50.0 },
  { cultura: "Algodão", area: 80, custo: 140000, receita: 200000, roi: 42.9 },
  { cultura: "Feijão", area: 50, custo: 75000, receita: 95000, roi: 26.7 }
];

export default function Financial() {
  const { financial, isLoading: contextLoading } = useFinancialData();
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const monthlyData = financial.monthlyData;
  const totalReceita = financial.revenue;
  const totalCustos = financial.expenses;
  const totalLucro = financial.profit;
  const margemLucro = financial.profitMargin;

  const totalExpenses = expenseCategories.reduce((s, c) => s + c.value, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" variant="default" />
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Gestão Financeira"
      subtitle="Controle completo das finanças da sua propriedade rural"
      actions={
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-success border-success px-3 py-1 hidden sm:flex">
            <TrendingUp className="w-4 h-4 mr-2" />
            +{margemLucro.toFixed(1)}% lucro
          </Badge>
          <TransactionManager />
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filtros</span>
          </Button>
          <ExportButtons 
            filename="relatorio_financeiro"
            data={{
              title: "Relatório Financeiro - Fazenda São João",
              subtitle: "Período: Janeiro a Dezembro 2024",
              columns: [
                { header: "Mês", key: "month" },
                { header: "Receita (R$)", key: "receita" },
                { header: "Custos (R$)", key: "custos" },
                { header: "Lucro (R$)", key: "lucro" },
              ],
              data: monthlyData,
              summary: [
                { label: "Receita Total", value: formatCurrency(totalReceita) },
                { label: "Custos Totais", value: formatCurrency(totalCustos) },
                { label: "Lucro Líquido", value: formatCurrency(totalLucro) },
                { label: "Margem de Lucro", value: `${margemLucro.toFixed(1)}%` },
              ]
            }}
          />
        </div>
      }
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Métricas Principais */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <MetricCard
              title="Receita Total"
              value={`R$ ${(totalReceita / 1000).toFixed(0)}k`}
              subtitle="Últimos 12 meses"
              icon={<DollarSign className="h-5 w-5" />}
              trend={{ value: 12.5, period: "vs ano anterior" }}
              variant="success"
            />
            <MetricCard
              title="Custos Totais"
              value={`R$ ${(totalCustos / 1000).toFixed(0)}k`}
              subtitle="Últimos 12 meses"
              icon={<BarChart3 className="h-5 w-5" />}
              trend={{ value: -8.3, period: "vs ano anterior" }}
              variant="warning"
            />
            <MetricCard
              title="Lucro Líquido"
              value={`R$ ${(totalLucro / 1000).toFixed(0)}k`}
              subtitle={`Margem de ${margemLucro.toFixed(1)}%`}
              icon={<TrendingUp className="h-5 w-5" />}
              trend={{ value: 24.7, period: "vs ano anterior" }}
              variant="premium"
            />
            <MetricCard
              title="ROI Médio"
              value="45.8%"
              subtitle="Retorno sobre investimento"
              icon={<Target className="h-5 w-5" />}
              trend={{ value: 5.2, period: "vs ano anterior" }}
              variant="info"
            />
        </div>

        {/* Desktop Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full lg:w-auto grid-cols-6 mb-8 bg-muted/30 backdrop-blur-md shadow-soft">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="overview">
                <PieChart className="w-4 h-4 mr-2" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="cashflow">
                <TrendingUp className="w-4 h-4 mr-2" />
                Fluxo de Caixa
              </TabsTrigger>
              <TabsTrigger value="profitability">
                <Target className="w-4 h-4 mr-2" />
                Rentabilidade
              </TabsTrigger>
              <TabsTrigger value="expenses">
                <Calculator className="w-4 h-4 mr-2" />
                Despesas
              </TabsTrigger>
              <TabsTrigger value="planning">
                <Calendar className="w-4 h-4 mr-2" />
                Planejamento
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Financeiro Avançado */}
            <TabsContent value="dashboard" className="space-y-8 animate-slide-up">
              <FinancialInsights />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <AdvancedFinancialDashboard />
                </div>
                <CommoditiesWidget />
              </div>
            </TabsContent>

            {/* Desktop Visão Geral */}
            <TabsContent value="overview" className="space-y-8 animate-slide-up">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EnhancedCard variant="gradient" className="p-6">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Performance Financeira (6 meses)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {monthlyData.slice(-6).map((m, i) => {
                      const maxVal = Math.max(...monthlyData.slice(-6).map(d => Math.max(d.receita, d.custos)), 1);
                      return (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-sm font-medium">
                            <span>{m.month}</span>
                            <span className={m.lucro >= 0 ? 'text-success' : 'text-destructive'}>
                              R$ {(m.lucro / 1000).toFixed(0)}k
                            </span>
                          </div>
                          <div className="flex gap-1 h-2">
                            <div className="bg-success/70 rounded-full" style={{ width: `${(m.receita / maxVal) * 100}%` }} />
                            <div className="bg-destructive/50 rounded-full" style={{ width: `${(m.custos / maxVal) * 100}%` }} />
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex gap-4 text-xs text-muted-foreground pt-2">
                      <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-success/70" /> Receita</span>
                      <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-destructive/50" /> Custos</span>
                    </div>
                  </CardContent>
                </EnhancedCard>
                
                <EnhancedCard variant="gradient" className="p-6">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Distribuição de Despesas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {expenseCategories.map((category, index) => {
                      const percent = (category.value / totalExpenses) * 100;
                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                              <span>{category.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">R$ {(category.value / 1000).toFixed(0)}k</span>
                              <Badge variant="outline" className="text-xs">{percent.toFixed(1)}%</Badge>
                            </div>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${percent}%`, backgroundColor: category.color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </EnhancedCard>
              </div>

              {/* Desktop Rentabilidade por Cultura */}
              <EnhancedCard variant="glass" className="p-6">
                <CardHeader>
                  <CardTitle className="text-xl font-display">Rentabilidade por Cultura</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {cropProfitability.map((crop, index) => (
                      <div key={index} className="p-6 rounded-xl bg-gradient-card border border-primary/10 hover:shadow-medium transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-display font-semibold text-lg">{crop.cultura}</h4>
                          <Badge 
                            variant={crop.roi > 50 ? "default" : crop.roi > 30 ? "secondary" : "outline"}
                            className={crop.roi > 50 ? "bg-success text-success-foreground" : ""}
                          >
                            ROI: {crop.roi}%
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                          <div>
                            <span className="block font-medium">Área</span>
                            <span>{crop.area} ha</span>
                          </div>
                          <div>
                            <span className="block font-medium">Custo</span>
                            <span>R$ {crop.custo.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="block font-medium">Receita</span>
                            <span>R$ {crop.receita.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="bg-secondary rounded-full h-3 overflow-hidden">
                          <div 
                            className="gradient-primary h-3 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${Math.min(crop.roi, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </EnhancedCard>
            </TabsContent>

            <TabsContent value="cashflow">
              <CashFlowAnalysis />
            </TabsContent>

            <TabsContent value="profitability">
              <ProfitabilityAnalysis />
            </TabsContent>

            <TabsContent value="expenses">
              <ExpenseTracker />
            </TabsContent>

            <TabsContent value="planning">
              <BudgetPlanner />
            </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
