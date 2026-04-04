// setting.js

document.addEventListener('DOMContentLoaded', () => {
  const btnSetting = document.getElementById('btn-setting');
  const storeContent = document.querySelector('.store-content');
  const cloudPage = document.querySelector('.cloud-page');
  const profilePage = document.querySelector('.profile-page');

  function hideAllPages() {
    if (storeContent) storeContent.style.display = 'none';
    if (cloudPage) cloudPage.style.display = 'none';
    if (profilePage) profilePage.style.display = 'none';
    
    const friendsPage = document.querySelector('.friends-page');
    const groupsPage = document.querySelector('.groups-page');
    const forumsPage = document.querySelector('.forums-page');
    const eventsPage = document.querySelector('.events-page');
    const libraryPage = document.querySelector('.library-page');
    const supportsPage = document.querySelector('.supports-page');
    
    if (friendsPage) friendsPage.style.display = 'none';
    if (groupsPage) groupsPage.style.display = 'none';
    if (forumsPage) forumsPage.style.display = 'none';
    if (eventsPage) eventsPage.style.display = 'none';
    if (libraryPage) libraryPage.style.display = 'none';
    if (supportsPage) supportsPage.style.display = 'none';
  }

  // Инициализация обработчиков для загрузки аватарки
  function initAvatarUpload() {
    const avatarUpload = document.querySelector('#tab-profile input[type="file"]');
    const avatarPreview = document.getElementById('userAvatar');
    const saveProfileBtn = document.querySelector('#tab-profile .settings-save-btn');
    const statusSelect = document.querySelector('#tab-profile select');
    
    if (avatarUpload) {
      avatarUpload.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
          const file = this.files[0];
          
          // Показываем название файла (можно добавить элемент для отображения)
          console.log('Выбран файл:', file.name);
        }
      });
    }
    
    // Сохранение профиля
    if (saveProfileBtn) {
      saveProfileBtn.addEventListener('click', function() {
        const displayName = document.querySelector('#tab-profile input[type="text"]')?.value || 'Player123';
        const status = statusSelect?.value || 'Онлайн';
        const avatarFile = document.querySelector('#tab-profile input[type="file"]')?.files[0];
        
        // Сохраняем имя пользователя
        localStorage.setItem('user_display_name', displayName);
        
        // Обновляем статус
        const avatarStatus = document.querySelector('.avatar-status');
        if (avatarStatus) {
          let statusClass = 'online';
          if (status === 'Не беспокоить') statusClass = 'offline';
          if (status === 'Невидимка') statusClass = 'offline';
          avatarStatus.className = `avatar-status ${statusClass}`;
        }
        
        // Если выбран файл аватарки
        if (avatarFile) {
          const reader = new FileReader();
          reader.onload = function(e) {
            // Сохраняем аватарку в localStorage
            localStorage.setItem('user_avatar', e.target.result);
            
            // Обновляем аватарку рядом с балансом
            const userAvatar = document.getElementById('userAvatar');
            if (userAvatar) {
              userAvatar.src = e.target.result;
            }
            
            showNotification('Профиль успешно обновлен!', 'success');
          };
          reader.readAsDataURL(avatarFile);
        } else {
          showNotification('Профиль обновлен!', 'success');
        }
      });
    }
  }

  // Загружаем сохраненную аватарку при старте
  function loadSavedAvatar() {
    const savedAvatar = localStorage.getItem('user_avatar');
    const userAvatar = document.getElementById('userAvatar');
    if (savedAvatar && userAvatar) {
      userAvatar.src = savedAvatar;
    }
  }

  // Вызываем загрузку аватарки
  loadSavedAvatar();

  // Обработчик для кнопки Settings
  if (btnSetting) {
    btnSetting.addEventListener('click', (e) => {
      e.preventDefault();

      hideAllPages();

      const settingsPage = document.querySelector('.settings-page');
      if (settingsPage) {
        settingsPage.style.display = 'block';
      }

      document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      btnSetting.classList.add('active');

      const communityMenu = document.querySelector('#btn-community .dropdown-menu');
      if (communityMenu) {
        communityMenu.classList.remove('active');
        document.getElementById('btn-community')?.classList.remove('active');
      }
      
      // Инициализируем загрузку аватарки при открытии настроек
      setTimeout(initAvatarUpload, 100);
    });
  }

  // Скрываем настройки при клике на другие кнопки
  const sidebarButtons = document.querySelectorAll('.sidebar-btn');
  sidebarButtons.forEach(btn => {
    if (btn.id !== 'btn-setting') {
      btn.addEventListener('click', () => {
        const settingsPage = document.querySelector('.settings-page');
        if (settingsPage) {
          settingsPage.style.display = 'none';
        }
      });
    }
  });

  // Переключение вкладок в настройках
  const menuItems = document.querySelectorAll('.settings-menu-item');
  const tabs = document.querySelectorAll('.settings-tab');
  
  menuItems.forEach(item => {
    item.addEventListener('click', function() {
      // Убираем active со всех пунктов меню
      menuItems.forEach(i => i.classList.remove('active'));
      
      // Добавляем active текущему пункту
      this.classList.add('active');
      
      // Получаем id вкладки из data-tab
      const tabId = this.getAttribute('data-tab');
      
      // Скрываем все вкладки
      tabs.forEach(tab => tab.style.display = 'none');
      
      // Показываем нужную вкладку
      const activeTab = document.getElementById(`tab-${tabId}`);
      if (activeTab) {
        activeTab.style.display = 'block';
      }
    });
  });

  // Показываем первую вкладку по умолчанию
  const firstTab = document.getElementById('tab-account');
  if (firstTab) {
    firstTab.style.display = 'block';
  }
});

// Функция уведомлений
function showNotification(message, type = 'success') {
  // Проверяем, есть ли уже функция уведомлений
  if (typeof window.showNotification === 'function') {
    window.showNotification(message, type);
    return;
  }
  
  // Создаем уведомление
  const notification = document.createElement('div');
  notification.textContent = message;
  
  const colors = {
    success: '#8f3ed1',
    error: '#ff4444',
    warning: '#ffaa00'
  };
  
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 30px;
    background: ${colors[type] || colors.success};
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    z-index: 9999;
    font-weight: 600;
    animation: slideIn 0.3s ease;
    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
  `;
  
  // Добавляем анимацию
  const style = document.createElement('style');
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