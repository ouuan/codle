<!-- eslint-disable vue/singleline-html-element-content-newline -->

<template>
  <n-alert
    v-if="plausibleTracked && !surveySubmitted"
    type="info"
    title="User Survey"
  >
    <n-p>This survey will be used to improve players' experience.</n-p>
    <n-p>Feel free to ignore the whole survey or leave any part of it empty.</n-p>
    <n-button
      secondary
      type="info"
      @click="showModal = true"
    >
      Take Survey
    </n-button>
    <n-modal
      v-model:show="showModal"
      title="User Survey"
      preset="card"
      show-directive="show"
      :auto-focus="false"
      :trap-focus="false"
      style="max-width: calc(min(80vw, 500px));"
    >
      <n-form>
        <n-form-item label="How difficult is this week's puzzle?">
          <n-slider
            v-model:value="difficulty"
            :format-tooltip="difficultyTooltip"
            :min="1"
            :max="5"
            :marks="{1: 'Easy', 5: 'Hard'}"
          />
        </n-form-item>
        <n-form-item label="Time Used (minutes, approximately)">
          <n-input-number
            v-model:value="timeUsed"
            :min="1"
            :max="10000"
            :step="15"
          />
        </n-form-item>
        <n-form-item label="Overall Experience">
          <n-rate v-model:value="rating" />
        </n-form-item>
        <n-form-item label="Suggestion / Comments">
          <template
            v-if="feedback.length > 30"
            #feedback
          >
            Please consider opening a
            <n-a href="https://github.com/ouuan/codle/discussions">Discussion</n-a>
            on GitHub
          </template>
          <n-input v-model:value="feedback" />
        </n-form-item>
        <n-form-item>
          <n-button
            type="success"
            @click="submit"
          >
            Submit
          </n-button>
        </n-form-item>
      </n-form>
    </n-modal>
  </n-alert>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  NA,
  NAlert,
  NButton,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NModal,
  NP,
  NRate,
  NSlider,
  useMessage,
} from 'naive-ui';

import {
  puzzleNumber,
  guesses,
  surveySubmitted,
} from '../store/useLocalStorage';
import { plausibleTracked, trackEvent } from '../plausible';

const props = defineProps<{ type: string }>();

const showModal = ref(false);

const difficulty = ref(3);
const timeUsed = ref(60);
const rating = ref(0);
const feedback = ref('');

function difficultyTooltip(value: number) {
  switch (value) {
    case 1:
      return 'Too easy';
    case 2:
      return 'Easy';
    case 3:
      return 'Fine';
    case 4:
      return 'Hard';
    case 5:
      return 'Too hard';
    default:
      return '';
  }
}

const message = useMessage();

function submit() {
  trackEvent(`Survey: ${props.type}`, {
    props: {
      // https://github.com/plausible/plausible-tracker/pull/27
      difficulty: difficulty.value as any as string,
      timeUsed: timeUsed.value as any as string,
      ...(rating.value === 0 ? {} : { rating: rating.value as any as string }),
      ...(feedback.value ? { feedback: feedback.value } : {}),
      puzzleId: puzzleNumber.value as any as string,
      guessCount: guesses.value.length as any as string,
    },
  });
  surveySubmitted.value = true;
  message.success('Survey submitted~');
}
</script>
