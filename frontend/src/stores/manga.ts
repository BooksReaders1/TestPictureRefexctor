import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Manga, Chapter, AppState } from '@/types';
import apiService from '@/services/api';

export const useMangaStore = defineStore('manga', () => {
  const manga = ref<Manga | null>(null);
  const chapters = ref<Chapter[]>([]);
  const currentChapter = ref<Chapter | null>(null);
  const currentPage = ref(1);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const loadingProgress = ref(0);

  const setCurrentChapter = (chapter: Chapter) => {
    currentChapter.value = chapter;
    currentPage.value = 1;
  };

  const setCurrentPage = (page: number) => {
    currentPage.value = page;
  };

  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  const setError = (err: string | null) => {
    error.value = err;
  };

  const setLoadingProgress = (progress: number) => {
    loadingProgress.value = progress;
  };

  const fetchManga = async (id: string): Promise<Manga> => {
    setLoading(true);
    setError(null);
    try {
      return await apiService.fetchManga(id);
    } catch (err) {
      setError(String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchChapters = async (mangaId: string): Promise<Chapter[]> => {
    try {
      return await apiService.fetchChapters(mangaId);
    } catch (err) {
      setError(String(err));
      throw err;
    }
  };

  const resetMangaStore = () => {
    manga.value = null;
    chapters.value = [];
    currentChapter.value = null;
    currentPage.value = 1;
    isLoading.value = false;
    error.value = null;
    loadingProgress.value = 0;
  };

  return {
    manga,
    chapters,
    currentChapter,
    currentPage,
    isLoading,
    error,
    loadingProgress,
    setCurrentChapter,
    setCurrentPage,
    setLoading,
    setError,
    setLoadingProgress,
    resetMangaStore,
    fetchManga,
    fetchChapters
  };
});
