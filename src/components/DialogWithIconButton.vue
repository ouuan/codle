<template>
  <n-button
    circle
    quaternary
    @click="showModal = true"
  >
    <template #icon>
      <n-icon>
        <slot name="icon" />
      </n-icon>
    </template>
  </n-button>
  <n-modal
    v-model:show="showModal"
    preset="card"
    :trap-focus="false"
    :title="title"
    :style="dialogStyle ?? 'max-width: calc(min(80vw, 500px));'"
  >
    <slot />
  </n-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  NButton,
  NIcon,
  NModal,
} from 'naive-ui';

const props = defineProps<{
  title: string,
  defaultShow?: boolean,
  dialogStyle?: string,
}>();

const showModal = ref(props.defaultShow ?? false);

const emit = defineEmits<{ (e: 'close'): void }>();
watch(showModal, (show) => {
  if (!show) emit('close');
});
</script>
