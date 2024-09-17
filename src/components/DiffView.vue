<template>
  <n-empty
    v-if="prev === current"
    description="No difference"
  />
  <n-scrollbar
    v-else
    class="diff-view-scrollbar"
  >
    <vue-diff
      language="cpp"
      :mode="diffMode"
      :prev="prev"
      :current="current"
      :theme="theme"
    />
  </n-scrollbar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  NEmpty,
  NScrollbar,
  useOsTheme,
} from 'naive-ui';
import { Diff as VueDiff } from 'vue-diff';
import { useBreakpoints } from 'vooks';

import { uiDark } from '../store/localStorage';

defineProps<{
  prev: string,
  current: string,
}>();

const osTheme = useOsTheme();
const theme = computed(() => (uiDark(osTheme) ? 'custom-dark' : 'custom-light'));

const breakPoints = useBreakpoints();
const diffMode = computed(() => (breakPoints.value.includes('m') ? 'split' : 'unified'));
</script>

<style>
.diff-view-scrollbar {
  max-height: 60vh;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
