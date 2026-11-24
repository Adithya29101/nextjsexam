import {
  EditIcon,
  InboxIcon,
  TrashIcon,
} from "@/components/Icons";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Category, Expense, PaymentMethod } from "@/types/expense";

const categoryStyles: Record<Category, string> = {
  Food: "bg-orange-50 text-orange-700 ring-orange-100",
  Transportation: "bg-sky-50 text-sky-700 ring-sky-100",
  Shopping: "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-100",
  Entertainment: "bg-violet-50 text-violet-700 ring-violet-100",
  Healthcare: "bg-rose-50 text-rose-700 ring-rose-100",
  Education: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Others: "bg-slate-100 text-slate-600 ring-slate-200",
};

const paymentStyles: Record<PaymentMethod, string> = {
  Cash: "bg-amber-50 text-amber-700",
  "Credit Card": "bg-indigo-50 text-indigo-700",
  "Debit Card": "bg-blue-50 text-blue-700",
  UPI: "bg-emerald-50 text-emerald-700",
  "Net Banking": "bg-cyan-50 text-cyan-700",
};

export default function ExpenseTable({
  expenses,
  loading,
  onEdit,
  onDelete,
}: {
  expenses: Expense[];
  loading: boolean;
  onEdit: (id: string) => void;
  onDelete: (expense: Expense) => void;
}) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="h-5 w-32 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 px-5 py-4">
              <div className="h-10 w-10 animate-pulse rounded-lg bg-slate-100" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-40 animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-64 animate-pulse rounded bg-slate-100" />
              </div>
              <div className="h-3.5 w-20 animate-pulse rounded bg-slate-100" />
              <div className="h-3.5 w-24 animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
          <InboxIcon className="h-6 w-6" />
        </span>
        <h3 className="mt-4 text-base font-semibold text-slate-800">
          No expenses found
        </h3>
        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
          Try changing your search or filters, or add a new expense to get
          started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">All Expenses</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Sorted by expense date, newest first.
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {expenses.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3">Expense</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Payment Method</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                className="transition hover:bg-slate-50/80"
              >
                <td className="max-w-[280px] px-5 py-4">
                  <p className="truncate font-medium text-slate-900">
                    {expense.title}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {expense.description}
                  </p>
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-900">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${categoryStyles[expense.category]}`}
                  >
                    {expense.category}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                  {formatDate(expense.date)}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${paymentStyles[expense.paymentMethod]}`}
                  >
                    {expense.paymentMethod}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit(expense.id)}
                      className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                      aria-label={`Edit ${expense.title}`}
                      title="Edit expense"
                    >
                      <EditIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(expense)}
                      className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                      aria-label={`Delete ${expense.title}`}
                      title="Delete expense"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
