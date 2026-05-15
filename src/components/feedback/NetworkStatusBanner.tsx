/**
 * NetworkStatusBanner - Componente de feedback de conectividade
 * 
 * USÁVEL: Feedback visual claro sobre estado da rede.
 * SEGURO: Protege contra operações de dados sem conexão.
 * ACESSÍVEL: ARIA live region para leitores de tela.
 */
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { WifiOff, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function NetworkStatusBanner() {
  const { isOnline, wasOffline } = useNetworkStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          role="alert"
          aria-live="assertive"
          className="bg-destructive text-destructive-foreground"
        >
          <div className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium">
            <WifiOff className="w-4 h-4" aria-hidden="true" />
            <span>Sem conexão com a internet. Algumas funcionalidades podem ficar indisponíveis.</span>
          </div>
        </motion.div>
      )}
      {isOnline && wasOffline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ delay: 0.3 }}
          role="status"
          aria-live="polite"
          className="bg-success text-success-foreground"
        >
          <div className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium">
            <Wifi className="w-4 h-4" aria-hidden="true" />
            <span>Conexão restabelecida. Sincronizando dados...</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
