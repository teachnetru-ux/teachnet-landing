/** Блок 3. Переводчик «это не сложно» (§3, §7). Тексты — дословно. */
import { icon } from '../lib/icons';
import type { IconName } from '../lib/icons';

const CARDS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'wrench',
    title: 'Не боится «не получается».',
    text: 'Робот не поехал — это не провал, а задача. Найти причину и исправить.',
  },
  {
    icon: 'atom',
    title: 'Физика перестаёт быть страшной.',
    text: 'Её можно собрать руками. «Зачем мне это учить?» отпадает само.',
  },
  {
    icon: 'flag',
    title: 'Доводит дело до конца.',
    text: 'Не «походил на кружок», а «вот робот, я его сделал».',
  },
];

export function translator(): string {
  const cards = CARDS.map(
    (c) => `<article class="card card-hover" data-reveal>
      <span class="card-icon">${icon(c.icon)}</span>
      <h3 class="h3" style="margin-bottom:10px">${c.title}</h3>
      <p class="muted">${c.text}</p>
    </article>`,
  ).join('');

  return `<section class="section" aria-labelledby="tr-h">
    <div class="container">
      <div class="section-head" data-reveal>
        <h2 class="h2" id="tr-h">Инженерия — проще, чем звучит</h2>
        <p class="lead">Это цикл, понятный даже пятилетке:<br><strong style="color:var(--brand);font-weight:600">придумал → собрал → проверил → улучшил.</strong><br>Его ребёнок проживает на каждом занятии.</p>
      </div>
      <div class="grid-3">${cards}</div>
    </div>
  </section>`;
}
