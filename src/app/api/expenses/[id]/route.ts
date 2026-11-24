import { NextResponse, type NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { serializeExpense } from "@/lib/expense-helpers";
import Expense from "@/lib/models/Expense";
import { sanitizeExpenseInput, validateExpenseInput } from "@/lib/validation";

type RouteContext = { params: Promise<{ id: string }> };

function invalidId() {
  return NextResponse.json(
    { success: false, message: "Invalid expense id." },
    { status: 400 },
  );
}

function notFound() {
  return NextResponse.json(
    { success: false, message: "Expense not found." },
    { status: 404 },
  );
}

function serverError(message: string, error: unknown) {
  console.error(message, error);
  return NextResponse.json({ success: false, message }, { status: 500 });
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return invalidId();

    await connectToDatabase();
    const expense = await Expense.findById(id).lean();
    if (!expense) return notFound();

    return NextResponse.json({
      success: true,
      data: serializeExpense(
        expense as unknown as Parameters<typeof serializeExpense>[0],
      ),
    });
  } catch (error) {
    return serverError("Unable to fetch the expense.", error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return invalidId();

    const body = await request.json().catch(() => ({}));
    const errors = validateExpenseInput(body);

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, message: "Please correct the highlighted fields.", errors },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const expense = await Expense.findByIdAndUpdate(
      id,
      sanitizeExpenseInput(body),
      { returnDocument: "after", runValidators: true },
    ).lean();

    if (!expense) return notFound();

    return NextResponse.json({
      success: true,
      message: "Expense updated successfully.",
      data: serializeExpense(
        expense as unknown as Parameters<typeof serializeExpense>[0],
      ),
    });
  } catch (error) {
    return serverError("Unable to update the expense.", error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return invalidId();

    await connectToDatabase();
    const expense = await Expense.findByIdAndDelete(id).lean();
    if (!expense) return notFound();

    return NextResponse.json({
      success: true,
      message: "Expense deleted successfully.",
    });
  } catch (error) {
    return serverError("Unable to delete the expense.", error);
  }
}
