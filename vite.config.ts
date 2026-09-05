import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import packageJson from './package.json';

const externalPackages = [
  ...Object.keys(packageJson.dependencies),
  ...Object.keys(packageJson.peerDependencies),
];

export default defineConfig({
  plugins: [react(), dts({ include: ['src'], rollupTypes: true })],
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        compat: 'src/compat.ts',
        'antd-compat': 'src/antd-compat.ts',
        tokens: 'src/tokens/index.ts',
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: (id) =>
        externalPackages.some(
          (packageName) => id === packageName || id.startsWith(`${packageName}/`),
        ),
      output: {
        assetFileNames: (asset) =>
          asset.name?.endsWith('.css') ? 'style.css' : 'assets/[name][extname]',
      },
    },
    sourcemap: true,
  },
});
