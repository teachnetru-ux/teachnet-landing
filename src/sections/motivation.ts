/** Блок 6. Система мотивации (§5 — главный glass-экран, §6 — печать, §7 — слой наград). */
import { icon } from '../lib/icons';

export function motivation(): string {
  return `<section class="section motivation" aria-labelledby="mot-h">
    <div class="blobs blobs--center blobs--strong"></div>
    <div class="container layer">
      <div class="section-head" data-reveal>
        <h2 class="h2" id="mot-h">Почему дети сами просятся на занятия</h2>
      </div>

      <div class="grid-2">
        <article class="card-glass passport-card" data-reveal>
          <span class="stamp" aria-hidden="true">Миссия выполнена</span>
          <span class="card-icon">${icon('book-marked')}</span>
          <h3 class="h3" style="margin-bottom:10px;max-width:16ch">Паспорт инженера.</h3>
          <p class="muted">Выдаётся на первом занятии. За каждую миссию — печать, за новый навык — наклейка. Ребёнок видит свой рост. Вы видите, за что платите.</p>
        </article>

        <article class="card-glass" data-reveal>
          <span class="card-icon card-icon--rank">${icon('award')}</span>
          <h3 class="h3" style="margin-bottom:10px">Ранги, которые надо заслужить.</h3>
          <p class="muted">От Кадета до Мастера космо-инженерии. Новый ранг присваивается на церемонии перед всей группой — за реальные навыки, не за посещаемость.</p>
        </article>

        <article class="card-glass" data-reveal>
          <span class="card-icon card-icon--rank">${icon('coins')}</span>
          <h3 class="h3" style="margin-bottom:10px">ТИЧКОИНЫ — монеты за успехи.</h3>
          <p class="muted">Заработал — обменял на реальный приз.</p>
        </article>

        <article class="card-glass" data-reveal>
          <span class="card-icon">${icon('book-open')}</span>
          <h3 class="h3" style="margin-bottom:10px">Комиксы вместо параграфов.</h3>
          <p class="muted">Теорию мы рисуем. Ребёнок читает её сам — без напоминаний.</p>
        </article>
      </div>

      <div class="grid-2" style="margin-top:18px" data-reveal>
        <img class="ph" src="/images/passport.svg" width="1040" height="800" loading="lazy" decoding="async" alt="Паспорт инженера с печатями" style="aspect-ratio:13/10;object-fit:cover" />
        <img class="ph" src="/images/comics.svg" width="1040" height="800" loading="lazy" decoding="async" alt="Развороты комиксов" style="aspect-ratio:13/10;object-fit:cover" />
      </div>
    </div>
  </section>`;
}
