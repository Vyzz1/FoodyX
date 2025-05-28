import { z } from "zod";

export const dishSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(15),
  timeEstimate:z.coerce.number(),
  costPrice: z.coerce
    .number({
      message: "Required",
    })
    .min(1),
  sellingPrice: z.coerce
    .number({
      message: "Required",
    })
    .min(1),
  images: z.array(z.string()).optional(),
  categoryId: z.string(),
  optionGroups: z.array(
    z
      .object({
        id: z.string().optional(),
        name: z.string().min(3),
        required: z.boolean(),
        sequence: z.number(),

        multiple: z.boolean(),
        freeLimit: z.coerce.number(),

        options: z
          .array(
            z.object({
              id: z.string().optional(),
              optionName: z.string().min(3),
              sequence: z.number(),
              additionalPrice: z.coerce.number().min(0),
            })
          )
          .min(1, {
            message: "At least one option is required",
          }),
      })
      .refine(
        (data) => {
          if (data.multiple === true) {
            return data.freeLimit > 0;
          }
          return true;
        },
        {
          message:
            "Free limit must be greater than 0 if multiple options are allowed.",
          path: ["freeLimit"],
        }
      )
      .refine((data) => data.freeLimit <= data.options.length, {
        message:
          "Free limit must be less than or equal to the number of options",
        path: ["freeLimit"],
      })
  ),
});

export type Dish = z.infer<typeof dishSchema>;
