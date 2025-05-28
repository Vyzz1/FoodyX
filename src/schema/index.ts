import { z } from "zod";

export const otpSchema = z.object({
  otp: z.string().length(6, "Please enter all 6 digits"),
});
export type OTPValues = z.infer<typeof otpSchema>;

export const createFormSchema = (groups: OptionGroup[]) => {
  const schemaFields: Record<string, any> = {
    quantity: z.number().min(1, "Quantity must be at least 1"),
  };

  groups.forEach((group) => {
    if (group.multiple) {
      schemaFields[group.id] = z
        .array(z.string())
        .max(
          group.freeLimit,
          `You can only select up to ${group.freeLimit} options`
        )
        .refine((value) => !group.required || value.length > 0, {
          message: "You must select at least one option",
        });
    } else {
      const fieldSchema = z.string().optional();
      schemaFields[group.id] = group.required
        ? fieldSchema.refine((value) => value !== undefined && value !== "", {
            message: "This field is required",
          })
        : fieldSchema;
    }
  });

  return z.object(schemaFields);
};


export const userSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  dateOfBirth: z.date().refine(
    (date) => {
      const now = new Date();

      return now.getFullYear() - date.getFullYear() >= 15;
    },
    {
      message: "You must be at least 15 years old",
    }
  ),
  gender: z.enum(["male", "female", "other"]),
});

export type UserForm = z.infer<typeof userSchema>;