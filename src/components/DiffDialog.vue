<template>
  <n-button
    type="info"
    @click="showModal = true"
  >
    Diff
  </n-button>
  <n-modal
    v-model:show="showModal"
    preset="card"
    title="Diff against last guess"
    style="max-width: calc(min(90vw, 960px));"
  >
    <diff-view
      :prev="prev"
      :current="current"
    />
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  NButton,
  NModal,
} from 'naive-ui';

import DiffView from './DiffView.vue';

defineProps<{
  prev: string,
  current: string,
}>();

const showModal = ref(false);
</script>
