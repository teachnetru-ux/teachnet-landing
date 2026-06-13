/** Блок 2. Доверие (§2). Лента логотипов партнёров без текста, монохром (§13). */

const PARTNERS = [
  { file: 'logo-edu', name: 'Министерство образования и науки РТ' },
  { file: 'logo-youth-ministry', name: 'Министерство по делам молодёжи РТ' },
  { file: 'logo-fsi', name: 'Фонд содействия инновациям' },
  { file: 'logo-itpark', name: 'IT-парк' },
  { file: 'logo-youth-committee', name: 'Комитет по делам детей и молодёжи' },
];

export function trust(): string {
  const logos = PARTNERS.map(
    (p) =>
      `<figure class="trust-item">
        <span class="trust-logo"><img src="/images/${p.file}.svg" width="180" height="100" loading="lazy" decoding="async" alt="${p.name}" /></span>
        <figcaption class="trust-cap">${p.name}</figcaption>
      </figure>`,
  ).join('');
  return `<section class="section trust" aria-labelledby="trust-h" style="padding-block:48px">
    <div class="container">
      <h2 class="h3 section-head section-head--center muted" id="trust-h" style="margin-bottom:28px;font-weight:600">Нас поддерживают</h2>
      <div class="trust-grid" data-reveal>${logos}</div>
    </div>
  </section>`;
}
