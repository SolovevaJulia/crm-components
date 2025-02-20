<template>
  <a-row
    :gutter="[16, 16]"
    :style="{margin: '1rem 0'}">
    <a-col
      v-for="checkbox in checkboxList"
      :key="checkbox.label"
      :style="{paddingLeft: '0', paddingRight: '0.5rem'}">
      <a-checkbox v-model:checked="checkbox.checked">
        {{ checkbox.label }}
      </a-checkbox>
    </a-col>
  </a-row>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  isHasPanoramaCheckboxVisible: {
    type: Boolean,
    default: false,
  },
  isNewPlanOptionsVisible: {
    type: Boolean,
    default: false,
  },
});

const item = (label, checked) => ({ label, checked });

const checkboxList = computed(() => {
  const list = [
    item('2D', props.data.type2d),
    item('3D', props.data.type3d),
  ];

  if (props.isHasPanoramaCheckboxVisible) {
    list.push(item('Панорама', props.data.hasPanorama));
  }

  if (props.isNewPlanOptionsVisible) {
    list.push(
      item('Линейка', props.data.isRulerEnabled),
      item('Интерактивный верхний вид', props.data.isInteractiveTopViewEnabled),
      item('Верхний вид как мини-план', props.data.isTopViewAsMiniPlanEnabled),
      item('Скрывать необязательную мебель', props.data.isHideOptionalFurnitureEnabled),
      item('Прозрачный верхний вид', props.data.isTransparentTopViewEnabled),
      item('WEBP', props.data.isWebpEnabled),
    );
  }

  return list;
});
</script>
