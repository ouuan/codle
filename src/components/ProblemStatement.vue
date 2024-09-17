<!-- eslint-disable vue/no-v-text-v-html-on-component vue/no-v-html -->

<template>
  <n-element
    :class="['statement', theme]"
    v-html="statement"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NElement, useOsTheme } from 'naive-ui';
import { uiDark } from '../store/localStorage';

defineProps<{
  statement: string;
}>();

const osTheme = useOsTheme();
const theme = computed(() => (uiDark(osTheme) ? 'vue-diff-theme-custom-dark' : 'vue-diff-theme-custom-light'));
</script>

<style scoped lang="scss">
.statement:deep(a) {
  cursor: pointer;
  transition: color .3s var(--cubic-bezier-ease-in-out),
    text-decoration-color .3s var(--cubic-bezier-ease-in-out);
  text-decoration-color: var(--primary-color);
  color: var(--primary-color);
}
</style>
