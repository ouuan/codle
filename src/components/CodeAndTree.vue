<template>
  <n-grid
    cols="1 m:2"
    :x-gap="8"
    :y-gap="6"
    responsive="screen"
  >
    <n-gi>
      <code-editor
        :code="code"
        read-only
      />
    </n-gi>
    <n-gi>
      <syntax-tree
        :code="code"
        :correct-root="correctRoot"
      />
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { NGrid, NGi } from 'naive-ui';
import { SyntaxNode } from 'web-tree-sitter';

import CodeEditor from './CodeEditor.vue';
import SyntaxTree from './SyntaxTree.vue';

defineProps<{
  correctRoot?: SyntaxNode,
  code: string,
}>();
</script>
