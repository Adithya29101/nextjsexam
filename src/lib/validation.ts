import {
  CATEGORIES,
  PAYMENT_METHODS,
  type Category,
  type ExpenseFieldErrors,
  type ExpenseInput,
  type PaymentMethod,
} from "@/types/expense";

export function validateExpenseInput(input: ExpenseInput): ExpenseFieldErrors {
  const errors: ExpenseFieldErrors = {};

  if (!input.title || !input.title.trim()) {
    errors.title = "Expense title is required.";
  } else if (input.title.trim().length > 100) {
    errors.title = "Title must be 100 characters or fewer.";
  }

  if (!input.description || !input.description.trim()) {
    errors.description = "Description is required.";
  } else if (input.description.trim().length > 500) {
    errors.description = "Description must be 500 characters or fewer.";
  }

  const amountValue =
    typeof input.amount === "string" ? input.amount.trim() : input.amount;

  if (amountValue === "" || amountValue === null || amountValue === undefined) {
    errors.amount = "Amount is required.";
  } else {
    const amount = Number(amountValue);
    if (!Number.isFinite(amount)) {
      errors.amount = "Amount must be a valid number.";
    } else if (amount <= 0) {
      errors.amount = "Amount must be greater than zero.";
    } else if (amount > 1_000_000_000) {
      errors.amount = "Amount is too large.";
    }
  }

  if (!input.category) {
    errors.category = "Category is required.";
  } else if (!CATEGORIES.includes(input.category as Category)) {
    errors.category = "Please select a valid category.";
  }

  if (!input.date) {
    errors.date = "Expense date is required.";
  } else if (Number.isNaN(new Date(input.date).getTime())) {
    errors.date = "Please enter a valid date.";
  }

  if (!input.paymentMethod) {
    errors.paymentMethod = "Payment method is required.";
  } else if (!PAYMENT_METHODS.includes(input.paymentMethod as PaymentMethod)) {
    errors.paymentMethod = "Please select a valid payment method.";
  }

  return errors;
}

export function sanitizeExpenseInput(input: ExpenseInput) {
  return {
    title: input.title.trim(),
    description: input.description.trim(),
    amount: Number(input.amount),
    category: input.category as Category,
    date: new Date(input.date),
    paymentMethod: input.paymentMethod as PaymentMethod,
  };
}

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
