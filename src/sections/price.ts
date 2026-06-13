/** Блок 10. Цена. Тексты дословно. Белая карточка на плоском фоне (§5). */
import { icon } from '../lib/icons';

export function price(): string {
  const items = [
    '4 занятия в месяц',
    'Конструкторы и оборудование — наши',
    'Паспорт инженера и материалы для родителей',
    'Миссии, ранги, награды и призы',
  ];
  const ticks = items
    .map((t) => `<li><span class="tick-mark">${icon('check')}</span><span>${t}</span></li>`)
    .join('');

  return `<section class="section" id="price" aria-labelledby="price-h">
    <div class="blobs blobs--center"></div>
    <div class="container layer">
      <article class="card-glass price-card" data-reveal>
        <h2 class="h2 price-amount" id="price-h">7 000 ₽ в месяц.<br>Всё включено.</h2>
        <ul class="ticks">${ticks}</ul>
        <p class="micro" style="margin-top:26px">Первый урок бесплатный. Решайте после него.</p>
      </article>
    </div>
  </section>`;
}
