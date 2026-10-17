import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, ImageViewer } from '../src';
const sample = (color: string) =>
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><rect width="600" height="400" fill="${color}"/><circle cx="300" cy="200" r="100" fill="white"/></svg>`,
  );
const meta = { title: 'Components/Overlay/ImageViewer', component: ImageViewer } satisfies Meta<
  typeof ImageViewer
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Gallery: Story = {
  args: {
    open: false,
    onOpenChange: () => {},
    index: 0,
    onIndexChange: () => {},
    images: [
      { src: sample('#176e86'), alt: 'Blue circle' },
      { src: sample('#ab5824'), alt: 'Orange circle' },
    ],
  },
  render: function Preview(args) {
    const [open, setOpen] = useState(false),
      [index, setIndex] = useState(0);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Preview images</Button>
        <ImageViewer
          {...args}
          open={open}
          onOpenChange={setOpen}
          index={index}
          onIndexChange={setIndex}
        />
      </>
    );
  },
};
