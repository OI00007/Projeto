import { useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { Progress } from "@/components/ui/progress";
import { 
  Target, TrendingUp, DollarSign, BarChart3, Percent, Calculator
} from "lucide-react";

const cropProfitability = [
  { cultura: "Soja", area: 150, receita: 450000, custo: 290000, lucro: 160000, margem: 35.6, roi: 55.2, produtividade: 3.2, precoMedio: 140.62 },
  { cultura: "Milho", area: 100, receita: 280000, custo: 190000, lucro: 90000, margem: 32.1, roi: 47.4, produtividade: 7.5, precoMedio: 37.33 },
  { cultura: "Algodão", area: 80, receita: 320000, custo: 230000, lucro: 90000, margem: 28.1, roi: 39.1, produtividade: 1.8, precoMedio: 2222.22 },
  { cultura: "Feijão", area: 50, receita: 180000, custo: 135000, lucro: 45000, margem: 25.0, roi: 33.3, produtividade: 2.1, precoMedio: 171.43 }
];

const performanceMetrics = [
  { subject: 'ROI', soja: 55, milho: 47, algodao: 39, feijao: 33 },
  { subject: 'Margem', soja: 36, milho: 32, algodao: 28, feijao: 25 },
  { subject: 'Produtividade', soja: 85, milho: 95, algodao: 60, feijao: 70 },
  { subject: 'Preço', soja: 90, milho: 75, algodao: 80, feijao: 65 },
  { subject: 'Eficiência', soja: 88, milho: 82, algodao: 70, feijao: 75 }
];

const monthlyTrends = [
  { mes: "Jan", soja: 25000, milho: 15000, algodao: 12000, feijao: 8000 },
  { mes: "Fev", soja: 28000, milho: 17000, algodao: 14000, feijao: 9000 },
  { mes: "Mar", soja: 32000, milho: 19000, algodao: 16000, feijao: 10000 },
  { mes: "Abr", soja: 35000, milho: 22000, algodao: 18000, feijao: 11000 },
  { mes: "Mai", soja: 38000, milho: 24000, algodao: 20000, feijao: 12000 },
  { mes: "Jun", soja: 42000, milho: 26000, algodao: 22000, feijao: 13000 }
];

export function ProfitabilityAnalysis() {
  const totalReceita = cropProfitability.reduce((acc, curr) => acc + curr.receita, 0);
  const totalCusto = cropProfitability.reduce((acc, curr) => acc + curr.custo, 0);
  const totalLucro = totalReceita - totalCusto;
  const margemGeral = (totalLucro / totalReceita) * 100;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-primary/10"><DollarSign className="h-5 w-5 text-primary" /></div>
            <div><p className="text-sm text-muted-foreground">Receita Total</p><p className="text-xl font-bold">R$ {(totalReceita / 1000).toFixed(0)}k</p></div></div>
        </EnhancedCard>
        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-success/10"><TrendingUp className="h-5 w-5 text-success" /></div>
            <div><p className="text-sm text-muted-foreground">Lucro Total</p><p className="text-xl font-bold text-success">R$ {(totalLucro / 1000).toFixed(0)}k</p></div></div>
        </EnhancedCard>
        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-info/10"><Percent className="h-5 w-5 text-info" /></div>
            <div><p className="text-sm text-muted-foreground">Margem Geral</p><p className="text-xl font-bold text-info">{margemGeral.toFixed(1)}%</p></div></div>
        </EnhancedCard>
        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-warning/10"><Target className="h-5 w-5 text-warning" /></div>
            <div><p className="text-sm text-muted-foreground">ROI Médio</p><p className="text-xl font-bold text-warning">43.8%</p></div></div>
        </EnhancedCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rentabilidade por Cultura */}
        <EnhancedCard variant="bordered" className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" />Rentabilidade por Cultura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {cropProfitability.map((crop, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-lg">{crop.cultura}</h4>
                      <Badge variant={crop.roi > 50 ? "default" : crop.roi > 40 ? "secondary" : "outline"}
                        className={crop.roi > 50 ? "bg-success text-success-foreground" : ""}>ROI: {crop.roi}%</Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-success">R$ {(crop.lucro / 1000).toFixed(0)}k</p>
                      <p className="text-sm text-muted-foreground">{crop.area} ha</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div><p className="text-muted-foreground">Receita</p><p className="font-semibold">R$ {(crop.receita / 1000).toFixed(0)}k</p></div>
                    <div><p className="text-muted-foreground">Custo</p><p className="font-semibold">R$ {(crop.custo / 1000).toFixed(0)}k</p></div>
                    <div><p className="text-muted-foreground">Margem</p><p className="font-semibold">{crop.margem}%</p></div>
                  </div>
                  <Progress value={Math.min(crop.roi, 100)} className="h-2" />
                  <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-muted/30">
                    <div><p className="text-xs text-muted-foreground">Produtividade</p><p className="font-semibold">{crop.produtividade} t/ha</p></div>
                    <div><p className="text-xs text-muted-foreground">Preço Médio</p><p className="font-semibold">R$ {crop.precoMedio}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </EnhancedCard>

        {/* Análise Comparativa - Tabela */}
        <EnhancedCard variant="glass" className="p-6">
          <CardHeader className="pb-4"><CardTitle>Análise Comparativa</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium text-muted-foreground">Métrica</th>
                    <th className="text-center py-2 font-medium text-primary">Soja</th>
                    <th className="text-center py-2 font-medium text-success">Milho</th>
                    <th className="text-center py-2 font-medium text-warning">Algodão</th>
                    <th className="text-center py-2 font-medium text-info">Feijão</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceMetrics.map((metric, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-3 font-medium">{metric.subject}</td>
                      <td className="py-3 text-center"><Badge variant="outline">{metric.soja}</Badge></td>
                      <td className="py-3 text-center"><Badge variant="outline">{metric.milho}</Badge></td>
                      <td className="py-3 text-center"><Badge variant="outline">{metric.algodao}</Badge></td>
                      <td className="py-3 text-center"><Badge variant="outline">{metric.feijao}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </EnhancedCard>
      </div>

      {/* Tendências Mensais */}
      <EnhancedCard variant="floating" className="p-6">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Evolução da Rentabilidade</CardTitle>
            <Badge variant="outline">Últimos 6 meses</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {monthlyTrends.map((m) => {
              const total = m.soja + m.milho + m.algodao + m.feijao;
              return (
                <div key={m.mes} className="p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{m.mes}</span>
                    <span className="font-bold">R$ {(total / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="flex gap-1 h-4 rounded-full overflow-hidden">
                    <div className="bg-primary h-full transition-all" style={{ width: `${(m.soja / total) * 100}%` }} />
                    <div className="bg-success h-full transition-all" style={{ width: `${(m.milho / total) * 100}%` }} />
                    <div className="bg-warning h-full transition-all" style={{ width: `${(m.algodao / total) * 100}%` }} />
                    <div className="bg-info h-full transition-all" style={{ width: `${(m.feijao / total) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-4 gap-4 mt-6">
            {[
              { name: "Soja", color: "primary", growth: "+18.2%" },
              { name: "Milho", color: "success", growth: "+15.7%" },
              { name: "Algodão", color: "warning", growth: "+12.3%" },
              { name: "Feijão", color: "info", growth: "+8.9%" }
            ].map((item) => (
              <div key={item.name} className={`text-center p-3 rounded-lg bg-${item.color}/10`}>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className={`w-3 h-3 rounded-full bg-${item.color}`} />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <div className={`text-lg font-bold text-${item.color}`}>{item.growth}</div>
                <div className="text-xs text-muted-foreground">crescimento</div>
              </div>
            ))}
          </div>
        </CardContent>
      </EnhancedCard>
    </div>
  );
}
