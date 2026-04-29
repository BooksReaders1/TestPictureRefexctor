import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { AppState } from '@/types';

export const useAppStore = defineStore('app', () => {
  const isDownloading = ref(false);
  const downloadProgress = ref(0);

  const setDownloading = (downloading: boolean) => {
    isDownloading.value = downloading;
  };

  const setDownloadProgress = (progress: number) => {
    downloadProgress.value = progress;
  };

  return {
    isDownloading,
    downloadProgress,
    setDownloading,
    setDownloadProgress
  };
});
