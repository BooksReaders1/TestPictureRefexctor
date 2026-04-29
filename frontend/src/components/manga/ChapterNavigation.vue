<template>
  <div class="chapter-navigation" :class="direction">
    <button
      class="nav-btn prev"
      :disabled="!canNavigate"
      @click="$emit('prev-chapter')"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
      <span class="nav-label">{{ direction === 'chapter' ? '上一章' : '←' }}</span>
    </button>

    <div class="nav-info">
      <span v-if="direction === 'chapter'" class="chapter-info">
        {{ currentChapter.title }} ({{ currentChapter.order }}章)
      </span>
      <span v-else class="page-info">
        第 {{ currentPage }} / {{ totalPages }} 页
      </span>
    </div>

    <button
      class="nav-btn next"
      :disabled="!canNavigate"
      @click="$emit('next-chapter')"
    >
      <span class="nav-label">{{ direction === 'chapter' ? '下一章' : '→' }}</span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Chapter } from '@/types';

interface Props {
  currentChapter: Chapter;
  chapters: Chapter[];
  mangaId: string;
  direction: 'chapter' | 'page';
  pageInfo?: {
    currentPage: number;
    totalPages: number;
  };
}

interface Emits {
  (e: 'prev-chapter'): void;
  (e: 'next-chapter'): void;
}

withDefaults(defineProps<Props>(), {
  direction: 'chapter',
  pageInfo: () => ({ currentPage: 1, totalPages: 0 })
});

defineEmits<Emits>();

const canNavigate = computed(() => {
  if (direction.value === 'chapter') {
    return hasPrevChapter || hasNextChapter;
  } else {
    const { currentPage, totalPages } = pageInfo.value;
    return currentPage > 1 || currentPage < totalPages;
  }
});

const hasPrevChapter = computed(() => {
  const currentIndex = chapters.value.findIndex(c => c.id === currentChapter.value.id);
  return currentIndex > 0;
});

const hasNextChapter = computed(() => {
  const currentIndex = chapters.value.findIndex(c => c.id === currentChapter.value.id);
  return currentIndex < chapters.value.length - 1;
});

const { currentPage, totalPages } = toRefs(defineProps<Props>().pageInfo!);
</script>

<style scoped>
.chapter-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.chapter-navigation.page {
  position: sticky;
  top: 70px;
  z-index: 10;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 600;
  color: #333;
}

.nav-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-label {
  font-size: 0.875rem;
}

.chapter-info {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #333;
}

.page-info {
  font-size: 0.9375rem;
  color: #666;
}
</style>
