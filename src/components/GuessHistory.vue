<template>
  <n-space vertical>
    <n-space>
      <n-form-item
        label="Guess"
        label-placement="left"
        :show-feedback="false"
      >
        <n-space>
          <n-input-number
            :key="refreshInputNumber"
            v-model:value="id"
            :validator="validator"
            style="max-width: 15em;"
          >
            <template #prefix>
              #
            </template>
            <template #suffix>
              in {{ guesses.length }} guess{{ guesses.length >= 2 ? 'es' : '' }}
            </template>
          </n-input-number>
        </n-space>
      </n-form-item>
      <n-tooltip>
        <template #trigger>
          <n-button
            secondary
            type="info"
            @click="jumpToLast"
          >
            Last Guess
          </n-button>
        </template>
        Jump to the last guess
      </n-tooltip>
      <n-tooltip
        v-if="!finished && !gaveUp"
        width="trigger"
      >
        <template #trigger>
          <n-button
            secondary
            type="success"
            @click="applyTargetCodeAndModification"
          >
            Apply target code &amp; modification
          </n-button>
        </template>
        Replace the codes of correct subtrees with target codes,
        and replace incorrect nodes with modifications made in the dialog
      </n-tooltip>
    </n-space>
    <n-form
      label-placement="left"
      label-width="auto"
      :show-feedback="false"
    >
      <n-form-item label="Correct Nodes">
        <n-progress
          type="line"
          :percentage="nodePercent"
          class="progress-line"
        />
      </n-form-item>
      <n-form-item label="Correct Depths">
        <n-progress
          type="line"
          :percentage="depthPercent"
          class="progress-line"
        >
          {{ correctDepth }} / {{ targetMaxDepth + 1 }}
        </n-progress>
      </n-form-item>
    </n-form>
    <code-and-tree
      global-root-tree-option
      :code="code"
      :correct-root="correctRoot"
    />
  </n-space>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  watch,
} from 'vue';
import {
  NButton,
  NForm,
  NFormItem,
  NInputNumber,
  NProgress,
  NSpace,
  NTooltip,
} from 'naive-ui';
import { SyntaxNode } from 'web-tree-sitter';

import CodeAndTree from './CodeAndTree.vue';

import {
  currentStreak,
  depthFinishedAt,
  finished,
  gaveUp,
  guessSum,
  guesses,
  lastSuccess,
  maxStreak,
  successCount,
} from '../store/localStorage';
import { correctPuzzleNumber } from '../../config';
import { rootTreeOption } from '../store/rootTreeOption';
import { trackEvent } from '../plausible';

const props = defineProps<{ correctRoot: SyntaxNode | null }>();

const id = ref(guesses.value.length);
const code = computed(() => guesses.value[id.value - 1] ?? '');

function validator(value: number) {
  return Number.isSafeInteger(value) && value >= 1 && value <= guesses.value.length;
}

function jumpToLast() {
  id.value = guesses.value.length;
}
watch(() => guesses.value.length, jumpToLast);

const emit = defineEmits<{
  (e: 'applyTargetCodeAndModification'): void
}>();
function applyTargetCodeAndModification() {
  emit('applyTargetCodeAndModification');
}

const targetMaxDepth = computed(() => {
  if (!props.correctRoot) return 0;
  function subtreeMaxDepth(node: SyntaxNode): number {
    return node.namedChildren.reduce((max, child) => Math.max(max, subtreeMaxDepth(child) + 1), 0);
  }
  return subtreeMaxDepth(props.correctRoot);
});
const targetNodeCount = computed(() => {
  if (!props.correctRoot) return 1;
  function subtreeSize(node: SyntaxNode): number {
    return node.namedChildren.reduce((size, child) => size + subtreeSize(child), 1);
  }
  return subtreeSize(props.correctRoot);
});

const refreshInputNumber = ref(0);

watch(rootTreeOption, () => {
  refreshInputNumber.value += 1;
  if (!props.correctRoot) return;
  const root = rootTreeOption.value;
  if (!root) return;
  while (root.minWrongDepth >= depthFinishedAt.value.length
         && depthFinishedAt.value.length <= targetMaxDepth.value + 1) {
    depthFinishedAt.value.push(guesses.value.length);
  }
  if (!finished.value && root.allCorrect) {
    finished.value = true;
    successCount.value += 1;
    if (correctPuzzleNumber === lastSuccess.value + 1) {
      currentStreak.value += 1;
    } else if (lastSuccess.value < correctPuzzleNumber - 1) {
      currentStreak.value = 1;
    }
    maxStreak.value = Math.max(maxStreak.value, currentStreak.value);
    lastSuccess.value = correctPuzzleNumber;
    guessSum.value += guesses.value.length;
    trackEvent('Game Success', {
      props: {
        // https://github.com/plausible/plausible-tracker/pull/27
        guessCount: guesses.value.length as any as string,
        puzzleId: correctPuzzleNumber as any as string,
      },
    });
  }
});

const nodePercent = computed(() => {
  if (!rootTreeOption.value) return 0;
  return Math.floor((rootTreeOption.value.correctCount / targetNodeCount.value) * 100);
});
const correctDepth = computed(() => {
  if (!rootTreeOption.value) return 0;
  if (rootTreeOption.value.minWrongDepth === Infinity) return targetMaxDepth.value + 1;
  return rootTreeOption.value.minWrongDepth;
});
const depthPercent = computed(() => (correctDepth.value / (targetMaxDepth.value + 1)) * 100);
</script>

<style scoped>
.progress-line:deep(.n-progress-graph) {
  max-width: 300px;
}
</style>
