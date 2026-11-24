import type { Metadata } from "next";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import ExpenseForm from "@/components/ExpenseForm";

export const metadata: Metadata = { title: "Edit Expense" };

export default async function EditExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) notFound();

  return <ExpenseForm mode="edit" expenseId={id} />;
}
