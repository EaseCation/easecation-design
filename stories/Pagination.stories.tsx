import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from '../src';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  args: { page: 1, onPageChange: () => {} },
} satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;
function FullExample() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  return (
    <Pagination
      page={page}
      total={246}
      pageSize={size}
      onPageChange={setPage}
      onPageSizeChange={(next) => {
        setSize(next);
        setPage(1);
      }}
      showPageJump
    />
  );
}
function CursorExample() {
  const [page, setPage] = useState(1);
  return <Pagination page={page} hasNextPage={page < 4} onPageChange={setPage} />;
}
export const Full: Story = { render: () => <FullExample /> };
export const UnknownTotal: Story = { render: () => <CursorExample /> };
export const Pending: Story = {
  args: {
    page: 2,
    total: 300,
    disabled: true,
    showPageJump: true,
    onPageChange: () => {},
    onPageSizeChange: () => {},
  },
};
