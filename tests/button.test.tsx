import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../src';
it('forwards interaction and blocks it while loading',async()=>{const user=userEvent.setup();let count=0;const {rerender}=render(<Button onClick={()=>count++}>保存</Button>);await user.click(screen.getByRole('button',{name:'保存'}));expect(count).toBe(1);rerender(<Button loading onClick={()=>count++}>保存</Button>);expect(screen.getByRole('button',{name:'保存'})).toBeDisabled();});