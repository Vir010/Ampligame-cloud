// script.js

const buttons = document.querySelectorAll('.sidebar-btn');
const mainHeader = document.getElementById('mainHeader');

buttons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    // Находим кнопку Community
    const isCommunity = btn.id.includes('btn-community');
    const dropdownMenu = btn.querySelector('.dropdown-menu');

    if (isCommunity && dropdownMenu) {
      e.preventDefault();
      
      const isOpen = dropdownMenu.classList.contains('active');

      // Закрываем другие выпадающие списки
      document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('active'));
      document.querySelectorAll('.sidebar-btn').forEach(b => {
          if (b !== btn) b.classList.remove('active');
      });

      // Переключаем текущее меню
      if (!isOpen) {
        dropdownMenu.classList.add('active');
        btn.classList.add('active');
      } else {
        dropdownMenu.classList.remove('active');
        btn.classList.remove('active');
      }
      return;
    }

    // Логика для обычных кнопок
    buttons.forEach(b => {
      b.classList.remove('active');
      const menu = b.querySelector('.dropdown-menu');
      if (menu) menu.classList.remove('active');
    });

    btn.classList.add('active');

    // Управление хедером (с проверкой на существование mainHeader)
    if (mainHeader) {
      if (btn.id === 'btn-cloud') {
        mainHeader.style.display = 'flex';
      } else {
        mainHeader.style.display = 'none';
      }
    }
  });
});

// Закрытие при клике в пустую область
document.addEventListener('click', (e) => {
  const communityBtn = document.querySelector('[id*="btn-community"]');
  if (communityBtn && !communityBtn.contains(e.target)) {
    const menu = communityBtn.querySelector('.dropdown-menu');
    if (menu) {
      menu.classList.remove('active');
      communityBtn.classList.remove('active');
    }
  }
});