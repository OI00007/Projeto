// Mock data for demonstration purposes
export interface SensorReading {
  id: string;
  name: string;
  type: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  location: string;
  lastReading: Date;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  pressure: number;
  forecast: {
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
  }[];
}

export interface ProductionData {
  crop: string;
  area: number;
  expectedYield: number;
  currentGrowth: number;
  harvestDate: string;
  status: string;
}

export interface EquipmentData {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'maintenance' | 'offline';
  location: string;
  lastMaintenance: string;
  nextMaintenance: string;
  hoursUsed: number;
}

export interface TaskData {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo: string;
  dueDate: string;
  location: string;
}

export interface FinancialData {
  revenue: number;
  expenses: number;
  profit: number;
  profitMargin: number;
  monthlyData: {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }[];
}

// Generate random data within realistic ranges
const getRandomValue = (min: number, max: number, decimals: number = 1) => {
  return Number((Math.random() * (max - min) + min).toFixed(decimals));
};

const getRandomStatus = <T extends string>(statuses: T[]): T => {
  return statuses[Math.floor(Math.random() * statuses.length)];
};

export const generateMockSensors = (): SensorReading[] => {
  const sensorTypes = [
    { type: 'temperature', unit: '°C', min: 15, max: 35 },
    { type: 'humidity', unit: '%', min: 40, max: 80 },
    { type: 'soil_moisture', unit: '%', min: 30, max: 70 },
    { type: 'ph', unit: 'pH', min: 6.0, max: 7.5 },
    { type: 'light', unit: 'lux', min: 10000, max: 50000 },
    { type: 'pressure', unit: 'hPa', min: 1000, max: 1030 }
  ];

  const locations = ['Setor A', 'Setor B', 'Setor C', 'Estufa 1', 'Estufa 2', 'Campo Norte'];

  return sensorTypes.flatMap((sensor, index) => 
    locations.slice(0, 3 + Math.floor(Math.random() * 3)).map((location, locIndex) => {
      const value = getRandomValue(sensor.min, sensor.max, sensor.type === 'ph' ? 2 : 1);
      let status: 'normal' | 'warning' | 'critical' = 'normal';
      
      if (sensor.type === 'temperature' && (value < 18 || value > 32)) status = 'warning';
      if (sensor.type === 'humidity' && (value < 45 || value > 75)) status = 'warning';
      if (sensor.type === 'soil_moisture' && value < 35) status = 'critical';
      
      return {
        id: `sensor-${index}-${locIndex}`,
        name: `${sensor.type.replace('_', ' ').toUpperCase()} - ${location}`,
        type: sensor.type,
        value,
        unit: sensor.unit,
        status,
        location,
        lastReading: new Date(Date.now() - Math.random() * 3600000) // Last hour
      };
    })
  );
};

export const generateMockWeather = (): WeatherData => {
  const conditions = ['Ensolarado', 'Parcialmente nublado', 'Nublado', 'Chuva leve', 'Tempestade'];
  const icons = ['☀️', '⛅', '☁️', '🌧️', '⛈️'];
  
  return {
    temperature: getRandomValue(20, 35),
    humidity: getRandomValue(50, 80),
    precipitation: getRandomValue(0, 25),
    windSpeed: getRandomValue(5, 20),
    pressure: getRandomValue(1010, 1025),
    forecast: Array.from({ length: 7 }, (_, i) => {
      const conditionIndex = Math.floor(Math.random() * conditions.length);
      return {
        day: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR', { weekday: 'short' }),
        high: getRandomValue(25, 35),
        low: getRandomValue(15, 25),
        condition: conditions[conditionIndex],
        icon: icons[conditionIndex]
      };
    })
  };
};

export const generateMockProduction = (): ProductionData[] => {
  const crops = [
    { name: 'Milho', area: getRandomValue(50, 200), yield: getRandomValue(8, 12) },
    { name: 'Soja', area: getRandomValue(100, 300), yield: getRandomValue(3, 5) },
    { name: 'Tomate', area: getRandomValue(10, 50), yield: getRandomValue(60, 80) },
    { name: 'Alface', area: getRandomValue(5, 20), yield: getRandomValue(25, 35) }
  ];

  return crops.map((crop, index) => ({
    crop: crop.name,
    area: crop.area,
    expectedYield: crop.yield,
    currentGrowth: getRandomValue(60, 95),
    harvestDate: new Date(Date.now() + (30 + Math.random() * 90) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
    status: getRandomStatus(['Em crescimento', 'Floração', 'Frutificação', 'Próximo da colheita'])
  }));
};

export const generateMockEquipment = (): EquipmentData[] => {
  const equipment = [
    'Trator John Deere 6110M',
    'Pulverizador Jacto',
    'Colheitadeira Case IH',
    'Plantadeira Semeato',
    'Sistema de Irrigação A',
    'Sistema de Irrigação B',
    'Drone DJI Agras',
    'Estação Meteorológica'
  ];

  return equipment.map((name, index) => ({
    id: `eq-${index}`,
    name,
    type: name.includes('Trator') ? 'Trator' : name.includes('Sistema') ? 'Irrigação' : name.includes('Drone') ? 'Drone' : 'Equipamento',
    status: getRandomStatus(['active', 'maintenance', 'offline']),
    location: getRandomStatus(['Setor A', 'Setor B', 'Setor C', 'Oficina', 'Galpão']),
    lastMaintenance: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
    nextMaintenance: new Date(Date.now() + (30 + Math.random() * 60) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
    hoursUsed: Math.floor(Math.random() * 1000)
  }));
};

export const generateMockTasks = (): TaskData[] => {
  const tasks = [
    'Verificar sistema de irrigação Setor A',
    'Aplicar fertilizante na cultura de milho',
    'Manutenção preventiva do trator',
    'Coleta de amostras de solo',
    'Pulverização contra pragas',
    'Verificação dos sensores de temperatura',
    'Limpeza dos filtros de irrigação',
    'Calibração dos equipamentos'
  ];

  return tasks.map((title, index) => ({
    id: `task-${index}`,
    title,
    description: `Descrição detalhada da tarefa: ${title}`,
    priority: getRandomStatus(['low', 'medium', 'high']),
    status: getRandomStatus(['pending', 'in_progress', 'completed']),
    assignedTo: getRandomStatus(['João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa']),
    dueDate: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
    location: getRandomStatus(['Setor A', 'Setor B', 'Setor C', 'Oficina', 'Escritório'])
  }));
};

export const generateMockFinancial = (): FinancialData => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  
  const monthlyData = months.map(month => {
    const revenue = getRandomValue(50000, 150000, 0);
    const expenses = getRandomValue(30000, 100000, 0);
    return {
      month,
      revenue,
      expenses,
      profit: revenue - expenses
    };
  });

  const totalRevenue = monthlyData.reduce((sum, data) => sum + data.revenue, 0);
  const totalExpenses = monthlyData.reduce((sum, data) => sum + data.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;

  return {
    revenue: totalRevenue,
    expenses: totalExpenses,
    profit: totalProfit,
    profitMargin: (totalProfit / totalRevenue) * 100,
    monthlyData
  };
};