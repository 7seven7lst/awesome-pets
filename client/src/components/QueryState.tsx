import { memo, type ReactNode } from "react";
import { SpinnerWithLabel } from "./Spinner";
import { banner, muted } from "../lib/ui-styles";

export type QueryStateProps = {
  loading?: boolean;
  loadingText?: string;
  error?: string | null;
  /** When true and not loading/error, renders emptyText instead of children. */
  empty?: boolean;
  emptyText?: string;
  children: ReactNode;
};

/**
 * Shared loading / error / empty guard.
 * Renders children only when all conditions pass; otherwise shows the first matching fallback.
 */
export const QueryState = memo(function QueryState({
  loading,
  loadingText = "Loading…",
  error,
  empty,
  emptyText = "No results.",
  children,
}: QueryStateProps) {
  if (loading) return <SpinnerWithLabel message={loadingText} className="w-full" />;
  if (error) return <div className={banner}>{error}</div>;
  if (empty) return <p className={muted}>{emptyText}</p>;
  return <>{children}</>;
});
