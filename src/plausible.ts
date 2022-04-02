import { ref, watch } from 'vue';
import Plausible from 'plausible-tracker';

const {
  trackEvent: event,
  trackPageview: pageView,
  enableAutoOutboundTracking: outBound,
} = Plausible({
  domain: 'codle.ouuan.moe',
  apiHost: 'https://plausible.ouuan.moe',
});

function checkHost<T extends(...args: never[]) => void>(fn: T) {
  return (...args: Parameters<T>) => {
    if (window.location.host === 'codle.ouuan.moe') {
      fn(...args);
    }
  };
}

export const trackEvent = checkHost(event);
export const trackPageview = checkHost(pageView);
export const enableAutoOutboundTracking = checkHost(outBound);

export const plausibleTracked = ref<boolean>(localStorage.getItem('plausible_ignore') !== 'true');
watch(plausibleTracked, (tracked) => {
  if (tracked) localStorage.setItem('plausible_ignore', 'false');
  else localStorage.setItem('plausible_ignore', 'true');
});
