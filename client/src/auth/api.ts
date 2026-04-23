import { AUTH_V1_PREFIX } from "../lib/apiBase";
import { apiClient } from "../lib/apiClient";
import type { AuthUser } from "../types";

export async function fetchMe(): Promise<AuthUser | null> {
  const { data } = await apiClient.get<{ user: AuthUser | null }>(`${AUTH_V1_PREFIX}/me`);
  return data.user;
}

export async function signInRequest(email: string, password: string): Promise<AuthUser> {
  const { data } = await apiClient.post<{ user: AuthUser }>(`${AUTH_V1_PREFIX}/sign-in`, {
    email,
    password,
  });
  return data.user;
}

export async function signUpRequest(name: string, email: string, password: string): Promise<AuthUser> {
  const { data } = await apiClient.post<{ user: AuthUser }>(`${AUTH_V1_PREFIX}/sign-up`, {
    name,
    email,
    password,
  });
  return data.user;
}

export async function signOutRequest(): Promise<void> {
  await apiClient.post(`${AUTH_V1_PREFIX}/sign-out`);
}
