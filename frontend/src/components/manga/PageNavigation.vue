<template>
  <div class="page-navigation" role="navigation" aria-label="页面导航">
    <button
      class="page-btn prev"
      :disabled="currentPage <= 1"
      @click="$emit('prev-chapter')"
      @keydown="handleKeyDown"
      aria-label="上一页"
    >
      上一页
    </button>

    <div class="page-info" role="status" aria-live="polite">
      第 {{ currentPage }} / {{ totalPages }} 页
    </div>

    <button
      class="page-btn next"
      :disabled="currentPage >= totalPages"
      @click="$emit('next-chapter')"
      @keydown="handleKeyDown"
      aria-label="下一页"
    >
      下一页
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentPage: number;
  totalPages: number;
}

interface Emits {
  (e: 'prev-chapter'): void;
  (e: 'next-chapter'): void;
}

const emit = defineEmits<Emits>();

const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowLeft':
    case 'Home':
      if (currentPage > 1) {
        emit('prev-chapter');
      }
      break;
    case 'ArrowRight':
    case 'End':
      if (currentPage < totalPages) {
        emit('next-chapter');
      }
      break;
  }
};

withDefaults(defineProps<Props>(), {
  currentPage: 1,
  totalPages: 1
});
</script>

<style scoped>
.page-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 1rem 0;
}

.page-btn {
  padding: 0.625rem 1.5rem;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 600;
  color: #333;
}

.page-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.9375rem;
  color: #666;
  font-weight: 500;
}
</style>
