/**
 * Chat flutuante do Argom AI — aparece em todas as páginas internas.
 * Usa o motor de IA local (aiChat.ts) — funciona sem Edge Function.
 */
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Send, X, Bot, User, Loader2, Sparkles, Minimize2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSensorData, useFinancialData } from "@/contexts/FarmDataContext";
import { processAIMessage, type FarmContext } from "@/lib/aiChat";
import { getCurrentHarvestYear } from "@/lib/dateTime";

interface Msg { role: "user" | "assistant"; content: string; }

const QUICK = ["Devo irrigar?", "Status dos sensores", "Meu financeiro", "Condições de plantio"];

export function AIChatAssistant() {
  const { sensors }   = useSensorData();
  const { financial } = useFinancialData();

  const [isOpen,     setIsOpen]     = useState(false);
  const [minimized,  setMinimized]  = useState(false);
  const [messages,   setMessages]   = useState<Msg[]>([{
    role: "assistant",
    content: "🌿 Olá! Sou o Argom AI.\n\nPergunte sobre irrigação, sensores, financeiro, plantio e muito mais!",
  }]);
  const [input,     setInput]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    setMessages(prev => [...prev, { role: "user", content }]);
    setInput("");
    setLoading(true);

    // Adiciona placeholder
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    const ctx: FarmContext = {
      sensors: sensors.slice(0, 6).map(s => ({
        name: s.name, type: s.type, value: s.value,
        unit: s.unit, status: s.status, location: s.location,
      })),
      financial: {
        revenue: financial.revenue, expenses: financial.expenses,
        profit: financial.profit, margin: financial.profitMargin.toFixed(1) + "%",
      },
      alerts: sensors.filter(s => s.status === "critical" || s.status === "warning").length,
      harvestYear: getCurrentHarvestYear(),
    };

    const history = messages.map(m => ({ role: m.role as "user" | "assistant", content: m.content }));

    try {
      await processAIMessage(content, history, ctx, (partial) => {
        setMessages(prev => {
          const upd = [...prev];
          upd[upd.length - 1] = { role: "assistant", content: partial };
          return upd;
        });
      });
    } catch {
      setMessages(prev => {
        const upd = [...prev];
        upd[upd.length - 1] = { role: "assistant", content: "⚠️ Erro ao processar. Tente novamente." };
        return upd;
      });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => { setIsOpen(true); setMinimized(false); }}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-primary text-primary-foreground hover:bg-primary/90 z-50 hover:scale-105 transition-all duration-300 flex items-center justify-center border-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/30"
        title="Abrir Argom AI"
      >
        <MessageCircle className="h-6 w-6 text-primary-foreground" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-80 sm:w-96 shadow-2xl border-border/50 overflow-hidden flex flex-col"
        style={{ height: minimized ? "56px" : "520px" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground flex-shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="font-medium text-sm">Argom AI</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-300 ml-1" />
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary-foreground hover:bg-white/20"
              onClick={() => setMinimized(v => !v)}>
              {minimized ? <ChevronDown className="h-4 w-4 rotate-180" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary-foreground hover:bg-white/20"
              onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!minimized && (
          <>
            {/* Mensagens */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex gap-2", m.role === "user" && "flex-row-reverse")}>
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-success/20 text-success"
                  )}>
                    {m.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  </div>
                  <div className={cn(
                    "max-w-[78%] rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted/60 text-foreground rounded-tl-sm"
                  )}>
                    {m.content || <span className="flex gap-1">{[0,1,2].map(i=><span key={i} className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}}/>)}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Atalhos rápidos */}
            {messages.length <= 1 && (
              <div className="px-3 pb-2 flex flex-wrap gap-1">
                {QUICK.map(q => (
                  <button key={q} onClick={() => send(q)}
                    className="text-xs px-2 py-1 rounded-full border bg-background hover:bg-primary hover:text-primary-foreground transition-all">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-3 pb-3 border-t pt-2 flex gap-2 items-end flex-shrink-0">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Pergunte sobre a fazenda…"
                rows={1}
                disabled={loading}
                className="flex-1 resize-none bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring min-h-[32px] max-h-20"
              />
              <Button size="icon" className="h-8 w-8 flex-shrink-0 bg-primary"
                onClick={() => send()} disabled={!input.trim() || loading}>
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
