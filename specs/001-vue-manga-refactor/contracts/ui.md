# UI 组件契约

**Date**: 2026-04-29  
**Feature**: Vue漫画查看器重构

## 概述

本文档定义了Vue漫画查看器的UI组件契约，包括组件接口、事件、状态管理和样式规范。

## 组件架构

### 组件层级结构

```
App
├── HomeView (首页)
│   └── MangaSearch (搜索组件)
│       └── SearchInput
│
├── MangaView (漫画详情)
│   ├── MangaHeader (顶部信息栏)
│   ├── ChapterList (章节列表)
│   ├── MangaViewer (漫画查看器)
│   │   ├── ChapterNavigation (章节导航)
│   │   ├── PageNavigation (页面导航)
│   │   └── ImageContainer (图片容器)
│   │       ├── LazyImage (懒加载图片)
│   │       └── ImageProcessor (图片处理)
│   └── FloatingMenu (悬浮菜单)
│       ├── MenuDrawer (抽屉菜单)
│       └── MenuItem (菜单项)
│
└── CommonComponents (通用组件)
    ├── LoadingSpinner (加载动画)
    ├── ErrorToast (错误提示)
    ├── ConfirmDialog (确认对话框)
    └── SettingsModal (设置模态框)
```

## 核心组件契约

### 1. MangaViewer (漫画查看器)

**Props**:
```typescript
interface MangaViewerProps {
  mangaId: string;              // 漫画ID
  chapterId?: string;            // 章节ID（可选）
  initialPage?: number;         // 初始页码（可选）
  theme?: 'light' | 'dark';     // 主题（可选）
}
```

**Events**:
```typescript
interface MangaViewerEmits {
  (e: 'page-change', page: number): void;     // 页面变化
  (e: 'chapter-change', chapter: Chapter): void; // 章节变化
  (e: 'download-start'): void;                // 下载开始
  (e: 'download-complete'): void;              // 下载完成
  (e: 'error', error: string): void;          // 错误发生
}
```

**Slots**: 无

### 2. ChapterNavigation (章节导航)

**Props**:
```typescript
interface ChapterNavigationProps {
  currentChapter: Chapter;     // 当前章节
  chapters: Chapter[];          // 所有章节
  mangaId: string;              // 漫画ID
}
```

**Events**:
```typescript
interface ChapterNavigationEmits {
  (e: 'prev-chapter'): void;   // 上一章
  (e: 'next-chapter'): void;   // 下一章
  (e: 'chapter-select', chapter: Chapter): void; // 选择章节
}
```

**Slots**: 
- `default`: 默认插槽，用于自定义导航按钮

### 3. ImageContainer (图片容器)

**Props**:
```typescript
interface ImageContainerProps {
  image: Image;                // 图片信息
  index: number;               // 图片索引
  processed?: boolean;        // 是否已处理
  quality?: 'high' | 'medium' | 'low'; // 图片质量
}
```

**Events**:
```typescript
interface ImageContainerEmits {
  (e: 'load', image: HTMLImageElement): void;   // 图片加载完成
  (e: 'error', error: Error): void;             // 图片加载错误
  (e: 'process-complete', canvas: HTMLCanvasElement): void; // 处理完成
}
```

**Slots**: 无

### 4. FloatingMenu (悬浮菜单)

**Props**:
```typescript
interface FloatingMenuProps {
  position: { x: number; y: number };  // 初始位置
  visible: boolean;                     // 是否可见
}
```

**Events**:
```typescript
interface FloatingMenuEmits {
  (e: 'move', position: { x: number; y: number }): void; // 移动
  (e: 'toggle', visible: boolean): void;                // 切换显示
  (e: 'menu-click', item: MenuItem): void;               // 菜单项点击
}
```

**Slots**:
- `trigger`: 触发按钮插槽
- `menu`: 菜单内容插槽

### 5. ChapterList (章节列表)

**Props**:
```typescript
interface ChapterListProps {
  mangaId: string;              // 漫画ID
  chapters: Chapter[];          // 章节数据
  currentChapterId?: string;    // 当前章节ID（可选）
}
```

**Events**:
```typescript
interface ChapterListEmits {
  (e: 'chapter-select', chapter: Chapter): void; // 选择章节
}
```

**Slots**: 
- `empty`: 空状态插槽

## 状态管理

### 组件状态共享

所有组件状态通过Pinia Store管理：

```typescript
// stores/manga.ts
export const useMangaStore = defineStore('manga', {
  state: () => ({
    manga: null as Manga | null,
    chapters: [] as Chapter[],
    currentChapter: null as Chapter | null,
    currentPage: 1,
    isLoading: false,
    error: null as string | null,
    loadingProgress: 0,
    settings: {
      theme: 'light',
      imageQuality: 'high',
      preloadCount: 2,
      maxConcurrent: 5,
    }
  }),
  
  getters: {
    // ...
  },
  
  actions: {
    // ...
  }
})
```

### 状态更新规范

```typescript
// 组件中使用
const mangaStore = useMangaStore();

// 更新状态
mangaStore.setCurrentChapter(chapter);
mangaStore.setCurrentPage(page);
mangaStore.setLoading(true);
```

## 事件总线

### 全局事件定义

