<template>
  <n-tree
    :data="[root]"
    :selectable="false"
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
      prefix: () => h(NText, { type: 'error' }, () => ['Error: Symbol not found']),
    };
  }
  switch (rule.type) {
    case 'ALIAS':
      return {
        key,
        prefix: () => h(NText, {
          type: !aliased && rule.named ? 'success' : 'warning',
        }, () => [rule.value]),
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
        children: rule.members.map((child, index) => grammarTreeOption(child, `${key}-${index}`, aliased)),
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
        prefix: () => h(NText, { type: 'info' }, () => [RegExp(rule.value).toString()]),
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
        children: rule.members.map((child, index) => grammarTreeOption(child, `${key}-${index}`, aliased)),
      };
    case 'STRING':
      return {
        key,
        prefix: () => h(NText, { type: 'info' }, () => [rule.value]),
      };
    case 'SYMBOL':
      if (GRAMMAR.inline?.includes(rule.name)) {
        return grammarTreeOption(GRAMMAR.rules[rule.name], key, aliased);
      }
      if (GRAMMAR.externals?.find((external) => external.type === 'SYMBOL' && external.name === rule.name)) {
        return {
          key,
          prefix: () => h(NText, { type: aliased ? 'warning' : 'success' }, () => [rule.name]),
        };
      }
      return {
        key,
        prefix: () => h(NButton, {
          size: 'small',
          type: aliased || rule.name[0] === '_' ? 'warning' : 'success',
          secondary: true,
          onClick: () => emit('goto-child', rule.name),
        }, () => [rule.name]),
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
