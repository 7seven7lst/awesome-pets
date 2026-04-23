import { memo, type ReactNode } from "react";
import { h1, muted } from "../../lib/ui-styles";

export type AuthPageHeaderProps = {
  title: string;
  subtitle: ReactNode;
};

export const AuthPageHeader = memo(function AuthPageHeader({ title, subtitle }: AuthPageHeaderProps) {
  return (
    <>
      <h2 className={h1}>{title}</h2>
      <p className={`${muted} mt-2`}>{subtitle}</p>
    </>
  );
});
