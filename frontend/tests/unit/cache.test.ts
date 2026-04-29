import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getCache, setCache, clearCache, clearCacheByPattern, getCacheStats } from '../../src/utils/cache';

describe('Cache Utility', () => {
  beforeEach(() => {
    // Clear cache before each test
    clearCache();
  });

  describe('setCache', () => {
    it('should store a value in the cache', () => {
      setCache('test-key', 'test-value');
      const result = getCache<string>('test-key');
      expect(result).toBe('test-value');
    });

    it('should store an object and retrieve it correctly', () => {
      const testData = { name: 'test', value: 123 };
      setCache('test-key', testData);
      const result = getCache<typeof testData>('test-key');
      expect(result).toEqual(testData);
    });

    it('should store null/undefined values', () => {
      setCache('null-key', null);
      setCache('undefined-key', undefined);
      expect(getCache('null-key')).toBeNull();
      expect(getCache('undefined-key')).toBeUndefined();
    });
  });

  describe('getCache', () => {
    it('should retrieve a stored value', () => {
      setCache('existing-key', 'existing-value');
      const result = getCache('existing-key');
      expect(result).toBe('existing-value');
    });

    it('should return null for non-existent key', () => {
      const result = getCache('non-existent');
      expect(result).toBeNull();
    });

    it('should return the correct type when using generics', () => {
      const testData = { id: 1, name: 'test' };
      setCache('typed-key', testData);
      const result = getCache<typeof testData>('typed-key');
      expect(result).toEqual(testData);
    });
  });

  describe('clearCache', () => {
    it('should clear a specific cache key', () => {
      setCache('key1', 'value1');
      setCache('key2', 'value2');
      setCache('key3', 'value3');

      clearCache('key1');

      expect(getCache('key1')).toBeNull();
      expect(getCache('key2')).toBe('value2');
      expect(getCache('key3')).toBe('value3');
    });

    it('should handle clearing non-existent key without error', () => {
      expect(() => clearCache('non-existent')).not.toThrow();
    });
  });

  describe('clearCacheByPattern', () => {
    it('should clear cache entries matching the pattern', () => {
      setCache('user_123_data', 'value1');
      setCache('user_456_data', 'value2');
      setCache('chapter_789_info', 'value3');

      clearCacheByPattern('user_');

      expect(getCache('user_123_data')).toBeNull();
      expect(getCache('user_456_data')).toBeNull();
      expect(getCache('chapter_789_info')).toBe('value3');
    });

    it('should handle clearing when no matches exist', () => {
      expect(() => clearCacheByPattern('nonexistent')).not.toThrow();
    });
  });

  describe('getCacheStats', () => {
    it('should return cache statistics', () => {
      setCache('key1', 'value1');
      setCache('key2', 'value2');
      setCache('key3', 'value3');

      const stats = getCacheStats();

      expect(stats).toHaveProperty('key1');
      expect(stats).toHaveProperty('key2');
      expect(stats).toHaveProperty('key3');
    });

    it('should return 0 for empty cache', () => {
      const stats = getCacheStats();
      expect(Object.keys(stats)).toHaveLength(0);
    });
  });

  describe('Cache with timestamps', () => {
    it('should store and retrieve data with timestamp', () => {
      const testData = { data: 'test' };
      setCache('timestamp-key', testData);
      const result = getCache<typeof testData>('timestamp-key');
      expect(result).toEqual(testData);
      expect(result!.timestamp).toBeTypeOf('number');
    });
  });

  describe('Cache expiration', () => {
    beforeEach(() => {
      // Use fake timers for time-based testing
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
      clearCache();
    });

    it('should expire cache items based on TTL', () => {
      const testData = { data: 'test' };
      setCache('expired-key', testData);

      // Fast forward 1 minute past TTL (5 minutes)
      jest.setSystemTime(Date.now() + 6 * 60 * 1000);

      const result = getCache('expired-key');
      expect(result).toBeNull();
    });

    it('should not expire cache items within TTL', () => {
      const testData = { data: 'test' };
      setCache('valid-key', testData);

      // Fast forward less than TTL
      jest.setSystemTime(Date.now() + 2 * 60 * 1000);

      const result = getCache('valid-key');
      expect(result).toEqual(testData);
    });
  });
});
