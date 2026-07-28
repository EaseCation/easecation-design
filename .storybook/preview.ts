import type { Preview } from '@storybook/react-vite';
import '../src/styles/index.css';

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    a11y: { test: 'todo' },
    backgrounds: { default: 'console', values: [{ name: 'console', value: '#f7f8fb' }] },
  },
};
export default preview;