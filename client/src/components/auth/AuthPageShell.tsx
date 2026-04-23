import { memo, type ReactNode } from "react";
import { muted, narrowPage } from "../../lib/ui-styles";

export type AuthPageShellProps = {
  loading: boolean;
  children: ReactNode;
};

function AuthBrand() {
  return (
    <header className="mb-10 border-b border-zinc-200 pb-8">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-5">
        <img src="/paw.svg" alt="" className="h-14 w-14 shrink-0" width={56} height={56} />
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Novellia Pets</h1>
          <p className={`${muted} mt-1.5 max-w-md text-sm leading-relaxed`}>
            Track vaccinations, allergies, and health history for your pets in one place.
          </p>
        </div>
      </div>
    </header>
  );
}

export const AuthPageShell = memo(function AuthPageShell({ loading, children }: AuthPageShellProps) {
  return (
    <div className={`min-h-screen bg-zinc-50 ${narrowPage}`}>
      <AuthBrand />
      {loading ? <p className={muted}>Checking session…</p> : children}
    </div>
  );
});
