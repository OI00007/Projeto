import { useState, useCallback, useRef } from "react";
import { useAuth } from "./useAuth";
import { RateLimiter, secureLog } from "@/lib/security";

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

interface SecureApiOptions {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
}

const defaultOptions: SecureApiOptions = {
  retries: 2,
  retryDelay: 1000,
  timeout: 30000,
  rateLimit: {
    maxRequests: 30,
    windowMs: 60000,
  },
};

/**
 * Secure API hook with rate limiting, retry logic, and proper error handling
 */
export function useSecureApi<T>(options: SecureApiOptions = {}) {
  const { session } = useAuth();
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const mergedOptions = { ...defaultOptions, ...options };
  const rateLimiter = useRef(
    new RateLimiter(
      mergedOptions.rateLimit?.maxRequests ?? 30,
      mergedOptions.rateLimit?.windowMs ?? 60000,
    ),
  );
  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(
    async (
      url: string,
      fetchOptions: RequestInit = {},
      customHeaders: Record<string, string> = {},
    ): Promise<T | null> => {
      // Check rate limit
      if (!rateLimiter.current.canMakeRequest()) {
        const resetTime = Math.ceil(rateLimiter.current.getResetTime() / 1000);
        const errorMsg = `Muitas requisições. Tente novamente em ${resetTime}s`;
        setState({ data: null, error: errorMsg, loading: false });
        return null;
      }

      // Cancel previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      // Setup timeout
      const timeoutId = setTimeout(() => {
        abortControllerRef.current?.abort();
      }, mergedOptions.timeout);

      setState((prev) => ({ ...prev, loading: true, error: null }));

      let lastError: Error | null = null;

      for (
        let attempt = 0;
        attempt <= (mergedOptions.retries ?? 0);
        attempt++
      ) {
        try {
          const headers: Record<string, string> = {
            "Content-Type": "application/json",
            ...customHeaders,
          };

          // Add auth header if available
          if (session?.access_token) {
            headers["Authorization"] = `Bearer ${session.access_token}`;
          }

          const response = await fetch(url, {
            ...fetchOptions,
            headers,
            signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

            // Handle specific error codes
            if (response.status === 401) {
              throw new Error(
                "Sessão expirada. Por favor, faça login novamente.",
              );
            }
            if (response.status === 403) {
              throw new Error("Você não tem permissão para esta ação.");
            }
            if (response.status === 429) {
              throw new Error(
                "Limite de requisições excedido. Aguarde um momento.",
              );
            }
            if (response.status >= 500) {
              throw new Error("Erro no servidor. Tente novamente mais tarde.");
            }

            throw new Error(errorData.error || "Erro na requisição");
          }

          const data = await response.json();
          setState({ data, error: null, loading: false });
          return data;
        } catch (error) {
          lastError =
            error instanceof Error ? error : new Error("Erro desconhecido");

          if (signal.aborted) {
            setState({
              data: null,
              error: "Requisição cancelada",
              loading: false,
            });
            return null;
          }

          // Don't retry on client errors
          if (
            lastError.message.includes("Sessão expirada") ||
            lastError.message.includes("não tem permissão")
          ) {
            break;
          }

          // Wait before retry
          if (attempt < (mergedOptions.retries ?? 0)) {
            await new Promise((resolve) =>
              setTimeout(resolve, mergedOptions.retryDelay! * (attempt + 1)),
            );
          }
        }
      }

      clearTimeout(timeoutId);

      const genericError = "Erro ao processar requisição. Tente novamente.";
      secureLog("error", "API request failed", {
        url,
        error: lastError?.message,
      });
      setState({ data: null, error: genericError, loading: false });
      return null;
    },
    [
      session?.access_token,
      mergedOptions.retries,
      mergedOptions.retryDelay,
      mergedOptions.timeout,
    ],
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, loading: false });
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    ...state,
    execute,
    reset,
    cancel,
    remainingRequests: rateLimiter.current.getRemainingRequests(),
  };
}

/**
 * Hook for Edge Function calls with enhanced security
 */
export function useEdgeFunction<T>(
  functionName: string,
  options: SecureApiOptions = {},
) {
  const api = useSecureApi<T>(options);
  const baseUrl = import.meta.env.VITE_SUPABASE_URL as string;

  const invoke = useCallback(
    async (body: Record<string, unknown> = {}) => {
      if (!baseUrl) {
        throw new Error("VITE_SUPABASE_URL não está configurado");
      }

      const url = `${baseUrl.replace(/\/+$/, "")}/functions/v1/${functionName}`;
      return api.execute(url, {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
    [functionName, api, baseUrl],
  );

  return {
    ...api,
    invoke,
  };
}
