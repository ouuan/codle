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
        <external-link
          href="/index.xml"
          title="RSS"
        />
      </n-li>
      <n-li>
        <external-link
          href="/atom.xml"
          title="Atom"
        />
      </n-li>
    </n-ul>
  </dialog-with-icon-button>
</template>

<script setup lang="ts">
import { NLi, NP, NUl } from 'naive-ui';
import { LogoRss } from '@vicons/ionicons5';

import DialogWithIconButton from './DialogWithIconButton.vue';
import ExternalLink from './ExternalLink.vue';
</script>
