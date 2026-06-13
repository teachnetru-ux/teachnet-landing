/**
 * Cookie-плашка (§10). Снизу слева (desktop, max 420px) / во всю ширину (mobile).
 * Glass. Появление с задержкой 1.5с. Выбор хранится в localStorage, повторно
 * не показывается.
 */
import { SITE } from '../lib/site';

const STORAGE_KEY = 'tn-cookie-consent';

export function cookieBanner(): string {
  return `<div class="cookie" id="cookie-banner" role="dialog" aria-label="Использование cookie" aria-hidden="true">
    <p class="cookie__text">Мы используем cookie, чтобы сайт работал лучше. Оставаясь на сайте, вы соглашаетесь с <a href="${SITE.legal.cookie}" target="_blank" rel="noopener">политикой использования cookie</a>.</p>
    <div class="cookie__row">
      <button type="button" class="btn btn--compact" id="cookie-accept">Хорошо</button>
    </div>
  </div>`;
}

export function initCookieBanner(root: ParentNode = document): void {
  const banner = root.querySelector<HTMLElement>('#cookie-banner');
  if (!banner) return;

  let stored: string | null = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch {
    /* localStorage недоступен — покажем плашку, но без сохранения */
  }
  if (stored === 'accepted') return;

  const show = (): void => {
    banner.classList.add('is-visible');
    banner.setAttribute('aria-hidden', 'false');
  };
  window.setTimeout(show, 1500);

  banner.querySelector('#cookie-accept')?.addEventListener('click', () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch {
      /* игнорируем */
    }
    banner.classList.remove('is-visible');
    banner.setAttribute('aria-hidden', 'true');
  });
}
