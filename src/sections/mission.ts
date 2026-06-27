/** Блок 5. Занятие = миссия (§6 — чертёжная сетка, крупные номера 01–04). Тексты дословно. */

const STEPS = [
  {
    n: '01',
    title: 'Завязка.',
    text: 'Срочное сообщение из штаба: возникла проблема, решить её может только новый робот.',
  },
  {
    n: '02',
    title: 'Сборка и программирование.',
    text: 'Основное время — руками. Преподаватель направляет и подбрасывает задачи, а не делает за ребёнка.',
  },
  {
    n: '03',
    title: 'Испытание.',
    text: 'Робот проходит проверку. Сработал — миссия выполнена, печать в паспорт.',
  },
  {
    n: '04',
    title: 'Интрига в финале.',
    text: 'В конце миссии — новая угроза. Ребёнок уходит с вопросом «а что дальше?» — и ждёт следующего занятия.',
  },
];

export function mission(): string {
  const steps = STEPS.map(
    (s) => `<div class="mission-step" data-reveal>
      <span class="mission-num">${s.n}</span>
      <div>
        <h3 class="h3 mission-step__title">${s.title}</h3>
        <p class="muted">${s.text}</p>
      </div>
    </div>`,
  ).join('');

  return `<section class="section" aria-labelledby="ms-h" data-scroll-goal="scroll_mission">
    <div class="blueprint"></div>
    <div class="container layer">
      <div class="section-head" data-reveal>
        <h2 class="h2" id="ms-h">Здесь не уроки. Здесь миссии.</h2>
        <p class="lead">Каждое занятие — серия с сюжетом, который тянется через весь курс. Как любимый сериал, только ребёнок в нём — главный инженер.</p>
      </div>
      <p class="label-tag" style="color:var(--text-soft);margin-bottom:24px" data-reveal>Как устроена каждая миссия</p>
      <div class="mission-list">${steps}</div>
      <p class="muted" style="max-width:64ch;margin-top:40px" data-reveal>У каждой ступени — своя вселенная и свой сюжет, по возрасту. Поэтому наших учеников не приходится уговаривать идти на занятие.</p>
    </div>
  </section>`;
}
