/** Блок 1. Hero (§1, §5, §6). Тексты — дословно. */
import { cta } from '../components/button';

export function hero(): string {
  return `<section class="hero section" id="hero" aria-labelledby="hero-h1">
    <img class="hero__bg" src="/images/hero.svg" width="1280" height="760" alt="" fetchpriority="high" decoding="async" />
    <div class="container layer">
      <div class="hero__copy" data-reveal>
        <span class="chip chip--glass">Резидент IT-парка · Группы до 6 человек</span>
        <h1 class="h1" id="hero-h1">Школа инженерии и робототехники для детей <span style="white-space:nowrap">5–15 лет</span> в Казани</h1>
        <p class="lead hero__sub">Ребёнок попадает в Академию космо-инженеров: собирает настоящих роботов, выполняет миссии и растёт в рангах — от Кадета до Мастера.</p>
        <div class="hero__cta">
          ${cta({ label: 'Бесплатный пробный урок' })}
          <p class="micro">60 минут · подберём программу под ребёнка · ни к чему не обязывает</p>
        </div>
      </div>
    </div>
  </section>`;
}
