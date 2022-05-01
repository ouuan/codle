<template>
  <div ref="rootRef">
    <n-scrollbar
      x-scrollable
      @scroll="onScroll"
    >
      <div class="tree-outer-wrapper">
        <div class="tree-inner-wrapper">
          <n-tree
            :key="renderCount"
            block-line
            :data="rootTreeOption ? [rootTreeOption] : []"
            :default-expanded-keys="defaultExpandedKeys"
            :render-label="renderLabel"
            :render-switcher-icon="renderSwitcherIcon"
            :selectable="false"
            virtual-scroll
            class="syntax-tree"
          />
        </div>
      </div>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  h,
  onMounted,
  ref,
  watch,
} from 'vue';
import {
  NScrollbar,
  NTree,
  TreeOption,
} from 'naive-ui';
import { SyntaxNode } from 'web-tree-sitter';
import { useElementSize } from '@vueuse/core';

import SyntaxTreeNode from './SyntaxTreeNode.vue';

import {
  CorrectStatus,
  MarkRange,
  TreeOptionEx,
  isTreeOptionEx,
} from '../types';
import { rootTreeOption as globalRootTreeOption } from '../store/rootTreeOption';
import renderSwitcherIcon from '../utils/renderSwitcherIcon';

const props = defineProps<{
  guessRoot: SyntaxNode | null,
  correctRoot: SyntaxNode | null,
  markRange?: MarkRange,
  globalRootTreeOption: boolean,
  maxHeight: string,
}>();

const rootTreeOption = props.globalRootTreeOption ? globalRootTreeOption : ref<TreeOptionEx>();

const defaultExpandedKeys = ref<number[]>([]);

function generateTreeOption(
  node: SyntaxNode,
  correct: CorrectStatus,
  correctNode: SyntaxNode | null,
  depth: number,
): TreeOptionEx {
  const childCorrect = Array<CorrectStatus>(node.namedChildCount).fill('wrong');
  if (correct === 'correct' && correctNode) {
    const typeRemain = new Map<string, number>();
    correctNode.namedChildren.forEach((child) => {
      const { type } = child;
      const oldCount = typeRemain.get(type) ?? 0;
      typeRemain.set(type, oldCount + 1);
    });
    node.namedChildren.forEach((child, index) => {
      const { type } = child;
      if (type === correctNode.namedChildren[index]?.type) {
        childCorrect[index] = 'correct';
        const oldCount = typeRemain.get(type) ?? 0;
        typeRemain.set(type, oldCount - 1);
      }
    });
    node.namedChildren.forEach((child, index) => {
      const { type } = child;
      const oldCount = typeRemain.get(type) ?? 0;
      if (childCorrect[index] === 'wrong' && oldCount > 0) {
        childCorrect[index] = 'misplaced';
        typeRemain.set(type, oldCount - 1);
      }
    });
  }

  const children = node.namedChildren.map((child, index) => generateTreeOption(
    child,
    childCorrect[index],
    correctNode && childCorrect[index] === 'correct' ? correctNode.namedChildren[index] : null,
    depth + 1,
  ));
  const allCorrect = children.length === correctNode?.namedChildCount
    && children.every((childOption) => childOption.allCorrect);

  if (correct === 'correct' && !allCorrect) defaultExpandedKeys.value.push(node.id);

  let minWrongDepth = Infinity;
  if (correct !== 'correct') {
    minWrongDepth = depth;
  } else if (children.length !== correctNode?.namedChildCount) {
    minWrongDepth = depth + 1;
  } else {
    children.forEach((child) => {
      minWrongDepth = Math.min(minWrongDepth, child.minWrongDepth);
    });
  }

  return {
    key: node.id,
    label: node.type,
    correct,
    allCorrect,
    correctText: allCorrect ? correctNode.text : undefined,
    modification: allCorrect ? null : node.text,
    correctStartRow: allCorrect ? correctNode.startPosition.row : undefined,
    correctStartCol: allCorrect ? correctNode.startPosition.column : undefined,
    correctChildCount: correctNode?.namedChildCount ?? 0,
    node,
    children,
    isLeaf: node.namedChildCount === 0,
    depth,
    minWrongDepth,
    correctCount: correct === 'correct' ? children.reduce((sum, child) => sum + child.correctCount, 1) : 0,
  };
}

const maxRenderedDepth = ref(0);
function renderLabel({ option }: {option: TreeOption}) {
  if (!isTreeOptionEx(option)) throw new Error('Non-ex TreeOption passed to renderLabel');
  maxRenderedDepth.value = Math.max(maxRenderedDepth.value, option.depth);
  return h(SyntaxTreeNode, {
    option,
    markRange: props.markRange,
    // eslint-disable-next-line no-param-reassign
    onModified: (modification) => { option.modification = modification; },
  });
}

const rootRef = ref<HTMLDivElement>();

const outerWrapperWidth = computed(() => {
  if (!rootRef.value) return '500px';
  const nodes = rootRef.value.getElementsByClassName('syntax-tree-node-button');
  let maxWidth = 0;
  for (const node of nodes) {
    maxWidth = Math.max(maxWidth, node.getBoundingClientRect().width);
  }
  return `${Math.ceil(maxRenderedDepth.value * 16 + maxWidth + 30)}px`;
});

// to keep the vertical scrollbar visible
const rootWidth = useElementSize(rootRef, { width: 500, height: 1000 }).width;
const scrollbarPos = ref(0);
function onScroll({ target }: Event) {
  if (target instanceof HTMLElement) {
    scrollbarPos.value = target.scrollLeft;
  }
}
const innerWrapperWidth = computed(() => {
  const width = rootWidth.value + scrollbarPos.value;
  return `${width}px`;
});

const renderCount = ref(0);
async function update() {
  if (!props.correctRoot || !props.guessRoot) return;
  maxRenderedDepth.value = 0;
  scrollbarPos.value = 0;
  defaultExpandedKeys.value = [];
  rootTreeOption.value = generateTreeOption(props.guessRoot, 'correct', props.correctRoot, 0);
  renderCount.value += 1;
}
onMounted(update);
watch(props, update);
</script>

<style scoped>
.tree-outer-wrapper {
  min-width: v-bind(outerWrapperWidth);
}

.tree-inner-wrapper {
  max-width: v-bind(innerWrapperWidth);
}

.syntax-tree {
  max-height: v-bind(maxHeight);
  margin-bottom: 8px;
}
</style>
