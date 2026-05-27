/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

declare const Deno: {
  env: {
    get(key: string): string | null;
  };
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
};

const COORDINATE_BOUNDS = {
  latitude: { min: -90, max: 90 },
  longitude: { min: -180, max: 180 },
};

const CITY_NAME_MAX_LENGTH = 100;

function isValidCoordinate(
  value: unknown,
  type: "latitude" | "longitude",
): boolean {
  if (typeof value !== "number" || isNaN(value)) return false;
  const bounds = COORDINATE_BOUNDS[type];
  return value >= bounds.min && value <= bounds.max;
}

function sanitizeCityName(city: unknown): string | null {
  if (typeof city !== "string") return null;
  const sanitized = city.trim().toLowerCase().slice(0, CITY_NAME_MAX_LENGTH);
  if (!/^[a-záàâãéèêíïóôõöúçñ\s-]+$/i.test(sanitized)) return null;
  return sanitized;
}

// Simple in-memory cache (edge function instances are shared)
const cache = new Map<string, { data: unknown; expiresAt: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    let requestData: unknown;
    try {
      requestData = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Formato de requisição inválido" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { latitude, longitude, city } = requestData as Record<
      string,
      unknown
    >;

    let lat = -23.5505;
    let lon = -46.6333;
    let resolvedCity = "São Paulo";

    if (latitude !== undefined || longitude !== undefined) {
      if (
        !isValidCoordinate(latitude, "latitude") ||
        !isValidCoordinate(longitude, "longitude")
      ) {
        return new Response(
          JSON.stringify({ error: "Coordenadas inválidas" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      lat = latitude as number;
      lon = longitude as number;
    }

    if (city) {
      const sanitizedCity = sanitizeCityName(city);
      if (!sanitizedCity) {
        return new Response(
          JSON.stringify({ error: "Nome da cidade inválido" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      const cities: Record<string, { lat: number; lon: number; name: string }> =
        {
          "sao paulo": { lat: -23.5505, lon: -46.6333, name: "São Paulo" },
          "rio de janeiro": {
            lat: -22.9068,
            lon: -43.1729,
            name: "Rio de Janeiro",
          },
          brasilia: { lat: -15.7942, lon: -47.8825, name: "Brasília" },
          "belo horizonte": {
            lat: -19.9167,
            lon: -43.9345,
            name: "Belo Horizonte",
          },
          curitiba: { lat: -25.4284, lon: -49.2733, name: "Curitiba" },
          "porto alegre": {
            lat: -30.0346,
            lon: -51.2177,
            name: "Porto Alegre",
          },
          goiania: { lat: -16.6869, lon: -49.2648, name: "Goiânia" },
          campinas: { lat: -22.9099, lon: -47.0626, name: "Campinas" },
          "ribeirao preto": {
            lat: -21.1775,
            lon: -47.8103,
            name: "Ribeirão Preto",
          },
          uberlandia: { lat: -18.9186, lon: -48.2772, name: "Uberlândia" },
          manaus: { lat: -3.119, lon: -60.0217, name: "Manaus" },
          recife: { lat: -8.0476, lon: -34.877, name: "Recife" },
          salvador: { lat: -12.9714, lon: -38.5124, name: "Salvador" },
          fortaleza: { lat: -3.7172, lon: -38.5433, name: "Fortaleza" },
          belem: { lat: -1.4558, lon: -48.5024, name: "Belém" },
        };

      const cityCoords = cities[sanitizedCity];
      if (cityCoords) {
        lat = cityCoords.lat;
        lon = cityCoords.lon;
        resolvedCity = cityCoords.name;
      } else {
        resolvedCity =
          sanitizedCity.charAt(0).toUpperCase() + sanitizedCity.slice(1);
      }
    }

    // Check cache
    const cacheKey = `${lat.toFixed(2)}_${lon.toFixed(2)}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      const elapsed = Date.now() - startTime;
      console.log(`Weather cache hit (${elapsed}ms)`);
      return new Response(JSON.stringify(cached.data), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "X-Cache": "HIT",
          "X-Response-Time": `${elapsed}ms`,
        },
      });
    }

    // Fetch with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation_probability,precipitation,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,sunrise,sunset&timezone=America/Sao_Paulo&forecast_days=7`;

    const response = await fetch(weatherUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      console.error("Weather API error:", response.status);
      return new Response(
        JSON.stringify({ error: "Erro ao buscar dados meteorológicos" }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const data = await response.json();

    if (!data.current || !data.hourly || !data.daily) {
      return new Response(
        JSON.stringify({ error: "Dados meteorológicos incompletos" }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const weatherData = {
      current: {
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        apparentTemperature: data.current.apparent_temperature,
        precipitation: data.current.precipitation,
        rain: data.current.rain,
        weatherCode: data.current.weather_code,
        windSpeed: data.current.wind_speed_10m,
        windDirection: data.current.wind_direction_10m,
      },
      hourly: data.hourly.time.slice(0, 24).map((time: string, i: number) => ({
        time,
        temperature: data.hourly.temperature_2m[i],
        precipitationProbability: data.hourly.precipitation_probability[i],
        precipitation: data.hourly.precipitation[i],
        weatherCode: data.hourly.weather_code[i],
      })),
      daily: data.daily.time.map((date: string, i: number) => ({
        date,
        weatherCode: data.daily.weather_code[i],
        tempMax: data.daily.temperature_2m_max[i],
        tempMin: data.daily.temperature_2m_min[i],
        precipitationSum: data.daily.precipitation_sum[i],
        precipitationProbability: data.daily.precipitation_probability_max[i],
        sunrise: data.daily.sunrise[i],
        sunset: data.daily.sunset[i],
      })),
      location: {
        latitude: lat,
        longitude: lon,
        city: resolvedCity,
      },
    };

    // Store in cache
    cache.set(cacheKey, {
      data: weatherData,
      expiresAt: Date.now() + CACHE_TTL,
    });

    const elapsed = Date.now() - startTime;
    console.log(`Weather fetched in ${elapsed}ms for ${resolvedCity}`);

    return new Response(JSON.stringify(weatherData), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "X-Cache": "MISS",
        "X-Response-Time": `${elapsed}ms`,
      },
    });
  } catch (error) {
    console.error(
      "Weather error:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return new Response(
      JSON.stringify({
        error: "Erro ao buscar dados meteorológicos. Tente novamente.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
