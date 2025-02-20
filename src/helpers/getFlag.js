import config from '@/config'; // eslint-disable-line import/extensions
import featureFlags from '@/featureFlags';

const currentConfig = {
  ...featureFlags,
  ...(config.featureFlagsOverride ?? {}),
};

export default function getFlag(key) {
  return currentConfig[key] ?? false;
}
