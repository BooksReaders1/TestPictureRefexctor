<template>
  <div class="page-navigation">
    <button
      class="page-btn prev"
      :disabled="currentPage <= 1"
      @click="$emit('prev-chapter')"
    >
      上一页
    </button>

    <div class="page-info">
      第 {{ currentPage }} / {{ totalPages }} 页
    </div>

    <button
      class="page-btn next"
      :disabled="currentPage >= totalPages"
      @click="$emit('next-chapter')"
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

withDefaults(defineProps<Props>(), {
  currentPage: 1,
  totalPages: 1
});

defineEmits<Emits>();
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
