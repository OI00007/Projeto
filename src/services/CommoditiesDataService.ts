/**
 * CommoditiesDataService (SOLID: SRP + DIP)
 * 
 * SRP: Responsável APENAS por buscar dados de cotações.
 * DIP: Implementa ICommoditiesDataService, desacoplando do Supabase.
 * LSP: Substituível por mock ou outra API sem quebrar consumidores.
 */
import { supabase } from '@/integrations/supabase/client';
import type { CommoditiesData, ICommoditiesDataService } from '@/types/commodities';

export class SupabaseCommoditiesService implements ICommoditiesDataService {
  async fetchCommodities(): Promise<CommoditiesData> {
    const { data: response, error } = await supabase.functions.invoke('commodities');

    if (error) throw new Error(error.message);
    if (!response?.success) throw new Error(response?.error || 'Erro desconhecido');

    return {
      prices: response.prices,
      historical: response.historical,
      generatedAt: response.generatedAt,
    };
  }
}

// Singleton (OCP: substituível via injeção)
export const commoditiesService: ICommoditiesDataService = new SupabaseCommoditiesService();
