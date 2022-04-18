<template>
  <n-card :bordered="false">
    <n-p v-if="safeToApply">
      Apply the following modifications?
    </n-p>
    <n-p v-else>
      Override modifications made in the code editor with target code and subtree modifications?
    </n-p>
    <n-form-item
      label-placement="left"
      label="Diff between"
    >
      <n-select
        v-model:value="diffMode"
        :options="diffOptions"
      />
    </n-form-item>
    <diff-view
      :prev="diffPrev[diffMode]"
      :current="diffCurrent[diffMode]"
    />
  </n-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  NCard,
  NFormItem,
  NP,
  NSelect,
} from 'naive-ui';
import DiffView from './DiffView.vue';

const props = defineProps<{
  lastGuess: string,
  current: string,
  applied: string,
  safeToApply: boolean,
}>();

const diffPrev = {
  'current-applied': props.current,
  'last-current': props.lastGuess,
  'last-applied': props.lastGuess,
} as const;

const diffCurrent = {
  'current-applied': props.applied,
  'last-current': props.current,
  'last-applied': props.applied,
} as const;

const diffMode = ref('current-applied');

const diffOptions = [
  {
    label: 'Current code & Incoming modifications',
    value: 'current-applied',
  },
  {
    label: 'Last guess & Current code',
    value: 'last-current',
  },
  {
    label: 'Last guess & Incoming modifications',
    value: 'last-applied',
  },
];
</script>
