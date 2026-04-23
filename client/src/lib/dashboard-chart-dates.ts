import { formatHtmlCalendarDate } from "./calendar-date";

export type VaccineDueByCalendarDate = { date: string; count: number };

/**
 * Buckets ISO datetimes into calendar dates in the viewer's time zone and counts occurrences.
 * Used for the upcoming-vaccines-by-day bar chart.
 */
export function aggregateNextDueIsoDates(
  nextDueAtIso: string[],
  viewerTimeZone: string,
): VaccineDueByCalendarDate[] {
  const map = new Map<string, number>();
  for (const iso of nextDueAtIso) {
    const key = formatHtmlCalendarDate(new Date(iso), viewerTimeZone);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}

/** `YYYY-MM-DD` → short label for chart axis (e.g. "Apr 22"). */
export function formatShortChartDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
