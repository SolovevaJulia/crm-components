import { ref, onMounted, onUnmounted } from 'vue';

export const tableScroll = () => {
  const scrollContainer = ref(null);
  const containerWidth = ref(null);

  const handleResize = () => {
    containerWidth.value = scrollContainer.value.clientWidth;
  };

  onMounted(() => {
    containerWidth.value = scrollContainer.value.clientWidth;
    window.addEventListener('resize', handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });

  return { scrollContainer, containerWidth };
};
