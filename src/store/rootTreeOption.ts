import { ref } from 'vue';

import { TreeOptionEx } from '../types';

export const rootTreeOption = ref<TreeOptionEx>();

export function applyTargeCodeAndModification() {
  if (!rootTreeOption.value) return '';
  const code = rootTreeOption.value.node.text;
  const offset = rootTreeOption.value.node.startIndex;
  const parts: string[] = [];
  let pos = 0;
  function addPart(start: number, end: number, text: string) {
    parts.push(code.slice(pos, start));
    parts.push(text);
    pos = end;
  }
  function dfs(option: TreeOptionEx) {
    if (option.allCorrect && option.correctText) {
      addPart(option.node.startIndex - offset, option.node.endIndex - offset, option.correctText);
    } else if (option.modification !== null && option.modification !== option.node.text) {
      addPart(option.node.startIndex - offset, option.node.endIndex - offset, option.modification);
    } else {
      option.children.forEach((child) => dfs(child));
    }
  }
  dfs(rootTreeOption.value);
  parts.push(code.slice(pos));
  return parts.join('');
}
