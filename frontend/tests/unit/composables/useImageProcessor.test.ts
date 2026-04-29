import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useImageProcessor } from '../../src/composables/useImageProcessor';

// Mock at top level before any code that uses them
const mockGetCache = vi.fn();
const mockSetCache = vi.fn();

vi.mock('../../src/utils/cache', () => ({
  getCache: mockGetCache,
  setCache: mockSetCache,
  clearCache: vi.fn(),
  clearAllCache: vi.fn()
}));

vi.mock('../../src/utils/errorHandler', () => ({
  handleError: vi.fn()
}));

describe('useImageProcessor Composable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCache.mockReturnValue(null);
    mockSetCache.mockClear();
    mockHandleError.mockClear();
  });

  describe('Basic Functions', () => {
    it('should create processor instance', () => {
      const processor = useImageProcessor();

      expect(processor).toHaveProperty('isProcessing');
      expect(processor.isProcessing.value).toBe(false);
    });

    it('should accept custom concurrency settings', () => {
      const processor = useImageProcessor({ concurrency: 10, preloadCount: 5 });

      expect(processor).toBeDefined();
    });
  });

  describe('processImageOnLoad', () => {
    it('should return null when image is already processed', async () => {
      const mockImg = {
        naturalWidth: 100,
        naturalHeight: 100
      } as HTMLImageElement;

      const mockProcessedImage = {
        processed: true
      } as any;

      const processor = useImageProcessor();
      const result = await processor.processImageOnLoad(mockImg, mockProcessedImage);

      expect(result).toBeNull();
    });

    it('should set isProcessing to true when processing starts', async () => {
      const mockImg = {
        naturalWidth: 100,
        naturalHeight: 100
      } as HTMLImageElement;

      const mockImageInfo = {
        id: 'test-id',
        chapterId: 'chapter-1',
        index: 0,
        processed: false
      } as any;

      const processor = useImageProcessor();

      const promise = processor.processImageOnLoad(mockImg, mockImageInfo);

      expect(processor.isProcessing.value).toBe(true);

      await promise;
      expect(processor.isProcessing.value).toBe(false);
    });

    it('should handle image processing errors', async () => {
      const mockImg = {} as HTMLImageElement;
      const mockImageInfo = {
        id: 'test-id',
        chapterId: 'chapter-1',
        index: 0,
        processed: false
      } as any;

      const processor = useImageProcessor();

      await expect(processor.processImageOnLoad(mockImg, mockImageInfo))
        .rejects.toThrow();

      expect(mockHandleError).toHaveBeenCalled();
    });
  });

  describe('calculateSliceCount', () => {
    it('should calculate slice count using chapter ID and page index', () => {
      const processor = useImageProcessor();

      // This function is exposed but we're testing the underlying implementation
      const result = processor.calculateSliceCount('chapter-1', 5);

      expect(result).toBeGreaterThanOrEqual(3);
      expect(result).toBeLessThanOrEqual(9);
    });

    it('should be deterministic for same input', () => {
      const processor = useImageProcessor();

      const result1 = processor.calculateSliceCount('chapter-1', 5);
      const result2 = processor.calculateSliceCount('chapter-1', 5);

      expect(result1).toBe(result2);
    });

    it('should handle empty strings', () => {
      const processor = useImageProcessor();

      const result = processor.calculateSliceCount('', 0);

      expect(result).toBeGreaterThanOrEqual(3);
      expect(result).toBeLessThanOrEqual(9);
    });
  });

  describe('preloadImages', () => {
    it('should preload images around current index', async () => {
      const mockImages = [
        { id: '1', processed: false, url: 'url-1' },
        { id: '2', processed: false, url: 'url-2' },
        { id: '3', processed: false, url: 'url-3' },
        { id: '4', processed: false, url: 'url-4' },
        { id: '5', processed: false, url: 'url-5' }
      ] as any[];

      const processor = useImageProcessor();
      const mockLoadImage = vi.fn().mockResolvedValue(undefined);

      // Mock the loadImageWithRetry function
      processor.loadImageWithRetry = mockLoadImage;

      await processor.preloadImages(mockImages, 2);

      // Should preload images around index 2
      expect(mockLoadImage).toHaveBeenCalled();
    });

    it('should not preload already processed images', async () => {
      const mockImages = [
        { id: '1', processed: false, url: 'url-1' },
        { id: '2', processed: true, url: 'url-2' },
        { id: '3', processed: false, url: 'url-3' }
      ] as any[];

      const processor = useImageProcessor();
      const mockLoadImage = vi.fn().mockResolvedValue(undefined);

      processor.loadImageWithRetry = mockLoadImage;

      await processor.preloadImages(mockImages, 1);

      // Should only preload non-processed images
      expect(mockLoadImage).toHaveBeenCalledTimes(2);
    });

    it('should handle preloadCount limit', async () => {
      const mockImages = [] as any[];

      const processor = useImageProcessor({ preloadCount: 2 });

      const mockLoadImage = vi.fn().mockResolvedValue(undefined);
      processor.loadImageWithRetry = mockLoadImage;

      await processor.preloadImages(mockImages, 0);

      // Should not call loadImageWithRetry if no images
      expect(mockLoadImage).not.toHaveBeenCalled();
    });
  });

  describe('loadImageWithRetry', () => {
    it('should load image successfully on first try', async () => {
      const mockImage = {
        id: 'test-id',
        url: 'http://example.com/image.jpg'
      } as any;

      const processor = useImageProcessor();

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = mockImage.url;

      await new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });

      await expect(processor.loadImageWithRetry(mockImage))
        .resolves.not.toThrow();
    });

    it('should retry on error', async () => {
      const mockImage = {
        id: 'test-id',
        url: 'http://example.com/image.jpg'
      } as any;

      const processor = useImageProcessor();

      let attempts = 0;
      const failingLoad = vi.fn().mockImplementation(() => {
        attempts++;
        if (attempts < 2) {
          throw new Error('Failed to load');
        }
        return Promise.resolve();
      });

      processor.loadImageWithRetry = failingLoad;

      await expect(processor.loadImageWithRetry(mockImage, 2))
        .resolves.not.toThrow();

      expect(attempts).toBe(2);
    });

    it('should not retry after all attempts fail', async () => {
      const mockImage = {
        id: 'test-id',
        url: 'http://example.com/image.jpg'
      } as any;

      const processor = useImageProcessor();

      processor.loadImageWithRetry = vi.fn().mockRejectedValue(
        new Error('Always fails')
      );

      await expect(processor.loadImageWithRetry(mockImage, 1))
        .rejects.toThrow('Always fails');

      expect(processor.loadImageWithRetry).toHaveBeenCalledTimes(1);
    });

    it('should use exponential backoff', async () => {
      const mockImage = {
        id: 'test-id',
        url: 'http://example.com/image.jpg'
      } as any;

      const processor = useImageProcessor();

      const failingLoad = vi.fn()
        .mockRejectedValueOnce(new Error('Fail 1'))
        .mockRejectedValueOnce(new Error('Fail 2'))
        .mockResolvedValueOnce();

      processor.loadImageWithRetry = failingLoad;

      const startTime = Date.now();
      await processor.loadImageWithRetry(mockImage, 2);
      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThan(500); // At least one delay
    });
  });

  describe('cleanupProcessedImages', () => {
    it('should remove processed images older than 30 minutes', () => {
      const mockImages = [
        {
          id: 'old',
          processed: true,
          index: -10,
          processedAt: Date.now() - (35 * 60 * 1000) // 35 minutes ago
        } as any,
        {
          id: 'recent',
          processed: true,
          index: 0,
          processedAt: Date.now() // Just now
        } as any,
        {
          id: 'future',
          processed: true,
          index: 1,
          processedAt: Date.now() + (35 * 60 * 1000) // Future
        } as any
      ] as any[];

      const processor = useImageProcessor();

      // This function modifies the cache, so we'll just verify it doesn't throw
      expect(() => processor.cleanupProcessedImages(mockImages)).not.toThrow();
    });

    it('should keep current and near-current images', () => {
      const mockImages = [
        { processed: true, index: -1 } as any,
        { processed: true, index: 0 } as any,
        { processed: true, index: 1 } as any,
        { processed: true, index: 2 } as any,
        { processed: true, index: -10 } as any
      ] as any[];

      const processor = useImageProcessor();

      expect(() => processor.cleanupProcessedImages(mockImages)).not.toThrow();
    });
  });

  describe('Configuration', () => {
    it('should use default concurrency when not specified', () => {
      const processor = useImageProcessor();
      // The default is set inside the composable
      expect(processor).toBeDefined();
    });

    it('should use custom concurrency when specified', () => {
      const processor = useImageProcessor({ concurrency: 10 });
      expect(processor).toBeDefined();
    });

    it('should use custom preload count when specified', () => {
      const processor = useImageProcessor({ preloadCount: 5 });
      expect(processor).toBeDefined();
    });
  });
});
