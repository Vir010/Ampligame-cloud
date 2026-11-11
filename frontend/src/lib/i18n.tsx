'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getItem, setItem } from './storage';

export const translations = {
  ru: {
    store: "Store", library: "Library", cloud: "Cloud Gaming", sale: "Sale",
    community: "Community", profile: "Profile", friends: "Friends",
    groups: "Groups", forums: "Forums", events: "Events",
    settings: "Setting", supports: "Supports",
    balance: "Баланс", top_up: "+ Пополнить", logout: "Выйти",
    login: "Войти", main: "Главное", popular_games: "Популярные игры",
    buy: "Купить", purchased: "Куплено", in_library: "В библиотеке",
    search: "Нажмите для поиска", find: "Найти",
    my_library: "Моя библиотека", wishlist: "Список желаемого",
    steam_cards: "Steam-карточки", install: "Установить", installed: "Установлено",
    remove: "Удалить", points: "Очки", points_shop: "Магазин оформления",
    achievements: "Значки", no_games: "В библиотеке пока нет игр.",
  },
  en: {
    store: "Store", library: "Library", cloud: "Cloud Gaming", sale: "Sale",
    community: "Community", profile: "Profile", friends: "Friends",
    groups: "Groups", forums: "Forums", events: "Events",
    settings: "Setting", supports: "Supports",
    balance: "Balance", top_up: "+ Add funds", logout: "Logout",
    login: "Login", main: "Main", popular_games: "Popular games",
    buy: "Buy", purchased: "Purchased", in_library: "In library",
    search: "Click to search", find: "Find",
    my_library: "My library", wishlist: "Wishlist",
    steam_cards: "Steam Cards", install: "Install", installed: "Installed",
    remove: "Remove", points: "Points", points_shop: "Points Shop",
    achievements: "Badges", no_games: "No games in library yet.",
  }
};

type Lang = 'ru' | 'en';
type Dict = typeof translations['ru'];

interface LangContextType {
  lang: Lang;
  t: (key: keyof Dict) => string;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangContextType>({ lang: 'ru', t: (k) => k, setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ru');

  useEffect(() => {
    const saved = (getItem('app_language') as Lang) || 'ru';
    setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    setItem('app_language', l);
  };

  const t = (key: keyof Dict) => translations[lang][key] || translations.ru[key] || key;

  return <LangContext.Provider value={{ lang, t, setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
