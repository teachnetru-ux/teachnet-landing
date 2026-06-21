/**
 * Единые константы сайта: бренд (строго TEACHNET, §13a), контакты, навигация,
 * ссылки на юр-документы и соцсети. '#' — плейсхолдеры, заменить на реальные URL.
 */
export const SITE = {
  brand: 'TEACHNET',
  city: 'Казань',
  phoneDisplay: '+7 (993) 415-14-34',
  phoneHref: 'tel:+79934151434',
  email: 'hello@teachnet.ru',
  emailHref: 'mailto:hello@teachnet.ru',
  nav: [
    { label: 'Программы', href: '#programs' },
    { label: 'Цена', href: '#price' },
    { label: 'Вопросы', href: '#faq' },
  ],
  // TODO: подставить реальные URL юридических документов
  legal: {
    consent: '#', // Согласие на обработку персональных данных
    privacy: '#', // Политика конфиденциальности
    cookie: '#', // Политика использования cookie
  },
  social: {
    vk: 'https://vk.com/teachnetru',
    telegram: 'https://t.me/teachnet_ru',
    max: 'https://t.me/teachnet_ru', // TODO: заменить на реальную ссылку МАКС (пока ведёт в Telegram)
    chat: 'https://t.me/teachnet_school', // чат поддержки
  },
  requisites: {
    name: 'ИП Гараев Булат Ильдарович',
    inn: '165505564947',
    ogrnip: '323169000139083',
  },
  year: 2026,
} as const;
