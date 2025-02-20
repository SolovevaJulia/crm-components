// UploadPlan.vue - Компонент загрузки планировки

<template>
  <div>
    <a-input v-model:value="data.name" placeholder="Введите название планировки" :style="{ width: '100%', marginBottom: '1rem' }" />

    <tag-select v-model:value="data.tagId" :style="{ marginBottom: '1rem' }" />

    <plan-description v-if="isPlanDescriptionAndRendersVisible" v-model:value="data.description" />

    <a-upload v-model:file-list="data.fileList" name="file" :multiple="true" :before-upload="beforeUpload" accept="image/png, image/jpeg" list-type="picture">
      <a-button>
        <plus-outlined />
        Выбрать не более {{ maxFilesCount }} изображений в формате .jpg или .png
      </a-button>
      <a-divider v-if="data.fileList.length !== 0">
        Нажмите на изображение и переместите его, расположив по порядку этажей
      </a-divider>
    </a-upload>

    <references-uploader v-if="isPlanDescriptionAndRendersVisible" v-model:file-list="data.references" />

    <plan-checkboxes :data="data" :is-has-panorama-checkbox-visible="isHasPanoramaCheckboxVisible" :is-new-plan-options-visible="isNewPlanOptionsVisible" />

    <plan-selects v-model:projection-mode="data.projectionMode" v-model:camera-navigation="data.cameraNavigation" :filtered-camera-navigation-options="filteredCameraNavigationOptions" :is-camera-navigation-select-visible="isCameraNavigationSelectVisible" />

    <a-button type="primary" :disabled="filesList.length === 0 || !data.name || !data.tagId || data.uploading" :loading="data.uploading" @click="handleUpload">
      {{ data.uploading ? "Загружается" : "Загрузить" }}
    </a-button>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { setupFileSorting, applyFloorStyles } from '@/helpers/fileFloorsSorter';
import getFlag from '@/getFlag';
import { useUploadData } from '@/Components/CRM/Upload/useUploadData';
import { uploadFiles } from '@/Components/CRM/Upload/uploadFiles';
import { useCameraNavigationOptions } from '@/composables/useCameraNavigationOptions';
import TagSelect from '@/Components/Common/TagSelect.vue';
import PlanDescription from '@/Components/CRM/Upload/PlanDescription.vue';
import ReferencesUploader from '@/Components/CRM/Upload/ReferencesUploader.vue';
import PlanCheckboxes from '@/Components/CRM/Upload/PlanCheckboxes.vue';
import PlanSelects from '@/Components/CRM/Upload/PlanSelects.vue';
import { uploadFiles } from '@/api/uploadFiles';

const isHasPanoramaCheckboxVisible = getFlag('isHasPanoramaCheckboxVisible');
const isNewPlanOptionsVisible = getFlag('isNewPlanOptionsVisible');
const isPlanDescriptionAndRendersVisible = getFlag('isPlanDescriptionAndRendersVisible');

const { filteredOptions: filteredCameraNavigationOptions, isSelectVisible: isCameraNavigationSelectVisible } = useCameraNavigationOptions();

const maxFilesCount = 10;

const filesList = ref([]);
const { createSortable, destroySortable } = setupFileSorting(filesList);
const { data, resetData, extractDataForUpload } = useUploadData();

const beforeUpload = (file) => {
  file.originalName = file.name;
  filesList.value = [...filesList.value, file];
  if (filesList.value.length > maxFilesCount) {
    message.error(`Не более ${maxFilesCount} файлов`);
  }
  return false;
};

const handleUpload = async () => {
  if (!data.fileList.length || !data.name || !data.tagId) {
    message.error('Пожалуйста, выберите файлы, название и тег.');
    return;
  }

  data.uploading = true;
  message.loading('Загружаем...', 0);

  try {
    const uploadData = extractDataForUpload();
    uploadData.files = data.fileList.map((file, index) => new File([file.originFileObj], `${index + 1}этаж_${file.name}`));
    await mockUploadFiles(uploadData);

    message.destroy();
    message.success('Успешно! Планировка появится в списке, как только обработается');
    resetData();
  } catch (error) {
    message.destroy();
    message.error(error.message || 'Ошибка загрузки');
  } finally {
    data.uploading = false;
  }
};
</script>

<style>
.ant-upload-list-item-container * {
  user-drag: none;
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

.ant-upload-list-item-card-actions {
  pointer-events: auto;
}

.ant-upload-list-item-name::before {
  content: attr(data-floor) " этаж ";
  font-weight: bold;
}
</style>
