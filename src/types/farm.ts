// ============================================================
// TIPOS CENTRAIS DO DOMÍNIO — src/types/farm.ts
// ============================================================

// ─── Sensores ────────────────────────────────────────────────────────────────
export type SensorType = "temperature" | "soil_moisture" | "wind" | "uv" | "rain" | "camera";
export type SensorStatus = "online" | "offline" | "warning" | "critical";

export interface Sensor {
  id: string;
  farmId: string;
  name: string;
  type: SensorType;
  value: number;
  unit: string;
  location: string;
  status: SensorStatus;
  lastReading: Date;
}

// ─── Fazenda ─────────────────────────────────────────────────────────────────
export interface Farm {
  id: string;
  name: string;
  area: number;
  location: string;
  description?: string;
  ownerId: string;
  createdAt: string;
}

// ─── Membros da fazenda ───────────────────────────────────────────────────────
export type FarmRole = "owner" | "admin" | "viewer";

export interface FarmMember {
  id: string;
  farmId: string;
  userId: string;
  role: FarmRole;
  email: string;
  name?: string;
  joinedAt: string;
  status: "active" | "pending";
}

// ─── Transações ───────────────────────────────────────────────────────────────
export interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string | null;
  transaction_date: string;
  payment_method: string | null;
  status: string;
  created_at: string;
}

export interface MonthlyFinancialData {
  month: string;
  receita: number;
  custos: number;
  lucro: number;
}

export interface FinancialSummary {
  revenue: number;
  expenses: number;
  profit: number;
  profitMargin: number;
  transactions: Transaction[];
  monthlyData: MonthlyFinancialData[];
}

// ─── Métricas ─────────────────────────────────────────────────────────────────
export interface FarmMetrics {
  totalArea: number;
  activeSensors: number;
  totalSensors: number;
  activeCameras: number;
  totalCameras: number;
  criticalAlerts: number;
  warningAlerts: number;
  alertsCount: number;   // = criticalAlerts + warningAlerts
  networkCoverage: number;
}

// ─── Zonas/Setores ────────────────────────────────────────────────────────────
export type ZoneStatus = "excellent" | "good" | "warning" | "critical";

export interface Zone {
  id: string;
  name: string;
  health: number;
  sensors: number;
  alerts: number;
  status: ZoneStatus;
  crop: string;
  area: number;
}

// ─── Clima ────────────────────────────────────────────────────────────────────
export interface WeatherForecast {
  date: string;
  condition: string;
  tempMax: number;
  tempMin: number;
  precipitation: number;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  uvIndex: string | number;
  rainfall: number;
  condition: string;
  forecast?: Array<{ day: string; temp: number; condition: string }>;
}

// ─── Onboarding ───────────────────────────────────────────────────────────────
export type OnboardingStep = "welcome" | "farm-setup" | "invite" | "complete";

export interface OnboardingState {
  step: OnboardingStep;
  isDemo: boolean;          // true enquanto não completou onboarding
  farmName: string;
  farmArea: number;
  farmLocation: string;
  farmDescription: string;
}

// ─── Interfaces de serviço (DIP) ──────────────────────────────────────────────
export interface ISensorDataService {
  fetchSensors(userId: string): Promise<Sensor[]>;
  updateSensor(id: string, data: Partial<Sensor>): Promise<void>;
}

export interface IFinancialDataService {
  fetchTransactions(userId: string): Promise<Transaction[]>;
  addTransaction(userId: string, transaction: Omit<Transaction, "id" | "created_at">): Promise<void>;
}
