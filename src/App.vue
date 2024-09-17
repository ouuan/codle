<template>
  <n-config-provider :theme="theme">
    <n-global-style />
    <n-dialog-provider>
      <n-message-provider>
        <main-page />
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  NConfigProvider,
  NDialogProvider,
  NGlobalStyle,
  NMessageProvider,
  darkTheme,
  useOsTheme,
} from 'naive-ui';

import MainPage from './components/MainPage.vue';

import { uiDark } from './store/localStorage';

const osTheme = useOsTheme();
const theme = computed(() => (uiDark(osTheme) ? darkTheme : null));
</script>

<style lang="scss">
.vue-diff-theme-custom-dark pre {
  background: #282828;
  color: #ebdbb2;
  white-space: pre-wrap;

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

.vue-diff-theme-custom-light pre {
  background: white;
  color: black;
  white-space: pre-wrap;

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
