import {
  h,
  ref,
  watch,
  Ref,
  computed,
} from 'vue';
import {
  NP,
  useDialog,
  useOsTheme,
} from 'naive-ui';
import { exhaustiveCheck } from 'ts-exhaustive-check';

import ExternalLink from '../components/ExternalLink.vue';

import { fetchStatement, fetchTargetCodeEncoded, decodeTargetCode } from '../utils/getPuzzle';
import { correctPuzzleNumber } from '../../config';

const KEY_PREFIX = 'codle_';

for (let i = 0; i < localStorage.length; i += 1) {
  const key = localStorage.key(i);
  if (key?.startsWith('codle_demo_')) {
    localStorage.removeItem(key);
  }
}

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

const puzzleNumber = ref<number>(getStored('puzzleNumber', 0, isSafeInteger));
watchAndStore(puzzleNumber, 'puzzleNumber');

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
async function getTargetCodeEncoded(dialog: ReturnType<typeof useDialog>, newPuzzle: boolean) {
  if (newPuzzle) {
    targetCodeEncoded.value = '';
  }
  try {
    targetCodeEncoded.value = await fetchTargetCodeEncoded(correctPuzzleNumber);
  } catch {
    if (newPuzzle) {
      dialog.error({
        title: 'Failed to load target code',
        content: 'Failed to load the target code. You may wait a few minutes, refresh the page and try again.',
      });
    }
  }
}
export const targetCode = computed(() => decodeTargetCode(targetCodeEncoded.value));

export const statement = ref<string>(getStored('statement', '', isString));
watchAndStore(statement, 'statement');
async function getStatement(dialog: ReturnType<typeof useDialog>, newPuzzle: boolean) {
  if (newPuzzle) {
    statement.value = '';
  }
  try {
    statement.value = await fetchStatement(correctPuzzleNumber);
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
  if (puzzleNumber.value !== correctPuzzleNumber) {
    await Promise.all([getTargetCodeEncoded(dialog, true), getStatement(dialog, true)]);
    showStatement.value = true;
    finished.value = false;
    gaveUp.value = false;
    depthFinishedAt.value = [];
    guesses.value = [];
    surveySubmitted.value = false;
    puzzleNumber.value = correctPuzzleNumber;
  } else {
    if ((lastPlay.value === puzzleNumber.value && guesses.value.length === 0)
      || (firstGame.value && successCount.value + (finished.value ? 0 : 1)
          > puzzleNumber.value - firstGame.value + 1)) {
      dialog.warning({
        title: 'Inconsistent data',
        content: () => h(NP, {}, {
          default: () => [
            "Inconsistent statistics data was detected. It's likely to be caused by a known bug. Please read ",
            h(ExternalLink, {
              href: 'https://github.com/ouuan/codle/discussions/3',
              title: 'the announcement',
            }),
            ' for more information. If you think the announcement is irrelevant, please open an issue/discussion on GitHub.',
          ],
        }),
      });
    }
    await Promise.all([
      getTargetCodeEncoded(dialog, !targetCode.value),
      getStatement(dialog, !statement.value),
    ]);
  }
}

export const uiTheme = ref<'light' | 'dark' | 'auto'>(getStored(
  'uiTheme',
  'auto',
  (value: any): value is 'light' | 'dark' | 'auto' => ['light', 'dark', 'auto'].includes(value),
));
watchAndStore(uiTheme, 'uiTheme');
export function uiDark(osTheme: ReturnType<typeof useOsTheme>) {
  switch (uiTheme.value) {
    case 'auto':
      return osTheme.value === 'dark';
    case 'dark':
      return true;
    case 'light':
      return false;
    default:
      return exhaustiveCheck(uiTheme.value);
  }
}

export const showGameRule = ref<boolean>(getStored('showGameRule', true, isBoolean));
watchAndStore(showGameRule, 'showGameRule');

export const codeFontFamily = ref<string>(getStored('codeFontFamily', 'monospace', isString));
watchAndStore(codeFontFamily, 'codeFontFamily');

export const codeLineWrap = ref<boolean>(getStored('codeLineWrap', true, isBoolean));
watchAndStore(codeLineWrap, 'codeLineWrap');

export const readonlyEditorAfterFirstGuess = ref<boolean>(getStored('readonlyEditorAfterFirstGuess', false, isBoolean));
watchAndStore(readonlyEditorAfterFirstGuess, 'readonlyEditorAfterFirstGuess');
