import { ref } from 'vue';
import { api } from '@/api';

export function useStrategicDataSelect(type) {
  const options = ref({
    region: [],
    complex: [],
    developer: [],
  });

  const allOptions = ref({
    region: [],
    complex: [],
    developer: [],
  });

  const resetOptions = () => {
    Object.keys(options.value).forEach((key) => {
      options.value[key] = allOptions.value[key];
    });
  };

  api.getStrategicData(type).then(({ data }) => {
    allOptions.value.region = data.region.filter((item) => item).map((item) => ({
      value: item,
    }));

    allOptions.value.complex = data.complex.filter((item) => item).map((item) => ({
      value: item,
    }));

    allOptions.value.developer = data.developer.filter((item) => item).map((item) => ({
      value: item,
    }));
    resetOptions();
  });

  const search = (searchText, field) => {
    options.value[field] = allOptions.value[field].filter(({ value }) => {
      const lowercasedLabel = value.toLowerCase();
      const lowercasedNeedle = searchText.toLowerCase();
      return lowercasedLabel.includes(lowercasedNeedle);
    });
  };

  return {
    options,
    allOptions,
    search,
    resetOptions,
  };
}
