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
        ref="scrollbar"
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
      :index="history.length"
      @goto-child="gotoChild"
    />
  </n-modal>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  ref,
  watch,
} from 'vue';
import {
  NBreadcrumb,
  NBreadcrumbItem,
  NButton,
  NModal,
  NScrollbar,
  useMessage,
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

const scrollbar = ref<InstanceType<typeof NScrollbar>>();

const message = useMessage();

function gotoChild(child: string) {
  if (current.value.length === 1 && child === current.value[0]) {
    message.warning(`You are already viewing the type [${child}]`);
    return;
  }
  history.value.push(child);
  nextTick(() => scrollbar.value?.scrollTo({ left: 99999 }));
}
</script>
