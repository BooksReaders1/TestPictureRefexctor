<template>
  <div class="manga-search">
    <div class="search-box">
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="搜索漫画..."
        @keyup.enter="$emit('search', searchQuery)"
      />
      <button class="search-btn" @click="handleSearch">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  searchQuery?: string;
}

interface Emits {
  (e: 'search', query: string): void;
  (e: 'input', query: string): void;
}

withDefaults(defineProps<Props>(), {
  searchQuery: ''
});

const emit = defineEmits<Emits>();

const searchQuery = ref('');

watch(
  () => searchQuery.value,
  (value) => {
    emit('input', value);
  }
);

const handleSearch = () => {
  emit('search', searchQuery.value);
};
</script>

<style scoped>
.manga-search {
  width: 100%;
}

.search-box {
  display: flex;
  gap: 0.5rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
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
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.search-btn:hover {
  background: #5568d3;
}
</style>
