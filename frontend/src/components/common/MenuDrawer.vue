<template>
  <div class="menu-drawer">
    <div class="drawer-content">
      <div class="drawer-header">
        <h2 class="drawer-title">菜单</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
      <div class="drawer-items">
        <slot name="menu-items"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  visible: boolean;
}

interface Emits {
  (e: 'close'): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<style scoped>
.menu-drawer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}

.menu-drawer.active {
  opacity: 1;
  pointer-events: auto;
}

.drawer-content {
  width: 300px;
  max-width: 100%;
  height: 60%;
  background: white;
  border-radius: 20px 20px 0 0;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.drawer-title {
  font-size: 1.25rem;
  margin: 0;
  color: #333;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #999;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #666;
}

.drawer-items {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.drawer-items :deep(.menu-item) {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  margin: 0.5rem 0;
  background: #f8f9fa;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  color: #333;
  font-size: 1rem;
  font-weight: 500;
}

.drawer-items :deep(.menu-item:hover) {
  background: #e9ecef;
  transform: translateX(4px);
}

.drawer-items :deep(.item-icon) {
  font-size: 1.25rem;
}

.drawer-items :deep(.item-text) {
  flex: 1;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>
