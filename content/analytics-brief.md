# Аналитика teachnet.ru — бриф для нового чата

Привет! Нужно разметить аналитику Яндекс.Метрики на сайте **teachnet.ru** (одностраничник) по моей таблице. Репозиторий: **github.com/teachnetru-ux/teachnet-landing**. Стек: Vite + Tailwind + TypeScript, статическая сборка в `dist/`, деплой на reg.ru. У меня есть таблица целей (Google Sheets «Цели Метрика TEACHNET») — ниже перенёс её содержимое и проставил идентификаторы.

## КРИТИЧНО — две вещи, которые легко сломать

1. **Счётчик teachnet — `96429194`. НЕ `98224185`** (98224185 — это счётчик другого моего сайта, Reform; в моей таблице в примере JS-кода по ошибке стоит 98224185 — игнорировать, использовать 96429194).
2. **teachnet НЕ использует схему `data-goal` + ручной `ym()`.** В коде уже есть своя система: обёртка `reachGoal(goal)` в `src/lib/metrika.ts`. Все цели слать ТОЛЬКО через неё, не вызывать `ym` напрямую и не копировать код-обработчик из другого проекта.

## Что УЖЕ есть в репозитории (проверено — не дублировать)

- Счётчик **96429194** подключён в `index.html` и `child.html`.
- Обёртка `src/lib/metrika.ts` → `reachGoal(goal)`.
- Цель `lead_form` — успешная отправка формы (`src/components/form.ts`, только при реальной заявке). = событие 10 в таблице, УЖЕ ГОТОВО.
- Цель `cta_click` — клик по любому `[data-cta]` (`src/lib/nav.ts`). Это общая CTA-цель; в таблице ниже клики разнесены детальнее — нужно либо заменить общий `cta_click` на отдельные цели, либо добавить отдельные в дополнение (см. ниже, на выбор разработчика — но цель в том, чтобы каждая кнопка из таблицы считалась отдельно).
- Секции страницы с `id`: hero, mission, motivation, programs, translator, price, team, parents, trust, faq, conversion, final (+ header `#top`).

## ЦЕЛИ ПО ТАБЛИЦЕ

### Клик-цели (события 1–12)
Реализация: повесить data-атрибут на нужные элементы и слать `reachGoal(идентификатор)` по клику (через существующий механизм; можно расширить обработчик в nav.ts, чтобы он читал конкретный идентификатор цели с элемента, а не слал общий cta_click).

| № | Элемент | Идентификатор |
|---|---|---|
| 2 | Хедер: Программы | `nav_programs` |
| 3 | Хедер: Цена | `nav_price` |
| 4 | Хедер: Вопросы (FAQ) | `nav_faq` |
| 5 | Хедер: Номер телефона | `nav_phone` |
| 6 | Хедер: Пробный урок (кнопка) | `nav_cta` |
| 7 | Бургер: Бесплатный пробный урок | `burger_cta` |
| 8 | Hero: Бесплатный пробный урок | `hero_cta` |
| 9 | Блок №4: Записаться | `block4_signup` |
| 10 | Блок №9: Отправка формы | `lead_form` (УЖЕ ЕСТЬ) |
| 11 | Блок №12: Бесплатный пробный урок | `block12_cta` |
| 12 | Закреплённая кнопка: Записаться | `sticky_cta` |

(Событие 1 «Заход на сайт» — URL-цель `https://teachnet.ru`, считается посещением, JS не нужен.)

### Скролл-цели (события 13–26) — через IntersectionObserver, порог 50%
Один раз за визит, когда секция достигнута (≥50% площади в окне, ИЛИ для блоков выше экрана — прокрутка через середину). Слать через `reachGoal()`.

| Блок (по таблице) | id секции | Идентификатор |
|---|---|---|
| Hero | hero | `scroll_hero` |
| Нас поддерживают | trust | `scroll_trust` |
| Инженерия — проще, чем звучит | translator | `scroll_translator` |
| Путь ребёнка | programs | `scroll_programs` |
| Здесь не уроки. Здесь миссии | mission | `scroll_mission` |
| Почему дети просятся на занятия | motivation | `scroll_motivation` |
| Вы будете знать, чем занимается ребёнок | parents | `scroll_parents` |
| Преподаватель — не наблюдатель | team | `scroll_team` |
| Форма триала | conversion | `scroll_conversion` |
| Цена | price | `scroll_price` |
| FAQ | faq | `scroll_faq` |
| Финал CTA | final | `scroll_final` |
| Футер | footer | `scroll_footer` |

Код наблюдателя (адаптировать под TS, импортировать `reachGoal` из `./metrika`, подключить в `src/main.ts`):

```js
function initScrollGoals() {
  var els = document.querySelectorAll('[data-scroll-goal]');
  if (!els.length || !('IntersectionObserver' in window)) return;
  var fired = {};
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var el = entry.target;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var rect = entry.boundingClientRect;
      var ratioOk = entry.intersectionRatio >= 0.5;
      var midReached = rect.height > vh && rect.top <= vh / 2 && rect.bottom >= vh / 2;
      if (entry.isIntersecting && (ratioOk || midReached)) {
        var goal = el.getAttribute('data-scroll-goal');
        if (goal && !fired[goal]) { fired[goal] = true; reachGoal(goal); observer.unobserve(el); }
      }
    });
  }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
  els.forEach(function (el) { observer.observe(el); });
}
```

На каждую секцию повесить `data-scroll-goal="scroll_<...>"` по таблице выше.

## После внедрения — создать цели в Метрике (счётчик 96429194)
Тип «Целевое событие» (ex JS-событие), условие «Совпадает»:
- Клики: nav_programs, nav_price, nav_faq, nav_phone, nav_cta, burger_cta, hero_cta, block4_signup, block12_cta, sticky_cta (+ lead_form уже есть).
- Скролл: scroll_hero, scroll_trust, scroll_translator, scroll_programs, scroll_mission, scroll_motivation, scroll_parents, scroll_team, scroll_conversion, scroll_price, scroll_faq, scroll_final, scroll_footer.
URL-цель: «Заход на сайт» — посещение `https://teachnet.ru` (тип «Посещение страницы»).

## Важно
- Счётчик **96429194** (не 98224185).
- Все цели — через обёртку `reachGoal()`, не через прямой `ym`.
- Не трогать форму, цель lead_form, дизайн, тексты.
- Стек статический (Vite → dist/), деплой reg.ru по FTP после пуша в main.
- Сборка `npm run build`, проверить чисто, запушить в main.

## С чего начать
Дай мне готовый промт для Claude Code: (1) разметить клики по таблице — каждая кнопка шлёт свой идентификатор через reachGoal; (2) добавить data-scroll-goal на 13 секций + модуль-наблюдатель (IntersectionObserver) с reachGoal; подключить в main.ts. Потом я создам цели в Метрике по списку.
