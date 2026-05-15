/**
 * Tipos TypeScript centralizados para o projeto
 * Garante consistência e reutilização de tipos em todo o sistema
 */

// ==================== Auth Types ====================
export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: AuthUser;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

// ==================== API Types ====================
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  status: 'idle' | 'loading' | 'success' | 'error';
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ==================== Sensor Types ====================
export type SensorStatus = 'normal' | 'warning' | 'critical' | 'offline';

export type SensorType = 
  | 'temperature'
  | 'humidity'
  | 'soil_moisture'
  | 'ph'
  | 'light'
  | 'pressure'
  | 'wind_speed'
  | 'rain';

export interface SensorReading {
  readonly id: string;
  readonly name: string;
  readonly type: SensorType;
  readonly value: number;
  readonly unit: string;
  readonly status: SensorStatus;
  readonly location: string;
  readonly lastReading: Date;
  readonly metadata?: Record<string, unknown>;
}

export interface SensorConfig {
  readonly type: SensorType;
  readonly unit: string;
  readonly min: number;
  readonly max: number;
  readonly warningThreshold?: number;
  readonly criticalThreshold?: number;
}

// ==================== Weather Types ====================
export interface WeatherData {
  readonly temperature: number;
  readonly humidity: number;
  readonly precipitation: number;
  readonly windSpeed: number;
  readonly pressure: number;
  readonly forecast: readonly WeatherForecast[];
}

export interface WeatherForecast {
  readonly day: string;
  readonly high: number;
  readonly low: number;
  readonly condition: string;
  readonly icon: string;
}

// ==================== Financial Types ====================
export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'pending' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash' | 'credit' | 'debit' | 'transfer' | 'pix';

export interface Transaction {
  readonly id: string;
  readonly userId: string;
  readonly type: TransactionType;
  readonly amount: number;
  readonly category: string;
  readonly subcategory?: string;
  readonly description?: string;
  readonly transactionDate: string;
  readonly status: TransactionStatus;
  readonly paymentMethod?: PaymentMethod;
  readonly tags?: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface FinancialSummary {
  readonly totalIncome: number;
  readonly totalExpenses: number;
  readonly profit: number;
  readonly profitMargin: number;
  readonly transactionCount: number;
  readonly period: string;
}

export interface FinancialData {
  readonly revenue: number;
  readonly expenses: number;
  readonly profit: number;
  readonly profitMargin: number;
  readonly monthlyData: readonly MonthlyFinancialData[];
}

export interface MonthlyFinancialData {
  readonly month: string;
  readonly revenue: number;
  readonly expenses: number;
  readonly profit: number;
}

// ==================== Task Types ====================
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskCategory = 
  | 'irrigacao'
  | 'manutencao'
  | 'defensivos'
  | 'colheita'
  | 'plantio'
  | 'gestao';

export interface Task {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly description?: string;
  readonly priority: TaskPriority;
  readonly status: TaskStatus;
  readonly category?: TaskCategory;
  readonly dueDate?: string;
  readonly assignedTo?: string;
  readonly completedAt?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate: string;
  assignedTo: string;
}

// ==================== Equipment Types ====================
export type EquipmentStatus = 'active' | 'maintenance' | 'offline';
export type EquipmentType = 'tractor' | 'irrigacao' | 'drone' | 'colheitadeira' | 'outro';

export interface Equipment {
  readonly id: string;
  readonly name: string;
  readonly type: EquipmentType;
  readonly status: EquipmentStatus;
  readonly location: string;
  readonly lastMaintenance: string;
  readonly nextMaintenance: string;
  readonly hoursUsed: number;
}

// ==================== Production Types ====================
export type CropStatus = 
  | 'planejado'
  | 'plantado'
  | 'crescimento'
  | 'floracao'
  | 'frutificacao'
  | 'colheita';

export interface ProductionData {
  readonly crop: string;
  readonly area: number;
  readonly expectedYield: number;
  readonly currentGrowth: number;
  readonly harvestDate: string;
  readonly status: CropStatus;
}

// ==================== UI Types ====================
export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info';
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type CardVariant = 'default' | 'glass' | 'gradient' | 'elevated';

export interface SelectOption<T = string> {
  readonly label: string;
  readonly value: T;
  readonly disabled?: boolean;
}

// ==================== Form Types ====================
export interface FormField<T = unknown> {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

export interface FormState<T extends Record<string, unknown>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

// ==================== Utility Types ====================
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Type guard helpers
export function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

export function isNotUndefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}
