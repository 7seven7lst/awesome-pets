/** Calendar `YYYY-MM-DD` for "today" in an IANA zone (no Luxon; matches server rules for DOB checks). */
export function todayIsoDateInZone(timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
