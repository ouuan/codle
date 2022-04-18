<template>
  <n-empty
    v-if="prev === current"
    description="No difference"
  />
  <n-scrollbar
    v-else
    class="diff-view-scrollbar"
  >
    <vue-diff
      language="cpp"
      :mode="diffMode"
      :prev="prev"
      :current="current"
      :theme="theme"
    />
  </n-scrollbar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  NEmpty,
  NScrollbar,
  useOsTheme,
} from 'naive-ui';
import { useBreakpoints } from 'vooks';

import { uiDark } from '../store/localStorage';

defineProps<{
  prev: string,
  current: string,
}>();

const osTheme = useOsTheme();
const theme = computed(() => (uiDark(osTheme) ? 'dark-custom' : 'light-custom'));

const breakPoints = useBreakpoints();
const diffMode = computed(() => (breakPoints.value.includes('m') ? 'split' : 'unified'));
</script>

<style>
.diff-view-scrollbar {
  max-height: 60vh;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>

<style scoped lang="scss">
.vue-diff-theme-dark-custom:deep() {
  background: #282828;
  color: #ebdbb2;

  .hljs-attr,
  .hljs-attribute {
    color: #8ec07c;
  }

  .hljs-comment {
    color: #928374;
  }

  .hljs-tag {
    color: #fe8019;
  }

  .hljs-punctuation {
    color: #bdae93;
  }

  .hljs-keyword,
  .hljs-doctag,
  .hljs-name {
    color: #f84934;
  }

  .hljs-type {
    color: #fabd2f;
  }

  .hljs-string,
  .hljs-quote {
    color: #b8bb26;
  }

  .hljs-number,
  .hljs-literal {
    color: #d3869b;
  }

  .hljs-meta {
    color: #83a598;
    span {
      color: #83a598;
    }
  }
}

.vue-diff-theme-light-custom:deep() {
  background: white;
  color: black;

  .hljs-attr,
  .hljs-attribute {
    color: #00c;
  }

  .hljs-title {
    color: #00f;
  }

  .hljs-comment {
    color: #a50;
  }

  .hljs-tag {
    color: #170;
  }

  .hljs-keyword,
  .hljs-doctag,
  .hljs-name {
    color: #708;
  }

  .hljs-type {
    color: #085;
  }

  .hljs-string {
    color: #a11;
  }

  .hljs-quote {
    color: #090;
  }

  .hljs-number {
    color: #164;
  }

  .hljs-literal {
    color: #219;
  }

  .hljs-meta {
    color: #555;
    span {
      color: #555;
    }
  }
}
</style>
