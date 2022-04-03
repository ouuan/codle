<template>
  <n-card>
    <n-alert
      type="success"
      :title="`You found it in ${finishedAt}!`"
    >
      Congratulations!
      <n-text
        type="success"
        class="share-button"
        @click="share"
      >
        Share
      </n-text>
      and play again next week~
    </n-alert>
    <n-alert
      v-if="copyFailed"
      type="warning"
    >
      Copy failed 😢 But you can manually copy the message here:
      <br>
      {{ shareStr }}
    </n-alert>
  </n-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  NAlert,
  NCard,
  NText,
  useMessage,
} from 'naive-ui';

import { puzzleNumber, depthFinishedAt } from '../store/useLocalStorage';

const finishedAt = computed(() => depthFinishedAt.value[depthFinishedAt.value.length - 1]);

const copyFailed = ref(false);

const shareStr = computed(() => `I solved #Codle #${puzzleNumber.value} in ${finishedAt.value} guesses. I found all nodes within the depth of 1~${depthFinishedAt.value.length - 1} at guess ${depthFinishedAt.value.slice(1).join(', ')} respectively.
https://codle.ouuan.moe`);

const message = useMessage();

function share() {
  navigator.clipboard.writeText(shareStr.value).then(() => {
    message.success('Copied to clipboard~');
  }).catch((err) => {
    message.error(`Failed to copy: ${err}`);
    copyFailed.value = true;
  });
}
</script>

<style scoped>
.share-button {
  cursor: pointer;
}
</style>
