import { z } from "zod";
import { safeString } from "./validator.js";

const CategoryToCreateSchema = z.object({
  title: z
    .string()
    .min(3, "title must be at least three letters")
    .max(512, "title must be at most 512 letters")
    .transform(safeString),
});

export type CategoryToCreate = z.infer<typeof CategoryToCreateSchema>;

export function validateCategory(category: unknown): z.SafeParseReturnType<
  {
    title: string;
  },
  {
    title?: string;
  }
> {
  const result = CategoryToCreateSchema.safeParse(category);

  return result;
}
