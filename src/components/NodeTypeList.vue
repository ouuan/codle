<template>
  <n-card :title="`List of node types in this puzzle${incomplete ? ' (incomplete)' : ''}`">
    <n-ul>
      <n-li
        v-for="type of typeList"
        :key="type"
      >
        <grammar-rule-dialog
          :name="type"
          :symbols="symbolNames(type)"
          :type="textType(type)"
        >
          {{ type }} ({{ actualTypeCount.get(type) ?? 0 }}/{{ correctTypeCount.get(type) ?? 0 }})
        </grammar-rule-dialog>
      </n-li>
      <n-li v-if="incomplete">
        …… (guess one more time to unlock)
      </n-li>
    </n-ul>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  NCard,
  NLi,
  NUl,
} from 'naive-ui';
import { SyntaxNode } from 'web-tree-sitter';

import GrammarRuleDialog from '../grammar/GrammarRuleDialog.vue';

import { guesses, finished } from '../store/localStorage';
import { rootTreeOption } from '../store/rootTreeOption';
import { aliases } from '../grammar/grammar';

const props = defineProps<{
  correctRoot: SyntaxNode | null,
}>();

function calcTypeCount(root?: SyntaxNode | null) {
  const count = new Map<string, number>();
  if (!root) return count;
  function dfs(node: SyntaxNode): void {
    const current = count.get(node.type) ?? 0;
    count.set(node.type, current + 1);
    node.namedChildren.forEach((child) => dfs(child));
  }
  dfs(root);
  return count;
}

const correctTypeCount = computed(() => calcTypeCount(props.correctRoot));

const actualTypeCount = computed(() => calcTypeCount(rootTreeOption.value?.node));

const typeList = computed(() => Array.from(correctTypeCount.value.entries())
  .sort(([typeL, countL], [typeR, countR]) => (countR - countL) || typeL.localeCompare(typeR))
  .slice(0, finished.value ? Infinity : guesses.value.length + 1)
  .map(([type]) => type));

const incomplete = computed(() => correctTypeCount.value.size > typeList.value.length);

function textType(type: string) {
  const correct = correctTypeCount.value.get(type) ?? 0;
  const actual = actualTypeCount.value.get(type) ?? 0;
  if (actual === 0) return 'default';
  if (actual === correct) return 'success';
  return 'warning';
}

function symbolNames(name: string) {
  const set = aliases.get(name);
  if (set) return Array.from(set);
  return [];
}
</script>
