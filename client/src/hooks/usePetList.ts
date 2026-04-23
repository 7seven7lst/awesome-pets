import { useEffect, useLayoutEffect, useState } from "react";
import { listPets } from "../api";
import { apiError } from "../lib/apiError";
import { PETS_PAGE_SIZE } from "../lib/pagination";
import type { AnimalType, PetSummary } from "../types";

export type PetListMeta = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export function usePetList(
  filters: { query: string; animalType: AnimalType | "" },
  options: { pageSize?: number } = {},
) {
  const pageSize = options.pageSize ?? PETS_PAGE_SIZE;

  const [page, setPage] = useState(1);
  const [pets, setPets] = useState<PetSummary[]>([]);
  const [listMeta, setListMeta] = useState<PetListMeta>({
    total: 0,
    page: 1,
    pageSize,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    setPage(1);
  }, [filters.query, filters.animalType]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const requestedPage = page;
      try {
        const res = await listPets({
          query: filters.query || undefined,
          animalType: filters.animalType || undefined,
          page: requestedPage,
          pageSize,
        });
        if (cancelled) return;
        setPets(res.pets);
        setListMeta({
          total: res.total,
          page: res.page,
          pageSize: res.pageSize,
          totalPages: res.totalPages,
        });
        if (res.page !== requestedPage) {
          setPage(res.page);
        }
      } catch (e) {
        if (!cancelled) setError(apiError(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filters.query, filters.animalType, page, pageSize]);

  return { pets, listMeta, loading, error, page, setPage, pageSize };
}
