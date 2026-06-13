/**
 * Появление секций по скроллу (§12): fade + translateY, один раз.
 * Отрисовка линии маршрута (§4, §6) — единственная «вау»-анимация.
 * Всё уважает prefers-reduced-motion.
 */
const reduceMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initReveal(root: ParentNode = document): void {
  const els = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (!('IntersectionObserver' in window) || reduceMotion()) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
  );
  els.forEach((el) => io.observe(el));
}

export function initRouteLine(root: ParentNode = document): void {
  const routes = Array.from(root.querySelectorAll<HTMLElement>('.route'));
  routes.forEach((route) => {
    if (!('IntersectionObserver' in window) || reduceMotion()) {
      route.classList.add('is-drawn');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            route.classList.add('is-drawn');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 },
    );
    io.observe(route);
  });
}
