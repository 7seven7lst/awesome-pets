import { useCallback, useEffect, useState } from "react";
import { getDashboardUpcomingVaccines } from "../api";
import { apiError } from "../lib/apiError";
import { MEDICAL_RECORDS_PAGE_SIZE } from "../lib/pagination";

export type DashboardUpcomingVaccinesPayload = Awaited<ReturnType<typeof getDashboardUpcomingVaccines>>;

export function useDashboardUpcomingVaccines(options: { pageSize?: number } = {}) {
  const pageSize = options.pageSize ?? MEDICAL_RECORDS_PAGE_SIZE;

  const [page, setPage] = useState(1);
  const [payload, setPayload] = useState<DashboardUpcomingVaccinesPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const requestedPage = page;
    try {
      const r = await getDashboardUpcomingVaccines({ page: requestedPage, pageSize });
      setPayload(r);
      if (r.page !== requestedPage) {
        setPage(r.page);
      }
    } catch (e) {
      setError(apiError(e));
      setPayload(null);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { payload, loading, error, refetch, page, setPage, pageSize };
}
