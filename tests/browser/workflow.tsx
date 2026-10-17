import { createRoot } from 'react-dom/client';
import { LocaleProvider, ThemeProvider } from '../../src';
import { RecordWorkflow } from '../../examples/record-workflow/RecordWorkflow';
import '../../dist/style.css';
const query = new URLSearchParams(location.search);
createRoot(document.getElementById('root')!).render(
  <LocaleProvider locale="zh-CN">
    <ThemeProvider mode={query.get('theme') === 'dark' ? 'dark' : 'light'}>
      <div style={{ padding: 16 }}>
        <RecordWorkflow />
        <div aria-hidden="true" style={{ height: 900 }} />
      </div>
    </ThemeProvider>
  </LocaleProvider>,
);
