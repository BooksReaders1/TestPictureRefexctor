// Image processing composable
import { ref } from 'vue';
import type { Image } from '@/types';
import { getCache, setCache } from '../utils/cache';
import { handleError } from '../utils/errorHandler';

interface ImageProcessorOptions {
  concurrency?: number;
  preloadCount?: number;
}

export function useImageProcessor(options: ImageProcessorOptions = {}) {
  const processingQueue = ref<Set<string>>(new Set());
  const maxConcurrent = options.concurrency || 5;
  const preloadCount = options.preloadCount || 2;

  const isProcessing = ref(false);

  // Process image on load - handle slicing and reassembly
  const processImageOnLoad = async (
    img: HTMLImageElement,
    imageInfo: Image,
    canvas?: HTMLCanvasElement
  ): Promise<HTMLCanvasElement | null> => {
    try {
      // Check if already processed
      if (imageInfo.processed) {
        return null;
      }

      isProcessing.value = true;

      // Calculate slice parameters using MD5
      const sliceCount = calculateSliceCount(
        imageInfo.chapterId,
        imageInfo.index
      );

      // Create canvas for processing
      if (!canvas) {
        canvas = document.createElement('canvas');
      }

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

      // Calculate slice parameters
      const numSlices = sliceCount;
      const sliceWidth = Math.floor(canvas.width / numSlices);

      // Create output canvas for reassembled image
      const outputCanvas = document.createElement('canvas');
      outputCanvas.width = canvas.width;
      outputCanvas.height = canvas.height;
      const outputCtx = outputCanvas.getContext('2d');
      if (!outputCtx) {
        throw new Error('Failed to get output canvas context');
      }

      // Process each slice and reassemble in reverse order
      for (let sliceIndex = 0; sliceIndex < numSlices; sliceIndex++) {
        const sliceIndexReversed = numSlices - 1 - sliceIndex;
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

      // Mark image as processed
      imageInfo.processed = true;

      // Cache processed image data
      const cacheKey = `processed_${imageInfo.id}`;
      setCache(cacheKey, outputCanvas.toDataURL());

      isProcessing.value = false;

      return outputCanvas;
    } catch (error) {
      console.error('Error processing image:', error);
      handleError(error as Error, {
        operation: 'image-processing',
        data: { imageId: imageInfo.id }
      });
      isProcessing.value = false;
      return null;
    }
  };

  // Calculate slice count using MD5-like hash
  const calculateSliceCount = (chapterId: string, pageIndex: number): number => {
    // Use a simple hash function similar to MD5 for slicing
    const str = `${chapterId}_${pageIndex}`;
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }

    // Use hash to determine slice count (between 3-9)
    const sliceCount = Math.abs(hash % 7) + 3;
    return sliceCount;
  };

  // Preload images around current page
  const preloadImages = async (images: Image[], currentIndex: number) => {
    const preloadList: Image[] = [];

    // Preload current and surrounding pages
    for (let i = Math.max(0, currentIndex - preloadCount);
         i < Math.min(images.length, currentIndex + preloadCount + 1);
         i++) {
      if (!images[i].processed) {
        preloadList.push(images[i]);
      }
    }

    // Load in parallel with concurrency control
    await Promise.all(
      preloadList.map((img, index) =>
        loadImageWithRetry(img).catch(error => {
          console.warn(`Failed to preload image ${img.id}:`, error);
        })
      )
    );
  };

  // Load image with retry logic
  const loadImageWithRetry = async (image: Image, retries = 3): Promise<void> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const cacheKey = `raw_${image.id}`;
        const cachedData = getCache<string>(cacheKey);

        if (cachedData) {
          return; // Already loaded
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';

        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            // Cache the image
            setCache(cacheKey, img.src);
            resolve();
          };

          img.onerror = () => {
            reject(new Error(`Failed to load image ${image.id}`));
          };

          img.src = image.url;
        });

        return;
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }

        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, attempt * 500));
      }
    }
  };

  // Clean up processed images to free memory
  const cleanupProcessedImages = (images: Image[]) => {
    // Remove processed images that haven't been viewed recently
    const maxAge = 30 * 60 * 1000; // 30 minutes

    for (const image of images) {
      if (image.processed) {
        // Skip current page and next few pages
        if (image.index > -2 && image.index < 2) {
          continue;
        }

        const cacheKey = `processed_${image.id}`;
        const item = cache.get(cacheKey);

        if (item && Date.now() - item.timestamp > maxAge) {
          cache.delete(cacheKey);
        }
      }
    }
  };

  return {
    isProcessing,
    processImageOnLoad,
    calculateSliceCount,
    preloadImages,
    loadImageWithRetry,
    cleanupProcessedImages
  };
}
