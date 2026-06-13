/**
 * Sticky CTA-бар (§9, §14). Появляется после 2-го экрана, снизу, glass.
 * Слева текст (скрыт на мобильном), справа компактный CTA «Записаться».
 * Исчезает, когда видна форма блока 9 (#conversion) — чтобы не дублировать CTA.
 */
import { cta } from './button';

export function stickyBar(): string {
  return `<div class="sticky-cta" id="sticky-cta" aria-hidden="true">
    <span class="sticky-cta__text">Первый урок — бесплатный</span>
    ${cta({ label: 'Записаться', compact: true })}
  </div>`;
}

export function initStickyBar(root: ParentNode = document): void {
  const bar = root.querySelector<HTMLElement>('#sticky-cta');
  if (!bar) return;
  // бар виден со 2-го блока и до конца; скрыт на первом блоке (hero) и на финальном CTA (§12)
  const hideSections = ['#hero', '#final']
    .map((s) => document.querySelector(s))
    .filter((el): el is Element => el !== null);

  const visibleHideSections = new Set<Element>();

  const update = (): void => {
    const show = visibleHideSections.size === 0;
    bar.classList.toggle('is-visible', show);
    bar.setAttribute('aria-hidden', show ? 'false' : 'true');
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) visibleHideSections.add(e.target);
          else visibleHideSections.delete(e.target);
        });
        update();
      },
      { rootMargin: '0px 0px -25% 0px' },
    );
    hideSections.forEach((el) => io.observe(el));
  } else {
    // запасной вариант без IntersectionObserver — показываем после первого экрана
    const onScroll = (): void => {
      bar.classList.toggle('is-visible', window.scrollY > window.innerHeight);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
}
