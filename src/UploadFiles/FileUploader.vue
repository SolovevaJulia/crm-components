<template>
  <a-upload
    v-model:file-list="localFileList"
    name="file"
    :multiple="true"
    :before-upload="handleBeforeUpload"
    :accept="accept"
    :list-type="listType">
    <slot />
  </a-upload>
</template>

<script setup>
import { ref, watch } from 'vue';
import { message } from 'ant-design-vue';

const props = defineProps({
  maxFiles: {
    type: Number,
    default: 10,
  },
  accept: {
    type: String,
    default: 'image/png, image/jpeg',
  },
  listType: {
    type: String,
    default: 'picture',
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:file-list']);

const localFileList = ref([]);

const handleBeforeUpload = (file) => {
  if (localFileList.value.length >= props.maxFiles) {
    message.error(`Не более ${props.maxFiles} файлов`);
    return false;
  }
  localFileList.value = [...localFileList.value, file];
  return false;
};

watch(
  () => localFileList.value,
  (newVal) => {
    emit('update:file-list', newVal);
  },
);
</script>
