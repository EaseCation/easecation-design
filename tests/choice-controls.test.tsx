import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox, Switch } from '../src';
it('supports checkbox and switch keyboard interaction',async()=>{const user=userEvent.setup();render(<><Checkbox label="接受协议"/><Switch label="自动同步"/></>);const checkbox=screen.getByRole('checkbox',{name:'接受协议'});await user.click(checkbox);expect(checkbox).toBeChecked();const toggle=screen.getByRole('switch',{name:'自动同步'});toggle.focus();await user.keyboard(' ');expect(toggle).toHaveAttribute('aria-checked','true');});
it('announces indeterminate checkbox state',()=>{render(<Checkbox label="选择全部" indeterminate/>);expect(screen.getByRole('checkbox',{name:'选择全部'})).toHaveAttribute('aria-checked','mixed');});