export const CATEGORIES = [
  "Food",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Education",
  "Others",
] as const;

export const PAYMENT_METHODS = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "UPI",
  "Net Banking",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export interface Expense {
  id: string;
  title: string;
  description: string;
  amount: number;
  category: Category;
  date: string;
  paymentMethod: PaymentMethod;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExpenseInput {
  title: string;
  description: string;
  amount: number | string;
  category: string;
  date: string;
  paymentMethod: string;
}

export type ExpenseFieldErrors = Partial<Record<keyof ExpenseInput, string>>;

export interface ExpenseSummary {
  totalCount: number;
  totalAmount: number;
  highestAmount: number;
  averageAmount: number;
}

export interface ExpenseFilters {
  search: string;
  category: string;
  paymentMethod: string;
  dateFilter: "all" | "today" | "week" | "month";
}
