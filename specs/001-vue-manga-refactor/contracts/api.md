# API 接口契约

**Date**: 2026-04-29  
**Feature**: Vue漫画查看器重构

## 概述

本文档定义了Vue漫画查看器与JMComic API之间的接口契约。所有API调用都通过前端JavaScript实现，不依赖后端服务。

## API 认证机制

### 时间令牌生成

```typescript
interface APIToken {
  timestamp: number;  // 当前时间戳
  version: string;    // 版本号，如 "1.0.0"
  token: string;     // 生成的令牌
}

function generateToken(): APIToken {
  return {
    timestamp: Date.now(),
    version: "1.0.0",
    token: btoa(`${Date.now()}|1.0.0|${SECRET_KEY}`)
  };
}
```

### 请求头格式

```typescript
interface APIHeaders {
  'Content-Type': 'application/json';
  'User-Agent': 'Vue-Manga-Viewer/1.0.0';
  'X-API-Token': string;  // 生成的令牌
  'X-API-Timestamp': string;  // 时间戳
}
```

## 核心API接口

### 1. 获取漫画信息

**接口**: `GET /api/album`

**用途**: 获取漫画基本信息

**请求参数**:
```typescript
interface MangaParams {
  id: string;  // 漫画ID
  token?: string;  // 认证令牌（可选）
}
```

**响应格式**:
```typescript
interface MangaResponse {
  code: number;
  message: string;
  data: {
    id: string;
    title: string;
    author?: string;
    description?: string;
    coverImage?: string;
    chapterCount: number;
    chapters: ChapterInfo[];
  };
}
```

### 2. 获取章节信息

**接口**: `GET /api/album/chapter`

**用途**: 获取指定章节的详细信息

**请求参数**:
```typescript
interface ChapterParams {
  mangaId: string;  // 漫画ID
  chapterId: string;  // 章节ID
  token?: string;  // 认证令牌（可选）
}
```

**响应格式**:
```typescript
interface ChapterResponse {
  code: number;
  message: string;
  data: {
    id: string;
    title: string;
    order: number;
    page_count: number;
    images: ImageInfo[];
  };
}
```

### 3. 获取图片信息

**接口**: `GET /api/image/info`

**用途**: 获取图片信息和解密参数

**请求参数**:
```typescript
interface ImageParams {
  mangaId: string;  // 漫画ID
  chapterId: string;  // 章节ID
  pageId: string;  // 页面ID
  token?: string;  // 认证令牌（可选）
}
```

**响应格式**:
```typescript
interface ImageResponse {
  code: number;
  message: string;
  data: {
    id: string;
    url: string;
    width: number;
    height: number;
    scrambleParams: {
      aid: string;     // 章节ID
      offset: string;  // 偏移量
    };
  };
}
```

### 4. CDN图片获取

**接口**: `GET https://cdn-msp.jm18c-uoe.cc/media/photos/{mangaId}/{pageId}.webp`

**用途**: 直接获取图片文件

**请求头**:
```typescript
interface CDNHeaders {
  'Referer': 'https://jm18c-uoe.cc/';
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
}
```

## 错误处理

### 错误码定义

| 错误码 | 含义 | 处理方式 |
|--------|------|----------|
| 200 | 成功 | 继续处理 |
| 400 | 参数错误 | 显示错误提示，重新输入 |
| 401 | 认证失败 | 重新生成令牌重试 |
| 404 | 资源不存在 | 显示错误提示 |
| 429 | 请求过于频繁 | 延迟重试 |
| 500 | 服务器错误 | 延迟重试 |
| 503 | 服务不可用 | 延迟重试 |

### 错误重试策略

```typescript
interface RetryConfig {
  maxAttempts: number;      // 最大重试次数
  initialDelay: number;     // 初始延迟（毫秒）
  maxDelay: number;         // 最大延迟（毫秒）
  backoffFactor: number;    // 退避因子
}

const retryConfig: RetryConfig = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
};
```

## 数据缓存策略

### 本地缓存

```typescript
interface CacheConfig {
  manga: {
    ttl: number;     // 缓存时间（毫秒）
    maxSize: number; // 最大缓存数量
  };
  chapters: {
    ttl: number;
    maxSize: number;
  };
  images: {
    ttl: number;
    maxSize: number;
  };
}

const cacheConfig: CacheConfig = {
  manga: { ttl: 24 * 60 * 60 * 1000, maxSize: 100 },
  chapters: { ttl: 12 * 60 * 60 * 1000, maxSize: 1000 },
  images: { ttl: 60 * 60 * 1000, maxSize: 10000 },
};
```

### 缓存键格式

```typescript
function generateCacheKey(type: string, params: any): string {
  return `${type}_${JSON.stringify(params)}`;
}
```

## 客户端集成

### API服务封装

```typescript
// services/api.ts
class APIService {
  private baseURL: string;
  private token: APIToken;
  
  async request<T>(endpoint: string, params: any): Promise<T> {
    // 生成令牌
    this.token = generateToken();
    
    // 构建请求头
    const headers: APIHeaders = {
      'Content-Type': 'application/json',
      'User-Agent': 'Vue-Manga-Viewer/1.0.0',
      'X-API-Token': this.token.token,
      'X-API-Timestamp': this.token.timestamp.toString(),
    };
    
    // 发起请求
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers,
      params,
    });
    
    // 处理响应
    return this.handleResponse<T>(response);
  }
  
  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    
    if (data.code !== 200) {
      throw new Error(data.message);
    }
    
    return data.data;
  }
}
```

## 性能要求

### 响应时间
- API请求响应时间 < 2秒
- 图片加载时间 < 3秒
- 图片处理时间 < 500ms

### 并发控制
- 最大并发请求数: 5
- 图片预加载数量: 2页（当前页前后各1页）

## 安全考虑

### 数据安全
- 所有敏感信息不在客户端存储
- API令牌定时刷新
- 防止XSS攻击

### 访问控制
- 客户端验证用户输入
- 防止恶意请求
- 请求频率限制