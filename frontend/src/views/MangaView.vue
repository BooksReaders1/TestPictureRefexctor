<template>
  <div class="manga-view">
    <div v-if="manga" class="manga-container">
      <!-- Manga Header -->
      <header class="manga-header">
        <div class="header-content">
          <button class="back-btn" @click="goBack">← 返回</button>
          <div class="manga-info">
            <h1 class="manga-title">{{ manga.title }}</h1>
            <p class="manga-author" v-if="manga.author">{{ manga.author }}</p>
            <p class="manga-chapter-count">
              共 {{ manga.chapterCount }} 章
            </p>
          </div>
        </div>
      </header>

      <!-- Content Layout -->
      <div class="content-layout">
        <!-- Chapter List Sidebar -->
        <aside class="chapter-sidebar">
          <h2 class="sidebar-title">章节列表</h2>
          <div class="chapter-list">
            <div
              v-for="chapter in chapters"
              :key="chapter.id"
              class="chapter-item"
              :class="{ active: currentChapter?.id === chapter.id }"
              @click="selectChapter(chapter)"
            >
              <span class="chapter-number">第 {{ chapter.order }} 章</span>
              <span class="chapter-title">{{ chapter.title }}</span>
              <span class="chapter-pages">{{ chapter.page_count }} 页</span>
            </div>
          </div>
        </aside>

        <!-- Main Content Area -->
        <main class="main-content">
          <!-- Chapter View -->
          <div v-if="currentChapter" class="chapter-view">
            <ChapterNavigation
              :current-chapter="currentChapter"
              :chapters="chapters"
              :manga-id="mangaId"
              @prev-chapter="goToPrevChapter"
              @next-chapter="goToNextChapter"
              @chapter-select="selectChapter"
            />

            <div class="reader-area">
              <ChapterNavigation
                :current-chapter="currentChapter"
                :chapters="chapters"
                :manga-id="mangaId"
                direction="page"
                @prev-chapter="goToPrevPage"
                @next-chapter="goToNextPage"
                :page-info="pageInfo"
              />

              <!-- Image Container -->
              <ImageContainer
                v-if="currentChapter.images.length > 0"
                :images="currentChapter.images"
                :current-page="currentPage"
                @page-change="handlePageChange"
              />

              <ChapterNavigation
                :current-chapter="currentChapter"
                :chapters="chapters"
                :manga-id="mangaId"
                direction="page"
                @prev-chapter="goToPrevPage"
                @next-chapter="goToNextPage"
                :page-info="pageInfo"
              />
            </div>

            <ChapterNavigation
              :current-chapter="currentChapter"
              :chapters="chapters"
              :manga-id="mangaId"
              direction="chapter"
              @prev-chapter="goToPrevChapter"
              @next-chapter="goToNextChapter"
            />
          </div>

          <!-- Chapter Not Selected -->
          <div v-else class="no-selection">
            <p>请选择一个章节开始阅读</p>
          </div>
        </main>
      </div>

      <!-- Loading Spinner -->
      <LoadingSpinner v-if="isLoading" />

      <!-- Error Toast -->
      <ErrorToast
        :message="error"
        :visible="!!error"
        @dismiss="error = null"
      />
    </div>

    <LoadingSpinner v-if="!manga && !isLoading" />

    <!-- Floating Menu -->
    <FloatingMenu />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMangaStore } from '@/stores/manga';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ErrorToast from '@/components/common/ErrorToast.vue';
import FloatingMenu from '@/components/common/FloatingMenu.vue';
import ChapterNavigation from '@/components/manga/ChapterNavigation.vue';
import ImageContainer from '@/components/image/ImageContainer.vue';

const router = useRouter();
const route = useRoute();
const mangaStore = useMangaStore();

const mangaId = ref(route.params.id as string);
const manga = ref(mangaStore.manga);
const chapters = ref(mangaStore.chapters);
const currentChapter = ref(mangaStore.currentChapter);
const currentPage = ref(mangaStore.currentPage);
const error = ref<string | null>(null);
const isLoading = ref(false);

