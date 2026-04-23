import { memo, type ReactNode } from "react";
import { muted, narrowPage } from "../../lib/ui-styles";

export type AuthPageShellProps = {
  loading: boolean;
  children: ReactNode;
};

export const AuthPageShell = memo(function AuthPageShell({ loading, children }: AuthPageShellProps) {
  return (
    <div className={`min-h-screen bg-zinc-50 ${narrowPage}`}>
      {loading ? <p className={muted}>Checking session…</p> : children}
    </div>
  );
});
