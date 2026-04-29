# TestPictureRefactor

Vue 3 + TypeScript 重构版本的漫画查看器应用，支持图片处理、下载等功能。

## 技术栈

- **框架**: Vue 3.3+
- **语言**: TypeScript 5.0+
- **构建工具**: Vite 4.4+
- **路由**: Vue Router 4.2+
- **状态管理**: Pinia 2.1+
- **UI 库**: 原生 Vue 组件 + Tailwind CSS 风格
- **图片处理**: Canvas API
- **下载**: JSZip 3.10+
- **MD5**: md5 库

## 功能特性

### 已实现功能
- ✅ 漫画搜索和显示
- ✅ 章节列表和导航
- ✅ 逐页浏览和导航
- ✅ 图片加载和处理（MD5 切片）
- ✅ 懒加载和预加载
- ✅ 悬浮菜单和抽屉
- ✅ 下载章节为 ZIP
- ✅ 错误处理和提示
- ✅ 响应式设计
- ✅ 键盘导航支持
- ✅ ARIA 无障碍属性

### 核心功能
1. **漫画浏览**
   - 输入漫画 ID 获取漫画信息
   - 浏览章节列表
   - 逐页阅读漫画
   - 章节间导航

2. **图片处理**
   - MD5 切片计算
   - 图片切片和重组
   - Canvas 处理
   - 错误重试
   - 响应式缩放

3. **用户体验**
   - 悬浮菜单和拖拽
   - 侧边抽屉菜单
   - Toast 提示
   - 加载动画

4. **下载功能**
   - 章节 ZIP 导出
   - 下载进度显示
   - iOS/Safari 适配

## 快速开始

### 环境要求

- Node.js 16.0+
- npm 8.0+ 或 yarn 1.22+

### 安装依赖

```bash
npm install
# 或使用 yarn
yarn install
```

### 开发模式

```bash
npm run dev
# 或使用 yarn
yarn dev
```

开发服务器将在 `http://localhost:5173` 启动。

### 构建生产版本

```bash
npm run build
# 或使用 yarn
yarn build
```

构建产物将输出到 `dist/` 目录。

### 预览生产构建

```bash
npm run preview
# 或使用 yarn
yarn preview
```

## 项目结构

```
frontend/
├── src/
│   ├── components/      # 组件
│   │   ├── common/      # 通用组件
│   │   ├── manga/      # 漫画相关组件
│   │   └── image/      # 图片相关组件
│   ├── stores/         # Pinia 状态管理
│   ├── services/       # 业务服务
│   ├── types/          # TypeScript 类型定义
│   ├── utils/          # 工具函数
│   ├── router/         # 路由配置
│   ├── composables/    # 组合式函数
│   ├── views/          # 页面组件
│   └── assets/         # 静态资源
├── public/              # 静态资源
├── tests/              # 测试文件
│   ├── unit/          # 单元测试
│   ├── e2e/           # 端到端测试
│   └── components/     # 组件测试
├── index.html          # 入口 HTML
├── package.json        # 依赖配置
├── vite.config.ts      # Vite 配置
├── tsconfig.json       # TypeScript 配置
├── .eslintrc.cjs       # ESLint 配置
├── .prettierrc         # Prettier 配置
└── README.md           # 项目说明
```

## API 集成

应用使用 JMComic API 进行漫画数据的获取。主要端点包括：
- `GET /api/album` - 获取漫画信息
- `GET /api/album/chapter` - 获取章节信息
- `GET /api/image/info` - 获取图片信息

详细信息请参考 `../specs/001-vue-manga-refactor/contracts/api.md`

## 漫画 ID 格式

漫画 ID 格式为 6-20 个字符的字符串。输入后应用会自动获取漫画信息并显示章节列表。

## 图片 CDN

应用从 CDN 加载图片：
```
https://cdn-msp.jm18c-uoe.cc/media/photos/{mangaId}/{pageId}.webp
```

## 运行测试

```bash
# 运行单元测试
npm run test:unit
# 或使用 yarn
yarn test:unit

# 运行端到端测试
npm run test:e2e
# 或使用 yarn
yarn test:e2e

# 运行所有测试
npm run test
# 或使用 yarn
yarn test
```

## 配置说明

### Vite 配置

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    outDir: 'dist',
  },
  server: {
    port: 5173,
    open: true,
  },
});
```

### TypeScript 配置

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
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 开发规范

### 组件开发

```vue
<template>
  <div class="my-component">
    <slot name="content"></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  optional?: number;
}

interface Emits {
  (e: 'update', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  optional: 0
});

const emit = defineEmits<Emits>();

const handleUpdate = () => {
  emit('update', 'new value');
};
</script>

<style scoped>
.my-component {
  padding: 1rem;
  background: #f5f5f5;
}
</style>
```

### 状态管理

```typescript
// stores/manga.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Manga, Chapter } from '@/types';

export const useMangaStore = defineStore('manga', () => {
  const manga = ref<Manga | null>(null);
  const currentChapter = ref<Chapter | null>(null);
  const currentPage = ref(1);

  const setCurrentChapter = (chapter: Chapter) => {
    currentChapter.value = chapter;
    currentPage.value = 1;
  };

  return {
    manga,
    currentChapter,
    currentPage,
    setCurrentChapter
  };
});
```

## 性能指标

- 页面加载时间 < 3秒
- 图片处理时间 < 500ms
- 支持至少 50 张图片的流畅浏览
- 内存使用 < 100MB

## 浏览器兼容性

支持所有现代浏览器：
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 许可证

MIT License

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 联系方式

如有问题或建议，请创建 Issue 或提交 Pull Request。

---

**Version**: 1.0.0
**Last Updated**: 2026-04-29
