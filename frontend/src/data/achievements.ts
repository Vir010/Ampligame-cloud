export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  svg: string;
  condition: (state: AchievementState) => boolean;
}

export interface AchievementState {
  gamesCount: number;
  reviewsCount: number;
  friendsCount: number;
  balance: number;
  hasDescription: boolean;
  discountPurchases: number;
  cardsCount: number;
  craftedBadges: number;
  completedSets: number;
}

export const ACHIEVEMENTS_DEFINITIONS = [
  { id: "first_purchase", title: "Первая покупка", description: "Купите первую игру", category: "games",
    svg: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zM15 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/></svg>',
    condition: (s: AchievementState) => { return s.gamesCount >= 1; } },
  { id: "gamer_3", title: "Геймер", description: "Купите 3 игры", category: "games",
    svg: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M21.58 16.09l-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.27 1.8-.75L9 16h6l2.25 2.25c.48.48 1.13.75 1.8.75 1.56 0 2.75-1.37 2.53-2.91z"/></svg>',
    condition: (s: AchievementState) => { return s.gamesCount >= 3; } },
  { id: "collector", title: "Коллекционер", description: "Соберите 5 игр", category: "games",
    svg: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg>',
    condition: (s: AchievementState) => { return s.gamesCount >= 5; } },
  { id: "library_master", title: "Мастер библиотеки", description: "Соберите 10 игр", category: "games",
    svg: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg>',
    condition: (s: AchievementState) => { return s.gamesCount >= 10; } },
  { id: "hoarder", title: "Плюшкин", description: "Соберите 25 игр", category: "games",
    svg: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
    condition: (s: AchievementState) => { return s.gamesCount >= 25; } },

  { id: "first_review", title: "Критик", description: "Напишите первый обзор", category: "reviews",
    svg: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>',
    condition: (s: AchievementState) => { return s.reviewsCount >= 1; } },
  { id: "reviewer_5", title: "Рецензент", description: "Напишите 5 обзоров", category: "reviews",
    svg: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>',
    condition: (s: AchievementState) => { return s.reviewsCount >= 5; } },
  { id: "reviewer_10", title: "Обзорщик", description: "Напишите 10 обзоров", category: "reviews",
    svg: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/></svg>',
    condition: (s: AchievementState) => { return s.reviewsCount >= 10; } },

  { id: "first_friend", title: "Первый друг", description: "Добавьте друга", category: "social",
    svg: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>',
    condition: (s: AchievementState) => { return s.friendsCount >= 1; } },
  { id: "popular", title: "Душа компании", description: "5 друзей", category: "social",
    svg: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>',
    condition: (s: AchievementState) => { return s.friendsCount >= 5; } },

  { id: "rich_5k", title: "Богач", description: "Накопите 5 000 ₽", category: "balance",
    svg: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>',
    condition: (s: AchievementState) => { return s.balance >= 5000; } },
  { id: "rich_10k", title: "Меценат", description: "Накопите 10 000 ₽", category: "balance",
    svg: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
    condition: (s: AchievementState) => { return s.balance >= 10000; } },

  { id: "discount_hunter", title: "Охотник за скидками", description: "Купите игру со скидкой", category: "special",
    svg: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/></svg>',
    condition: (s: AchievementState) => { return s.discountPurchases >= 1; } },
  { id: "profile_filled", title: "Личность", description: "Заполните описание профиля", category: "profile",
    svg: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>',
    condition: (s: AchievementState) => { return s.hasDescription; } },
  { id: "first_card", title: "Карточный магнат", description: "Получите первую Steam-карточку", category: "cards",
    svg: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z"/></svg>',
    condition: (s: AchievementState) => { return s.cardsCount >= 1; } },
  { id: "first_craft", title: "Крафтер", description: "Скрафтите первый значок", category: "cards",
    svg: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    condition: (s: AchievementState) => { return s.craftedBadges >= 1; } },
  { id: "collector_cards", title: "Полный сет", description: "Соберите 5 карточек одной игры", category: "cards",
    svg: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>',
    condition: (s: AchievementState) => { return s.completedSets >= 1; } }
];
