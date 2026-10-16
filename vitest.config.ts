import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // Node script tests run separately through pack:check with node --test.
    include: ['tests/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: true,
    maxWorkers: 2,
  },
});
