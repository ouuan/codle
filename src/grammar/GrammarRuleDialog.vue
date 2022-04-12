<template>
  <n-button
    size="small"
    tertiary
    :type="type"
    @click="showModal = true"
  >
    <slot />
  </n-button>
  <n-modal
    v-model:show="showModal"
    preset="card"
    style="max-width: calc(min(80vw, 700px));"
  >
    <template #header>
      <n-scrollbar
        x-scrollable
        style="max-width: calc(min(80vw, 700px) - 100px);"
      >
        <n-breadcrumb>
          Grammar&nbsp;
          <n-breadcrumb-item
            v-for="(historyName, index) of history"
            :key="historyName"
            @click="history = history.slice(0, index + 1)"
          >
            {{ historyName }}
          </n-breadcrumb-item>
        </n-breadcrumb>
      </n-scrollbar>
    </template>
    <grammar-rule-tree
      :names="current"
      @goto-child="(name) => history.push(name)"
    />
  </n-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  NBreadcrumb,
  NBreadcrumbItem,
  NButton,
  NModal,
  NScrollbar,
} from 'naive-ui';

import GrammarRuleTree from './GrammarRuleTree.vue';

const props = defineProps<{
  name: string,
  symbols: string[],
  type: 'success' | 'warning' | 'default' | 'info',
}>();

const history = ref([props.name]);
const current = computed(() => {
  if (history.value.length === 1) return props.symbols;
  return [history.value[history.value.length - 1]];
});

const showModal = ref(false);

// reset after closed
watch(showModal, (show) => {
  if (show) {
    history.value = [props.name];
  }
});
</script>
