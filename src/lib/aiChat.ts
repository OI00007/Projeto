/**
 * Motor de IA do Argom — responde perguntas sobre a fazenda.
 * Funciona 100% offline com respostas baseadas nos dados reais dos sensores.
 * As respostas avançadas agora são roteadas por uma função segura do Supabase.
 */

export interface FarmContext {
  sensors: Array<{
    name: string;
    type: string;
    value: number;
    unit: string;
    status: string;
    location?: string;
  }>;
  financial: {
    revenue: number;
    expenses: number;
    profit: number;
    margin: string;
  };
  alerts: number;
  harvestYear?: string;
  weather?: {
    temperature?: number;
    humidity?: number;
    windSpeed?: number;
    condition?: string;
    rainfall?: number;
  };
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

import { supabase } from "@/integrations/supabase/client";

function brl(v: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(v);
}

function buildFarmContextSummary(ctx: FarmContext): string {
  const sensorSummary = ctx.sensors
    .slice(0, 6)
    .map((s) => `${s.name} (${s.type}): ${s.value}${s.unit} ${s.status}`)
    .join("; ");

  const weatherSummary = ctx.weather
    ? `Clima atual: ${ctx.weather.condition ?? "desconhecido"}, ${ctx.weather.temperature?.toFixed(1) ?? "--"}°C, umidade ${ctx.weather.humidity ?? "--"}%, vento ${ctx.weather.windSpeed?.toFixed(0) ?? "--"} km/h, chuva ${ctx.weather.rainfall?.toFixed(1) ?? "0"}mm.`
    : "";

  return `Fazenda com ${ctx.sensors.length} sensores, ${ctx.alerts} alerta(s). Receita: ${brl(ctx.financial.revenue)}, despesas: ${brl(ctx.financial.expenses)}, lucro: ${brl(ctx.financial.profit)}, margem: ${ctx.financial.margin}. ${ctx.harvestYear ? `Safra: ${ctx.harvestYear}.` : ""} ${weatherSummary} Sensores: ${sensorSummary}.`;
}

function ensureHistoryIncludesUser(history: ChatMessage[], message: string) {
  const normalized = history.slice(-8);
  const last = normalized[normalized.length - 1];
  if (!last || last.role !== "user" || last.content !== message) {
    return [...normalized, { role: "user", content: message }];
  }
  return normalized;
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}
function has(text: string, ...terms: string[]) {
  const l = normalize(text);
  return terms.some((t) => l.includes(normalize(t)));
}

function offlineReply(q: string, ctx: FarmContext): string {
  const temp = ctx.sensors.find((s) => s.type === "temperature");
  const hum = ctx.sensors.find((s) => s.type === "soil_moisture");
  const windSpeed = ctx.weather?.windSpeed;
  const rain =
    ctx.weather?.rainfall ??
    ctx.sensors.find((s) => s.type === "rain")?.value ??
    0;
  const online = ctx.sensors.filter((s) => s.status === "online").length;
  const crit = ctx.sensors.filter(
    (s) => s.status === "critical" || s.status === "warning",
  );

  if (has(q, "irrigar", "irrigação", "regar", "umidade")) {
    const h = hum?.value ?? 65;
    if (h < 35)
      return `🚿 **Irrigação urgente!**\n\nUmidade do solo em **${h}%** — abaixo do limite crítico.\nIrrigação imediata recomendada, preferencialmente das 4h às 6h ou das 17h às 19h.`;
    if (h < 55)
      return `💧 **Atenção à irrigação**\n\nUmidade em **${h}%** — próxima do limite. Irrigação leve recomendada se não houver previsão de chuva.`;
    return `✅ **Umidade adequada**\n\nUmidade em **${h}%** — dentro do ideal (55–75%). Não é necessário irrigar agora.`;
  }

  if (has(q, "temperatura", "calor", "frio", "clima")) {
    const t = temp?.value ?? 28;
    const msg =
      t > 35
        ? "⚠️ Temperatura elevada — estresse hídrico possível. Aumente irrigação e evite aplicações no período mais quente."
        : t < 10
          ? "❄️ Risco de geada — use irrigação noturna para proteger culturas."
          : "✅ Temperatura adequada para a maioria das culturas.";
    return `🌡️ **Temperatura atual: ${t}°C**\n\n${msg}`;
  }

  if (has(q, "financeiro", "lucro", "receita", "despesa", "custo", "margem")) {
    const { revenue, expenses, profit, margin } = ctx.financial;
    return `💰 **Resumo Financeiro**\n\n• Receita: **${brl(revenue)}**\n• Despesas: **${brl(expenses)}**\n• Lucro: **${brl(profit)}** ${profit >= 0 ? "✅" : "⚠️"}\n• Margem: **${margin}**\n\n${profit >= 0 ? "Situação financeira positiva! Continue monitorando as categorias de despesa." : "Resultado negativo. Revise os maiores centros de custo."}`;
  }

  if (has(q, "sensor", "sensores", "alerta", "alertas")) {
    return `📡 **Sensores: ${online}/${ctx.sensors.length} online**\n\n${crit.length > 0 ? `⚠️ ${crit.length} sensor(es) precisam de atenção:\n${crit.map((s) => `• ${s.name}: ${s.value}${s.unit}`).join("\n")}\n\nVerifique fisicamente em campo.` : "✅ Todos os sensores normais."}`;
  }

  if (has(q, "chuva", "previsao", "previsão", "tempo", "forecast")) {
    return rain > 0
      ? `🌧️ **Chuva detectada:** ${rain.toFixed(1)}mm. Se você estiver irrigando, ajuste para evitar excesso de água e proteja as áreas sob cultivo sensível.`
      : `☀️ **Sem chuva recente detectada.** Monitore o solo e mantenha irrigação moderada se necessário.`;
  }

  if (has(q, "vento", "ventania", "rajada", "rajadas")) {
    return windSpeed !== undefined
      ? windSpeed > 30
        ? `💨 **Vento forte:** ${windSpeed.toFixed(0)} km/h. Evite aplicações foliares e proteja estruturas leves.`
        : `🌬️ **Vento moderado:** ${windSpeed.toFixed(0)} km/h. Condições seguras para a maioria das operações em campo.`
      : `🌬️ **Vento:** Dados não disponíveis no momento. Verifique os sensores de anemômetro.`;
  }

  if (has(q, "geada", "congelamento", "frost", "frio intenso")) {
    const t = temp?.value ?? 15;
    return t < 10
      ? `❄️ **Risco de geada:** temperatura atual ${t}°C. Proteja culturas sensíveis e considere irrigação noturna leve se necessário.`
      : `🧊 **Sem risco imediato de geada** com temperatura atual ${t}°C. Continue monitorando se cair abaixo de 8°C.`;
  }

  if (has(q, "plantio", "plantar", "safra", "semeadura", "cultura", "solo")) {
    return `🌱 **Plantio**

Para um plantio seguro, observe:
• Umidade do solo: ${hum?.value ?? "--"}%
• Temperatura: ${temp?.value ?? "--"}°C
• Evite áreas com sensores críticos no caminho de plantio.`;
  }

  if (
    has(
      q,
      "praga",
      "pragas",
      "doenca",
      "doença",
      "fungo",
      "inseto",
      "nematoide",
    )
  ) {
    return `🐞 **Pragas e doenças**

Use monitoramento visual e dados de sensores para detectar áreas críticas. Priorize inspeção em setores com umidade alta e temperaturas acima de 30°C.`;
  }

  if (has(q, "colheita", "colher", "safra", "cosecha")) {
    return `🌾 **Colheita**

Verifique maturação, umidade e condições climáticas. Evite colher em solo muito úmido ou quando houver previsão de chuva.`;
  }

  if (has(q, "soja"))
    return `🫘 **Soja**\n\nTemperatura ideal: 20–30°C (atual: ${temp?.value ?? "--"}°C)\nUmidade ideal: 60–70% (atual: ${hum?.value ?? "--"}%)\n\n⚠️ A floração (R1-R2) é a fase mais crítica ao déficit hídrico. Cada 10mm a menos pode reduzir 100–150 kg/ha.`;

  if (has(q, "milho"))
    return `🌽 **Milho**\n\nTemperatura ideal: 24–30°C (atual: ${temp?.value ?? "--"}°C)\nUmidade ideal: 55–75% (atual: ${hum?.value ?? "--"}%)\n\n⚠️ VT-R1 (polinização) é a fase mais crítica. Consume 5–8mm de água por dia no período intenso.`;

  if (has(q, "olá", "oi", "bom dia", "boa tarde", "boa noite")) {
    return `🌿 Olá! Sou o **Argom AI**.\n\n**Status da fazenda:**\n• ${online} sensor(es) online\n• ${ctx.alerts} alerta(s) ativo(s)\n• Lucro: ${brl(ctx.financial.profit)}\n\nPosso ajudar com irrigação, temperatura, financeiro, plantio, pragas e muito mais!`;
  }

  if (has(q, "como usar", "ajuda", "tutorial")) {
    return `🌿 **Sistema Argom**\n\n📊 Dashboard · 📡 Monitoramento · 💰 Financeiro · 🤖 IA & Insights · 🔧 Equipamentos · 🚜 Frotas · 📋 Tarefas · 📈 Relatórios\n\n💡 Clique no nome da cidade no widget de clima para trocar para sua cidade!\n\nO que mais posso explicar?`;
  }

  return `Sobre "${q}", com os dados atuais:\n• Temperatura: ${temp?.value ?? "--"}°C · Umidade: ${hum?.value ?? "--"}%\n• Lucro: ${brl(ctx.financial.profit)}\n\nTente perguntar sobre irrigação, clima, financeiro, soja, milho ou sensores para respostas mais detalhadas! 🌿`;
}

export async function processAIMessage(
  message: string,
  history: ChatMessage[],
  ctx: FarmContext,
  onChunk?: (partial: string) => void,
): Promise<string> {
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;

  const requestMessages = ensureHistoryIncludesUser(history, message);
  const context = buildFarmContextSummary(ctx);

  if (token) {
    try {
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: JSON.stringify({ messages: requestMessages, context }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (error) {
        throw error;
      }

      let payload: any = data;
      if (typeof data === "string") {
        try {
          payload = JSON.parse(data);
        } catch {
          payload = null;
        }
      }

      const content =
        typeof payload?.content === "string"
          ? payload.content
          : typeof payload?.message === "string"
            ? payload.message
            : (payload?.choices?.[0]?.message?.content ??
              payload?.choices?.[0]?.content ??
              payload?.output_text ??
              "");

      if (content) {
        if (onChunk) onChunk(content);
        return content;
      }
    } catch (e) {
      if (import.meta.env.DEV)
        console.warn(
          "[Argom AI] Função de IA falhou, usando fallback offline:",
          e,
        );
    }
  }

  const reply = offlineReply(message, ctx);
  if (onChunk) {
    let p = "";
    for (const w of reply.split(" ")) {
      p += (p ? " " : "") + w;
      onChunk(p);
      await new Promise((r) => setTimeout(r, 14));
    }
  }
  return reply;
}
