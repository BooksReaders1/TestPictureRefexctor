// Cache utilities
import type { Manga, Chapter, Image } from '@/types';

interface CacheConfig {
  ttl: number;
  maxSize: number;
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const cacheConfig: Record<string, CacheConfig> = {
  manga: { ttl: 24 * 60 * 60 * 1000, maxSize: 100 },
  chapters: { ttl: 12 * 60 * 60 * 1000, maxSize: 1000 },
  images: { ttl: 60 * 60 * 1000, maxSize: 10000 }
};

const cache: Map<string, CacheItem<any>> = new Map();

export function getCache<T>(key: string): T | null {
  const item = cache.get(key);

  if (!item) {
    return null;
  }

  const config = cacheConfig[key] || { ttl: 5 * 60 * 1000, maxSize: 100 };
  const age = Date.now() - item.timestamp;

  if (age > config.ttl) {
    cache.delete(key);
    return null;
  }

  return item.data as T;
}

export function setCache<T>(key: string, data: T): void {
  const config = cacheConfig[key] || { ttl: 5 * 60 * 1000, maxSize: 100 };
  const cacheItem: CacheItem<T> = {
    data,
    timestamp: Date.now()
  };

  cache.set(key, cacheItem);

  // Check cache size
  if (cache.size > config.maxSize) {
    // Remove oldest items
    const entries = Array.from(cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

    // Remove oldest 10%
    const toRemove = Math.floor(cache.size * 0.1);
    for (let i = 0; i < toRemove; i++) {
      cache.delete(entries[i][0]);
    }
  }
}

export function clearCache(): void {
  cache.clear();
}

export function clearCacheByPattern(pattern: string): void {
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
}

export function getCacheStats(): Record<string, number> {
  const stats: Record<string, number> = {};

  for (const [key] of cache) {
    stats[key] = (stats[key] || 0) + 1;
  }

  return stats;
}
