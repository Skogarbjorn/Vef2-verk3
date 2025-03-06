import { validateQuestion } from "./questions.validate.js";
import { describe, expect, it } from "@jest/globals";

describe("questions.validate", () => {
  describe("validateQuestion", () => {
    it("returns unsuccessful if data does not contain a valid question", () => {
      const data = {
        question: "",
        categoryId: 1,
        answers: [
          {
            answer: "gamering",
            isCorrect: false,
          },
        ],
      };

      const result = validateQuestion(data);

      expect(result.success).toBe(false);
    });

    it("returns successful along with data if it is a valid question", () => {
      const data = {
        question: "gamering",
        categoryId: 1,
        answers: [
          {
            answer: "gamering",
            isCorrect: true,
          },
        ],
      };

      const result = validateQuestion(data);
      expect(result.success).toBe(true);
      expect(result.data?.question).toBe("gamering");
    });
  });
});
