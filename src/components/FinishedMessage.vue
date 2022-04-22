<template>
  <n-card>
    <n-space vertical>
      <n-alert
        type="success"
        :title="`You found it in ${finishedAt}!`"
      >
        <n-p>
          Congratulations!
          <n-text
            type="success"
            class="share-button"
            @click="share"
          >
            Share
          </n-text>
          and play again next week~
        </n-p>
      </n-alert>
      <n-alert
        v-if="copyFailed"
        type="warning"
      >
        <n-p>Copy failed 😢 But you can manually copy the message here:</n-p>
        <n-p>{{ shareStr }}</n-p>
      </n-alert>
      <user-survey type="Success" />
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  NAlert,
  NCard,
  NP,
  NSpace,
  NText,
  useMessage,
} from 'naive-ui';

import UserSurvey from './UserSurvey.vue';

import { depthFinishedAt } from '../store/localStorage';
import { correctPuzzleNumber, host } from '../../config';

const finishedAt = computed(() => depthFinishedAt.value[depthFinishedAt.value.length - 1]);

const copyFailed = ref(false);

const shareStr = computed(() => `I solved #Codle #${correctPuzzleNumber} in ${finishedAt.value} guesses. I found all nodes within the depth of 1~${depthFinishedAt.value.length - 1} at guess ${depthFinishedAt.value.slice(1).join(', ')} respectively.
https://${host}`);

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
