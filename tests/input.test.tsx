import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../src';
it('supports typing, invalid state and clearing',async()=>{const user=userEvent.setup();let cleared=false;render(<Input aria-label="名称" status="error" clearable defaultValue="Console" onClear={()=>{cleared=true}}/>);const input=screen.getByLabelText('名称');expect(input).toHaveAttribute('aria-invalid','true');await user.clear(input);await user.type(input,'Design');expect(input).toHaveValue('Design');await user.click(screen.getByRole('button',{name:'Clear input'}));expect(cleared).toBe(true);expect(input).toHaveValue('');});
