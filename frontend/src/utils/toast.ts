// Toast notification utility
type ToastType = 'success' | 'error' | 'warning' | 'info';

const toastConfig: Record<ToastType, { bg: string; icon: string }> = {
  success: { bg: '#4caf50', icon: '✓' },
  error: { bg: '#f44336', icon: '✕' },
  warning: { bg: '#ff9800', icon: '⚠' },
  info: { bg: '#2196f3', icon: 'ℹ' }
};

let toastContainer: HTMLDivElement | null = null;

function createToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9998;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

export function showToast(
  message: string,
  type: ToastType = 'info',
  duration = 3000
) {
  createToastContainer();

  const config = toastConfig[type];
  const toast = document.createElement('div');
  toast.style.cssText = `
    background-color: ${config.bg};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    min-width: 200px;
    pointer-events: auto;
    animation: slideUp 0.3s ease-out;
  `;

  toast.innerHTML = `<span>${config.icon}</span><span>${message}</span>`;

  if (toastContainer) {
    toastContainer.appendChild(toast);
  }

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease-out';
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
      if (toastContainer && toastContainer.children.length === 0) {
        if (toastContainer.parentElement) {
          toastContainer.parentElement.removeChild(toastContainer);
        }
        toastContainer = null;
      }
    }, 300);
  }, duration);
}

// Helper functions for convenience
export function showToastSuccess(message: string) {
  showToast(message || '操作成功', 'success');
}

export function showToastError(message: string) {
  showToast(message || '操作失败', 'error');
}

export function showToastWarning(message: string) {
  showToast(message || '警告信息', 'warning');
}

export function clearToast() {
  if (toastContainer && toastContainer.children.length > 0) {
    toastContainer.innerHTML = '';
  }
}

// Add CSS keyframes dynamically
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
}
