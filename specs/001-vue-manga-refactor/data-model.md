# Data Model: Vue漫画查看器重构

**Date**: 2026-04-29  
**Feature**: Vue漫画查看器重构

## Entities and Relationships

### Core Entities

#### 1. Manga (漫画实体)

```typescript
interface Manga {
  id: string;                    // 漫画唯一标识符
  title: string;                 // 漫画标题
  author?: string;               // 作者（可选）
  description?: string;          // 简介（可选）
  coverImage?: string;           // 封面图片URL
  chapterCount: number;          // 章节总数
  chapters: Chapter[];           // 章节数组
  createdAt?: Date;              // 创建时间（可选）
  updatedAt?: Date;              // 更新时间（可选）
}
```

**Validation Rules**:
- `id`: 必填，字符串类型，长度6-20字符
- `title`: 必填，字符串类型，最大100字符
- `chapterCount`: 必填，数字类型，大于0
- `chapters`: 必填，数组类型，长度与chapterCount一致

#### 2. Chapter (章节实体)

```typescript
interface Chapter {
  id: string;                    // 章节唯一标识符
  mangaId: string;               // 所属漫画ID
  title: string;                 // 章节标题
  order: number;                // 章节顺序
  page_count: number;            // 页面数量
  images: Image[];               // 图片数组
  createdAt?: Date;              // 创建时间（可选）
}
```

**Validation Rules**:
- `id`: 必填，字符串类型
- `mangaId`: 必填，字符串类型，关联Manga.id
- `title`: 必填，字符串类型
- `order`: 必填，数字类型，从1开始递增
- `page_count`: 必填，数字类型，大于0，小于等于100
- `images`: 必填，数组类型，长度等于page_count

#### 3. Image (图片实体)

```typescript
interface Image {
  id: string;                    // 图片唯一标识符
  chapterId: string;             // 所属章节ID
  url: string;                   // 图片URL
  index: number;                 // 图片序号（从0开始）
  processed: boolean;           // 是否已处理
  scrambleParams?: {             // 解密参数（可选）
    aid: string;                 // 章节ID
    offset: string;              // 偏移量
  };
  width?: number;                // 图片宽度（可选）
  height?: number;               // 图片高度（可选）
  fileSize?: number;            // 文件大小（可选）
}
```

**Validation Rules**:
- `id`: 必填，字符串类型
- `chapterId`: 必填，字符串类型，关联Chapter.id
- `url`: 必填，URL格式字符串
- `index`: 必填，数字类型，0到page_count-1
- `processed`: 必填，布尔类型
- `scrambleParams`: 可选对象类型

#### 4. AppState (应用状态)

```typescript
interface AppState {
  currentManga?: Manga;          // 当前漫画
  currentChapter?: Chapter;       // 当前章节
  currentPage: number;          // 当前页码（从1开始）
  isLoading: boolean;           // 是否加载中
  error?: string;               // 错误信息
  loadingProgress: number;       // 加载进度（0-100）
  isDownloading: boolean;       // 是否正在下载
  downloadProgress: number;     // 下载进度（0-100）
}

interface Settings {
  theme: 'light' | 'dark';       // 主题设置
  imageQuality: 'high' | 'medium' | 'low'; // 图片质量
  preloadCount: number;          // 预加载页面数
  maxConcurrent: number;        // 最大并发数
}
```

#### 5. UserSettings (用户设置)

```typescript
interface UserSettings {
  theme: 'light' | 'dark';       // 主题设置
  imageQuality: 'high' | 'medium' | 'low'; // 图片质量
  preloadCount: number;          // 预加载页面数
  maxConcurrent: number;        // 最大并发数
  autoPlay: boolean;            // 自动播放
  showChapterProgress: boolean; // 显示章节进度
}
```

#### 6. APIResponse (API响应)

```typescript
interface APIResponse<T> {
  code: number;                 // 状态码
  message: string;               // 响应消息
  data?: T;                     // 响应数据
  timestamp: number;             // 时间戳
}
```

#### 7. APICredentials (API凭据)

```typescript
interface APICredentials {
  token: string;                // 认证令牌
  timestamp: number;             // 时间戳
  version: string;              // 版本号
}
```

## State Management Design

### Pinia Store Structure

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
  }),
  
  getters: {
    currentManga: (state) => state.manga,
    hasPrevChapter: (state) => {
      if (!state.currentChapter) return false;
      const currentIndex = state.chapters.findIndex(c => c.id === state.currentChapter!.id);
      return currentIndex > 0;
    },
    hasNextChapter: (state) => {
      if (!state.currentChapter) return false;
      const currentIndex = state.chapters.findIndex(c => c.id === state.currentChapter!.id);
      return currentIndex < state.chapters.length - 1;
    },
    totalPages: (state) => state.currentChapter?.page_count || 0,
  },
  
  actions: {
    async fetchManga(id: string) { /* ... */ },
    async fetchChapters(mangaId: string) { /* ... */ },
    setCurrentChapter(chapter: Chapter) { /* ... */ },
    setCurrentPage(page: number) { /* ... */ },
    setLoading(loading: boolean) { /* ... */ },
    setError(error: string | null) { /* ... */ },
    setLoadingProgress(progress: number) { /* ... */ },
  }
})
```

## Data Flow

### 1. 漫画信息加载流程
```
用户输入ID → 请求API → 更新Manga Store → 显示漫画信息
```

### 2. 章节选择流程
```
用户选择章节 → 请求章节图片列表 → 更新当前章节 → 加载第一页
```

### 3. 图片加载和处理流程
```
页面滚动 → 懒加载图片 → 请求图片 → 处理切片图片 → 显示图片
```

### 4. 章节切换流程
```
用户点击切换 → 保存当前进度 → 加载新章节 → 更新页面 → 恢复进度
```

## Relationships

```
Manga 1 -----> * Chapter
Chapter 1 -----> * Image
UserSettings 1 -----> 1 AppState
AppState -------> Manga
AppState -------> Chapter
AppState -------> Image
```

## Data Validation

### Required Fields
- 所有实体ID字段必填
- URL字段必须符合URL格式
- 数字字段必须在合理范围内
- 数组长度必须符合业务规则

### Data Consistency
- Chapter.mangaId 必须关联存在的 Manga.id
- Image.chapterId 必须关联存在的 Chapter.id
- Chapter.page_count 必须等于 Image[].length
- currentPage 不能超过 totalPages

## Error Handling

### Validation Errors
- 输入验证失败时显示具体错误信息
- API错误时显示友好的错误提示
- 网络错误时提供重试选项

### Recovery Strategies
- 图片加载失败时自动重试
- 章节加载失败时提供章节列表重新选择
- 状态同步失败时从本地存储恢复