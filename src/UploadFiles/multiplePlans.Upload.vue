<template>
  <tag-select
    v-model:value="data.tagId"
    :style="{ marginBottom: '1rem' }" />

  <a-upload-dragger
    class="upload__dragger"
    :file-list="data.fileList"
    name="file"
    :multiple="true"
    accept="image/png, image/jpeg"
    :before-upload="beforeUpload"
    @remove="handleRemove">
    <p class="ant-upload-drag-icon">
      <inbox-outlined />
    </p>
    <p class="ant-upload-text">
      Щелкните или перетащите сюда изображения
    </p>
    <p class="ant-upload-hint">
      не более {{ maxFilesCount }} фотографий
    </p>
    <p class="ant-upload-hint">
      в формате .jpg или .png
    </p>
  </a-upload-dragger>

  <plan-description
    v-if="isPlanDescriptionAndRendersVisible"
    v-model:value="data.description" />

  <references-uploader
    v-if="isPlanDescriptionAndRendersVisible"
    v-model:file-list="data.references" />

  <plan-checkboxes
    :data="data"
    :is-has-panorama-checkbox-visible="isHasPanoramaCheckboxVisible"
    :is-new-plan-options-visible="isNewPlanOptionsVisible" />

  <plan-selects
    v-model:projection-mode="data.projectionMode"
    v-model:camera-navigation="data.cameraNavigation"
    :filtered-camera-navigation-options="filteredCameraNavigationOptions"
    :is-camera-navigation-select-visible="isCameraNavigationSelectVisible" />

  <a-button
    type="primary"
    :disabled="data.fileList.length === 0 || data.tagId === null || data.uploading"
    :loading="data.uploading"
    @click="handleUpload">
    {{ data.uploading ? "Загружается" : "Загрузить" }}
  </a-button>
</template>

<script setup>
import { InboxOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import getFlag from '@/getFlag';
import { useCameraNavigationOptions } from '@/composables/useCameraNavigationOptions';
import { useUploadData } from '@/Components/CRM/Upload/useUploadData';
import { uploadFiles } from '@/Components/CRM/Upload/uploadFiles';
import TagSelect from '@/Components/Common/TagSelect.vue';
import PlanDescription from '@/Components/CRM/Upload/PlanDescription.vue';
import ReferencesUploader from '@/Components/CRM/Upload/ReferencesUploader.vue';
import PlanCheckboxes from '@/Components/CRM/Upload/PlanCheckboxes.vue';
import PlanSelects from '@/Components/CRM/Upload/PlanSelects.vue';

const isHasPanoramaCheckboxVisible = getFlag('isHasPanoramaCheckboxVisible');
const isNewPlanOptionsVisible = getFlag('isNewPlanOptionsVisible');
const isPlanDescriptionAndRendersVisible = getFlag('isPlanDescriptionAndRendersVisible');

const {
  filteredOptions: filteredCameraNavigationOptions,
  isSelectVisible: isCameraNavigationSelectVisible,
} = useCameraNavigationOptions();

const { data, resetData, extractDataForUpload } = useUploadData();

const handleUpload = async () => {
  if (!data.fileList.length || !data.tagId) return;

  data.uploading = true;
  message.loading('Загружаем...', 0);

  try {
    const uploadData = extractDataForUpload();
    await uploadFiles(uploadData);

    message.destroy();
    message.success('Успешно! Планировки появятся в списке, как только обработаются');
    resetData();
  } catch (error) {
    message.error(error.message || 'Ошибка загрузки');
  } finally {
    data.uploading = false;
  }
};

const maxFilesCount = 50;

const handleRemoveCommon = (file, fileList) => {
  const index = fileList.indexOf(file);
  const newList = fileList.slice();
  newList.splice(index, 1);
  return newList;
};

const handleRemove = (file) => {
  data.fileList = handleRemoveCommon(file, data.fileList);
};

const sliceRedundantFiles = (fileList) => {
  if (fileList.length > maxFilesCount) {
    message.error(`Не более ${maxFilesCount} файлов`);
  }
  return fileList.slice(0, maxFilesCount);
};

const beforeUpload = (file, filesList) => {
  if (file.name !== filesList[0].name) return false;
  data.fileList = sliceRedundantFiles(filesList);
  return false;
};

</script>

<style>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
