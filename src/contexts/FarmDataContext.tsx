/* eslint-disable react-refresh/only-export-components */
/**
 * FarmDataContext (SOLID Refactored)
 * 
 * SRP: Orquestra providers e hooks segregados.
 * ISP: Hooks especializados expõem apenas o necessário.
 * DIP: Depende de abstrações (services), não de Supabase.
 * OCP: Novos domínios = novos hooks/services sem modificar existentes.
 */
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { sensorService } from '@/services/SensorDataService';
import { financialService, calculateMonthlyData } from '@/services/FinancialDataService';
import { useRealtimeSubscriptions } from '@/hooks/useRealtimeSubscriptions';
import type {
  Sensor, Transaction, FinancialSummary, Zone, FarmMetrics, WeatherData,
} from '@/types/farm';

// ─── Modo Mock ────────────────────────────────────────────────────────────────
const IS_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const MOCK_SENSORS: Sensor[] = [
  { id:"s1", name:"Termômetro Setor A",   type:"temperature",  status:"online",   value:27.4, unit:"°C", location:"Setor A - Milho", lastReading:new Date(), farmId:"farm1" },
  { id:"s2", name:"Umidade Solo Setor A", type:"soil_moisture",status:"online",   value:68,   unit:"%",  location:"Setor A - Milho", lastReading:new Date(), farmId:"farm1" },
  { id:"s3", name:"Termômetro Setor B",   type:"temperature",  status:"warning",  value:34.1, unit:"°C", location:"Setor B - Soja",  lastReading:new Date(), farmId:"farm1" },
  { id:"s4", name:"Umidade Solo Setor B", type:"soil_moisture",status:"critical", value:28,   unit:"%",  location:"Setor B - Soja",  lastReading:new Date(), farmId:"farm1" },
  { id:"s5", name:"Anemômetro",           type:"wind",         status:"online",   value:14,   unit:"km/h",location:"Torre Central", lastReading:new Date(), farmId:"farm1" },
  { id:"s6", name:"Pluviômetro",          type:"rain",         status:"online",   value:2.4,  unit:"mm", location:"Torre Central",  lastReading:new Date(), farmId:"farm1" },
];

const now = new Date();
const d = (days: number) => { const dt = new Date(now); dt.setDate(dt.getDate()-days); return dt.toISOString().split("T")[0]; };

const MOCK_TRANSACTIONS: Transaction[] = [
  { id:"t1", type:"income",  category:"Venda Soja",    amount:85000, description:"500 sacas",   transaction_date:d(2),  payment_method:"transfer", status:"completed", created_at:d(2)  },
  { id:"t2", type:"income",  category:"Venda Milho",   amount:62000, description:"400 sacas",   transaction_date:d(5),  payment_method:"transfer", status:"completed", created_at:d(5)  },
  { id:"t3", type:"expense", category:"Fertilizantes", amount:18500, description:"NPK 50 sacos",transaction_date:d(7),  payment_method:"pix",      status:"completed", created_at:d(7)  },
  { id:"t4", type:"expense", category:"Combustível",   amount:9200,  description:"Diesel 2000L",transaction_date:d(9),  payment_method:"cash",     status:"completed", created_at:d(9)  },
  { id:"t5", type:"income",  category:"Venda Café",    amount:44000, description:"80 sacas",    transaction_date:d(12), payment_method:"transfer", status:"completed", created_at:d(12) },
  { id:"t6", type:"expense", category:"Mão de obra",   amount:22000, description:"Folha out",   transaction_date:d(15), payment_method:"transfer", status:"completed", created_at:d(15) },
];

// Re-export types (OCP: backward compatibility)
export type { Sensor, Transaction, FinancialSummary, Zone, FarmMetrics, WeatherData } from '@/types/farm';

// ============= Context Type (ISP) =============
interface FarmDataContextType {
  sensors: Sensor[];
  financial: FinancialSummary;
  zones: Zone[];
  metrics: FarmMetrics;
  weather: WeatherData;
  isLoading: boolean;
  isSyncing: boolean;
  refreshData: () => Promise<void>;
  updateSensor: (id: string, data: Partial<Sensor>) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at'>) => Promise<void>;
  lastUpdated: Date | null;
}

