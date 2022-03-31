<!-- eslint-disable vue/singleline-html-element-content-newline -->

<template>
  <dialog-with-icon-button title="About">
    <template #icon>
      <information-circle />
    </template>
    <n-p>
      Codle is a game developed by
      <n-a href="https://github.com/ouuan">ouuan</n-a>.
      In this game, you need to guess the Abstract Syntax Tree (AST)
      of a piece of code called "target code".
      It's like
      <n-a href="https://www.nytimes.com/games/wordle/index.html">Wordle</n-a>
      with AST nodes as "letters".
    </n-p>
    <n-p>
      It's open-sourced at
      <n-a href="https://github.com/ouuan/codle">GitHub</n-a>
      under the
      <n-a href="/LICENSE">AGPL-3.0</n-a>
      license. It makes use of
      <n-a href="https://tree-sitter.github.io/tree-sitter/">Tree-sitter</n-a>,
      <n-a href="https://v3.vuejs.org/">Vue 3</n-a>,
      <n-a href="https://www.naiveui.com/">Naive UI</n-a>,
      <n-a href="https://codemirror.net/">CodeMirror</n-a>
      and many other dependencies which can be found in the source code.
    </n-p>
    <n-p>
      Thanks should also go to people who examined the original idea and
      provided valuable suggestions at the early stage of this game.
    </n-p>
    <n-p>
      If you enjoy this game, consider
      <n-a href="https://ouuan.github.io/about/#donate">buy me a cup of coffee :)</n-a>
      (currently only accepting WeChat and AliPay)
    </n-p>
  </dialog-with-icon-button>
</template>

<script setup lang="ts">
import { NA, NP } from 'naive-ui';
import { InformationCircle } from '@vicons/ionicons5';

import DialogWithIconButton from './DialogWithIconButton.vue';
</script>
