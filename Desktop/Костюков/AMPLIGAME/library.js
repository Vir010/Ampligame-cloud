// library.js

document.addEventListener('DOMContentLoaded', () => {
  const btnLibrary = document.getElementById('btn-library');
  const storeContent = document.querySelector('.store-content');
  const cloudPage = document.querySelector('.cloud-page');
  const profilePage = document.querySelector('.profile-page');

  // Функция скрытия всех страниц
  function hideAllPages() {
    if (storeContent) storeContent.style.display = 'none';
    if (cloudPage) cloudPage.style.display = 'none';
    if (profilePage) profilePage.style.display = 'none';
    const libraryPage = document.querySelector('.library-page');
    if (libraryPage) libraryPage.style.display = 'none';
    // Другие страницы (friends, groups и т.д.)
    const friendsPage = document.querySelector('.friends-page');
    const groupsPage = document.querySelector('.groups-page');
    const forumsPage = document.querySelector('.forums-page');
    const eventsPage = document.querySelector('.events-page');
    if (friendsPage) friendsPage.style.display = 'none';
    if (groupsPage) groupsPage.style.display = 'none';
    if (forumsPage) forumsPage.style.display = 'none';
    if (eventsPage) eventsPage.style.display = 'none';
  }

  // Создаём пустую страницу библиотеки, если её нет в HTML
  function createEmptyLibraryPage() {
    const content = document.querySelector('.content');
    if (!content) return;
    if (document.querySelector('.library-page')) return;

    const libraryDiv = document.createElement('div');
    libraryDiv.className = 'library-page';
    libraryDiv.style.display = 'none'; // изначально скрыта
    libraryDiv.innerHTML = `
      <h2 class="library-title">Моя библиотека</h2>
      <p class="library-empty">Здесь пока ничего нет</p>
    `;

    // Добавим минимальные стили, чтобы выглядело аккуратно
    const style = document.createElement('style');
    style.textContent = `
      .library-page {
        padding: 20px;
        color: #fff;
      }
      .library-title {
        font-size: 32px;
        margin-bottom: 30px;
      }
      .library-empty {
        font-size: 18px;
        color: #888;
      }
    `;
    document.head.appendChild(style);

    content.appendChild(libraryDiv);
  }

  // Создаём пустую страницу при загрузке, если её нет
  createEmptyLibraryPage();

  // Обработчик клика на кнопку Library
  if (btnLibrary) {
    btnLibrary.addEventListener('click', (e) => {
      e.preventDefault();

      // Скрываем все страницы
      hideAllPages();

      // Показываем библиотеку
      const libraryPage = document.querySelector('.library-page');
      if (libraryPage) {
        libraryPage.style.display = 'block';
      }

      // Убираем активный класс с других кнопок и ставим на Library
      document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      btnLibrary.classList.add('active');

      // Закрываем дропдаун Community, если открыт
      const communityMenu = document.querySelector('#btn-community .dropdown-menu');
      if (communityMenu) {
        communityMenu.classList.remove('active');
        document.getElementById('btn-community')?.classList.remove('active');
      }
    });
  }

  // Скрываем библиотеку при клике на любую другую кнопку сайдбара (кроме Library)
  const sidebarButtons = document.querySelectorAll('.sidebar-btn');
  sidebarButtons.forEach(btn => {
    if (btn.id !== 'btn-library') {
      btn.addEventListener('click', () => {
        const libraryPage = document.querySelector('.library-page');
        if (libraryPage) {
          libraryPage.style.display = 'none';
        }
      });
    }
  });
});