<template>
  <dialog-with-icon-button title="Statistics">
    <template #icon>
      <stats-chart />
    </template>
    <n-grid
      cols="2 s:3"
      responsive="screen"
    >
      <n-gi>
        <n-statistic
          label="First Game"
          :value="firstGame"
        >
          <template #prefix>
            #
          </template>
        </n-statistic>
      </n-gi>
      <n-gi>
        <n-statistic
          label="Games Played"
          :value="playCount"
        />
      </n-gi>
      <n-gi>
        <n-statistic
          label="Win Rate"
          :value="winRate"
        >
          <template #suffix>
            %
          </template>
        </n-statistic>
      </n-gi>
      <n-gi>
        <n-statistic
          label="Current Streak"
          :value="currentStreak"
        />
      </n-gi>
      <n-gi>
        <n-statistic
          label="Max Streak"
          :value="maxStreak"
        />
      </n-gi>
      <n-gi>
        <n-statistic
          label="Average Guess"
          :value="avgGuess"
        />
      </n-gi>
    </n-grid>
  </dialog-with-icon-button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  NGi,
  NGrid,
  NStatistic,
} from 'naive-ui';
import { StatsChart } from '@vicons/ionicons5';

import DialogWithIconButton from './DialogWithIconButton.vue';

import {
  firstGame,
  playCount,
  currentStreak,
  maxStreak,
  successCount,
  guessSum,
} from '../store/localStorage';

const winRate = computed(() => {
  if (playCount.value === 0) return 0;
  return Math.round((successCount.value / playCount.value) * 100);
});

const avgGuess = computed(() => {
  if (successCount.value === 0) return 0;
  return Math.round(guessSum.value / successCount.value);
});
</script>
