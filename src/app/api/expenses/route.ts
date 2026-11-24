import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { serializeExpense } from "@/lib/expense-helpers";
import Expense from "@/lib/models/Expense";
import { escapeRegex, sanitizeExpenseInput, validateExpenseInput } from "@/lib/validation";
import { CATEGORIES, PAYMENT_METHODS, type Category, type PaymentMethod } from "@/types/expense";

export const dynamic = "force-dynamic";

function serverError(message: string, error: unknown) {
  console.error(message, error);
  return NextResponse.json(
    { success: false, message },
    { status: 500 },
  );
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const params = request.nextUrl.searchParams;
    const query: Record<string, unknown> = {};

    const search = params.get("search")?.trim();
    if (search) {
      const pattern = escapeRegex(search);
      query.$or = [
        { title: { $regex: pattern, $options: "i" } },
        { description: { $regex: pattern, $options: "i" } },
      ];
    }

    const category = params.get("category");
    if (category && CATEGORIES.includes(category as Category)) {
      query.category = category;
    }

    const paymentMethod = params.get("paymentMethod");
    if (paymentMethod && PAYMENT_METHODS.includes(paymentMethod as PaymentMethod)) {
      query.paymentMethod = paymentMethod;
    }

    const startDate = params.get("startDate");
    const endDate = params.get("endDate");
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && !Number.isNaN(start.getTime())) {
      query.date = { ...(query.date as object), $gte: start };
    }
    if (end && !Number.isNaN(end.getTime())) {
      query.date = { ...(query.date as object), $lte: end };
    }

    const expenses = await Expense.find(query)
      .sort({ date: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: expenses.map((expense) =>
        serializeExpense(
          expense as unknown as Parameters<typeof serializeExpense>[0],
        ),
      ),
    });
  } catch (error) {
    return serverError("Unable to fetch expenses.", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const errors = validateExpenseInput(body);

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, message: "Please correct the highlighted fields.", errors },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const expense = await Expense.create(sanitizeExpenseInput(body));

    return NextResponse.json(
      {
        success: true,
        message: "Expense added successfully.",
        data: serializeExpense(expense),
      },
      { status: 201 },
    );
  } catch (error) {
    return serverError("Unable to add the expense.", error);
  }
}
