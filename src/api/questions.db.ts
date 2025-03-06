import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import type { QuestionToCreate } from "./questions.validate.js";
import { safeString } from "./validator.js";

const prisma = new PrismaClient();

const _QuestionSchema = z.object({
  id: z.number(),
  question: z
    .string()
    .min(5, "question must be at least 5 characters")
    .max(2048, "question must be at most 2048 characters")
    .transform(safeString),
  categoryId: z.number(),
});

type Question = z.infer<typeof _QuestionSchema>;

export async function getQuestions(
  limit: number = 10,
  offset: number = 0,
): Promise<{
  questions: Array<Question>;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}> {
  const questions = await prisma.questions.findMany({
    skip: offset,
    take: limit,
  });
  const totalQuestions = await prisma.questions.count();
  const totalPages = Math.ceil(totalQuestions / limit);

  return {
    questions,
    total: totalQuestions,
    totalPages,
    hasNextPage: offset + limit < totalQuestions,
    hasPrevPage: offset > 0,
  };
}

export async function getQuestion(id: number): Promise<{
  id: number;
  question: string;
  categoryId: number;
  answers: { answer: string; isCorrect: boolean; questionId: number }[];
} | null> {
  const questionResult = await prisma.questions.findUnique({
    where: {
      id,
    },
  });

  if (!questionResult) return null;

  const answersResult = await prisma.answers.findMany({
    where: {
      questionId: id,
    },
  });

  return {
    ...questionResult,
    answers: answersResult,
  };
}

export async function getQuestionsByCategory(
  categoryId: number,
  limit: number = 10,
  offset: number = 0,
): Promise<{
  questions: {
    answers: {
      id: number;
      answer: string;
      isCorrect: boolean;
      questionId: number;
    }[];
    id: number;
    question: string;
    categoryId: number;
  }[];
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}> {
  const questions = await prisma.questions.findMany({
    skip: offset,
    take: limit,
    where: {
      categoryId,
    },
  });
  const totalQuestions = await prisma.questions.count({
    where: {
      categoryId,
    },
  });
  const totalPages = Math.ceil(totalQuestions / limit);

  const answers = await Promise.all(
    questions.map(async (question) => {
      return await prisma.answers.findMany({
        where: {
          questionId: question.id,
        },
      });
    }),
  );

  const questionsWithAnswers = questions.map((question, qIndex) => ({
    ...question,
    answers: answers[qIndex],
  }));

  return {
    questions: questionsWithAnswers,
    total: totalQuestions,
    totalPages,
    hasNextPage: offset + limit < totalQuestions,
    hasPrevPage: offset > 0,
  };
}

export async function createQuestion(
  questionToCreate: QuestionToCreate,
): Promise<Question | null> {
  const categoryResult = await prisma.categories.findUnique({
    where: {
      id: questionToCreate.categoryId,
    },
  });

  if (!categoryResult) return null;

  const createdQuestion = await prisma.questions.create({
    data: {
      question: questionToCreate.question,
      categoryId: questionToCreate.categoryId,
      answers: {
        create: questionToCreate.answers.map((answer) => ({
          answer: answer.answer,
          isCorrect: answer.isCorrect,
        })),
      },
    },
  });

  return createdQuestion;
}

export async function updateQuestion(
  id: number,
  questionToUpdate: QuestionToCreate,
): Promise<
  | ({
      answers: {
        id: number;
        answer: string;
        isCorrect: boolean;
        questionId: number;
      }[];
    } & {
      id: number;
      question: string;
      categoryId: number;
    })
  | null
> {
  const questionResult = await prisma.questions.findUnique({
    where: {
      id,
    },
  });

  if (!questionResult) return null;

  await prisma.answers.deleteMany({
    where: {
      questionId: id,
    },
  });

  const result = await prisma.questions.update({
    where: {
      id,
    },
    data: {
      question: questionToUpdate.question,
      categoryId: questionToUpdate.categoryId,
      answers: {
        create: questionToUpdate.answers.map(
          (answer: { answer: string; isCorrect: boolean }) => ({
            answer: answer.answer,
            isCorrect: answer.isCorrect,
          }),
        ),
      },
    },
    include: {
      answers: true,
    },
  });

  return result;
}
