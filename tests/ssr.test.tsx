it('imports public API without requiring browser globals at module scope', async () => {
  const api = await import('../src');
  expect(api.Button).toBeTypeOf('object');
  expect(api.closeTopOverlay).toBeTypeOf('function');
}, 15_000);
