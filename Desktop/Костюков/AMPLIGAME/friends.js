// friends.js

// Ключи для localStorage
const FRIENDS_STORAGE_KEY = "user_friends";
const REQUESTS_STORAGE_KEY = "friend_requests";
const BLOCKED_STORAGE_KEY = "blocked_users";

// Класс для управления друзьями
class FriendsManager {
  constructor() {
    this.friends = this.loadFriends();
    this.requests = this.loadRequests();
    this.blocked = this.loadBlocked();
  }

  loadFriends() {
    const saved = localStorage.getItem(FRIENDS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  loadRequests() {
    const saved = localStorage.getItem(REQUESTS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  loadBlocked() {
    const saved = localStorage.getItem(BLOCKED_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  saveFriends() {
    localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(this.friends));
  }

  saveRequests() {
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(this.requests));
  }

  saveBlocked() {
    localStorage.setItem(BLOCKED_STORAGE_KEY, JSON.stringify(this.blocked));
  }

  addFriend(friend) {
    this.friends.push(friend);
    this.saveFriends();
  }

  removeFriend(friendId) {
    this.friends = this.friends.filter(f => f.id !== friendId);
    this.saveFriends();
  }

  addRequest(request) {
    this.requests.push(request);
    this.saveRequests();
  }

  removeRequest(requestId) {
    this.requests = this.requests.filter(r => r.id !== requestId);
    this.saveRequests();
  }

  acceptRequest(requestId) {
    const request = this.requests.find(r => r.id === requestId);
    if (request) {
      this.addFriend({
        id: request.id,
        name: request.name,
        avatar: request.avatar,
        game: request.game || "Не в игре",
        hoursTogether: 0,
        lastActive: "Только что",
        status: "offline"
      });
      this.removeRequest(requestId);
    }
  }

  getFriends() {
    return this.friends;
  }

  getRequests() {
    return this.requests;
  }

  getBlocked() {
    return this.blocked;
  }
}

window.friendsManager = new FriendsManager();

// Функция показа уведомления
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 30px;
    background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#ff4444' : '#8f3ed1'};
    color: white;
    padding: 12px 24px;
    border-radius: 10px;
    z-index: 10000;
    font-weight: 600;
    animation: slideInRight 0.3s ease;
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// Функция обновления отображения друзей
function updateFriendsDisplay() {
  const friends = window.friendsManager.getFriends();
  const requests = window.friendsManager.getRequests();
  const blocked = window.friendsManager.getBlocked();

  // Обновляем счетчики
  document.getElementById('onlineCount').textContent = friends.filter(f => f.status === 'online').length;
  document.getElementById('allCount').textContent = friends.length;
  document.getElementById('requestsCount').textContent = requests.length;

  // Онлайн друзья
  const onlineList = document.getElementById('onlineList');
  const onlineFriends = friends.filter(f => f.status === 'online');
  if (onlineFriends.length === 0) {
    onlineList.innerHTML = '<div class="empty-state">Нет друзей в сети</div>';
  } else {
    onlineList.innerHTML = onlineFriends.map(friend => `
      <div class="friend-item">
        <div class="friend-avatar">
          ${friend.avatar || friend.name.charAt(0).toUpperCase()}
          <div class="friend-status online"></div>
        </div>
        <div class="friend-info">
          <div class="friend-name">${friend.name}</div>
          <div class="friend-game">${friend.game}</div>
          <div class="friend-meta">
            <span>${friend.hoursTogether || 0} часов вместе</span>
            <span>•</span>
            <span>${friend.lastActive || 'Сейчас в игре'}</span>
          </div>
        </div>
        <div class="friend-actions">
          <button class="friend-action invite" data-name="${friend.name}">Пригласить</button>
          <button class="friend-action message" data-name="${friend.name}">Сообщение</button>
        </div>
      </div>
    `).join('');
  }

  // Все друзья
  const allList = document.getElementById('allList');
  if (friends.length === 0) {
    allList.innerHTML = '<div class="empty-state">У вас пока нет друзей</div>';
  } else {
    allList.innerHTML = friends.map(friend => `
      <div class="friend-item">
        <div class="friend-avatar">
          ${friend.avatar || friend.name.charAt(0).toUpperCase()}
          <div class="friend-status ${friend.status}"></div>
        </div>
        <div class="friend-info">
          <div class="friend-name">${friend.name}</div>
          <div class="friend-game">${friend.game}</div>
          <div class="friend-meta">
            <span>${friend.hoursTogether || 0} часов вместе</span>
            <span>•</span>
            <span>${friend.lastActive || 'Был(а) недавно'}</span>
          </div>
        </div>
        <div class="friend-actions">
          <button class="friend-action invite" data-name="${friend.name}">Пригласить</button>
          <button class="friend-action message" data-name="${friend.name}">Сообщение</button>
        </div>
      </div>
    `).join('');
  }

  // Заявки
  const requestsList = document.getElementById('requestsList');
  if (requests.length === 0) {
    requestsList.innerHTML = '<div class="empty-state">Нет новых заявок</div>';
  } else {
    requestsList.innerHTML = requests.map(req => `
      <div class="request-item">
        <div class="request-avatar">${req.avatar || req.name.charAt(0).toUpperCase()}</div>
        <div class="request-info">
          <div class="request-name">${req.name}</div>
          <div class="request-message">${req.message || 'Хочет добавить вас в друзья'}</div>
        </div>
        <div class="request-actions">
          <button class="request-accept" data-id="${req.id}">Принять</button>
          <button class="request-decline" data-id="${req.id}">Отклонить</button>
        </div>
      </div>
    `).join('');
  }

  // Черный список
  const blockedList = document.getElementById('blockedList');
  if (blocked.length === 0) {
    blockedList.innerHTML = '<div class="empty-state">Черный список пуст</div>';
  } else {
    blockedList.innerHTML = blocked.map(user => `
      <div class="blocked-item">
        <div class="blocked-avatar">${user.avatar || user.name.charAt(0).toUpperCase()}</div>
        <div class="blocked-info">
          <div class="blocked-name">${user.name}</div>
          <div class="blocked-reason">${user.reason || 'Заблокирован'}</div>
        </div>
        <button class="unblock-btn" data-id="${user.id}">Разблокировать</button>
      </div>
    `).join('');
  }

  // Добавляем обработчики событий
  addEventListeners();
}

function addEventListeners() {
  // Кнопки пригласить
  document.querySelectorAll('.friend-action.invite').forEach(btn => {
    btn.onclick = () => showNotification(`Приглашение отправлено ${btn.dataset.name}`, 'info');
  });

  // Кнопки сообщение
  document.querySelectorAll('.friend-action.message').forEach(btn => {
    btn.onclick = () => showNotification(`Чат с ${btn.dataset.name} откроется позже`, 'info');
  });

  // Принять заявку
  document.querySelectorAll('.request-accept').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      window.friendsManager.acceptRequest(id);
      updateFriendsDisplay();
      showNotification('Заявка принята', 'success');
    };
  });

  // Отклонить заявку
  document.querySelectorAll('.request-decline').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      window.friendsManager.removeRequest(id);
      updateFriendsDisplay();
      showNotification('Заявка отклонена', 'info');
    };
  });

  // Разблокировать
  document.querySelectorAll('.unblock-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      window.friendsManager.blocked = window.friendsManager.blocked.filter(b => b.id !== id);
      window.friendsManager.saveBlocked();
      updateFriendsDisplay();
      showNotification('Пользователь разблокирован', 'success');
    };
  });
}

