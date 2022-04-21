<template>
  <code-mirror
    ref="editorRef"
    :key="forceUpdate"
    border
    class="editor"
    :value="code"
    :options="cmOptions"
    :height="height"
    @change="updateCode"
    @blur="updateCode"
  />
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  reactive,
  ref,
  toRef,
  watch,
} from 'vue';
import { useMessage, useOsTheme, useThemeVars } from 'naive-ui';
import CodeMirror, { CmComponentRef } from 'codemirror-editor-vue3';
import { Editor, EditorConfiguration, Position } from 'codemirror';
import { useElementSize, watchThrottled } from '@vueuse/core';

import 'codemirror/mode/clike/clike.js';
import 'codemirror/theme/gruvbox-dark.css';

import { uiDark, codeFontFamily, codeLineWrap } from '../store/localStorage';

const props = defineProps<{
  code: string,
  height?: number | string,
  readOnly: boolean,
  lengthLimit?: number,
  firstLineNumber?: number,
}>();

const osTheme = useOsTheme();
const cmOptions = computed((): EditorConfiguration => ({
  mode: 'text/x-c++src',
  theme: uiDark(osTheme) ? 'gruvbox-dark' : 'default',
  indentUnit: 4,
  lineWrapping: codeLineWrap.value,
  readOnly: props.readOnly,
  firstLineNumber: props.firstLineNumber ?? 1,
  ...(props.readOnly ? {
    cursorBlinkRate: -1,
    inputStyle: 'textarea', // fix cursor not hidden in readonly editors on mobile
  } : {}),
}));

const editorRef = ref<CmComponentRef>(null);
const cmInstance = ref<Editor>();
const message = useMessage();

const forceUpdate = ref(0);
watch(editorRef, () => {
  cmInstance.value = editorRef.value?.cminstance;
  const { lengthLimit } = props;
  if (lengthLimit) {
    cmInstance.value?.on('beforeChange', (cm, change) => {
      const str = change.text.join('\n');
      const newLength = cm.getValue().length + change.text.join('\n').length - (cm.indexFromPos(change.to) - cm.indexFromPos(change.from));
      if (newLength > lengthLimit) {
        message.error('Code length limit exceeded');
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

function refreshEditor() {
  nextTick(() => cmInstance.value?.refresh());
}

watch(() => props.readOnly, () => {
  forceUpdate.value += 1;
  refreshEditor();
});

const emit = defineEmits<{
  (e: 'update:code', value: string): void
}>();
function updateCode() {
  if (cmInstance.value) {
    emit('update:code', cmInstance.value.getValue());
  }
}

const codeFontFamilyFallback = computed(() => codeFontFamily.value || 'monospace');

function markRange(from: Position, to: Position, scroll: boolean) {
  cmInstance.value?.setSelection(from, to, { scroll });
}
defineExpose({ markRange });

const themeFontSize = toRef(useThemeVars().value, 'fontSize');

watch([codeFontFamilyFallback, themeFontSize], refreshEditor);

const size = reactive(useElementSize(editorRef as any));
watchThrottled(size, refreshEditor, { throttle: 300 });
</script>

<style scoped>
.editor:deep(.CodeMirror) {
  font-size: v-bind(themeFontSize);
  font-family: v-bind(codeFontFamilyFallback), monospace !important;
}
</style>
