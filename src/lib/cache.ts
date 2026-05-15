/**
 * Cache Utility (SOLID: SRP)
 * 
 * SRP: Responsável APENAS por operações de cache em localStorage.
 * OCP: Extensível para outros backends de cache sem modificar consumidores.
 */

export interface ICacheService {
  get<T>(key: string): T | null;
  set<T>(key: string, data: T): void;
  remove(key: string): void;
}

interface CacheEntry<T> {
  data: T;
  cachedAt: number;
}

/**
 * Cache com TTL em localStorage.
 * LSP: Qualquer implementação de ICacheService pode substituir esta.
 */
export class LocalStorageCache implements ICacheService {
  constructor(private readonly ttlMs: number) {}

  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const entry: CacheEntry<T> = JSON.parse(raw);
      if (Date.now() - entry.cachedAt > this.ttlMs) {
        this.remove(key);
        return null;
      }
      return entry.data;
    } catch {
      return null;
    }
  }

  set<T>(key: string, data: T): void {
    try {
      const entry: CacheEntry<T> = { data, cachedAt: Date.now() };
      localStorage.setItem(key, JSON.stringify(entry));
    } catch { /* quota exceeded - fail silently */ }
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
