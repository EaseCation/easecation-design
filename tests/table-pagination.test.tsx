import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination, Table } from '../src';
it('renders generic table records and keyboard row action',async()=>{const user=userEvent.setup();let selected='';render(<Table columns={[{key:'name',title:'名称',dataIndex:'name'}]} data={[{id:'1',name:'北区工作区'}]} rowKey="id" onRowClick={(record: { name: string })=>{selected=record.name}}/>);const row=screen.getByText('北区工作区').closest('tr')!;row.focus();await user.keyboard('{Enter}');expect(selected).toBe('北区工作区');});
it('navigates pages and exposes current page',async()=>{const user=userEvent.setup();let page=2;render(<Pagination page={page} total={80} pageSize={10} onPageChange={(next: number)=>{page=next}}/>);expect(screen.getByRole('button',{name:'Page 2'})).toHaveAttribute('aria-current','page');await user.click(screen.getByRole('button',{name:'Next page'}));expect(page).toBe(3);});
