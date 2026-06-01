/**
 * Constantes centralizadas do projeto
 * Evita magic numbers e strings espalhadas pelo código
 */

// ==================== API ====================
export const API_TIMEOUT = 30000; // 30 segundos
export const MAX_RETRIES = 3;
export const RETRY_DELAY = 1000; // 1 segundo

// ==================== Rate Limiting ====================
export const RATE_LIMIT = {
  MAX_REQUESTS: 30,
  WINDOW_MS: 60000, // 1 minuto
  AUTH_MAX_ATTEMPTS: 5,
  AUTH_LOCKOUT_MS: 300000, // 5 minutos
} as const;

// ==================== Pagination ====================
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100] as const,
} as const;

// ==================== Validation ====================
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 1000,
  TITLE_MAX_LENGTH: 200,
  MESSAGE_MAX_LENGTH: 5000,
} as const;

// ==================== File Upload ====================
export const FILE_UPLOAD = {
  MAX_SIZE_MB: 10,
  MAX_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ] as const,
  ALLOWED_DOCUMENT_TYPES: ["application/pdf", "text/csv"] as const,
} as const;

// ==================== UI ====================
export const UI = {
  TOAST_DURATION: 5000,
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
  ANIMATION_DURATION: 300,
  SKELETON_PULSE_DURATION: 2000,
} as const;

// ==================== Sensor Thresholds ====================
export const SENSOR_THRESHOLDS = {
  TEMPERATURE: { MIN: 15, MAX: 35, WARNING: 30, CRITICAL: 35 },
  HUMIDITY: { MIN: 40, MAX: 80, WARNING: 45, CRITICAL: 40 },
  SOIL_MOISTURE: { MIN: 30, MAX: 70, WARNING: 35, CRITICAL: 30 },
  PH: { MIN: 6.0, MAX: 7.5, WARNING: 6.2, CRITICAL: 6.0 },
  LIGHT: { MIN: 10000, MAX: 50000, WARNING: 15000, CRITICAL: 10000 },
  PRESSURE: { MIN: 1000, MAX: 1030, WARNING: 1005, CRITICAL: 1000 },
} as const;

// ==================== Financial ====================
export const FINANCIAL = {
  CURRENCY: "BRL",
  LOCALE: "pt-BR",
  DECIMAL_PLACES: 2,
  PROFIT_MARGIN_WARNING: 20,
  PROFIT_MARGIN_CRITICAL: 10,
} as const;

// ==================== Task Categories ====================
export const TASK_CATEGORIES = {
  IRRIGACAO: { label: "Irrigação", color: "info" },
  MANUTENCAO: { label: "Manutenção", color: "warning" },
  DEFENSIVOS: { label: "Defensivos", color: "destructive" },
  COLHEITA: { label: "Colheita", color: "success" },
  PLANTIO: { label: "Plantio", color: "primary" },
  GESTAO: { label: "Gestão", color: "secondary" },
} as const;

// ==================== Priorities ====================
export const PRIORITIES = {
  LOW: { label: "Baixa", color: "info", order: 1 },
  MEDIUM: { label: "Média", color: "warning", order: 2 },
  HIGH: { label: "Alta", color: "destructive", order: 3 },
} as const;

// ==================== Status ====================
export const TASK_STATUS = {
  PENDING: { label: "Pendente", color: "warning" },
  IN_PROGRESS: { label: "Em Progresso", color: "info" },
  COMPLETED: { label: "Concluída", color: "success" },
} as const;

export const EQUIPMENT_STATUS = {
  ACTIVE: { label: "Ativo", color: "success" },
  MAINTENANCE: { label: "Manutenção", color: "warning" },
  OFFLINE: { label: "Offline", color: "destructive" },
} as const;

// ==================== Routes ====================
export const ROUTES = {
  HOME: "/",
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
  FINANCIAL: "/financial",
  MONITORING: "/monitoring",
  TASKS: "/tasks",
  EQUIPMENT: "/equipment",
  FLEET: "/fleet",
  COSTS_FIELDS: "/costs-fields",
  PROFILE: "/profile",
} as const;

// ==================== Storage Keys ====================
export const STORAGE_KEYS = {
  THEME: "argom-theme",
  USER_PREFERENCES: "argom-user-preferences",
  SIDEBAR_STATE: "argom-sidebar-collapsed",
  LAST_VISITED: "argom-last-visited",
} as const;

// ==================== Error Messages ====================
export const ERROR_MESSAGES = {
  GENERIC: "Ocorreu um erro. Por favor, tente novamente.",
  NETWORK: "Erro de conexão. Verifique sua internet.",
  UNAUTHORIZED: "Você não tem permissão para acessar este recurso.",
  NOT_FOUND: "Recurso não encontrado.",
  VALIDATION: "Por favor, verifique os dados informados.",
  RATE_LIMITED: "Muitas tentativas. Aguarde alguns minutos.",
  SESSION_EXPIRED: "Sua sessão expirou. Faça login novamente.",
} as const;

// ==================== Success Messages ====================
export const SUCCESS_MESSAGES = {
  SAVED: "Salvo com sucesso!",
  DELETED: "Excluído com sucesso!",
  UPDATED: "Atualizado com sucesso!",
  CREATED: "Criado com sucesso!",
  SENT: "Enviado com sucesso!",
} as const;
