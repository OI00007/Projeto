/**
 * SensorDataService (SOLID: SRP + DIP)
 * 
 * SRP: Responsável APENAS por operações de dados de sensores.
 * DIP: Implementa a interface ISensorDataService, permitindo substituição.
 * OCP: Extensível via herança sem modificar o código existente.
 */
import { supabase } from '@/integrations/supabase/client';
import type { Sensor, ISensorDataService } from '@/types/farm';

// ============= Helper Functions (SRP: lógica de mapeamento isolada) =============
export function mapSensorType(type: string): Sensor['type'] {
  const typeMap: Record<string, Sensor['type']> = {
    'temperature': 'temperature',
    'humidity': 'soil_moisture',
    'soil_moisture': 'soil_moisture',
    'wind': 'wind',
    'uv': 'uv',
    'rain': 'rain',
    'camera': 'camera',
  };
  return typeMap[type] || 'temperature';
}

export function mapSensorStatus(value: number | null, type: string): Sensor['status'] {
  if (value === null) return 'offline';

  if (type === 'temperature') {
    if (value > 38 || value < 10) return 'critical';
    if (value > 35 || value < 15) return 'warning';
    return 'online';
  }

  if (type === 'soil_moisture' || type === 'humidity') {
    if (value < 20 || value > 95) return 'critical';
    if (value < 30 || value > 85) return 'warning';
    return 'online';
  }

  return 'online';
}

function mapRawSensor(s: Record<string, unknown>): Sensor {
  // Usa o status do banco se disponível, senão calcula pelo valor
  const dbStatus = s.status ? String(s.status) : null;
  const validStatuses = ["online", "offline", "warning", "critical"];
  const status = dbStatus && validStatuses.includes(dbStatus)
    ? (dbStatus as Sensor["status"])
    : mapSensorStatus(typeof s.value === "number" ? s.value : null, String(s.type));

  return {
    id:          String(s.id),
    name:        String(s.name ?? "Sensor"),
    type:        mapSensorType(String(s.type ?? "temperature")),
    status,
    value:       typeof s.value === "number" ? s.value : 0,
    unit:        s.unit ? String(s.unit) : "",
    location:    s.location ? String(s.location) : "Principal",
    lastReading: new Date(s.last_reading ? String(s.last_reading) : Date.now()),
    farmId:      s.farm_id ? String(s.farm_id) : undefined,
  };
}

/**
 * Implementação concreta do serviço de sensores usando Supabase.
 * DIP: Consumidores dependem da interface ISensorDataService, não desta classe.
 * FUNCIONAL: Queries com .limit() para evitar sobrecarga (Supabase max 1000 rows).
 */
export class SupabaseSensorService implements ISensorDataService {
  async fetchSensors(userId: string): Promise<Sensor[]> {
    const { data: farms } = await supabase
      .from('farms')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (!farms || farms.length === 0) return [];

    const farmId = farms[0].id;
    const { data: sensorData, error } = await supabase
      .from('sensors')
      .select('*')
      .eq('farm_id', farmId);

    if (error) throw error;
    if (!sensorData || sensorData.length === 0) return [];

    return sensorData.map(s => mapRawSensor(s as unknown as Record<string, unknown>));
  }

  async updateSensor(id: string, data: Record<string, unknown>): Promise<void> {
    const updateData: Record<string, unknown> = {
      last_reading: new Date().toISOString(),
    };
    if (data.value !== undefined && typeof data.value === 'number') updateData.value = data.value;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.name !== undefined) updateData.name = data.name;

    const { error } = await supabase
      .from('sensors')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  }

  subscribeToChanges(farmId: string, callback: (payload: unknown) => void): () => void {
    const channel = supabase
      .channel(`sensors-changes-${farmId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sensors',
          filter: `farm_id=eq.${farmId}`,
        },
        callback
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }
}

// Singleton padrão (OCP: pode ser substituído em testes ou configuração)
export const sensorService: ISensorDataService = new SupabaseSensorService();
