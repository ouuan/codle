<!-- eslint-disable vue/no-v-html -->

<template>
  <n-element
    class="statement"
    v-html="statement"
  />
</template>

<script setup lang="ts">
import { NElement } from 'naive-ui';

defineProps<{
  statement: string;
}>();
</script>

<style scoped>
.statement:deep(a) {
  cursor: pointer;
  transition: color .3s var(--cubic-bezier-ease-in-out),
    text-decoration-color .3s var(--cubic-bezier-ease-in-out);
  text-decoration-color: var(--primary-color);
  color: var(--primary-color);
}
</style>
