// Base types
export interface APIToken {
  timestamp: number;
  version: string;
  token: string;
}

export interface APIHeaders {
  'Content-Type': 'application/json';
  'User-Agent': string;
  'X-API-Token': string;
  'X-API-Timestamp': string;
}

export interface APIResponse<T> {
  code: number;
  message: string;
  data?: T;
  timestamp: number;
}

// Manga entities
export interface Manga {
  id: string;
  title: string;
  author?: string;
  description?: string;
  coverImage?: string;
  chapterCount: number;
  chapters: Chapter[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Chapter {
  id: string;
  mangaId: string;
  title: string;
  order: number;
  page_count: number;
  images: Image[];
  createdAt?: Date;
}

export interface Image {
  id: string;
  chapterId: string;
  url: string;
  index: number;
  processed: boolean;
  scrambleParams?: {
    aid: string;
    offset: string;
  };
  width?: number;
  height?: number;
  fileSize?: number;
}

// App state
export interface AppState {
  currentManga?: Manga;
  currentChapter?: Chapter;
  currentPage: number;
  isLoading: boolean;
  error?: string | null;
  loadingProgress: 0;
  isDownloading: boolean;
  downloadProgress: 0;
}

// User settings
export interface UserSettings {
  theme: 'light' | 'dark';
  imageQuality: 'high' | 'medium' | 'low';
  preloadCount: number;
  maxConcurrent: number;
}

// API params
export interface MangaParams {
  id: string;
  token?: string;
}

export interface ChapterParams {
  mangaId: string;
  chapterId: string;
  token?: string;
}

export interface ImageParams {
  mangaId: string;
  chapterId: string;
  pageId: string;
  token?: string;
}
