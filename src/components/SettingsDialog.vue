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
        <n-form-item label="Readonly editor after first guess">
          <n-tooltip placement="top-start">
            <template #trigger>
              <n-switch v-model:value="readonlyEditorAfterFirstGuess" />
            </template>
            Make the main code editor readonly after the first guess.
            In this way, you can force yourself to use the subtree modification function,
            and avoid messing up with these two somehow conflicting editing methods.
          </n-tooltip>
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
  NTooltip,
} from 'naive-ui';
import { SettingsSharp } from '@vicons/ionicons5';

import DialogWithIconButton from './DialogWithIconButton.vue';

import {
  codeFontFamily,
  codeLineWrap,
  readonlyEditorAfterFirstGuess,
  uiTheme,
} from '../store/localStorage';

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
