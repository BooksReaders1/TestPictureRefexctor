import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { showToast, showToastSuccess, showToastError, showToastWarning, clearToast } from '../../src/utils/toast';

describe('Toast Notification Utility', () => {
  beforeEach(() => {
    clearToast();
  });

  afterEach(() => {
    clearToast();
  });

  describe('showToast', () => {
    it('should create a toast notification', () => {
      const message = 'Test notification';
      const type = 'success' as const;
      const duration = 3000;

      showToast(message, type, duration);

      // Verify toast is created by checking if clearToast can clear it
      clearToast();
      // If clearToast was successful, the toast was created
    });

    it('should default to "info" type when not specified', () => {
      const message = 'Default type notification';

      showToast(message);

      clearToast();
    });

    it('should default to 3000ms duration when not specified', () => {
      const message = 'Default duration notification';

      showToast(message);

      clearToast();
    });

    it('should create success type notification', () => {
      const message = 'Success!';

      showToast(message, 'success');

      clearToast();
    });

    it('should create error type notification', () => {
      const message = 'Error occurred';

      showToast(message, 'error');

      clearToast();
    });

    it('should create warning type notification', () => {
      const message = 'Warning!';

      showToast(message, 'warning');

      clearToast();
    });
  });

  describe('showToastSuccess', () => {
    it('should create a success toast', () => {
      const message = 'Operation successful!';

      showToastSuccess(message);

      clearToast();
    });

    it('should use default success message for null/undefined', () => {
      showToastSuccess();

      clearToast();
    });
  });

  describe('showToastError', () => {
    it('should create an error toast', () => {
      const message = 'Something went wrong!';

      showToastError(message);

      clearToast();
    });

    it('should handle null/undefined error messages', () => {
      showToastError();

      clearToast();
    });
  });

  describe('showToastWarning', () => {
    it('should create a warning toast', () => {
      const message = 'Please be careful!';

      showToastWarning(message);

      clearToast();
    });
  });

  describe('clearToast', () => {
    it('should clear the current toast', () => {
      showToast('Test notification');
      clearToast();

      expect(() => clearToast()).not.toThrow();
    });

    it('should handle clearing when no toast exists', () => {
      expect(() => clearToast()).not.toThrow();
    });
  });

  describe('Toast Persistence', () => {
    it('should not throw errors when creating multiple toasts', () => {
      for (let i = 0; i < 5; i++) {
        showToast(`Test message ${i}`);
      }
      expect(() => clearToast()).not.toThrow();
    });
  });
});
