/**
 * useRetry - Hook resiliente para operações assíncronas com retry automático
 * 
 * FUNCIONAL: Garante confiabilidade das operações com retry exponencial.
 * ESCALÁVEL: Reutilizável em qualquer operação assíncrona da aplicação.
 * MANUTENÍVEL: Configurável via parâmetros, sem acoplamento a domínio.
 * 
 * @example
 * const { execute, isRetrying, attempts } = useRetry({ maxAttempts: 3 });
 * await execute(() => fetchData());
 */
import { useState, useCallback, useRef } from 'react';

interface RetryConfig {
  /** Número máximo de tentativas (padrão: 3) */
  maxAttempts?: number;
  /** Delay base em ms para backoff exponencial (padrão: 1000) */
  baseDelay?: number;
  /** Fator multiplicador do delay (padrão: 2) */
  backoffFactor?: number;
  /** Callback ao esgotar tentativas */
  onMaxAttemptsReached?: (error: Error) => void;
  /** Filtro: retorna false para erros que NÃO devem ser retentados (ex: 401) */
  shouldRetry?: (error: Error) => boolean;
}

interface RetryState {
  isRetrying: boolean;
  attempts: number;
  lastError: Error | null;
}

export function useRetry(config: RetryConfig = {}) {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    backoffFactor = 2,
    onMaxAttemptsReached,
    shouldRetry = () => true,
  } = config;

  const [state, setState] = useState<RetryState>({
    isRetrying: false,
    attempts: 0,
    lastError: null,
  });

  const abortRef = useRef(false);

  const execute = useCallback(async <T>(operation: () => Promise<T>): Promise<T> => {
    abortRef.current = false;
    setState({ isRetrying: false, attempts: 0, lastError: null });

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      if (abortRef.current) throw new Error('Operation aborted');

      try {
        setState(prev => ({ ...prev, attempts: attempt, isRetrying: attempt > 1 }));
        const result = await operation();
        setState(prev => ({ ...prev, isRetrying: false }));
        return result;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        setState(prev => ({ ...prev, lastError }));

        // Don't retry auth errors or if shouldRetry returns false
        if (!shouldRetry(lastError) || attempt === maxAttempts) {
          break;
        }

        // Exponential backoff with jitter
        const delay = baseDelay * Math.pow(backoffFactor, attempt - 1) + Math.random() * 500;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    setState(prev => ({ ...prev, isRetrying: false }));
    onMaxAttemptsReached?.(lastError!);
    throw lastError;
  }, [maxAttempts, baseDelay, backoffFactor, onMaxAttemptsReached, shouldRetry]);

  const abort = useCallback(() => {
    abortRef.current = true;
  }, []);

  return { execute, abort, ...state };
}

/**
 * shouldRetryError - Filtro padrão para erros que não devem ser retentados.
 * Erros de autenticação (401/403) e validação (400) não são retentados.
 */
export function shouldRetryError(error: Error): boolean {
  const message = error.message.toLowerCase();
  if (message.includes('401') || message.includes('403') || message.includes('unauthorized')) {
    return false;
  }
  if (message.includes('400') || message.includes('validation') || message.includes('invalid')) {
    return false;
  }
  return true;
}
