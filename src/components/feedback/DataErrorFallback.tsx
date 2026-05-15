/**
 * DataErrorFallback - Componente de fallback para erros de carregamento de dados
 * 
 * USÁVEL: Feedback claro com ação de retry ao invés de tela em branco.
 * ACESSÍVEL: Labels e roles ARIA adequados.
 * MANUTENÍVEL: Reutilizável em qualquer widget de dados.
 */
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface DataErrorFallbackProps {
  /** Mensagem de erro amigável */
  message?: string;
  /** Callback de retry */
  onRetry?: () => void;
  /** Mostrar ícone */
  showIcon?: boolean;
  /** Variante visual: inline (sem card) ou card */
  variant?: 'inline' | 'card';
}

export function DataErrorFallback({
  message = 'Erro ao carregar dados. Tente novamente.',
  onRetry,
  showIcon = true,
  variant = 'card',
}: DataErrorFallbackProps) {
  const content = (
    <div
      className="flex flex-col items-center justify-center gap-3 py-8 text-center"
      role="alert"
      aria-live="polite"
    >
      {showIcon && (
        <div className="p-3 rounded-full bg-destructive/10">
          <AlertCircle className="w-6 h-6 text-destructive" aria-hidden="true" />
        </div>
      )}
      <p className="text-sm text-muted-foreground max-w-xs">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="gap-2"
          aria-label="Tentar carregar dados novamente"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          Tentar novamente
        </Button>
      )}
    </div>
  );

  if (variant === 'inline') return content;

  return (
    <Card>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
