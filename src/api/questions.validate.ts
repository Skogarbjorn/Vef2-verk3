import { z } from "zod";
import { safeString } from "./validator.js";

const AnswerSchema = z.object({
  answer: z
    .string()
    .min(1, "answer must not be empty")
    .max(1024, "answer must not be more than 1024 characters")
    .transform(safeString),
  isCorrect: z.boolean(),
});

const QuestionToCreateSchema = z.object({
  question: z
    .string()
    .min(3, "title must be at least three letters")
    .max(512, "title must be at most 512 letters")
    .transform(safeString),
  categoryId: z.number(),
  answers: z.array(AnswerSchema).max(4, "answers must not be more than 4"),
});

export type QuestionToCreate = z.infer<typeof QuestionToCreateSchema>;

export function validateQuestion(question: unknown): z.SafeParseReturnType<
  {
    question: string;
    categoryId: number;
    answers: {
      answer: string;
      isCorrect: boolean;
    }[];
  },
  {
    question: string;
    categoryId: number;
    answers: {
      answer: string;
      isCorrect: boolean;
    }[];
  }
> {
  const result = QuestionToCreateSchema.safeParse(question);

  return result;
}
