import { API_V1_PREFIX } from "../lib/apiBase";
import { apiGet } from "./base";
import type { UserSummary } from "../types";

export function listUsers() {
  return apiGet<{ users: UserSummary[] }>(`${API_V1_PREFIX}/users`);
}
