// https://github.com/tree-sitter/tree-sitter/blob/master/cli/src/generate/grammar-schema.json
// https://github.com/tree-sitter/tree-sitter/blob/master/cli/npm/dsl.d.ts

type AliasRule = {type: 'ALIAS'; named: boolean; content: Rule; value: string};
type BlankRule = {type: 'BLANK'};
type ChoiceRule = {type: 'CHOICE'; members: Rule[]};
type FieldRule = {type: 'FIELD'; name: string; content: Rule};
type ImmediateTokenRule = {type: 'IMMEDIATE_TOKEN'; content: Rule};
type PatternRule = {type: 'PATTERN'; value: string};
type PrecDynamicRule = {type: 'PREC_DYNAMIC'; content: Rule; value: number};
type PrecLeftRule = {type: 'PREC_LEFT'; content: Rule; value: number};
type PrecRightRule = {type: 'PREC_RIGHT'; content: Rule; value: number};
type PrecRule = {type: 'PREC'; content: Rule; value: number};
type Repeat1Rule = {type: 'REPEAT1'; content: Rule};
type RepeatRule = {type: 'REPEAT'; content: Rule};
type SeqRule = {type: 'SEQ'; members: Rule[]};
type StringRule = {type: 'STRING'; value: string};
type SymbolRule<Name extends string> = {type: 'SYMBOL'; name: Name};
type TokenRule = {type: 'TOKEN'; content: Rule};

type Rule =
  | AliasRule
  | BlankRule
  | ChoiceRule
  | FieldRule
  | ImmediateTokenRule
  | PatternRule
  | PrecDynamicRule
  | PrecLeftRule
  | PrecRightRule
  | PrecRule
  | Repeat1Rule
  | RepeatRule
  | SeqRule
  | StringRule
  | SymbolRule<string>
  | TokenRule;

interface TreeSitterGrammarSpecification {
  name: string
  rules: {
    [k: string]: Rule
  }
  extras?: Rule[]
  externals?: Rule[]
  inline?: string[]
  conflicts?: string[][]
  word?: string
  supertypes?: string[]
}
