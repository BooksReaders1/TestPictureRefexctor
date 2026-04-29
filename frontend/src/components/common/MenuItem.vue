<template>
  <div class="menu-item" @click="$emit('click')">
    <span class="item-icon">{{ icon }}</span>
    <span class="item-text">{{ text }}</span>
    <slot name="extra"></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string;
  text: string;
}

interface Emits {
  (e: 'click'): void;
}

withDefaults(defineProps<Props>(), {});
defineEmits<Emits>();
</script>

<style scoped>
.menu-item {
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

.menu-item:hover {
  background: #e9ecef;
  transform: translateX(4px);
}

.item-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.item-text {
  flex: 1;
}
</style>
