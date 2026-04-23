import { apiClient } from "../lib/apiClient";

export async function apiGet<T>(path: string): Promise<T> {
  const { data } = await apiClient.get<T>(path);
  return data;
}

export async function apiSend<T>(path: string, method: string, body?: unknown): Promise<T> {
  const { data } = await apiClient.request<T>({
    url: path,
    method,
    data: body === undefined ? undefined : body,
  });
  return data;
}
