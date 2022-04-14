<template>
  <n-card>
    <n-space vertical>
      <diff-view
        :prev="guess"
        :current="target"
      />
      <syntax-tree
        :global-root-tree-option="false"
        :guess-root="guessRoot"
        :correct-root="targetRoot"
      />
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NSpace } from 'naive-ui';
import { computedAsync } from '@vueuse/core';

import DiffView from './DiffView.vue';
import SyntaxTree from './SyntaxTree.vue';

import { parse } from '../parse';

const props = defineProps<{
  target: string,
  guess: string,
}>();

async function getRoot(code: string) {
  const tree = await parse(code);
  return tree.rootNode;
}

const targetRoot = computedAsync(() => getRoot(props.target), null);
const guessRoot = computedAsync(() => getRoot(props.guess), null);
</script>
