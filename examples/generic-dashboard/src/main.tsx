import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  Button,
  Container,
  PageHeader,
  ResponsiveGrid,
  Surface,
  ThemeProvider,
} from '@easecation/design';
import '@easecation/design/style.css';
function App() {
  return (
    <ThemeProvider>
      <Container style={{ padding: '2rem 0' }}>
        <PageHeader
          eyebrow="Operations"
          title="Workspace health"
          description="A neutral example for teams, stores, content platforms and connected products."
          actions={<Button>Create report</Button>}
        />
        <ResponsiveGrid>
          {[
            ['Active teams', '128'],
            ['Automations', '4,862'],
            ['Availability', '99.97%'],
          ].map(([label, value]) => (
            <Surface key={label} style={{ padding: '1.25rem' }}>
              <small>{label}</small>
              <strong style={{ display: 'block', fontSize: '2rem', marginTop: '.75rem' }}>
                {value}
              </strong>
            </Surface>
          ))}
        </ResponsiveGrid>
      </Container>
    </ThemeProvider>
  );
}
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
