// Image processing utilities for slicing and reassembly
import type { Image } from '@/types';
import { getCache, setCache } from './cache';
import { hashString, calculateSlicesFromHash } from './md5';

interface ProcessedImageResult {
  canvas: HTMLCanvasElement;
  sliceCount: number;
}

// Process and reassemble image slices
export async function processAndReassembleImage(
  img: HTMLImageElement,
  chapterId: string,
  pageIndex: number
): Promise<ProcessedImageResult> {
  try {
    // Calculate slice count
    const sliceCount = calculateSlicesFromHash(chapterId, pageIndex);

    // Create canvas from original image
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Draw the scrambled image
    ctx.drawImage(img, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Calculate slice dimensions
    const sliceWidth = Math.floor(canvas.width / sliceCount);

    // Create output canvas for reassembled image
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;
    const outputCtx = outputCanvas.getContext('2d');
    if (!outputCtx) {
      throw new Error('Failed to get output canvas context');
    }

    // Process each slice and reassemble in reverse order
    for (let sliceIndex = 0; sliceIndex < sliceCount; sliceIndex++) {
      const sliceIndexReversed = sliceCount - 1 - sliceIndex;
      const sliceX = sliceIndexReversed * sliceWidth;

      // Get slice data
      const sliceData = data.slice(
        sliceX * 4,
        Math.min((sliceIndexReversed + 1) * sliceWidth, canvas.width) * 4
      );

      // Put slice data into output canvas (in reverse order)
      outputCtx.putImageData(
        new ImageData(
          new Uint8ClampedArray(sliceData),
          Math.min(sliceWidth, canvas.width - sliceX),
          canvas.height
        ),
        sliceIndex * sliceWidth,
        0
      );
    }

    // Cache the result
    const cacheKey = `processed_${chapterId}_${pageIndex}`;
    setCache(cacheKey, {
      canvas: outputCanvas,
      sliceCount,
      processedAt: Date.now()
    });

    return {
      canvas: outputCanvas,
      sliceCount
    };
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}

// Get processed image from cache
export function getProcessedImage(chapterId: string, pageIndex: number): ProcessedImageResult | null {
  const cacheKey = `processed_${chapterId}_${pageIndex}`;
  const cached = getCache<ProcessedImageResult>(cacheKey);

  if (cached) {
    // Check if cache is still valid (1 hour)
    const cacheAge = Date.now() - cached.processedAt;
    if (cacheAge < 60 * 60 * 1000) {
      return cached;
    }
  }

  return null;
}

// Store processed image to cache
export function storeProcessedImage(
  chapterId: string,
  pageIndex: number,
  result: ProcessedImageResult
): void {
  const cacheKey = `processed_${chapterId}_${pageIndex}`;
  setCache(cacheKey, {
    ...result,
    processedAt: Date.now()
  });
}

// Calculate slice dimensions
export function getSliceDimensions(imageWidth: number, sliceCount: number): {
  sliceWidth: number;
  sliceHeight: number;
  horizontalSlices: number;
  verticalSlices: number;
} {
  // Calculate optimal 2D slice arrangement
  const horizontalSlices = Math.ceil(Math.sqrt(sliceCount));
  const verticalSlices = Math.ceil(sliceCount / horizontalSlices);

  const sliceWidth = Math.floor(imageWidth / horizontalSlices);
  const sliceHeight = Math.floor((imageWidth * imageWidth) / (sliceCount * horizontalSlices));

  return {
    sliceWidth,
    sliceHeight,
    horizontalSlices,
    verticalSlices
  };
}

// Validate image dimensions
export function validateImageDimensions(
  width: number,
  height: number
): { isValid: boolean; error?: string } {
  if (width < 1 || height < 1) {
    return { isValid: false, error: 'Invalid image dimensions' };
  }

  if (width > 10000 || height > 10000) {
    return {
      isValid: false,
      error: 'Image dimensions too large'
    };
  }

  return { isValid: true };
}

// Get scaled dimensions for responsive display
export function getResponsiveDimensions(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
  quality: 'high' | 'medium' | 'low'
): { width: number; height: number } {
  const qualityFactors = {
    high: 1,
    medium: 0.7,
    low: 0.5
  };

  const factor = qualityFactors[quality];
  const scaledWidth = width * factor;
  const scaledHeight = height * factor;

  // Calculate aspect ratio
  const aspectRatio = scaledWidth / scaledHeight;

  let finalWidth = scaledWidth;
  let finalHeight = scaledHeight;

  // Respect maximum dimensions
  if (finalWidth > maxWidth) {
    finalWidth = maxWidth;
    finalHeight = finalWidth / aspectRatio;
  }

  if (finalHeight > maxHeight) {
    finalHeight = maxHeight;
    finalWidth = finalHeight * aspectRatio;
  }

  return {
    width: Math.floor(finalWidth),
    height: Math.floor(finalHeight)
  };
}
