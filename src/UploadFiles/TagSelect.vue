<template>
  <a-select
    :value="value"
    :style="{ width: '100%' }"
    placeholder="Выберите теги"
    show-search
    :loading="crmTagsSelect.isLoading"
    :filter-option="false"
    :options="crmTagsSelect.options"
    @search="crmTagsSelect.search"
    @focus="crmTagsSelect.resetOptions"
    @change="updateValue" />
</template>

<script setup>
import { reactive } from 'vue';
import { useCrmTagsSelect } from '@/composables/CrmTagsSelect';

defineProps({
  value: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits(['update:value']);

const updateValue = (newValue) => {
  emit('update:value', newValue);
};

const crmTagsSelect = reactive(useCrmTagsSelect());
</script>
