<template>
  <n-grid
    cols="1 m:2"
    responsive="screen"
  >
    <n-gi>
      <code-editor
        ref="editor"
        :code="code"
        :read-only="true"
      />
    </n-gi>
    <n-gi>
      <syntax-tree
        :code="code"
        :correct-root="correctRoot"
        :set-selection="editor?.setSelection"
      />
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NGrid, NGi } from 'naive-ui';
import { SyntaxNode } from 'web-tree-sitter';

import CodeEditor from './CodeEditor.vue';
import SyntaxTree from './SyntaxTree.vue';

defineProps<{
  correctRoot?: SyntaxNode,
  code: string,
}>();

const editor = ref<InstanceType<typeof CodeEditor>>();
</script>
