<template>
  <div v-if="visible" class="error-toast" @click="handleDismiss">
    <span class="error-message">{{ message }}</span>
    <button class="close-btn" @click.stop="handleDismiss">×</button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string;
  visible: boolean;
}

interface Emits {
  (e: 'dismiss'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const handleDismiss = () => {
  emit('dismiss');
};
</script>

<style scoped>
.error-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #f44336;
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  z-index: 9999;
  animation: slideIn 0.3s ease-out;
  cursor: pointer;
}

.error-message {
  flex: 1;
  font-size: 14px;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  opacity: 0.8;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
