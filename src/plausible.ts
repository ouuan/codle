import { ref, watch } from 'vue';
import Plausible from 'plausible-tracker';

export const {
  trackEvent,
  trackPageview,
  enableAutoOutboundTracking,
} = Plausible({
  domain: 'codle.ouuan.moe',
  apiHost: 'https://plausible.ouuan.moe',
});

export const plausibleTracked = ref<boolean>(localStorage.getItem('plausible_ignore') !== 'true');
watch(plausibleTracked, (tracked) => {
  if (tracked) localStorage.setItem('plausible_ignore', 'false');
  else localStorage.setItem('plausible_ignore', 'true');
});
