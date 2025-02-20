import { ref, computed } from 'vue';
import { useStore } from 'vuex';

export function useCrmTagsSelect() {
  const store = useStore();

  const options = ref([]);
  const isLoading = ref(true);

  const allOptions = computed(() => store.state.crm.tagsList.map((item) => ({
    value: item.id,
    label: item.name,
  })));

  const search = (needle) => {
    const normalize = (str) => str.toLowerCase().replace(/[^a-zA-Z0-9а-яА-Я]/g, '');

    const normalizedNeedle = normalize(needle);

    options.value = allOptions.value.filter(({ label }) => {
      const normalizedLabel = normalize(label);
      return normalizedLabel.includes(normalizedNeedle);
    });
  };

  const resetOptions = () => {
    options.value = allOptions.value;
  };

  store.dispatch('crm/getTagsList').then(() => {
    resetOptions();
    isLoading.value = false;
  });

  return {
    options,
    isLoading,
    search,
    resetOptions,
  };
}
