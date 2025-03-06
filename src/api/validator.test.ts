import { validatePageParams, validateSlug } from "./validator.js";
import { describe, expect, it } from "@jest/globals";

describe("validator", () => {
  describe("validatePageParams", () => {
    it("returns unsuccessful if data does not contain valid page parameters", () => {
      const data = {
        page: 0,
        limit: 10,
      };

      const result = validatePageParams(data);

      expect(result.success).toBe(false);
    });
    it("returns successful along with data if the parameters are valid", () => {
      const data = {
        page: 1,
        limit: 10,
      };

      const result = validatePageParams(data);
      expect(result.success).toBe(true);
      expect(result.data?.page).toBe(1);
      expect(result.data?.limit).toBe(10);
    });
  });
  describe("validateSlug", () => {
    it("returns unsuccessful if input does not contain a valid slug", () => {
      const data = "a";

      const result = validateSlug(data);

      expect(result.success).toBe(false);
    });
    it("returns successful along with input if the slug is valid", () => {
      const data = "gamer";

      const result = validateSlug(data);
      expect(result.success).toBe(true);
      expect(result.data).toBe("gamer");
    });
  });
});
