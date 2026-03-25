const assert = require("node:assert");
const { tokenize } = require("./tokenization_helper");

describe("HOLO injection grammar", () => {
  describe("holo_sigil_heredoc", () => {
    it("works", async () => {
      const tokens = await tokenize(
        '~HOLO"""\n<div>{@name}</div>\n"""',
        "source.elixir",
      );

      const expected = [
        {
          text: "~HOLO",
          scopes: [
            "source.elixir",
            "meta.embedded.holo.elixir",
            "keyword.operator.sigil.elixir",
          ],
        },
        {
          text: '"""',
          scopes: [
            "source.elixir",
            "meta.embedded.holo.elixir",
            "punctuation.definition.string.begin.elixir",
          ],
        },
        {
          text: "<",
          scopes: [
            "source.elixir",
            "meta.embedded.holo.elixir",
            "text.holo",
            "meta.tag.holo",
            "punctuation.definition.tag.begin.holo",
          ],
        },
        {
          text: "div",
          scopes: [
            "source.elixir",
            "meta.embedded.holo.elixir",
            "text.holo",
            "meta.tag.holo",
            "entity.name.tag.holo",
          ],
        },
        {
          text: ">",
          scopes: [
            "source.elixir",
            "meta.embedded.holo.elixir",
            "text.holo",
            "meta.tag.holo",
            "punctuation.definition.tag.end.holo",
          ],
        },
        {
          text: "{",
          scopes: [
            "source.elixir",
            "meta.embedded.holo.elixir",
            "text.holo",
            "meta.embedded.expression.holo",
            "punctuation.section.embedded.begin.holo",
          ],
        },
        {
          text: "@name",
          scopes: [
            "source.elixir",
            "meta.embedded.holo.elixir",
            "text.holo",
            "meta.embedded.expression.holo",
            "variable.other.attribute.elixir",
          ],
        },
        {
          text: "}",
          scopes: [
            "source.elixir",
            "meta.embedded.holo.elixir",
            "text.holo",
            "meta.embedded.expression.holo",
            "punctuation.section.embedded.end.holo",
          ],
        },
        {
          text: "</",
          scopes: [
            "source.elixir",
            "meta.embedded.holo.elixir",
            "text.holo",
            "meta.tag.holo",
            "punctuation.definition.tag.begin.holo",
          ],
        },
        {
          text: "div",
          scopes: [
            "source.elixir",
            "meta.embedded.holo.elixir",
            "text.holo",
            "meta.tag.holo",
            "entity.name.tag.holo",
          ],
        },
        {
          text: ">",
          scopes: [
            "source.elixir",
            "meta.embedded.holo.elixir",
            "text.holo",
            "meta.tag.holo",
            "punctuation.definition.tag.end.holo",
          ],
        },
        {
          text: '"""',
          scopes: [
            "source.elixir",
            "meta.embedded.holo.elixir",
            "punctuation.definition.string.end.elixir",
          ],
        },
      ];

      assert.deepStrictEqual(tokens, expected);
    });
  });

  describe("holo_sigil_inline", () => {
    it("works", async () => {
      const tokens = await tokenize(
        '~HOLO"<div>content</div>"',
        "source.elixir",
      );

      const expected = [
        {
          text: "~HOLO",
          scopes: [
            "source.elixir",
            "meta.embedded.holo.elixir",
            "keyword.operator.sigil.elixir",
          ],
        },
        {
          text: '"',
          scopes: [
            "source.elixir",
            "meta.embedded.holo.elixir",
            "punctuation.definition.string.begin.elixir",
          ],
        },
        {
          text: "<",
          scopes: [
            "source.elixir",
            "meta.embedded.holo.elixir",
            "text.holo",
            "meta.tag.holo",
            "punctuation.definition.tag.begin.holo",
          ],
        },
        {
          text: "div",
          scopes: [
            "source.elixir",
            "meta.embedded.holo.elixir",
            "text.holo",
            "meta.tag.holo",
            "entity.name.tag.holo",
          ],
        },
        {
          text: ">",
          scopes: [
            "source.elixir",
            "meta.embedded.holo.elixir",
            "text.holo",
            "meta.tag.holo",
            "punctuation.definition.tag.end.holo",
          ],
        },
        {
          text: "content",
          scopes: ["source.elixir", "meta.embedded.holo.elixir", "text.holo"],
        },
        {
          text: "</",
          scopes: [
            "source.elixir",
            "meta.embedded.holo.elixir",
            "text.holo",
            "meta.tag.holo",
            "punctuation.definition.tag.begin.holo",
          ],
        },
        {
          text: "div",
          scopes: [
            "source.elixir",
            "meta.embedded.holo.elixir",
            "text.holo",
            "meta.tag.holo",
            "entity.name.tag.holo",
          ],
        },
        {
          text: ">",
          scopes: [
            "source.elixir",
            "meta.embedded.holo.elixir",
            "text.holo",
            "meta.tag.holo",
            "punctuation.definition.tag.end.holo",
          ],
        },
        {
          text: '"',
          scopes: [
            "source.elixir",
            "meta.embedded.holo.elixir",
            "punctuation.definition.string.end.elixir",
          ],
        },
      ];

      assert.deepStrictEqual(tokens, expected);
    });
  });
});
