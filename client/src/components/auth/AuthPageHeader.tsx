import { memo, type ReactNode } from "react";
import { h1, muted } from "../../lib/ui-styles";

export type AuthPageHeaderProps = {
  title: string;
  subtitle: ReactNode;
};

export const AuthPageHeader = memo(function AuthPageHeader({ title, subtitle }: AuthPageHeaderProps) {
  return (
    <>
      <h1 className={h1}>{title}</h1>
      <p className={`${muted} mt-2`}>{subtitle}</p>
    </>
  );
});
