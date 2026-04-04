// torrent-download.js

// База данных торрент-файлов (в реальном проекте ссылки будут на реальные файлы)
const torrentFiles = {
  "the-witcher-3": {
    name: "The Witcher 3",
    file: "./torrents/witcher3.torrent", // путь к торрент файлу
    size: "35 GB",
    magnet: "magnet:?xt=urn:btih:...", // или magnet-ссылка
  },
  "cyberpunk-2077": {
    name: "Cyberpunk 2077",
    file: "./torrents/cyberpunk2077.torrent",
    size: "45 GB",
    magnet: "magnet:?xt=urn:btih:...",
  },
  starfield: {
    name: "Starfield",
    file: "./torrents/starfield.torrent",
    size: "180 GB",
    magnet: "magnet:?xt=urn:btih:...",
  },
  "gta-v": {
    name: "GTA V",
    file: "./torrents/gtav.torrent",
    size: "108 GB",
    magnet: "magnet:?xt=urn:btih:...",
  },
  "red-dead-redemption-2": {
    name: "Red Dead Redemption 2",
    file: "./torrents/rdr2.torrent",
    size: "120 GB",
    magnet: "magnet:?xt=urn:btih:...",
  },
  "elden-ring": {
    name: "Elden Ring",
    file: "./torrents/eldenring.torrent",
    size: "67 GB",
    magnet: "magnet:?xt=urn:btih:...",
  },
  "assassin-s-creed-i": {
    name: "Assassin's Creed I",
    file: "./torrents/ac1.torrent",
    size: "8 GB",
    magnet: "magnet:?xt=urn:btih:...",
  },
  "hogwarts-legacy": {
    name: "Hogwarts Legacy",
    file: "./torrents/hogwarts.torrent",
    size: "40 GB",
    magnet: "magnet:?xt=urn:btih:...",
  },
  "forza-horizon-5": {
    name: "Forza Horizon 5",
    file: "./torrents/forza-horizon.torrent",
    size: "150 GB",
    magnet: "magnet:?xt=urn:btih:...",
  },
  "star-craft": {
    name: "Star Craft",
    file: "./torrents/starcraft.torrent",
    size: "5 GB",
    magnet: "magnet:?xt=urn:btih:...",
  },
  "assassin-s-creed-mirage": {
    // правильный ID из консоли
    name: "Assassin's Creed Mirage",
    file: "./torrents/assassinsmirage.torrent",
    size: "68 GB",
    magnet: "magnet:?xt=urn:btih:...",
  },
  "resident-evil-4": {
    name: "Resident Evil 4",
    file: "./torrents/re4.torrent",
    size: "25 GB",
    magnet: "magnet:?xt=urn:btih:...",
  },
  "god-of-war": {
    name: "God of War",
    file: "./torrents/gow.torrent",
    size: "65 GB",
    magnet: "magnet:?xt=urn:btih:...",
  },
  "spider-man-remastered": {
    name: "Spider-Man Remastered",
    file: "./torrents/spiderman.torrent",
    size: "45 GB",
    magnet: "magnet:?xt=urn:btih:...",
  },
  "dead-space-2": {
    name: "Dead Space 2",
    file: "./torrents/deadspace2.torrent",
    size: "12 GB",
    magnet: "magnet:?xt=urn:btih:...",
  },
  "sid-meier-s-civilization-vii": {
    name: "Sid Meier’s Civilization VII",
    file: "./torrents/sid-meier-s-civilization-vii.torrent",
    size: "15 GB",
    magnet: "magnet:?xt=urn:btih:...",
  },
  terraria: {
    name: "Terraria",
    file: "./torrents/terraria.torrent",
    size: "2 GB",
    magnet: "magnet:?xt=urn:btih:...",
  },
  "tiny-bunny": {
    name: "Tiny Bunny",
    file: "./torrents/tinybunny.torrent",
    size: "3 GB",
    magnet: "magnet:?xt=urn:btih:...",
  },
  "dark-souls-remastered": {
    name: "Dark Souls Remastered",
    file: "./torrents/Dark-Souls-Remastered.torrent",
    size: "4,48 GB",
    magnet: "magnet:?xt=urn:btih:...",
  },
  "icarus": {
    name: "icarus",
    file: "./torrents/icarus.torrent",
    size: "70 GB",
    magnet: "magnet:?xt=urn:btih:...",
  },
  "dying-light": {
    name: "Dying Light",
    file: "./torrents/DL1.torrent",
    size: "37 GB",
    magnet: "magnet:?xt=urn:btih:...",
  },
  "sons-of-the-forest": {
    name: "Sons Of The Forest",
    file: "./torrents/forest.torrent",
    size: "7.7 GB",
    magnet: "magnet:?xt=urn:btih:...",
  },
   "rust": {
    name: "RUST",
    file: "./torrents/rust.torrent",
    size: " 50 GB",
    magnet: "magnet:?xt=urn:btih:...",
  },
  "phasmophobia": {
    name: "Phasmophobia",
    file: "./torrents/phasmophobia.torrent",
    size: " 40 GB",
    magnet: "magnet:?xt=urn:btih:...",
  },
  "it-takes-two": {
    name: "It Takes Two",
    file: "./torrents/it-takes-two.torrent",
    size: " 40,8 GB",
    magnet: "magnet:?xt=urn:btih:...",
  },
  "silent-hill-2": {
    name: "Silent Hill 2",
    file: "./torrents/silenthill2.torrent",
    size: " 25,9 GB",
    magnet: "magnet:?xt=urn:btih:...",
  },
  "hollow-knight": {
    name: "Hollow Knight",
    file: "./torrents/HollowKnight.torrent",
    size: " 934 MB",
    magnet: "magnet:?xt=urn:btih:...",
  },
  "sekiro": {
    name: "Sekiro",
    file: "./torrents/sekiro.torrent",
    size: " 15 GB",
    magnet: "magnet:?xt=urn:btih:...",
  },
  "silent-hill-f": {
    name: "Silent Hill f",
    file: "./torrents/silent-hill-f.torrent",
    size: " 44 GB",
    magnet: "magnet:?xt=urn:btih:...",
  },
  "reanimal": {
    name: "REANIMAL",
    file: "./torrents/reanimal.torrent",
    size: " 14,58 GB",
    magnet: "magnet:?xt=urn:btih:...",
  },
};

