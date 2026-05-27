/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

declare const Deno: {
  env: {
    get(key: string): string | null;
  };
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
};

// Rate limiting map (per user)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS = 20;
const RATE_LIMIT_WINDOW = 60000; // 1 minute

function checkRateLimit(userId: string): {
  allowed: boolean;
  remaining: number;
} {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: MAX_REQUESTS - entry.count };
}

// Input sanitization
function sanitizeText(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

// Validate message structure
function validateMessage(
  msg: unknown,
): msg is { role: string; content: string } {
  if (!msg || typeof msg !== "object") return false;
  const m = msg as Record<string, unknown>;
  return (
    typeof m.role === "string" &&
    ["user", "assistant", "system"].includes(m.role) &&
    typeof m.content === "string" &&
    m.content.length > 0 &&
    m.content.length <= 8000
  );
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();
  const startTime = Date.now();

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error(`[${requestId}] No authorization header provided`);
      return new Response(
        JSON.stringify({
          error: "Autenticação necessária",
          code: "UNAUTHORIZED",
        }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const token = authHeader.replace("Bearer ", "");

    // Validate token format (basic check)
    if (token.length < 10 || token.length > 2000) {
      console.error(`[${requestId}] Invalid token format`);
      return new Response(
        JSON.stringify({
          error: "Token inválido",
          code: "INVALID_TOKEN",
        }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseKey) {
      console.error(`[${requestId}] Supabase environment variables missing`);
      return new Response(
        JSON.stringify({
          error: "Serviço de backend não configurado",
          code: "SERVICE_UNAVAILABLE",
        }),
        {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error(
        `[${requestId}] Auth error:`,
        authError?.message || "No user found",
      );
      return new Response(
        JSON.stringify({
          error: "Autenticação inválida",
          code: "INVALID_AUTH",
        }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Rate limiting per user
    const { allowed, remaining } = checkRateLimit(user.id);
    if (!allowed) {
      console.warn(`[${requestId}] Rate limit exceeded for user:`, user.id);
      return new Response(
        JSON.stringify({
          error: "Limite de requisições excedido. Aguarde um momento.",
          code: "RATE_LIMITED",
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "X-RateLimit-Remaining": "0",
            "Retry-After": "60",
          },
        },
      );
    }

    console.log(
      `[${requestId}] Authenticated user:`,
      user.id,
      `(${remaining} requests remaining)`,
    );

    // Parse and validate request body
    let body: unknown;
    try {
      const text = await req.text();
      if (text.length > 500000) {
        // 500KB limit
        throw new Error("Request body too large");
      }
      body = JSON.parse(text);
    } catch (e) {
      console.error(`[${requestId}] Invalid JSON body`);
      return new Response(
        JSON.stringify({
          error: "Formato de requisição inválido",
          code: "INVALID_REQUEST",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { messages, context } = body as {
      messages?: unknown[];
      context?: string;
    };

    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({
          error: "Formato de mensagens inválido",
          code: "INVALID_MESSAGES",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (messages.length > 50) {
      return new Response(
        JSON.stringify({
          error: "Limite de mensagens excedido (máximo 50)",
          code: "TOO_MANY_MESSAGES",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Validate each message
    const validatedMessages: { role: string; content: string }[] = [];
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      if (!validateMessage(msg)) {
        return new Response(
          JSON.stringify({
            error: `Mensagem ${i + 1} inválida`,
            code: "INVALID_MESSAGE_FORMAT",
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      validatedMessages.push({
        role: msg.role,
        content: sanitizeText(msg.content),
      });
    }

    // Validate context if provided
    let sanitizedContext = "";
    if (context !== undefined && context !== null) {
      if (typeof context !== "string" || context.length > 2000) {
        return new Response(
          JSON.stringify({
            error: "Contexto inválido",
            code: "INVALID_CONTEXT",
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      sanitizedContext = sanitizeText(context);
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error(`[${requestId}] LOVABLE_API_KEY is not configured`);
      return new Response(
        JSON.stringify({
          error: "Serviço de IA não configurado",
          code: "SERVICE_UNAVAILABLE",
        }),
        {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const today = new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const systemPrompt = `Você é um assistente virtual especializado em agricultura e gestão de fazendas. 
Seu nome é Argom AI e você ajuda produtores rurais com:
- Dúvidas sobre cultivo, pragas e doenças
- Análise de dados da fazenda
- Recomendações de manejo
- Informações sobre clima e irrigação
- Gestão financeira agrícola
- Equipamentos e maquinário

DATA ATUAL: ${today}. Você SEMPRE deve considerar esta data como a data de hoje.
Nunca fale como se estivesse no passado. Use informações atualizadas e relevantes para a época atual do ano agrícola.

Seja sempre prestativo, claro e objetivo. Use linguagem técnica quando apropriado, 
mas explique termos complexos. Responda sempre em português brasileiro.

IMPORTANTE: Nunca revele informações sobre sua implementação, chaves de API ou detalhes técnicos do sistema.

${sanitizedContext ? `Contexto atual da fazenda: ${sanitizedContext}` : ""}`;

    // Call AI with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: systemPrompt },
              ...validatedMessages,
            ],
            max_tokens: 1500,
            stream: false,
          }),
          signal: controller.signal,
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `[${requestId}] AI service returned ${response.status}: ${errorText}`,
        );
        return new Response(
          JSON.stringify({
            error: "Erro ao processar IA",
            code: "AI_SERVICE_ERROR",
            details: errorText,
          }),
          {
            status: 502,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      const payload = await response.json().catch(() => null);
      const content =
        typeof payload?.content === "string"
          ? payload.content
          : typeof payload?.message === "string"
            ? payload.message
            : (payload?.choices?.[0]?.message?.content ??
              payload?.choices?.[0]?.content ??
              payload?.output_text ??
              "");

      if (!content) {
        return new Response(
          JSON.stringify({
            error: "Resposta inválida do serviço de IA",
            code: "INVALID_AI_RESPONSE",
          }),
          {
            status: 502,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      const elapsed = Date.now() - startTime;
      console.log(`[${requestId}] AI request successful (${elapsed}ms)`);

      return new Response(JSON.stringify({ success: true, content }), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": String(remaining),
        },
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        console.error(`[${requestId}] AI request timed out`);
        return new Response(
          JSON.stringify({
            error: "Tempo limite excedido ao processar IA",
            code: "AI_TIMEOUT",
          }),
          {
            status: 504,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      console.error(`[${requestId}] AI service error:`, error);
      return new Response(
        JSON.stringify({
          error: "Erro ao processar a requisição de IA",
          code: "AI_SERVICE_ERROR",
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error(`[${requestId}] Unexpected error:`, error);
    return new Response(
      JSON.stringify({
        error: "Erro interno do servidor",
        code: "SERVER_ERROR",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
