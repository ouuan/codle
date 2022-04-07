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
          <n-select
            v-model:value="uiTheme"
            :options="themeOptions"
          />
        </n-form-item>
        <n-form-item label="Code Font Family">
          <n-input
            v-model:value="codeFontFamily"
            placeholder="monospace"
          />
        </n-form-item>
        <n-form-item label="Code Line Wrap">
          <n-switch v-model:value="codeLineWrap" />
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
  NSelect,
  NSpace,
  NSwitch,
} from 'naive-ui';
import { SettingsSharp } from '@vicons/ionicons5';

import DialogWithIconButton from './DialogWithIconButton.vue';

import { uiTheme, codeFontFamily, codeLineWrap } from '../store/localStorage';

const themeOptions = [
  {
    label: 'Follow Browser',
    value: 'auto',
  },
  {
    label: 'Dark Theme',
    value: 'dark',
  },
  {
    label: 'Light Theme',
    value: 'light',
  },
];
</script>
