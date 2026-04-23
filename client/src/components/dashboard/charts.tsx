import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { useMemo } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { aggregateNextDueIsoDates, formatShortChartDate } from "../../lib/dashboard-chart-dates";
import { browserTimeZone } from "../../lib/timezone";
// https://react-chartjs-2.js.org/
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export type PetsByTypeSlice = { animalType: string; count: number };

const PIE_COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#64748b"];

type PieProps = {
  petsByType: PetsByTypeSlice[];
};

export function PetsByTypePieChart({ petsByType }: PieProps) {
  const data = useMemo(
    () => ({
      labels: petsByType.map((p) => p.animalType.replace(/_/g, " ")),
      datasets: [
        {
          data: petsByType.map((p) => p.count),
          backgroundColor: petsByType.map((_, i) => PIE_COLORS[i % PIE_COLORS.length]),
          borderWidth: 0,
        },
      ],
    }),
    [petsByType],
  );


  const options: ChartOptions<"doughnut"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "45%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 12,
            padding: 12,
            font: { size: 12, family: "system-ui, sans-serif" },
            color: "#52525b",
          },
        },
        tooltip: {
          callbacks: {
            label(ctx) {
              const values = ctx.dataset.data as number[];
              const value = values[ctx.dataIndex] ?? 0;
              const total = values.reduce((a, b) => a + b, 0);
              const pct = total ? Math.round((value / total) * 100) : 0;
              return `${value} pets (${pct}%)`;
            },
          },
        },
      },
    }),
    [],
  );

  if (!petsByType.length) {
    return <p className="text-sm text-zinc-500">No pets in scope yet.</p>;
  }

  return (
    <div className="relative mx-auto h-[300px] w-full max-w-lg">
      <Doughnut data={data} options={options} />
    </div>
  );
}

type ByDayChartProps = {
  chartNextDueAtIso: string[];
};

export function UpcomingVaccinesByDayChart({ chartNextDueAtIso }: ByDayChartProps) {
  const viewerTz = browserTimeZone();
  const byDate = useMemo(
    () => aggregateNextDueIsoDates(chartNextDueAtIso, viewerTz),
    [chartNextDueAtIso, viewerTz],
  );

  const barData = useMemo(
    () => ({
      labels: byDate.map((d) => formatShortChartDate(d.date)),
      datasets: [
        {
          label: "Doses due",
          data: byDate.map((d) => d.count),
          backgroundColor: "#1d4ed8",
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    }),
    [byDate],
  );

  const barOptions: ChartOptions<"bar"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title(items) {
              return items[0]?.label ?? "";
            },
            label(ctx) {
              const n = ctx.parsed.y ?? 0;
              return `${n} vaccine${n === 1 ? "" : "s"} due`;
            },
          },
        },
      },
      scales: {
        x: {
          title: { display: true, text: "Due date", font: { size: 11 } },
          ticks: { maxRotation: 45, minRotation: 30, font: { size: 11 } },
          grid: { display: false },
        },
        y: {
          title: { display: true, text: "Count", font: { size: 11 } },
          beginAtZero: true,
          ticks: { stepSize: 1, precision: 0 },
          grid: { color: "#e4e4e7" },
        },
      },
    }),
    [],
  );

  if (chartNextDueAtIso.length === 0 || byDate.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        No dated &ldquo;next due&rdquo; entries in this window (records may be missing a due date).
      </p>
    );
  }

  return (
    <div className="relative h-[280px] w-full">
      <Bar data={barData} options={barOptions} />
    </div>
  );
}
