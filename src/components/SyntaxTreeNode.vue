<template>
  <span
    @click="onClick"
    @mouseover="selectCodeRange"
    @mouseleave="unselectCode"
  >
    <n-text :type="labelType">
      {{ option.label }}
    </n-text>
    <template v-if="option.correct === 'correct'">
      <span v-if="option.allCorrect">
        ✅
        <n-button
          v-if="option.node.text !== option.correctText"
          quaternary
          type="info"
          @click="showCode = true"
        >
          View Target Code
        </n-button>
        <n-text
          v-else
          type="success"
        >
          Exactly
        </n-text>
      </span>
      <n-text
        v-else
        :type="countType"
      >
        ({{ option.node.namedChildCount }}/{{ option.correctChildCount }})
      </n-text>
    </template>
    <n-modal
      v-if="showCode"
      v-model:show="showCode"
      preset="card"
      title="Target code of this subtree"
      style="max-width: calc(min(90vw, 800px));"
    >
      <code-editor
        :read-only="true"
        :code="option.correctText ?? ''"
      />
    </n-modal>
  </span>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  NButton,
  NText,
  NModal,
} from 'naive-ui';
import { exhaustiveCheck } from 'ts-exhaustive-check';
import { Point } from 'web-tree-sitter';
import { Position } from 'codemirror';

import { TreeOptionEx } from '../types';
import CodeEditor from './CodeEditor.vue';

const props = defineProps<{
  option: TreeOptionEx,
  setSelection?: (pos1: Position, pos2: Position) => void,
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

function pointToPosition(point: Point): Position {
  return {
    line: point.row,
    ch: point.column,
  };
}
const pos1 = computed(() => pointToPosition(props.option.node.endPosition));
const pos2 = computed(() => pointToPosition(props.option.node.startPosition));

function selectCodeRange() {
  if (props.setSelection) {
    props.setSelection(pos1.value, pos2.value);
  }
}
function unselectCode() {
  if (props.setSelection) {
    props.setSelection({ line: 0, ch: 0 }, { line: 0, ch: 0 });
  }
}
function onClick() {
  selectCodeRange();
}

const showCode = ref(false);
</script>
