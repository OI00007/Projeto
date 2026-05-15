import { z } from "zod";

/**
 * Advanced validation utilities with comprehensive security checks
 */

// ============= SECURITY PATTERNS =============

// Prevent common injection patterns
const INJECTION_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /data:text\/html/gi,
  /on\w+\s*=/gi,
  /expression\s*\(/gi,
  /url\s*\(/gi,
  /import\s*\(/gi,
  /eval\s*\(/gi,
];

// SQL injection patterns
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)\b)/gi,
  /(--)|(\/\*)|(\*\/)|(\bOR\b\s*\d+\s*=\s*\d+)/gi,
  /(\bAND\b\s*\d+\s*=\s*\d+)/gi,
  /(;|\bEXEC\b|\bEXECUTE\b)/gi,
];

// Path traversal patterns
const PATH_TRAVERSAL_PATTERNS = [
  /\.\.\//g,
  /\.\.\\/ as unknown as RegExp,
  /%2e%2e%2f/gi,
  /%2e%2e\//gi,
  /\.\.%2f/gi,
  /%2e%2e%5c/gi,
];

// ============= VALIDATION FUNCTIONS =============

/**
 * Check for potential injection attacks
 */
export function containsInjection(input: string): boolean {
  return INJECTION_PATTERNS.some(pattern => pattern.test(input));
}

/**
 * Check for SQL injection attempts
 */
export function containsSQLInjection(input: string): boolean {
  return SQL_INJECTION_PATTERNS.some(pattern => pattern.test(input));
}

/**
 * Check for path traversal attempts
 */
export function containsPathTraversal(input: string): boolean {
  return PATH_TRAVERSAL_PATTERNS.some(pattern => pattern.test(input));
}

/**
 * Comprehensive input sanitization
 */
export function sanitizeInput(input: string, options: {
  allowHtml?: boolean;
  maxLength?: number;
  trimWhitespace?: boolean;
} = {}): string {
  const { allowHtml = false, maxLength = 10000, trimWhitespace = true } = options;
  
  if (typeof input !== 'string') return '';
  
  let sanitized = input;
  
  // Trim whitespace
  if (trimWhitespace) {
    sanitized = sanitized.trim();
  }
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');
  
  // HTML entity encoding if HTML not allowed
  if (!allowHtml) {
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
  
  return sanitized;
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate date string format (YYYY-MM-DD)
 */
export function isValidDateString(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  
  const parsed = new Date(date);
  return !isNaN(parsed.getTime());
}

/**
 * Validate ISO datetime string
 */
export function isValidISODateTime(datetime: string): boolean {
  const parsed = new Date(datetime);
  return !isNaN(parsed.getTime()) && datetime === parsed.toISOString();
}

// ============= ZOD CUSTOM VALIDATORS =============

/**
 * Custom Zod validator for secure strings
 */
export const secureString = (options: {
  minLength?: number;
  maxLength?: number;
  fieldName?: string;
} = {}) => {
  const { minLength = 1, maxLength = 1000, fieldName = 'Campo' } = options;
  
  return z.string()
    .min(minLength, `${fieldName} é obrigatório`)
    .max(maxLength, `${fieldName} muito longo (máximo ${maxLength} caracteres)`)
    .refine(val => !containsInjection(val), {
      message: `${fieldName} contém caracteres não permitidos`
    })
    .refine(val => !containsSQLInjection(val), {
      message: `${fieldName} contém padrões não permitidos`
    })
    .transform(val => sanitizeInput(val.trim()));
};

/**
 * Custom Zod validator for UUIDs
 */
export const uuidSchema = z.string()
  .refine(isValidUUID, { message: 'ID inválido' });

/**
 * Custom Zod validator for dates
 */
export const dateSchema = z.string()
  .refine(isValidDateString, { message: 'Data inválida (formato: YYYY-MM-DD)' });

/**
 * Custom Zod validator for positive amounts
 */
export const amountSchema = z.number()
  .positive('Valor deve ser positivo')
  .max(999999999.99, 'Valor muito alto')
  .multipleOf(0.01, 'Valor deve ter no máximo 2 casas decimais');

/**
 * Custom Zod validator for percentages
 */
export const percentageSchema = z.number()
  .min(0, 'Porcentagem não pode ser negativa')
  .max(100, 'Porcentagem não pode exceder 100%');

// ============= FORM VALIDATION SCHEMAS =============

/**
 * Enhanced login schema with security checks
 */
export const secureLoginSchema = z.object({
  email: z.string()
    .trim()
    .min(1, 'Email é obrigatório')
    .max(255, 'Email muito longo')
    .email('Email inválido')
    .refine(val => !containsInjection(val), {
      message: 'Email contém caracteres não permitidos'
    }),
  password: z.string()
    .min(1, 'Senha é obrigatória')
    .max(128, 'Senha muito longa')
});

/**
 * Enhanced signup schema with comprehensive validation
 */
export const secureSignupSchema = z.object({
  fullName: z.string()
    .trim()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Nome contém caracteres inválidos')
    .refine(val => !containsInjection(val), {
      message: 'Nome contém caracteres não permitidos'
    }),
  email: z.string()
    .trim()
    .min(1, 'Email é obrigatório')
    .max(255, 'Email muito longo')
    .email('Email inválido')
    .refine(val => !containsInjection(val), {
      message: 'Email contém caracteres não permitidos'
    }),
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(128, 'Senha muito longa')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
    .regex(/[^A-Za-z0-9]/, 'Senha deve conter pelo menos um caractere especial'),
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

/**
 * Enhanced transaction schema
 */
export const secureTransactionSchema = z.object({
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: 'Tipo deve ser receita ou despesa' })
  }),
  category: secureString({ maxLength: 50, fieldName: 'Categoria' }),
  subcategory: secureString({ maxLength: 50, fieldName: 'Subcategoria' }).optional().nullable(),
  amount: amountSchema,
  description: secureString({ maxLength: 500, fieldName: 'Descrição' }).optional().nullable(),
  transaction_date: dateSchema,
  payment_method: secureString({ maxLength: 50, fieldName: 'Método de pagamento' }).optional().nullable(),
  reference_number: secureString({ maxLength: 50, fieldName: 'Número de referência' }).optional().nullable(),
  status: z.enum(['pending', 'completed', 'cancelled']).default('completed'),
});

