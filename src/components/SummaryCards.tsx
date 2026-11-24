import {
  ChartIcon,
  TrophyIcon,
  WalletIcon,
} from "@/components/Icons";
import { formatCurrency } from "@/lib/format";
import type { ExpenseSummary } from "@/types/expense";

const cards = [
  {
    key: "totalCount",
    label: "Total Expenses",
    icon: ChartIcon,
    accent: "bg-indigo-50 text-indigo-600",
    format: (value: number) => value.toLocaleString("en-IN"),
  },
  {
    key: "totalAmount",
    label: "Total Spent",
    icon: WalletIcon,
    accent: "bg-emerald-50 text-emerald-600",
    format: formatCurrency,
  },
  {
    key: "highestAmount",
    label: "Highest Expense",
    icon: TrophyIcon,
    accent: "bg-amber-50 text-amber-600",
    format: formatCurrency,
  },
  {
    key: "averageAmount",
    label: "Average Expense",
    icon: ChartIcon,
    accent: "bg-sky-50 text-sky-600",
    format: formatCurrency,
  },
] as const;

export default function SummaryCards({
  summary,
  loading,
}: {
  summary: ExpenseSummary;
  loading: boolean;
}) {
  return (
    <section
      aria-label="Expense summary"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {cards.map((card) => {
        const Icon = card.icon;
        const value = summary[card.key];
        return (
          <div
            key={card.key}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-slate-500">{card.label}</p>
                {loading ? (
                  <div className="mt-3 h-7 w-24 animate-pulse rounded-md bg-slate-100" />
                ) : (
                  <p className="mt-2 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                    {card.format(value)}
                  </p>
                )}
              </div>
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.accent}`}
              >
                <Icon className="h-5 w-5" />
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
