import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { renderPage } from './src/page';

// Контент страницы собирается из секций (чистые функции) и встраивается в index.html
// на этапе сборки/дев-сервера — статичный HTML, без рантайм-инъекции (важно для SEO и LCP,
// трафик из Яндекс Директа). Клиентский main.ts вешает только поведение на готовый DOM.
// На GitHub Pages проектный сайт отдаётся по пути /<repo>/. base задаётся в CI
// (workflow подставляет имя репозитория), локально остаётся '/'.
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  base,
  plugins: [
    tailwindcss(),
    {
      name: 'teachnet:render-page',
      transformIndexHtml: {
        order: 'pre',
        handler: (html) => html.replace('<!--app-->', renderPage()),
      },
    },
  ],
  build: {
    target: 'es2020',
    cssCodeSplit: false,
  },
});
