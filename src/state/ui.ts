import { createStore } from '../lib/store';

export const paletteStore = createStore(false);
export const openPalette = (): void => paletteStore.set(true);
export const closePalette = (): void => paletteStore.set(false);

export const contentsSheetStore = createStore(false);
export const openContentsSheet = (): void => contentsSheetStore.set(true);
export const closeContentsSheet = (): void => contentsSheetStore.set(false);
