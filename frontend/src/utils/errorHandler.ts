// Error handling utilities
import { showToast } from './toast';

export interface ErrorContext {
  operation: string;
  data?: any;
}

export function handleError(error: Error | string, context: ErrorContext) {
  const message = typeof error === 'string' ? error : error.message;

  console.error(`Error in ${context.operation}:`, error);

  // Show error toast
  showToast(message, 'error');

  // Store error in localStorage for debugging
  const errorLog = {
    message,
    operation: context.operation,
    data: context.data,
    timestamp: Date.now()
  };

  const errors = JSON.parse(localStorage.getItem('errorLog') || '[]');
  errors.push(errorLog);
  localStorage.setItem('errorLog', JSON.stringify(errors));
}

export function shouldRetry(error: Error): boolean {
  const retryableErrors = ['NetworkError', 'TimeoutError', '500', '503'];
  const message = error.message.toLowerCase();

  return retryableErrors.some(err => message.includes(err.toLowerCase()));
}

export function retryOperation(context: ErrorContext, maxAttempts = 3): Promise<void> {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const attempt = async () => {
      attempts++;

      try {
        // Simulate retry logic - replace with actual retry
        await new Promise(resolveDelay => setTimeout(resolveDelay, 1000 * attempts));
        resolve();
      } catch (error) {
        if (attempts >= maxAttempts) {
          reject(error);
        } else {
          console.log(`Retry ${attempts}/${maxAttempts} for ${context.operation}`);
          attempt();
        }
      }
    };

    attempt();
  });
}

export function formatError(error: any): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null) {
    if (error.message) {
      return error.message;
    }
    if (error.code) {
      return `Error ${error.code}: ${error.message || 'Unknown error'}`;
    }
  }

  return 'An unknown error occurred';
}
