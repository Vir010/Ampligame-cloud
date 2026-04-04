const LIBRARY_STORAGE_KEY = "user_game_library";

class GameLibrary {
  constructor() {
    this.games = this.loadLibrary();
  }

  loadLibrary() {
    const saved = localStorage.getItem(LIBRARY_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  saveLibrary() {
    localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(this.games));
  }

  // Добавление игры
  addGame(gameData) {
    const exists = this.games.some((game) => game.id === gameData.id);

    if (!exists) {
      this.games.push({
        id: gameData.id,
        title: gameData.title,
        price: gameData.price,
        image: gameData.image,
        developer: gameData.developer,
        genre: gameData.genre,
        purchaseDate: new Date().toLocaleDateString("ru-RU"),
        playTime: 0,
      });
      this.saveLibrary();
      return true;
    }
    return false;
  }

  // Удаление игры
  removeGame(gameId) {
    const index = this.games.findIndex((game) => game.id === gameId);
    if (index !== -1) {
      const removed = this.games[index];
      this.games.splice(index, 1);
      this.saveLibrary();
      return removed;
    }
    return null;
  }

  getGames() {
    return this.games;
  }

  hasGame(gameId) {
    return this.games.some((game) => game.id === gameId);
  }
}

// Создаем глобальный экземпляр
window.gameLibrary = new GameLibrary();

// Функция показа уведомления
function showNotification(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #8f3ed1;
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    z-index: 9999;
    font-weight: 600;
    animation: slideIn 0.3s ease;
  `;

  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

let pendingDeleteGameId = null;
let pendingDeleteGameCard = null;

function showDeleteConfirmModal(gameId, gameCard, gameTitle) {
  const modal = document.getElementById('deleteConfirmModal');
  const gameTitleSpan = document.getElementById('deleteGameTitle');
  
  if (!modal || !gameTitleSpan) return;
  
  gameTitleSpan.textContent = gameTitle;
  pendingDeleteGameId = gameId;
  pendingDeleteGameCard = gameCard;
  
  modal.classList.add('show');
}

function closeDeleteConfirmModal() {
  const modal = document.getElementById('deleteConfirmModal');
  if (modal) {
    modal.classList.remove('show');
  }
  pendingDeleteGameId = null;
  pendingDeleteGameCard = null;
}

function confirmDelete() {
  if (pendingDeleteGameId && pendingDeleteGameCard) {
    const removed = window.gameLibrary.removeGame(pendingDeleteGameId);
    if (removed) {
      pendingDeleteGameCard.remove();
      showNotification(`Игра "${removed.title}" удалена из библиотеки`);
      
      if (window.gameLibrary.getGames().length === 0) {
        const libraryPage = document.querySelector('.library-page');
        if (libraryPage) {
          libraryPage.innerHTML = '<h2 class="library-title">Моя библиотека</h2><p class="library-empty">В библиотеке пока нет игр</p>';
        }
      }
    }
  }
  closeDeleteConfirmModal();
}

// Настройка обработчиков модального окна
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('deleteConfirmModal');
  const closeBtn = document.querySelector('.delete-confirm-close');
  const cancelBtn = document.querySelector('.delete-confirm-cancel');
  const okBtn = document.querySelector('.delete-confirm-ok');
  
  if (modal) {
    if (closeBtn) closeBtn.addEventListener('click', closeDeleteConfirmModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeDeleteConfirmModal);
    if (okBtn) okBtn.addEventListener('click', confirmDelete);
    
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeDeleteConfirmModal();
    });
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeDeleteConfirmModal();
      }
    });
  }
});
// ========== КОНЕЦ МОДАЛЬНОГО ОКНА ==========

// Функция обновления библиотеки
function updateLibraryDisplay() {
  const libraryPage = document.querySelector(".library-page");
  if (!libraryPage) return;

  const games = window.gameLibrary.getGames();

  // Очищаем страницу библиотеки
  libraryPage.innerHTML = "";

  if (games.length === 0) {
    libraryPage.innerHTML =
      '<h2 class="library-title">Моя библиотека</h2><p class="library-empty">В библиотеке пока нет игр</p>';
    return;
  }

  // Создаем заголовок
  const title = document.createElement("h2");
  title.className = "library-title";
  title.textContent = "Моя библиотека";
  libraryPage.appendChild(title);

  // Создаем сетку
  const grid = document.createElement("div");
  grid.className = "library-grid";

  // Добавляем карточки игр с кнопкой "Установить"
  games.forEach((game) => {
    const card = document.createElement("div");
    card.className = "library-card";
    card.setAttribute("data-game-id", game.id);

    // Проверяем, установлена ли игра
    const isInstalled =
      localStorage.getItem(`game_installed_${game.id}`) === "true";

    card.innerHTML = `
      <img src="${game.image}" alt="${game.title}">
      <h4>${game.title}</h4>
      <div class="library-card-info">
        <span>${game.developer}</span>
        <span>${game.genre}</span>
        <span>Куплена: ${game.purchaseDate}</span>
      </div>
      <div class="library-card-buttons">
        <button class="library-install-btn ${
          isInstalled ? "installed" : ""
        }" data-game-id="${game.id}">
          ${isInstalled ? "✓ Установлено" : "Установить"}
        </button>
        <button class="library-remove-btn" data-game-id="${
          game.id
        }">Удалить</button>
      </div>
    `;

    grid.appendChild(card);
  });

  libraryPage.appendChild(grid);

  if (!document.querySelector("#library-styles")) {
    const style = document.createElement("style");
    style.id = "library-styles";
    style.textContent = `
      .library-page {
        padding: 20px;
        color: #fff;
      }
      .library-title {
        font-size: 32px;
        margin-bottom: 30px;
        color: #fff;
      }
      .library-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 25px;
      }
      .library-card {
        background: linear-gradient(145deg, #1a1a1a, #222);
        border-radius: 16px;
        padding: 20px;
        transition: all 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.05);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
      }
      .library-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(143, 62, 209, 0.2);
      }
      .library-card img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 12px;
        margin-bottom: 15px;
      }
      .library-card h4 {
        font-size: 18px;
        margin: 0 0 10px 0;
        color: #fff;
      }
      .library-card-info {
        margin-bottom: 15px;
        flex-grow: 1;
      }
      .library-card-info span {
        display: block;
        color: #a963e2;
        font-size: 13px;
        margin: 5px 0;
        padding: 3px 8px;
        background: rgba(143, 62, 209, 0.1);
        border-radius: 15px;
        width: fit-content;
      }
      .library-card-buttons {
        display: flex;
        gap: 10px;
        margin-top: auto;
      }
      .library-install-btn {
        flex: 2;
        padding: 8px 12px;
        background: #b24bc0;
        color: white;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 600;
        font-size: 13px;
      }
      .library-install-btn:hover {
        background: #ca72c3;
        transform: scale(1.02);
      }
      .library-install-btn.installed {
        background: #9f21f3;
        cursor: default;
      }
      .library-install-btn.installed:hover {
        background: #790dd1;
        transform: none;
      }
      .library-remove-btn {
        flex: 1;
        padding: 8px 12px;
        background: transparent;
        color: #c53636;
        border: 1px solid #ff4444;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 600;
        font-size: 13px;
      }
      .library-remove-btn:hover {
        background: #ff4444;
        color: white;
      }
      .library-empty {
        grid-column: 1 / -1;
        text-align: center;
        padding: 50px;
        background: rgba(26, 26, 26, 0.5);
        border-radius: 20px;
        color: #888;
        font-size: 18px;
      }
    `;
    document.head.appendChild(style);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  if (!document.querySelector(".library-page")) {
    const libraryPage = document.createElement("div");
    libraryPage.className = "library-page";
    libraryPage.style.display = "none";
    document.querySelector(".content").appendChild(libraryPage);
  }

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("library-remove-btn")) {
      const gameCard = e.target.closest(".library-card");
      if (gameCard) {
        const gameId = gameCard.getAttribute("data-game-id");
        const gameTitle = gameCard.querySelector("h4").textContent;
        showDeleteConfirmModal(gameId, gameCard, gameTitle);
      }
    }
  });

  document.querySelectorAll(".sidebar-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const productPage = document.querySelector(".product-page");
      if (productPage) {
        productPage.style.display = "none";
      }
    });
  });

  document.querySelectorAll(".dropdown-link").forEach((link) => {
    link.addEventListener("click", function () {
      const productPage = document.querySelector(".product-page");
      if (productPage) {
        productPage.style.display = "none";
      }
    });
  });

  const btnLibrary = document.getElementById("btn-library");
  if (btnLibrary) {
    btnLibrary.addEventListener("click", function () {
      updateLibraryDisplay();
    });
  }
});

document.addEventListener("click", function (e) {
  // Установка игры
  if (
    e.target.classList.contains("library-install-btn") &&
    !e.target.classList.contains("installed")
  ) {
    const gameId = e.target.getAttribute("data-game-id");
    const gameCard = e.target.closest(".library-card");
    const gameTitle = gameCard.querySelector("h4").textContent;
    const installBtn = e.target;

    if (typeof showTorrentModal === 'function') {
      const originalShowTorrentModal = window.showTorrentModal;
      const originalDownloadTorrent = window.downloadTorrent;
      
      let isInstalled = false;
      
      window.downloadTorrent = function(id, name) {
        if (originalDownloadTorrent) originalDownloadTorrent(id, name);
        
        if (!isInstalled && id === gameId) {
          isInstalled = true;
          installBtn.textContent = "✓ Установлено";
          installBtn.classList.add("installed");
          installBtn.disabled = false;
          
          localStorage.setItem(`game_installed_${gameId}`, "true");
          showNotification(`Игра "${gameTitle}" успешно установлена! Торрент-файл загружен.`);
        }
      };
      
      window.showTorrentModal = function(id, name) {
        originalShowTorrentModal(id, name);
        
        const checkInterval = setInterval(() => {
          const modal = document.querySelector('.torrent-modal');
          if (!modal || !modal.classList.contains('show')) {
            clearInterval(checkInterval);
            if (!isInstalled) {
              installBtn.textContent = "Установить";
              installBtn.disabled = false;
            }
            window.showTorrentModal = originalShowTorrentModal;
            window.downloadTorrent = originalDownloadTorrent;
          }
        }, 500);
      };
      
      showTorrentModal(gameId, gameTitle);
      
      installBtn.textContent = "Загрузка...";
      installBtn.disabled = true;
    } else {
      installBtn.textContent = "Установка...";
      installBtn.disabled = true;
      
      setTimeout(() => {
        localStorage.setItem(`game_installed_${gameId}`, "true");
        installBtn.textContent = "✓ Установлено";
        installBtn.classList.add("installed");
        installBtn.disabled = false;
        showNotification(`Игра "${gameTitle}" успешно установлена!`);
      }, 2000);
    }
  }
});
// ========== КОНЕЦ ОБРАБОТЧИКА УСТАНОВКИ ==========

// Обновляем функцию добавления игры, чтобы сбрасывать статус установки
const originalAddGame = window.gameLibrary.addGame;
window.gameLibrary.addGame = function (gameData) {
  const result = originalAddGame.call(this, gameData);
  if (result) {
    // При добавлении новой игры сбрасываем статус установки
    localStorage.removeItem(`game_installed_${gameData.id}`);
  }
  return result;
};