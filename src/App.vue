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
