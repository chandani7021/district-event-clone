type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  visible: boolean;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  type: ToastType;
}

let toastState: ToastState = {
  visible: false,
  message: '',
  type: 'info',
};

const listeners = new Set<() => void>();

export function getToastState() {
  return toastState;
}

export function showToast(
  message: string, 
  actionLabel?: string, 
  onAction?: () => void,
  type: ToastType = 'info'
) {
  toastState = {
    visible: true,
    message,
    actionLabel,
    onAction,
    type,
  };
  listeners.forEach((l) => l());

  // Auto-hide after 3 seconds
  setTimeout(() => {
    hideToast();
  }, 3000);
}

export function hideToast() {
  toastState = { ...toastState, visible: false };
  listeners.forEach((l) => l());
}

export function subscribeToToast(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
