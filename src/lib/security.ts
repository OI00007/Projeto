import { z } from "zod";

/**
 * Security utilities for input validation and sanitization
 */

// Common validation patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;
const SAFE_TEXT_REGEX = /^[a-zA-Z0-9À-ÿ\s\-_.,:;!?@#$%&*()+='"\n\r]+$/;

/**
 * Sanitize text input to prevent XSS attacks
 */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate and sanitize URL parameters
 */
export function sanitizeUrlParam(param: string): string {
  if (typeof param !== 'string') return '';
  return encodeURIComponent(param.trim());
}

/**
 * Rate limiter for client-side operations
 */
export class RateLimiter {
  private timestamps: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(t => now - t < this.windowMs);
    
    if (this.timestamps.length < this.maxRequests) {
      this.timestamps.push(now);
      return true;
    }
    
    return false;
  }

  getRemainingRequests(): number {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(t => now - t < this.windowMs);
    return Math.max(0, this.maxRequests - this.timestamps.length);
  }

  getResetTime(): number {
    if (this.timestamps.length === 0) return 0;
    const oldestTimestamp = Math.min(...this.timestamps);
    return Math.max(0, this.windowMs - (Date.now() - oldestTimestamp));
  }
}

// Validation Schemas
export const emailSchema = z.string()
  .trim()
  .min(1, "Email é obrigatório")
  .max(255, "Email muito longo")
  .regex(EMAIL_REGEX, "Email inválido");

export const passwordSchema = z.string()
  .min(8, "Senha deve ter pelo menos 8 caracteres")
  .max(128, "Senha muito longa")
  .refine(
    (password) => /[A-Z]/.test(password),
    "Senha deve conter pelo menos uma letra maiúscula"
  )
  .refine(
    (password) => /[a-z]/.test(password),
    "Senha deve conter pelo menos uma letra minúscula"
  )
  .refine(
    (password) => /[0-9]/.test(password),
    "Senha deve conter pelo menos um número"
  );

export const strongPasswordSchema = passwordSchema.refine(
  (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
  "Senha deve conter pelo menos um caractere especial"
);

export const nameSchema = z.string()
  .trim()
  .min(2, "Nome deve ter pelo menos 2 caracteres")
  .max(100, "Nome muito longo")
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Nome contém caracteres inválidos");

export const phoneSchema = z.string()
  .trim()
  .regex(PHONE_REGEX, "Telefone inválido")
  .optional();

export const messageSchema = z.string()
  .trim()
  .min(1, "Mensagem é obrigatória")
  .max(4000, "Mensagem muito longa");

export const searchQuerySchema = z.string()
  .trim()
  .max(200, "Busca muito longa")
  .transform(val => sanitizeText(val));

// Form validation schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Senha é obrigatória"),
});

export const signupSchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  }
);

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"], {
    errorMap: () => ({ message: "Tipo deve ser 'income' ou 'expense'" }),
  }),
  category: z.string()
    .trim()
    .min(1, "Categoria é obrigatória")
    .max(50, "Categoria muito longa"),
  amount: z.number()
    .positive("Valor deve ser positivo")
    .max(999999999.99, "Valor muito alto"),
  description: z.string()
    .trim()
    .max(500, "Descrição muito longa")
    .optional(),
  transaction_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  payment_method: z.string()
    .trim()
    .max(50, "Método de pagamento muito longo")
    .optional(),
});

export const taskSchema = z.object({
  title: z.string()
    .trim()
    .min(1, "Título é obrigatório")
    .max(200, "Título muito longo"),
  description: z.string()
    .trim()
    .max(2000, "Descrição muito longa")
    .optional(),
  priority: z.enum(["low", "medium", "high"], {
    errorMap: () => ({ message: "Prioridade inválida" }),
  }),
  status: z.enum(["pending", "in_progress", "completed"], {
    errorMap: () => ({ message: "Status inválido" }),
  }),
  due_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida")
    .optional()
    .nullable(),
  category: z.string()
    .trim()
    .max(50, "Categoria muito longa")
    .optional()
    .nullable(),
});

/**
 * Secure logger that removes sensitive data
 */
export function secureLog(
  level: 'info' | 'warn' | 'error',
  message: string,
  data?: Record<string, unknown>
): void {
  const sensitiveKeys = ['password', 'token', 'secret', 'key', 'authorization', 'cookie', 'session'];
  
  const sanitizedData = data ? Object.fromEntries(
    Object.entries(data).map(([key, value]) => {
      if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
        return [key, '[REDACTED]'];
      }
      return [key, value];
    })
  ) : undefined;

  if (process.env.NODE_ENV === 'development') {
    console[level](message, sanitizedData);
  }
}

/**
 * Check if running in secure context (HTTPS)
 */
export function isSecureContext(): boolean {
  if (typeof window === 'undefined') return true;
  return window.isSecureContext || window.location.protocol === 'https:';
}

/**
 * Generate a random nonce for CSP
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate file upload
 */
export function validateFileUpload(
  file: File,
  options: {
    maxSize?: number;
    allowedTypes?: string[];
  } = {}
): { valid: boolean; error?: string } {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'] } = options;

  if (file.size > maxSize) {
    return { valid: false, error: `Arquivo muito grande. Máximo: ${Math.round(maxSize / 1024 / 1024)}MB` };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `Tipo de arquivo não permitido. Permitidos: ${allowedTypes.join(', ')}` };
  }

  return { valid: true };
}

/**
 * CSRF Token management
 */
class CSRFTokenManager {
  private token: string | null = null;

  generateToken(): string {
    this.token = generateNonce();
    return this.token;
  }

  validateToken(token: string): boolean {
    return this.token !== null && token === this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}

export const csrfManager = new CSRFTokenManager();

/**
 * Debounce function for rate limiting UI actions
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for rate limiting
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
