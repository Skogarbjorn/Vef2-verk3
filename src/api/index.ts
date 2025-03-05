import { Hono } from "hono";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "./categories.db.ts";
import { validateCategory } from "./categories.validate.ts";
import { validateSlug } from "./validator.ts";
import {
  createQuestion,
  getQuestion,
  getQuestions,
  getQuestionsByCategory,
  updateQuestion,
} from "./questions.db.ts";
import { validateQuestion } from "./questions.validate.ts";
import { validatePageParams } from "./validator.ts";

const categories = new Hono();

categories.get("/categories", async (c) => {
  let limit = Number(c.req.query("limit")) || 10;
  let page = Number(c.req.query("page")) || 1;
  const validParams = validatePageParams({ page, limit });
  if (!validParams.success) {
    return c.json(
      {
        error: "invalid page parameters",
        errors: validParams.error.flatten(),
      },
      400,
    );
  }

  limit = validParams.data.limit;
  page = validParams.data.page;
  const offset = (page - 1) * limit;

  const categories = await getCategories(limit, offset);

  return c.json(categories);
});

categories.get("/categories/:slug", async (c) => {
  const slugToValidate = c.req.param("slug");

  const validSlug = validateSlug(slugToValidate);
  if (!validSlug.success) {
    return c.json(
      {
        error: "invalid slug",
        errors: validSlug.error.flatten(),
      },
      400,
    );
  }

  const category = await getCategory(validSlug.data);

  if (!category) {
    return c.json({ message: "category not found" }, 404);
  }

  return c.json(category, 200);
});

categories.post("/category", async (c) => {
  let categoryToValidate: unknown;
  try {
    categoryToValidate = await c.req.json();
  } catch {
    return c.json({ error: "invalid json" }, 400);
  }

  const validCategory = validateCategory(categoryToValidate);

  if (!validCategory.success) {
    return c.json(
      {
        error: "invalid data",
        errors: validCategory.error.flatten(),
      },
      400,
    );
  }

  const createdCategory = await createCategory(validCategory.data);

  return c.json(createdCategory, 201);
});

categories.patch("/category/:slug", async (c) => {
  let categoryToValidate: unknown;
  const slugToValidate = c.req.param("slug");

  try {
    categoryToValidate = await c.req.json();
  } catch {
    return c.json({ error: "invalid json" }, 400);
  }

  const validCategory = validateCategory(categoryToValidate);
  const validSlug = validateSlug(slugToValidate);

  if (!validCategory.success || !validSlug.success) {
    return c.json(
      {
        error: "invalid data or slug",
        errors: [validCategory.error?.flatten(), validSlug.error?.flatten()],
      },
      400,
    );
  }

  const updateResult = await updateCategory(validSlug.data, validCategory.data);

  if (!updateResult) {
    return c.json(
      {
        message: "category not found",
      },
      404,
    );
  }

  return c.json(updateResult, 200);
});

categories.delete("/category/:slug", async (c) => {
  const slugToValidate = c.req.param("slug");

  const validSlug = validateSlug(slugToValidate);

  if (!validSlug.success) {
    return c.json(
      {
        error: "invalid slug",
        errors: validSlug.error?.flatten(),
      },
      400,
    );
  }

  const result = await deleteCategory(validSlug.data);

  if (!result.success) {
    return c.json(
      {
        message: "category not found",
      },
      404,
    );
  }

  return c.body(null, 204);
});

const questions = new Hono();

questions.get("/questions", async (c) => {
  let limit = Number(c.req.query("limit")) || 10;
  let page = Number(c.req.query("page")) || 1;
  const validParams = validatePageParams({ page, limit });
  if (!validParams.success) {
    return c.json(
      {
        error: "invalid page parameters",
        errors: validParams.error.flatten(),
      },
      400,
    );
  }

  limit = validParams.data.limit;
  page = validParams.data.page;
  const offset = (page - 1) * limit;

  const questions = await getQuestions(limit, offset);

  return c.json(questions);
});

questions.get("/categories/:slug/questions", async (c) => {
  const slugToValidate = c.req.param("slug");
  const validSlug = validateSlug(slugToValidate);

  if (!validSlug.success) {
    return c.json(
      {
        error: "invalid slug",
        errors: validSlug.error?.flatten(),
      },
      400,
    );
  }

  let limit = Number(c.req.query("limit")) || 10;
  let page = Number(c.req.query("page")) || 1;

  const validParams = validatePageParams({ page, limit });
  if (!validParams.success) {
    return c.json(
      {
        error: "invalid page parameters",
        errors: validParams.error.flatten(),
      },
      400,
    );
  }

  limit = validParams.data.limit;
  page = validParams.data.page;

  const offset = (page - 1) * limit;

  const category = await getCategory(validSlug.data);
  if (!category) {
    return c.json({ message: "category not found" }, 404);
  }

  const questions = await getQuestionsByCategory(category.id, limit, offset);

  return c.json(questions, 200);
});

questions.get("/questions/:id", async (c) => {
  const id = c.req.param("id");

  const question = await getQuestion(Number(id));

  if (!question) {
    return c.json(
      {
        message: "question not found",
      },
      404,
    );
  }

  return c.json(question, 200);
});

questions.post("/questions", async (c) => {
  let questionToValidate: unknown;
  try {
    questionToValidate = await c.req.json();
  } catch {
    return c.json({ error: "invalid json" }, 400);
  }

  const validQuestion = validateQuestion(questionToValidate);

  if (!validQuestion.success) {
    return c.json(
      {
        error: "invalid data",
        errors: validQuestion.error.flatten(),
      },
      400,
    );
  }

  const createdQuestion = await createQuestion(validQuestion.data);

  if (!createdQuestion) {
    return c.json(
      {
        message: "category not found",
      },
      404,
    );
  }

  return c.json(createdQuestion, 201);
});

questions.patch("/questions/:id", async (c) => {
  const id = Number(c.req.param("id"));
  let questionToValidate: unknown;
  try {
    questionToValidate = await c.req.json();
  } catch {
    return c.json({ error: "invalid json" }, 400);
  }

  const validQuestion = validateQuestion(questionToValidate);

  if (!validQuestion.success) {
    return c.json(
      {
        error: "invalid data",
        errors: validQuestion.error.flatten(),
      },
      400,
    );
  }

  const updateResult = await updateQuestion(id, validQuestion.data);

  if (!updateResult) {
    return c.json(
      {
        message: "question not found",
      },
      404,
    );
  }

  return c.json(updateResult, 200);
});

export { categories, questions };
