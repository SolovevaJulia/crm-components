export const CameraNavigationMode = {
  Classic: 'classic',
  Proactive: 'proactive',
  Portals: 'portals',
};

export const CameraNavigationModeOptionNames = {
  [CameraNavigationMode.Classic]: 'Классический режим',
  [CameraNavigationMode.Proactive]: 'Проактивный режим',
  [CameraNavigationMode.Portals]: 'Порталы',
};

export const CameraNavigationModeOptions = Object.entries(CameraNavigationModeOptionNames)
  .map(([value, label]) => ({ value, label }));
