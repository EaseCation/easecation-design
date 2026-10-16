import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import packageJson from './package.json';

const externalPackages = [
  ...Object.keys(packageJson.dependencies),
  ...Object.keys(packageJson.peerDependencies),
];

export default defineConfig({
  plugins: [react(), dts({ include: ['src'], bundleTypes: true })],
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
      preserveEntrySignatures: 'allow-extension',
      external: (id) =>
        externalPackages.some(
          (packageName) => id === packageName || id.startsWith(`${packageName}/`),
        ),
      output: {
        // Keep the common interaction primitives independent of advanced controls.
        // Few semantic chunks avoid per-module compression overhead while allowing
        // consumer routes to defer tables, pickers and other documentation examples.
        strictExecutionOrder: false,
        codeSplitting: {
          includeDependenciesRecursively: false,
          groups: [
            {
              name(id) {
                if (/\/src\/(hooks|theme|locale|platform)\//.test(id)) return 'foundation';
                if (/\/src\/utils\//.test(id)) return 'advanced-controls';
                const component = id.match(/\/src\/components\/([^/]+)\//)?.[1];
                if (!component || component === 'Essentials') return;
                const core = new Set([
                  'Button',
                  'Badge',
                  'Card',
                  'Switch',
                  'Modal',
                  'Drawer',
                  'DropdownMenu',
                  'ThemeModeMenuItems',
                  'Spinner',
                  'Skeleton',
                  'PageSkeleton',
                  'PageTransition',
                  'Input',
                ]);
                return core.has(component) ? 'controls' : 'advanced-controls';
              },
            },
          ],
        },
        assetFileNames: (asset) =>
          asset.name?.endsWith('.css') ? 'style.css' : 'assets/[name][extname]',
      },
    },
    sourcemap: true,
  },
});
