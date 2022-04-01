<template>
  <dialog-with-icon-button title="Settings">
    <template #icon>
      <settings-sharp />
    </template>
    <n-space vertical>
      <n-form
        label-placement="left"
        label-width="auto"
      >
        <n-form-item label="Dark Theme">
          <n-switch v-model:value="uiDark" />
        </n-form-item>
        <n-form-item label="Code Font Family">
          <n-input v-model:value="codeFontFamily" />
        </n-form-item>
      </n-form>
    </n-space>
  </dialog-with-icon-button>
</template>

<script setup lang="ts">
import {
  NForm,
  NFormItem,
  NInput,
  NSpace,
  NSwitch,
} from 'naive-ui';
import { SettingsSharp } from '@vicons/ionicons5';

import DialogWithIconButton from './DialogWithIconButton.vue';

import { uiDark, codeFontFamily } from '../store/useLocalStorage';
</script>
