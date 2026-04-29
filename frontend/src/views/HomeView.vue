<template>
  <div class="home-view">
    <header class="header">
      <h1 class="title">Vue漫画查看器</h1>
      <p class="subtitle">输入漫画ID查看漫画内容</p>
    </header>

    <main class="main-content">
      <div class="search-container">
        <div class="search-box">
          <input
            v-model="mangaIdInput"
            type="text"
            class="search-input"
            placeholder="输入漫画ID (如: 123456)"
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">搜索</button>
        </div>

        <div v-if="searchedManga" class="manga-info">
          <div class="manga-card" @click="goToManga">
            <div class="manga-cover">
              <span class="manga-id">ID: {{ searchedManga.id }}</span>
            </div>
            <div class="manga-details">
              <h2 class="manga-title">{{ searchedManga.title }}</h2>
              <p class="manga-author" v-if="searchedManga.author">
                {{ searchedManga.author }}
              </p>
              <p class="manga-chapters">
                共 {{ searchedManga.chapterCount }} 章
              </p>
            </div>
          </div>
        </div>

        <div v-if="searchError" class="error-message">
          {{ searchError }}
        </div>
      </div>
    </main>

    <LoadingSpinner v-if="isLoading" />

    <ErrorToast
      :message="error"
      :visible="!!error"
      @dismiss="error = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMangaStore } from '@/stores/manga';
import { useAppStore } from '@/stores/app';
import type { Manga } from '@/types';

const router = useRouter();
const mangaStore = useMangaStore();
const appStore = useAppStore();

const mangaIdInput = ref('');
const searchedManga = ref<Manga | null>(null);
const searchError = ref('');
const error = ref<string | null>(null);
const isLoading = ref(false);

const handleSearch = async () => {
  if (!mangaIdInput.value.trim()) {
    return;
  }

  isLoading.value = true;
  searchError.value = '';
  error.value = null;

  try {
    const manga = await mangaStore.fetchManga(mangaIdInput.value);
    searchedManga.value = manga;
    error.value = null;
  } catch (err) {
    searchError.value = '无法找到该漫画，请检查ID是否正确';
    error.value = String(err);
  } finally {
    isLoading.value = false;
  }
};

const goToManga = () => {
  if (searchedManga.value) {
    router.push(`/manga/${searchedManga.value.id}`);
  }
};
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  text-align: center;
  padding: 3rem 1rem;
  color: white;
}

.title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
}

.main-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.search-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.search-box {
  display: flex;
  gap: 1rem;
}

.search-input {
  flex: 1;
  padding: 0.875rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.search-btn {
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.manga-info {
  margin-top: 2rem;
}

.manga-card {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.manga-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.manga-cover {
  width: 120px;
  height: 160px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.manga-id {
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.manga-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.manga-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.manga-author {
  color: #666;
  margin-bottom: 0.5rem;
}

.manga-chapters {
  color: #999;
  font-size: 0.875rem;
}

.error-message {
  margin-top: 1rem;
  padding: 1rem;
  background: #ffebee;
  color: #c62828;
  border-radius: 8px;
  text-align: center;
}
</style>
