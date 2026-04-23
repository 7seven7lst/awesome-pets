import { useMemo } from "react";
import type { DashboardData } from "../../hooks/useDashboard";
import { card, h2, muted } from "../../lib/ui-styles";
import { DashboardErrorAlert } from "./DashboardErrorAlert";
import { UpcomingVaccinesByDayChart } from "./charts";

type ChartPart = DashboardData["upcomingVaccinesChartDates"];

export function DashboardVaccinesChartSection({ chartPart }: { chartPart: ChartPart }) {
  const chartNextDueAtIso = useMemo(() => {
    if (chartPart.status !== "success") return [];
    return chartPart.data.filter(Boolean);
  }, [chartPart]);

  return (
    <div className={card}>
      <h2 className={h2}>Upcoming vaccines (30 days)</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Counts of doses due per day in the next 30 days. The table below is paginated; the chart uses all
        doses in this window.
      </p>
      {chartPart.status === "error" ? (
        <DashboardErrorAlert part={chartPart} className="mt-4" />
      ) : chartNextDueAtIso.length === 0 ? (
        <p className={`${muted} mt-4`}>No upcoming vaccines in the next 30 days.</p>
      ) : (
        <>
          <p className="mb-2 mt-4 text-sm font-medium text-zinc-700">Doses due by day</p>
          <UpcomingVaccinesByDayChart chartNextDueAtIso={chartNextDueAtIso} />
        </>
      )}
    </div>
  );
}
