/**
 * ============================================================
 * HOOK DE ONBOARDING — src/hooks/useOnboarding.ts
 * ============================================================
 *
 * Gerencia o estado de onboarding do usuário.
 *
 * FLUXO:
 *   1. Novo usuário se cadastra → isDemo=true (vê dados de exemplo)
 *   2. Banner convida a configurar a fazenda
 *   3. Wizard: nome → localização → área → convite de membros
 *   4. Ao completar → isDemo=false, dados reais carregam
 *
 * PERSISTÊNCIA:
 *   Estado salvo no Supabase (tabela farms + profiles).
 *   Se o usuário já tem fazenda → pula onboarding.
 */

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { OnboardingState, OnboardingStep } from "@/types/farm";

interface UseOnboardingReturn {
  onboarding: OnboardingState;
  isLoading: boolean;
  goToStep: (step: OnboardingStep) => void;
  updateField: (field: keyof OnboardingState, value: string | number | boolean) => void;
  completeFarmSetup: () => Promise<{ success: boolean; error?: string }>;
  skipToDemo: () => void;
  inviteMember: (email: string, role: "admin" | "viewer") => Promise<{ success: boolean; error?: string }>;
}

const DEFAULT_STATE: OnboardingState = {
  step: "welcome",
  isDemo: true,
  farmName: "",
  farmArea: 0,
  farmLocation: "",
  farmDescription: "",
};

export function useOnboarding(): UseOnboardingReturn {
  const { user } = useAuth();
  const [onboarding, setOnboarding] = useState<OnboardingState>(DEFAULT_STATE);
  const [isLoading, setIsLoading]   = useState(true);

  /**
   * Verifica se o usuário já tem fazenda configurada.
   * Se tiver → isDemo=false (pula onboarding).
   * Se não   → isDemo=true (mostra demo + banner).
   */
  useEffect(() => {
    if (!user) { setIsLoading(false); return; }

    async function checkFarm() {
      try {
        const { data: farm } = await supabase
          .from("farms")
          .select("id, name, area, location, description")
          .eq("user_id", user!.id)
          .limit(1)
          .single();

        if (farm && farm.name && farm.name !== "Minha Fazenda") {
          // Usuário já configurou — pula onboarding
          setOnboarding({
            step: "complete",
            isDemo: false,
            farmName: farm.name,
            farmArea: farm.area ?? 0,
            farmLocation: farm.location ?? "",
            farmDescription: farm.description ?? "",
          });
        } else {
          // Fazenda padrão ou sem fazenda → modo demo
          setOnboarding(prev => ({ ...prev, isDemo: true, step: "welcome" }));
        }
      } catch {
        // Sem fazenda ainda → modo demo
        setOnboarding(prev => ({ ...prev, isDemo: true }));
      } finally {
        setIsLoading(false);
      }
    }

    checkFarm();
  }, [user]);

  const goToStep = useCallback((step: OnboardingStep) => {
    setOnboarding(prev => ({ ...prev, step }));
  }, []);

  const updateField = useCallback((field: keyof OnboardingState, value: string | number | boolean) => {
    setOnboarding(prev => ({ ...prev, [field]: value }));
  }, []);

  const skipToDemo = useCallback(() => {
    setOnboarding(prev => ({ ...prev, step: "complete", isDemo: true }));
  }, []);

  /**
   * Salva a fazenda no Supabase e marca onboarding como completo.
   * Usa UPSERT para funcionar tanto na criação quanto na atualização.
   */
  const completeFarmSetup = useCallback(async () => {
    if (!user) return { success: false, error: "Usuário não autenticado" };
    if (!onboarding.farmName.trim()) return { success: false, error: "Nome da fazenda é obrigatório" };

    try {
      const { error } = await supabase
        .from("farms")
        .upsert({
          user_id:     user.id,
          name:        onboarding.farmName.trim(),
          area:        onboarding.farmArea || 0,
          location:    onboarding.farmLocation.trim(),
          description: onboarding.farmDescription.trim(),
          updated_at:  new Date().toISOString(),
        }, { onConflict: "user_id" });

      if (error) throw error;

      setOnboarding(prev => ({ ...prev, isDemo: false, step: "complete" }));
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao salvar fazenda";
      return { success: false, error: message };
    }
  }, [user, onboarding]);

  /**
   * Convida um membro para a fazenda.
   * Salva na tabela farm_members com status "pending".
   * O membro convidado recebe email via Supabase Auth.
   */
  const inviteMember = useCallback(async (email: string, role: "admin" | "viewer") => {
    if (!user) return { success: false, error: "Usuário não autenticado" };

    try {
      // Busca o farm_id do usuário atual
      const { data: farm } = await supabase
        .from("farms")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!farm) return { success: false, error: "Configure sua fazenda primeiro" };

      // Verifica se já existe convite pendente
      const { data: existing } = await supabase
        .from("farm_members")
        .select("id")
        .eq("farm_id", farm.id)
        .eq("email", email.toLowerCase())
        .maybeSingle();

      if (existing) return { success: false, error: "Este e-mail já foi convidado" };

      // Insere convite
      const { error } = await supabase
        .from("farm_members")
        .insert({
          farm_id:   farm.id,
          email:     email.toLowerCase().trim(),
          role,
          status:    "pending",
          invited_by: user.id,
        });

      if (error) throw error;
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao convidar membro";
      return { success: false, error: message };
    }
  }, [user]);

  return { onboarding, isLoading, goToStep, updateField, completeFarmSetup, skipToDemo, inviteMember };
}
