/** Browser default IANA zone; safe for preprocessors used in client forms. */
export function getBrowserIanaTimeZone(): string {
  if (typeof Intl === "undefined" || typeof Intl.DateTimeFormat === "undefined") {
    return "UTC";
  }
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
