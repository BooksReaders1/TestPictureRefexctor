import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { UserSettings } from '@/types';

const defaultSettings: UserSettings = {
  theme: 'light',
  imageQuality: 'high',
  preloadCount: 2,
  maxConcurrent: 5
};

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<UserSettings>({ ...defaultSettings });

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    settings.value = { ...settings.value, ...newSettings };
  };

  const setTheme = (theme: 'light' | 'dark') => {
    settings.value.theme = theme;
  };

  const setImageQuality = (quality: 'high' | 'medium' | 'low') => {
    settings.value.imageQuality = quality;
  };

  const setPreloadCount = (count: number) => {
    settings.value.preloadCount = count;
  };

  const setMaxConcurrent = (max: number) => {
    settings.value.maxConcurrent = max;
  };

  return {
    settings,
    updateSettings,
    setTheme,
    setImageQuality,
    setPreloadCount,
    setMaxConcurrent
  };
});
