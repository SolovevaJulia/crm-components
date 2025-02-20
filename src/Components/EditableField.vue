<template>
  <a-space align="center">
    {{ label }}
    <span v-if="!isEditMode">{{ value ?? "Отсутствует" }}</span>
    <a-button
      v-if="!isEditMode && !isNinja"
      @click="startEditData">
      <template #icon>
        <edit-outlined />
      </template>
    </a-button>
    <form
      v-if="isEditMode"
      :style="{ display: 'flex', alignItems: 'center', width: '100%' }"
      @submit.prevent="save">
      <a-auto-complete
        v-if="field"
        v-model:value="newValue"
        :options="strategicDataSelect.options[field]"
        style="width: 200px"
        placeholder="Введите значение"
        :filter-option="false"
        @search="strategicDataSelect.search(newValue, field)"
        @focus="strategicDataSelect.resetOptions()" />
      <a-input
        v-else
        v-model:value="newValue"
        style="width: 200px"
        placeholder="Введите значение" />
      <check-circle-outlined
        :style="{ color: '#52c41a', marginLeft: '1rem' }"
        @click="save" />
      <close-circle-outlined
        :style="{ color: '#f5222d', marginLeft: '1rem' }"
        @click="cancel" />
    </form>
  </a-space>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  value: {
    type: String,
    default: null,
  },
  strategicDataSelect: {
    type: Object,
    default: null,
  },
  field: {
    type: String,
    default: null,
  },
});
const emit = defineEmits(['saveData']);

const store = useStore();

const newValue = ref(props.value ?? null);
const isEditMode = ref(false);
const isNinja = store.getters['auth/currentUserHasRolesWithNames']('ninja');

const startEditData = () => {
  newValue.value = props.value;
  isEditMode.value = true;
};

const save = async () => {
  emit('saveData', newValue.value);
  isEditMode.value = false;
};

const cancel = () => {
  isEditMode.value = false;
};
</script>
