import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6, {
      message: "At least 6 characters",
    }),
    confirmPassword: z.string().min(6, {
      message: "At least 6 characters",
    }),
    fullName: z.string().min(6),
    address: z.string().min(12, {
      message: "At least 12 characters",
    }),
    phoneNumber: z.string().regex(/^\+?[0-9]{10,14}$/, {
      message: "Invalid phone number",
    }),
    gender: z.enum(["male", "female", "other"]),
    dateOfBirth: z.date().refine(
      (date) => {
        const now = new Date();

        return now.getFullYear() - date.getFullYear() >= 15;
      },
      {
        message: "You must be at least 15 years old",
      }
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpData = z.infer<typeof signUpSchema>;
