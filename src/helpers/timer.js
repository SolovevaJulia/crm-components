import { ref } from 'vue';

export const useTimer = () => {
  const timer = ref(null);

  const resetTimer = () => {
    clearInterval(timer.value);
    timer.value = null;
  };

  return { timer, resetTimer };
};
