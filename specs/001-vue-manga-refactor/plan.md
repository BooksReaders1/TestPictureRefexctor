# Implementation Plan: Vue漫画查看器重构

**Branch**: `001-vue-manga-refactor` | **Date**: 2026-04-29 | **Spec**: [link](./spec.md)
**Input**: Feature specification from `/specs/001-vue-manga-refactor/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

将现有的纯HTML/JavaScript漫画查看器重构为现代化的Vue.js应用，采用Vue 3、TypeScript、Vue Router、Pinia等技术栈，保持所有现有功能的同时，优化性能和用户体验。项目将完全基于前端实现，不使用后端技术。

## Technical Context

**Language/Version**: TypeScript 5.0+ | Vue 3.3+  
**Primary Dependencies**: Vue 3, Vue Router 4.2+, Pinia 2.1+, Vite 4.4+, JSZip 3.10+, MD5库  
**Storage**: N/A (纯前端应用，使用内存状态)  
**Testing**: Vitest, Vue Test Utils  
**Target Platform**: Web浏览器 (Chrome, Firefox, Safari, Edge)  
**Project Type**: Web应用  
**Performance Goals**: 页面加载时间<3秒，图片处理时间<500ms，支持50+图片流畅浏览  
**Constraints**: 最大100页限制，<100MB内存使用，支持移动端和桌面端  
**Scale/Scope**: 单页面应用，组件化架构，支持所有主流浏览器

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **架构一致性**: 使用Vue生态系统最佳实践，采用组合式API
2. **性能要求**: 满足页面加载和图片处理性能指标
3. **兼容性**: 保持与现有CDN和图片处理逻辑的兼容性
4. **技术栈**: 采用现代化前端技术栈，确保可维护性

## Phase 0: Research & Planning

### Research Tasks

1. **Vue 3 + TypeScript最佳实践**
   - 研究Vue 3组合式API的使用模式
   - TypeScript类型定义的最佳实践
   - 性能优化策略

2. **图片处理方案**
   - 保持现有MD5切片算法的实现
   - Canvas API在Vue中的使用
   - 图片加载优化策略

3. **状态管理方案**
   - Pinia vs Vuex对比（已选择Pinia）
   - 状态结构设计
   - 持久化策略

4. **路由和导航**
   - Vue Router配置
   - 路由守卫和权限控制
   - 导航状态管理

5. **构建工具配置**
   - Vite配置优化
   - 开发环境设置
   - 生产环境构建

### Findings Consolidation

**research.md** 将包含所有技术决策和实现指导。

## Phase 1: Design & Implementation

### 数据模型设计

**data-model.md** 将定义以下实体：

```typescript
interface Manga {
  id: string;
  title: string;
  chapters: Chapter[];
  coverImage?: string;
}

interface Chapter {
  id: string;
  title: string;
  order: number;
  page_count: number;
  images: Image[];
}

interface Image {
  id: string;
  url: string;
  index: number;
  processed: boolean;
  scramble_params?: {
    aid: string;
    offset: string;
  };
}

interface AppState {
  currentManga?: Manga;
  currentChapter?: Chapter;
  currentPage: number;
  isLoading: boolean;
  error?: string;
}
```

### 接口契约

**contracts/** 目录将包含：

1. **API接口契约**
   - JMComic API调用规范
   - 认证机制
   - 错误处理

2. **UI组件契约**
   - 组件props和events
   - 组件状态管理

### 快速开始指南

**quickstart.md** 将提供：
- 开发环境设置
- 项目结构说明
- 运行和构建指令
- 基本使用示例

## Project Structure

```text
src/
├── components/
│   ├── common/
│   │   ├── LoadingSpinner.vue      # 加载动画
│   │   ├── ErrorToast.vue         # 错误提示
│   │   └── FloatingMenu.vue       # 悬浮菜单
│   ├── manga/
│   │   ├── MangaList.vue          # 漫画列表
│   │   ├── ChapterList.vue        # 章节列表
│   │   ├── MangaViewer.vue        # 漫画查看器
│   │   └── ChapterNavigation.vue  # 章节导航
│   └── image/
│       ├── ImageProcessor.vue     # 图片处理组件
│       └── LazyImage.vue          # 懒加载图片
├── stores/
│   ├── manga.ts                  # 漫画状态管理
│   ├── chapter.ts                # 章节状态管理
│   └── app.ts                    # 应用全局状态
├── services/
│   ├── api.ts                    # API服务
│   ├── imageProcessor.ts         # 图片处理服务
│   └── downloadService.ts        # 下载服务
├── types/
│   ├── manga.ts                 # 类型定义
│   └── api.ts                   # API类型
├── utils/
│   ├── imageProcessor.ts        # 图片处理工具
│   └── md5.ts                  # MD5计算工具
├── router/
│   └── index.ts                # 路由配置
└── views/
    ├── HomeView.vue            # 首页
    └── MangaView.vue          # 漫画详情页

public/
├── index.html                 # 入口HTML
└── favicon.ico

tests/
├── unit/                      # 单元测试
├── e2e/                       # 端到端测试
└── components/               # 组件测试

vite.config.ts                # Vite配置
tsconfig.json                 # TypeScript配置
package.json                  # 依赖管理
README.md                     # 项目说明
```

**Structure Decision**: 采用组件化架构，按功能模块组织代码，确保代码复用性和可维护性。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| 多组件架构 | 需要管理复杂的图片处理和UI状态 | 单组件会导致代码难以维护和扩展 |
| Pinia状态管理 | 需要跨组件共享状态（如当前章节、页面） | 使用props传递会导致组件间耦合过紧 |

## Implementation Steps

### Phase 1: 基础架构搭建
1. 初始化Vue 3 + TypeScript项目
2. 配置Vite和开发环境
3. 设置路由和状态管理
4. 创建基础组件结构

### Phase 2: 核心功能实现
1. 实现漫画信息获取和显示
2. 实现章节列表和导航
3. 实现图片加载和显示
4. 保持现有图片处理逻辑

### Phase 3: UI/UX优化
1. 实现悬浮菜单和抽屉
2. 优化响应式布局
3. 添加加载状态和错误处理
4. 实现拖拽功能

### Phase 4: 高级功能
1. 实现ZIP下载功能
2. 添加图片预加载
3. 优化性能和内存使用
4. 添加测试用例

### Phase 5: 部署和优化
1. 构建生产版本
2. 性能优化
3. 浏览器兼容性测试
4. 文档完善