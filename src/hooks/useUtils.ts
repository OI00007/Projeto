import { useMemo, useRef, useCallback, useEffect } from 'react';

/**
 * Hook que retorna o valor anterior de uma variável
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * Hook que verifica se o componente está montado
 * Útil para operações assíncronas
 */
export function useIsMounted(): () => boolean {
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return useCallback(() => isMountedRef.current, []);
}

/**
 * Hook para executar efeito apenas após a primeira renderização
 */
export function useUpdateEffect(
  effect: React.EffectCallback,
  deps: React.DependencyList
): void {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Hook para executar callback quando o componente é desmontado
 */
export function useUnmount(callback: () => void): void {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      callbackRef.current();
    };
  }, []);
}

/**
 * Hook para executar callback apenas uma vez (on mount)
 */
export function useMount(callback: () => void): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, []);
}

/**
 * Hook para criar um callback estável que não muda entre renders
 */
export function useEventCallback<T extends (...args: unknown[]) => unknown>(
  callback: T
): T {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    ((...args: unknown[]) => callbackRef.current(...args)) as T,
    []
  );
}

/**
 * Hook para forçar re-render
 */
export function useForceUpdate(): () => void {
  const [, setTick] = useState(0);
  return useCallback(() => setTick(tick => tick + 1), []);
}

/**
 * Hook para detectar primeiro render
 */
export function useIsFirstRender(): boolean {
  const isFirstRender = useRef(true);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  return isFirstRender.current;
}

/**
 * Hook para executar callback em intervalo
 */
export function useInterval(
  callback: () => void,
  delay: number | null
): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

/**
 * Hook para executar callback após timeout
 */
export function useTimeout(
  callback: () => void,
  delay: number | null
): { clear: () => void; reset: () => void } {
  const savedCallback = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clear();
    if (delay !== null) {
      timeoutRef.current = setTimeout(() => savedCallback.current(), delay);
    }
  }, [delay, clear]);

  useEffect(() => {
    reset();
    return clear;
  }, [delay, reset, clear]);

  return { clear, reset };
}

/**
 * Hook para gerenciar toggles boolean
 */
export function useToggle(
  initialValue = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue(v => !v), []);
  return [value, toggle, setValue];
}

/**
 * Hook para gerenciar contadores
 */
export function useCounter(
  initialValue = 0,
  options: { min?: number; max?: number } = {}
): {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  set: (value: number) => void;
} {
  const { min = -Infinity, max = Infinity } = options;
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(c => Math.min(c + 1, max));
  }, [max]);

  const decrement = useCallback(() => {
    setCount(c => Math.max(c - 1, min));
  }, [min]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const set = useCallback(
    (value: number) => {
      setCount(Math.min(Math.max(value, min), max));
    },
    [min, max]
  );

  return { count, increment, decrement, reset, set };
}

// Import useState for hooks that need it
import { useState } from 'react';

/**
 * Hook para detectar cliques fora de um elemento
 */
export function useClickOutside<T extends HTMLElement>(
  callback: () => void
): React.RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [callback]);

  return ref;
}

/**
 * Hook para detectar teclas pressionadas
 */
export function useKeyPress(
  targetKey: string,
  callback: () => void,
  options: { enabled?: boolean; modifiers?: ('ctrl' | 'alt' | 'shift' | 'meta')[] } = {}
): void {
  const { enabled = true, modifiers = [] } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const modifierMatch = modifiers.every(mod => {
        switch (mod) {
          case 'ctrl': return event.ctrlKey;
          case 'alt': return event.altKey;
          case 'shift': return event.shiftKey;
          case 'meta': return event.metaKey;
          default: return true;
        }
      });

      if (event.key === targetKey && modifierMatch) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [targetKey, callback, enabled, modifiers]);
}
