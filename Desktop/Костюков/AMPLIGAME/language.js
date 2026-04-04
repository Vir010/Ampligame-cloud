// language.js

// Словарь переводов
const translations = {
  ru: {
    // Основные элементы
    balance: "Ваш баланс",
    add_balance: "+ Пополнить",
    store: "Store",
    library: "Library",
    cloud_gaming: "Cloud Gaming",
    community: "Community",
    setting: "Setting",
    supports: "Supports",
    search_placeholder: "Нажмите для поиска",
    main: "Главное",
    popular_games: "Популярные игры",
    buy: "Купить",
    
    // Настройки
    settings: "Настройки",
    account: "Аккаунт",
    profile: "Профиль",
    privacy: "Приватность",
    notifications: "Уведомления",
    language: "Язык",
    theme: "Тема",
    security: "Безопасность",
    payments: "Платежи",
    save: "Сохранить изменения",
    
    // Профиль
    my_library: "Моя библиотека",
    no_games: "В библиотеке пока нет игр",
    delete: "Удалить",
    install: "Установить",
    installed: "Установлено",
    
    // События
    events: "События и мероприятия",
    upcoming: "Предстоящие",
    past: "Прошедшие",
    tournaments: "Турниры",
    create_tournament: "+ Создать турнир",
    participate: "Участвовать",
    
    // Группы
    groups: "Группы и сообщества",
    my_groups: "Мои группы",
    popular_groups: "Популярные",
    recommended: "Рекомендации",
    create_group: "Создать группу",
    open: "Открыть",
    share: "Поделиться",
    join: "Вступить",
    
    // Поддержка
    support: "Центр поддержки",
    faq: "Часто задаваемые вопросы",
    contact: "Связаться с нами",
    system_req: "Системные требования",
    useful_links: "Полезные ссылки",
    search_question: "Поиск по вопросам...",
    find: "Найти",
    
    // Киберспорт
    cybersport: "Киберспорт",
    fresh_news: "Свежие новости",
    all_news: "Все новости киберспорта",
    
    // Стримы
    streams: "Прямые эфиры",
    online: "онлайн",
    more: "Больше",
    live: "LIVE",
    viewers: "зрителей",
    
    // Общие
    close: "Закрыть",
    cancel: "Отмена",
    confirm: "Подтвердить",
    delete_confirm: "Вы уверены, что хотите удалить игру",
    action_cannot_be_undone: "Это действие нельзя отменить"
  },
  
  en: {
    // Main elements
    balance: "Your balance",
    add_balance: "+ Add funds",
    store: "Store",
    library: "Library",
    cloud_gaming: "Cloud Gaming",
    community: "Community",
    setting: "Setting",
    supports: "Supports",
    search_placeholder: "Click to search",
    main: "Main",
    popular_games: "Popular games",
    buy: "Buy",
    
    // Settings
    settings: "Settings",
    account: "Account",
    profile: "Profile",
    privacy: "Privacy",
    notifications: "Notifications",
    language: "Language",
    theme: "Theme",
    security: "Security",
    payments: "Payments",
    save: "Save changes",
    
    // Profile
    my_library: "My library",
    no_games: "No games in library yet",
    delete: "Delete",
    install: "Install",
    installed: "Installed",
    
    // Events
    events: "Events and activities",
    upcoming: "Upcoming",
    past: "Past",
    tournaments: "Tournaments",
    create_tournament: "+ Create tournament",
    participate: "Participate",
    
    // Groups
    groups: "Groups and communities",
    my_groups: "My groups",
    popular_groups: "Popular",
    recommended: "Recommended",
    create_group: "Create group",
    open: "Open",
    share: "Share",
    join: "Join",
    
    // Support
    support: "Support center",
    faq: "Frequently asked questions",
    contact: "Contact us",
    system_req: "System requirements",
    useful_links: "Useful links",
    search_question: "Search questions...",
    find: "Find",
    
    // Cybersport
    cybersport: "Cybersport",
    fresh_news: "Fresh news",
    all_news: "All cybersport news",
    
    // Streams
    streams: "Live streams",
    online: "online",
    more: "More",
    live: "LIVE",
    viewers: "viewers",
    
    // Common
    close: "Close",
    cancel: "Cancel",
    confirm: "Confirm",
    delete_confirm: "Are you sure you want to delete the game",
    action_cannot_be_undone: "This action cannot be undone"
  }
};