// Инициализация страницы
document.addEventListener('DOMContentLoaded', function() {
  const btnFriends = document.getElementById('btn-friends');
  const friendsPage = document.querySelector('.friends-page');
  const searchInput = document.getElementById('friendsSearchInput');
  const addFriendBtn = document.getElementById('addFriendBtn');
  const modal = document.getElementById('addFriendModal');
  const closeModal = document.querySelector('.add-friend-close');
  const sendRequestBtn = document.getElementById('sendRequestBtn');
  const friendNickname = document.getElementById('friendNickname');

  // Функция скрытия всех страниц
  function hideAllPages() {
    const pages = ['.store-content', '.cloud-page', '.library-page', '.settings-page', '.profile-page', '.groups-page', '.events-page', '.supports-page', '.product-page', '.friends-page'];
    pages.forEach(selector => {
      const page = document.querySelector(selector);
      if (page) page.style.display = 'none';
    });
  }

  // Показываем страницу друзей
  if (btnFriends) {
    btnFriends.addEventListener('click', function(e) {
      e.preventDefault();
      hideAllPages();
      if (friendsPage) friendsPage.style.display = 'block';
      
      document.querySelectorAll('.sidebar-btn').forEach(btn => btn.classList.remove('active'));
      const communityBtn = document.getElementById('btn-community');
      if (communityBtn) {
        communityBtn.classList.add('active');
        const dropdownMenu = communityBtn.querySelector('.dropdown-menu');
        if (dropdownMenu) dropdownMenu.classList.add('active');
      }
      btnFriends.classList.add('active');
      
      updateFriendsDisplay();
    });
  }

  // Переключение вкладок
  document.querySelectorAll('.friends-tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const tabId = this.dataset.tab;
      document.querySelectorAll('.friends-tab-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      document.querySelectorAll('.friends-tab-content').forEach(content => content.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Поиск
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const term = this.value.toLowerCase();
      document.querySelectorAll('#all .friend-item').forEach(item => {
        const name = item.querySelector('.friend-name').textContent.toLowerCase();
        item.style.display = name.includes(term) ? 'flex' : 'none';
      });
    });
  }

  // Модальное окно
  if (addFriendBtn) {
    addFriendBtn.onclick = () => modal.classList.add('show');
  }
  if (closeModal) {
    closeModal.onclick = () => modal.classList.remove('show');
  }
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('show');
  });

  // Отправка заявки
  if (sendRequestBtn && friendNickname) {
    sendRequestBtn.onclick = () => {
      const name = friendNickname.value.trim();
      if (name) {
        window.friendsManager.addRequest({
          id: Date.now().toString(),
          name: name,
          message: 'Хочет добавить вас в друзья',
          avatar: name.charAt(0).toUpperCase()
        });
        updateFriendsDisplay();
        showNotification(`Заявка отправлена пользователю ${name}`, 'success');
        friendNickname.value = '';
        modal.classList.remove('show');
      } else {
        showNotification('Введите никнейм друга', 'error');
      }
    };
  }

  // При клике на другие кнопки сайдбара
  document.querySelectorAll('.sidebar-btn').forEach(btn => {
    if (btn.id !== 'btn-community' && !btn.querySelector('.dropdown-link')) {
      btn.addEventListener('click', () => {
        if (friendsPage) friendsPage.style.display = 'none';
      });
    }
  });
});