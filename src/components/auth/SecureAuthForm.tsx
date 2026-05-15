import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';
import { 
  secureLoginSchema, 
  secureSignupSchema, 
  checkRateLimit,
  generateSecureToken 
} from '@/lib/validation';
import { cn } from '@/lib/utils';

interface SecureAuthFormProps {
  mode: 'signin' | 'signup';
  onModeChange: (mode: 'signin' | 'signup') => void;
  onForgotPassword: () => void;
}

interface FormErrors {
  email?: string;
  password?: string;
  fullName?: string;
  confirmPassword?: string;
  general?: string;
}

const RATE_LIMIT_KEY = 'auth_attempts';
const MAX_AUTH_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

export function SecureAuthForm({ mode, onModeChange, onForgotPassword }: SecureAuthFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [rateLimited, setRateLimited] = useState(false);
  const [rateLimitResetIn, setRateLimitResetIn] = useState(0);
  const [csrfToken] = useState(() => generateSecureToken(32));

  // Check rate limit on mount
  useEffect(() => {
    const { allowed, resetIn } = checkRateLimit(RATE_LIMIT_KEY, MAX_AUTH_ATTEMPTS, RATE_LIMIT_WINDOW);
    if (!allowed) {
      setRateLimited(true);
      setRateLimitResetIn(Math.ceil(resetIn / 1000));
    }
  }, []);

  // Rate limit countdown
  useEffect(() => {
    if (!rateLimited) return;
    
    const interval = setInterval(() => {
      setRateLimitResetIn(prev => {
        if (prev <= 1) {
          setRateLimited(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [rateLimited]);

  // Validate field on change
  const validateField = useCallback((field: string, value: string) => {
    try {
      // Individual field validation schemas
      const fieldSchemas: Record<string, z.ZodTypeAny> = {
        email: z.string().trim().min(1, 'Email é obrigatório').max(255, 'Email muito longo').email('Email inválido'),
        password: mode === 'signin' 
          ? z.string().min(1, 'Senha é obrigatória')
          : z.string().min(8, 'Senha deve ter pelo menos 8 caracteres').max(128, 'Senha muito longa'),
        fullName: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
        confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
      };
      
      const schema = fieldSchemas[field];
      if (schema) {
        schema.parse(value);
      }
      setErrors(prev => ({ ...prev, [field]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [field]: error.errors[0]?.message }));
      }
    }
  }, [mode]);

  // Handle field blur
  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    const values: Record<string, string> = { email, password, fullName, confirmPassword };
    validateField(field, values[field] || '');
    
    // Special case: validate password match
    if (mode === 'signup' && (field === 'password' || field === 'confirmPassword')) {
      if (password && confirmPassword && password !== confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Senhas não coincidem' }));
      } else if (password === confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: undefined }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limit
    const { allowed, resetIn } = checkRateLimit(RATE_LIMIT_KEY, MAX_AUTH_ATTEMPTS, RATE_LIMIT_WINDOW);
    if (!allowed) {
      setRateLimited(true);
      setRateLimitResetIn(Math.ceil(resetIn / 1000));
      setErrors({ general: 'Muitas tentativas. Aguarde antes de tentar novamente.' });
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      // Validate all fields
      if (mode === 'signin') {
        const result = secureLoginSchema.safeParse({ email, password });
        if (!result.success) {
          const fieldErrors: FormErrors = {};
          result.error.errors.forEach(err => {
            const field = err.path[0] as keyof FormErrors;
            fieldErrors[field] = err.message;
          });
          setErrors(fieldErrors);
          setLoading(false);
          return;
        }
        
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
        
        if (error) {
          // Generic error message to prevent user enumeration
          setErrors({ general: 'Credenciais inválidas. Verifique seu email e senha.' });
          return;
        }
        
        navigate('/dashboard');
      } else {
        const result = secureSignupSchema.safeParse({ 
          fullName, 
          email, 
          password, 
          confirmPassword 
        });
        
        if (!result.success) {
          const fieldErrors: FormErrors = {};
          result.error.errors.forEach(err => {
            const field = err.path[0] as keyof FormErrors;
            fieldErrors[field] = err.message;
          });
          setErrors(fieldErrors);
          setLoading(false);
          return;
        }
        
        // Sign up
        const { error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              full_name: fullName.trim(),
            },
          },
        });
        
        if (error) {
          if (error.message.includes('already registered')) {
            // Generic message to prevent user enumeration
            setErrors({ general: 'Não foi possível criar a conta. Tente fazer login ou use outro email.' });
          } else {
            setErrors({ general: 'Erro ao criar conta. Tente novamente.' });
          }
          return;
        }
        
        toast({
          title: 'Conta criada com sucesso!',
          description: 'Verifique seu email para confirmar a conta.',
        });
        
        // Clear form
        setEmail('');
        setPassword('');
        setFullName('');
        setConfirmPassword('');
        setTouched({});
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({ general: 'Erro inesperado. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const renderFieldError = (field: string) => {
    const error = errors[field as keyof FormErrors];
    if (!error || !touched[field]) return null;
    
    return (
      <p className="text-sm text-destructive mt-1 flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        {error}
      </p>
    );
  };

  const isFieldValid = (field: string) => {
    const value = { email, password, fullName, confirmPassword }[field];
    return touched[field] && value && !errors[field as keyof FormErrors];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Hidden CSRF token */}
      <input type="hidden" name="_csrf" value={csrfToken} />
      
      {/* Rate limit warning */}
      {rateLimited && (
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Muitas tentativas. Aguarde {rateLimitResetIn} segundos antes de tentar novamente.
          </AlertDescription>
        </Alert>
      )}
      
      {/* General error */}
      {errors.general && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{errors.general}</AlertDescription>
        </Alert>
      )}
      
      {/* Full name field (signup only) */}
      {mode === 'signup' && (
        <div className="space-y-2">
          <Label htmlFor="fullName">Nome completo</Label>
          <div className="relative">
            <Input
              id="fullName"
              type="text"
              placeholder="Seu nome completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={() => handleBlur('fullName')}
              disabled={loading || rateLimited}
              autoComplete="name"
              className={cn(
                'pr-10',
                touched.fullName && errors.fullName && 'border-destructive',
                isFieldValid('fullName') && 'border-success'
              )}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            />
            {isFieldValid('fullName') && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-success" />
            )}
          </div>
          {renderFieldError('fullName')}
        </div>
      )}
      
      {/* Email field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur('email')}
            disabled={loading || rateLimited}
            autoComplete="email"
            className={cn(
              'pr-10',
              touched.email && errors.email && 'border-destructive',
              isFieldValid('email') && 'border-success'
            )}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {isFieldValid('email') && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-success" />
          )}
        </div>
        {renderFieldError('email')}
      </div>
      
      {/* Password field */}
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur('password')}
            disabled={loading || rateLimited}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            className={cn(
              'pr-20',
              touched.password && errors.password && 'border-destructive',
              mode === 'signin' && isFieldValid('password') && 'border-success'
            )}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {renderFieldError('password')}
        
        {/* Password strength indicator (signup only) */}
        {mode === 'signup' && password && (
          <PasswordStrengthIndicator password={password} />
        )}
      </div>
      
      {/* Confirm password field (signup only) */}
      {mode === 'signup' && (
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => handleBlur('confirmPassword')}
              disabled={loading || rateLimited}
              autoComplete="new-password"
              className={cn(
                'pr-20',
                touched.confirmPassword && errors.confirmPassword && 'border-destructive',
                isFieldValid('confirmPassword') && password === confirmPassword && 'border-success'
              )}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {renderFieldError('confirmPassword')}
        </div>
      )}
      
      {/* Forgot password link (signin only) */}
      {mode === 'signin' && (
        <div className="text-right">
          <Button
            type="button"
            variant="link"
            className="text-sm text-muted-foreground hover:text-primary p-0 h-auto"
            onClick={onForgotPassword}
          >
            Esqueceu a senha?
          </Button>
        </div>
      )}
      
      {/* Submit button */}
      <Button
        type="submit"
        className="w-full button-premium"
        disabled={loading || rateLimited}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            {mode === 'signin' ? 'Entrando...' : 'Criando conta...'}
          </span>
        ) : (
          mode === 'signin' ? 'Entrar' : 'Criar conta'
        )}
      </Button>
      
      {/* Security notice */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Shield className="w-3 h-3" />
        <span>Conexão segura com criptografia de ponta a ponta</span>
      </div>
    </form>
  );
}
