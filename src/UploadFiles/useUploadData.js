import { reactive } from 'vue';
import { TopViewsProjectionMode } from '@/enums/TopViewsProjectionMode';
import { CameraNavigationMode } from '@/enums/CameraNavigationMode';

const initialState = {
  uploading: false,
  name: null,
  fileList: [],
  tagId: null,
  description: '',
  references: [],
  type2d: true,
  type3d: false,
  hasPanorama: true,
  isRulerEnabled: false,
  isInteractiveTopViewEnabled: false,
  isTopViewAsMiniPlanEnabled: false,
  isHideOptionalFurnitureEnabled: false,
  projectionMode: TopViewsProjectionMode.Perspective,
  cameraNavigation: CameraNavigationMode.Classic,
  isTransparentTopViewEnabled: false,
  isWebpEnabled: true,
};

export function useUploadData() {
  const data = reactive({ ...initialState });

  const resetData = () => {
    Object.assign(data, { ...initialState });
  };

  const extractDataForUpload = () => {
    const { fileList, ...rest } = data;
    return { files: [...fileList], ...rest };
  };

  return { data, resetData, extractDataForUpload };
}
