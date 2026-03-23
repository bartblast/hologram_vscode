const assert = require("assert");
const { tokenize } = require("./tokenization_helper");

describe("HOLO grammar", () => {
  describe("plain text", () => {
    it("tokenizes plain text with the top-level scope", async () => {
      const tokens = await tokenize("hello world");

      const expected = [
        { text: "hello world", scopes: ["text.holo"] },
      ];

      assert.deepStrictEqual(tokens, expected);
    });
  });
});
