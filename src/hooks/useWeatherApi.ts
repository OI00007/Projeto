/**
 * Hook de Clima — usa Nominatim (geocodificação) + Open-Meteo (previsão)
 * Funciona para qualquer cidade do Brasil, sem Edge Function, sem API key.
 * Timezone fixo em America/Sao_Paulo para datas/horas corretas.
 */
import { useState, useEffect, useCallback } from "react";
import { TZ } from "@/lib/dateTime";

export interface WeatherApiData {
  current: {
    temperature: number; humidity: number; apparentTemperature: number;
    precipitation: number; rain: number; weatherCode: number;
    windSpeed: number; windDirection: number;
  };
  hourly: Array<{
    time: string; temperature: number;
    precipitationProbability: number; precipitation: number; weatherCode: number;
  }>;
  daily: Array<{
    date: string; weatherCode: number; tempMax: number; tempMin: number;
    precipitationSum: number; precipitationProbability: number;
    sunrise: string; sunset: string;
  }>;
  location: { latitude: number; longitude: number; city: string; country: string; };
}

interface UseWeatherApiReturn {
  data: WeatherApiData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refetch: () => Promise<void>;
}

const CACHE_TTL = 10 * 60 * 1000;
function getCache(city: string): WeatherApiData | null {
  try {
    const raw = localStorage.getItem(`argom_weather_${city}`);
    if (!raw) return null;
    const { data, exp } = JSON.parse(raw);
    return Date.now() < exp ? data : null;
  } catch { return null; }
}
function setCache(city: string, data: WeatherApiData) {
  try { localStorage.setItem(`argom_weather_${city}`, JSON.stringify({ data, exp: Date.now() + CACHE_TTL })); } catch { /**/ }
}

export function getWeatherCondition(code: number): string {
  if (code === 0 || code === 1) return "sunny";
  if (code === 2 || code === 3) return "cloudy";
  if (code >= 51 && code <= 57) return "drizzle";
  if (code >= 61 && code <= 67) return "rainy";
  if (code >= 71 && code <= 77) return "frost";
  if (code >= 80 && code <= 82) return "rainy";
  if (code >= 95 && code <= 99) return "stormy";
  return "cloudy";
}

export function getWeatherDescription(code: number): string {
  const m: Record<number,string> = {
    0:"Céu limpo",1:"Predominantemente limpo",2:"Parcialmente nublado",3:"Nublado",
    45:"Nevoeiro",51:"Garoa fraca",53:"Garoa moderada",55:"Garoa intensa",
    61:"Chuva fraca",63:"Chuva moderada",65:"Chuva forte",
    71:"Neve fraca",73:"Neve moderada",75:"Neve intensa",77:"Granizo",
    80:"Pancadas fracas",81:"Pancadas moderadas",82:"Pancadas intensas",
    95:"Tempestade",96:"Tempestade c/ granizo",99:"Tempestade intensa",
  };
  return m[code] ?? "Condição variável";
}

export function getWindDirection(degrees: number): string {
  return ["N","NE","L","SE","S","SO","O","NO"][Math.round(degrees / 45) % 8];
}

async function geocode(city: string): Promise<{lat:number;lon:number;displayName:string}|null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city + ", Brasil")}&format=json&limit=1&countrycodes=br&accept-language=pt-BR`;
  const res = await fetch(url, { headers: { "User-Agent": "Argom-AgriPlatform/1.0", "Accept-Language": "pt-BR" } });
  if (!res.ok) throw new Error("Erro ao buscar localização");
  const data = await res.json();
  if (!data.length) return null;
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), displayName: data[0].display_name?.split(",")[0] ?? city };
}

async function fetchClimate(lat: number, lon: number): Promise<Omit<WeatherApiData,"location">> {
  const params = new URLSearchParams({
    latitude: lat.toString(), longitude: lon.toString(),
    timezone: TZ,
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m",
    hourly: "temperature_2m,precipitation_probability,precipitation,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,sunrise,sunset",
    forecast_days: "7", wind_speed_unit: "kmh",
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error("Erro ao buscar clima");
  const r = await res.json();
  const nowIso = new Date().toISOString().slice(0, 13);
  const hourly = r.hourly.time
    .map((t:string, i:number) => ({ time:t, temperature:r.hourly.temperature_2m[i], precipitationProbability:r.hourly.precipitation_probability[i]??0, precipitation:r.hourly.precipitation[i]??0, weatherCode:r.hourly.weather_code[i] }))
    .filter((h:{time:string}) => h.time >= nowIso).slice(0, 24);
  const daily = r.daily.time.map((date:string,i:number) => ({
    date, weatherCode:r.daily.weather_code[i], tempMax:r.daily.temperature_2m_max[i], tempMin:r.daily.temperature_2m_min[i],
    precipitationSum:r.daily.precipitation_sum[i]??0, precipitationProbability:r.daily.precipitation_probability_max[i]??0,
    sunrise:r.daily.sunrise[i], sunset:r.daily.sunset[i],
  }));
  return {
    current: { temperature:r.current.temperature_2m, humidity:r.current.relative_humidity_2m, apparentTemperature:r.current.apparent_temperature, precipitation:r.current.precipitation, rain:r.current.rain, weatherCode:r.current.weather_code, windSpeed:r.current.wind_speed_10m, windDirection:r.current.wind_direction_10m },
    hourly, daily,
  };
}

export function useWeatherApi(city?: string): UseWeatherApiReturn {
  const resolved = (city || "sao paulo").trim().toLowerCase();
  const [data, setData]           = useState<WeatherApiData|null>(() => getCache(resolved));
  const [loading, setLoading]     = useState(!getCache(resolved));
  const [error, setError]         = useState<string|null>(null);
  const [lastUpdated, setUpdated] = useState<Date|null>(data ? new Date() : null);

  const fetch_ = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const geo = await geocode(resolved);
      if (!geo) throw new Error(`Cidade "${resolved}" não encontrada. Tente com o nome completo.`);
      const climate = await fetchClimate(geo.lat, geo.lon);
      const full: WeatherApiData = { ...climate, location: { latitude:geo.lat, longitude:geo.lon, city:geo.displayName, country:"Brasil" } };
      setData(full); setCache(resolved, full); setUpdated(new Date());
    } catch(e) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
      if (import.meta.env.DEV) console.error("Weather:", e);
    } finally { setLoading(false); }
  }, [resolved]);

  useEffect(() => {
    const cached = getCache(resolved);
    if (cached) { setData(cached); setLoading(false); fetch_(); }
    else fetch_();
    const iv = setInterval(fetch_, 15 * 60 * 1000);
    return () => clearInterval(iv);
  }, [fetch_, resolved]);

  return { data, loading, error, lastUpdated, refetch: fetch_ };
}
