import { z } from "zod";
import xss from "xss";

const MAX_PAGES = 10000;
const MAX_LIMIT = 128;

export const safeString = (str: string) => xss(str);

const PageParamsSchema = z.object({
  page: z
    .number()
    .gt(0, "page number must be above 0")
    .lt(MAX_PAGES, `cannot get pages above ${MAX_PAGES}`),
  limit: z
    .number()
    .gt(0, "limit must be above 0")
    .lt(MAX_LIMIT, `limit cannot be more than ${MAX_LIMIT}`),
});

const QuerySlugSchema = z
  .string()
  .min(3, "slug must be at least three letters")
  .max(512, "slug must be at most 512 letters")
  .transform(safeString);

export type QuerySlug = z.infer<typeof QuerySlugSchema>;

export function validatePageParams(params: unknown) {
  const result = PageParamsSchema.safeParse(params);

  return result;
}

export function validateSlug(slug: unknown) {
  const result = QuerySlugSchema.safeParse(slug);

  return result;
}
