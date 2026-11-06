// Gera os arquivos de marca a partir de design/logo-original.png.
// npm run brand — só rode ao trocar o logo; saídas: src/assets/logo.png, public/favicon.ico,
// public/apple-touch-icon.png e public/og-default.png.
import { readFileSync, writeFileSync } from 'node:fs';
import opentype from 'opentype.js';
import sharp from 'sharp';

const SRC = 'design/logo-original.png';
const PAPER = '#F5EFE3',
  GOLD = '#E3B23C';

// 1) logo.png: o original é opaco (fora do quadrado = preto puro). Tira os cantos externos
//    (flood fill a partir do canto) e suaviza a borda → selo arredondado com transparência.
const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const out = Buffer.from(data);
const seen = new Uint8Array(W * H);
const stack = [0];
while (stack.length) {
  const i = stack.pop();
  if (seen[i]) continue;
  seen[i] = 1;
  const o = i * 4;
  if (data[o] > 3 || data[o + 1] > 3 || data[o + 2] > 3) continue;
  out[o + 3] = 0;
  const x = i % W,
    y = (i / W) | 0;
  if (x > 0) stack.push(i - 1);
  if (x < W - 1) stack.push(i + 1);
  if (y > 0) stack.push(i - W);
  if (y < H - 1) stack.push(i + W);
}
const rgb = await sharp(out, { raw: { width: W, height: H, channels: 4 } })
  .removeAlpha()
  .png()
  .toBuffer();
const alpha = await sharp(out, { raw: { width: W, height: H, channels: 4 } })
  .extractChannel(3)
  .blur(1)
  .png()
  .toBuffer();
// caixa do selo = região que sobrou depois do flood fill
let x0 = W,
  y0 = H,
  x1 = 0,
  y1 = 0;
for (let i = 0; i < W * H; i++) {
  if (out[i * 4 + 3] === 0) continue;
  const x = i % W,
    y = (i / W) | 0;
  if (x < x0) x0 = x;
  if (x > x1) x1 = x;
  if (y < y0) y0 = y;
  if (y > y1) y1 = y;
}
// (joinChannel e extract no mesmo pipeline rodam em ordem trocada → dois passos)
const joined = await sharp(rgb).joinChannel(alpha).png().toBuffer();
const logo = await sharp(joined)
  .extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 })
  .resize(1024, 1024, { fit: 'fill' })
  .png({ palette: true, compressionLevel: 9 })
  .toBuffer();
console.log('selo:', x0, y0, x1, y1);
writeFileSync('src/assets/logo.png', logo);

// 2) Ícones: recorte quadrado em volta do círculo (sem a margem preta), opaco.
const icon = (size) =>
  sharp(SRC)
    .extract({ left: 150, top: 135, width: 940, height: 940 })
    .resize(size, size)
    .png()
    .toBuffer();
writeFileSync('public/apple-touch-icon.png', await icon(180));

// favicon.ico com 16/32/48 (PNG embrulhado em contêiner ICO)
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map(icon));
const head = Buffer.alloc(6 + 16 * sizes.length);
head.writeUInt16LE(1, 2);
head.writeUInt16LE(sizes.length, 4);
let offset = head.length;
sizes.forEach((s, k) => {
  const e = 6 + 16 * k;
  head[e] = s;
  head[e + 1] = s;
  head.writeUInt16LE(1, e + 4);
  head.writeUInt16LE(32, e + 6);
  head.writeUInt32LE(pngs[k].length, e + 8);
  head.writeUInt32LE(offset, e + 12);
  offset += pngs[k].length;
});
writeFileSync('public/favicon.ico', Buffer.concat([head, ...pngs]));

// 3) og-default.png 1200x630: fundo igual ao do logo, selo + nome (Playfair 900 em path) + filete dourado.
// toPathData do opentype.js 2.0 gera geometria quebrada; monta o path à mão.
const font = opentype.parse(
  readFileSync(
    'node_modules/@fontsource/playfair-display/files/playfair-display-latin-900-normal.woff',
  ).buffer.slice(0),
);
const r = (n) => +n.toFixed(2);
const pathData = (cmds) =>
  cmds
    .map(
      (c) =>
        c.type +
        (
          {
            M: [c.x, c.y],
            L: [c.x, c.y],
            Q: [c.x1, c.y1, c.x, c.y],
            C: [c.x1, c.y1, c.x2, c.y2, c.x, c.y],
            Z: [],
          }[c.type] ?? []
        )
          .map(r)
          .join(' '),
    )
    .join('');
let x = 0,
  d = '';
for (const g of font.stringToGlyphs('LEO IGOR NUNES')) {
  d += pathData(g.getPath(x, 0, 66).commands);
  x += (g.advanceWidth / font.unitsPerEm) * 66 + 5;
}
const textW = x - 5;
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<rect width="1200" height="630" fill="rgb(7,7,7)"/>
<g transform="translate(480 330)" fill="${PAPER}"><path d="${d}"/></g>
<rect x="480" y="372" width="${r(textW)}" height="8" fill="${GOLD}"/>
<rect y="610" width="1200" height="20" fill="${GOLD}"/></svg>`;
const badge = await sharp(logo).resize(440, 440).toBuffer();
writeFileSync(
  'public/og-default.png',
  await sharp(Buffer.from(og))
    .composite([{ input: badge, left: 20, top: 95 }])
    .png()
    .toBuffer(),
);
console.log('ok');
