<template>
  <dialog-with-icon-button title="About">
    <template #icon>
      <information-circle />
    </template>
    <n-p>
      Codle is a game developed by
      <external-link
        href="https://github.com/ouuan"
        title="ouuan"
      />.
      In this game, you need to guess the Abstract Syntax Tree (AST)
      of a piece of code called "target code".
      It's like
      <external-link
        href="https://www.nytimes.com/games/wordle/index.html"
        title="Wordle"
      />
      with AST nodes as "letters".
    </n-p>
    <n-p>
      It's open-sourced at
      <external-link
        href="https://github.com/ouuan/codle"
        title="GitHub"
      />
      under the
      <external-link
        href="/LICENSE"
        title="AGPL-3.0"
      />
      license. It makes use of
      <external-link
        href="https://tree-sitter.github.io/tree-sitter/"
        title="Tree-sitter"
      />,
      <external-link
        href="https://v3.vuejs.org/"
        title="Vue 3"
      />,
      <external-link
        href="https://www.naiveui.com/"
        title="Naive UI"
      />,
      <external-link
        href="https://codemirror.net/"
        title="CodeMirror"
      />
      and many other dependencies which can be found in the source code.
    </n-p>
    <n-p>
      Thanks should also go to people who examined the original idea and
      provided valuable suggestions at the early stage of this game.
    </n-p>
    <n-p>
      If you have any suggestions, please open an
      <external-link
        href="https://github.com/ouuan/codle/issues"
        title="issue"
      />
      on GitHub.
    </n-p>
    <n-p>
      If you enjoy this game, consider
      <external-link
        href="https://ouuan.github.io/about/#donate"
        title="buy me a cup of coffee :)"
      />
      (currently only accepting WeChat and AliPay)
    </n-p>
    <n-p>
      Further information can be found at
      <external-link
        href="/humans.txt"
        title="humans.txt"
      />.
    </n-p>
  </dialog-with-icon-button>
</template>

<script setup lang="ts">
import { NP } from 'naive-ui';
import { InformationCircle } from '@vicons/ionicons5';

import DialogWithIconButton from './DialogWithIconButton.vue';
import ExternalLink from './ExternalLink.vue';
</script>
