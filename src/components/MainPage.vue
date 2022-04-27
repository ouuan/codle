<!-- eslint-disable vue/no-v-html -->

<template>
  <n-grid
    cols="12"
    responsive="screen"
    item-responsive
  >
    <n-gi span="1 l:2" />
    <n-gi span="10 l:8">
      <n-page-header
        class="page-header"
        title="Codle"
        subtitle="Wordle with AST nodes as letters"
      >
        <template #extra>
          <plausible-dialog />
          <feed-dialog />
          <about-dialog />
          <game-rule-dialog />
          <statistics-dialog />
          <puzzle-history />
          <settings-dialog />
        </template>
      </n-page-header>
      <n-space
        v-if="loadPhase === true"
        vertical
      >
        <n-card>
          <n-p>
            This week is puzzle #<strong>{{ correctPuzzleNumber }}</strong>.
            You have
            <n-countdown
              active
              :duration="remainingTime"
            />
            to solve it.
          </n-p>
          <n-space vertical>
            <n-form-item
              label-placement="left"
              label="Problem Statement"
              size="small"
              :show-feedback="false"
            >
              <n-switch v-model:value="showStatement" />
            </n-form-item>
            <n-collapse-transition :show="showStatement">
              <problem-statement :statement="statement" />
            </n-collapse-transition>
          </n-space>
        </n-card>
        <n-card v-if="!finished && !gaveUp">
          <template #header>
            Guess!
            <n-tooltip v-if="editorReadonly">
              <template #trigger>
                (readonly)
              </template>
              See the setting "Readonly editor after first guess"
            </n-tooltip>
          </template>
          <template #header-extra>
            Length (max: 2 * length of target code):&nbsp;
            <n-text
              :type="lengthHintType"
            >
              {{ code.length }}/{{ lengthLimit }}
            </n-text>
          </template>
          <code-editor
            ref="editor"
            v-model:code="code"
            height="40vh"
            :length-limit="lengthLimit"
            :read-only="editorReadonly"
          />
          <template #action>
            <n-space justify="space-between">
              <n-space>
                <n-button
                  type="success"
                  @click="submitGuess"
                >
                  Guess!
                </n-button>
                <diff-dialog
                  v-if="guesses.length"
                  :prev="guesses[guesses.length - 1]"
                  :current="code"
                />
              </n-space>
              <n-button
                v-if="guesses.length"
                type="warning"
                @click="giveUp"
              >
                Give Up 😢
              </n-button>
            </n-space>
          </template>
        </n-card>
        <finished-message v-if="finished" />
        <n-card
          v-if="gaveUp"
          title="You gave up 😢"
        >
          <n-p>The target code is:</n-p>
          <code-editor
            read-only
            :code="targetCode"
          />
          <user-survey type="Gave Up" />
        </n-card>
        <n-card
          v-if="guesses.length"
          title="History"
        >
          <guess-history
            :correct-root="correctRoot"
            @apply-target-code-and-modification="onApplyTargeCodeAndModification()"
          />
        </n-card>
        <node-type-list :correct-root="correctRoot" />
      </n-space>
      <n-space
        v-else
        justify="center"
        style="margin-top: 20vh;"
      >
        <n-spin size="large">
          <template #description>
            {{ loadPhase }}
          </template>
        </n-spin>
      </n-space>
    </n-gi>
    <n-gi span="1 l:2" />
  </n-grid>
</template>

<script setup lang="ts">
import {
  computed,
  h,
  onMounted,
  ref,
} from 'vue';
import {
  NButton,
  NCard,
  NCollapseTransition,
  NCountdown,
  NFormItem,
  NGi,
  NGrid,
  NP,
  NPageHeader,
  NSpace,
  NSpin,
  NSwitch,
  NText,
  NTooltip,
  useDialog,
  useMessage,
} from 'naive-ui';
import { SyntaxNode } from 'web-tree-sitter';
import { useBreakpoints } from 'vooks';

import AboutDialog from './AboutDialog.vue';
import ApplyModificationConfirmation from './ApplyModificationConfirmation.vue';
import CodeEditor from './CodeEditor.vue';
import DiffDialog from './DiffDialog.vue';
import FeedDialog from './FeedDialog.vue';
import FinishedMessage from './FinishedMessage.vue';
import GuessHistory from './GuessHistory.vue';
import GameRuleDialog from './GameRuleDialog.vue';
import NodeTypeList from './NodeTypeList.vue';
import PlausibleDialog from './PlausibleDialog.vue';
import ProblemStatement from './ProblemStatement.vue';
import PuzzleHistory from './PuzzleHistory.vue';
import UserSurvey from './UserSurvey.vue';
import StatisticsDialog from './StatisticsDialog.vue';
import SettingsDialog from './SettingsDialog.vue';

import {
  finished,
  firstGame,
  gaveUp,
  guesses,
  lastPlay,
  playCount,
  readonlyEditorAfterFirstGuess,
  showStatement,
  statement,
  targetCode,
  updatePuzzle,
} from '../store/localStorage';
import { correctPuzzleNumber } from '../../config';
import { applyTargeCodeAndModification } from '../store/rootTreeOption';
import { initParser, parse } from '../parse';
import {
  trackEvent,
  trackPageview,
} from '../plausible';

