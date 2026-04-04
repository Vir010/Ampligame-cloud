// search.js
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.querySelector('.search input');
  const searchButton = document.querySelector('.search button');
  const gameCards = document.querySelectorAll('.game-card');
  const storeGamesTitle = document.querySelector('.store-games-title');

  // Функция поиска
  function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
      // Если поиск пустой, показываем все игры
      gameCards.forEach(card => {
        card.style.display = 'block';
      });
      if (storeGamesTitle) storeGamesTitle.textContent = 'Популярные игры';
      return;
    }

    let foundCount = 0;
    
    gameCards.forEach(card => {
      const gameTitle = card.querySelector('h4').textContent.toLowerCase();
      if (gameTitle.includes(searchTerm)) {
        card.style.display = 'block';
        foundCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Обновляем заголовок с результатами поиска
    if (storeGamesTitle) {
      if (foundCount === 0) {
        storeGamesTitle.textContent = `Ничего не найдено по запросу "${searchInput.value}"`;
      } else {
        storeGamesTitle.textContent = `Результаты поиска по запросу "${searchInput.value}" (${foundCount})`;
      }
    }
  }

  // Сброс поиска
  function resetSearch() {
    searchInput.value = '';
    gameCards.forEach(card => {
      card.style.display = 'block';
    });
    if (storeGamesTitle) storeGamesTitle.textContent = 'Популярные игры';
  }

  // Обработчики событий
  if (searchButton) {
    searchButton.addEventListener('click', function(e) {
      e.preventDefault();
      performSearch();
    });
  }

  if (searchInput) {
    // Поиск при нажатии Enter
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        performSearch();
      }
    });

    // Очистка поиска при клике на крестик (если есть)
    searchInput.addEventListener('search', function() {
      if (this.value === '') {
        resetSearch();
      }
    });
  }

  // Добавляем кнопку "Сбросить поиск" (опционально)
  const searchContainer = document.querySelector('.search');
  if (searchContainer && !document.querySelector('.search-reset')) {
    const resetBtn = document.createElement('button');
    resetBtn.className = 'search-reset';
    resetBtn.textContent = '✕';
    resetBtn.style.cssText = `
      position: absolute;
      right: 60px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #888;
      font-size: 18px;
      cursor: pointer;
      display: none;
    `;
    
    searchContainer.style.position = 'relative';
    searchContainer.appendChild(resetBtn);
    
    resetBtn.addEventListener('click', function() {
      resetSearch();
      resetBtn.style.display = 'none';
    });
    
    searchInput.addEventListener('input', function() {
      resetBtn.style.display = this.value ? 'block' : 'none';
    });
  }
});

// Добавляем подсветку найденного текста (опционально)
function highlightText(text, searchTerm) {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}