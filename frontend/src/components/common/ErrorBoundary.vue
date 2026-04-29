<template>
  <div v-if="error" class="error-boundary">
    <div class="error-content">
      <div class="error-icon">⚠</div>
      <h2 class="error-title">出错了</h2>
      <p class="error-message">{{ error.message }}</p>
      <button class="retry-btn" @click="retry">重试</button>
      <button class="home-btn" @click="goHome">返回首页</button>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

interface Props {
  fallback?: any;
}

interface Emits {
  (e: 'error', error: Error): void;
}

const props = withDefaults(defineProps<Props>(), {
  fallback: null
});

const emit = defineEmits<Emits>();

const error = ref<Error | null>(null);
const hasError = ref(false);
const router = useRouter();

const handleError = (error: Error) => {
  console.error('ErrorBoundary caught an error:', error);
  error.value = error;
  hasError.value = true;
  emit('error', error);
};

const retry = () => {
  error.value = null;
  hasError.value = false;
  window.location.reload();
};

const goHome = () => {
  router.push('/');
};

// Global error handler
onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      handleError(event.error as Error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      handleError(event.reason as Error);
    });
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('error', () => {});
    window.removeEventListener('unhandledrejection', () => {});
  }
});
</script>

<style scoped>
.error-boundary {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  z-index: 9999;
}

.error-content {
  max-width: 500px;
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
  color: #333;
}

.error-message {
  color: #666;
  margin: 0 0 2rem 0;
  line-height: 1.6;
}

.retry-btn,
.home-btn {
  padding: 0.75rem 1.5rem;
  margin: 0.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn {
  background: #667eea;
  color: white;
}

.retry-btn:hover {
  background: #5568d3;
}

.home-btn {
  background: #e0e0e0;
  color: #333;
}

.home-btn:hover {
  background: #d0d0d0;
}
</style>
