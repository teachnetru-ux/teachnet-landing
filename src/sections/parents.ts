/** Блок 7. Родители. Тексты дословно. Белые карточки на плоском фоне. */
import { icon } from '../lib/icons';
import type { IconName } from '../lib/icons';

const CARDS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'video',
    title: 'Видео с каждого занятия.',
    text: 'Запуск робота, церемония присвоения ранга — короткое видео в родительский чат в тот же день.',
  },
  {
    icon: 'file-text',
    title: 'Памятки для родителей.',
    text: 'Что ребёнок изучает сейчас — простым языком. Чтобы дома было о чём поговорить. Инженерное образование не требуется.',
  },
  {
    icon: 'presentation',
    title: 'Открытые защиты проектов.',
    text: 'Приходите и смотрите сами, как ребёнок представляет свой проект. Это лучше любого отчёта.',
  },
];

export function parents(): string {
  const cards = CARDS.map(
    (c) => `<article class="card card-hover" data-reveal>
      <span class="card-icon">${icon(c.icon)}</span>
      <h3 class="h3" style="margin-bottom:10px">${c.title}</h3>
      <p class="muted">${c.text}</p>
    </article>`,
  ).join('');

  return `<section class="section" aria-labelledby="par-h">
    <div class="container">
      <div class="section-head" data-reveal>
        <h2 class="h2" id="par-h">Вы будете знать, чем занимается ваш ребёнок</h2>
        <p class="lead">Обычно на вопрос «что вы там делали?» дети отвечают «ну, роботов собирали». У нас — иначе.</p>
      </div>
      <div class="grid-3">${cards}</div>
    </div>
  </section>`;
}
