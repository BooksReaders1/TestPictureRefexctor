import JSZip from 'jszip';
import type { Chapter, Image } from '@/types';
import { showToast } from '@/utils/toast';
import { handleError } from '@/utils/errorHandler';

interface DownloadProgress {
  currentFile: number;
  totalFiles: number;
  progress: number;
  currentFileName: string;
}

class DownloadService {
  private onProgressCallbacks: ((progress: DownloadProgress) => void)[] = [];

  setProgressCallback(callback: (progress: DownloadProgress) => void) {
    this.onProgressCallbacks.push(callback);
  }

  clearProgressCallbacks() {
    this.onProgressCallbacks = [];
  }

  async downloadChapterAsZip(chapter: Chapter, mangaId: string, chapterTitle: string): Promise<void> {
    return new Promise((resolve, reject) => {
      showToast(`开始下载 "${chapterTitle}"...`, 'info');

      const zip = new JSZip();
      const folder = zip.folder(`章节_${chapter.order}_${chapter.id}`);

      // Download each image
      this.downloadImagesSequentially(
        chapter.images,
        folder,
        (progress) => {
          this.notifyProgress(progress);
        }
      )
        .then(() => {
          // Generate ZIP file
          zip.generateAsync({ type: 'blob' })
            .then((blob) => {
              this.saveFile(blob, `${chapterTitle}.zip`);
              this.resetProgress();
              showToast(`下载完成: ${chapterTitle}.zip`, 'success');
              resolve();
            })
            .catch((error) => {
              this.resetProgress();
              handleError(error, { operation: 'zip-generation' });
              reject(error);
            });
        })
        .catch((error) => {
          this.resetProgress();
          handleError(error, { operation: 'download' });
          reject(error);
        });
    });
  }

  private async downloadImagesSequentially(
    images: Image[],
    folder: JSZip,
    onProgress: (progress: DownloadProgress) => void
  ): Promise<string[]> {
    const downloadedFiles: string[] = [];
    const totalFiles = images.length;
    const maxConcurrent = 3; // Limit concurrent downloads

    for (let i = 0; i < images.length; i += maxConcurrent) {
      const batch = images.slice(i, i + maxConcurrent);
      const batchPromises = batch.map(async (image, batchIndex) => {
        try {
          const fileIndex = i + batchIndex;
          const fileName = `page_${image.index + 1}.webp`;

          // Create a promise that resolves when the image is loaded
          const img = new Image();
          img.crossOrigin = 'anonymous';

          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error(`Failed to load image ${image.id}`));

            img.src = image.url;
          });

          // Convert image to blob
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              if (blob) {
                folder.file(fileName, blob);
                downloadedFiles.push(fileName);
              }
            }, 'image/webp');
          }
        } catch (error) {
          console.error(`Failed to download image ${image.id}:`, error);
          // Continue with next image even if one fails
        }
      });

      await Promise.all(batchPromises);

      // Notify progress after each batch
      const progress = {
        currentFile: Math.min(i + maxConcurrent, totalFiles),
        totalFiles,
        progress: Math.round(((i + maxConcurrent) / totalFiles) * 100),
        currentFileName: `正在下载第 ${Math.min(i + maxConcurrent, totalFiles)} / ${totalFiles} 页`
      };

      onProgress(progress);
    }

    return downloadedFiles;
  }

  private saveFile(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    // Handle iOS/Safari
    if ('msLaunchUri' in navigator && 'msSaveBlob' in navigator) {
      // Windows IE/Edge
      (navigator as any).msSaveBlob(blob, fileName);
    } else if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
      // iOS/Safari
      link.addEventListener('click', () => {
        URL.revokeObjectURL(url);
      });

      // Try to open in new window
      window.open(url, '_blank');
    } else {
      // Standard download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(url), 100);
    }
  }

  private notifyProgress(progress: DownloadProgress) {
    this.onProgressCallbacks.forEach(callback => callback(progress));
  }

  private resetProgress() {
    this.notifyProgress({
      currentFile: 0,
      totalFiles: 0,
      progress: 0,
      currentFileName: ''
    });
  }
}

export default new DownloadService();
