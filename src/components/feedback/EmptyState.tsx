/**
 * EmptyState - Componente para estados vazios
 * 
 * USÁVEL: Guia o usuário sobre o que fazer quando não há dados.
 * ACESSÍVEL: Semântica correta e textos descritivos.
 * MANUTENÍVEL: Reutilizável com props flexíveis.
 */
import { type ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'inline' | 'card';
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'card',
}: EmptyStateProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center" role="status">
      <div className="p-4 rounded-full bg-muted/50">
        {icon || <Inbox className="w-8 h-8 text-muted-foreground" aria-hidden="true" />}
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
        )}
      </div>
      {actionLabel && onAction && (
        <Button variant="outline" onClick={onAction}>
          {actionLabel}
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