// Текущий язык
let currentLang = localStorage.getItem('app_language') || 'ru';

// Функция применения перевода
function applyTranslations() {
  const t = translations[currentLang];
  
  // Баланс
  document.querySelectorAll('.balance-label').forEach(el => {
    if (el.textContent === 'Ваш баланс' || el.textContent === 'Your balance') {
      el.textContent = t.balance;
    }
  });
  
  // Кнопка пополнения
  document.querySelectorAll('.balance-add-btn').forEach(el => {
    if (el.textContent.includes('Пополнить') || el.textContent.includes('Add funds')) {
      el.textContent = t.add_balance;
    }
  });
  
  // Поиск
  const searchInput = document.querySelector('.search input');
  if (searchInput) searchInput.placeholder = t.search_placeholder;
  
  // Заголовки
  document.querySelectorAll('.store-glav').forEach(el => el.textContent = t.main);
  document.querySelectorAll('.store-games-title').forEach(el => el.textContent = t.popular_games);
  
  // Кнопки покупки
  document.querySelectorAll('.sellgame2').forEach(el => {
    if (el.textContent === 'Купить' || el.textContent === 'Buy') {
      el.textContent = t.buy;
    }
  });
  
  // Настройки
  const settingsTitle = document.querySelector('.settings-title');
  if (settingsTitle) settingsTitle.textContent = t.settings;
  
  const settingsMenuItems = document.querySelectorAll('.settings-menu-item');
  if (settingsMenuItems.length) {
    settingsMenuItems[0].textContent = t.account;
    if (settingsMenuItems[1]) settingsMenuItems[1].textContent = t.profile;
    if (settingsMenuItems[2]) settingsMenuItems[2].textContent = t.privacy;
    if (settingsMenuItems[3]) settingsMenuItems[3].textContent = t.notifications;
    if (settingsMenuItems[4]) settingsMenuItems[4].textContent = t.language;
    if (settingsMenuItems[5]) settingsMenuItems[5].textContent = t.theme;
    if (settingsMenuItems[6]) settingsMenuItems[6].textContent = t.security;
    if (settingsMenuItems[7]) settingsMenuItems[7].textContent = t.payments;
  }
  
  // Кнопки сохранения
  document.querySelectorAll('.settings-save-btn').forEach(el => el.textContent = t.save);
  
  // События
  const eventsTitle = document.querySelector('.events-title');
  if (eventsTitle) eventsTitle.textContent = t.events;
  
  const eventTabs = document.querySelectorAll('.events-tab-btn');
  if (eventTabs.length) {
    if (eventTabs[0]) eventTabs[0].textContent = t.upcoming;
    if (eventTabs[1]) eventTabs[1].textContent = t.past;
    if (eventTabs[2]) eventTabs[2].textContent = t.tournaments;
  }
  
  const createTournamentBtn = document.querySelector('.create-tournament-btn');
  if (createTournamentBtn) createTournamentBtn.textContent = t.create_tournament;
  
  document.querySelectorAll('.tournament-join-btn').forEach(el => el.textContent = t.participate);
  
  // Группы
  const groupsTitle = document.querySelector('.groups-title');
  if (groupsTitle) groupsTitle.textContent = t.groups;
  
  const groupsSubtitle = document.querySelector('.groups-subtitle');
  if (groupsSubtitle) groupsSubtitle.textContent = t.groups_subtitle || "Find like-minded people for your favorite games";
  
  const createGroupBtn = document.querySelector('.create-group-btn');
  if (createGroupBtn) createGroupBtn.innerHTML = `<span class="btn-icon">+</span> ${t.create_group}`;
  
  const groupTabs = document.querySelectorAll('.groups-tab-btn');
  if (groupTabs.length) {
    if (groupTabs[0]) groupTabs[0].innerHTML = `<span class="tab-icon"></span> ${t.my_groups} <span class="tab-count">3</span>`;
    if (groupTabs[1]) groupTabs[1].innerHTML = `<span class="tab-icon"></span> ${t.popular_groups}`;
    if (groupTabs[2]) groupTabs[2].innerHTML = `<span class="tab-icon"></span> ${t.recommended}`;
  }
  
  document.querySelectorAll('.group-btn.primary').forEach(el => {
    if (el.textContent === 'Открыть' || el.textContent === 'Open') el.textContent = t.open;
  });
  document.querySelectorAll('.group-btn.secondary').forEach(el => {
    if (el.textContent === 'Поделиться' || el.textContent === 'Share') el.textContent = t.share;
  });
  document.querySelectorAll('.join-btn, .recommended-join-btn').forEach(el => {
    if (el.textContent.includes('Вступить') || el.textContent.includes('Join')) {
      el.innerHTML = `<span class="btn-icon">+</span> ${t.join}`;
    }
  });
  
  // Поддержка
  const supportTitle = document.querySelector('.supports-title');
  if (supportTitle) supportTitle.textContent = t.support;
  
  const supportSections = document.querySelectorAll('.supports-section-title');
  if (supportSections.length) {
    if (supportSections[0]) supportSections[0].textContent = t.faq;
    if (supportSections[1]) supportSections[1].textContent = t.contact;
    if (supportSections[2]) supportSections[2].textContent = t.system_req;
    if (supportSections[3]) supportSections[3].textContent = t.useful_links;
  }
  
  const supportSearch = document.querySelector('.supports-search-input');
  if (supportSearch) supportSearch.placeholder = t.search_question;
  
  const supportSearchBtn = document.querySelector('.supports-search-btn');
  if (supportSearchBtn) supportSearchBtn.textContent = t.find;
  
  // Киберспорт
  const cybersportHeader = document.querySelector('.news-header h2');
  if (cybersportHeader) cybersportHeader.textContent = t.cybersport;
  
  const newsSpan = document.querySelector('.news-header span');
  if (newsSpan) newsSpan.textContent = t.fresh_news;
  
  const allNewsBtn = document.querySelector('.view-all-news button');
  if (allNewsBtn) allNewsBtn.textContent = t.all_news;
  
  // Стримы
  const streamsHeader = document.querySelector('.streams-header h3');
  if (streamsHeader) streamsHeader.textContent = t.streams;
  
  const streamsCount = document.querySelector('.streams-count');
  if (streamsCount) {
    const count = streamsCount.textContent.match(/\d+/);
    streamsCount.textContent = `${count ? count[0] : '3'} ${t.online}`;
  }
  
  const allStreamsBtn = document.querySelector('.all-streams-btn');
  if (allStreamsBtn) allStreamsBtn.textContent = t.more;
  
  document.querySelectorAll('.live-badge').forEach(el => el.textContent = t.live);
  
  document.querySelectorAll('.stream-viewers').forEach(el => {
    const viewers = el.textContent.match(/\d+(\.\d+)?[K]?/);
    if (viewers) el.textContent = `${viewers[0]} ${t.viewers}`;
  });
}

// Сохранение языка
function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem('app_language', lang);
    applyTranslations();
    
    // Обновляем выбранное значение в селекте
    const langSelect = document.querySelector('#languageSelect');
    if (langSelect) langSelect.value = lang;
    
    showNotification(`Language changed to ${lang === 'ru' ? 'Русский' : 'English'}`, 'info');
  }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
  // Применяем сохраненный язык
  applyTranslations();
  
  // Находим селект языка в настройках и добавляем обработчик
  const langSelect = document.getElementById('languageSelect');
  if (langSelect) {
    langSelect.value = currentLang;
    langSelect.addEventListener('change', function() {
      setLanguage(this.value);
    });
  }
  
  // Добавляем кнопку сохранения языка
  const saveLangBtn = document.getElementById('saveLanguageBtn');
  if (saveLangBtn) {
    saveLangBtn.addEventListener('click', function() {
      const selectedLang = document.querySelector('#languageSelect').value;
      setLanguage(selectedLang);
      showNotification(currentLang === 'ru' ? 'Язык сохранен' : 'Language saved', 'success');
    });
  }
});

// Экспортируем функции для использования в других файлах
window.setLanguage = setLanguage;
window.currentLang = () => currentLang;