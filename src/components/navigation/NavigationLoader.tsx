import { motion } from "framer-motion";

export function NavigationLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.15 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-3 border-muted border-t-primary animate-spin" />
          <div className="absolute inset-0 w-12 h-12 rounded-full border-3 border-transparent border-b-primary/30 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">Carregando...</p>
      </motion.div>
    </div>
  );
}
