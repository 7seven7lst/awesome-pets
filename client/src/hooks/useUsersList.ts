import { useEffect, useState } from "react";
import { listUsers } from "../api";
import { apiError } from "../lib/apiError";
import type { UserSummary } from "../types";

export function useUsersList(enabled: boolean) {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setUsers([]);
      setError(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const u = await listUsers();
        if (!cancelled) setUsers(u.users);
      } catch (e) {
        if (!cancelled) setError(apiError(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { users, error };
}
