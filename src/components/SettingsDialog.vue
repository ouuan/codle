<template>
  <dialog-with-icon-button title="Settings">
    <template #icon>
      <settings-sharp />
    </template>
    <n-space vertical>
      <n-form-item
        label-placement="left"
        label="Dark Theme"
      >
        <n-switch v-model:value="uiDark" />
      </n-form-item>
    </n-space>
  </dialog-with-icon-button>
</template>

<script setup lang="ts">
import {
  NFormItem,
  NSpace,
  NSwitch,
} from 'naive-ui';
import { SettingsSharp } from '@vicons/ionicons5';

import DialogWithIconButton from './DialogWithIconButton.vue';

import { uiDark } from '../store/useLocalStorage';
</script>