const code = ref(`#include <iostream>
#include <cstdio>

using namespace std;

int main()
{
    return 0;
}`);

const correctRoot = ref<SyntaxNode | null>(null);

const editor = ref();

const dialog = useDialog();
const message = useMessage();
const breakpoints = useBreakpoints();

const loadPhase = ref<true | string>('Loading page...');

const wasmSupported = (() => {
  try {
    if (typeof WebAssembly === 'object'
            && typeof WebAssembly.instantiate === 'function') {
      const module = new WebAssembly.Module(
        Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00),
      );
      if (module instanceof WebAssembly.Module) {
        return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
      }
    }
  } catch {
    return false;
  }
  return false;
})();

if (!wasmSupported) {
  dialog.error({
    title: 'WASM not supported',
    content: "Your browser doesn't support Web Assembly or its support is disabled. Please try using a different browser.",
  });
}

onMounted(async () => {
  try {
    trackPageview();
    loadPhase.value = 'Loading puzzle...';
    await updatePuzzle(dialog);
    if (targetCode.value === '') return;
    if (guesses.value.length) {
      code.value = guesses.value[guesses.value.length - 1];
    }
    loadPhase.value = 'Loading TreeSitter...';
    await initParser;
    loadPhase.value = 'Constructing AST...';
    const tree = await parse(targetCode.value);
    correctRoot.value = tree.rootNode;
    loadPhase.value = true;
    if (!breakpoints.value.includes('m')) {
      message.warning("It's recommended to play Codle on a larger screen.", {
        duration: 8000,
      });
    }
  } catch (e) {
    loadPhase.value = `Error occurred: ${e}`;
  }
});

const lengthLimit = computed(() => targetCode.value.length * 2);
const lengthHintType = computed(() => {
  if (code.value.length <= targetCode.value.length) return 'success';
  if (code.value.length >= lengthLimit.value) return 'error';
  return 'warning';
});

const editorReadonly = computed(() => guesses.value.length > 0
                                      && readonlyEditorAfterFirstGuess.value);

function submitGuess() {
  if (code.value.length > lengthLimit.value) {
    message.error('Code length limit exceeded');
    return;
  }
  const previousIndex = guesses.value.indexOf(code.value);
  if (previousIndex !== -1) {
    message.error(`Your code is exactly the same as guess #${previousIndex + 1}`);
    return;
  }
  if (lastPlay.value !== correctPuzzleNumber) {
    lastPlay.value = correctPuzzleNumber;
    playCount.value += 1;
  }
  if (firstGame.value === 0) {
    firstGame.value = correctPuzzleNumber;
  }
  guesses.value.push(code.value);
  if (guesses.value.length % 10 === 0) {
    trackEvent('Guess', {
      props: {
        // https://github.com/plausible/plausible-tracker/pull/27
        guessCount: guesses.value.length as any as string,
        puzzleId: correctPuzzleNumber as any as string,
      },
    });
  }
}

function onApplyTargeCodeAndModification() {
  const applied = applyTargeCodeAndModification();
  if (code.value === applied) {
    message.info('No change was made');
    return;
  }
  const safeToApply = editorReadonly.value
    || code.value === guesses.value[guesses.value.length - 1];
  dialog[safeToApply ? 'info' : 'warning']({
    title: 'Apply target code & modification',
    content: () => h(ApplyModificationConfirmation, {
      lastGuess: guesses.value[guesses.value.length - 1],
      current: code.value,
      applied,
      safeToApply,
    }),
    positiveText: safeToApply ? 'Apply' : 'Override',
    negativeText: 'Cancel',
    onPositiveClick() {
      code.value = applied;
    },
    style: {
      width: 'calc(min(80vw, 800px))',
    },
  });
}

function giveUp() {
  const guessCount = guesses.value.length;
  if (guessCount <= 5) {
    let times: string;
    if (guessCount === 1) times = 'once';
    else if (guessCount === 2) times = 'twice';
    else times = `${guessCount} times`;
    dialog.error({
      title: 'Too early to give up!',
      content: `You have guessed only ${times}! Don't give up unless you have tried enough times.`,
      negativeText: "I'll keep trying",
    });
  } else if (new Date().getUTCDay() !== 6) {
    dialog.error({
      title: 'Too early to give up!',
      content: 'You can give up only on UTC Saturday (i.e. the last 24 hours of a weekly puzzle). Come here tomorrow if you are tired today.',
      negativeText: "I'll keep trying",
    });
  } else {
    dialog.warning({
      title: 'Give Up?',
      content: "Don't you want to try once more?",
      positiveText: "I'm sure to give up",
      negativeText: "I'll keep trying",
      onPositiveClick() {
        gaveUp.value = true;
        trackEvent('Give Up', {
          props: {
            // https://github.com/plausible/plausible-tracker/pull/27
            guessCount: guesses.value.length as any as string,
            puzzleId: correctPuzzleNumber as any as string,
          },
        });
      },
    });
  }
}

const A_WEEK = 1000 * 60 * 60 * 24 * 7;
const remainingTime = computed(() => A_WEEK - ((new Date().valueOf() - new Date('2000-01-02T00:00:00Z').valueOf()) % A_WEEK));
</script>

<style scoped>
.page-header {
  margin-top: 12px;
  margin-bottom: 10px;
}
</style>
