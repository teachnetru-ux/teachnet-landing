/**
 * Плавный скролл по якорям с учётом высоты фиксированной шапки + трекинг CTA
 * (цель Яндекс.Метрики cta_click). Уважает prefers-reduced-motion.
 */
import { reachGoal } from './metrika';

function headerOffset(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-h');
  return (parseInt(raw, 10) || 64) + 14;
}

export function initNav(): void {
  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const href = link.getAttribute('href') || '';

    // плейсхолдер-ссылка (юр-документы ещё не подключены) — гасим
    if (href === '#') {
      e.preventDefault();
      return;
    }
    if (href.length < 2) return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset();
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    history.pushState(null, '', href);
  });

  // цель cta_click — на любой элемент с data-cta
  document.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('[data-cta]')) reachGoal('cta_click');
  });
}
