<template>
  <a-auto-complete
    :style="{ width: '100%' }"
    :options="searchOptions"
    placeholder="Поиск по названию"
    :filter-option="filterOption" />
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  searchList: {
    default: () => [],
    type: Array,
  },
});

const searchOptions = computed(() => props.searchList.map((item) => ({ value: item.name })));

const filterOption = (input, option) => option.value.toUpperCase().indexOf(input.toUpperCase()) !== -1;
</script>
