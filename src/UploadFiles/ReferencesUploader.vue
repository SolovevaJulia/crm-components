<template>
  <div
    class="clearfix"
    :style="{ marginTop: '1rem' }">
    <a-upload
      :file-list="fileList"
      :multiple="true"
      list-type="picture-card"
      :before-upload="beforeUpload"
      @preview="handlePreview"
      @remove="handleRemove"
      @change="handleChange">
      <div>
        <plus-outlined />
        <div style="margin-top: 8px">
          Загрузить референсы
        </div>
      </div>
    </a-upload>
    <a-modal
      :open="previewVisible"
      :title="previewTitle"
      :footer="null"
      @cancel="handleCancel">
      <img
        alt="example"
        style="width: 100%"
        :src="previewImage">
    </a-modal>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { blobToBase64 } from '@/utils/fetchAndConvertImages';

const props = defineProps({
  fileList: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update:file-list']);

const localFileList = ref([...props.fileList]);

watch(localFileList, (newList) => {
  emit('update:file-list', newList);
});

const beforeUpload = (file) => {
  localFileList.value.push(file);
  return false;
};

const handleRemove = (file) => {
  const index = localFileList.value.indexOf(file);
  if (index !== -1) {
    localFileList.value.splice(index, 1);
  }
};

const handleChange = (info) => {
  localFileList.value = info.fileList;
};

const previewVisible = ref(false);
const previewTitle = ref('');
const previewImage = ref('');

const handlePreview = async (file) => {
  if (!file.url && !file.preview) {
    file.preview = await blobToBase64(file.originFileObj);
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};

const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = '';
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
