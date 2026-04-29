<template>
  <div class="chapter-list">
    <div
      v-for="chapter in chapters"
      :key="chapter.id"
      class="chapter-item"
      :class="{ active: currentChapterId === chapter.id }"
      @click="$emit('chapter-select', chapter)"
    >
      <span class="chapter-number">第 {{ chapter.order }} 章</span>
      <span class="chapter-title">{{ chapter.title }}</span>
      <span class="chapter-pages">{{ chapter.page_count }} 页</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Chapter } from '@/types';

interface Props {
  chapters: Chapter[];
  currentChapterId?: string;
}

interface Emits {
  (e: 'chapter-select', chapter: Chapter): void;
}

withDefaults(defineProps<Props>(), {
  currentChapterId: ''
});

defineEmits<Emits>();
</script>

<style scoped>
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
</style>
