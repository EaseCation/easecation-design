import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Button,
  Select,
  Combobox,
  MultiSelect,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
  ThemeProvider,
  useReducedMotion,
} from '../../src';
import '../../dist/style.css';

const options = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
];
const query = new URLSearchParams(location.search);
const requestedSide = query.get('side');
const side =
  requestedSide === 'top' || requestedSide === 'left' || requestedSide === 'right'
    ? requestedSide
    : 'bottom';
const control = query.get('control');
function Motion() {
  const reducedMotion = useReducedMotion();
  const [count, setCount] = useState(0);
  return (
    <main
      data-reduced-motion={reducedMotion}
      style={{
        padding: 16,
        display: 'grid',
        gap: 12,
        position: 'fixed',
        left: 0,
        right: side === 'left' || side === 'right' ? 'auto' : 0,
        ...(side === 'left' || side === 'right'
          ? { left: '50%', width: 200, transform: 'translateX(-50%)', top: '40%' }
          : {}),
        [side === 'top' ? 'bottom' : 'top']: 0,
      }}
    >
      {control === 'keyboard' && (
        <Button data-testid="keyboard" onClick={() => setCount((value) => value + 1)}>
          Action {count}
        </Button>
      )}
      {control === 'select' && <Select label="Select" options={options} />}
      {control === 'combo' && <Combobox label="Combo" options={options} />}
      {control === 'multi' && <MultiSelect label="Multi" options={options} />}
      {control === 'menu' && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={side}>
            <DropdownMenuItem>First</DropdownMenuItem>
            <DropdownMenuItem>Second</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {control === 'popover' && (
        <Popover>
          <PopoverTrigger asChild>
            <Button>Popover</Button>
          </PopoverTrigger>
          <PopoverContent side={side}>
            <Button>Inside</Button>
          </PopoverContent>
        </Popover>
      )}
      {control === 'tooltip' && (
        <Tooltip content="Helpful tip" placement={side}>
          <Button>Tooltip</Button>
        </Tooltip>
      )}
    </main>
  );
}
createRoot(document.getElementById('root')!).render(
  <ThemeProvider mode={query.get('theme') === 'dark' ? 'dark' : 'light'}>
    <Motion />
  </ThemeProvider>,
);
