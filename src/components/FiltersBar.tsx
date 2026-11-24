import { SearchIcon } from "@/components/Icons";
import {
  CATEGORIES,
  PAYMENT_METHODS,
  type ExpenseFilters,
} from "@/types/expense";

const selectClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

export default function FiltersBar({
  filters,
  onChange,
  onReset,
  resultCount,
}: {
  filters: ExpenseFilters;
  onChange: (patch: Partial<ExpenseFilters>) => void;
  onReset: () => void;
  resultCount: number;
}) {
  const hasActiveFilters =
    Boolean(filters.search) ||
    filters.category !== "all" ||
    filters.paymentMethod !== "all" ||
    filters.dateFilter !== "all";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-3 lg:grid-cols-[minmax(220px,1.4fr)_repeat(3,minmax(140px,1fr))_auto]">
        <label className="relative block">
          <span className="sr-only">Search by title or description</span>
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={filters.search}
            onChange={(event) => onChange({ search: event.target.value })}
            placeholder="Search title or description..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </label>

        <label>
          <span className="sr-only">Filter by category</span>
          <select
            value={filters.category}
            onChange={(event) => onChange({ category: event.target.value })}
            className={selectClass}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="sr-only">Filter by payment method</span>
          <select
            value={filters.paymentMethod}
            onChange={(event) => onChange({ paymentMethod: event.target.value })}
            className={selectClass}
          >
            <option value="all">All Payment Methods</option>
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="sr-only">Filter by date</span>
          <select
            value={filters.dateFilter}
            onChange={(event) =>
              onChange({
                dateFilter: event.target.value as ExpenseFilters["dateFilter"],
              })
            }
            className={selectClass}
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </label>

        <button
          type="button"
          onClick={onReset}
          disabled={!hasActiveFilters}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reset
        </button>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Showing <span className="font-semibold text-slate-700">{resultCount}</span>{" "}
        expense{resultCount === 1 ? "" : "s"}
        {hasActiveFilters ? " for the current search and filters" : ""}.
      </p>
    </div>
  );
}
