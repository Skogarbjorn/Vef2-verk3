import { validateCategory } from "./categories.validate.js";
import { describe, expect, it } from "@jest/globals";

describe("categories.validate", () => {
  describe("validateCategory", () => {
    it("returns unsuccessful if data is not a valid category", () => {
      const data = {
        gamer: "gamer",
      };
      const result = validateCategory(data);

      expect(result.success).toBe(false);
    });

    it("returns successful along with data if it is a valid category", () => {
      const data = {
        title: "gamer",
      };

      const result = validateCategory(data);
      expect(result.success).toBe(true);
      expect(result.data?.title).toBe("gamer");
    });
  });
});
