<template>
  <dialog-with-icon-button
    title="Previous Puzzles"
    dialog-style="width: calc(min(90vw, 840px)); height: calc(50vh + 260px);"
    @open="loadPuzzle"
  >
    <template #icon>
      <calendar-clear />
    </template>
    <n-space vertical>
      <n-pagination
        v-model:page="id"
        :page-count="correctPuzzleNumber - 1"
        :disabled="loading"
      />
      <n-card :title="`Puzzle #${id}`">
        <template #header-extra>
          <n-time
            :time="time"
            :type="timeType"
          />
          ~
          <n-time
            :time="time + puzzleInterval"
            :type="timeType"
          />
        </template>
        <n-space vertical>
          <n-tabs
            v-model:value="tab"
            type="line"
          >
            <n-tab name="statement">
              Statement
            </n-tab>
            <n-tab name="code">
              Target Code &amp; Syntax Tree
            </n-tab>
          </n-tabs>
          <div class="fixed-height">
            <n-alert
              v-if="error"
              type="error"
              title="Error loading puzzle"
            >
              <n-p>{{ error }}</n-p>
              <n-button @click="loadPuzzle">
                Try again
              </n-button>
            </n-alert>
            <n-space
              v-else-if="loading"
              justify="center"
            >
              <n-spin style="margin-top: 30px;">
                <template #description>
                  Loading Puzzle...
                </template>
              </n-spin>
            </n-space>
            <div v-else>
              <div
                v-show="tab === 'statement'"
                class="fixed-height"
              >
                <n-scrollbar>
                  <problem-statement :statement="statement" />
                </n-scrollbar>
              </div>
              <div v-show="tab === 'code'">
                <code-and-tree
                  :global-root-tree-option="false"
                  :code="targetCode"
                  :correct-root="treeRoot"
                  :max-height="codeAndTreeHeight"
                />
              </div>
            </div>
          </div>
        </n-space>
      </n-card>
    </n-space>
  </dialog-with-icon-button>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
  watch,
} from 'vue';
import {
  NAlert,
  NButton,
  NCard,
  NP,
  NPagination,
  NScrollbar,
  NSpin,
  NSpace,
  NTab,
  NTabs,
  NTime,
} from 'naive-ui';
import { CalendarClear } from '@vicons/ionicons5';
import { useBreakpoints } from 'vooks';
import { computedAsync, logicNot, logicOr } from '@vueuse/core';

import CodeAndTree from './CodeAndTree.vue';
import DialogWithIconButton from './DialogWithIconButton.vue';
import ProblemStatement from './ProblemStatement.vue';

import { correctPuzzleNumber, beginTimestamp, puzzleInterval } from '../../config';
import { fetchStatement, fetchTargetCode } from '../utils/getPuzzle';
import { parse } from '../parse';

const id = ref(correctPuzzleNumber - 1);
const loading = ref(true);
const error = ref('');
const statement = ref('');
const targetCode = ref('');
const tab = ref('statement');

const time = computed(() => beginTimestamp + puzzleInterval * id.value);

const fetched = new Set<number>();
function addPrefetch(prefetchId: number) {
  if (prefetchId <= 0 || prefetchId >= correctPuzzleNumber) return;
  if (fetched.has(prefetchId)) return;
  fetched.add(prefetchId);
  const statementEl = document.createElement('link');
  const codeEl = document.createElement('link');
  statementEl.rel = 'prefetch';
  codeEl.rel = 'prefetch';
  statementEl.href = `/statement/${prefetchId}.html`;
  codeEl.href = `/targetCode/${prefetchId}.txt`;
  document.head.appendChild(statementEl);
  document.head.appendChild(codeEl);
}

async function loadPuzzle() {
  loading.value = true;
  error.value = '';
  try {
    [
      statement.value,
      targetCode.value,
    ] = await Promise.all([
      fetchStatement(id.value),
      fetchTargetCode(id.value),
    ]);
    fetched.add(id.value);
  } catch (e) {
    if (e instanceof Error) error.value = e.toString();
    else error.value = 'Unknown Error';
  } finally {
    loading.value = false;
    addPrefetch(id.value - 1);
    addPrefetch(id.value + 1);
  }
}

onMounted(() => {
  addPrefetch(id.value);
  addPrefetch(1);
});
watch(id, loadPuzzle);

const breakpoints = useBreakpoints();
const timeType = computed(() => (breakpoints.value.includes('m') ? 'datetime' : 'date'));
const codeAndTreeHeight = computed(() => `calc(${breakpoints.value.includes('m') ? '50vh' : '25vh'} - 3px)`);

const ok = logicNot(logicOr(loading, error));

const treeRoot = computedAsync(async () => {
  if (!ok.value) return null;
  const tree = await parse(targetCode.value);
  return tree.rootNode;
}, null);
</script>

<style scoped>
.fixed-height {
  height: 50vh;
}
</style>
