<!-- eslint-disable vue/singleline-html-element-content-newline -->

<template>
  <dialog-with-icon-button
    title="Game Rule"
    :default-show="showGameRule"
    dialog-style="max-width: calc(min(90vw, 700px));"
    @close="showGameRule = false"
  >
    <template #icon>
      <help-circle />
    </template>
    <n-scrollbar style="max-height: 70vh;">
      <n-p>
        Welcome to Codle!
      </n-p>
      <n-p>
        This game is based on the idea of another famous game
        <n-a href="https://www.nytimes.com/games/wordle/index.html">Wordle</n-a>,
        so the rule will be easier to understand if you are already familiar with Wordle.
        This game would also require some basic knowledge of
        <n-a href="https://en.wikipedia.org/wiki/Abstract_syntax_tree">Abstract Syntax Tree (AST)</n-a>
        which is the basic building block of this game.
      </n-p>
      <n-p>
        In this game, you need to guess the AST of the <strong>target code</strong>
        which is written in C++.
        You only need to guess the <strong>type</strong> of each node in the AST,
        so the actual content of the code does <strong>not</strong> matter.
        In each guess, you need to provide a piece of code,
        and you'll get the difference between your code's AST and the target code's AST as a hint.
      </n-p>
      <n-p>
        The hint will be in a format similar to Wordle's hint:
        <n-ul>
          <n-li>Green node means both node type and position are correct.</n-li>
          <n-li>Yellow node means node type is correct but the position is incorrect.</n-li>
        </n-ul>
      </n-p>
      <n-p>
        Since AST is a tree, the "correct position" needs more explanation.
        In short, a node is neither green nor yellow if its parent is not green,
        otherwise, the "correct position" means the correct position within its siblings.
        Particularly, the root node is always green.
        When a green node has more than one misplaced type-correct child with the same type,
        and the number of such children is greater than the correct one,
        only the first correct number of such children will be yellow.
      </n-p>
      <n-p>
        So what is the <i>type</i> of an AST node?
        The answer is complicated, but you don't have to know it.
        Just enter some random codes in the
        <n-a href="https://tree-sitter.github.io/tree-sitter/playground">Syntax Tree Playground</n-a>
        (remember to set the language to C++ first)
        and you'll roughly know what node types look like.
        You may also use this Playground as an assistant when solving the puzzle.
        To help you identify each node,
        the range of the corresponding code snippet within your code is displayed beside each node,
        and you can click on a node to see the corresponding code.
      </n-p>
      <n-p>
        In order to provide more information to you,
        you'll also get the number of children of each green node.
        When you have found a whole subtree,
        there will be a "✅" or "☑️"
        (depending on whether your code is the same as the target code in this subtree)
        displayed besides every node in this subtree,
        and you can click the node to view the target code of this subtree.
      </n-p>
      <n-p>
        Initial guesses need some clue, so in each puzzle,
        there will be an associated algorithm (coding) problem.
        The target code is guaranteed to be a valid solution to the problem,
        but your code doesn't need to solve the problem — it even doesn't need to compile,
        as the only thing that matters is the AST.
        The problem will not be hard, since the goal is not to solve it.
      </n-p>
      <n-p>
        A piece of code is much more complicated than a single word,
        so Codle is designed to be a weekly game instead of a daily game.
        That's to say, there will be only one puzzle each week,
        which will get refreshed at UTC 0:00 every Sunday.
      </n-p>
      <n-p>
        You may not have fully understood the rules yet, but you can start playing now.
        If you want to check the rules any time later,
        just click the question mark in the top-right corner.
      </n-p>
      <n-p>
        Have fun solving the puzzle!
      </n-p>
    </n-scrollbar>
  </dialog-with-icon-button>
</template>

<script setup lang="ts">
import {
  NA,
  NLi,
  NUl,
  NP,
  NScrollbar,
} from 'naive-ui';
import { HelpCircle } from '@vicons/ionicons5';

import DialogWithIconButton from './DialogWithIconButton.vue';

import { showGameRule } from '../store/useLocalStorage';
</script>
