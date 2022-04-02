<template>
  <n-button
    quaternary
    :type="labelType"
    @click="showCode = true"
  >
    {{ option.label }}
    [{{ option.node.startPosition.row + 1 }}, {{ option.node.startPosition.column + 1 }}]
    -
    [{{ option.node.endPosition.row + 1 }}, {{ option.node.endPosition.column + 1 }}]
    &nbsp;
    <template v-if="option.correct === 'correct'">
      <span v-if="correctButCodeDiff">
        ☑️
      </span>
      <span v-else-if="option.allCorrect">
        ✅
      </span>
      <n-text
        v-else
        :type="countType"
      >
        ({{ option.node.namedChildCount }}/{{ option.correctChildCount }})
      </n-text>
    </template>
  </n-button>
  <n-modal
    v-if="showCode"
    v-model:show="showCode"
    preset="card"
    :title="codeTitle"
    style="max-width: calc(min(90vw, 800px));"
  >
    <n-grid
      :cols="correctButCodeDiff ? '1 m:2' : '1'"
      :x-gap="10"
      :y-gap="10"
      responsive="screen"
    >
      <n-gi>
        <code-editor
          read-only
          height="40vh"
          :first-line-number="option.node.startPosition.row + 1"
          :code="Array(option.node.startPosition.column + 1).join(' ') + option.node.text"
        />
      </n-gi>
      <n-gi>
        <code-editor
          v-if="correctButCodeDiff"
          read-only
          height="40vh"
          :first-line-number="(option.correctStartRow ?? 0) + 1"
          :code="Array((option.correctStartCol ?? 0) + 1).join(' ') + (option.correctText ?? '')"
        />
      </n-gi>
    </n-grid>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  NButton,
  NGi,
  NGrid,
  NModal,
  NText,
} from 'naive-ui';
import { exhaustiveCheck } from 'ts-exhaustive-check';

import { TreeOptionEx } from '../types';
import CodeEditor from './CodeEditor.vue';

const props = defineProps<{
  option: TreeOptionEx,
}>();

const labelType = computed(() => {
  switch (props.option.correct) {
    case 'correct':
      return 'success';
    case 'misplaced':
      return 'warning';
    case 'wrong':
      return 'default';
    default:
      return exhaustiveCheck(props.option.correct);
  }
});

const countType = computed(() => {
  if (props.option.correct !== 'correct') return 'default';
  if (props.option.node.namedChildCount === props.option.correctChildCount) return 'success';
  return 'warning';
});

const correctButCodeDiff = computed(() => props.option.allCorrect
                                    && props.option.node.text !== props.option.correctText);

const codeTitle = computed(() => {
  if (!props.option.allCorrect) return 'Your code of this subtree';
  if (correctButCodeDiff.value) return 'Your code & target code of this subtree';
  return 'Your code (the same as target code) of this subtree';
});

const showCode = ref(false);
</script>
