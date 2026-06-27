/**
 * Единственный тип CTA на сайте (§7, §15). Всегда ссылка на форму (#lead).
 * goal — индивидуальный идентификатор цели Яндекс.Метрики (data-goal); по клику
 * обработчик в lib/nav.ts шлёт именно его через reachGoal().
 */
interface CtaOptions {
  label: string;
  href?: string;
  compact?: boolean;
  block?: boolean;
  extraClass?: string;
  goal?: string;
}

export function cta({ label, href = '#lead', compact = false, block = false, extraClass = '', goal = '' }: CtaOptions): string {
  const classes = ['btn', compact ? 'btn--compact' : '', block ? 'btn--block' : '', extraClass]
    .filter(Boolean)
    .join(' ');
  const goalAttr = goal ? ` data-goal="${goal}"` : '';
  return `<a class="${classes}" href="${href}"${goalAttr}>${label}</a>`;
}
