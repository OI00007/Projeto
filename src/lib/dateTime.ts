export const TZ = "America/Sao_Paulo";

export function nowBrasilia(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: TZ }));
}

export function formatDateBrasilia(date: string | Date, options: Intl.DateTimeFormatOptions = {}): string {
  let d: Date;
  if (typeof date === "string") {
    d = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T12:00:00-03:00`) : new Date(date);
  } else { d = date; }
  return new Intl.DateTimeFormat("pt-BR", { timeZone: TZ, day: "2-digit", month: "2-digit", year: "numeric", ...options }).format(d);
}

export function getDayNameBrasilia(dateStr: string): string {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: TZ, weekday: "long" }).format(new Date(`${dateStr}T12:00:00-03:00`));
}

export function formatTimeBrasilia(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: TZ, hour: "2-digit", minute: "2-digit" }).format(date);
}

export function formatDateTimeBrasilia(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", { timeZone: TZ, day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(d);
}

export function getCurrentHarvestYear(): string {
  const now = nowBrasilia();
  const month = now.getMonth() + 1;
  const year  = now.getFullYear();
  const start = month >= 10 ? year : year - 1;
  return `Safra ${start}/${(start + 1).toString().slice(-2)}`;
}

export function getCurrentYear(): number {
  return nowBrasilia().getFullYear();
}
