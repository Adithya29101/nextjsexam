"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ConfirmDialog from "@/components/ConfirmDialog";
import FiltersBar from "@/components/FiltersBar";
import { AlertIcon, CheckIcon, CloseIcon, PlusIcon } from "@/components/Icons";
import ExpenseTable from "@/components/ExpenseTable";
import SummaryCards from "@/components/SummaryCards";
import { api, getApiErrorMessage } from "@/lib/api";
import { getDateRange } from "@/lib/date-range";
import type {
  Expense,
  ExpenseFilters,
  ExpenseSummary,
} from "@/types/expense";
import Link from "next/link";

const defaultFilters: ExpenseFilters = {
  search: "",
  category: "all",
  paymentMethod: "all",
  dateFilter: "all",
};

const emptySummary: ExpenseSummary = {
  totalCount: 0,
  totalAmount: 0,
  highestAmount: 0,
  averageAmount: 0,
};

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export default function DashboardClient() {
  const router = useRouter();

  const [filters, setFilters] = useState<ExpenseFilters>(defaultFilters);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary>(emptySummary);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [pendingDelete, setPendingDelete] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const messages: Record<string, string> = {
      created: "Expense added successfully.",
      updated: "Expense updated successfully.",
    };
    const message = messages[params.get("status") || ""];
    if (message) {
      setToast(message);
      window.history.replaceState(null, "", "/dashboard");
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4_000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError(null);

      const range = getDateRange(filters.dateFilter);
      const params = new URLSearchParams();

      if (filters.search.trim()) params.set("search", filters.search.trim());
      if (filters.category !== "all") params.set("category", filters.category);
      if (filters.paymentMethod !== "all") {
        params.set("paymentMethod", filters.paymentMethod);
      }
      if (range.startDate) params.set("startDate", range.startDate);
      if (range.endDate) params.set("endDate", range.endDate);

      try {
        const response = await api.get<ApiResponse<Expense[]>>("/expenses", {
          params,
          signal: controller.signal,
        });
        setExpenses(response.data.data);
      } catch (requestError) {
        if (axios.isCancel(requestError)) return;
        setError(getApiErrorMessage(requestError, "Unable to load expenses."));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [filters, refreshKey]);

  useEffect(() => {
    const controller = new AbortController();
    setSummaryLoading(true);

    api
      .get<ApiResponse<ExpenseSummary>>("/expenses/summary", {
        signal: controller.signal,
      })
      .then((response) => setSummary(response.data.data))
      .catch((requestError) => {
        if (!axios.isCancel(requestError)) {
          setError((current) => current ?? "Unable to load the expense summary.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setSummaryLoading(false);
      });

    return () => controller.abort();
  }, [refreshKey]);

  const handleFilterChange = useCallback((patch: Partial<ExpenseFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
  }, []);

  const handleReset = useCallback(() => setFilters(defaultFilters), []);

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);

    try {
      const response = await api.delete<ApiResponse<null>>(
        `/expenses/${pendingDelete.id}`,
      );
      setToast(response.data.message || "Expense deleted successfully.");
      setPendingDelete(null);
      setRefreshKey((key) => key + 1);
    } catch (requestError) {
      setToast(getApiErrorMessage(requestError, "Unable to delete the expense."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Overview
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Your Expenses
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track spending, spot patterns, and stay in control.
          </p>
        </div>
        <Link
          href="/dashboard/add"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700"
        >
          <PlusIcon className="h-4 w-4" />
          Add Expense
        </Link>
      </div>

      {toast && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 animate-fade-in-up"
        >
          <CheckIcon className="h-4 w-4 shrink-0" />
          <span className="flex-1">{toast}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="rounded-md p-1 text-emerald-600 transition hover:bg-emerald-100"
            aria-label="Dismiss message"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          <AlertIcon className="h-4 w-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={() => setRefreshKey((key) => key + 1)}
            className="rounded-md px-2 py-1 font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            Retry
          </button>
        </div>
      )}

      <SummaryCards summary={summary} loading={summaryLoading} />

      <FiltersBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
        resultCount={expenses.length}
      />

      <ExpenseTable
        expenses={expenses}
        loading={loading}
        onEdit={(id) => router.push(`/dashboard/edit/${id}`)}
        onDelete={setPendingDelete}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this expense?"
        message={
          pendingDelete
            ? `“${pendingDelete.title}” will be permanently removed from your records. This action cannot be undone.`
            : ""
        }
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
