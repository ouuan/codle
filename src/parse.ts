import Parser from 'web-tree-sitter';

// load parser only once across all SyntaxTree instances
export const initParser = (async () => {
  await Parser.init();
  const parser = new Parser();
  const Lang = await Parser.Language.load('/tree-sitter-cpp.wasm');
  parser.setLanguage(Lang);
  return parser;
})();

export async function parse(code: string) {
  const parser = await initParser;
  return parser.parse(code);
}
