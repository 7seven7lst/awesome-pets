import { DateTime } from "luxon";

export function parseIsoDateTimeToDate(isoDateTime: string): Date {
  const dt = DateTime.fromISO(isoDateTime);
  if (!dt.isValid) {
    throw new RangeError(`Invalid ISO datetime: ${isoDateTime}`);
  }
  return dt.toJSDate();
}
