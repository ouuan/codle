import { h } from 'vue';
import { NIcon } from 'naive-ui';
import { ChevronForward } from '@vicons/ionicons5';

export default function renderSwitcherIcon() {
  return h(NIcon, null, { default: () => h(ChevronForward) });
}
