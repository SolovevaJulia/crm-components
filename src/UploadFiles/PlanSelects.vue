<template>
  <a-select
    :value="projectionMode"
    :style="{ width: '100%', marginBottom: '1rem' }"
    placeholder="Тип проекции для топ видов"
    :options="TopViewsProjectionModeOptions"
    @change="updateProjectionMode" />

  <a-select
    v-if="isCameraNavigationSelectVisible"
    :value="cameraNavigation"
    :style="{ width: '100%', marginBottom: '1rem' }"
    placeholder="Тип навигации"
    :options="filteredCameraNavigationOptions"
    @change="updateCameraNavigation" />
</template>

<script setup>
import { TopViewsProjectionModeOptions } from '@/enums/TopViewsProjectionMode';

defineProps({
  projectionMode: {
    type: String,
    required: true,
  },
  cameraNavigation: {
    type: String,
    required: true,
  },
  filteredCameraNavigationOptions: {
    type: Array,
    default: () => [],
  },
  isCameraNavigationSelectVisible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:projectionMode', 'update:cameraNavigation']);

const updateProjectionMode = (newValue) => {
  emit('update:projectionMode', newValue);
};

const updateCameraNavigation = (newValue) => {
  emit('update:cameraNavigation', newValue);
};
</script>
