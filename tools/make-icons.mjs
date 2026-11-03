// توليد أيقونات PWA (192/512) بدون أي مكتبات — PNG يدوي الصنع بـ zlib
import zlib from 'node:zlib';
import fs from 'node:fs';
import path from 'node:path';

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function makePng(size, pixelFn) {
  const stride = size * 4 + 1;
  const raw = Buffer.alloc(size * stride);
  for (let y = 0; y < size; y++) {
    raw[y * stride] = 0;
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = pixelFn(x, y);
      const o = y * stride + 1 + x * 4;
      raw[o] = r; raw[o + 1] = g; raw[o + 2] = b; raw[o + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// بكسل: خلفية متدرجة نيلي→سماوي + موجتا "تدفّق" بيضاء
const pixel = (x, y, S) => {
  const t = (x + y) / (2 * (S - 1));
  let r = Math.round(99 + (34 - 99) * t);
  let g = Math.round(102 + (211 - 102) * t);
  let b = Math.round(241 + (238 - 241) * t);
  const wave = (cy, amp, period, phase, w, alpha) => {
    const fy = cy + amp * Math.sin(2 * Math.PI * x / period + phase);
    const d = Math.abs(y - fy);
    return Math.max(0, Math.min(1, (w - d) / 2 + 0.5)) * alpha;
  };
  const w = S * 0.035;
  const a = Math.max(
    wave(S * 0.50, S * 0.070, S * 0.95, -0.6, w, 1),
    wave(S * 0.64, S * 0.045, S * 0.80, 1.8, w * 0.7, 0.45),
  );
  if (a > 0) {
    r = Math.round(r + (255 - r) * a);
    g = Math.round(g + (255 - g) * a);
    b = Math.round(b + (255 - b) * a);
  }
  return [r, g, b, 255];
};

const outDir = path.resolve('icons');
fs.mkdirSync(outDir, { recursive: true });
for (const size of [192, 512]) {
  fs.writeFileSync(path.join(outDir, `icon-${size}.png`), makePng(size, (x, y) => pixel(x, y, size)));
  console.log(`✓ icons/icon-${size}.png`);
}
