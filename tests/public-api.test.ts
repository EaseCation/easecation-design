import * as publicApi from '../src';
import * as antdCompat from '../src/antd-compat';
import { Button } from '../src/components/Button';
import { Input } from '../src/components/Input';
import { Modal } from '../src/components/Modal';

it('exports the formal components from the package root', () => {
  expect(publicApi.Button).toBe(Button);
  expect(publicApi.Input).toBe(Input);
  expect(publicApi.Modal).toBe(Modal);
});

it('keeps Ant Design compatibility symbols out of the package root', () => {
  expect('Alert' in publicApi).toBe(false);
  expect('ConfigProvider' in publicApi).toBe(false);
  expect('AntButton' in publicApi).toBe(false);

  expect(antdCompat.Alert).toBeTypeOf('function');
  expect(antdCompat.ConfigProvider).toBeTypeOf('function');
  expect(antdCompat.Button).toBeDefined();
});
