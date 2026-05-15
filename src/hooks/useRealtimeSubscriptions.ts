/**
 * useRealtimeSubscriptions (SOLID: SRP)
 * 
 * SRP: Responsável APENAS por gerenciar assinaturas realtime.
 * Extraído do FarmDataContext para reduzir sua complexidade.
 * DIP: Depende das abstrações ISensorDataService e IFinancialDataService.
 */
import { useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { sensorService, mapSensorType, mapSensorStatus } from '@/services/SensorDataService';
import { financialService } from '@/services/FinancialDataService';
import type { Sensor } from '@/types/farm';

interface RealtimeCallbacks {
  onSensorInsert: (sensor: Sensor) => void;
  onSensorUpdate: (id: string, updates: Partial<Sensor>) => void;
  onSensorDelete: (id: string) => void;
  onFinancialChange: () => void;
  onSyncStart: () => void;
  onSyncEnd: () => void;
  onTimestampUpdate: () => void;
}

/**
 * Hook que encapsula toda a lógica de assinaturas realtime.
 * ISP: Recebe callbacks segregados por tipo de evento.
 */
export function useRealtimeSubscriptions(
  user: User | null,
  sensors: Sensor[],
  callbacks: RealtimeCallbacks
) {
  const { onSensorInsert, onSensorUpdate, onSensorDelete, onFinancialChange, onSyncStart, onSyncEnd, onTimestampUpdate } = callbacks;

  useEffect(() => {
    if (!user) return;

    let unsubSensors: (() => void) | null = null;
    let unsubTransactions: (() => void) | null = null;

    const setup = async () => {
      const sensorData = await sensorService.fetchSensors(user.id);
      const farmId = sensorData[0]?.farmId;

      if (farmId) {
        unsubSensors = sensorService.subscribeToChanges(farmId, (payload: unknown) => {
          const p = payload as { eventType: string; new?: Record<string, unknown>; old?: Record<string, unknown> };
          onSyncStart();

          if (p.eventType === 'INSERT' && p.new) {
            const n = p.new;
            onSensorInsert({
              id: String(n.id),
              name: String(n.name),
              type: mapSensorType(String(n.type)),
              status: mapSensorStatus(typeof n.value === 'number' ? n.value : null, String(n.type)),
              value: typeof n.value === 'number' ? n.value : 0,
              unit: n.unit ? String(n.unit) : '',
              location: n.location ? String(n.location) : 'Principal',
              lastReading: new Date(n.last_reading ? String(n.last_reading) : Date.now()),
              farmId: n.farm_id ? String(n.farm_id) : undefined,
            });
          } else if (p.eventType === 'UPDATE' && p.new) {
            const u = p.new;
            onSensorUpdate(String(u.id), {
              value: typeof u.value === 'number' ? u.value : undefined,
              status: mapSensorStatus(typeof u.value === 'number' ? u.value : null, String(u.type || '')),
              lastReading: new Date(u.last_reading ? String(u.last_reading) : Date.now()),
            });
          } else if (p.eventType === 'DELETE' && p.old) {
            onSensorDelete(String(p.old.id));
          }

          onTimestampUpdate();
          setTimeout(onSyncEnd, 500);
        });
      }

      unsubTransactions = financialService.subscribeToChanges(user.id, () => {
        onSyncStart();
        onFinancialChange();
      });
    };

    setup();
    return () => {
      unsubSensors?.();
      unsubTransactions?.();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
}
