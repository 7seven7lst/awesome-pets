/** Normalizes any caught value to a display string. Replaces the repeated inline ternary across hooks/pages. */
export function apiError(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}
