/**
 * CommoditiesWidget - Componentes segregados (SOLID: SRP + ISP)
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCommodities } from "@/hooks/useCommodities";
import type { CommodityPrice } from "@/types/commodities";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { DataErrorFallback } from "@/components/feedback/DataErrorFallback";
import { 
  TrendingUp, TrendingDown, Wheat, RefreshCw, ArrowUpRight, ArrowDownRight
} from "lucide-react";

function PriceChangeIndicator({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${
      isPositive ? 'text-success' : 'text-destructive'
    }`}>
      {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
      {isPositive ? '+' : ''}{value.toFixed(2)}%
    </span>
  );
}

function CommodityRow({ commodity, onSelect, isSelected }: { 
  commodity: CommodityPrice; 
  onSelect: (symbol: string) => void;
  isSelected: boolean;
}) {
  return (
    <div 
      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'bg-primary/10 border border-primary/20' 
          : 'hover:bg-muted/50 border border-transparent'
      }`}
      onClick={() => onSelect(commodity.symbol)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(commodity.symbol)}
      aria-pressed={isSelected}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${
          commodity.change24h >= 0 
            ? 'bg-success/10 text-success' 
            : 'bg-destructive/10 text-destructive'
        }`}>
          {commodity.name.charAt(0)}
        </div>
        <div>
          <div className="font-semibold text-sm">{commodity.name}</div>
          <div className="text-xs text-muted-foreground">{commodity.unit}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-bold text-sm">
          R$ {commodity.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </div>
        <PriceChangeIndicator value={commodity.change24h} />
      </div>
    </div>
  );
}

function MarketSummary({ gainersCount, losersCount }: { gainersCount: number; losersCount: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t">
      <div className="text-center p-2 rounded-lg bg-success/5">
        <div className="flex items-center justify-center gap-1 text-success mb-1">
          <TrendingUp className="w-3 h-3" />
          <span className="text-xs font-medium">Em Alta</span>
        </div>
        <div className="text-sm font-bold">{gainersCount}</div>
      </div>
      <div className="text-center p-2 rounded-lg bg-destructive/5">
        <div className="flex items-center justify-center gap-1 text-destructive mb-1">
          <TrendingDown className="w-3 h-3" />
          <span className="text-xs font-medium">Em Baixa</span>
        </div>
        <div className="text-sm font-bold">{losersCount}</div>
      </div>
    </div>
  );
}

function PriceRange52w({ price, low, high }: { price: number; low: number; high: number }) {
  const range = high - low;
  const position = range > 0 ? Math.min(100, Math.max(0, ((price - low) / range) * 100)) : 50;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Mín 52s: R$ {low.toFixed(2)}</span>
        <span>Máx 52s: R$ {high.toFixed(2)}</span>
      </div>
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <div className="absolute h-full bg-gradient-to-r from-destructive via-warning to-success rounded-full w-full" />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-foreground rounded-full border-2 border-background shadow-sm"
          style={{ left: `${position}%`, transform: 'translate(-50%, -50%)' }}
        />
      </div>
    </div>
  );
}

/** Detail view replacing the chart - shows price history as a table */
function CommodityDetail({ commodity, chartData, prices, selectedSymbol, onSelectSymbol }: {
  commodity: CommodityPrice;
  chartData: { date: string; price: number }[];
  prices: CommodityPrice[];
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
}) {
  const recentData = chartData.slice(-7);
  const maxPrice = Math.max(...recentData.map(d => d.price), 1);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold">{commodity.name}</h4>
          <p className="text-xs text-muted-foreground">{commodity.unit}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold">
            R$ {commodity.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <PriceChangeIndicator value={commodity.change7d} />
          <span className="text-xs text-muted-foreground ml-1">7d</span>
        </div>
      </div>

      {/* Price history as bars */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground">Histórico Recente</div>
        {recentData.map((entry) => {
          const percent = (entry.price / maxPrice) * 100;
          return (
            <div key={entry.date} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-16">
                {entry.date.slice(5)}
              </span>
              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="text-xs font-medium w-20 text-right">
                R$ {entry.price.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>

      <PriceRange52w price={commodity.price} low={commodity.low52w} high={commodity.high52w} />

      <div className="flex flex-wrap gap-1.5 pt-2">
        {prices.map(p => (
          <Button
            key={p.symbol}
            variant={p.symbol === selectedSymbol ? "default" : "outline"}
            size="sm"
            className="text-xs h-7 px-2"
            onClick={() => onSelectSymbol(p.symbol)}
          >
            {p.name}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function CommoditiesWidget() {
  const { data, isLoading, error, refetch } = useCommodities();
  const [selectedSymbol, setSelectedSymbol] = useState<string>("SOJA");

  if (isLoading && !data) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" variant="default" />
        </CardContent>
      </Card>
    );
  }

  if (error && !data) {
    return <DataErrorFallback message={error} onRetry={refetch} />;
  }

  const prices = data?.prices || [];
  const historical = data?.historical || {};
  const selectedCommodity = prices.find(p => p.symbol === selectedSymbol);
  const chartData = historical[selectedSymbol] || [];
  const gainersCount = prices.filter(p => p.change24h > 0).length;
  const losersCount = prices.filter(p => p.change24h < 0).length;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wheat className="h-5 w-5 text-primary" />
            Cotações Agrícolas
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {data?.generatedAt 
                ? new Date(data.generatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) 
                : '--:--'}
            </Badge>
            <Button variant="ghost" size="icon" onClick={refetch} className="h-8 w-8" aria-label="Atualizar cotações">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="prices">
          <TabsList className="grid w-full grid-cols-2 h-9">
            <TabsTrigger value="prices" className="text-xs">Cotações</TabsTrigger>
            <TabsTrigger value="details" className="text-xs">Detalhes</TabsTrigger>
          </TabsList>

          <TabsContent value="prices" className="space-y-1 mt-3">
            {prices.map(commodity => (
              <CommodityRow 
                key={commodity.symbol} 
                commodity={commodity} 
                onSelect={setSelectedSymbol}
                isSelected={commodity.symbol === selectedSymbol}
              />
            ))}
            <MarketSummary gainersCount={gainersCount} losersCount={losersCount} />
          </TabsContent>

          <TabsContent value="details" className="mt-3">
            {selectedCommodity && (
              <CommodityDetail
                commodity={selectedCommodity}
                chartData={chartData}
                prices={prices}
                selectedSymbol={selectedSymbol}
                onSelectSymbol={setSelectedSymbol}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
