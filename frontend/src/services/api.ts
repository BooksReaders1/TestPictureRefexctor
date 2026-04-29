import type {
  Manga,
  Chapter,
  Image,
  APIToken,
  APIHeaders,
  APIResponse,
  MangaParams,
  ChapterParams,
  ImageParams
} from '@/types';

class APIService {
  private baseURL = '';
  private token: APIToken | null = null;

  async request<T>(endpoint: string, params?: any): Promise<T> {
    // Generate token
    this.token = this.generateToken();

    // Build headers
    const headers: APIHeaders = {
      'Content-Type': 'application/json',
      'User-Agent': 'Vue-Manga-Viewer/1.0.0',
      'X-API-Token': this.token.token,
      'X-API-Timestamp': this.token.timestamp.toString()
    };

    // Build URL with params
    const url = this.buildURL(endpoint, params);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      const data: APIResponse<T> = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || 'API request failed');
      }

      return data.data as T;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  private generateToken(): APIToken {
    const timestamp = Date.now();
    const version = '1.0.0';
    const secretKey = 'jm18c-uoe'; // Placeholder - should be configurable

    const token = btoa(`${timestamp}|${version}|${secretKey}`);

    return { timestamp, version, token };
  }

  private buildURL(endpoint: string, params?: any): string {
    if (!params) return endpoint;

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `${endpoint}?${queryString}` : endpoint;
  }

  async fetchManga(id: string): Promise<Manga> {
    return this.request<Manga>('/api/album', { id, token: this.token?.token });
  }

  async fetchChapters(mangaId: string): Promise<Chapter[]> {
    return this.request<Chapter[]>('/api/album/chapter', { mangaId, token: this.token?.token });
  }

  async fetchChapterInfo(mangaId: string, chapterId: string): Promise<Chapter> {
    return this.request<Chapter>('/api/album/chapter', { mangaId, chapterId, token: this.token?.token });
  }

  async fetchImageInfo(mangaId: string, chapterId: string, pageId: string): Promise<Image> {
    return this.request<Image>('/api/image/info', {
      mangaId,
      chapterId,
      pageId,
      token: this.token?.token
    });
  }

  async fetchImage(mangaId: string, pageId: string): Promise<Blob> {
    const headers: HeadersInit = {
      'Referer': 'https://jm18c-uoe.cc/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    };

    const url = `https://cdn-msp.jm18c-uoe.cc/media/photos/${mangaId}/${pageId}.webp`;

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    return response.blob();
  }

  // Simulated API methods for development (replace with real API calls)
  async fetchMangaMock(id: string): Promise<Manga> {
    // Simulate API delay
    await this.delay(500);

    // Return mock manga data
    return {
      id,
      title: `漫画 ${id}`,
      chapterCount: 10,
      chapters: Array.from({ length: 10 }, (_, i) => ({
        id: `ch${i + 1}`,
        mangaId: id,
        title: `第 ${i + 1} 章`,
        order: i + 1,
        page_count: 20,
        images: Array.from({ length: 20 }, (_, j) => ({
          id: `pg${i * 20 + j + 1}`,
          chapterId: `ch${i + 1}`,
          url: `https://cdn-msp.jm18c-uoe.cc/media/photos/${id}/${i * 20 + j + 1}.webp`,
          index: j,
          processed: false
        }))
      }))
    };
  }

  async fetchChaptersMock(mangaId: string): Promise<Chapter[]> {
    // Simulate API delay
    await this.delay(300);

    const manga = await this.fetchMangaMock(mangaId);
    return manga.chapters;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new APIService();
