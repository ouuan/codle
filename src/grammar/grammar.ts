import * as RAW_GRAMMAR from 'tree-sitter-cpp/src/grammar.json';

export const GRAMMAR = RAW_GRAMMAR as TreeSitterGrammarSpecification;

export const aliases = new Map<string, Set<string>>(
  Object.keys(GRAMMAR.rules).map((name) => [name, new Set([name])]),
);
function findAliases(rule: Rule) {
  if (rule.type === 'ALIAS' && rule.content.type === 'SYMBOL') {
    const rules = aliases.get(rule.value);
    if (rules) rules.add(rule.content.name);
    else aliases.set(rule.value, new Set([rule.content.name]));
  }
  if ('content' in rule) {
    findAliases(rule.content);
  }
  if ('members' in rule) {
    rule.members.forEach(findAliases);
  }
}
Object.values(GRAMMAR.rules).forEach(findAliases);

export const symbolChildren = new Map<string, Map<string, Set<string>>>();
function addChild(map: Map<string, Set<string>>, name: string, symbol: string) {
  const set = map.get(name);
  if (set) {
    set.add(symbol);
  } else {
    map.set(name, new Set<string>([symbol]));
  }
}
function findSymbolChildren(rule: Rule, map: Map<string, Set<string>>) {
  if (rule.type === 'ALIAS') {
    if (rule.content.type === 'SYMBOL') {
      addChild(map, rule.value, rule.content.name);
    }
  } else if (rule.type === 'SYMBOL') {
    if (rule.name[0] === '_') {
      findSymbolChildren(GRAMMAR.rules[rule.name], map);
    } else {
      addChild(map, rule.name, rule.name);
    }
  } else {
    if ('content' in rule) {
      findSymbolChildren(rule.content, map);
    }
    if ('members' in rule) {
      rule.members.forEach((child) => findSymbolChildren(child, map));
    }
  }
}
Object.entries(GRAMMAR.rules).forEach(([name, rule]) => {
  const map = new Map<string, Set<string>>();
  symbolChildren.set(name, map);
  findSymbolChildren(rule, map);
});
