import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import type { CategoryToCreate } from "./categories.validate.js";
import { type QuerySlug, safeString } from "./validator.js";

const prisma = new PrismaClient();

const _CategorySchema = z.object({
  id: z.number(),
  title: z
    .string()
    .min(3, "title must be at least three letters")
    .max(512, "title must be at most 512 letters")
    .transform(safeString),
  slug: z.string().transform(safeString),
});

type Category = z.infer<typeof _CategorySchema>;

export async function getCategories(
  limit: number = 10,
  offset: number = 0,
): Promise<{
  categories: Array<Category>;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}> {
  const categories = await prisma.categories.findMany({
    skip: offset,
    take: limit,
  });
  const totalCategories = await prisma.categories.count();
  const totalPages = Math.ceil(totalCategories / limit);

  return {
    categories,
    total: totalCategories,
    totalPages,
    hasNextPage: offset + limit < totalCategories,
    hasPrevPage: offset > 0,
  };
}

export async function getCategory(slug: QuerySlug): Promise<{
  id: number;
  title: string;
  slug: string;
} | null> {
  const result = await prisma.categories.findUnique({
    where: {
      slug,
    },
  });

  return result;
}

export async function createCategory(
  categoryToCreate: CategoryToCreate,
): Promise<Category | null> {
  try {
    const createdCategory = await prisma.categories.create({
      data: {
        title: categoryToCreate.title,
        slug: categoryToCreate.title.toLowerCase().replaceAll(" ", "-"),
      },
    });

    return createdCategory;
  } catch {
    return null;
  }
}

export async function updateCategory(
  slug: QuerySlug,
  categoryToCreate: CategoryToCreate,
): Promise<Category | null> {
  try {
    const updatedCategory = await prisma.categories.update({
      where: {
        slug,
      },
      data: {
        title: categoryToCreate.title,
        slug: categoryToCreate.title.toLowerCase().replaceAll(" ", "-"),
      },
    });

    return updatedCategory;
  } catch {
    return null;
  }
}

export async function deleteCategory(
  slug: QuerySlug,
): Promise<{ success: boolean }> {
  console.log(slug);
  try {
    await prisma.categories.delete({
      where: {
        slug,
      },
    });

    return { success: true };
  } catch {
    return { success: false };
  }
}
