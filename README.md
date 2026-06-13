# TEACHNET — лендинг

Одностраничный продающий лендинг школы инженерии и робототехники TEACHNET (Казань).
Стек: **Vite + ванильный TypeScript + Tailwind CSS**, без React. Результат `npm run build` —
полностью статичная папка `dist/`, готовая к заливке на любой хостинг (нужен PHP только для формы).

## Команды

```bash
npm install            # установка (см. примечание про кэш ниже)
npm run dev            # дев-сервер (http://localhost:5173)
npm run build          # прод-сборка в dist/
npm run preview        # локальный предпросмотр dist/
npm run assets         # перегенерировать логотипы, favicon, OG и плейсхолдеры
```

> Если `npm install` падает с `EACCES ... ~/.npm/_cacache` — кэш содержит root-файлы.
> Обход: `npm install --cache /tmp/tn-npm-cache` (уже прописано в `.npmrc`).

## Структура

```
src/
  sections/    — по модулю на блок (hero, trust, … final, footer)
  components/  — button, form, accordion, sticky-bar, cookie-banner
  lib/         — icons, site (контакты/ссылки), metrika, nav, header, reveal
  styles/      — tokens.css (CSS-переменные из дизайн-ТЗ), base.css, components.css, main.css
  page.ts      — сборка страницы из секций (встраивается в index.html на этапе сборки)
  main.ts      — клиентское поведение
public/
  fonts/       — Onest + Golos Text (woff2, локально, без CDN)
  images/      — логотипы + серые плейсхолдеры фото (заменить реальными)
  send.php     — приём формы → Telegram
scripts/       — генерация логотипов и плейсхолдеров
```

Контент рендерится **статически** на этапе сборки (важно для SEO и LCP), клиентский JS
(~2.5 КБ gzip) только навешивает поведение.

## ⚠️ Что нужно заполнить перед публикацией

| Где | Что |
|---|---|
| `public/send.php` | `$BOT_TOKEN` и `$CHAT_ID` Telegram-бота |
| `index.html` | раскомментировать блок Яндекс.Метрики, вставить номер счётчика вместо `XXXXXXXX` |
| `src/lib/metrika.ts` | `YM_COUNTER_ID` — тот же номер счётчика (для целей `lead_form` / `cta_click`) |
| `src/lib/site.ts` | `legal.*` — URL документов (политика, согласие, cookie); `social.vk`, `social.telegram` — ссылки соцсетей (чат поддержки уже задан) |
| `src/components/form.ts` | срок перезвона (блок 9, плейсхолдер `[···]`) |
| `src/sections/faq.ts` | ответы «Где проходят занятия?» и «Если пропустили занятие?» |
| `src/sections/team.ts` | имена и роли преподавателей |
| `public/images/*.svg` | заменить серые плейсхолдеры реальными фото (тот же путь/имя) |
| `public/robots.txt` | добавить `Sitemap:` после привязки домена |

Все плейсхолдеры в коде помечены `// TODO` / `<!-- TODO -->`. Найти разом:
```bash
grep -rn "TODO" src public/send.php index.html
```

## Деплой превью на GitHub Pages

В репозитории уже есть workflow `.github/workflows/deploy.yml` — он на каждый push в `main`
собирает сайт и публикует на Pages. `base` подставляется автоматически из имени репозитория,
поэтому ассеты грузятся по пути `/<repo>/`.

1. Создать репозиторий на GitHub и запушить:
   ```bash
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```
2. На GitHub: **Settings → Pages → Build and deployment → Source: `GitHub Actions`**
   (ветку выбирать не нужно — деплой идёт из workflow).
3. После завершения экшена сайт будет на `https://<username>.github.io/<repo>/`
   (ссылка также появится во вкладке **Actions** в job `deploy` и в Settings → Pages).

> Форма на Pages не отправляет заявки — это статический хостинг без PHP. Превью визуальное;
> рабочая форма (`send.php` → Telegram) поднимется на хостинге с PHP.

## Качество (проверено)

- Lighthouse mobile: **Performance 100, Accessibility 100, Best Practices 100, SEO 100**
- LCP 1.5 c, CLS 0.018, TBT 0 мс. Вес `dist/` ≈ 468 КБ.
- Тексты — дословно из `teachnet-landing-copy-final.md`. Дизайн — по `teachnet-landing-design-tz.md`.
