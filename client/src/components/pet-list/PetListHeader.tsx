import { memo } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../lib/routes";
import { btnPrimary, h1, row } from "../../lib/ui-styles";

export const PetListHeader = memo(function PetListHeader() {
  return (
    <div className={`${row} justify-between gap-4`}>
      <h1 className={h1}>Pets</h1>
      <Link to={ROUTES.petNew} className={`${btnPrimary} no-underline`}>
        Add pet
      </Link>
    </div>
  );
});
