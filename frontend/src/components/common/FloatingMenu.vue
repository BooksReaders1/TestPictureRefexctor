<template>
  <div class="floating-menu">
    <div
      class="menu-button"
      :style="{ left: position.x + 'px', top: position.y + 'px' }"
      @click="toggleMenu"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </div>

    <div v-if="visible" class="menu-drawer" role="dialog" aria-label="主菜单">
      <div class="menu-header">
        <span class="menu-title">菜单</span>
        <button class="close-btn" @click="toggleMenu" aria-label="关闭菜单">×</button>
      </div>
      <div class="menu-items">
        <div
          v-if="currentChapter"
          class="menu-item"
          role="menuitem"
          tabindex="0"
          @click="handleMenuClick('download')"
          @keydown="handleKeyDown"
        >
          <span class="item-icon" aria-hidden="true">⬇</span>
          <span class="item-text">下载章节</span>
        </div>
        <div
          class="menu-item"
          role="menuitem"
          tabindex="0"
          @click="handleMenuClick('settings')"
          @keydown="handleKeyDown"
        >
          <span class="item-icon" aria-hidden="true">⚙</span>
          <span class="item-text">设置</span>
        </div>
        <div
          class="menu-item"
          role="menuitem"
          tabindex="0"
          @click="handleMenuClick('home')"
          @keydown="handleKeyDown"
        >
          <span class="item-icon" aria-hidden="true">🏠</span>
          <span class="item-text">返回首页</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

interface Props {
  currentChapter?: any;
}

interface Emits {
  (e: 'download', chapter: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const router = useRouter();

const position = ref({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
const visible = ref(false);

const toggleMenu = () => {
  visible.value = !visible.value;
};

const handleMenuClick = (item: string) => {
  switch (item) {
    case 'download':
      emit('download', currentChapter.value);
      break;
    case 'settings':
      console.log('Settings clicked');
      break;
    case 'home':
      router.push('/');
      break;
  }
  toggleMenu();
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    const target = event.currentTarget as HTMLElement;
    if (target) {
      target.click();
    }
  }
};

// Close menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const menuDrawer = document.querySelector('.menu-drawer');
  const menuButton = document.querySelector('.menu-button');

  if (
    menuDrawer &&
    !menuDrawer.contains(event.target as Node) &&
    menuButton &&
    !menuButton.contains(event.target as Node) &&
    visible.value
  ) {
    toggleMenu();
  }
};

const handleMouseMove = (event: MouseEvent) => {
  // Allow menu button to follow mouse when dragging
  if (isDragging.value) {
    position.value = {
      x: Math.max(0, Math.min(event.clientX - 30, window.innerWidth - 60)),
      y: Math.max(0, Math.min(event.clientY - 30, window.innerHeight - 60))
    };
  }
};

const startDragging = () => {
  isDragging.value = true;
};

const stopDragging = () => {
  isDragging.value = false;
};

const isDragging = ref(false);

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('mousemove', handleMouseMove);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('mousemove', handleMouseMove);
});
</script>

<style scoped>
.floating-menu {
  position: fixed;
  z-index: 1000;
  pointer-events: none;
}

.menu-button {
  position: fixed;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  cursor: pointer;
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
  transition: transform 0.2s, box-shadow 0.2s;
  animation: bounceIn 0.3s ease-out;
}

.menu-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
}

.menu-button:active {
  transform: scale(0.95);
}

.menu-drawer {
  position: fixed;
  top: 60px;
  right: 10px;
  width: 240px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: slideIn 0.3s ease-out;
  pointer-events: auto;
}

.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  background: #f8f9fa;
}

.menu-title {
  font-weight: 600;
  color: #333;
  font-size: 0.9375rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #666;
}

.menu-items {
  padding: 0.5rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  color: #333;
  font-size: 0.9375rem;
}

.menu-item:hover {
  background: #f5f5f5;
}

.item-icon {
  font-size: 1.125rem;
}

.item-text {
  font-weight: 500;
}

@keyframes bounceIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
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
