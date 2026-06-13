/**
 * Форма заявки (блок 9, §7). Поля: имя · телефон · возраст ребёнка +
 * обязательный чекбокс согласия на обработку ПД (152-ФЗ). Маска телефона +7,
 * клиентская валидация, honeypot от спама. POST на /send.php.
 * После успеха — экран «Спасибо, перезвоним» вместо формы.
 */
import { icon } from '../lib/icons';
import { SITE } from '../lib/site';
import { reachGoal } from '../lib/metrika';

export function leadForm(): string {
  return `<form class="lead-form" id="lead-form" novalidate>
    <div class="form-grid">
      <div class="field-row">
        <input class="field" type="text" name="name" placeholder="Имя" autocomplete="name" aria-label="Имя" />
        <span class="field-error">Напишите, как вас зовут</span>
      </div>
      <div class="field-row">
        <input class="field" type="tel" name="phone" placeholder="+7 (___) ___-__-__" inputmode="tel" autocomplete="tel" aria-label="Телефон" />
        <span class="field-error">Введите номер телефона полностью</span>
      </div>
      <div class="field-row">
        <input class="field" type="text" name="age" placeholder="Возраст ребёнка" inputmode="numeric" maxlength="2" autocomplete="off" aria-label="Возраст ребёнка" />
        <span class="field-error">Укажите возраст ребёнка</span>
      </div>
      <label class="consent">
        <input type="checkbox" name="consent" value="1" />
        <span>Я даю согласие на обработку <a href="${SITE.legal.consent}" target="_blank" rel="noopener">персональных данных</a></span>
      </label>
      <!-- honeypot: скрытое поле, заполняют только боты -->
      <input class="hp-field" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" />
      <button type="submit" class="btn btn--block">Записаться бесплатно</button>
    </div>
    <p class="form-foot micro">Перезвоним в течение <!-- TODO: блок 9 — срок перезвона («15 минут» / «часа») -->. Только чтобы согласовать время.</p>
    <div class="form-success" role="status" aria-live="polite">
      <span class="form-success__check">${icon('check')}</span>
      <h3 class="h3">Спасибо, перезвоним</h3>
      <p class="muted">Заявка принята. Свяжемся с вами, чтобы согласовать удобное время бесплатного урока.</p>
    </div>
  </form>`;
}

/* ---------- поведение ---------- */
function formatPhone(value: string): string {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('8')) digits = '7' + digits.slice(1);
  if (digits && !digits.startsWith('7')) digits = '7' + digits;
  digits = digits.slice(0, 11);
  const rest = digits.slice(1);
  let out = '+7';
  if (rest.length > 0) out += ' (' + rest.slice(0, 3);
  if (rest.length >= 3) out += ')';
  if (rest.length > 3) out += ' ' + rest.slice(3, 6);
  if (rest.length > 6) out += '-' + rest.slice(6, 8);
  if (rest.length > 8) out += '-' + rest.slice(8, 10);
  return out;
}

function setError(input: Element, on: boolean): void {
  const row = input.closest('.field-row, .consent');
  if (!row) return;
  row.classList.toggle('has-error', on);
  if (input instanceof HTMLInputElement) input.setAttribute('aria-invalid', on ? 'true' : 'false');
}

export function initForm(root: ParentNode = document): void {
  const form = root.querySelector<HTMLFormElement>('#lead-form');
  if (!form) return;

  const nameEl = form.elements.namedItem('name') as HTMLInputElement;
  const phoneEl = form.elements.namedItem('phone') as HTMLInputElement;
  const ageEl = form.elements.namedItem('age') as HTMLInputElement;
  const consentEl = form.elements.namedItem('consent') as HTMLInputElement;
  const hpEl = form.elements.namedItem('website') as HTMLInputElement;

  // маска телефона
  phoneEl.addEventListener('input', () => {
    phoneEl.value = formatPhone(phoneEl.value);
  });
  phoneEl.addEventListener('focus', () => {
    if (!phoneEl.value) phoneEl.value = '+7 ';
  });
  // возраст — только цифры
  ageEl.addEventListener('input', () => {
    ageEl.value = ageEl.value.replace(/\D/g, '').slice(0, 2);
  });

  // снимаем ошибку при правке
  [nameEl, phoneEl, ageEl].forEach((el) =>
    el.addEventListener('input', () => setError(el, false)),
  );
  consentEl.addEventListener('change', () => setError(consentEl, false));

  function validate(): boolean {
    let ok = true;
    if (nameEl.value.trim().length < 2) {
      setError(nameEl, true);
      ok = false;
    }
    const phoneDigits = phoneEl.value.replace(/\D/g, '');
    if (phoneDigits.length !== 11) {
      setError(phoneEl, true);
      ok = false;
    }
    const age = Number(ageEl.value);
    if (!ageEl.value || Number.isNaN(age) || age < 3 || age > 18) {
      setError(ageEl, true);
      ok = false;
    }
    if (!consentEl.checked) {
      setError(consentEl, true);
      ok = false;
    }
    return ok;
  }

  function showSuccess(): void {
    form!.classList.add('is-sent');
    reachGoal('lead_form'); // цель Яндекс.Метрики
    form!.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  let sending = false;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;

    // honeypot заполнен → бот: имитируем успех, ничего не отправляя
    if (hpEl.value.trim() !== '') {
      showSuccess();
      return;
    }
    if (!validate()) {
      form.querySelector<HTMLElement>('.has-error .field, .has-error input')?.focus();
      return;
    }

    sending = true;
    const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    // В DEV нет PHP-бэкенда — показываем экран «Спасибо» для предпросмотра UX.
    if (import.meta.env.DEV) {
      console.info('[dev] форма валидна, POST /send.php пропущен (нет PHP в dev).');
      showSuccess();
      return;
    }

    try {
      const res = await fetch('/send.php', { method: 'POST', body: new FormData(form) });
      if (!res.ok) throw new Error('bad status ' + res.status);
      showSuccess();
    } catch (err) {
      sending = false;
      if (submitBtn) submitBtn.disabled = false;
      let errBox = form.querySelector<HTMLElement>('.form-net-error');
      if (!errBox) {
        errBox = document.createElement('p');
        errBox.className = 'micro form-net-error';
        errBox.style.color = '#c0392b';
        errBox.style.marginTop = '12px';
        form.querySelector('.form-foot')?.after(errBox);
      }
      errBox.textContent = 'Не удалось отправить заявку. Позвоните нам: ' + SITE.phoneDisplay;
      console.error(err);
    }
  });
}
