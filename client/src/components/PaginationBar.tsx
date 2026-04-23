import { memo } from "react";

const btnClass =
  "rounded border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-800 hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40";

export type PaginationBarProps = {
  currentPage: number;
  totalPages: number;
  ariaLabel: string;
  className?: string;
  onPageChange: (page: number) => void;
};

export const PaginationBar = memo(function PaginationBar({
  currentPage,
  totalPages,
  ariaLabel,
  className,
  onPageChange,
}: PaginationBarProps) {
  if (totalPages <= 1) {
    return null;
  }

  const navClass =
    className ?? "flex flex-wrap items-center justify-center gap-3 border-t border-zinc-100 pt-4";

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <nav className={navClass} aria-label={ariaLabel}>
      <button
        type="button"
        className={btnClass}
        disabled={!canPrev}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      <span className="text-sm text-zinc-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        type="button"
        className={btnClass}
        disabled={!canNext}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </nav>
  );
});
