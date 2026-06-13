/** Шапка: прозрачная поверх hero, glass-подложка при скролле (§8). */
export function initHeader(): void {
  const header = document.querySelector<HTMLElement>('.site-header');
  if (!header) return;
  const onScroll = (): void => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
