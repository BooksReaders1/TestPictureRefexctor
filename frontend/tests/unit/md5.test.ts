import { describe, it, expect } from 'vitest';
import { hashString, calculateSlicesFromHash } from '../../src/utils/md5';

describe('MD5-like Hash Utility', () => {
  describe('hashString', () => {
    it('should generate a non-negative hash for non-empty strings', () => {
      const hash = hashString('test');
      expect(hash).toBeGreaterThanOrEqual(0);
    });

    it('should generate different hashes for different strings', () => {
      const hash1 = hashString('test');
      const hash2 = hashString('different');
      const hash3 = hashString('test'); // Same string should produce same hash

      expect(hash1).not.toBe(hash2);
      expect(hash1).toBe(hash3);
    });

    it('should handle empty string', () => {
      const hash = hashString('');
      expect(hash).toBeGreaterThanOrEqual(0);
    });

    it('should handle numbers as strings', () => {
      const hash1 = hashString('123');
      const hash2 = hashString('123');

      expect(hash1).toBe(hash2);
    });

    it('should handle special characters', () => {
      const hash = hashString('!@#$%^&*()');
      expect(hash).toBeGreaterThanOrEqual(0);
    });

    it('should handle unicode characters', () => {
      const hash = hashString('你好世界');
      expect(hash).toBeGreaterThanOrEqual(0);
    });

    it('should handle long strings', () => {
      const longString = 'a'.repeat(1000);
      const hash = hashString(longString);
      expect(hash).toBeGreaterThanOrEqual(0);
    });

    it('should handle very long strings', () => {
      const veryLongString = 'a'.repeat(10000);
      const hash = hashString(veryLongString);
      expect(hash).toBeGreaterThanOrEqual(0);
    });

    it('should produce consistent results (deterministic)', () => {
      const iterations = 100;
      const hashes: number[] = [];

      for (let i = 0; i < iterations; i++) {
        hashes.push(hashString('deterministic-test'));
      }

      hashes.forEach(hash => {
        expect(hash).toBe(hashes[0]);
      });
    });
  });

  describe('calculateSlicesFromHash', () => {
    it('should return a number between 3 and 9', () => {
      const result = calculateSlicesFromHash('chapter', 1);
      expect(result).toBeGreaterThanOrEqual(3);
      expect(result).toBeLessThanOrEqual(9);
    });

    it('should be deterministic for same input', () => {
      const result1 = calculateSlicesFromHash('chapter-1', 5);
      const result2 = calculateSlicesFromHash('chapter-1', 5);

      expect(result1).toBe(result2);
    });

    it('should handle empty chapter ID', () => {
      const result = calculateSlicesFromHash('', 0);
      expect(result).toBeGreaterThanOrEqual(3);
      expect(result).toBeLessThanOrEqual(9);
    });

    it('should handle zero page index', () => {
      const result = calculateSlicesFromHash('chapter-1', 0);
      expect(result).toBeGreaterThanOrEqual(3);
      expect(result).toBeLessThanOrEqual(9);
    });

    it('should produce different results for different page indices', () => {
      const result1 = calculateSlicesFromHash('chapter-1', 0);
      const result2 = calculateSlicesFromHash('chapter-1', 1);

      // Results should be different
      expect(result1).not.toBe(result2);
    });

    it('should handle negative page indices', () => {
      const result = calculateSlicesFromHash('chapter-1', -1);
      expect(result).toBeGreaterThanOrEqual(3);
      expect(result).toBeLessThanOrEqual(9);
    });

    it('should handle large page indices', () => {
      const result = calculateSlicesFromHash('chapter-1', 999999);
      expect(result).toBeGreaterThanOrEqual(3);
      expect(result).toBeLessThanOrEqual(9);
    });

    it('should handle unicode in chapter ID', () => {
      const result = calculateSlicesFromHash('你好', 10);
      expect(result).toBeGreaterThanOrEqual(3);
      expect(result).toBeLessThanOrEqual(9);
    });

    it('should always produce integer results', () => {
      const result = calculateSlicesFromHash('test', 1);
      expect(Number.isInteger(result)).toBe(true);
    });

    it('should handle chapter IDs with special characters', () => {
      const result = calculateSlicesFromHash('chapter-1!@#$', 5);
      expect(result).toBeGreaterThanOrEqual(3);
      expect(result).toBeLessThanOrEqual(9);
    });
  });

  describe('Hash Distribution', () => {
    it('should distribute hash values across the range', () => {
      const results: number[] = [];

      for (let i = 0; i < 1000; i++) {
        results.push(calculateSlicesFromHash(`test-${i}`, i % 10));
      }

      // Check that we got values across the range
      const uniqueValues = new Set(results);
      expect(uniqueValues.size).toBeGreaterThan(5); // Should have at least 6 unique values (3-9)

      // Check minimum and maximum
      const min = Math.min(...results);
      const max = Math.max(...results);
      expect(min).toBeGreaterThanOrEqual(3);
      expect(max).toBeLessThanOrEqual(9);
    });

    it('should be consistent across calls', () => {
      const iterations = 1000;
      const firstResult = calculateSlicesFromHash('consistency-test', 1);

      for (let i = 0; i < iterations; i++) {
        const result = calculateSlicesFromHash('consistency-test', 1);
        expect(result).toBe(firstResult);
      }
    });
  });
});
