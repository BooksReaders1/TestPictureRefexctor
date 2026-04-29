<template>
  <div v-if="manga" class="manga-info">
    <div class="manga-cover" @click="$emit('select')">
      <div class="cover-content">
        <div class="cover-id">ID: {{ manga.id }}</div>
      </div>
    </div>
    <div class="manga-details">
      <h2 class="manga-title">{{ manga.title }}</h2>
      <p class="manga-author" v-if="manga.author">{{ manga.author }}</p>
      <p class="manga-description" v-if="manga.description">{{ manga.description }}</p>
      <div class="manga-stats">
        <span class="stat-item">
          <span class="stat-icon">📚</span>
          {{ manga.chapterCount }} 章
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Manga } from '@/types';

interface Props {
  manga: Manga;
}

interface Emits {
  (e: 'select'): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<style scoped>
.manga-info {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.manga-info:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.manga-cover {
  width: 140px;
  height: 190px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.cover-content {
  text-align: center;
  color: white;
}

.cover-id {
  font-weight: 700;
  font-size: 0.75rem;
  padding: 0.5rem;
}

.manga-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.manga-title {
  font-size: 1.25rem;
  margin: 0 0 0.5rem 0;
  color: #333;
}

.manga-author {
  color: #666;
  margin: 0 0 0.5rem 0;
}

.manga-description {
  color: #888;
  font-size: 0.875rem;
  margin: 0 0 0.75rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.manga-stats {
  display: flex;
  gap: 1rem;
  margin: 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

.stat-icon {
  font-size: 1.125rem;
}
</style>