/**
 * Enhanced task schema
 */
export const secureTaskSchema = z.object({
  title: secureString({ minLength: 1, maxLength: 200, fieldName: 'Título' }),
  description: secureString({ maxLength: 2000, fieldName: 'Descrição' }).optional().nullable(),
  priority: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Prioridade inválida' })
  }),
  status: z.enum(['pending', 'in_progress', 'completed'], {
    errorMap: () => ({ message: 'Status inválido' })
  }),
  due_date: dateSchema.optional().nullable(),
  category: secureString({ maxLength: 50, fieldName: 'Categoria' }).optional().nullable(),
  assigned_to: uuidSchema.optional().nullable(),
});

/**
 * Enhanced budget schema
 */
export const secureBudgetSchema = z.object({
  category: secureString({ maxLength: 50, fieldName: 'Categoria' }),
  subcategory: secureString({ maxLength: 50, fieldName: 'Subcategoria' }).optional().nullable(),
  amount: amountSchema,
  period: z.enum(['daily', 'weekly', 'monthly', 'yearly'], {
    errorMap: () => ({ message: 'Período inválido' })
  }),
  start_date: dateSchema,
  end_date: dateSchema,
  alert_threshold: percentageSchema.optional().nullable(),
}).refine(data => new Date(data.start_date) < new Date(data.end_date), {
  message: 'Data inicial deve ser anterior à data final',
  path: ['end_date'],
});

/**
 * Enhanced farm schema
 */
export const secureFarmSchema = z.object({
  name: secureString({ minLength: 2, maxLength: 100, fieldName: 'Nome da fazenda' }),
  description: secureString({ maxLength: 1000, fieldName: 'Descrição' }).optional().nullable(),
  location: secureString({ maxLength: 200, fieldName: 'Localização' }).optional().nullable(),
  size_hectares: z.number()
    .positive('Tamanho deve ser positivo')
    .max(1000000, 'Tamanho muito grande')
    .optional()
    .nullable(),
});

/**
 * Enhanced profile schema
 */
export const secureProfileSchema = z.object({
  full_name: z.string()
    .trim()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Nome contém caracteres inválidos')
    .refine(val => !containsInjection(val), {
      message: 'Nome contém caracteres não permitidos'
    })
    .optional()
    .nullable(),
  company: secureString({ maxLength: 100, fieldName: 'Empresa' }).optional().nullable(),
  avatar_url: z.string()
    .url('URL do avatar inválida')
    .max(500, 'URL muito longa')
    .optional()
    .nullable(),
});

// ============= RATE LIMITING =============

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Check rate limit for a given key
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }
  
  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetIn: entry.resetAt - now };
  }
  
  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count, resetIn: entry.resetAt - now };
}

/**
 * Clear rate limit for a key
 */
export function clearRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

// ============= SESSION VALIDATION =============

/**
 * Validate session age
 */
export function isSessionValid(
  sessionCreatedAt: Date | string,
  maxAgeMs: number = 24 * 60 * 60 * 1000 // 24 hours default
): boolean {
  const createdAt = typeof sessionCreatedAt === 'string' 
    ? new Date(sessionCreatedAt) 
    : sessionCreatedAt;
  
  return Date.now() - createdAt.getTime() < maxAgeMs;
}

/**
 * Generate secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// ============= INPUT SANITIZATION FOR DISPLAY =============

/**
 * Sanitize user input for safe display in UI
 */
export function sanitizeForDisplay(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

/**
 * Sanitize object values recursively
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeForDisplay(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeForDisplay(item) : 
        typeof item === 'object' && item !== null ? sanitizeObject(item as Record<string, unknown>) : 
        item
      );
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized as T;
}
