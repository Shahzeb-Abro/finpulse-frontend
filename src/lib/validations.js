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
