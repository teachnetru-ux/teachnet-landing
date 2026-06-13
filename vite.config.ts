import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { renderPage } from './src/page';

// Контент страницы собирается из секций (чистые функции) и встраивается в index.html
// на этапе сборки/дев-сервера — статичный HTML, без рантайм-инъекции (важно для SEO и LCP,
// трафик из Яндекс Директа). Клиентский main.ts вешает только поведение на готовый DOM.
// На GitHub Pages проектный сайт отдаётся по пути /<repo>/. base задаётся в CI
// (workflow подставляет имя репозитория), локально остаётся '/'.
const base = process.env.BASE_PATH || '/';

// Авто-подстановка реальных фото вместо серых SVG-заглушек.
// Реальное фото кладут в public/images/ с тем же именем, что у заглушки, но
// в растровом формате (.webp / .jpg / .jpeg / .png). Если такой файл есть —
// сборка сама заменит ссылку <name>.svg → <name>.<реальный-формат>.
// Если фото ещё нет, остаётся заглушка. Имя файла менять в коде не нужно.
const IMAGES_DIR = fileURLToPath(new URL('./public/images', import.meta.url));
const RASTER_PRIORITY = ['webp', 'jpg', 'jpeg', 'png'];

function realPhotos(): Record<string, string> {
  const byName: Record<string, string> = {};
  let files: string[] = [];
  try {
    files = readdirSync(IMAGES_DIR);
  } catch {
    return byName;
  }
  for (const file of files) {
    const m = /^(.+)\.(webp|jpe?g|png)$/i.exec(file);
    if (!m) continue;
    const [, name, rawExt] = m;
    const ext = rawExt.toLowerCase() === 'jpeg' ? 'jpeg' : rawExt.toLowerCase();
    const current = byName[name];
    const currentExt = current?.split('.').pop()?.toLowerCase() ?? '';
    if (!current || RASTER_PRIORITY.indexOf(ext) < RASTER_PRIORITY.indexOf(currentExt)) {
      byName[name] = file;
    }
  }
  return byName;
}

function resolvePhotos(html: string): string {
  const map = realPhotos();
  return html.replace(
    /\/images\/([A-Za-z0-9_-]+)\.svg/g,
    (full, name: string) => (map[name] ? `/images/${map[name]}` : full),
  );
}

export default defineConfig({
  base,
  plugins: [
    tailwindcss(),
    {
      name: 'teachnet:render-page',
      transformIndexHtml: {
        order: 'pre',
        handler: (html) => resolvePhotos(html.replace('<!--app-->', renderPage())),
      },
    },
  ],
  build: {
    target: 'es2020',
    cssCodeSplit: false,
  },
});
