/**
 * DemoBanner — aparece no topo do dashboard quando o usuário está em modo demo.
 * Convida a configurar a fazenda real.
 */
import { Sparkles, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DemoBannerProps {
  onSetupFarm: () => void;
}

export function DemoBanner({ onSetupFarm }: DemoBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-primary via-green-600 to-green-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Sparkles className="h-5 w-5 flex-shrink-0 text-yellow-300 animate-pulse" />
          <div className="min-w-0">
            <p className="text-sm font-semibold">Você está vendo dados de demonstração</p>
            <p className="text-xs opacity-80 hidden sm:block">
              Configure sua fazenda para ver seus dados reais de sensores e financeiro.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            size="sm"
            onClick={onSetupFarm}
            className="bg-white text-primary hover:bg-white/90 font-semibold text-xs h-8 gap-1.5"
          >
            Configurar minha fazenda
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
          <button
            onClick={() => setDismissed(true)}
            className="opacity-70 hover:opacity-100 transition-opacity ml-1"
            aria-label="Fechar aviso"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
