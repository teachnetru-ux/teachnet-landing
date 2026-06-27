/**
 * Скролл-цели Яндекс.Метрики. На секциях с атрибутом data-scroll-goal="scroll_…"
 * через IntersectionObserver один раз за визит шлём цель, когда секция достигнута:
 * видно ≥50% её площади, либо (для секций выше экрана) её середина прошла центр окна.
 * Цели уходят только через обёртку reachGoal() (счётчик 96429194).
 */
import { reachGoal } from './metrika';

export function initScrollGoals(): void {
  const els = document.querySelectorAll<HTMLElement>('[data-scroll-goal]');
  if (!els.length || !('IntersectionObserver' in window)) return;

  const fired: Record<string, boolean> = {};
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement;
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const rect = entry.boundingClientRect;
        const ratioOk = entry.intersectionRatio >= 0.5;
        const midReached = rect.height > vh && rect.top <= vh / 2 && rect.bottom >= vh / 2;
        if (entry.isIntersecting && (ratioOk || midReached)) {
          const goal = el.getAttribute('data-scroll-goal');
          if (goal && !fired[goal]) {
            fired[goal] = true;
            reachGoal(goal);
            observer.unobserve(el);
          }
        }
      });
    },
    { threshold: [0, 0.25, 0.5, 0.75, 1] },
  );
  els.forEach((el) => observer.observe(el));
}
