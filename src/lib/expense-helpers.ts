import type { Category, Expense, PaymentMethod } from "@/types/expense";

type LeanExpense = {
  _id: { toString(): string };
  title: string;
  description: string;
  amount: number;
  category: Category;
  date: Date | string;
  paymentMethod: PaymentMethod;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export function serializeExpense(doc: LeanExpense): Expense {
  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    amount: Number(doc.amount),
    category: doc.category,
    date: new Date(doc.date).toISOString(),
    paymentMethod: doc.paymentMethod,
    ...(doc.createdAt
      ? { createdAt: new Date(doc.createdAt).toISOString() }
      : {}),
    ...(doc.updatedAt
      ? { updatedAt: new Date(doc.updatedAt).toISOString() }
      : {}),
  };
}

export function toDateInputValue(isoDate?: string): string {
  if (!isoDate) {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60_000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 10);
  }
  return new Date(isoDate).toISOString().slice(0, 10);
}
