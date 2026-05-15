/**
 * Utilitários de validação aprimorados com tipos estritos
 */

import { z } from 'zod';
import { VALIDATION, RATE_LIMIT } from './constants';

// ==================== Zod Schemas ====================

/**
 * Schema para email
 */
export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email é obrigatório')
  .max(VALIDATION.EMAIL_MAX_LENGTH, `Email deve ter no máximo ${VALIDATION.EMAIL_MAX_LENGTH} caracteres`)
  .email('Email inválido')
  .transform(val => val.toLowerCase());

/**
 * Schema para senha segura
 */
export const passwordSchema = z
  .string()
  .min(VALIDATION.PASSWORD_MIN_LENGTH, `Senha deve ter no mínimo ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`)
  .max(VALIDATION.PASSWORD_MAX_LENGTH, `Senha deve ter no máximo ${VALIDATION.PASSWORD_MAX_LENGTH} caracteres`)
  .regex(/[A-Z]/, 'Senha deve conter ao menos uma letra maiúscula')
  .regex(/[a-z]/, 'Senha deve conter ao menos uma letra minúscula')
  .regex(/[0-9]/, 'Senha deve conter ao menos um número')
  .regex(/[^A-Za-z0-9]/, 'Senha deve conter ao menos um caractere especial');

/**
 * Schema para nome
 */
export const nameSchema = z
  .string()
  .trim()
  .min(VALIDATION.NAME_MIN_LENGTH, `Nome deve ter no mínimo ${VALIDATION.NAME_MIN_LENGTH} caracteres`)
  .max(VALIDATION.NAME_MAX_LENGTH, `Nome deve ter no máximo ${VALIDATION.NAME_MAX_LENGTH} caracteres`)
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Nome contém caracteres inválidos');

/**
 * Schema para login
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Senha é obrigatória'),
});

/**
 * Schema para registro
 */
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: nameSchema,
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

/**
 * Schema para transação financeira
 */
export const transactionSchema = z.object({
  type: z.enum(['income', 'expense'], { errorMap: () => ({ message: 'Tipo inválido' }) }),
  amount: z
    .number({ invalid_type_error: 'Valor inválido' })
    .positive('Valor deve ser positivo')
    .max(999999999.99, 'Valor muito alto'),
  category: z.string().min(1, 'Categoria é obrigatória').max(100, 'Categoria muito longa'),
  description: z.string().max(VALIDATION.DESCRIPTION_MAX_LENGTH).optional(),
  transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  paymentMethod: z.enum(['cash', 'credit', 'debit', 'transfer', 'pix']).optional(),
});

/**
 * Schema para tarefa
 */
export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Título é obrigatório')
    .max(VALIDATION.TITLE_MAX_LENGTH, `Título muito longo`),
  description: z.string().max(VALIDATION.DESCRIPTION_MAX_LENGTH).optional(),
  priority: z.enum(['low', 'medium', 'high']),
  category: z.enum(['irrigacao', 'manutencao', 'defensivos', 'colheita', 'plantio', 'gestao']).optional(),
  dueDate: z.string().optional(),
  assignedTo: z.string().max(100).optional(),
});

// ==================== Sanitização ====================

/**
 * Escapa caracteres HTML para prevenir XSS
 */
