/**
 * Единственный тип CTA на сайте (§7, §15). Всегда ссылка на форму (#lead).
 * data-cta — для цели Яндекс.Метрики cta_click.
 */
interface CtaOptions {
  label: string;
  href?: string;
  compact?: boolean;
  block?: boolean;
  extraClass?: string;
}

export function cta({ label, href = '#lead', compact = false, block = false, extraClass = '' }: CtaOptions): string {
  const classes = ['btn', compact ? 'btn--compact' : '', block ? 'btn--block' : '', extraClass]
    .filter(Boolean)
    .join(' ');
  return `<a class="${classes}" href="${href}" data-cta>${label}</a>`;
}
