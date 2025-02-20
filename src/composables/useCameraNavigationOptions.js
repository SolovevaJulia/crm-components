import { computed } from 'vue';
import { CameraNavigationMode, CameraNavigationModeOptionNames } from '@/enums/CameraNavigationMode';
import getFlag from '@/helpers/getFlag';

export function useCameraNavigationOptions() {
  const isProactiveModeVisible = getFlag('isProactiveModeVisible');
  const isPortalModeVisible = getFlag('isPortalModeVisible');

  const filteredOptions = computed(() => {
    const options = [];
    if (isProactiveModeVisible) {
      options.push({
        value: CameraNavigationMode.Proactive,
        label: CameraNavigationModeOptionNames[CameraNavigationMode.Proactive],
      });
    }
    if (isPortalModeVisible) {
      options.push({
        value: CameraNavigationMode.Portals,
        label: CameraNavigationModeOptionNames[CameraNavigationMode.Portals],
      });
    }
    if (options.length > 0 || (!isProactiveModeVisible && !isPortalModeVisible)) {
      options.unshift({
        value: CameraNavigationMode.Classic,
        label: CameraNavigationModeOptionNames[CameraNavigationMode.Classic],
      });
    }
    return options;
  });

  const isSelectVisible = computed(() => filteredOptions.value.length > 1);

  return {
    filteredOptions,
    isSelectVisible,
  };
}
