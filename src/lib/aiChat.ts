/**
 * Motor de IA do Argom — responde perguntas sobre a fazenda.
 * Funciona 100% offline com respostas baseadas nos dados reais dos sensores.
 * Se VITE_ANTHROPIC_API_KEY estiver configurada, usa Claude para respostas avançadas.
 */

export interface FarmContext {
  sensors: Array<{ name:string; type:string; value:number; unit:string; status:string; location?:string; }>;
  financial: { revenue:number; expenses:number; profit:number; margin:string; };
  alerts: number;
  harvestYear?: string;
}

export interface ChatMessage { role: "user"|"assistant"; content: string; }

function brl(v:number) { return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(v); }
function has(text:string,...terms:string[]) { const l=text.toLowerCase(); return terms.some(t=>l.includes(t)); }

function offlineReply(q:string, ctx:FarmContext): string {
  const temp  = ctx.sensors.find(s=>s.type==="temperature");
  const hum   = ctx.sensors.find(s=>s.type==="soil_moisture");
  const online = ctx.sensors.filter(s=>s.status==="online").length;
  const crit  = ctx.sensors.filter(s=>s.status==="critical"||s.status==="warning");

  if (has(q,"irrigar","irrigação","regar","umidade")) {
    const h = hum?.value ?? 65;
    if (h < 35) return `🚿 **Irrigação urgente!**\n\nUmidade do solo em **${h}%** — abaixo do limite crítico.\nIrrigação imediata recomendada, preferencialmente das 4h às 6h ou das 17h às 19h.`;
    if (h < 55) return `💧 **Atenção à irrigação**\n\nUmidade em **${h}%** — próxima do limite. Irrigação leve recomendada se não houver previsão de chuva.`;
    return `✅ **Umidade adequada**\n\nUmidade em **${h}%** — dentro do ideal (55–75%). Não é necessário irrigar agora.`;
  }

  if (has(q,"temperatura","calor","frio","clima")) {
    const t = temp?.value ?? 28;
    const msg = t > 35 ? "⚠️ Temperatura elevada — estresse hídrico possível. Aumente irrigação e evite aplicações no período mais quente." :
                t < 10 ? "❄️ Risco de geada — use irrigação noturna para proteger culturas." :
                "✅ Temperatura adequada para a maioria das culturas.";
    return `🌡️ **Temperatura atual: ${t}°C**\n\n${msg}`;
  }

  if (has(q,"financeiro","lucro","receita","despesa","custo","margem")) {
    const {revenue,expenses,profit,margin} = ctx.financial;
    return `💰 **Resumo Financeiro**\n\n• Receita: **${brl(revenue)}**\n• Despesas: **${brl(expenses)}**\n• Lucro: **${brl(profit)}** ${profit>=0?"✅":"⚠️"}\n• Margem: **${margin}**\n\n${profit>=0?"Situação financeira positiva! Continue monitorando as categorias de despesa.":"Resultado negativo. Revise os maiores centros de custo."}`;
  }

  if (has(q,"sensor","sensores","alerta","alertas")) {
    return `📡 **Sensores: ${online}/${ctx.sensors.length} online**\n\n${crit.length>0 ? `⚠️ ${crit.length} sensor(es) precisam de atenção:\n${crit.map(s=>`• ${s.name}: ${s.value}${s.unit}`).join("\n")}\n\nVerifique fisicamente em campo.` : "✅ Todos os sensores normais."}`;
  }

  if (has(q,"soja")) return `🫘 **Soja**\n\nTemperatura ideal: 20–30°C (atual: ${temp?.value??'--'}°C)\nUmidade ideal: 60–70% (atual: ${hum?.value??'--'}%)\n\n⚠️ A floração (R1-R2) é a fase mais crítica ao déficit hídrico. Cada 10mm a menos pode reduzir 100–150 kg/ha.`;

  if (has(q,"milho")) return `🌽 **Milho**\n\nTemperatura ideal: 24–30°C (atual: ${temp?.value??'--'}°C)\nUmidade ideal: 55–75% (atual: ${hum?.value??'--'}%)\n\n⚠️ VT-R1 (polinização) é a fase mais crítica. Consume 5–8mm de água por dia no período intenso.`;

  if (has(q,"olá","oi","bom dia","boa tarde","boa noite")) {
    return `🌿 Olá! Sou o **Argom AI**.\n\n**Status da fazenda:**\n• ${online} sensor(es) online\n• ${ctx.alerts} alerta(s) ativo(s)\n• Lucro: ${brl(ctx.financial.profit)}\n\nPosso ajudar com irrigação, temperatura, financeiro, plantio, pragas e muito mais!`;
  }

  if (has(q,"como usar","ajuda","tutorial")) {
    return `🌿 **Sistema Argom**\n\n📊 Dashboard · 📡 Monitoramento · 💰 Financeiro · 🤖 IA & Insights · 🔧 Equipamentos · 🚜 Frotas · 📋 Tarefas · 📈 Relatórios\n\n💡 Clique no nome da cidade no widget de clima para trocar para sua cidade!\n\nO que mais posso explicar?`;
  }

  return `Sobre "${q}", com os dados atuais:\n• Temperatura: ${temp?.value??'--'}°C · Umidade: ${hum?.value??'--'}%\n• Lucro: ${brl(ctx.financial.profit)}\n\nTente perguntar sobre irrigação, clima, financeiro, soja, milho ou sensores para respostas mais detalhadas! 🌿`;
}

export async function processAIMessage(
  message: string,
  history: ChatMessage[],
  ctx: FarmContext,
  onChunk?: (partial: string) => void
): Promise<string> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;

  if (apiKey && apiKey.trim().length > 10) {
    try {
      const system = `Você é o Argom AI, assistente agrícola. Responda em português brasileiro, de forma prática e objetiva.
DADOS DA FAZENDA: Sensores: ${JSON.stringify(ctx.sensors.slice(0,6))}. Financeiro: receita ${brl(ctx.financial.revenue)}, lucro ${brl(ctx.financial.profit)}, margem ${ctx.financial.margin}. Alertas: ${ctx.alerts}. ${ctx.harvestYear||""}.`;
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type":"application/json", "x-api-key":apiKey, "anthropic-version":"2023-06-01" },
        body: JSON.stringify({ model:"claude-haiku-4-5-20251001", max_tokens:1024, system, messages:[...history.slice(-8).map(m=>({role:m.role,content:m.content})),{role:"user",content:message}] }),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      const content = data.content?.[0]?.text ?? "";
      if (content && onChunk) {
        let p = "";
        for (const w of content.split(" ")) { p += (p?" ":"")+w; onChunk(p); await new Promise(r=>setTimeout(r,18)); }
      }
      return content || offlineReply(message, ctx);
    } catch(e) {
      if (import.meta.env.DEV) console.warn("[Argom AI] API falhou, usando offline:", e);
    }
  }

  const reply = offlineReply(message, ctx);
  if (onChunk) {
    let p = "";
    for (const w of reply.split(" ")) { p += (p?" ":"")+w; onChunk(p); await new Promise(r=>setTimeout(r,14)); }
  }
  return reply;
}
