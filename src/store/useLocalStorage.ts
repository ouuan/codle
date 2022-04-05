import {
  ref,
  watch,
  Ref,
  computed,
} from 'vue';
import axios from 'axios';
import { useDialog, useOsTheme } from 'naive-ui';
import DOMPurify from 'dompurify';
import { exhaustiveCheck } from 'ts-exhaustive-check';

const api = axios.create({
  headers: {
    Accept: 'text/plain',
  },
});

const KEY_PREFIX = 'codle_';

function getStored<T>(key: string, defaultValue: T, check: (value: any) => value is T): T {
  try {
    const stored = localStorage.getItem(KEY_PREFIX + key);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (check(parsed)) return parsed;
    }
  // eslint-disable-next-line no-empty
  } catch {}
  return defaultValue;
}

function watchAndStore(r: Ref, key: string) {
  watch(r, () => localStorage.setItem(KEY_PREFIX + key, JSON.stringify(r.value)), { deep: true });
}

function isSafeInteger(value: unknown): value is number {
  return Number.isSafeInteger(value);
}

export const puzzleNumber = ref<number>(getStored('puzzleNumber', 0, isSafeInteger));
watchAndStore(puzzleNumber, 'puzzleNumber');

// 2022-03-27 is a Sunday
const correctPuzzleNumber = Math.floor((new Date().valueOf() - new Date('2022-03-27T00:00:00Z').valueOf()) / (1000 * 60 * 60 * 24 * 7));

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}
export const guesses = ref<string[]>(getStored('guesses', [], isStringArray));
watchAndStore(guesses, 'guesses');

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

const targetCodeEncoded = ref<string>(getStored('targetCodeEncoded', '', isString));
watchAndStore(targetCodeEncoded, 'targetCodeEncoded');
async function getTargetCode(dialog: ReturnType<typeof useDialog>, newPuzzle: boolean) {
  if (newPuzzle) {
    targetCodeEncoded.value = '';
  }
  try {
    const response = await api.get(`/targetCode/${correctPuzzleNumber}.txt`);
    targetCodeEncoded.value = response.data;
  } catch {
    if (newPuzzle) {
      dialog.error({
        title: 'Failed to load target code',
        content: 'Failed to load the target code. You may wait a few minutes, refresh the page and try again.',
      });
    }
  }
}
export const targetCode = computed(() => {
  const base64Decoded = window.atob(targetCodeEncoded.value);
  return decodeURIComponent(base64Decoded);
});

export const statement = ref<string>(getStored('statement', '', isString));
watchAndStore(statement, 'statement');
async function getStatement(dialog: ReturnType<typeof useDialog>, newPuzzle: boolean) {
  if (newPuzzle) {
    statement.value = '';
  }
  try {
    const response = await api.get(`/statement/${correctPuzzleNumber}.txt`);
    statement.value = DOMPurify.sanitize(response.data);
  } catch {
    if (newPuzzle) {
      dialog.warning({
        title: 'Failed to load statement',
        content: 'Failed to load the problem statement. You may wait a few minutes, refresh the page and try again.',
      });
    }
  }
}

export const lastPlay = ref<number>(getStored('lastPlay', -1, isSafeInteger));
watchAndStore(lastPlay, 'lastPlay');
export const playCount = ref<number>(getStored('playCount', 0, isSafeInteger));
watchAndStore(playCount, 'playCount');
export const lastSuccess = ref<number>(getStored('lastSuccess', -1, isSafeInteger));
watchAndStore(lastSuccess, 'lastSuccess');
export const successCount = ref<number>(getStored('successCount', 0, isSafeInteger));
watchAndStore(successCount, 'successCount');
export const currentStreak = ref<number>(getStored('currentStreak', 0, isSafeInteger));
if (lastSuccess.value < puzzleNumber.value - 1) currentStreak.value = 0;
watchAndStore(currentStreak, 'currentStreak');
export const maxStreak = ref<number>(getStored('maxStreak', 0, isSafeInteger));
watchAndStore(maxStreak, 'maxStreak');
export const guessSum = ref<number>(getStored('guessSum', 0, isSafeInteger));
watchAndStore(guessSum, 'guessSum');
export const firstGame = ref<number>(getStored('firstGame', 0, isSafeInteger));
watchAndStore(firstGame, 'firstGame');

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'number');
}
export const depthFinishedAt = ref<number[]>(getStored('depthFinishedAt', [], isNumberArray));
watchAndStore(depthFinishedAt, 'depthFinishedAt');
function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}
export const finished = ref<boolean>(getStored('finished', false, isBoolean));
watchAndStore(finished, 'finished');
export const gaveUp = ref<boolean>(getStored('gaveUp', false, isBoolean));
watchAndStore(gaveUp, 'gaveUp');

export const showStatement = ref<boolean>(getStored('showStatement', true, isBoolean));
watchAndStore(showStatement, 'showStatement');

export const surveySubmitted = ref<boolean>(getStored('surveySubmitted', false, isBoolean));
watchAndStore(surveySubmitted, 'surveySubmitted');

export async function updatePuzzle(dialog: ReturnType<typeof useDialog>) {
  if (puzzleNumber.value !== correctPuzzleNumber || !targetCode.value || !statement.value) {
    await Promise.all([getTargetCode(dialog, true), getStatement(dialog, true)]);
    showStatement.value = true;
    finished.value = false;
    gaveUp.value = false;
    depthFinishedAt.value = [];
    guesses.value = [];
    surveySubmitted.value = false;
    puzzleNumber.value = correctPuzzleNumber;
  } else {
    await Promise.all([getTargetCode(dialog, false), getStatement(dialog, false)]);
  }
}

export const uiTheme = ref<'light' | 'dark' | 'auto'>(getStored(
  'uiTheme',
  'auto',
  (value: any): value is 'light' | 'dark' | 'auto' => ['light', 'dark', 'auto'].includes(value),
));
watchAndStore(uiTheme, 'uiTheme');
export const uiDark = computed(() => {
  switch (uiTheme.value) {
    case 'auto':
      return useOsTheme().value === 'dark';
    case 'dark':
      return true;
    case 'light':
      return false;
    default:
      return exhaustiveCheck(uiTheme.value);
  }
});

export const showGameRule = ref<boolean>(getStored('showGameRule', true, isBoolean));
watchAndStore(showGameRule, 'showGameRule');

export const codeFontFamily = ref<string>(getStored('codeFontFamily', 'monospace', isString));
watchAndStore(codeFontFamily, 'codeFontFamily');
