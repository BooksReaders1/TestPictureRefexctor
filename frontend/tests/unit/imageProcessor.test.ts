import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  processAndReassembleImage,
  getProcessedImage,
  storeProcessedImage,
  getSliceDimensions,
  validateImageDimensions,
  getResponsiveDimensions
} from '../../src/utils/imageProcessor';
import type { ProcessedImageResult } from '../../src/utils/imageProcessor';

// Mock at top level before any code that uses them
const mockGetCache = vi.fn();
const mockSetCache = vi.fn();
const mockCalculateSlicesFromHash = vi.fn();

vi.mock('../../src/utils/cache', () => ({
  getCache: mockGetCache,
  setCache: mockSetCache,
  clearCache: vi.fn(),
  clearAllCache: vi.fn()
}));

vi.mock('../../src/utils/md5', () => ({
  calculateSlicesFromHash: mockCalculateSlicesFromHash
}));

describe('Image Processor Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCache.mockReturnValue(null);
    mockSetCache.mockClear();
    mockCalculateSlicesFromHash.mockReturnValue(3);
  });

  describe('processAndReassembleImage', () => {
    it('should process and reassemble image slices', async () => {
      const mockCanvas = {
        getContext: vi.fn(() => ({
          drawImage: vi.fn(),
          getImageData: vi.fn(() => ({
            data: new Uint8ClampedArray(100 * 100 * 4)
          })),
          putImageData: vi.fn()
        })),
        width: 100,
        height: 100
      } as any;

      const mockOutputCanvas = {
        getContext: vi.fn(() => ({
          putImageData: vi.fn()
        })),
        width: 100,
        height: 100
      } as any;

      vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
        if (tag === 'canvas') {
          return mockCanvas;
        }
        throw new Error(`Unknown tag: ${tag}`);
      });

      const mockImg = {
        naturalWidth: 100,
        naturalHeight: 100
      } as HTMLImageElement;

      const result = await processAndReassembleImage(mockImg, 'chapter-1', 0);

      expect(result).toHaveProperty('canvas');
      expect(result).toHaveProperty('sliceCount');
      expect(result.sliceCount).toBe(3);
      expect(mockSetCache).toHaveBeenCalled();
    });

    it('should throw error when canvas context is null', async () => {
      const mockCanvas = {
        getContext: vi.fn(() => null),
        width: 100,
        height: 100
      } as any;

      vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
        if (tag === 'canvas') {
          return mockCanvas;
        }
        throw new Error(`Unknown tag: ${tag}`);
      });

      const mockImg = { naturalWidth: 100, naturalHeight: 100 } as HTMLImageElement;

      await expect(processAndReassembleImage(mockImg, 'chapter-1', 0))
        .rejects.toThrow('Failed to get canvas context');
    });

    it('should handle zero width image', async () => {
      const mockCanvas = {
        getContext: vi.fn(() => ({
          drawImage: vi.fn(),
          getImageData: vi.fn(() => ({
            data: new Uint8ClampedArray(0)
          })),
          putImageData: vi.fn()
        })),
        width: 0,
        height: 100
      } as any;

      vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
        if (tag === 'canvas') {
          return mockCanvas;
        }
        throw new Error(`Unknown tag: ${tag}`);
      });

      const mockImg = { naturalWidth: 0, naturalHeight: 100 } as HTMLImageElement;

      await expect(processAndReassembleImage(mockImg, 'chapter-1', 0))
        .rejects.toThrow('Invalid image dimensions');
    });
  });

  describe('getProcessedImage', () => {
    it('should retrieve cached processed image', () => {
      const mockResult = {
        canvas: {} as HTMLCanvasElement,
        sliceCount: 3,
        processedAt: Date.now()
      } as ProcessedImageResult;

      mockGetCache.mockReturnValue(mockResult);

      const result = getProcessedImage('chapter-1', 0);

      expect(result).toEqual(mockResult);
    });

    it('should return null when no cached image exists', () => {
      mockGetCache.mockReturnValue(null);

      const result = getProcessedImage('chapter-1', 0);

      expect(result).toBeNull();
    });

    it('should return null when cache is too old', () => {
      const oldResult = {
        canvas: {} as HTMLCanvasElement,
        sliceCount: 3,
        processedAt: Date.now() - (61 * 60 * 1000) // 61 minutes ago
      } as ProcessedImageResult;

      mockGetCache.mockReturnValue(oldResult);

      const result = getProcessedImage('chapter-1', 0);

      expect(result).toBeNull();
    });
  });

  describe('storeProcessedImage', () => {
    it('should store processed image to cache', () => {
      const mockResult = {
        canvas: {} as HTMLCanvasElement,
        sliceCount: 5
      } as ProcessedImageResult;

      storeProcessedImage('chapter-1', 10, mockResult);

      expect(mockSetCache).toHaveBeenCalledWith(
        'processed_chapter-1_10',
        expect.objectContaining({
          canvas: mockResult.canvas,
          sliceCount: 5,
          processedAt: expect.any(Number)
        })
      );
    });
  });

  describe('getSliceDimensions', () => {
    it('should calculate slice dimensions for 4 slices', () => {
      const dimensions = getSliceDimensions(100, 4);

      expect(dimensions).toHaveProperty('sliceWidth');
      expect(dimensions).toHaveProperty('sliceHeight');
      expect(dimensions).toHaveProperty('horizontalSlices');
      expect(dimensions).toHaveProperty('verticalSlices');

      expect(dimensions.horizontalSlices).toBe(2);
      expect(dimensions.verticalSlices).toBe(2);
    });

    it('should calculate slice dimensions for prime number of slices', () => {
      const dimensions = getSliceDimensions(100, 7);

      expect(dimensions.horizontalSlices).toBe(3);
      expect(dimensions.verticalSlices).toBe(3);
    });

    it('should handle single slice', () => {
      const dimensions = getSliceDimensions(100, 1);

      expect(dimensions.horizontalSlices).toBe(1);
      expect(dimensions.verticalSlices).toBe(1);
    });

    it('should handle many slices', () => {
      const dimensions = getSliceDimensions(100, 16);

      expect(dimensions.horizontalSlices).toBe(4);
      expect(dimensions.verticalSlices).toBe(4);
    });
  });

  describe('validateImageDimensions', () => {
    it('should validate valid image dimensions', () => {
      const result = validateImageDimensions(100, 200);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject zero width', () => {
      const result = validateImageDimensions(0, 100);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid image dimensions');
    });

    it('should reject zero height', () => {
      const result = validateImageDimensions(100, 0);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid image dimensions');
    });

    it('should reject negative width', () => {
      const result = validateImageDimensions(-100, 100);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid image dimensions');
    });

    it('should reject extremely large dimensions', () => {
      const result = validateImageDimensions(10000, 10000);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Image dimensions too large');
    });

    it('should accept dimensions close to the maximum', () => {
      const result = validateImageDimensions(9999, 9999);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('getResponsiveDimensions', () => {
    it('should return dimensions within max bounds', () => {
      const result = getResponsiveDimensions(1920, 1080, 800, 600, 'high');

      expect(result.width).toBeLessThanOrEqual(800);
      expect(result.height).toBeLessThanOrEqual(600);
    });

    it('should use high quality factor by default', () => {
      const result = getResponsiveDimensions(1920, 1080, 800, 600, 'high');

      expect(result.width).toBeCloseTo(1920, -1);
      expect(result.height).toBeCloseTo(1080, -1);
    });

    it('should use medium quality factor', () => {
      const result = getResponsiveDimensions(1920, 1080, 800, 600, 'medium');

      expect(result.width).toBeCloseTo(1344, -1); // 1920 * 0.7
      expect(result.height).toBeCloseTo(756, -1); // 1080 * 0.7
    });

    it('should use low quality factor', () => {
      const result = getResponsiveDimensions(1920, 1080, 800, 600, 'low');

      expect(result.width).toBeCloseTo(960, -1); // 1920 * 0.5
      expect(result.height).toBeCloseTo(540, -1); // 1080 * 0.5
    });

    it('should maintain aspect ratio', () => {
      const result = getResponsiveDimensions(1920, 1080, 800, 600, 'high');

      const aspectRatio = 1920 / 1080;
      const resultRatio = result.width / result.height;

      expect(Math.abs(resultRatio - aspectRatio)).toBeLessThan(0.01);
    });

    it('should handle portrait orientation', () => {
      const result = getResponsiveDimensions(1080, 1920, 600, 800, 'high');

      expect(result.width).toBeLessThanOrEqual(600);
      expect(result.height).toBeLessThanOrEqual(800);
    });
  });
});
