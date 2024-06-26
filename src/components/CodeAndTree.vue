<template>
  <n-grid
    cols="1 m:2"
    :x-gap="8"
    :y-gap="6"
    responsive="screen"
  >
    <n-gi>
      <code-editor
        ref="editor"
        :code="code"
        :style="{ maxHeight }"
        read-only
      />
    </n-gi>
    <n-gi>
      <syntax-tree
        :use-global-root-tree-option="useGlobalRootTreeOption"
        :guess-root="guessRoot"
        :correct-root="correctRoot"
        :mark-range="editor?.markRange"
        :max-height="maxHeight"
      />
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NGrid, NGi } from 'naive-ui';
import { SyntaxNode } from 'web-tree-sitter';
import { computedAsync } from '@vueuse/core';

import CodeEditor from './CodeEditor.vue';
import SyntaxTree from './SyntaxTree.vue';

import { parse } from '../parse';

const props = withDefaults(defineProps<{
  useGlobalRootTreeOption: boolean,
  correctRoot: SyntaxNode | null,
  code: string,
  maxHeight?: string,
}>(), {
  maxHeight: '60vh',
});

const editor = ref<InstanceType<typeof CodeEditor>>();

const guessRoot = computedAsync(async () => {
  const tree = await parse(props.code);
  return tree.rootNode;
}, null);
</script>
