import type { Metadata } from "next";
import ExpenseForm from "@/components/ExpenseForm";

export const metadata: Metadata = { title: "Add Expense" };

export default function AddExpensePage() {
  return <ExpenseForm mode="add" />;
}
