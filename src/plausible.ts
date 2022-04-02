import Plausible from 'plausible-tracker';

export const {
  trackEvent,
  trackPageview,
  enableAutoOutboundTracking,
} = Plausible({
  domain: 'codle.ouuan.moe',
  apiHost: 'https://plausible.ouuan.moe',
});