// ============= Default Values (SRP: dados estáticos isolados) =============
const defaultFinancial: FinancialSummary = {
  revenue: 0, expenses: 0, profit: 0, profitMargin: 0,
  transactions: [], monthlyData: [],
};

const defaultZones: Zone[] = [
  { id: '1', name: 'Setor A - Milho', health: 95, sensors: 8, alerts: 0, status: 'excellent', crop: 'Milho', area: 150 },
  { id: '2', name: 'Setor B - Soja', health: 87, sensors: 6, alerts: 1, status: 'good', crop: 'Soja', area: 200 },
  { id: '3', name: 'Setor C - Café', health: 78, sensors: 5, alerts: 2, status: 'warning', crop: 'Café', area: 80 },
  { id: '4', name: 'Setor D - Pastagem', health: 92, sensors: 4, alerts: 0, status: 'excellent', crop: 'Pastagem', area: 120 },
];

const defaultMetrics: FarmMetrics = {
  totalArea: 550, activeSensors: 0, totalSensors: 0,
  activeCameras: 0, totalCameras: 0, criticalAlerts: 0,
  warningAlerts: 0, networkCoverage: 98,
};

const defaultWeather: WeatherData = {
  temperature: 28, humidity: 65, windSpeed: 12,
  uvIndex: 'Moderado', rainfall: 12, condition: 'Parcialmente Nublado',
  forecast: [
    { day: 'Hoje', temp: 28, condition: 'Parcialmente Nublado' },
    { day: 'Amanhã', temp: 30, condition: 'Ensolarado' },
    { day: 'Qui', temp: 27, condition: 'Chuva Leve' },
  ],
};

// ============= Context =============
const FarmDataContext = createContext<FarmDataContextType | undefined>(undefined);

