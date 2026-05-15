/**
 * useCommodities (SOLID: SRP + DIP)
 * 
 * SRP: Orquestra cache e service, sem lógica de fetch ou cache própria.
 * DIP: Depende de abstrações (ICommoditiesDataService, ICacheService).
 */
import { useState, useEffect, useCallback } from 'react';
import { commoditiesService } from '@/services/CommoditiesDataService';
import { LocalStorageCache } from '@/lib/cache';
import type { CommoditiesData } from '@/types/commodities';

// Re-export para backward compatibility (OCP)
export type { CommodityPrice, CommodityHistorical, CommoditiesData } from '@/types/commodities';

const CACHE_KEY = 'commodities_cache';
const CACHE_TTL = 15 * 60 * 1000;
const cache = new LocalStorageCache(CACHE_TTL);

export function useCommodities() {
  const [data, setData] = useState<CommoditiesData | null>(() => cache.get<CommoditiesData>(CACHE_KEY));
  const [isLoading, setIsLoading] = useState(!cache.get(CACHE_KEY));
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const result = await commoditiesService.fetchCommodities();
      setData(result);
      cache.set(CACHE_KEY, result);
      setError(null);
    } catch (err) {
      console.error('Commodities fetch error:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar cotações');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, CACHE_TTL);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
