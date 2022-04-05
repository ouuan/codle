<template>
  <dialog-with-icon-button title="Feed">
    <template #icon>
      <logo-rss />
    </template>
    <n-p>
      Use RSS/Atom feed to get notified on new puzzles!
    </n-p>
    <n-ul>
      <n-li>
        <n-a
          href="index.xml"
          type="application/rss+xml"
        >
          RSS 2.0
        </n-a>
      </n-li>
      <n-li>
        <n-a
          href="atom.xml"
          type="application/atom+xml"
        >
          Atom
        </n-a>
      </n-li>
    </n-ul>
  </dialog-with-icon-button>
</template>

<script setup lang="ts">
import {
  NA, NLi, NP, NUl,
} from 'naive-ui';
import { LogoRss } from '@vicons/ionicons5';

import DialogWithIconButton from './DialogWithIconButton.vue';
</script>
