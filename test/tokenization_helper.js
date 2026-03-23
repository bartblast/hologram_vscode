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
  });

  return registry;
}

async function tokenize(input) {
  const reg = await getRegistry();
  const grammar = await reg.loadGrammar("text.holo");
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

module.exports = { tokenize };
