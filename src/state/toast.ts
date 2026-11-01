import { createStore } from '../lib/store';

export const toastStore = createStore<{ message: string; show: boolean }>({ message: '', show: false });

let timer: ReturnType<typeof setTimeout> | undefined;

export function toast(message: string): void {
  toastStore.set({ message, show: true });
  clearTimeout(timer);
  timer = setTimeout(() => toastStore.set((t) => ({ ...t, show: false })), 2200);
}

export async function copyText(text: string, doneMessage: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    toast(doneMessage);
  } catch {
    toast('Copy failed: your browser blocked clipboard access');
  }
}
