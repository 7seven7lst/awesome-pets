/**
 * Tailwind class bundles aligned with novellia_fullstack:
 * primary actions use black buttons; links stay blue; nav is gray-500 (see Layout).
 */

export const page = "mx-auto max-w-5xl px-4 py-8";
export const narrowPage = "mx-auto max-w-md px-4 py-10";

export const h1 = "text-2xl font-semibold tracking-tight text-zinc-900";
export const h2 = "text-lg font-semibold text-zinc-900";

export const h3 = "text-base font-semibold text-zinc-900";

export const muted = "text-sm text-zinc-500";

/** Card / panel — same idea as fullstack `elevatedSurfaceClass`. */
export const card = "rounded-lg border border-zinc-200 bg-white p-5 shadow-sm";

export const stack = "flex flex-col gap-4";
export const row = "flex flex-wrap items-center gap-2";

export const label = "flex flex-col gap-1.5 text-sm font-medium text-zinc-700";

export const field =
  "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20";

export const textarea = `${field} min-h-[96px] resize-y`;

/** Matches fullstack auth / pet forms: `rounded bg-black … text-white`. */
export const btnPrimary =
  "inline-flex items-center justify-center rounded bg-black px-4 py-2 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";

/** Full-width primary (sign-in / sign-up forms). */
export const btnPrimaryBlock = `${btnPrimary} w-full`;

export const btnOutline =
  "inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50";

export const btnDanger =
  "inline-flex items-center justify-center rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-800 shadow-sm transition-colors hover:bg-red-100 disabled:opacity-50";

export const banner = "rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800";

export const pill =
  "inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-900";

export const tableWrap = "overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm";

export const table = "w-full divide-y divide-zinc-200 text-sm";

export const th = "bg-zinc-50 px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500";

export const td = "px-3 py-3 align-top text-zinc-800";

export const link = "text-sm font-medium text-blue-600 hover:text-blue-800";

export const linkMuted = "text-sm text-zinc-500 underline-offset-4 hover:text-zinc-800 hover:underline";

export const dialogBackdrop =
  "fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4 backdrop-blur-[1px]";

export const dialogPanel = "w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl";

export const dialogActions = "mt-6 flex justify-end gap-2";

/** Top nav bar — matches fullstack `TopNav` (logo + desktop / mobile regions). */
export const topNav =
  "flex w-full items-center justify-between bg-gray-500 p-6 text-white shadow-sm";

/** Mobile menu panel under the hamburger (fullstack gradient card). */
export const topNavMobilePanel =
  "absolute right-0 top-[calc(100%+0.75rem)] z-50 min-w-[200px] rounded-xl bg-gradient-to-br from-zinc-900 to-black p-6 shadow-lg ring-1 ring-white/10";

/** Sign out inside the mobile menu — full width, left-aligned label. */
export const topNavSignOutMobile =
  "w-full rounded-md border border-white/30 px-3 py-2 text-left text-sm text-white transition-colors hover:bg-white/10 disabled:opacity-50";

export const topNavLogo = "h-10 w-10 shrink-0 rounded-full bg-gray-200";

/** Nav links on gray bar — matches `navLinkClass`. */
export function topNavLinkClass(isActive: boolean): string {
  return [
    "text-[16px] text-white transition-opacity",
    isActive ? "font-semibold" : "font-normal hover:opacity-90",
  ].join(" ");
}

/** Top bar control for browser history back (previous URL). */
export const topNavBack =
  "inline-flex shrink-0 items-center gap-1 rounded-md border border-white/30 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40";

/** Sign out on gray bar — matches fullstack `SignOutButton` wrapper. */
export const topNavSignOut =
  "rounded-md border border-white/30 px-3 py-1.5 text-sm text-white transition-colors hover:bg-white/10 disabled:opacity-50";
