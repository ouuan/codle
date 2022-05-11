<template>
  <n-button
    quaternary
    size="small"
    :type="labelType"
    @click="showCode = true"
    @mouseover="markNode"
    @mouseleave="clearMark"
  >
    {{ option.label }} {{ rangeText }} &nbsp;
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
    <span v-if="option.modification !== null && option.modification !== option.node.text">
      📝
    </span>
  </n-button>
  <n-modal
    v-if="showCode"
    v-model:show="showCode"
    preset="card"
    size="medium"
    style="max-width: calc(min(90vw, 800px));"
  >
    <template #header>
      {{ option.node.type }} {{ rangeText }}
      <grammar-rule-dialog
        v-if="option.node.type !== 'ERROR'"
        :name="option.node.type"
        :symbols="symbolNames"
        type="info"
      >
        View grammar
      </grammar-rule-dialog>
    </template>
    <n-grid
      :cols="(correctButCodeDiff || !option.allCorrect) ? '1 m:2' : '1'"
      responsive="screen"
    >
      <n-gi>
        <n-card
          :bordered="false"
          size="small"
          :title="`Your code ${option.node.text === option.correctText ?
            '(the same as target code)' : ''}`"
        >
          <code-editor
            read-only
            height="40vh"
            :first-line-number="option.node.startPosition.row + 1"
            :code="(option.modification === null ?
              Array(option.node.startPosition.column + 1).join(' ') : '') + option.node.text"
          />
        </n-card>
      </n-gi>
      <n-gi>
        <n-card
          v-if="correctButCodeDiff"
          size="small"
          :bordered="false"
          title="Target code"
        >
          <code-editor
            read-only
            height="40vh"
            :first-line-number="(option.correctStartRow ?? 0) + 1"
            :code="Array((option.correctStartCol ?? 0) + 1).join(' ') + (option.correctText ?? '')"
          />
        </n-card>
        <n-card
          v-else-if="option.modification !== null"
          size="small"
          :bordered="false"
          title="Modification"
        >
          <code-editor
            :read-only="false"
            :code="option.modification"
            height="40vh"
            :first-line-number="option.node.startPosition.row + 1"
            @update:code="onModified"
          />
        </n-card>
      </n-gi>
    </n-grid>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  NButton,
  NCard,
  NGi,
  NGrid,
  NModal,
  NText,
} from 'naive-ui';
import { exhaustiveCheck } from 'ts-exhaustive-check';
import { Point } from 'web-tree-sitter';
import { Position } from 'codemirror';

import CodeEditor from './CodeEditor.vue';
import GrammarRuleDialog from '../grammar/GrammarRuleDialog.vue';

import { MarkRange, TreeOptionEx } from '../types';
import { GRAMMAR, symbolChildren } from '../grammar/grammar';

const props = defineProps<{
  option: TreeOptionEx,
  markRange?: MarkRange,
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

const showCode = ref(false);

function pointToPos({ row, column }: Point): Position {
  return {
    line: row,
    ch: column,
  };
}
function markNode() {
  // mark twice to scroll to whole range instead of only one line
  props.markRange?.(
    pointToPos(props.option.node.startPosition),
    pointToPos(props.option.node.endPosition),
    true,
  );
  props.markRange?.(
    pointToPos(props.option.node.endPosition),
    pointToPos(props.option.node.startPosition),
    true,
  );
}
function clearMark() {
  props.markRange?.({ line: 0, ch: 0 }, { line: 0, ch: 0 }, false);
}

const rangeText = computed(() => `[${props.option.node.startPosition.row + 1}, ${props.option.node.startPosition.column + 1}]`
                          + ` - [${props.option.node.endPosition.row + 1}, ${props.option.node.endPosition.column + 1}]`);

const emit = defineEmits<{
  (e: 'modified', modification: string): void
}>();
function onModified(code: string) {
  emit('modified', code);
}

const symbolNames = computed((): string[] => {
  const { node } = props.option;
  if (GRAMMAR.extras?.find((extra) => extra.type === 'SYMBOL' && extra.name === props.option.node.type)) {
    return [node.type];
  }
  if (node.parent === null) {
    return [node.type];
  }
  const path = [node.type];
  for (let u = node; u.parent; u = u.parent) {
    path.push(u.parent.type);
  }
  let names = new Set<string>([path[path.length - 1]]);
  for (let i = path.length - 2; i >= 0; i -= 1) {
    const newNames = new Set<string>();
    names.forEach((name) => {
      const map = symbolChildren.get(name);
      if (map) {
        const set = map.get(path[i]);
        if (set) {
          set.forEach((symbol) => newNames.add(symbol));
        }
      }
    });
    names = newNames;
  }
  return Array.from(names);
});
</script>
