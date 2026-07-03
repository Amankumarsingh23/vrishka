import type { WeatherIconKind, WeatherSnapshot } from "@/lib/weather";
import { cn } from "@/lib/utils";

function CloudRainIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#3E7A4B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <path d="M14,26 C9,26 6,22.5 6,18.5 C6,14.5 9.2,11.5 13,11.5 C13.8,11.5 14.6,11.6 15.3,11.9 C17,8.4 20.6,6 24.8,6 C30.6,6 35.3,10.6 35.5,16.3 C39.4,17 42,20.2 42,24 C42,28.4 38.4,32 34,32 L14,32 Z" />
      <path d="M16,37 L14,41" />
      <path d="M24,37 L22,41" />
      <path d="M32,37 L30,41" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#3E7A4B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <path d="M14,30 C9,30 6,26.5 6,22.5 C6,18.5 9.2,15.5 13,15.5 C13.8,15.5 14.6,15.6 15.3,15.9 C17,12.4 20.6,10 24.8,10 C30.6,10 35.3,14.6 35.5,20.3 C39.4,21 42,24.2 42,28 C42,32.4 38.4,36 34,36 L14,36 Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#3E7A4B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <circle cx="24" cy="24" r="9" />
      <path d="M24,4 L24,9" />
      <path d="M24,39 L24,44" />
      <path d="M4,24 L9,24" />
      <path d="M39,24 L44,24" />
      <path d="M9.5,9.5 L13,13" />
      <path d="M35,35 L38.5,38.5" />
      <path d="M38.5,9.5 L35,13" />
      <path d="M13,35 L9.5,38.5" />
    </svg>
  );
}

const ICONS: Record<WeatherIconKind, () => JSX.Element> = {
  sun: SunIcon,
  cloud: CloudIcon,
  rain: CloudRainIcon,
};

export function MonsoonWeatherCard({
  weather,
  delay = 0,
}: {
  weather: WeatherSnapshot | null;
  delay?: number;
}) {
  if (!weather) {
    return (
      <div
        className="animate-fadeUp rounded-card border border-border bg-surface p-6 shadow-card"
        style={{ animationDelay: `${delay}s` }}
      >
        <p className="font-sans text-caption uppercase text-gold-dark">Weather</p>
        <h2 className="mt-1 font-serif text-h3 text-ink">Forecast unavailable</h2>
        <p className="mt-3 font-sans text-sm text-body">
          Couldn&apos;t reach the forecast just now — water based on how the soil looks
          until this comes back.
        </p>
      </div>
    );
  }

  const Icon = ICONS[weather.icon];

  return (
    <div
      className="animate-fadeUp rounded-card border border-border bg-surface p-6 shadow-card"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-sans text-caption uppercase text-gold-dark">{weather.location}</p>
          <h2 className="mt-1 font-serif text-h3 text-ink">{weather.condition}</h2>
        </div>
        <Icon />
      </div>

      <p className="mt-2 font-serif text-stat leading-none text-ink">{weather.temperatureC}°C</p>

      <div
        className={cn(
          "mt-4 rounded-card-sm border px-4 py-3",
          weather.shouldWater ? "border-sage/40 bg-sage/10" : "border-accent/40 bg-accent/10",
        )}
      >
        <p className="font-sans text-xs font-semibold uppercase tracking-wide text-muted">
          {weather.shouldWater ? "OK to water today" : "Skip watering today"}
        </p>
        <p className="mt-1 font-sans text-sm text-body">{weather.advice}</p>
      </div>
    </div>
  );
}
