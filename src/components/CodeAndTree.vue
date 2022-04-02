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
        class="editor-tree-height"
        read-only
      />
    </n-gi>
    <n-gi>
      <syntax-tree
        :code="code"
        :correct-root="correctRoot"
        :mark-range="editor?.markRange"
        class="editor-tree-height"
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

<style scoped>
.editor-tree-height {
  max-height: 60vh;
}
</style>