const mangaIdInput = computed(() => mangaId.value);

const pageInfo = computed(() => ({
  currentPage,
  totalPages: currentChapter.value?.page_count || 0
}));

// Watch for manga ID changes
watch(
  () => route.params.id,
  async (newId) => {
    if (newId && newId !== mangaId.value) {
      await loadManga(newId as string);
    }
  }
);

onMounted(async () => {
  await loadManga(mangaId.value);
});

const loadManga = async (id: string) => {
  isLoading.value = true;
  error.value = null;

  try {
    // Reset store
    mangaStore.resetMangaStore();

    // Fetch manga data
    const mangaData = await mangaStore.fetchManga(id);
    manga.value = mangaData;

    // Fetch chapters
    const chapterData = await mangaStore.fetchChapters(id);
    chapters.value = chapterData;

    // Auto-select first chapter
    if (chapterData.length > 0) {
      selectChapter(chapterData[0]);
    }
  } catch (err) {
    error.value = String(err);
    console.error('Failed to load manga:', err);
  } finally {
    isLoading.value = false;
  }
};

const selectChapter = (chapter: any) => {
  mangaStore.setCurrentChapter(chapter);
  currentChapter.value = chapter;
  currentPage.value = 1;
  error.value = null;
};

const goToPrevChapter = () => {
  if (!currentChapter.value || !chapters.value.length) return;

  const currentIndex = chapters.value.findIndex(
    c => c.id === currentChapter.value.id
  );

  if (currentIndex > 0) {
    selectChapter(chapters.value[currentIndex - 1]);
  }
};

const goToNextChapter = () => {
  if (!currentChapter.value || !chapters.value.length) return;

  const currentIndex = chapters.value.findIndex(
    c => c.id === currentChapter.value.id
  );

  if (currentIndex < chapters.value.length - 1) {
    selectChapter(chapters.value[currentIndex + 1]);
  }
};

const goToPrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    mangaStore.setCurrentPage(currentPage.value);
  }
};

const goToNextPage = () => {
  if (currentChapter.value && currentPage.value < currentChapter.value.page_count) {
    currentPage.value++;
    mangaStore.setCurrentPage(currentPage.value);
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  mangaStore.setCurrentPage(page);
};

const goBack = () => {
  router.push('/');
};
</script>

<style scoped>
.manga-view {
  min-height: 100vh;
  background: #f5f5f5;
}

.manga-container {
  min-height: 100vh;
}

.manga-header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.back-btn {
  padding: 0.5rem 1rem;
  background: #f0f0f0;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.back-btn:hover {
  background: #e0e0e0;
}

.manga-info {
  flex: 1;
}

.manga-title {
  font-size: 1.5rem;
  margin: 0 0 0.25rem 0;
  color: #333;
}

.manga-author {
  color: #666;
  margin: 0;
}

.manga-chapter-count {
  color: #999;
  font-size: 0.875rem;
  margin: 0;
}

.content-layout {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  min-height: calc(100vh - 70px);
}

.chapter-sidebar {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  max-height: calc(100vh - 150px);
  overflow-y: auto;
}

.sidebar-title {
  font-size: 1.125rem;
  margin: 0 0 1rem 0;
  color: #333;
}

.chapter-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.chapter-item {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.chapter-item:hover {
  background: #f5f5f5;
}

.chapter-item.active {
  background: #667eea20;
  border-left: 3px solid #667eea;
}

.chapter-number {
  font-weight: 600;
  color: #667eea;
}

.chapter-title {
  font-size: 0.875rem;
  color: #666;
}

.chapter-pages {
  font-size: 0.75rem;
  color: #999;
}

.main-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.chapter-view {
  min-height: 600px;
}

.reader-area {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: #fafafa;
  border-radius: 8px;
  margin: 2rem 0;
}

.no-selection {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.no-selection p {
  font-size: 1.125rem;
}
</style>
