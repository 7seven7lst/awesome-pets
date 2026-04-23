import { UserRole } from "@novellia/shared/prisma/browser";
import { useAuth } from "../auth/AuthContext";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { DashboardSummary } from "../components/dashboard/DashboardSummary";
import { DashboardUpcomingDosesList } from "../components/dashboard/DashboardUpcomingDosesList";
import { DashboardVaccinesChartSection } from "../components/dashboard/DashboardVaccinesChartSection";
import { QueryState } from "../components/QueryState";
import { useDashboard } from "../hooks/useDashboard";
import { useDashboardUpcomingVaccines } from "../hooks/useDashboardUpcomingVaccines";
import { stack } from "../lib/ui-styles";

export function DashboardPage() {
  const { user } = useAuth();
  const { data, loading, error } = useDashboard();
  const vaccines = useDashboardUpcomingVaccines();

  return (
    <QueryState loading={loading} loadingText="Loading dashboard…" error={error}>
      {data ? (
        <div className={`${stack} max-w-5xl`}>
          <DashboardHeader isAdmin={user?.role === UserRole.ADMIN} />
          <DashboardSummary data={data} />
          <div className="space-y-4">
            <DashboardVaccinesChartSection chartPart={data.upcomingVaccinesChartDates} />
            <DashboardUpcomingDosesList
              payload={vaccines.payload}
              loading={vaccines.loading}
              error={vaccines.error}
              onPageChange={vaccines.setPage}
            />
          </div>
        </div>
      ) : null}
    </QueryState>
  );
}