```typescript
// utils/eventBus.ts
const eventBus = {
  // 页面导航事件
  onPageChange: createEventHook<number>(),
  onChapterChange: createEventHook<Chapter>(),
  
  // 加载事件
  onLoadingStart: createEventHook<void>(),
  onLoadingEnd: createEventHook<void>(),
  
  // 错误事件
  onError: createEventHook<string>(),
  
  // 下载事件
  onDownloadProgress: createEventHook<number>(),
  onDownloadComplete: createEventHook<void>(),
};
```

### 事件使用示例

```typescript
// 组件中发送事件
eventBus.onPageChange.trigger(page);

// 组件中监听事件
eventBus.onPageChange.on(page => {
  // 处理页面变化
});
```

## 样式规范

### CSS变量定义

```css
:root {
  /* 颜色 */
  --primary-color: #2c3e50;
  --secondary-color: #3498db;
  --success-color: #2ecc71;
  --error-color: #e74c3c;
  --warning-color: #f39c12;
  
  /* 间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* 字体 */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  
  /* 圆角 */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 16px;
  
  /* 阴影 */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.2);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.3);
}
```

### 响应式断点

```css
/* 移动端 */
@media (max-width: 768px) {
  --header-height: 56px;
  --menu-width: 280px;
}

/* 平板端 */
@media (min-width: 769px) and (max-width: 1024px) {
  --header-height: 64px;
  --menu-width: 320px;
}

/* 桌面端 */
@media (min-width: 1025px) {
  --header-height: 72px;
  --menu-width: 360px;
}
```

### 组件样式类

```css
/* 基础样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-family: var(--font-family);
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--secondary-color);
}

/* 加载动画 */
.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 图片容器 */
.image-container {
  position: relative;
  width: 100%;
  background-color: #f0f0f0;
  overflow: hidden;
}

.image-container img {
  display: block;
  width: 100%;
  height: auto;
}
```

## 交互规范

### 用户交互流程

1. **页面加载**
   - 显示加载动画
   - 获取漫画信息
   - 显示漫画标题和章节列表

2. **章节选择**
   - 点击章节项
   - 加载章节图片
   - 显示第一页

3. **图片浏览**
   - 滚动到下一页
   - 自动加载图片
   - 处理切片图片
   - 显示完整图片

4. **章节切换**
   - 点击导航按钮
   - 保存当前进度
   - 加载新章节
   - 恢复浏览位置

### 错误处理

```typescript
// 错误提示组件
<ErrorToast
  v-if="error"
  :message="error"
  @retry="retryOperation"
  @dismiss="dismissError"
/>

// 错误处理逻辑
const handleError = (error: string) => {
  mangaStore.setError(error);
  eventBus.onError.trigger(error);
  
  // 显示错误提示
  showToast(error, 'error');
  
  // 自动重试
  if (shouldRetry(error)) {
    setTimeout(retryOperation, 1000);
  }
};
```

## 无障碍访问

### 键盘导航

```typescript
// 组件支持键盘导航
const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowLeft':
      handlePrevPage();
      break;
    case 'ArrowRight':
      handleNextPage();
      break;
    case 'ArrowUp':
      handlePrevChapter();
      break;
    case 'ArrowDown':
      handleNextChapter();
      break;
  }
};
```

### ARIA属性

```html
<button
  aria-label="上一章"
  aria-disabled="!hasPrevChapter"
  @click="handlePrevChapter"
>
  &lt;
</button>
```

## 性能优化

### 虚拟滚动

对于长列表章节列表，使用虚拟滚动：

```html
<VirtualList
  :items="chapters"
  :item-height="60"
  :buffer="10"
>
  <template #default="{ item }">
    <ChapterItem :chapter="item" />
  </template>
</VirtualList>
```

### 图片懒加载

```html
<LazyImage
  v-if="!image.processed"
  :src="image.url"
  :alt="`Page ${index + 1}`"
  @load="handleImageLoad"
  @error="handleImageError"
/>
```

### 组件懒加载

```typescript
const ChapterList = defineAsyncComponent(() => 
  import('./ChapterList.vue')
);
```

## 测试规范

### 单元测试

```typescript
// MangaViewer.spec.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import MangaViewer from '@/components/MangaViewer.vue';

describe('MangaViewer', () => {
  it('renders manga title', () => {
    const wrapper = mount(MangaViewer, {
      props: { mangaId: '123' },
    });
    expect(wrapper.text()).toContain('漫画标题');
  });

  it('emits page-change event', async () => {
    const wrapper = mount(MangaViewer, {
      props: { mangaId: '123' },
    });
    await wrapper.find('.next-page').trigger('click');
    expect(wrapper.emitted('page-change')).toBeTruthy();
  });
});
```

### E2E测试

```typescript
// manga-viewer.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Manga Viewer', () => {
  test('should navigate through chapters', async ({ page }) => {
    await page.goto('/manga/123');
    
    // 等待章节加载
    await page.waitForSelector('.chapter-list');
    
    // 选择章节
    await page.click('.chapter-item:first-child');
    
    // 验证页面加载
    await page.waitForSelector('.image-container');
    
    // 翻页
    await page.click('.next-page');
    
    // 验证页面变化
    expect(page.locator('.page-number').textContent()).toBe('2');
  });
});
```