export function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };
  
  return text.replace(/[&<>"'`=/]/g, char => htmlEscapes[char] || char);
}

/**
 * Sanitiza texto removendo caracteres perigosos
 */
export function sanitizeText(input: string, maxLength = 1000): string {
  if (typeof input !== 'string') return '';
  
  return escapeHtml(input.trim().slice(0, maxLength));
}

/**
 * Sanitiza parâmetro de URL
 */
export function sanitizeUrlParam(param: string): string {
  if (typeof param !== 'string') return '';
  
  return encodeURIComponent(param.trim());
}

/**
 * Remove scripts e tags perigosas de HTML
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

// ==================== Rate Limiter ====================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

/**
 * Rate limiter com suporte a múltiplas chaves
 */
export class RateLimiter {
  private limits = new Map<string, RateLimitEntry>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(
    maxRequests = RATE_LIMIT.MAX_REQUESTS,
    windowMs = RATE_LIMIT.WINDOW_MS
  ) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Verifica se uma requisição é permitida
   */
  check(key: string): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const entry = this.limits.get(key);

    // Limpa entrada expirada
    if (entry && now > entry.resetAt) {
      this.limits.delete(key);
    }

    const currentEntry = this.limits.get(key);

    if (!currentEntry) {
      this.limits.set(key, { count: 1, resetAt: now + this.windowMs });
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetIn: this.windowMs,
      };
    }

    if (currentEntry.count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetIn: currentEntry.resetAt - now,
      };
    }

    currentEntry.count++;
    return {
      allowed: true,
      remaining: this.maxRequests - currentEntry.count,
      resetIn: currentEntry.resetAt - now,
    };
  }

  /**
   * Reseta o limite para uma chave
   */
  reset(key: string): void {
    this.limits.delete(key);
  }

  /**
   * Limpa todas as entradas expiradas
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetAt) {
        this.limits.delete(key);
      }
    }
  }
}

// Instância global do rate limiter
export const globalRateLimiter = new RateLimiter();

// ==================== CSRF Token ====================

/**
 * Gerenciador de tokens CSRF
 */
export class CSRFTokenManager {
  private token: string | null = null;

  generate(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    this.token = Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
    return this.token;
  }

  validate(token: string): boolean {
    if (!this.token || !token) return false;
    
    // Comparação em tempo constante
    if (token.length !== this.token.length) return false;
    
    let result = 0;
    for (let i = 0; i < token.length; i++) {
      result |= token.charCodeAt(i) ^ this.token.charCodeAt(i);
    }
    return result === 0;
  }

  getToken(): string | null {
    return this.token;
  }
}

export const csrfManager = new CSRFTokenManager();

// ==================== Validação de Arquivo ====================

interface FileValidationOptions {
  maxSize?: number;
  allowedTypes?: readonly string[];
}

interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Valida arquivo de upload
 */
export function validateFile(
  file: File,
  options: FileValidationOptions = {}
): FileValidationResult {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
  } = options;

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Arquivo muito grande. Máximo: ${(maxSize / 1024 / 1024).toFixed(0)}MB`,
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de arquivo não permitido. Permitidos: ${allowedTypes.join(', ')}`,
    };
  }

  return { valid: true };
}

// ==================== Logging Seguro ====================

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const SENSITIVE_KEYS = [
  'password',
  'token',
  'secret',
  'apiKey',
  'api_key',
  'authorization',
  'credential',
  'credit_card',
  'cvv',
  'ssn',
];

/**
 * Redige dados sensíveis para logging
 */
function redactSensitive(data: Record<string, unknown>): Record<string, unknown> {
  const redacted: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = SENSITIVE_KEYS.some(k => lowerKey.includes(k));
    
    if (isSensitive) {
      redacted[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      redacted[key] = redactSensitive(value as Record<string, unknown>);
    } else {
      redacted[key] = value;
    }
  }
  
  return redacted;
}

/**
 * Log seguro que redige informações sensíveis
 */
export function secureLog(
  level: LogLevel,
  message: string,
  data?: Record<string, unknown>
): void {
  // Em produção, pode integrar com serviço de logging
  if (process.env.NODE_ENV === 'production') {
    // Apenas erros em produção
    if (level !== 'error') return;
  }

  const timestamp = new Date().toISOString();
  const safeData = data ? redactSensitive(data) : undefined;
  
  const logEntry = {
    timestamp,
    level,
    message,
    ...(safeData && { data: safeData }),
  };

  switch (level) {
    case 'error':
      console.error(logEntry);
      break;
    case 'warn':
      console.warn(logEntry);
      break;
    case 'debug':
      console.debug(logEntry);
      break;
    default:
      console.log(logEntry);
  }
}