export function FarmDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [financial, setFinancial] = useState<FinancialSummary>(defaultFinancial);
  const [zones] = useState<Zone[]>(defaultZones);
  const [metrics, setMetrics] = useState<FarmMetrics>(defaultMetrics);
  const [weather, setWeather] = useState<WeatherData>(defaultWeather);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // ============= Fetch via Service Abstractions (DIP) =============
  const fetchSensors = useCallback(async () => {
    if (!user && !IS_MOCK) return;
    try {
      if (IS_MOCK) { setSensors(MOCK_SENSORS); return; }
      const data = await sensorService.fetchSensors(user!.id);
      if (data.length > 0) setSensors(data);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error fetching sensors:', error);
      if (IS_MOCK) setSensors(MOCK_SENSORS);
    }
  }, [user]);

  const fetchFinancialData = useCallback(async () => {
    if (!user && !IS_MOCK) return;
    try {
      const transactions: Transaction[] = IS_MOCK
        ? MOCK_TRANSACTIONS
        : await financialService.fetchTransactions(user!.id);
      const income   = transactions.filter(t => t.type === 'income') .reduce((s, t) => s + t.amount, 0);
      const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      const profit   = income - expenses;

      setFinancial({
        revenue: income, expenses, profit,
        profitMargin: income > 0 ? (profit / income) * 100 : 0,
        transactions,
        monthlyData: calculateMonthlyData(transactions),
      });
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error fetching financial data:', error);
    }
  }, [user]);

  // ============= Realtime via extracted hook (SRP) =============
  const realtimeCallbacks = useMemo(() => ({
    onSensorInsert: (sensor: Sensor) => setSensors(prev => [...prev, sensor]),
    onSensorUpdate: (id: string, updates: Partial<Sensor>) =>
      setSensors(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s)),
    onSensorDelete: (id: string) => setSensors(prev => prev.filter(s => s.id !== id)),
    onFinancialChange: () => {
      fetchFinancialData().finally(() => {
        setLastUpdated(new Date());
        setTimeout(() => setIsSyncing(false), 500);
      });
    },
    onSyncStart: () => setIsSyncing(true),
    onSyncEnd: () => setIsSyncing(false),
    onTimestampUpdate: () => setLastUpdated(new Date()),
  }), [fetchFinancialData]);

  useRealtimeSubscriptions(user, sensors, realtimeCallbacks);

  // ============= Initial Fetch =============
  useEffect(() => {
    if (user || IS_MOCK) {
      setIsLoading(true);
      Promise.all([fetchSensors(), fetchFinancialData()])
        .finally(() => { setIsLoading(false); setLastUpdated(new Date()); });
    } else {
      setSensors([]);
      setFinancial(defaultFinancial);
    }
  }, [user, fetchSensors, fetchFinancialData]);

  // ============= Actions (DIP: delegam para serviços) =============
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([fetchSensors(), fetchFinancialData()]);
    setLastUpdated(new Date());
    setIsLoading(false);
  }, [fetchSensors, fetchFinancialData]);

  const updateSensor = useCallback(async (id: string, data: Partial<Sensor>) => {
    if (!user) return;
    try {
      setIsSyncing(true);
      await sensorService.updateSensor(id, data as Record<string, unknown>);
      setSensors(prev => prev.map(sensor =>
        sensor.id === id ? { ...sensor, ...data, lastReading: new Date() } : sensor
      ));
    } catch (error) {
      console.error('Error updating sensor:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [user]);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id' | 'created_at'>) => {
    if (!user) return;
    try {
      setIsSyncing(true);
      await financialService.addTransaction(user.id, transaction);
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  }, [user]);

  // ============= Derived Metrics (SRP: cálculo reativo) =============
  useEffect(() => {
    setMetrics(prev => ({
      ...prev,
      activeSensors: sensors.filter(s => s.status === 'online' || s.status === 'warning').length,
      totalSensors: sensors.length,
      activeCameras: sensors.filter(s => s.type === 'camera' && s.status !== 'offline').length,
      totalCameras: sensors.filter(s => s.type === 'camera').length || prev.totalCameras,
      criticalAlerts: sensors.filter(s => s.status === 'critical').length,
      warningAlerts: sensors.filter(s => s.status === 'warning').length,
    }));
  }, [sensors]);

  useEffect(() => {
    const temp = sensors.find(s => s.type === 'temperature');
    const humidity = sensors.find(s => s.type === 'soil_moisture');
    const wind = sensors.find(s => s.type === 'wind');
    if (temp || humidity || wind) {
      setWeather(prev => ({
        ...prev,
        temperature: typeof temp?.value === 'number' ? temp.value : prev.temperature,
        humidity: typeof humidity?.value === 'number' ? humidity.value : prev.humidity,
        windSpeed: typeof wind?.value === 'number' ? wind.value : prev.windSpeed,
      }));
    }
  }, [sensors]);

  const value = useMemo<FarmDataContextType>(() => ({
    sensors, financial, zones, metrics, weather,
    isLoading, isSyncing, refreshData, updateSensor, addTransaction, lastUpdated,
  }), [sensors, financial, zones, metrics, weather, isLoading, isSyncing, refreshData, updateSensor, addTransaction, lastUpdated]);

  return (
    <FarmDataContext.Provider value={value}>
      {children}
    </FarmDataContext.Provider>
  );
}

// ============= Hooks (ISP) =============
export function useFarmData() {
  const context = useContext(FarmDataContext);
  if (!context) throw new Error('useFarmData must be used within a FarmDataProvider');
  return context;
}

/** ISP: Somente dados financeiros */
export function useFinancialData() {
  const { financial, isLoading, isSyncing, refreshData, addTransaction } = useFarmData();
  return { financial, isLoading, isSyncing, refreshData, addTransaction };
}

/** ISP: Somente dados de sensores */
export function useSensorData() {
  const { sensors, metrics, updateSensor, isSyncing } = useFarmData();
  return {
    sensors, metrics, updateSensor, isSyncing,
    temperatureSensor: sensors.find(s => s.type === 'temperature'),
    humiditySensor: sensors.find(s => s.type === 'soil_moisture'),
  };
}

/** ISP: Somente dados de zonas */
export function useZoneData() {
  const { zones } = useFarmData();
  return { zones };
}

/** ISP: Somente dados meteorológicos */
export function useWeatherData() {
  const { weather } = useFarmData();
  return { weather };
}

/** ISP: Somente transações */
export function useTransactions() {
  const { financial, addTransaction, isSyncing } = useFarmData();
  return { transactions: financial.transactions, addTransaction, isSyncing };
}
