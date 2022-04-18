<template>
  <dialog-with-icon-button title="Plausible Analytics">
    <template #icon>
      <analytics-icon />
    </template>
    <n-p>
      Codle uses a self-hosted
      <external-link
        href="https://plausible.io"
        title="Plausible Analytics"
      />
      instance to track page views and game success / give up / guess count information
      <strong>without</strong>
      any personal data.
    </n-p>
    <n-p>
      Plausible Analytics is
      <external-link
        href="https://plausible.io/privacy-focused-web-analytics"
        title="privacy-focused"
      />
      and compliant with privacy regulations such as GDPR.
    </n-p>
    <n-p>
      The data collected can help us improve players' experience.
      For example, we may adjust the puzzle difficulty
      according to the finish rate and the number of guesses.
    </n-p>
    <n-p>
      We will not and
      <strong>cannot</strong>
      sell your data to any third parties as your personal data is <strong>not</strong> collected.
    </n-p>
    <n-p>
      However, you can still opt out of the tracking here:
      <n-switch v-model:value="plausibleTracked">
        <template #checked>
          You are now tracked
        </template>
        <template #unchecked>
          You are now untracked
        </template>
      </n-switch>
    </n-p>
  </dialog-with-icon-button>
</template>

<script setup lang="ts">
import { NP, NSwitch } from 'naive-ui';
import { Analytics as AnalyticsIcon } from '@vicons/ionicons5';

import DialogWithIconButton from './DialogWithIconButton.vue';
import ExternalLink from './ExternalLink.vue';

import { plausibleTracked } from '../plausible';
</script>
