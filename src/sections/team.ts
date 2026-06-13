/** Блок 8. Команда. Лид дословно. Фото + подпись «имя · роль» (TODO — реальные данные). */

export function team(): string {
  // 3 фото с мастер-классов; подпись — имя и роль одной строкой (без возрастов и биографий)
  const photos = [1, 2, 3]
    .map(
      (i) => `<figure data-reveal>
        <img class="team-photo ph" src="/images/team-${i}.svg" width="800" height="1000" loading="lazy" decoding="async" alt="Преподаватель и дети на мастер-классе" />
        <!-- TODO: §8 — имя и роль преподавателя одной строкой -->
        <figcaption class="team-cap muted">Имя · роль</figcaption>
      </figure>`,
    )
    .join('');

  return `<section class="section" aria-labelledby="team-h">
    <div class="container">
      <div class="section-head" data-reveal>
        <h2 class="h2" id="team-h">Преподаватель здесь — не наблюдатель</h2>
        <p class="lead">Наш преподаватель не выдаёт инструкцию, чтобы уткнуться в телефон. Он ведёт миссию: рассказывает, спрашивает, испытывает роботов вместе с детьми. И учит говорить на языке инженера: не «у меня не получается», а «у меня шестерёнка не вращается».</p>
      </div>
      <div class="team-grid">${photos}</div>
    </div>
  </section>`;
}
