<template>
  <div class="image-container">
    <div
      v-for="(image, index) in images"
      :key="image.id"
      class="image-wrapper"
      ref="imageWrappers"
    >
      <!-- Placeholder for empty state -->
      <div v-if="!image.processed" class="image-placeholder">
        <div class="placeholder-text">第 {{ index + 1 }} 页</div>
      </div>

      <!-- Image -->
      <img
        v-else
        :src="image.url"
        :alt="`第 ${index + 1} 页`"
        class="page-image"
        :style="{
          maxWidth: '100%',
          height: 'auto',
          display: 'block',
          margin: '0 auto'
        }"
        loading="lazy"
        @load="handleImageLoad(image, index)"
        @error="handleImageError(image, index)"
      />
    </div>

    <div v-if="loadingCount > 0" class="loading-indicator">
      <div class="spinner"></div>
      <span class="loading-text">加载中... ({{ loadingCount }})</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, toRefs } from 'vue';
import type { Image } from '@/types';
import { useImageProcessor } from '@/composables/useImageProcessor';

interface Props {
  images: Image[];
  currentPage: number;
}

interface Emits {
  (e: 'page-change', page: number): void;
}

withDefaults(defineProps<Props>(), {
  currentPage: 1
});

defineEmits<Emits>();

const imageWrappers = ref<HTMLElement[]>([]);
const loadingCount = ref(0);
const processedCount = ref(0);

const {
  isProcessing,
  processImageOnLoad,
  loadImageWithRetry,
  preloadImages
} = useImageProcessor();

const handleImageLoad = async (image: Image, index: number) => {
  if (image.processed) return;

  loadingCount.value++;
  try {
    await processImageOnLoad(
      imageWrappers.value[index]?.querySelector('img') as HTMLImageElement || new Image(),
      image
    );
    processedCount.value++;
  } finally {
    loadingCount.value--;
  }

  // Emit page change if current page image loaded
  if (index + 1 === (image.url.match(/pageId=/g) || [])[0]?.length || index === currentPage - 1) {
    // Simple page change detection
    if (index + 1 === currentPage) {
      emit('page-change', index + 1);
    }
  }
};

const handleImageError = (image: Image, index: number) => {
  console.error(`Failed to load image ${image.id}:`, image);
  // TODO: Implement retry logic
};

// Load current page and preload surrounding pages
onMounted(() => {
  if (images.length === 0) return;

  // Load current page image
  loadImageWithRetry(images[currentPage - 1]).catch(err => {
    console.error('Failed to load current page:', err);
  });

  // Preload surrounding pages
  preloadImages(images, currentPage - 1);
});
</script>

<style scoped>
.image-container {
  width: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem 0;
}

.image-wrapper {
  width: 100%;
  max-width: 800px;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  width: 100%;
  height: 300px;
  background: #f0f0f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-text {
  color: #999;
  font-size: 1.125rem;
}

.page-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.page-image:hover {
  transform: scale(1.02);
}

.loading-indicator {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 0.875rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, 10px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}
</style>
