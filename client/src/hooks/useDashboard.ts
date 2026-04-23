import { useEffect, useState } from "react";
import { getDashboard } from "../api";
import { apiError } from "../lib/apiError";

export type DashboardData = Awaited<ReturnType<typeof getDashboard>>;

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const d = await getDashboard();
        if (!cancelled) setData(d);
      } catch (e) {
        if (!cancelled) setError(apiError(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
