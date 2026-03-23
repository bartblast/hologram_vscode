const assert = require("assert");
const { tokenize } = require("./tokenization_helper");

describe("HOLO grammar", () => {
  describe("plain text", () => {
    it("with the top-level scope", async () => {
      const tokens = await tokenize("hello world");

      const expected = [
        { text: "hello world", scopes: ["text.holo"] },
      ];

      assert.deepStrictEqual(tokens, expected);
    });
  });

  describe("tag_open", () => {
    it("regular", async () => {
      const tokens = await tokenize("<div>");

      const expected = [
        { text: "<", scopes: ["text.holo", "meta.tag.holo", "punctuation.definition.tag.begin.holo"] },
        { text: "div", scopes: ["text.holo", "meta.tag.holo", "entity.name.tag.holo"] },
        { text: ">", scopes: ["text.holo", "meta.tag.holo", "punctuation.definition.tag.end.holo"] },
      ];

      assert.deepStrictEqual(tokens, expected);
    });

    it("self-closing", async () => {
      const tokens = await tokenize("<br />");

      const expected = [
        { text: "<", scopes: ["text.holo", "meta.tag.holo", "punctuation.definition.tag.begin.holo"] },
        { text: "br", scopes: ["text.holo", "meta.tag.holo", "entity.name.tag.holo"] },
        { text: " ", scopes: ["text.holo", "meta.tag.holo"] },
        { text: "/>", scopes: ["text.holo", "meta.tag.holo", "punctuation.definition.tag.end.holo"] },
      ];

      assert.deepStrictEqual(tokens, expected);
    });

    it("custom element", async () => {
      const tokens = await tokenize("<foo-bar>");

      const expected = [
        { text: "<", scopes: ["text.holo", "meta.tag.holo", "punctuation.definition.tag.begin.holo"] },
        { text: "foo-bar", scopes: ["text.holo", "meta.tag.holo", "entity.name.tag.holo"] },
        { text: ">", scopes: ["text.holo", "meta.tag.holo", "punctuation.definition.tag.end.holo"] },
      ];

      assert.deepStrictEqual(tokens, expected);
    });
  });

  describe("tag_close", () => {
    it("regular", async () => {
      const tokens = await tokenize("</div>");

      const expected = [
        { text: "</", scopes: ["text.holo", "meta.tag.holo", "punctuation.definition.tag.begin.holo"] },
        { text: "div", scopes: ["text.holo", "meta.tag.holo", "entity.name.tag.holo"] },
        { text: ">", scopes: ["text.holo", "meta.tag.holo", "punctuation.definition.tag.end.holo"] },
      ];

      assert.deepStrictEqual(tokens, expected);
    });

    it("custom element", async () => {
      const tokens = await tokenize("</foo-bar>");

      const expected = [
        { text: "</", scopes: ["text.holo", "meta.tag.holo", "punctuation.definition.tag.begin.holo"] },
        { text: "foo-bar", scopes: ["text.holo", "meta.tag.holo", "entity.name.tag.holo"] },
        { text: ">", scopes: ["text.holo", "meta.tag.holo", "punctuation.definition.tag.end.holo"] },
      ];

      assert.deepStrictEqual(tokens, expected);
    });
  });
});
