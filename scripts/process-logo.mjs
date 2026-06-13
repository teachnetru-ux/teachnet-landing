/**
 * Обработка логотипа TEACHNET из исходника logo-full.svg (раздел 13a дизайн-ТЗ):
 *  - logo-dark.svg   — тёмная версия в шапку (знак #020203 + текст #316397), без градиентного слоя
 *  - logo-white.svg  — белая версия в подвал (все тёмные заливки → #FFFFFF)
 *  - favicon.svg + PNG'и — только знак (без текста), кадрированный по bbox
 * Все результаты прогоняются через svgo (multipass).
 *
 * Источник истины: единственный исходник — logo-full.svg в корне проекта.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { optimize } from 'svgo';
import { svgPathBbox } from 'svg-path-bbox';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = resolve(ROOT, 'logo-full.svg');
const IMAGES = resolve(ROOT, 'public/images');
const PUBLIC = resolve(ROOT, 'public');
mkdirSync(IMAGES, { recursive: true });

const raw = readFileSync(SRC, 'utf8');

/* ---------- 1. убираем градиентный слой текста ----------
   Текстовая надпись отрисована дважды: градиентным слоем (#2782C5 → прозрачный)
   поверх сплошного синего (#316397, .st10). Пути идентичны, поэтому градиентный
   слой можно удалить целиком — останется чистый сплошной текст. */
function stripGradients(svg) {
  return svg
    .replace(/\s*<linearGradient[\s\S]*?<\/linearGradient>/g, '')
    .replace(/\s*<path[^>]*style="fill:url\([^"]*\)[^"]*"[^>]*\/>/g, '')
    .replace(/\s*<path\s+class="st2"[^>]*\/>/g, '');
}

/* ---------- 2. bbox ---------- */
function bboxOf(svg, classNames) {
  const re = new RegExp(`<path\\s+class="(${classNames.join('|')})"[^>]*\\sd="([^"]+)"`, 'g');
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity, found = 0;
  for (const m of svg.matchAll(re)) {
    const d = m[2];
    try {
      const [x0, y0, x1, y1] = svgPathBbox(d);
      if (![x0, y0, x1, y1].every(Number.isFinite)) continue;
      minX = Math.min(minX, x0); minY = Math.min(minY, y0);
      maxX = Math.max(maxX, x1); maxY = Math.max(maxY, y1);
      found++;
    } catch { /* пропускаем вырожденные пути */ }
  }
  if (!found) throw new Error('bbox: пути не найдены для ' + classNames.join(','));
  return { minX, minY, maxX, maxY };
}

function setViewBox(svg, { minX, minY, maxX, maxY }, pad = 60) {
  const x = Math.floor(minX - pad);
  const y = Math.floor(minY - pad);
  const w = Math.ceil(maxX - minX + pad * 2);
  const h = Math.ceil(maxY - minY + pad * 2);
  return svg
    .replace(/\sx="0px"\sy="0px"/, '')
    .replace(/viewBox="[^"]*"/, `viewBox="${x} ${y} ${w} ${h}"`)
    .replace(/\sstyle="enable-background:[^"]*"/, '');
}

// svgo 4: removeViewBox не входит в preset-default, поэтому viewBox сохраняется
const SVGO = { multipass: true, plugins: ['preset-default'] };
const opt = (svg) => optimize(svg, SVGO).data;

/* ============ DARK (шапка) ============ */
let dark = stripGradients(raw);
const fullBox = bboxOf(dark, ['st0', 'st1', 'st10']);
dark = setViewBox(dark, fullBox, 80);
writeFileSync(resolve(IMAGES, 'logo-dark.svg'), opt(dark));

/* ============ WHITE (подвал) ============ */
let white = dark
  .replace(/#020203/g, '#FFFFFF')
  .replace(/#1E1E1C/g, '#FFFFFF')
  .replace(/#316397/g, '#FFFFFF');
writeFileSync(resolve(IMAGES, 'logo-white.svg'), opt(white));

/* ============ FAVICON (только знак) ============ */
// удаляем финальную группу с текстом (единственный <g> в файле)
let markOnly = raw.replace(/<g>[\s\S]*<\/g>/, '');
const markBox = bboxOf(markOnly, ['st0', 'st1']);

// favicon.svg — знак в фирменном #316397 на прозрачном фоне
let favSvg = markOnly
  .replace(/#020203/g, '#316397')
  .replace(/#1E1E1C/g, '#316397');
favSvg = setViewBox(favSvg, markBox, 40);
const faviconSvg = opt(favSvg);
writeFileSync(resolve(PUBLIC, 'favicon.svg'), faviconSvg);

// solid-версия для PNG-иконок: белый знак на скруглённом синем квадрате
const mw = markBox.maxX - markBox.minX;
const mh = markBox.maxY - markBox.minY;
const S = 1000, P = 150;
const scale = (S - P * 2) / Math.max(mw, mh);
const tx = S / 2 - scale * (markBox.minX + mw / 2);
const ty = S / 2 - scale * (markBox.minY + mh / 2);
const markPaths = (markOnly.match(/<(?:path|polyline|polygon|line)\s+class="st[01]"[^>]*\/>/g) || [])
  .join('\n')
  .replace(/class="st0"/g, 'fill="#FFFFFF"')
  .replace(/class="st1"/g, 'fill="#FFFFFF" stroke="#FFFFFF"');
const solidSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}">` +
  `<rect width="${S}" height="${S}" rx="180" fill="#316397"/>` +
  `<g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${scale.toFixed(5)})">${markPaths}</g>` +
  `</svg>`;
const solid = Buffer.from(opt(solidSvg));

// растеризация
await sharp(Buffer.from(faviconSvg)).resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(resolve(PUBLIC, 'favicon-32.png'));
await sharp(solid).resize(180, 180).png().toFile(resolve(PUBLIC, 'apple-touch-icon.png'));
await sharp(solid).resize(512, 512).png().toFile(resolve(PUBLIC, 'icon-512.png'));

/* ============ OG-image 1200×630 (заглушка для соцсетей) ============ */
const OGW = 1200, OGH = 630;
const ogLogo = await sharp(Buffer.from(opt(white))).resize({ width: 600 }).png().toBuffer();
const ogLogoMeta = await sharp(ogLogo).metadata();
const ogText = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${OGW}" height="${OGH}">` +
  `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
  `<stop offset="0" stop-color="#16344f"/><stop offset="1" stop-color="#0e1a28"/></linearGradient></defs>` +
  `<rect width="${OGW}" height="${OGH}" fill="url(#g)"/>` +
  `<text x="${OGW / 2}" y="430" text-anchor="middle" font-family="Golos Text, sans-serif" font-size="34" fill="rgba(255,255,255,0.82)">Школа инженерии и робототехники для детей · Казань</text>` +
  `</svg>`,
);
await sharp(ogText)
  .composite([
    {
      input: ogLogo,
      top: Math.round((OGH - (ogLogoMeta.height || 188)) / 2) - 40,
      left: Math.round((OGW - 600) / 2),
    },
  ])
  .png()
  .toFile(resolve(PUBLIC, 'og-image.png'));

console.log('logo: dark/white/favicon/og готовы');
console.log('  fullBox', fullBox);
console.log('  markBox', markBox);
