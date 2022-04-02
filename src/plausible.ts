import Plausible from 'plausible-tracker';

export const { trackEvent, enableAutoOutboundTracking } = Plausible({
  domain: 'codle.ouuan.moe',
  apiHost: 'https://plausible.ouuan.moe',
});
