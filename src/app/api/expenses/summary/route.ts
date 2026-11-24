import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Expense from "@/lib/models/Expense";
import type { ExpenseSummary } from "@/types/expense";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();

    const [result] = await Expense.aggregate<{
      _id: null;
      totalCount: number;
      totalAmount: number;
      highestAmount: number;
      averageAmount: number;
    }>([
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          highestAmount: { $max: "$amount" },
          averageAmount: { $avg: "$amount" },
        },
      },
    ]);

    const summary: ExpenseSummary = result
      ? {
          totalCount: result.totalCount,
          totalAmount: Number(result.totalAmount.toFixed(2)),
          highestAmount: Number(result.highestAmount.toFixed(2)),
          averageAmount: Number(result.averageAmount.toFixed(2)),
        }
      : {
          totalCount: 0,
          totalAmount: 0,
          highestAmount: 0,
          averageAmount: 0,
        };

    return NextResponse.json({ success: true, data: summary });
  } catch (error) {
    console.error("Unable to fetch expense summary.", error);
    return NextResponse.json(
      { success: false, message: "Unable to fetch expense summary." },
      { status: 500 },
    );
  }
}
