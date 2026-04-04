document.addEventListener('DOMContentLoaded', function() {
  const btnEvents = document.getElementById('btn-events');
  const eventsPage = document.querySelector('.events-page');
  
  // Функция скрытия всех страниц
  function hideAllPages() {
    const pages = [
      '.store-content',
      '.cloud-page',
      '.library-page',
      '.settings-page',
      '.profile-page',
      '.friends-page',
      '.groups-page',
      '.forums-page',
      '.supports-page',
      '.events-page'
    ];
    
    pages.forEach(selector => {
      const page = document.querySelector(selector);
      if (page) page.style.display = 'none';
    });
  }

  // Показываем страницу событий
  if (btnEvents) {
    btnEvents.addEventListener('click', function(e) {
      e.preventDefault();
      
      hideAllPages();
      
      if (eventsPage) {
        eventsPage.style.display = 'block';
      }
      
      // Управление активными классами в сайдбаре
      document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Активируем Community и Events
      const communityBtn = document.getElementById('btn-community');
      if (communityBtn) {
        communityBtn.classList.add('active');
        const dropdownMenu = communityBtn.querySelector('.dropdown-menu');
        if (dropdownMenu) {
          dropdownMenu.classList.add('active');
        }
      }
      
      // Активируем пункт Events в меню
      const eventsMenuItem = document.querySelector('#btn-events').closest('li');
      if (eventsMenuItem) {
        eventsMenuItem.classList.add('active');
      }
    });
  }

  // Переключение вкладок событий
  const tabBtns = document.querySelectorAll('.events-tab-btn');
  const tabContents = document.querySelectorAll('.events-tab-content');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Убираем активный класс у всех кнопок
      tabBtns.forEach(b => b.classList.remove('active'));
      
      // Добавляем активный класс текущей кнопке
      this.classList.add('active');
      
      // Получаем id вкладки
      const tabId = this.getAttribute('data-tab');
      
      // Скрываем все содержимое вкладок
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Показываем нужную вкладку
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Обработка кнопок "Участвовать"
  document.querySelectorAll('.tournament-join-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const tournamentCard = this.closest('.tournament-card');
      const tournamentName = tournamentCard.querySelector('h3').textContent;
      
      if (typeof showNotification === 'function') {
        showNotification(`Вы участвуете в турнире "${tournamentName}"`, 'success');
      } else {
        alert(`Вы участвуете в турнире "${tournamentName}"`);
      }
    });
  });

  // Обработка кнопки "Создать турнир"
  const createBtn = document.querySelector('.create-tournament-btn');
  if (createBtn) {
    createBtn.addEventListener('click', function() {
      if (typeof showNotification === 'function') {
        showNotification('Функция создания турнира будет доступна позже', 'info');
      } else {
        alert('Функция создания турнира будет доступна позже');
      }
    });
  }

  // При клике на другие кнопки сайдбара скрываем страницу событий
  document.querySelectorAll('.sidebar-btn').forEach(btn => {
    if (btn.id !== 'btn-community' && !btn.querySelector('.dropdown-link')) {
      btn.addEventListener('click', function() {
        if (eventsPage) {
          eventsPage.style.display = 'none';
        }
      });
    }
  });
});