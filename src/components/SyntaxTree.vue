<template>
  <n-tree
    :key="renderCount"
    block-line
    :data="rootTreeOption ? [rootTreeOption] : []"
    :default-expanded-keys="defaultExpandedKeys"
    :render-label="renderLabel"
    :render-switcher-icon="renderSwitcherIcon"
    :selectable="false"
    virtual-scroll
  />
</template>

<script setup lang="ts">
import {
  h,
  onMounted,
  ref,
  watch,
} from 'vue';
import {
  NTree,
  TreeOption,
} from 'naive-ui';
import { SyntaxNode } from 'web-tree-sitter';

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

const renderCount = ref(0);
async function update() {
  if (!props.correctRoot || !props.guessRoot) return;
  defaultExpandedKeys.value = [];
  rootTreeOption.value = generateTreeOption(props.guessRoot, 'correct', props.correctRoot, 0);
  renderCount.value += 1;
}
onMounted(update);
watch(props, update);

function renderLabel({ option }: {option: TreeOption}) {
  if (!isTreeOptionEx(option)) throw new Error('Non-ex TreeOption passed to renderLabel');
  return h(SyntaxTreeNode, {
    option,
    markRange: props.markRange,
    // eslint-disable-next-line no-param-reassign
    onModified: (modification) => { option.modification = modification; },
  });
}
</script>
