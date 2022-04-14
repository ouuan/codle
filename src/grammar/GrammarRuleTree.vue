<template>
  <n-tree
    :data="[root]"
    :selectable="false"
    :render-switcher-icon="renderSwitcherIcon"
    block-line
    virtual-scroll
    class="tree"
  />
</template>

<script setup lang="ts">
import { computed, h } from 'vue';
import {
  NButton,
  NText,
  NTree,
  TreeOption,
} from 'naive-ui';

import { GRAMMAR } from './grammar';
import renderSwitcherIcon from '../utils/renderSwitcherIcon';

const props = defineProps<{
  names: string[],
  index: number,
}>();

const emit = defineEmits<{
  (e: 'goto-child', name: string): void,
}>();

function grammarTreeOption(rule: Rule | undefined, key: string, aliased: boolean): TreeOption {
  if (rule === undefined) {
    return {
      key,
      prefix: () => h(NText, { type: 'error' }, () => 'Error: Symbol not found'),
    };
  }
  switch (rule.type) {
    case 'ALIAS':
      return {
        key,
        prefix: () => h(NText, {
          type: !aliased && rule.named ? 'success' : 'warning',
        }, () => rule.value),
        children: [grammarTreeOption(rule.content, `${key}-0`, true)],
      };
    case 'BLANK':
      return {
        key,
        label: 'Blank',
        isLeaf: true,
      };
    case 'CHOICE':
      return {
        key,
        label: 'One of',
        children: rule.members.reduce((children: TreeOption[], child, index) => {
          const childOption = grammarTreeOption(child, `${key}-${index}`, aliased);
          if (childOption.label === 'One of') {
            children.push(...(childOption.children ?? []));
          } else {
            children.push(childOption);
          }
          return children;
        }, []),
      };
    case 'FIELD':
      return {
        key,
        label: `field: ${rule.name}`,
        children: [grammarTreeOption(rule.content, `${key}-0`, aliased)],
      };
    case 'PATTERN':
      return {
        key,
        prefix: () => h(NText, { code: true }, () => RegExp(rule.value).toString()),
      };
    case 'REPEAT':
      return {
        key,
        label: 'Zero or more',
        children: [grammarTreeOption(rule.content, `${key}-0`, aliased)],
      };
    case 'REPEAT1':
      return {
        key,
        label: 'One or more',
        children: [grammarTreeOption(rule.content, `${key}-0`, aliased)],
      };
    case 'SEQ':
      return {
        key,
        label: 'All of',
        children: rule.members.reduce((children: TreeOption[], child, index) => {
          const childOption = grammarTreeOption(child, `${key}-${index}`, aliased);
          if (childOption.label === 'All of') {
            children.push(...(childOption.children ?? []));
          } else {
            children.push(childOption);
          }
          return children;
        }, []),
      };
    case 'STRING':
      return {
        key,
        prefix: () => h(NText, { code: true }, () => {
          const { value } = rule;
          if (!value.includes('"') || value.includes("'")) return JSON.stringify(value);
          return `'${JSON.stringify(value.replace(/"/g, "'")).replace(/'/g, '"').slice(1, -1)}'`;
        }),
      };
    case 'SYMBOL':
      if (GRAMMAR.inline?.includes(rule.name)) {
        return grammarTreeOption(GRAMMAR.rules[rule.name], key, aliased);
      }
      if (GRAMMAR.externals?.find((external) => external.type === 'SYMBOL' && external.name === rule.name)) {
        return {
          key,
          prefix: () => h(NText, { type: aliased ? 'warning' : 'success' }, () => rule.name),
        };
      }
      return {
        key,
        prefix: () => h(NButton, {
          size: 'small',
          type: aliased || rule.name[0] === '_' ? 'warning' : 'success',
          secondary: true,
          onClick: () => emit('goto-child', rule.name),
        }, () => rule.name),
      };
    default:
      return grammarTreeOption(rule.content, `${key}-0`, aliased);
  }
}

const root = computed(() => {
  const key = `${props.index}-${props.names.join('-')}`;
  if (props.names.length === 0) {
    return grammarTreeOption(undefined, key, false);
  }
  if (props.names.length === 1) {
    return grammarTreeOption(GRAMMAR.rules[props.names[0]], key, false);
  }
  return {
    key: props.names.join('-'),
    label: 'May be an alias of',
    children: props.names.map((name, index) => grammarTreeOption(
      { type: 'SYMBOL', name },
      `${key}-${index}`,
      false,
    )),
  };
});
</script>

<style scoped>
.tree {
  min-height: 30vh;
  max-height: 70vh;
}
</style>
