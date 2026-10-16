import { brotliCompressSync, constants, gzipSync } from 'node:zlib';

export function compressedSizes(content) {
  return {
    gzip: gzipSync(content, { level: 9 }).length,
    brotli: brotliCompressSync(content, {
      params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
    }).length,
  };
}

export function sizeGrowth(
  current,
  baseline,
  { warningBytes, warningRatio, failureBytes, failureRatio },
) {
  const delta = current - baseline;
  const warning = Math.max(warningBytes, baseline * warningRatio);
  const failure = Math.max(failureBytes, baseline * failureRatio);
  return { delta, level: delta > failure ? 'error' : delta > warning ? 'warning' : 'ok' };
}
