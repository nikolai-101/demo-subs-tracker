export function formatRelativeDays(days: number): string {
  if (days === 0) return "сегодня";
  if (days === 1) return "завтра";
  if (days === -1) return "вчера";
  if (days < 0) return `${Math.abs(days)} дн. назад`;
  return `через ${days} дн.`;
}

const CURRENCY_FORMATTERS = new Map<string, Intl.NumberFormat>();

export function formatMoney(amount: number, currency: string): string {
  let fmt = CURRENCY_FORMATTERS.get(currency);
  if (!fmt) {
    try {
      fmt = new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      });
    } catch {
      fmt = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 });
    }
    CURRENCY_FORMATTERS.set(currency, fmt);
  }
  return fmt.format(amount);
}

export function formatDateRu(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(y, m - 1, d));
}
