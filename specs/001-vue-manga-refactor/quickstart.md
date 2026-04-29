# Vue漫画查看器重构 - 快速开始指南

**日期**: 2026-04-29  
**版本**: 1.0.0

## 项目概述

本项目将现有的纯HTML/JavaScript漫画查看器重构为现代化的Vue.js应用，采用Vue 3、TypeScript、Vue Router、Pinia等技术栈，保持所有现有功能的同时，优化性能和用户体验。

## 技术栈

- **框架**: Vue 3.3+
- **语言**: TypeScript 5.0+
- **构建工具**: Vite 4.4+
- **路由**: Vue Router 4.2+
- **状态管理**: Pinia 2.1+
- **UI库**: 原生Vue组件 + Tailwind CSS
- **图片处理**: Canvas API
- **下载**: JSZip 3.10+
- **测试**: Vitest + Vue Test Utils + Playwright

## 快速开始

### 1. 环境要求

- Node.js 16.0+
- npm 8.0+ 或 yarn 1.22+
- 现代浏览器（Chrome 90+, Firefox 88+, Safari 14+, Edge 90+）

### 2. 项目初始化

```bash
# 克隆项目
git clone <repository-url>
cd Vue-Manga-Viewer

# 安装依赖
npm install

# 或使用 yarn
yarn install
```

### 3. 开发环境

```bash
# 启动开发服务器
npm run dev

# 或使用 yarn
yarn dev
```

开发服务器将在 `http://localhost:5173` 启动。

### 4. 构建项目

```bash
# 构建生产版本
npm run build

# 或使用 yarn
yarn build
```

构建产物将输出到 `dist/` 目录。

### 5. 运行测试

```bash
# 运行单元测试
npm run test:unit

# 运行端到端测试
npm run test:e2e

# 运行所有测试
npm run test
```

## 项目结构

```
src/
├── components/          # 组件
│   ├── common/         # 通用组件
│   ├── manga/         # 漫画相关组件
│   └── image/         # 图片相关组件
├── stores/            # Pinia状态管理
├── services/          # 业务服务
├── types/            # TypeScript类型定义
├── utils/            # 工具函数
├── router/           # 路由配置
└── views/            # 页面组件

tests/
├── unit/             # 单元测试
├── e2e/              # 端到端测试
└── components/       # 组件测试

public/               # 静态资源
```

## 核心功能

### 1. 漫画浏览

- 输入漫画ID获取漫画信息
- 浏览章节列表
- 逐页阅读漫画
- 章节间导航

### 2. 图片处理

- 自动处理切片图片
- MD5解密算法
- 响应式图片显示
- 图片懒加载

### 3. 用户体验

- 悬浮菜单
- 拖拽功能
- 加载动画
- 错误提示

### 4. 下载功能

- 章节导出为ZIP
- 下载进度显示
- iOS/Safari适配

## 开发指南

### 组件开发

```vue
<!-- 示例组件 -->
<template>
  <div class="manga-viewer">
    <h1>{{ manga.title }}</h1>
    <ChapterList 
      :chapters="chapters" 
      @chapter-select="handleChapterSelect"
    />
    <ImageContainer 
      v-if="currentChapter"
      :images="currentChapter.images"
      @load="handleImageLoad"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ChapterList from './ChapterList.vue';
import ImageContainer from './ImageContainer.vue';

const manga = ref<Manga | null>(null);
const chapters = ref<Chapter[]>([]);
const currentChapter = ref<Chapter | null>(null);

const handleChapterSelect = (chapter: Chapter) => {
  currentChapter.value = chapter;
};

const handleImageLoad = (image: HTMLImageElement) => {
  // 处理图片加载
};
</script>
```

### 状态管理

```typescript
// stores/manga.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMangaStore = defineStore('manga', () => {
  const manga = ref<Manga | null>(null);
  const chapters = ref<Chapter[]>([]);
  const currentChapter = ref<Chapter | null>(null);
  const currentPage = ref(1);
  
  const fetchManga = async (id: string) => {
    // 获取漫画信息
  };
  
  const setCurrentChapter = (chapter: Chapter) => {
    currentChapter.value = chapter;
    currentPage.value = 1;
  };
  
  return {
    manga,
    chapters,
    currentChapter,
    currentPage,
    fetchManga,
    setCurrentChapter,
  };
});
```

### API服务

```typescript
// services/api.ts
class APIService {
  private baseURL = 'https://api.example.com';
  
  async fetchManga(id: string): Promise<Manga> {
    const response = await fetch(`${this.baseURL}/album?id=${id}`);
    return response.json();
  }
  
  async fetchChapters(mangaId: string): Promise<Chapter[]> {
    const response = await fetch(`${this.baseURL}/album/chapter?mangaId=${mangaId}`);
    return response.json();
  }
}
```

## 配置说明

### Vite配置

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
```

### TypeScript配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "jsx": "preserve",
    "esModuleInterop": true,
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

## 部署

### 静态部署

```bash
# 构建静态文件
npm run build

# 部署到服务器
scp -r dist/* user@server:/var/www/manga-viewer
```

### Nginx配置

```nginx
server {
  listen 80;
  server_name manga-viewer.example.com;
  
  root /var/www/manga-viewer;
  index index.html;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
  
  # API代理
  location /api/ {
    proxy_pass http://backend-server:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

## 常见问题

### Q: 如何添加新的漫画源？

A: 在 `services/api.ts` 中添加新的API客户端，并在组件中使用。

### Q: 如何自定义主题？

A: 修改 `src/assets/css/theme.css` 文件，或使用CSS变量。

### Q: 如何优化图片加载性能？

A: 调整 `src/utils/imageProcessor.ts` 中的配置参数。

### Q: 如何添加新的测试用例？

A: 在 `tests/unit/` 目录下添加新的测试文件。

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

## 许可证

MIT License

## 支持

如有问题，请创建 Issue 或联系开发团队。