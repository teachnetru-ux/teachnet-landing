/**
 * Рендер отдельных юридических страниц (/privacy, /personal-data-consent,
 * /cookie-policy) из Markdown в content/. Выполняется на этапе сборки
 * (импортируется vite.config.ts) — статичный HTML, без зависимости от JS.
 * Шапка с логотипом (ведёт на «/») + общий подвал лендинга.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { footer } from './sections/footer';
import { SITE } from './lib/site';

const CONTENT_DIR = fileURLToPath(new URL('../content/', import.meta.url));

export const LEGAL_PAGES: Record<string, { file: string; title: string; description: string }> = {
  privacy: {
    file: 'privacy.md',
    title: 'Политика конфиденциальности — TEACHNET',
    description: 'Политика в отношении обработки персональных данных школы инженерии и робототехники TEACHNET.',
  },
  'personal-data-consent': {
    file: 'personal-data-consent.md',
    title: 'Согласие на обработку персональных данных — TEACHNET',
    description: 'Согласие на обработку персональных данных при отправке заявки на сайте TEACHNET.',
  },
  'cookie-policy': {
    file: 'cookie-policy.md',
    title: 'Политика использования cookie — TEACHNET',
    description: 'Политика использования файлов cookie на сайте школы TEACHNET.',
  },
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Делает кликабельными URL и email в уже экранированном тексте (текст не меняем). */
function linkify(s: string): string {
  s = s.replace(/(https?:\/\/[^\s<]+[^\s<.,;:)])/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
  s = s.replace(/(^|[\s(])([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g, '$1<a href="mailto:$2">$2</a>');
  return s;
}

/** Минимальный Markdown → HTML для этих документов: #/## заголовки + абзацы. */
function mdToHtml(md: string): string {
  const blocks = md.replace(/\r\n/g, '\n').split(/\n{2,}/);
  const out: string[] = [];
  for (const raw of blocks) {
    const block = raw.trim();
    if (!block) continue;
    if (block.startsWith('## ')) {
      out.push('<h2>' + linkify(escapeHtml(block.slice(3).trim())) + '</h2>');
    } else if (block.startsWith('# ')) {
      out.push('<h1>' + linkify(escapeHtml(block.slice(2).trim())) + '</h1>');
    } else {
      const lines = block.split('\n').map((l) => linkify(escapeHtml(l.trim())));
      out.push('<p>' + lines.join('<br>') + '</p>');
    }
  }
  return out.join('\n');
}

function legalHeader(): string {
  return `<header class="legal-header">
    <div class="container legal-header__inner">
      <a href="/" class="site-header__brand" aria-label="${SITE.brand} — на главную">
        <img class="site-header__logo" src="/images/logo-dark.svg" width="121" height="38" alt="${SITE.brand}" />
      </a>
      <a class="legal-back" href="/">← На главную</a>
    </div>
  </header>`;
}

/** Возвращает HTML тела страницы (для вставки вместо <!--app-->), либо '' если slug неизвестен. */
export function renderLegalPage(slug: string): string {
  const page = LEGAL_PAGES[slug];
  if (!page) return '';
  const md = readFileSync(CONTENT_DIR + page.file, 'utf8');
  return [
    legalHeader(),
    '<main class="legal"><article class="legal-content">',
    mdToHtml(md),
    '</article></main>',
    footer(),
  ].join('\n');
}
