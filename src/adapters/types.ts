export interface PlatformAdapter {
  name: string;
  onBackButton?(handler: () => boolean | void): () => void;
  pickFiles?(options?: { accept?: string; multiple?: boolean }): Promise<File[]>;
  setSystemTheme?(theme: 'light' | 'dark'): Promise<void> | void;
}
export const webPlatformAdapter: PlatformAdapter = { name: 'web' };
