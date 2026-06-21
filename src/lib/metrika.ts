/**
 * Яндекс.Метрика — отправка целей. Сам счётчик подключается закомментированным
 * блоком в index.html (TODO: вставить номер счётчика). Здесь — безопасная обёртка:
 * пока счётчик не подключён / номер не задан, вызовы тихо игнорируются.
 *
 * Цели: lead_form — успешная отправка формы; cta_click — клики по CTA.
 */

// Номер счётчика Яндекс.Метрики (тот же, что подключён в index.html)
export const YM_COUNTER_ID = 96429194;

type YmCallback = (clientId: string) => void;
type Ym = (id: number, action: string, value: string | YmCallback) => void;

export function reachGoal(goal: string): void {
  const ym = (window as unknown as { ym?: Ym }).ym;
  if (YM_COUNTER_ID && typeof ym === 'function') {
    ym(YM_COUNTER_ID, 'reachGoal', goal);
  }
}

/**
 * ClientID Яндекс.Метрики через её API — надёжнее, чем парсить куку _ym_uid.
 * Если счётчик не подключён / номер не задан — колбэк просто не вызывается.
 */
export function getClientId(cb: (clientId: string) => void): void {
  const ym = (window as unknown as { ym?: Ym }).ym;
  if (YM_COUNTER_ID && typeof ym === 'function') {
    try {
      ym(YM_COUNTER_ID, 'getClientID', cb);
    } catch {
      /* getClientID недоступен — тихо игнорируем */
    }
  }
}
