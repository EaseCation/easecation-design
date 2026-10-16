import assert from 'node:assert/strict';
import { test } from 'node:test';
import { compressedSizes, sizeGrowth } from './lib/package-size.mjs';

const policy = { warningBytes: 256, warningRatio: 0.02, failureBytes: 2048, failureRatio: 0.1 };
test('small absolute changes do not fail small files', () => {
  assert.equal(sizeGrowth(1082, 1000, policy).level, 'ok');
  assert.equal(sizeGrowth(1300, 1000, policy).level, 'warning');
  assert.equal(sizeGrowth(3048, 1000, policy).level, 'warning');
  assert.equal(sizeGrowth(3049, 1000, policy).level, 'error');
});
test('larger files use proportional thresholds; reductions pass', () => {
  assert.equal(sizeGrowth(102000, 100000, policy).level, 'ok');
  assert.equal(sizeGrowth(103000, 100000, policy).level, 'warning');
  assert.equal(sizeGrowth(110001, 100000, policy).level, 'error');
  assert.equal(sizeGrowth(500, 1000, policy).level, 'ok');
});
test('measure compressed bytes deterministically, not source length', () => {
  const content = Buffer.from('semantic colors '.repeat(1000));
  const sizes = compressedSizes(content);
  assert.deepEqual(sizes, compressedSizes(content));
  assert.ok(sizes.gzip < content.length / 10);
  assert.ok(sizes.brotli < content.length / 10);
});
