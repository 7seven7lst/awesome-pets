import { memo } from "react";

const sizeClasses = {
  sm: "h-5 w-5 border-2",
  md: "h-10 w-10 border-[3px]",
  lg: "h-14 w-14 border-4",
} as const;

const toneClasses = {
  default: "border-zinc-200 border-t-zinc-800",
  onDark: "border-white/25 border-t-white",
} as const;

export type SpinnerProps = {
  size?: keyof typeof sizeClasses;
  /** `onDark` — for primary (black) buttons so the ring contrasts. */
  tone?: keyof typeof toneClasses;
  /** When true, hides the graphic from assistive tech (parent supplies the label). */
  decorative?: boolean;
  /** Label for assistive tech when not decorative */
  label?: string;
  className?: string;
};

/** Accessible indeterminate loading ring. */
export const Spinner = memo(function Spinner({
  size = "md",
  tone = "default",
  decorative = false,
  label = "Loading",
  className = "",
}: SpinnerProps) {
  const ringClass = `inline-block shrink-0 rounded-full ${toneClasses[tone]} animate-spin ${sizeClasses[size]} ${className}`.trim();
  if (decorative) {
    return <span aria-hidden className={ringClass} />;
  }
  return (
    <span role="status" aria-live="polite" aria-label={label} className={ringClass} />
  );
});

export type SpinnerWithLabelProps = {
  message: string;
  /** Larger layout for page-level loading */
  size?: "md" | "lg";
  className?: string;
};

/** Centered spinner + caption for empty areas and full-page gates. */
export const SpinnerWithLabel = memo(function SpinnerWithLabel({
  message,
  size = "lg",
  className = "",
}: SpinnerWithLabelProps) {
  const spinnerSize = size === "lg" ? "lg" : "md";
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 rounded-lg border border-zinc-200 bg-zinc-50/80 px-6 py-10 shadow-sm ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={message}
    >
      <Spinner size={spinnerSize} decorative />
      <p className="text-center text-sm font-semibold text-zinc-800" aria-hidden>
        {message}
      </p>
    </div>
  );
});

export type SpinnerInlineProps = {
  message: string;
  className?: string;
};

/** Compact row: small spinner + label for in-card loading. */
export const SpinnerInline = memo(function SpinnerInline({ message, className = "" }: SpinnerInlineProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={message}
    >
      <Spinner size="sm" decorative />
      <span className="text-sm font-medium text-zinc-800">{message}</span>
    </div>
  );
});
