<template>
  <n-button
    circle
    quaternary
    :title="title"
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
    :style="dialogStyle"
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

const props = withDefaults(defineProps<{
  title: string,
  defaultShow?: boolean,
  dialogStyle?: string,
}>(), {
  defaultShow: false,
  dialogStyle: 'max-width: calc(min(80vw, 500px));',
});

const showModal = ref(props.defaultShow);

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'open'): void,
}>();
watch(showModal, (show) => {
  if (show) emit('open');
  else emit('close');
});
</script>
