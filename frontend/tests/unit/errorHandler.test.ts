import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleError, ErrorContext } from '../../src/utils/errorHandler';

describe('Error Handler Utility', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.removeItem('errorLog');
  });

  describe('handleError', () => {
    it('should handle standard Error objects', () => {
      const error = new Error('Test error message');
      const context: ErrorContext = { operation: 'test-operation' };

      expect(() => {
        handleError(error, context);
      }).not.toThrow();

      expect(console.error).toHaveBeenCalledWith(
        'Error in test-operation:',
        error
      );
    });

    it('should handle Error objects with details', () => {
      const error = new Error('Network error');
      error.name = 'NetworkError';
      error.stack = 'Stack trace...';
      error.cause = 'Connection refused';

      const context: ErrorContext = { operation: 'fetch' };

      expect(() => {
        handleError(error, context);
      }).not.toThrow();

      expect(console.error).toHaveBeenCalledWith(
        'Error in fetch:',
        error
      );
    });

    it('should handle string errors', () => {
      const error = 'String error message';
      const context: ErrorContext = { operation: 'parse' };

      expect(() => {
        handleError(error, context);
      }).not.toThrow();

      expect(console.error).toHaveBeenCalledWith(
        'Error in parse:',
        error
      );
    });

    it('should handle null/undefined errors gracefully', () => {
      const error = null;
      const context: ErrorContext = { operation: 'unknown' };

      expect(() => {
        handleError(error, context);
      }).not.toThrow();

      expect(console.error).toHaveBeenCalledWith(
        'Error in unknown:',
        null
      );
    });

    it('should include context data in error output', () => {
      const error = new Error('Test error');
      const context: ErrorContext = {
        operation: 'data-fetch',
        data: { userId: '123', requestId: 'req-456' },
        component: 'UserList'
      };

      expect(() => {
        handleError(error, context);
      }).not.toThrow();

      expect(console.error).toHaveBeenCalled();
      const callArgs = console.error.mock.calls[0];
      expect(callArgs).toContain('data-fetch');
      expect(callArgs).toContain('UserList');
    });

    it('should handle errors without context', () => {
      const error = new Error('No context error');
      const context: ErrorContext = { operation: 'default' };

      expect(() => {
        handleError(error, context);
      }).not.toThrow();
    });
  });

  describe('Error Context', () => {
    it('should create error context with minimal data', () => {
      const context: ErrorContext = { operation: 'operation' };

      expect(context.operation).toBe('operation');
      expect(context.data).toBeUndefined();
      expect(context.component).toBeUndefined();
    });

    it('should create error context with all optional fields', () => {
      const context: ErrorContext = {
        operation: 'operation',
        data: { key: 'value' },
        component: 'ComponentName'
      };

      expect(context.operation).toBe('operation');
      expect(context.data).toEqual({ key: 'value' });
      expect(context.component).toBe('ComponentName');
    });
  });

  describe('Error Recovery', () => {
    it('should not throw errors from handleError', () => {
      const error = new Error('Error that should be caught');
      const context: ErrorContext = { operation: 'operation' };

      expect(() => {
        handleError(error, context);
      }).not.toThrow();
    });

    it('should handle errors without breaking execution', () => {
      const errors: Error[] = [];

      for (let i = 0; i < 100; i++) {
        const error = new Error(`Error ${i}`);
        const context: ErrorContext = { operation: `test-${i}` };
        handleError(error, context);
        errors.push(error);
      }

      expect(errors.length).toBe(100);
      expect(console.error).toHaveBeenCalledTimes(100);
    });
  });
});
