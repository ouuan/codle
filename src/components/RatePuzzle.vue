<!-- eslint-disable vue/singleline-html-element-content-newline -->

<template>
  <template v-if="plausibleTracked">
    <n-form-item
      label-placement="left"
      label="Rate this puzzle:"
      :show-feedback="false"
    >
      <n-rate
        v-model:value="puzzleRating"
        :readonly="readOnly"
      />
    </n-form-item>
    <n-p v-if="puzzleRating > 0 && puzzleRating <= 3">
      Any suggestions? Please open a
      <n-a href="https://github.com/ouuan/codle/discussions">Discussion</n-a>
      to share your idea with us.
    </n-p>
  </template>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import {
  NA,
  NFormItem,
  NP,
  NRate,
} from 'naive-ui';

import { trackEvent, plausibleTracked } from '../plausible';
import { guesses, puzzleNumber, puzzleRating } from '../store/useLocalStorage';

const props = defineProps<{
  type: string,
}>();

const readOnly = computed(() => puzzleRating.value > 0);

watch(puzzleRating, (rating: number) => {
  trackEvent(`Rate: ${props.type}`, {
    props: {
      // https://github.com/plausible/plausible-tracker/pull/27
      guessCount: guesses.value.length as any as string,
      puzzleId: puzzleNumber.value as any as string,
      rating: rating as any as string,
    },
  });
});
</script>
