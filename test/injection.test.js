const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vsctm = require("vscode-textmate");
const oniguruma = require("vscode-oniguruma");

const wasmBin = fs.readFileSync(
  path.join(__dirname, "../node_modules/vscode-oniguruma/release/onig.wasm")
);

const grammars = {
  "text.holo": path.join(__dirname, "../syntaxes/holo.tmLanguage.json"),
  "text.holo.injection": path.join(
    __dirname,
    "../syntaxes/holo_injection.tmLanguage.json"
  ),
  "source.elixir": path.join(__dirname, "grammars/elixir.tmLanguage.json"),
};

let registry;

async function getRegistry() {
  if (registry) return registry;

  const vscodeOnigurumaLib = oniguruma.loadWASM({ data: wasmBin }).then(() => ({
    createOnigScanner: (patterns) => new oniguruma.OnigScanner(patterns),
    createOnigString: (s) => new oniguruma.OnigString(s),
  }));

  registry = new vsctm.Registry({
    onigLib: vscodeOnigurumaLib,
    loadGrammar: async (scopeName) => {
      const grammarPath = grammars[scopeName];
      if (!grammarPath || !fs.existsSync(grammarPath)) return null;
      const content = fs.readFileSync(grammarPath, "utf-8");
      return vsctm.parseRawGrammar(content, grammarPath);
    },
    getInjections: (scopeName) => {
      if (scopeName === "source.elixir") {
        return ["text.holo.injection"];
      }
      return [];
    },
  });

  return registry;
}

async function tokenize(input) {
  const reg = await getRegistry();
  const grammar = await reg.loadGrammar("source.elixir");
  const lines = input.split("\n");
  const tokens = [];
  let ruleStack = vsctm.INITIAL;

  for (const line of lines) {
    const result = grammar.tokenizeLine(line, ruleStack);

    for (const token of result.tokens) {
      const text = line.substring(token.startIndex, token.endIndex);
      tokens.push({ text, scopes: token.scopes });
    }

    ruleStack = result.ruleStack;
  }

  return tokens;
}

describe("HOLO injection grammar", () => {
  describe("holo_sigil_heredoc", () => {
    it("heredoc with template content", async () => {
      const tokens = await tokenize('~HOLO"""\n<div>{@name}</div>\n"""');

      const expected = [
        { text: "~HOLO", scopes: ["source.elixir", "meta.embedded.holo.elixir", "keyword.operator.sigil.elixir"] },
        { text: '"""', scopes: ["source.elixir", "meta.embedded.holo.elixir", "punctuation.definition.string.begin.elixir"] },
        { text: "<", scopes: ["source.elixir", "meta.embedded.holo.elixir", "text.holo", "meta.tag.holo", "punctuation.definition.tag.begin.holo"] },
        { text: "div", scopes: ["source.elixir", "meta.embedded.holo.elixir", "text.holo", "meta.tag.holo", "entity.name.tag.holo"] },
        { text: ">", scopes: ["source.elixir", "meta.embedded.holo.elixir", "text.holo", "meta.tag.holo", "punctuation.definition.tag.end.holo"] },
        { text: "{", scopes: ["source.elixir", "meta.embedded.holo.elixir", "text.holo", "meta.embedded.expression.holo", "punctuation.section.embedded.begin.holo"] },
        { text: "@name", scopes: ["source.elixir", "meta.embedded.holo.elixir", "text.holo", "meta.embedded.expression.holo", "variable.other.attribute.elixir"] },
        { text: "}", scopes: ["source.elixir", "meta.embedded.holo.elixir", "text.holo", "meta.embedded.expression.holo", "punctuation.section.embedded.end.holo"] },
        { text: "</", scopes: ["source.elixir", "meta.embedded.holo.elixir", "text.holo", "meta.tag.holo", "punctuation.definition.tag.begin.holo"] },
        { text: "div", scopes: ["source.elixir", "meta.embedded.holo.elixir", "text.holo", "meta.tag.holo", "entity.name.tag.holo"] },
        { text: ">", scopes: ["source.elixir", "meta.embedded.holo.elixir", "text.holo", "meta.tag.holo", "punctuation.definition.tag.end.holo"] },
        { text: '"""', scopes: ["source.elixir", "meta.embedded.holo.elixir", "punctuation.definition.string.end.elixir"] },
      ];

      assert.deepStrictEqual(tokens, expected);
    });
  });
});
