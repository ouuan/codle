<template>
  <n-a
    :href="href"
    @click="onClick"
  >
    {{ title }}
  </n-a>
</template>

<script setup lang="ts">
import { NA } from 'naive-ui';

import { trackEvent } from '../plausible';

const props = defineProps<{
  href: string,
  title: string,
}>();

function onClick() {
  trackEvent('Outbound Link: Click', {
    props: {
      url: props.href,
      title: props.title,
    },
  });
}
</script>
