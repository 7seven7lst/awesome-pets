import { memo } from "react";

type Props = {
  name: string;
  imageUrl?: string | null;
  size?: number;
  className?: string;
};

/**
 * Rounded avatar with optional photo; otherwise first initial (matches novellia_fullstack `PetAvatar`).
 * Wrapper clips the image so photos stay circular in table/flex layouts.
 */
export const PetAvatar = memo(function PetAvatar({ name, imageUrl, size = 40, className = "" }: Props) {
  const letter = name.trim().slice(0, 1).toUpperCase() || "?";
  const src = imageUrl?.trim();

  if (src) {
    return (
      <span
        className={`inline-flex shrink-0 overflow-hidden rounded-full bg-zinc-100 ring-1 ring-zinc-200 ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={src}
          alt=""
          width={size}
          height={size}
          draggable={false}
          className="block h-full w-full object-cover"
        />
      </span>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium text-zinc-700 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {letter}
    </div>
  );
});
