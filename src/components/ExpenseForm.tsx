"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  AlertIcon,
  ArrowLeftIcon,
  CheckIcon,
} from "@/components/Icons";
import { api, getApiErrorMessage } from "@/lib/api";
import { toDateInputValue } from "@/lib/expense-helpers";
import { validateExpenseInput } from "@/lib/validation";
import {
  CATEGORIES,
  PAYMENT_METHODS,
  type Expense,
  type ExpenseFieldErrors,
  type ExpenseInput,
} from "@/types/expense";

const emptyForm: ExpenseInput = {
  title: "",
  description: "",
  amount: "",
  category: "",
  date: toDateInputValue(),
  paymentMethod: "",
};

const inputClass =
  "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2";
const labelClass = "block text-sm font-medium text-slate-700";

function fieldClass(hasError: boolean) {
  return `${inputClass} ${
    hasError
      ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
      : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100"
  }`;
}

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-rose-600">{message}</p>;
}

export default function ExpenseForm({
  mode,
  expenseId,
}: {
  mode: "add" | "edit";
  expenseId?: string;
}) {
  const router = useRouter();
  const redirectTimer = useRef<number | null>(null);

  const [values, setValues] = useState<ExpenseInput>(emptyForm);
  const [errors, setErrors] = useState<ExpenseFieldErrors>({});
  const [loading, setLoading] = useState(mode === "edit");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isEdit = mode === "edit";

  useEffect(() => {
    if (!isEdit || !expenseId) return;
    const controller = new AbortController();

    api
      .get<{ success: boolean; data: Expense }>(`/expenses/${expenseId}`, {
        signal: controller.signal,
      })
      .then((response) => {
        const expense = response.data.data;
        setValues({
          title: expense.title,
          description: expense.description,
          amount: expense.amount,
          category: expense.category,
          date: toDateInputValue(expense.date),
          paymentMethod: expense.paymentMethod,
        });
      })
      .catch((requestError) => {
        if (!axios.isCancel(requestError)) {
          setServerError(getApiErrorMessage(requestError, "Unable to load this expense."));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [isEdit, expenseId]);

  useEffect(() => {
    return () => {
      if (redirectTimer.current) window.clearTimeout(redirectTimer.current);
    };
  }, []);

  const setValue = <K extends keyof ExpenseInput>(field: K, value: ExpenseInput[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(null);
    setSuccess(false);

    const validationErrors = validateExpenseInput(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setServerError("Please correct the highlighted fields.");
      return;
    }

    setSubmitting(true);

    try {
      if (isEdit) {
        await api.put(`/expenses/${expenseId}`, values);
      } else {
        await api.post("/expenses", values);
      }

      setSuccess(true);
      redirectTimer.current = window.setTimeout(() => {
        router.push(`/dashboard?status=${isEdit ? "updated" : "created"}`);
      }, 800);
    } catch (requestError) {
      const responseData = axios.isAxiosError(requestError)
        ? (requestError.response?.data as
            | { message?: string; errors?: ExpenseFieldErrors }
            | undefined)
        : undefined;

      if (responseData?.errors) setErrors(responseData.errors);
      setServerError(
        responseData?.message ||
          getApiErrorMessage(
            requestError,
            isEdit ? "Unable to update the expense." : "Unable to add the expense.",
          ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to dashboard
        </Link>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-indigo-600">
          {isEdit ? "Update record" : "New record"}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {isEdit ? "Edit Expense" : "Add a New Expense"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {isEdit
            ? "Modify the details below and save your changes."
            : "Fill in the details below. All fields are required."}
        </p>
      </div>

      {success && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 animate-fade-in-up"
        >
          <CheckIcon className="h-4 w-4 shrink-0" />
          {isEdit ? "Expense updated successfully!" : "Expense added successfully!"}{" "}
          Redirecting to dashboard...
        </div>
      )}

      {serverError && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          <AlertIcon className="h-4 w-4 shrink-0" />
          {serverError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
      >
        {loading ? (
          <div className="space-y-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-3.5 w-28 animate-pulse rounded bg-slate-100" />
                <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="title" className={labelClass}>
                Expense Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={values.title}
                onChange={(event) => setValue("title", event.target.value)}
                placeholder="e.g. Lunch at cafe"
                maxLength={100}
                className={`mt-1.5 ${fieldClass(Boolean(errors.title))}`}
                aria-invalid={Boolean(errors.title)}
              />
              <ErrorText message={errors.title} />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className={labelClass}>
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={values.description}
                onChange={(event) => setValue("description", event.target.value)}
                placeholder="Add a short note about this expense"
                maxLength={500}
                className={`mt-1.5 resize-y ${fieldClass(Boolean(errors.description))}`}
                aria-invalid={Boolean(errors.description)}
              />
              <ErrorText message={errors.description} />
            </div>

            <div>
              <label htmlFor="amount" className={labelClass}>
                Amount <span className="text-rose-500">*</span>
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                value={values.amount}
                onChange={(event) => setValue("amount", event.target.value)}
                placeholder="0.00"
                className={`mt-1.5 ${fieldClass(Boolean(errors.amount))}`}
                aria-invalid={Boolean(errors.amount)}
              />
              <ErrorText message={errors.amount} />
            </div>

            <div>
              <label htmlFor="date" className={labelClass}>
                Expense Date <span className="text-rose-500">*</span>
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={values.date}
                onChange={(event) => setValue("date", event.target.value)}
                className={`mt-1.5 ${fieldClass(Boolean(errors.date))}`}
                aria-invalid={Boolean(errors.date)}
              />
              <ErrorText message={errors.date} />
            </div>

            <div>
              <label htmlFor="category" className={labelClass}>
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={values.category}
                onChange={(event) => setValue("category", event.target.value)}
                className={`mt-1.5 ${fieldClass(Boolean(errors.category))}`}
                aria-invalid={Boolean(errors.category)}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ErrorText message={errors.category} />
            </div>

            <div>
              <label htmlFor="paymentMethod" className={labelClass}>
                Payment Method <span className="text-rose-500">*</span>
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={values.paymentMethod}
                onChange={(event) => setValue("paymentMethod", event.target.value)}
                className={`mt-1.5 ${fieldClass(Boolean(errors.paymentMethod))}`}
                aria-invalid={Boolean(errors.paymentMethod)}
              >
                <option value="">Select a payment method</option>
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
              <ErrorText message={errors.paymentMethod} />
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end sm:pt-6 sm:col-span-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting || success}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-70"
              >
                {submitting
                  ? isEdit
                    ? "Saving..."
                    : "Adding..."
                  : isEdit
                    ? "Save Changes"
                    : "Add Expense"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
