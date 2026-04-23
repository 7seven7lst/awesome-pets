import { memo } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../lib/routes";
import { btnPrimary, h1, muted } from "../../lib/ui-styles";

export const DashboardHeader = memo(function DashboardHeader({ isAdmin }: { isAdmin: boolean }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className={h1}>Dashboard</h1>
        <p className={`${muted} mt-2`}>
          {isAdmin
            ? "Organization-wide statistics (all pets)."
            : "Statistics for pets you own."}
        </p>
      </div>
      <Link to={ROUTES.petNew} className={`${btnPrimary} inline-flex no-underline`}>
        Add pet
      </Link>
    </div>
  );
});
