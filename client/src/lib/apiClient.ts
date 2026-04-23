import axios, { type AxiosError } from "axios";
import { toast } from "react-toastify";

export const apiClient = axios.create({
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ error?: string }>) => {
    const status = error.response?.status;
    const message = error.response?.data?.error ?? error.message ?? "Request failed";

    if (status === undefined || status >= 500) {
      // Surface backend/network failures globally so users always get visible feedback.
      toast.error(message, { toastId: `server-error:${message}` });
    }

    return Promise.reject(new Error(message));
  },
);
