import { createElement } from 'react';
import type { Preview } from '@storybook/react-vite';
import { getStoryLocale, StoryLocaleProvider } from './story-locale';
import '@fontsource-variable/outfit';
import '@fontsource-variable/geist';
import '../src/styles/index.css';
import './preview.css';

const preview: Preview = {
  globalTypes: {
    locale: {
      description: 'Language / 语言',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'zh-CN', title: '简体中文' },
          { value: 'en', title: 'English' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    locale: 'zh-CN',
  },
  decorators: [
    (Story, context) =>
      createElement(
        StoryLocaleProvider,
        { locale: getStoryLocale(context.globals.locale) },
        createElement(Story),
      ),
  ],
  parameters: {
    controls: { expanded: true },
    a11y: { test: 'todo' },
    backgrounds: { default: 'console', values: [{ name: 'console', value: '#f7f8fb' }] },
  },
};
export default preview;
