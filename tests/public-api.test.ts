import * as publicApi from '../src';
import * as antdCompat from '../src/antd-compat';
import { ActionCard } from '../src/components/ActionCard';
import { Alert } from '../src/components/Alert';
import { Button } from '../src/components/Button';
import { DescriptionList } from '../src/components/DescriptionList';
import { Input } from '../src/components/Input';
import { Modal } from '../src/components/Modal';
import { SegmentedControl } from '../src/components/SegmentedControl';

it('exports the formal components from the package root', () => {
  expect(publicApi.Button).toBe(Button);
  expect(publicApi.ActionCard).toBe(ActionCard);
  expect(publicApi.Input).toBe(Input);
  expect(publicApi.Modal).toBe(Modal);
  expect(publicApi.Alert).toBe(Alert);
  expect(publicApi.SegmentedControl).toBe(SegmentedControl);
  expect(publicApi.DescriptionList).toBe(DescriptionList);
});

it('keeps Ant Design compatibility symbols out of the package root', () => {
  expect('ConfigProvider' in publicApi).toBe(false);
  expect('AntButton' in publicApi).toBe(false);

  expect(antdCompat.Alert).toBeTypeOf('function');
  expect(publicApi.Alert).not.toBe(antdCompat.Alert);
  expect(antdCompat.ConfigProvider).toBeTypeOf('function');
  expect(antdCompat.Button).toBeDefined();
});
