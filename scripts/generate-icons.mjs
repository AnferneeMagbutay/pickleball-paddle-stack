import zlib from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Generates the PWA icon set: a teal rounded square with a white ball.
// Run with `npm run icons`. No external image libraries required.

const TEAL = [15, 118, 110];
const WHITE = [255, 255, 255];

function pngChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(zlib.crc32(body) >>> 0, 0);
  return Buffer.concat([len, body, crc]);
}

function makePng(size, pixel) {
  const stride = size * 4 + 1;
  const raw = Buffer.alloc(stride * size);
  for (let y = 0; y < size; y++) {
    raw[y * stride] = 0; // no filter for this row
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = pixel(x, y, size);
      const o = y * stride + 1 + x * 4;
      raw[o] = r;
      raw[o + 1] = g;
      raw[o + 2] = b;
      raw[o + 3] = a;
    }
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const idat = zlib.deflateSync(raw, { level: 9 });

  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

function iconPixel(x, y, size) {
  const r = size * 0.18; // corner radius
  // Rounded-square mask.
  const inX = Math.min(x, size - 1 - x);
  const inY = Math.min(y, size - 1 - y);
  if (inX < r && inY < r) {
    const dx = r - inX;
    const dy = r - inY;
    if (dx * dx + dy * dy > r * r) return [0, 0, 0, 0];
  }
  // White ball in the center.
  const cx = size / 2;
  const cy = size / 2;
  const ball = size * 0.28;
  const d = Math.hypot(x - cx, y - cy);
  const [cr, cg, cb] = d <= ball ? WHITE : TEAL;
  return [cr, cg, cb, 255];
}

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = join(here, '..', 'public');
mkdirSync(publicDir, { recursive: true });

const outputs = [
  ['pwa-192x192.png', 192],
  ['pwa-512x512.png', 512],
  ['apple-touch-icon.png', 180],
];

for (const [name, size] of outputs) {
  writeFileSync(join(publicDir, name), makePng(size, iconPixel));
  console.log(`wrote public/${name} (${size}x${size})`);
}
