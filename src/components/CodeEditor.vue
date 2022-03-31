<template>
  <code-mirror
    ref="editorRef"
    border
    :value="code"
    :options="cmOptions"
    :height="height"
    @change="onCodeChange"
  />
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
} from 'vue';
import CodeMirror, { CmComponentRef } from 'codemirror-editor-vue3';
import { Editor, EditorConfiguration } from 'codemirror';

import 'codemirror/mode/clike/clike.js';
import 'codemirror/theme/gruvbox-dark.css';

import { uiDark } from '../store/useLocalStorage';

const props = defineProps<{
  code: string,
  height?: number | string,
  readOnly: boolean | 'nocursor',
  lengthLimit?: number,
}>();

const cmOptions = computed((): EditorConfiguration => ({
  mode: 'text/x-c++src',
  theme: uiDark.value ? 'gruvbox-dark' : 'default',
  indentUnit: 4,
  readOnly: props.readOnly,
}));

const emit = defineEmits<{
  (e: 'update:code', value: string): void
}>();
function onCodeChange(val: string) {
  emit('update:code', val);
}

const editorRef = ref<CmComponentRef>(null);
const cmInstance = ref<Editor>();
onMounted(() => {
  cmInstance.value = editorRef.value?.cminstance;
  const { lengthLimit } = props;
  if (lengthLimit) {
    cmInstance.value?.on('beforeChange', (cm, change) => {
      const str = change.text.join('\n');
      const newLength = cm.getValue().length + change.text.join('\n').length - (cm.indexFromPos(change.to) - cm.indexFromPos(change.from));
      if (newLength > lengthLimit) {
        const newChange = str.slice(0, str.length - (newLength - lengthLimit));
        if (change.update) {
          change.update(change.from, change.to, newChange.split('\n'));
        } else {
          return false;
        }
      }
      return true;
    });
  }
});

function setSelection(pos1: CodeMirror.Position, pos2: CodeMirror.Position) {
  cmInstance.value?.setSelection(pos1, pos2);
}

defineExpose({
  setSelection,
});
</script>

<style>
.CodeMirror {
  font-size: 14px;
}
</style>
