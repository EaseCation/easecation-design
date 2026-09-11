import * as publicApi from '../src';
import * as antdCompat from '../src/antd-compat';
import { ActionCard } from '../src/components/ActionCard';
import { Alert } from '../src/components/Alert';
import { Button } from '../src/components/Button';
import { FileButton } from '../src/components/FileButton';
import { DescriptionList } from '../src/components/DescriptionList';
import { Input } from '../src/components/Input';
import { Modal } from '../src/components/Modal';
import { SegmentedControl } from '../src/components/SegmentedControl';
import { TreeView } from '../src/components/TreeView';

it('exports the formal components from the package root', () => {
  expect(publicApi.Button).toBe(Button);
  expect(publicApi.ActionCard).toBe(ActionCard);
  expect(publicApi.Input).toBe(Input);
  expect(publicApi.Modal).toBe(Modal);
  expect(publicApi.Alert).toBe(Alert);
  expect(publicApi.SegmentedControl).toBe(SegmentedControl);
  expect(publicApi.DescriptionList).toBe(DescriptionList);
  expect(publicApi.TreeView).toBe(TreeView);
  expect(publicApi.FileButton).toBe(FileButton);
  expect(publicApi.cn('px-2', 'px-4')).toBe('px-4');
  expect(publicApi.BadgeButton).toBeTypeOf('object');
});

it('keeps Ant Design compatibility symbols out of the package root', () => {
  expect('ConfigProvider' in publicApi).toBe(false);
  expect('AntButton' in publicApi).toBe(false);

  expect(antdCompat.Alert).toBeTypeOf('function');
  expect(publicApi.Alert).not.toBe(antdCompat.Alert);
  expect(antdCompat.ConfigProvider).toBeTypeOf('function');
  expect(antdCompat.Button).toBeDefined();
});
