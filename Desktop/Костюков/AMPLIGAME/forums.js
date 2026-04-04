// forums.js

document.addEventListener('DOMContentLoaded', function() {
  const btnForums = document.getElementById('btn-forums');
  const forumsPage = document.querySelector('.forums-page');
  
  function hideAllPages() {
    const pages = [
      '.store-content', '.cloud-page', '.library-page', '.settings-page',
      '.profile-page', '.friends-page', '.groups-page', '.events-page',
      '.supports-page', '.product-page', '.forums-page'
    ];
    pages.forEach(selector => {
      const page = document.querySelector(selector);
      if (page) page.style.display = 'none';
    });
  }
  
  if (btnForums) {
    btnForums.addEventListener('click', function(e) {
      e.preventDefault();
      hideAllPages();
      if (forumsPage) forumsPage.style.display = 'block';
      
      document.querySelectorAll('.sidebar-btn').forEach(btn => btn.classList.remove('active'));
      const communityBtn = document.getElementById('btn-community');
      if (communityBtn) {
        communityBtn.classList.add('active');
        const dropdownMenu = communityBtn.querySelector('.dropdown-menu');
        if (dropdownMenu) dropdownMenu.classList.add('active');
      }
      btnForums.classList.add('active');
    });
  }
  
  // Поиск по темам
  const searchInput = document.getElementById('forumsSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const term = this.value.toLowerCase();
      const topics = document.querySelectorAll('.topic-item');
      topics.forEach(topic => {
        const title = topic.querySelector('.topic-title').textContent.toLowerCase();
        topic.style.display = title.includes(term) ? 'flex' : 'none';
      });
    });
  }
  
  // При клике на тему
  document.querySelectorAll('.topic-title').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      showNotification('Страница темы откроется позже', 'info');
    });
  });
  
  document.querySelectorAll('.sidebar-btn').forEach(btn => {
    if (btn.id !== 'btn-community' && !btn.querySelector('.dropdown-link')) {
      btn.addEventListener('click', function() {
        if (forumsPage) forumsPage.style.display = 'none';
      });
    }
  });
});