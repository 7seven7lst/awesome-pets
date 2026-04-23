import { useCallback, useEffect, useState } from "react";
import { getPet } from "../api";
import { apiError } from "../lib/apiError";
import type { PetDetail } from "../types";

export function usePet(petId: string | undefined) {
  const [pet, setPet] = useState<PetDetail | null>(null);
  const [loading, setLoading] = useState(Boolean(petId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!petId) {
      setPet(null);
      setLoading(false);
      setError(null);
      return;
    }
    let cancelled = false;
    setPet(null);
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const p = await getPet(petId);
        if (!cancelled) setPet(p);
      } catch (e) {
        if (!cancelled) setError(apiError(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [petId]);

  const refetch = useCallback(async () => {
    if (!petId) return;
    setLoading(true);
    setError(null);
    try {
      const p = await getPet(petId);
      setPet(p);
    } catch (e) {
      setError(apiError(e));
    } finally {
      setLoading(false);
    }
  }, [petId]);

  return { pet, loading, error, refetch };
}
