import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Button,
  Checkbox,
  Combobox,
  Field,
  Form,
  Input,
  Modal,
  MultiSelect,
  Select,
  ThemeProvider,
} from '../../src';
import { Dialog, DialogContent, DialogTitle } from '../../src/compat';
import '../../dist/style.css';

const options = [
  { value: 'one', label: 'First option' },
  { value: 'two', label: 'Second option' },
];
function Controls() {
  return (
    <>
      <Button pressable={false}>Action</Button>
      <Input aria-label="Text" />
      <Select aria-label="Selection" options={options} />
      <Combobox aria-label="Search" options={options} />
      <MultiSelect aria-label="Tags" options={options} />
      <Checkbox label="Checked" defaultChecked />
    </>
  );
}
function Fixture() {
  const [modal, setModal] = useState(false);
  const [compat, setCompat] = useState(false);
  const [gold, setGold] = useState(true);
  const [custom, setCustom] = useState(false);
  return (
    <main style={{ padding: 24 }}>
      <section id="default">
        <ThemeProvider mode="light">
          <Controls />
        </ThemeProvider>
      </section>
      <section id="override">
        <ThemeProvider
          mode="light"
          tokens={{
            '--ec-color-primary': 'rgb(220 38 38)',
            '--ec-radius-md': '12px',
            '--ec-control-md': '56px',
          }}
        >
          <Controls />
        </ThemeProvider>
      </section>
      <section id="compact">
        <ThemeProvider mode="light" density="compact">
          <Controls />
        </ThemeProvider>
      </section>
      <section id="nested">
        <ThemeProvider mode="dark">
          <Button pressable={false}>Outer dark</Button>
          <ThemeProvider mode="light">
            <Button pressable={false}>Inner light</Button>
          </ThemeProvider>
        </ThemeProvider>
      </section>
      <section id="field">
        <ThemeProvider mode="light">
          <Form>
            <Field label="Field selection" required error="Selection error">
              {(props) => <Select {...props} options={options} />}
            </Field>
            <Field label="Field search" required error="Search error">
              {(props) => <Combobox {...props} options={options} />}
            </Field>
            <Field label="Field tags" required error="Tags error">
              {(props) => <MultiSelect {...props} options={options} />}
            </Field>
          </Form>
        </ThemeProvider>
      </section>
      <section id="portal">
        <ThemeProvider
          mode="dark"
          colorTheme={gold ? 'black-gold' : 'default'}
          tokens={{
            '--ec-font-sans': 'monospace',
            '--ec-color-popover': custom ? 'rgb(88 28 135)' : 'rgb(15 23 42)',
            ...(custom ? { '--ec-color-primary': 'rgb(220 38 38)' } : {}),
          }}
        >
          <Button pressable={false} onClick={() => setModal(true)}>
            Open modal
          </Button>
          <Button pressable={false} onClick={() => setCompat(true)}>
            Open compat
          </Button>
          <Modal
            open={modal}
            onOpenChange={setModal}
            title="Theme inheritance"
            style={{ maxHeight: 280 }}
          >
            <Button pressable={false} onClick={() => setGold((value) => !value)}>
              Change color theme
            </Button>
            <Button pressable={false} onClick={() => setCustom((value) => !value)}>
              Change tokens
            </Button>
            <div style={{ height: 160 }} />
            <Combobox label="Modal search" options={options} />
            <MultiSelect label="Modal tags" options={options} />
          </Modal>
          <Dialog open={compat} onOpenChange={setCompat}>
            <DialogContent>
              <DialogTitle>Compat inheritance</DialogTitle>
              <Button pressable={false}>Compat action</Button>
            </DialogContent>
          </Dialog>
        </ThemeProvider>
      </section>
    </main>
  );
}
createRoot(document.getElementById('root')!).render(<Fixture />);
