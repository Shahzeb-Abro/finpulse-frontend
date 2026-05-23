import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const budgetSchema = z.object({
  budgetCategoryId: z.coerce.number().min(1, "Category is required"),
  maximumSpend: z.coerce
    .number()
    .positive("Maximum spend must be a positive number"),
  budgetThemeId: z.coerce.number().min(1, "Theme is required"),
  budgetPeriodId: z.coerce.number().min(1, "Budget period is required"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export const potSchema = z.object({
  potName: z.string().min(2, "Pot name must be at least 2 characters long"),
  target: z.coerce.number().positive("Target amount must be a positive number"),
  theme: z.coerce.number().min(1, "Theme is required"),
});

export const addWithdrawPotSchema = z.object({
  amount: z.coerce.number().positive("Amount must be a positive number"),
});

export const budgetTransactionSchema = z.object({
  amount: z.coerce.number().positive("Amount must be a positive number"),
  description: z.string().optional(),
  date: z.coerce.date(),
  receiverName: z.string().optional(),
});

export const sessionSchema = z.object({
  title: z.string().min(2, "Session title must be at least 2 characters long"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Confirm Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const transactionSchema = z.object({
  amount: z.coerce.number().positive("Amount must be a positive number"),
  description: z.string().optional(),
  date: z.coerce.date(),
  type: z.enum(["EXPENSE", "INCOME"], {
    errorMap: () => ({ message: "Transaction type is required" }),
  }),
  category: z.coerce.number().min(1, "Category is required"),
});

export const preferencesSchema = z.object({
  currency: z.coerce.number().min(1, "Currency is required"),
});

export const recurringBillSchema = z.object({
  title: z.string().min(1, "Title is required").max(30),
  amount: z.coerce.number().positive("Amount must be a positive number"),
  description: z.string().optional(),
  frequency: z.enum(["MONTHLY", "YEARLY"], {
    required_error: "Please select a frequency",
  }),
  dueDate: z.date({ required_error: "Please select a due date" }),
  categoryId: z.coerce.number().min(1, "Category is required"),
});
