<template>
  <dialog-with-icon-button
    title="Game Rule"
    :default-show="showGameRule"
    dialog-style="max-width: calc(min(90vw, 750px));"
    @close="showGameRule = false"
  >
    <template #icon>
      <help-circle />
    </template>
    <n-scrollbar style="max-height: 80vh;">
      <n-p>
        Welcome to Codle!
      </n-p>
      <n-p>
        This game is based on the idea of another famous game
        <external-link
          href="https://www.nytimes.com/games/wordle/index.html"
          title="Wordle"
        />,
        so the rule will be easier to understand if you are already familiar with Wordle.
        This game would also require some basic knowledge about the C++ programming language and its
        <external-link
          href="https://en.wikipedia.org/wiki/Abstract_syntax_tree"
          title="Abstract Syntax Tree (AST)"
        />,
        but you don't need to master them very well.
      </n-p>
      <n-p>
        In this game,
        you need to guess the AST of a piece of C++ code called the <i>target code</i>.
        You only need to find out the <i>type</i> of each node in the AST,
        so the actual content of the code does <strong>not</strong> matter.
        In each guess, you need to provide a piece of code,
        and you'll get the difference between your code's AST and the target code's AST as a hint.
      </n-p>
      <n-p>
        The hint will be in a format similar to Wordle's hint:
        <n-ul>
          <n-li>
            <n-text type="success">
              Green node
            </n-text>
            means both node type and position are correct.
          </n-li>
          <n-li>
            <n-text type="warning">
              Yellow node
            </n-text>
            means node type is correct but the position is incorrect.
          </n-li>
        </n-ul>
      </n-p>
      <syntax-tree-demo
        target="int a, b = 0;"
        guess="int x = 0, y = 0, z, w;"
      />
      <n-p>
        Since AST is a tree, the "correct position" needs more explanation.
        In short, a necessary condition for a node to be
        <n-text
          v-for="(c, index) of 'colored'"
          :key="index"
          :type="index % 2 ? 'warning' : 'success'"
        >
          {{ c }}
        </n-text>
        is to have a
        <n-text type="success">
          green parent
        </n-text>,
        except the root, which is always
        <n-text type="success">
          green
        </n-text>.
        When this condition is satisfied,
        "correct position" means the correct index within its siblings.
        When a
        <n-text type="success">
          green node
        </n-text>
        has more than one misplaced child with the same type,
        only the first few of them will be
        <n-text type="warning">
          yellow
        </n-text>,
        so that the number of
        <n-text
          v-for="(c, index) of 'colored'"
          :key="index"
          :type="index % 2 ? 'warning' : 'success'"
        >
          {{ c }}
        </n-text>
        children of a certain type doesn't exceed
        the correct number of children of that type.
      </n-p>
      <n-p>
        In order to provide more information to you,
        you'll get the number of children
        (e.g.
        <n-text type="success">
          (1/1)
        </n-text>,
        <n-text type="warning">
          (5/3)
        </n-text>)
        of each
        <n-text type="success">
          green node
        </n-text>.
        When you have found a whole subtree,
        there will be a "✅" or "☑️",
        depending on whether your code is exactly the same as the target code in this subtree,
        displayed beside every node in this subtree,
        and you can click a "☑️" node to view the corresponding target code.
        In order to narrow down your options of node types, a list of all node types appeared
        at least once in the target code and the number of occurrences of each type will be given.
        However, only one type will be revealed after every single guess, by design.
      </n-p>
      <n-p>
        So what is the <i>type</i> of an AST node?
        The answer is complicated, but you don't have to know every single node type.
        Just try a few guesses and you'll roughly know what they look like.
        You can hover on (in the real game, not in the demo above)
        or click a node to view the corresponding code.
        What's more, you can click on a
        <grammar-rule-dialog
          name="translation_unit"
          :symbols="['translation_unit']"
          type="info"
        >
          node
        </grammar-rule-dialog>
        , either in the node type list or in the AST,
        to see the grammar structure of the corresponding node type.
        In the grammar structure,
        <n-text type="success">
          green nodes
        </n-text>
        are node types displayed in the AST,
        <n-text type="warning">
          yellow nodes
        </n-text>
        are "node types" that are not displayed in the AST.
        Strings are shown as
        <n-text code>
          "string"
        </n-text>
        or
        <n-text code>
          'string'
        </n-text>,
        and regex patterns are shown as
        <n-text code>
          /pattern/
        </n-text>.
        You may also utilize the
        <external-link
          href="https://tree-sitter.github.io/tree-sitter/playground"
          title="Tree-sitter Playground"
        />
        which can show you the AST of a piece of code.
      </n-p>
      <n-p>
        It could be troublesome to focus on editing a subtree of your code in the main code editor.
        To make it easier, you can click an incorrect node to modify the code within that subtree.
        When editing is done, you can click the "Apply target code &amp; modification" button,
        and then all your modifications plus the target codes of "☑️" nodes will be applied.
        Please note that modifications in parent nodes will override modifications in the children,
        and applying subtree modifications will override modifications in the main code editor.
      </n-p>
      <n-p>
        Initial guesses need some clue, so in each puzzle,
        there will be an associated algorithm or coding problem.
        The target code is guaranteed to be a valid solution to the problem,
        but your code doesn't need to solve the problem — it even doesn't need to compile,
        as the only thing that matters is the AST.
        The problem won't be hard, since the goal is not to solve it.
      </n-p>
      <n-p>
        A piece of code is much more complicated than a single word,
        so Codle is designed to be a weekly game instead of a daily game.
        That's to say, there will be only one puzzle each week,
        which will get refreshed at <strong>UTC 0:00</strong> every <strong>Sunday</strong>.
        Remember to come back and solve new puzzles!
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
  NLi,
  NUl,
  NP,
  NScrollbar,
  NText,
} from 'naive-ui';
import { HelpCircle } from '@vicons/ionicons5';

import DialogWithIconButton from './DialogWithIconButton.vue';
import ExternalLink from './ExternalLink.vue';
import GrammarRuleDialog from '../grammar/GrammarRuleDialog.vue';
import SyntaxTreeDemo from './SyntaxTreeDemo.vue';

import { showGameRule } from '../store/localStorage';
</script>