// Функция для скачивания торрент-файла
function downloadTorrent(gameId, gameName) {
  const torrent = torrentFiles[gameId];

  if (!torrent) {
    showNotification(`Торрент-файл для "${gameName}" не найден`, "error");
    return;
  }

  showNotification(`Подготовка торрент-файла для "${gameName}"...`, "info");

  setTimeout(() => {
    const link = document.createElement("a");
    link.href = torrent.file;
    link.download = `${gameId}.torrent`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification(`Торрент-файл для "${gameName}" загружается`, "success");

    setTimeout(() => {
      showNotification(`Размер игры: ${torrent.size}`, "info");
    }, 2000);
  }, 1000);
}

// Создаем модальное окно с информацией о торренте
function showTorrentModal(gameId, gameName) {
  const torrent = torrentFiles[gameId];

  if (!torrent) {
    downloadTorrent(gameId, gameName);
    return;
  }

  // Удаляем существующее модальное окно, если есть
  const existingModal = document.querySelector('.torrent-modal');
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement("div");
  modal.className = "torrent-modal";
  modal.innerHTML = `
    <div class="torrent-modal-content">
      <div class="torrent-modal-header">
        <h3>Скачивание: ${gameName}</h3>
        <button class="torrent-close-btn">×</button>
      </div>
      <div class="torrent-modal-body">
        <div class="torrent-info">
          <p><strong>Размер игры:</strong> ${torrent.size}</p>
          <p><strong>Тип файла:</strong> .torrent</p>
          <p>Для скачивания игры необходимо использовать торрент-клиент (uTorrent, qBittorrent и т.д.)</p>
        </div>
        <div class="torrent-actions">
          <button class="torrent-download-btn" id="downloadTorrentBtn">
            <span class="torrent-icon">⬇️</span> Скачать .torrent
          </button>
          ${
            torrent.magnet
              ? `
            <button class="torrent-magnet-btn" id="magnetLinkBtn">
              <span class="torrent-icon">🧲</span> Magnet-ссылка
            </button>
          `
              : ""
          }
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add("show"), 10);

  // Единая функция закрытия
  function closeModal() {
    modal.classList.remove("show");
    setTimeout(() => {
      if (modal.parentNode) modal.remove();
    }, 300);
  }

  // Закрытие по крестику
  const closeBtn = modal.querySelector(".torrent-close-btn");
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeModal();
  });

  // Закрытие по клику вне окна
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Обработчик кнопки скачивания
  const downloadBtn = modal.querySelector("#downloadTorrentBtn");
  downloadBtn.addEventListener("click", () => {
    downloadTorrent(gameId, gameName);
    closeModal();
  });

  // Обработчик magnet-ссылки
  const magnetBtn = modal.querySelector("#magnetLinkBtn");
  if (magnetBtn) {
    magnetBtn.addEventListener("click", () => {
      window.open(torrent.magnet, "_blank");
      showNotification(
        `Magnet-ссылка для "${gameName}" открыта в новой вкладке`,
        "info"
      );
      closeModal();
    });
  }
}

// Добавляем стили для модального окна торрента
const torrentStyles = document.createElement("style");
torrentStyles.textContent = `
  .torrent-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 10001;
    animation: fadeIn 0.3s ease;
  }
  
  .torrent-modal.show {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .torrent-modal-content {
    background: #1a1a1a;
    width: 90%;
    max-width: 450px;
    border-radius: 20px;
    overflow: hidden;
    border: 2px solid #8f3ed1;
    animation: slideUp 0.3s ease;
  }
  
  .torrent-modal-header {
    background: linear-gradient(135deg, #8f3ed1, #a110ce);
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .torrent-modal-header h3 {
    margin: 0;
    color: white;
    font-size: 18px;
  }
  
  .torrent-close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.3s ease;
  }
  
  .torrent-close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .torrent-modal-body {
    padding: 25px;
  }
  
  .torrent-info {
    margin-bottom: 25px;
  }
  
  .torrent-info p {
    margin: 10px 0;
    color: #b4a8ff;
    font-size: 14px;
    line-height: 1.6;
  }
  
  .torrent-info strong {
    color: #8f3ed1;
  }
  
  .torrent-actions {
    display: flex;
    gap: 15px;
    justify-content: center;
  }
  
  .torrent-download-btn, .torrent-magnet-btn {
    flex: 1;
    padding: 12px 20px;
    border: none;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  .torrent-download-btn {
    background: linear-gradient(135deg, #8f3ed1, #782292);
    color: white;
  }
  
  .torrent-download-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 20px rgba(143, 62, 209, 0.5);
  }
  
  .torrent-magnet-btn {
    background: transparent;
    color: #8b2e94;
    border: 2px solid #9a39c0;
  }
  
  .torrent-magnet-btn:hover {
    background: rgba(143, 62, 209, 0.1);
    transform: scale(1.05);
  }
  
  .torrent-icon {
    font-size: 16px;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

document.head.appendChild(torrentStyles);

// Переопределяем обработчик кнопки установки в библиотеке
document.addEventListener("DOMContentLoaded", function () {
  // Сохраняем оригинальный обработчик, если нужно
  const originalClickListener = document.body.onclick;

  // Добавляем новый обработчик для кнопок установки
  document.addEventListener("click", function (e) {
    // Для кнопки установки на странице игры
    if (
      e.target.classList.contains("library-install-btn") &&
      !e.target.classList.contains("installed")
    ) {
      e.preventDefault();

      const gameCard =
        e.target.closest(".library-card") || e.target.closest(".product-page");
      let gameId, gameName;

      if (gameCard) {
        if (gameCard.classList.contains("library-card")) {
          gameId = gameCard.getAttribute("data-game-id");
          gameName = gameCard.querySelector("h4").textContent;
        } else if (gameCard.classList.contains("product-page")) {
          gameId = gameCard.getAttribute("data-product-id");
          gameName = gameCard.querySelector(".product-title").textContent;
        }
      }

      if (gameId && gameName) {
        // Вместо имитации установки показываем модальное окно с торрентом
        showTorrentModal(gameId, gameName);
      }
    }

    // Для кнопки установки в карточке библиотеки (если есть)
    if (e.target.classList.contains("library-install-btn")) {
      const gameCard = e.target.closest(".library-card");
      if (gameCard) {
        const gameId = gameCard.getAttribute("data-game-id");
        const gameName = gameCard.querySelector("h4").textContent;
        showTorrentModal(gameId, gameName);
      }
    }
  });
});
