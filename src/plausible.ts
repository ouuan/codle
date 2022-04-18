import { ref, watch } from 'vue';
import Plausible from 'plausible-tracker';
import { host, plausibleHost } from '../config';

const {
  trackEvent: event,
  trackPageview: pageView,
} = Plausible({
  domain: host,
  apiHost: plausibleHost,
});

function checkHost<T extends(...args: never[]) => void>(fn: T) {
  return (...args: Parameters<T>) => {
    if (window.location.host === host) {
      fn(...args);
    } else {
      // eslint-disable-next-line no-console
      console.log(fn.name, args);
    }
  };
}

export const trackEvent = checkHost(event);
export const trackPageview = checkHost(pageView);

export const plausibleTracked = ref<boolean>(localStorage.getItem('plausible_ignore') !== 'true');
watch(plausibleTracked, (tracked) => {
  if (tracked) localStorage.setItem('plausible_ignore', 'false');
  else localStorage.setItem('plausible_ignore', 'true');
});
