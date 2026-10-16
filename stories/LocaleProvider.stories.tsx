import type { Meta, StoryObj } from '@storybook/react-vite';
import { LocaleProvider, useLocale } from '../src';
function Labels() {
  const { messages } = useLocale();
  return (
    <p>
      {messages.confirm} · {messages.cancel} · {messages.retry}
    </p>
  );
}
const meta = {
  title: 'Foundation/LocaleProvider',
  component: LocaleProvider,
  args: { locale: 'zh-CN', children: <Labels /> },
} satisfies Meta<typeof LocaleProvider>;
export default meta;
export const Chinese: StoryObj<typeof meta> = {};
export const English: StoryObj<typeof meta> = { args: { locale: 'en' } };
