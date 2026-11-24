import mongoose, { Schema, type Model } from "mongoose";
import {
  CATEGORIES,
  PAYMENT_METHODS,
  type Category,
  type PaymentMethod,
} from "@/types/expense";

export interface ExpenseDocument extends mongoose.Document {
  title: string;
  description: string;
  amount: number;
  category: Category;
  date: Date;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<ExpenseDocument>(
  {
    title: {
      type: String,
      required: [true, "Expense title is required."],
      trim: true,
      maxlength: [100, "Title must be 100 characters or fewer."],
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
      maxlength: [500, "Description must be 500 characters or fewer."],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required."],
      min: [0.01, "Amount must be greater than zero."],
    },
    category: {
      type: String,
      required: [true, "Category is required."],
      enum: {
        values: CATEGORIES as unknown as string[],
        message: "Please select a valid category.",
      },
    },
    date: {
      type: Date,
      required: [true, "Expense date is required."],
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required."],
      enum: {
        values: PAYMENT_METHODS as unknown as string[],
        message: "Please select a valid payment method.",
      },
    },
  },
  { timestamps: true },
);

ExpenseSchema.index({ date: -1, createdAt: -1 });
ExpenseSchema.index({ title: "text", description: "text" });

const Expense: Model<ExpenseDocument> =
  (mongoose.models.Expense as Model<ExpenseDocument>) ||
  mongoose.model<ExpenseDocument>("Expense", ExpenseSchema);

export default Expense;
