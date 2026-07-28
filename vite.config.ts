import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [react(), dts({ include: ['src'], rollupTypes: true })],
  build: {
    lib: { entry: 'src/index.ts', formats: ['es'], fileName: 'index' },
    cssCodeSplit: false,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: { assetFileNames: (asset) => (asset.name?.endsWith('.css') ? 'style.css' : 'assets/[name][extname]') },
    },
    sourcemap: true,
  },
});