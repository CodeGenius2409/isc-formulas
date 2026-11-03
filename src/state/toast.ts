import { createStore } from '../lib/store';

export interface ToastAction {
  label: string;
  run: () => void;
}

export const toastStore = createStore<{ message: string; show: boolean; action?: ToastAction }>({ message: '', show: false });

let timer: ReturnType<typeof setTimeout> | undefined;

export function toast(message: string, options: { ms?: number; action?: ToastAction } = {}): void {
  toastStore.set({ message, show: true, action: options.action });
  clearTimeout(timer);
  timer = setTimeout(() => toastStore.set((t) => ({ ...t, show: false, action: undefined })), options.ms ?? 2200);
}

export async function copyText(text: string, doneMessage: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    toast(doneMessage);
  } catch {
    toast('Copy failed: your browser blocked clipboard access');
  }
}
