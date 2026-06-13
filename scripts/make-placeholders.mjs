/**
 * Генерация серых плейсхолдеров в /public/images.
 * Каждый — серый прямоугольник с подписью «ФОТО: …» / «ЛОГО: …» / «КАРТА: …».
 * Реальные изображения добавляются позже заменой файла с тем же именем.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../public/images');
mkdirSync(OUT, { recursive: true });

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function placeholder({ w, h, lines, accent = '#a7bada' }) {
  const cx = w / 2;
  const lh = Math.round(Math.min(w, h) * 0.07) + 6;
  const startY = h / 2 - ((lines.length - 1) * lh) / 2;
  const fs = Math.max(13, Math.round(Math.min(w, h) * 0.052));
  const text = lines
    .map((ln, i) => {
      const weight = i === 0 ? '600' : '400';
      const fill = i === 0 ? '#5a6b80' : '#7d8ca0';
      return `<text x="${cx}" y="${startY + i * lh}" text-anchor="middle" dominant-baseline="middle" font-family="'Golos Text', system-ui, sans-serif" font-size="${i === 0 ? fs : fs - 2}" font-weight="${weight}" fill="${fill}">${esc(ln)}</text>`;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(lines.join(' '))}">
<rect width="${w}" height="${h}" rx="24" fill="#e7edf5"/>
<rect x="12" y="12" width="${w - 24}" height="${h - 24}" rx="16" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="8 8" opacity="0.7"/>
${text}
</svg>`;
}

const items = [
  // блок 5 — миссия
  { name: 'mission', w: 1280, h: 800, lines: ['ФОТО: занятие-миссия', 'дети собирают робота'] },
  // блок 6 — мотивация
  { name: 'passport', w: 1040, h: 800, lines: ['ФОТО: Паспорт инженера', 'с печатями'] },
  { name: 'comics', w: 1040, h: 800, lines: ['ФОТО: развороты комиксов'] },
  // блок 8 — команда
  { name: 'team-1', w: 800, h: 1000, lines: ['ФОТО: преподаватель', 'и дети'] },
  { name: 'team-2', w: 800, h: 1000, lines: ['ФОТО: преподаватель', 'и дети'] },
  { name: 'team-3', w: 800, h: 1000, lines: ['ФОТО: преподаватель', 'и дети'] },
  // блок 12 — финал
  { name: 'final-1', w: 900, h: 700, lines: ['ФОТО: мастер-класс'] },
  { name: 'final-2', w: 900, h: 700, lines: ['ФОТО: мастер-класс'] },
  // блок 2 — логотипы партнёров (монохром); подпись с полным названием идёт в вёрстке под логотипом
  { name: 'logo-edu', w: 360, h: 200, lines: ['ЛОГО', 'Минобрнауки РТ'] },
  { name: 'logo-youth-ministry', w: 360, h: 200, lines: ['ЛОГО', 'Минмолодёжи РТ'] },
  { name: 'logo-fsi', w: 360, h: 200, lines: ['ЛОГО', 'ФСИ'] },
  { name: 'logo-itpark', w: 360, h: 200, lines: ['ЛОГО', 'IT-парк'] },
  { name: 'logo-youth-committee', w: 360, h: 200, lines: ['ЛОГО', 'Комитет по делам', 'детей и молодёжи'] },
  { name: 'logo-tpp', w: 360, h: 200, lines: ['ЛОГО', 'Союз «ТПП РТ»'] },
];

for (const it of items) {
  writeFileSync(resolve(OUT, `${it.name}.svg`), placeholder(it));
}
console.log(`placeholders: ${items.length} файлов в public/images`);
