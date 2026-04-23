/** `YYYY-MM-DD` for a calendar day in the given IANA zone (matches fullstack `formatHtmlCalendarDate`). */
export function formatHtmlCalendarDate(d: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/** Converts `<input type="date">` value to local-midnight ISO datetime. */
export function localDateInputToIso(value: string): string {
  const [year, month, day] = value.split("-").map((n) => Number.parseInt(n, 10));
  return new Date(year, month - 1, day).toISOString();
}

/** Formats an ISO datetime for `<input type="date">` using browser local date. */
export function isoToLocalDateInput(value: string): string {
  const d = new Date(value);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
