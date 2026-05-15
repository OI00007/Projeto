
-- Bloquear INSERT direto na tabela audit_logs por usuários comuns
-- Apenas funções SECURITY DEFINER (como insert_audit_log) podem inserir
CREATE POLICY "Only system functions can insert audit logs"
ON public.audit_logs
FOR INSERT
WITH CHECK (false);
