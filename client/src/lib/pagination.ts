export const PETS_PAGE_SIZE = 10;
export const MEDICAL_RECORDS_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

export function totalPages(totalItems: number, pageSize: number): number {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

export function parsePageParam(raw: string | null | undefined): number {
  const n = Number.parseInt(raw ?? "1", 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return n;
}

export function parsePageSizeParam(
  raw: string | null | undefined,
  defaultSize: number,
  maxSize = MAX_PAGE_SIZE,
): number {
  const n = Number.parseInt(raw ?? String(defaultSize), 10);
  if (!Number.isFinite(n) || n < 1) return defaultSize;
  return Math.min(maxSize, Math.max(1, n));
}

export function clampPage(page: number, totalPageCount: number): number {
  return Math.min(Math.max(1, page), totalPageCount);
}
