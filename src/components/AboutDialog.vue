<template>
  <dialog-with-icon-button title="About">
    <template #icon>
      <information-circle />
    </template>
    <n-scrollbar style="max-height: 70vh;">
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
      <n-h4>
        FAQ
      </n-h4>
      <n-p>
        Tips: You can ask more questions at
        <external-link
          href="https://github.com/ouuan/codle/discussions"
          title="GitHub Discussions"
        />.
      </n-p>
      <n-ul>
        <n-li>
          <strong>Why not make daily puzzles?</strong>
          <p>
            To give you more time to solve the puzzles :)
            <br>
            Well, I have to admit that's not the main reason.
            Unlike Wordle and many other puzzle games, Codle's puzzles cannot be auto-generated.
            I need to manually select a coding problem that suits Codle well,
            write a solution that is fun to guess and provides enough hints via variable names, etc,
            and rewrite the problem statement in Markdown.
            It takes at least a half and sometimes a few hours
            if puzzle quality is taken into count.
          </p>
        </n-li>
        <n-li>
          <strong>Can I play previous puzzles?</strong>
          <p>
            On the official game site, unfortunately, no you can't :(
            <br>
            However, you can click the calendar icon on the top to see all previous puzzles.
            Codle is
            <external-link
              href="https://github.com/ouuan/codle"
              title="open-source"
            />,
            so you can run Codle locally and play previous puzzles or custom puzzles.
          </p>
        </n-li>
        <n-li>
          <strong>How many people play Codle?</strong>
          <p>
            Take the week of 8 May - 14 May 2022 as an example,
            there were 111 visitors and 10 game successes.
            So please share (your scores) with others if you like this game :)
          </p>
        </n-li>
        <n-li>
          <strong>What are other players' scores?</strong>
          <p>
            In the first 6 weeks, according to the anonymously collected guess count data,
            the average number of guesses is 47.8 and the median is 34.5.
          </p>
        </n-li>
        <n-li>
          <strong>I succeeded without a correct solution to the problem!</strong>
          <p>
            That's how Codle works :)
            <br>
            AST is the only thing that matters, and your code doesn't even need to compile.
          </p>
        </n-li>
      </n-ul>
    </n-scrollbar>
  </dialog-with-icon-button>
</template>

<script setup lang="ts">
import {
  NH4,
  NLi,
  NP,
  NScrollbar,
  NUl,
} from 'naive-ui';
import { InformationCircle } from '@vicons/ionicons5';

import DialogWithIconButton from './DialogWithIconButton.vue';
import ExternalLink from './ExternalLink.vue';
</script>
