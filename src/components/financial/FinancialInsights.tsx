import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TrendingUp, TrendingDown, AlertCircle, Brain, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";


interface InsightData {
  summary?: string;
  recommendations?: string[];
  risks?: string[];
  opportunities?: string[];
  [key: string]: unknown;
}

interface ForecastEntry {
  month?: string; period?: string; value?: number; confidence?: number;
  [key: string]: unknown;
}

interface ForecastData {
  forecast: ForecastEntry[];
  [key: string]: unknown;
}

export function FinancialInsights() {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<ForecastData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const { data: summaryData } = await supabase.functions.invoke('financial-insights', {
        body: { type: 'summary', period: 'yearly' }
      });
      const { data: forecastData } = await supabase.functions.invoke('financial-insights', {
        body: { type: 'forecast' }
      });
      if (summaryData?.insights) setInsights(summaryData.insights);
      if (forecastData?.insights) setForecast(forecastData.insights);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInsights(); }, []);

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {insights && (
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Insights Financeiros Inteligentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-gradient-card border border-success/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Receita Total</span>
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <p className="text-2xl font-bold text-success">
                  R$ {insights.summary?.totalIncome?.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-card border border-warning/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Despesas Totais</span>
                  <TrendingDown className="w-4 h-4 text-warning" />
                </div>
                <p className="text-2xl font-bold text-warning">
                  R$ {insights.summary?.totalExpenses?.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-card border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Lucro Líquido</span>
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <p className="text-2xl font-bold">
                  R$ {insights.summary?.profit?.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Margem: {insights.summary?.profitMargin?.toFixed(1)}%
                </p>
              </div>
            </div>

            {insights.categoryBreakdown && Object.keys(insights.categoryBreakdown).length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Despesas por Categoria</h4>
                <div className="space-y-2">
                  {Object.entries(insights.categoryBreakdown)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .slice(0, 5)
                    .map(([category, amount]) => {
                      const total = insights.summary?.totalExpenses || 1;
                      const percentage = ((amount as number) / total) * 100;
                      return (
                        <div key={category} className="flex items-center gap-3">
                          <span className="text-sm min-w-[120px]">{category}</span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium min-w-[80px] text-right">
                            R$ {(amount as number).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                          <Badge variant="outline" className="min-w-[50px] justify-center">
                            {percentage.toFixed(1)}%
                          </Badge>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {forecast?.forecast && (
        <Card className="glass-card border-info/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-info" />
              Previsão Financeira (3 meses)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {forecast.forecast.map((f: ForecastEntry, i: number) => {
                const maxVal = Math.max(f.predictedIncome || 0, f.predictedExpenses || 0, 1);
                return (
                  <div key={i} className="p-3 rounded-lg bg-muted/30 border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{f.month}</span>
                      <Badge variant="outline" className="text-xs">
                        Confiança: {((f.confidence || 0) * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-16">Receita</span>
                        <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                          <div className="h-full bg-success rounded-full" style={{ width: `${(f.predictedIncome / maxVal) * 100}%` }} />
                        </div>
                        <span className="text-xs font-medium w-20 text-right text-success">
                          R$ {(f.predictedIncome / 1000).toFixed(0)}k
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-16">Despesas</span>
                        <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                          <div className="h-full bg-warning rounded-full" style={{ width: `${(f.predictedExpenses / maxVal) * 100}%` }} />
                        </div>
                        <span className="text-xs font-medium w-20 text-right text-warning">
                          R$ {(f.predictedExpenses / 1000).toFixed(0)}k
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-info/20">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-info mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-info mb-1">Análise Preditiva</p>
                  <p className="text-muted-foreground">
                    Baseado nos últimos 6 meses de dados. Confiança média: 
                    <span className="font-semibold ml-1">
                      {((forecast.forecast.reduce((sum: number, f: ForecastEntry) => sum + f.confidence, 0) / forecast.forecast.length) * 100).toFixed(0)}%
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
