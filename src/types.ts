import { SyntaxNode } from 'web-tree-sitter';
import { TreeOption } from 'naive-ui';
import { Position } from 'codemirror';

export type CorrectStatus = 'correct' | 'misplaced' | 'wrong';

export interface TreeOptionEx extends TreeOption {
  node: SyntaxNode,
  correctChildCount: number,
  correct: CorrectStatus,
  correctText?: string,
  correctStartRow?: number,
  correctStartCol?: number,
  allCorrect: boolean,
  children: TreeOptionEx[],
  depth: number,
  minWrongDepth: number,
  correctCount: number,
}

// it's actually useless and provides only minimum (inadequate) check as a type guard
export function isTreeOptionEx(option: TreeOption): option is TreeOptionEx {
  return option.node !== null && typeof option.node === 'object';
}

export type MarkRange = (from: Position, to: Position, scroll: boolean) => void;

export type Rating = 0|1|2|3|4|5;
export function isRating(value: unknown): value is Rating {
  return ([0, 1, 2, 3, 4, 5] as unknown[]).includes(value);
}
