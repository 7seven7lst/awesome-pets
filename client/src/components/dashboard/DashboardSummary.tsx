import { useMemo } from "react";
import type { DashboardData } from "../../hooks/useDashboard";
import { animalTypeLabel } from "../../lib/labels";
import { card } from "../../lib/ui-styles";
import type { AnimalType } from "../../types";
import { DashboardErrorAlert } from "./DashboardErrorAlert";
import { PetsByTypePieChart } from "./charts";

export function DashboardSummary({ data }: { data: DashboardData }) {
  const petsByTypeChart = useMemo(() => {
    if (data.petsByType.status !== "success") return [];
    return data.petsByType.data.map((row) => ({
      animalType: animalTypeLabel(row.animalType as AnimalType),
      count: row.count,
    }));
  }, [data.petsByType]);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className={`${card} bg-gradient-to-br from-white to-zinc-50`}>
        <p className="text-sm font-medium text-zinc-500">Total pets</p>
        {data.totalPets.status === "success" ? (
          <>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-zinc-900">{data.totalPets.data}</p>
            <p className="mt-3 text-xs text-zinc-500">In your current scope (all pets for admins).</p>
          </>
        ) : (
          <DashboardErrorAlert part={data.totalPets} className="mt-2" />
        )}
      </div>
      <div className={`${card} lg:col-span-2`}>
        <p className="mb-1 text-sm font-medium text-zinc-700">Pets by animal type</p>
        <p className="mb-2 text-xs text-zinc-500">Share of pets in each category</p>
        {data.petsByType.status === "success" ? (
          <PetsByTypePieChart petsByType={petsByTypeChart} />
        ) : (
          <DashboardErrorAlert part={data.petsByType} />
        )}
      </div>
    </div>
  );
}
