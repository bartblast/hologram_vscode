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

  describe("attribute_name", () => {
    it("boolean attribute", async () => {
      const tokens = await tokenize("<div id>");

      const expected = [
        { text: "<", scopes: ["text.holo", "meta.tag.holo", "punctuation.definition.tag.begin.holo"] },
        { text: "div", scopes: ["text.holo", "meta.tag.holo", "entity.name.tag.holo"] },
        { text: " ", scopes: ["text.holo", "meta.tag.holo"] },
        { text: "id", scopes: ["text.holo", "meta.tag.holo", "entity.other.attribute-name.holo"] },
        { text: ">", scopes: ["text.holo", "meta.tag.holo", "punctuation.definition.tag.end.holo"] },
      ];

      assert.deepStrictEqual(tokens, expected);
    });

    it("another boolean attribute", async () => {
      const tokens = await tokenize("<div checked>");

      const expected = [
        { text: "<", scopes: ["text.holo", "meta.tag.holo", "punctuation.definition.tag.begin.holo"] },
        { text: "div", scopes: ["text.holo", "meta.tag.holo", "entity.name.tag.holo"] },
        { text: " ", scopes: ["text.holo", "meta.tag.holo"] },
        { text: "checked", scopes: ["text.holo", "meta.tag.holo", "entity.other.attribute-name.holo"] },
        { text: ">", scopes: ["text.holo", "meta.tag.holo", "punctuation.definition.tag.end.holo"] },
      ];

      assert.deepStrictEqual(tokens, expected);
    });

    it("hyphenated attribute name", async () => {
      const tokens = await tokenize("<div aria-modal>");

      const expected = [
        { text: "<", scopes: ["text.holo", "meta.tag.holo", "punctuation.definition.tag.begin.holo"] },
        { text: "div", scopes: ["text.holo", "meta.tag.holo", "entity.name.tag.holo"] },
        { text: " ", scopes: ["text.holo", "meta.tag.holo"] },
        { text: "aria-modal", scopes: ["text.holo", "meta.tag.holo", "entity.other.attribute-name.holo"] },
        { text: ">", scopes: ["text.holo", "meta.tag.holo", "punctuation.definition.tag.end.holo"] },
      ];

      assert.deepStrictEqual(tokens, expected);
    });

    it("data attribute name", async () => {
      const tokens = await tokenize("<div data-value>");

      const expected = [
        { text: "<", scopes: ["text.holo", "meta.tag.holo", "punctuation.definition.tag.begin.holo"] },
        { text: "div", scopes: ["text.holo", "meta.tag.holo", "entity.name.tag.holo"] },
        { text: " ", scopes: ["text.holo", "meta.tag.holo"] },
        { text: "data-value", scopes: ["text.holo", "meta.tag.holo", "entity.other.attribute-name.holo"] },
        { text: ">", scopes: ["text.holo", "meta.tag.holo", "punctuation.definition.tag.end.holo"] },
      ];

      assert.deepStrictEqual(tokens, expected);
    });
  });

  describe("attribute_equals", () => {
    it("equals sign between attribute name and value", async () => {
      const tokens = await tokenize('<div id=');

      const expected = [
        { text: "<", scopes: ["text.holo", "meta.tag.holo", "punctuation.definition.tag.begin.holo"] },
        { text: "div", scopes: ["text.holo", "meta.tag.holo", "entity.name.tag.holo"] },
        { text: " ", scopes: ["text.holo", "meta.tag.holo"] },
        { text: "id", scopes: ["text.holo", "meta.tag.holo", "entity.other.attribute-name.holo"] },
        { text: "=", scopes: ["text.holo", "meta.tag.holo", "punctuation.separator.key-value.holo"] },
      ];

      assert.deepStrictEqual(tokens, expected);
    });
  });

  describe("attribute_value_double", () => {
    it("full attribute with string value", async () => {
      const tokens = await tokenize('<div id="test">');

      const expected = [
        { text: "<", scopes: ["text.holo", "meta.tag.holo", "punctuation.definition.tag.begin.holo"] },
        { text: "div", scopes: ["text.holo", "meta.tag.holo", "entity.name.tag.holo"] },
        { text: " ", scopes: ["text.holo", "meta.tag.holo"] },
        { text: "id", scopes: ["text.holo", "meta.tag.holo", "entity.other.attribute-name.holo"] },
        { text: "=", scopes: ["text.holo", "meta.tag.holo", "punctuation.separator.key-value.holo"] },
        { text: "\"", scopes: ["text.holo", "meta.tag.holo", "string.quoted.double.holo", "punctuation.definition.string.begin.holo"] },
        { text: "test", scopes: ["text.holo", "meta.tag.holo", "string.quoted.double.holo"] },
        { text: "\"", scopes: ["text.holo", "meta.tag.holo", "string.quoted.double.holo", "punctuation.definition.string.end.holo"] },
        { text: ">", scopes: ["text.holo", "meta.tag.holo", "punctuation.definition.tag.end.holo"] },
      ];

      assert.deepStrictEqual(tokens, expected);
    });

    it("string with spaces", async () => {
      const tokens = await tokenize('<div class="foo bar">');

      const expected = [
        { text: "<", scopes: ["text.holo", "meta.tag.holo", "punctuation.definition.tag.begin.holo"] },
        { text: "div", scopes: ["text.holo", "meta.tag.holo", "entity.name.tag.holo"] },
        { text: " ", scopes: ["text.holo", "meta.tag.holo"] },
        { text: "class", scopes: ["text.holo", "meta.tag.holo", "entity.other.attribute-name.holo"] },
        { text: "=", scopes: ["text.holo", "meta.tag.holo", "punctuation.separator.key-value.holo"] },
        { text: "\"", scopes: ["text.holo", "meta.tag.holo", "string.quoted.double.holo", "punctuation.definition.string.begin.holo"] },
        { text: "foo bar", scopes: ["text.holo", "meta.tag.holo", "string.quoted.double.holo"] },
        { text: "\"", scopes: ["text.holo", "meta.tag.holo", "string.quoted.double.holo", "punctuation.definition.string.end.holo"] },
        { text: ">", scopes: ["text.holo", "meta.tag.holo", "punctuation.definition.tag.end.holo"] },
      ];

      assert.deepStrictEqual(tokens, expected);
    });

    it("multiple attributes", async () => {
      const tokens = await tokenize('<div id="test" class="foo">');

      const expected = [
        { text: "<", scopes: ["text.holo", "meta.tag.holo", "punctuation.definition.tag.begin.holo"] },
        { text: "div", scopes: ["text.holo", "meta.tag.holo", "entity.name.tag.holo"] },
        { text: " ", scopes: ["text.holo", "meta.tag.holo"] },
        { text: "id", scopes: ["text.holo", "meta.tag.holo", "entity.other.attribute-name.holo"] },
        { text: "=", scopes: ["text.holo", "meta.tag.holo", "punctuation.separator.key-value.holo"] },
        { text: "\"", scopes: ["text.holo", "meta.tag.holo", "string.quoted.double.holo", "punctuation.definition.string.begin.holo"] },
        { text: "test", scopes: ["text.holo", "meta.tag.holo", "string.quoted.double.holo"] },
        { text: "\"", scopes: ["text.holo", "meta.tag.holo", "string.quoted.double.holo", "punctuation.definition.string.end.holo"] },
        { text: " ", scopes: ["text.holo", "meta.tag.holo"] },
        { text: "class", scopes: ["text.holo", "meta.tag.holo", "entity.other.attribute-name.holo"] },
        { text: "=", scopes: ["text.holo", "meta.tag.holo", "punctuation.separator.key-value.holo"] },
        { text: "\"", scopes: ["text.holo", "meta.tag.holo", "string.quoted.double.holo", "punctuation.definition.string.begin.holo"] },
        { text: "foo", scopes: ["text.holo", "meta.tag.holo", "string.quoted.double.holo"] },
        { text: "\"", scopes: ["text.holo", "meta.tag.holo", "string.quoted.double.holo", "punctuation.definition.string.end.holo"] },
        { text: ">", scopes: ["text.holo", "meta.tag.holo", "punctuation.definition.tag.end.holo"] },
      ];

      assert.deepStrictEqual(tokens, expected);
    });
  });

  describe("doctype", () => {
    it("standard HTML doctype", async () => {
      const tokens = await tokenize("<!DOCTYPE html>");

      const expected = [
        { text: "<!", scopes: ["text.holo", "meta.tag.metadata.doctype.holo", "punctuation.definition.tag.begin.holo"] },
        { text: "DOCTYPE", scopes: ["text.holo", "meta.tag.metadata.doctype.holo", "entity.name.tag.doctype.holo"] },
        { text: " ", scopes: ["text.holo", "meta.tag.metadata.doctype.holo"] },
        { text: "html", scopes: ["text.holo", "meta.tag.metadata.doctype.holo", "string.unquoted.holo"] },
        { text: ">", scopes: ["text.holo", "meta.tag.metadata.doctype.holo", "punctuation.definition.tag.end.holo"] },
      ];

      assert.deepStrictEqual(tokens, expected);
    });
  });

  describe("comment", () => {
    it("single-line comment", async () => {
      const tokens = await tokenize("<!-- my comment -->");

      const expected = [
        { text: "<!--", scopes: ["text.holo", "comment.block.holo", "punctuation.definition.comment.begin.holo"] },
        { text: " my comment ", scopes: ["text.holo", "comment.block.holo"] },
        { text: "-->", scopes: ["text.holo", "comment.block.holo", "punctuation.definition.comment.end.holo"] },
      ];

      assert.deepStrictEqual(tokens, expected);
    });

    it("multi-line comment", async () => {
      const tokens = await tokenize("<!-- line one\nline two -->");

      const expected = [
        { text: "<!--", scopes: ["text.holo", "comment.block.holo", "punctuation.definition.comment.begin.holo"] },
        { text: " line one", scopes: ["text.holo", "comment.block.holo"] },
        { text: "line two ", scopes: ["text.holo", "comment.block.holo"] },
        { text: "-->", scopes: ["text.holo", "comment.block.holo", "punctuation.definition.comment.end.holo"] },
      ];

      assert.deepStrictEqual(tokens, expected);
    });
  });

  describe("escape_sequence", () => {
    it("escaped opening brace", async () => {
      const tokens = await tokenize("\\{");

      const expected = [
        { text: "\\{", scopes: ["text.holo", "constant.character.escape.holo"] },
      ];

      assert.deepStrictEqual(tokens, expected);
    });

    it("escaped closing brace", async () => {
      const tokens = await tokenize("\\}");

      const expected = [
        { text: "\\}", scopes: ["text.holo", "constant.character.escape.holo"] },
      ];

      assert.deepStrictEqual(tokens, expected);
    });

    it("escaped hash", async () => {
      const tokens = await tokenize("\\#");

      const expected = [
        { text: "\\#", scopes: ["text.holo", "constant.character.escape.holo"] },
      ];

      assert.deepStrictEqual(tokens, expected);
    });

    it("escaped dollar", async () => {
      const tokens = await tokenize("\\$");

      const expected = [
        { text: "\\$", scopes: ["text.holo", "constant.character.escape.holo"] },
      ];

      assert.deepStrictEqual(tokens, expected);
    });
  });
});
