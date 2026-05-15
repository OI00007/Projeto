import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SessionConfig {
  maxIdleTimeMs?: number; // Max time without activity
  maxSessionAgeMs?: number; // Max total session duration
  checkIntervalMs?: number; // How often to check session
  warnBeforeExpiryMs?: number; // When to warn user
}

const DEFAULT_CONFIG: SessionConfig = {
  maxIdleTimeMs: 30 * 60 * 1000, // 30 minutes
  maxSessionAgeMs: 24 * 60 * 60 * 1000, // 24 hours
  checkIntervalMs: 60 * 1000, // 1 minute
  warnBeforeExpiryMs: 5 * 60 * 1000, // 5 minutes
};

interface SecureSessionState {
  isActive: boolean;
  lastActivity: number;
  sessionStart: number;
  expiresIn: number | null;
  isExpiring: boolean;
}

export function useSecureSession(config: SessionConfig = {}) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const settings = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config]);

  const [state, setState] = useState<SecureSessionState>({
    isActive: true,
    lastActivity: Date.now(),
    sessionStart: Date.now(),
    expiresIn: null,
    isExpiring: false,
  });

  const lastActivityRef = useRef(Date.now());
  const sessionStartRef = useRef(Date.now());
  const warningShownRef = useRef(false);

  // Update activity timestamp on user interaction
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    warningShownRef.current = false;
    setState((prev) => ({
      ...prev,
      lastActivity: Date.now(),
      isExpiring: false,
    }));
  }, []);

  // Extend session if valid
  const extendSession = useCallback(async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.refreshSession();

      if (error || !session) {
        console.error("Failed to extend session:", error);
        return false;
      }

      updateActivity();
      sessionStartRef.current = Date.now();

      toast({
        title: "Sessão estendida",
        description: "Sua sessão foi renovada com sucesso.",
      });

      return true;
    } catch (error) {
      console.error("Error extending session:", error);
      return false;
    }
  }, [toast, updateActivity]);

  // Force logout
  const forceLogout = useCallback(
    async (reason: string) => {
      try {
        await supabase.auth.signOut();

        toast({
          title: "Sessão encerrada",
          description: reason,
          variant: "destructive",
        });

        navigate("/auth");
      } catch (error) {
        console.error("Error during logout:", error);
        navigate("/auth");
      }
    },
    [navigate, toast],
  );

  // Check session validity
  const checkSession = useCallback(async () => {
    const now = Date.now();
    const idleTime = now - lastActivityRef.current;
    const sessionAge = now - sessionStartRef.current;

    // Check max session age
    if (sessionAge >= settings.maxSessionAgeMs!) {
      await forceLogout("Sua sessão expirou. Por favor, faça login novamente.");
      return;
    }

    // Check idle time
    if (idleTime >= settings.maxIdleTimeMs!) {
      await forceLogout("Sessão encerrada por inatividade.");
      return;
    }

    // Calculate time until expiry (whichever comes first)
    const timeUntilIdleExpiry = settings.maxIdleTimeMs! - idleTime;
    const timeUntilSessionExpiry = settings.maxSessionAgeMs! - sessionAge;
    const expiresIn = Math.min(timeUntilIdleExpiry, timeUntilSessionExpiry);

    // Warn before expiry
    if (expiresIn <= settings.warnBeforeExpiryMs! && !warningShownRef.current) {
      warningShownRef.current = true;
      setState((prev) => ({ ...prev, isExpiring: true, expiresIn }));

      toast({
        title: "Sessão expirando",
        description: "Sua sessão irá expirar em breve. Clique para renovar.",
        duration: 10000,
      });
    }

    // Verify session is still valid with Supabase
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      await forceLogout("Sessão inválida. Por favor, faça login novamente.");
      return;
    }

    setState((prev) => ({
      ...prev,
      isActive: true,
      expiresIn,
    }));
  }, [settings, forceLogout, toast]);

  // Set up activity listeners
  useEffect(() => {
    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"];

    events.forEach((event) => {
      window.addEventListener(event, updateActivity, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, [updateActivity]);

  // Set up session check interval
  useEffect(() => {
    // Initial session start time from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.expires_at) {
        // Use expires_at to calculate session start (sessions typically last 1 hour)
        const expiresAt = new Date(session.expires_at * 1000).getTime();
        sessionStartRef.current = expiresAt - 3600000; // 1 hour before expiry
      }
    });

    const interval = setInterval(checkSession, settings.checkIntervalMs!);

    return () => clearInterval(interval);
  }, [checkSession, settings.checkIntervalMs]);

  // Handle visibility change (user returns to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkSession();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [checkSession]);

  return {
    ...state,
    extendSession,
    forceLogout,
    updateActivity,
  };
}

/**
 * Hook for protected actions that require recent authentication
 */
export function useRecentAuthCheck(maxAgeMs: number = 5 * 60 * 1000) {
  const [needsReauth, setNeedsReauth] = useState(false);
  const lastAuthRef = useRef<number | null>(null);

  const checkRecentAuth = useCallback(async (): Promise<boolean> => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setNeedsReauth(true);
      return false;
    }

    // If we have a recent auth timestamp, use it
    if (lastAuthRef.current && Date.now() - lastAuthRef.current < maxAgeMs) {
      return true;
    }

    // Check if session was recently created/refreshed using expires_at
    const expiresAt = session.expires_at
      ? session.expires_at * 1000
      : Date.now() + 3600000;
    const sessionAge = Date.now() - (expiresAt - 3600000);

    if (sessionAge > maxAgeMs) {
      setNeedsReauth(true);
      return false;
    }

    return true;
  }, [maxAgeMs]);

  const confirmAuth = useCallback(() => {
    lastAuthRef.current = Date.now();
    setNeedsReauth(false);
  }, []);

  return {
    needsReauth,
    checkRecentAuth,
    confirmAuth,
  };
}

/**
 * Hook for detecting suspicious activity
 */
export function useSuspiciousActivityDetection() {
  const [suspiciousActivity, setSuspiciousActivity] = useState<string[]>([]);
  const failedAttemptsRef = useRef<number>(0);
  const lastAttemptTimeRef = useRef<number>(0);

  const recordFailedAttempt = useCallback((action: string) => {
    const now = Date.now();

    // Reset counter if more than 5 minutes since last attempt
    if (now - lastAttemptTimeRef.current > 5 * 60 * 1000) {
      failedAttemptsRef.current = 0;
    }

    failedAttemptsRef.current++;
    lastAttemptTimeRef.current = now;

    // Flag as suspicious if too many failed attempts
    if (failedAttemptsRef.current >= 5) {
      setSuspiciousActivity((prev) => [
        ...prev,
        `Múltiplas tentativas falhas: ${action}`,
      ]);
    }
  }, []);

  const recordUnusualPattern = useCallback((description: string) => {
    setSuspiciousActivity((prev) => [...prev, description]);
  }, []);

  const clearAlerts = useCallback(() => {
    setSuspiciousActivity([]);
    failedAttemptsRef.current = 0;
  }, []);

  return {
    suspiciousActivity,
    recordFailedAttempt,
    recordUnusualPattern,
    clearAlerts,
    hasSuspiciousActivity: suspiciousActivity.length > 0,
  };
}
