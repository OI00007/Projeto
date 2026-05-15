/**
 * Commodities Domain Types (SOLID: ISP)
 * 
 * ISP: Tipos segregados por domínio de commodities.
 */

export interface CommodityPrice {
  name: string;
  symbol: string;
  price: number;
  currency: string;
  unit: string;
  change24h: number;
  change7d: number;
  high52w: number;
  low52w: number;
  updatedAt: string;
}

export interface CommodityHistorical {
  date: string;
  price: number;
}

export interface CommoditiesData {
  prices: CommodityPrice[];
  historical: Record<string, CommodityHistorical[]>;
  generatedAt: string;
}

/**
 * DIP: Abstração para serviço de cotações de commodities.
 * Permite trocar implementação sem alterar consumidores.
 */
export interface ICommoditiesDataService {
  fetchCommodities(): Promise<CommoditiesData>;
}
