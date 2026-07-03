const LATITUDE = 25.78;
const LONGITUDE = 84.75;
const TIMEZONE = "Asia/Kolkata";
const LOCATION_LABEL = "Chhapra, Saran";

/** Rain-ish mm/day below this is treated as negligible/trace, not "recent rain." */
const MEANINGFUL_RAIN_MM = 1;
/** Above this much rain in the last day, soil is assumed still wet. */
const SOAKED_RAIN_MM = 4;

interface WeatherCodeInfo {
  label: string;
  isRain: boolean;
}

// WMO weather codes, as used by Open-Meteo.
const WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  0: { label: "Clear sky", isRain: false },
  1: { label: "Mostly clear", isRain: false },
  2: { label: "Partly cloudy", isRain: false },
  3: { label: "Overcast", isRain: false },
  45: { label: "Fog", isRain: false },
  48: { label: "Fog", isRain: false },
  51: { label: "Light drizzle", isRain: true },
  53: { label: "Drizzle", isRain: true },
  55: { label: "Dense drizzle", isRain: true },
  56: { label: "Freezing drizzle", isRain: true },
  57: { label: "Freezing drizzle", isRain: true },
  61: { label: "Light rain", isRain: true },
  63: { label: "Rain", isRain: true },
  65: { label: "Heavy rain", isRain: true },
  66: { label: "Freezing rain", isRain: true },
  67: { label: "Freezing rain", isRain: true },
  71: { label: "Light snow", isRain: false },
  73: { label: "Snow", isRain: false },
  75: { label: "Heavy snow", isRain: false },
  77: { label: "Snow grains", isRain: false },
  80: { label: "Rain showers", isRain: true },
  81: { label: "Rain showers", isRain: true },
  82: { label: "Violent rain showers", isRain: true },
  85: { label: "Snow showers", isRain: false },
  86: { label: "Snow showers", isRain: false },
  95: { label: "Thunderstorm", isRain: true },
  96: { label: "Thunderstorm with hail", isRain: true },
  99: { label: "Thunderstorm with hail", isRain: true },
};

function describeWeatherCode(code: number): WeatherCodeInfo {
  return WEATHER_CODES[code] ?? { label: "Unsettled", isRain: false };
}

export type WeatherIconKind = "sun" | "cloud" | "rain";

function iconKindFor(condition: WeatherCodeInfo): WeatherIconKind {
  if (condition.isRain) return "rain";
  if (condition.label === "Clear sky" || condition.label === "Mostly clear") return "sun";
  return "cloud";
}

interface WateringAdvice {
  shouldWater: boolean;
  advice: string;
}

function getWateringAdvice(input: {
  isRainingNow: boolean;
  todayRainMm: number;
  yesterdayRainMm: number;
}): WateringAdvice {
  const recentRainMm = input.todayRainMm + input.yesterdayRainMm;

  if (input.isRainingNow) {
    return {
      shouldWater: false,
      advice: "Raining right now — skip watering and check borderline buckets for standing water.",
    };
  }
  if (recentRainMm >= SOAKED_RAIN_MM) {
    return {
      shouldWater: false,
      advice: `${recentRainMm.toFixed(1)}mm of rain in the last day — soil's likely still wet, hold off today.`,
    };
  }
  if (recentRainMm >= MEANINGFUL_RAIN_MM) {
    return {
      shouldWater: true,
      advice: `Light rain recently (${recentRainMm.toFixed(1)}mm) — check soil before watering direct-sown buckets.`,
    };
  }
  return {
    shouldWater: true,
    advice: "No recent rain — water as scheduled, especially cup-grown seedlings.",
  };
}

export interface WeatherSnapshot {
  location: string;
  temperatureC: number;
  condition: string;
  icon: WeatherIconKind;
  shouldWater: boolean;
  advice: string;
}

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    precipitation: number;
    weather_code: number;
  };
  daily: {
    precipitation_sum: number[];
  };
}

/** Fetches current conditions for Chhapra, Saran. Returns null on any failure so a
 *  flaky/unreachable weather API never takes down the rest of the dashboard. */
export async function getMonsoonWeather(): Promise<WeatherSnapshot | null> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(LATITUDE));
  url.searchParams.set("longitude", String(LONGITUDE));
  url.searchParams.set("current", "temperature_2m,precipitation,weather_code");
  url.searchParams.set("daily", "precipitation_sum");
  url.searchParams.set("past_days", "1");
  url.searchParams.set("forecast_days", "1");
  url.searchParams.set("timezone", TIMEZONE);

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
    if (!res.ok) return null;

    const data = (await res.json()) as OpenMeteoResponse;
    const condition = describeWeatherCode(data.current.weather_code);
    const isRainingNow = condition.isRain || data.current.precipitation > 0;

    const [yesterdayRainMm = 0, todayRainMm = 0] = data.daily.precipitation_sum;
    const { shouldWater, advice } = getWateringAdvice({ isRainingNow, todayRainMm, yesterdayRainMm });

    return {
      location: LOCATION_LABEL,
      temperatureC: Math.round(data.current.temperature_2m),
      condition: condition.label,
      icon: iconKindFor(condition),
      shouldWater,
      advice,
    };
  } catch {
    return null;
  }
}
