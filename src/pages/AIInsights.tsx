/**
 * Página IA & Insights — duas abas:
 * 1. Insights automáticos baseados nos dados reais dos sensores
 * 2. Chat funcional com Argom AI (respostas baseadas na fazenda)
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Brain, TrendingUp, AlertTriangle, Lightbulb, Target,
  Leaf, CloudRain, DollarSign, Sparkles, ChevronRight,
  BarChart3, Thermometer, Droplets, RefreshCw, Send,
  Bot, User, Loader2, MessageCircle, Copy, Check,
} from "lucide-react";
import { useSensorData, useFinancialData } from "@/contexts/FarmDataContext";
import { formatCurrencyBRL } from "@/lib/formatters";
import { getCurrentHarvestYear } from "@/lib/dateTime";
import { processAIMessage, type FarmContext } from "@/lib/aiChat";
import { cn } from "@/lib/utils";

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface ChatMsg {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// ─── Sugestões de perguntas ───────────────────────────────────────────────────
const SUGGESTIONS = [
  "Devo irrigar hoje com base nos sensores?",
  "Como está minha margem de lucro?",
  "Quais sensores precisam de atenção?",
  "Condições para plantio de soja agora",
  "Analise meu resultado financeiro",
  "O que fazer com temperatura alta?",
];

// ─── Balão de mensagem ────────────────────────────────────────────────────────
function ChatBubble({ msg }: { msg: ChatMsg }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === "user";

  function copy() {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={cn("flex gap-3 group", isUser && "flex-row-reverse")}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
        isUser ? "bg-primary text-primary-foreground" : "bg-success/20 text-success"
      )}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={cn("max-w-[80%]", isUser && "items-end flex flex-col")}>
        <div className={cn(
          "rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-muted/60 text-foreground rounded-tl-sm"
        )}>
          {msg.content || <span className="opacity-50 italic">digitando…</span>}
        </div>
        <div className={cn("flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity", isUser && "flex-row-reverse")}>
          <span className="text-xs text-muted-foreground">
            {msg.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </span>
          {!isUser && msg.content && (
            <button onClick={copy} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              {copied ? <><Check className="h-3 w-3 text-success" />Copiado</> : <><Copy className="h-3 w-3" />Copiar</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
const AIInsights = () => {
  const { sensors, metrics } = useSensorData();
  const { financial } = useFinancialData();
  const [activeTab, setActiveTab]   = useState("insights");
  const [refreshing, setRefreshing] = useState(false);

  // ── Chat state ──
  const [messages, setMessages] = useState<ChatMsg[]>([{
    id: "welcome",
    role: "assistant",
    content: "Olá! Sou o Argom AI 🌱\n\nEstou conectado aos dados da sua fazenda em tempo real. Posso analisar sensores, clima, financeiro, plantio e muito mais.\n\nComo posso te ajudar hoje?",
    timestamp: new Date(),
  }]);
  const [chatInput, setChatInput]   = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll ao receber mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const tempSensor     = sensors.find(s => s.type === "temperature");
  const humSensor      = sensors.find(s => s.type === "soil_moisture");
  const criticalSensors = sensors.filter(s => s.status === "critical" || s.status === "warning");

  // ── Enviar mensagem ──
  const sendMessage = useCallback(async (text?: string) => {
    const content = (text ?? chatInput).trim();
    if (!content || isStreaming) return;

    const userMsg: ChatMsg = { id: Date.now().toString(), role: "user", content, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsStreaming(true);

    const assistantId = (Date.now() + 1).toString();
    const placeholder: ChatMsg = { id: assistantId, role: "assistant", content: "", timestamp: new Date() };
    setMessages(prev => [...prev, placeholder]);

    const ctx: FarmContext = {
      sensors: sensors.slice(0, 8).map(s => ({
        name: s.name, type: s.type, value: s.value,
        unit: s.unit, status: s.status, location: s.location,
      })),
      financial: {
        revenue: financial.revenue, expenses: financial.expenses,
        profit: financial.profit, margin: financial.profitMargin.toFixed(1) + "%",
      },
      alerts: criticalSensors.length,
      harvestYear: getCurrentHarvestYear(),
    };

    const history = messages.slice(-8).map(m => ({ role: m.role as "user" | "assistant", content: m.content }));

    try {
      await processAIMessage(content, history, ctx, (partial) => {
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: partial } : m));
      });
    } catch (err) {
      setMessages(prev => prev.map(m =>
        m.id === assistantId ? { ...m, content: `⚠️ Erro ao processar. Tente novamente.` } : m
      ));
    } finally {
      setIsStreaming(false);
      textareaRef.current?.focus();
    }
  }, [chatInput, isStreaming, messages, sensors, financial, criticalSensors]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  // ── Insights dinâmicos baseados nos dados reais ──
  const insights = [
    {
      category: "Sensores",
      icon: BarChart3, color: "text-primary", bg: "bg-primary/10",
      title: `${metrics.activeSensors} sensor(es) online`,
      description: criticalSensors.length > 0
        ? `${criticalSensors.length} sensor(es) requerem atenção: ${criticalSensors.map(s => s.name).join(", ")}`
        : "Todos os sensores operando normalmente.",
      confidence: 95,
    },
    {
      category: "Irrigação",
      icon: Droplets, color: "text-info", bg: "bg-info/10",
      title: humSensor
        ? `Umidade do solo: ${humSensor.value}%`
        : "Sensor de umidade não encontrado",
      description: humSensor
        ? humSensor.value < 35 ? "🚿 Irrigação urgente recomendada!"
          : humSensor.value < 55 ? "💧 Irrigação leve nos próximos dias."
          : "✅ Umidade adequada. Monitorar normalmente."
        : "Configure um sensor de umidade para recomendações de irrigação.",
      confidence: 88,
    },
    {
      category: "Financeiro",
      icon: DollarSign,
      color: financial.profit >= 0 ? "text-success" : "text-destructive",
      bg: financial.profit >= 0 ? "bg-success/10" : "bg-destructive/10",
      title: `Lucro: ${formatCurrencyBRL(financial.profit)}`,
      description: financial.revenue > 0
        ? `Receita: ${formatCurrencyBRL(financial.revenue)} · Margem: ${financial.profitMargin.toFixed(1)}%`
        : "Registre transações no módulo Financeiro para ver análises.",
      confidence: 92,
    },
    {
      category: "Temperatura",
      icon: Thermometer, color: "text-warning", bg: "bg-warning/10",
      title: tempSensor ? `Temperatura: ${tempSensor.value}°C` : "Sem sensor de temperatura",
      description: tempSensor
        ? tempSensor.value > 35 ? "⚠️ Temperatura elevada — estresse hídrico possível."
          : tempSensor.value < 10 ? "❄️ Risco de geada — proteja as culturas."
          : "✅ Temperatura dentro da faixa ideal."
        : "Configure um sensor de temperatura para alertas climáticos.",
      confidence: 80,
    },
  ];

  return (
    <DashboardLayout title="IA & Insights" subtitle="Análise inteligente e chat com Argom AI">
      <div className="max-w-6xl mx-auto space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 max-w-xs">
            <TabsTrigger value="insights" className="gap-2">
              <Brain className="h-4 w-4" />Insights
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-2">
              <MessageCircle className="h-4 w-4" />Chat IA
            </TabsTrigger>
          </TabsList>

          {/* ── ABA INSIGHTS ── */}
          <TabsContent value="insights" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {insights.map((ins, i) => {
                const Icon = ins.icon;
                return (
                  <Card key={i} className="border-border/50 hover:shadow-md transition-shadow">
                    <CardContent className="pt-5 pb-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-xl ${ins.bg} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`h-5 w-5 ${ins.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Badge variant="secondary" className="text-xs">{ins.category}</Badge>
                            <span className="text-xs text-muted-foreground">{ins.confidence}% confiança</span>
                          </div>
                          <h4 className="font-semibold text-sm mb-1">{ins.title}</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-3">{ins.description}</p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Confiança</span>
                              <span className={ins.color}>{ins.confidence}%</span>
                            </div>
                            <Progress value={ins.confidence} className="h-1.5" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-warning" />
                    Recomendações
                  </CardTitle>
                  <Button size="sm" variant="ghost" onClick={async () => { setRefreshing(true); await new Promise(r=>setTimeout(r,800)); setRefreshing(false); }} disabled={refreshing} className="h-8 gap-1.5 text-xs">
                    <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} />
                    Atualizar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { icon: Leaf, text: criticalSensors.length > 0 ? `Verifique em campo: ${criticalSensors[0]?.name}` : "Todos os sensores em ordem — faça ronda semanal" },
                  { icon: Droplets, text: humSensor && humSensor.value < 50 ? "Irrigação recomendada nas próximas horas" : "Umidade do solo adequada" },
                  { icon: Target, text: `${getCurrentHarvestYear()} — monitore preços das commodities` },
                  { icon: TrendingUp, text: financial.profit > 0 ? "Resultado positivo — considere reinvestir em melhorias" : "Revise as categorias de maior despesa" },
                ].map((rec, i) => {
                  const Icon = rec.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                      <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{rec.text}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Sugestões para ir ao chat */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="py-4">
                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Pergunte ao Argom AI:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SUGGESTIONS.slice(0, 4).map(q => (
                    <button key={q} onClick={() => { setActiveTab("chat"); setTimeout(() => sendMessage(q), 100); }}
                      className="text-left text-xs p-2.5 rounded-xl border bg-background hover:bg-primary/5 hover:border-primary/30 transition-all flex items-start gap-2">
                      <ChevronRight className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />{q}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── ABA CHAT ── */}
          <TabsContent value="chat" className="mt-6">
            <Card className="flex flex-col" style={{ height: "600px" }}>
              {/* Header */}
              <CardHeader className="pb-3 border-b flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-success/20 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">Argom AI</CardTitle>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
                      Assistente agrícola · dados da fazenda em tempo real
                    </p>
                  </div>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {messages.length - 1} mensagem{messages.length !== 2 ? "s" : ""}
                  </Badge>
                </div>
              </CardHeader>

              {/* Mensagens */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                {messages.map(msg => <ChatBubble key={msg.id} msg={msg} />)}
                {isStreaming && messages[messages.length - 1]?.content === "" && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center"><Bot className="h-4 w-4 text-success" /></div>
                    <div className="bg-muted/60 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                      {[0,1,2].map(i => <span key={i} className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}} />)}
                    </div>
                  </div>
                )}
              </div>

              {/* Sugestões — apenas quando chat está vazio */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2 border-t pt-2 flex-shrink-0">
                  <p className="text-xs text-muted-foreground mb-1.5">Sugestões:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTIONS.slice(0, 3).map(q => (
                      <button key={q} onClick={() => sendMessage(q)}
                        className="text-xs px-2.5 py-1 rounded-full border bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="px-4 pb-4 border-t pt-3 flex-shrink-0">
                <div className="flex gap-2 items-end">
                  <Textarea
                    ref={textareaRef}
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Pergunte sobre sua fazenda… (Enter envia, Shift+Enter nova linha)"
                    className="resize-none min-h-[44px] max-h-32 text-sm"
                    rows={1}
                    disabled={isStreaming}
                  />
                  <Button onClick={() => sendMessage()} disabled={!chatInput.trim() || isStreaming}
                    size="icon" className="h-11 w-11 flex-shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
                    {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  O Argom AI usa os dados reais dos seus sensores e financeiro para responder.
                </p>
              </div>
            </Card>

            {/* Mais sugestões */}
            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-warning" />Perguntas frequentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SUGGESTIONS.map(q => (
                    <button key={q} onClick={() => sendMessage(q)}
                      className="text-left text-xs p-3 rounded-xl border bg-muted/20 hover:bg-primary/5 hover:border-primary/30 transition-all flex items-start gap-2">
                      <ChevronRight className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />{q}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AIInsights;
