/**
 * Яндекс.Метрика — отправка целей. Сам счётчик подключается закомментированным
 * блоком в index.html (TODO: вставить номер счётчика). Здесь — безопасная обёртка:
 * пока счётчик не подключён / номер не задан, вызовы тихо игнорируются.
 *
 * Цели: lead_form — успешная отправка формы; cta_click — клики по CTA.
 */

// TODO: вставить номер счётчика Яндекс.Метрики (тот же, что в index.html)
export const YM_COUNTER_ID = 0;

type Ym = (id: number, action: string, goal: string) => void;

export function reachGoal(goal: string): void {
  const ym = (window as unknown as { ym?: Ym }).ym;
  if (YM_COUNTER_ID && typeof ym === 'function') {
    ym(YM_COUNTER_ID, 'reachGoal', goal);
  }
}
