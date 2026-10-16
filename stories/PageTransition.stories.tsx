import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, PageTransition, SectionCard } from '../src';
const meta = { title: 'Layout/PageTransition', component: PageTransition } satisfies Meta<
  typeof PageTransition
>;
export default meta;
type Story = StoryObj<typeof meta>;
function Example() {
  const [page, setPage] = useState(0);
  return (
    <div>
      <Button onClick={() => setPage((value) => value + 1)}>Next page</Button>
      <PageTransition transitionKey={page}>
        <SectionCard title={`Page ${page + 1}`}>
          The host owns navigation. Motion and reduced-motion rules are shared.
        </SectionCard>
      </PageTransition>
    </div>
  );
}
export const Default: Story = { render: () => <Example /> };
