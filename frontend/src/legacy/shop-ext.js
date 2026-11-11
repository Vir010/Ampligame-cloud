// shop-ext.js — Колесо фортуны, скидки, wishlist

(function() {
  'use strict';

  // ===== СКИДКИ =====
  var DISCOUNTED_GAMES = {
    'the-witcher-3': 50,
    'cyberpunk-2077': 30,
    'gta-v': 40,
    'elden-ring': 25,
    'hollow-knight': 50,
    'terraria': 70,
    'it-takes-two': 35,
    'dying-light': 60
  };
  window.DISCOUNTED_GAMES = DISCOUNTED_GAMES;

  var WISHLIST_KEY = 'user_wishlist';
  var WHEEL_KEY = 'last_wheel_spin';

  function uid() { return 'id_' + Date.now() + Math.random().toString(36).slice(2,6); }
  function getWishlist() {
    try { return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]'); } catch(e) { return []; }
  }
  function saveWishlist(arr) { localStorage.setItem(WISHLIST_KEY, JSON.stringify(arr)); }
  function toggleWishlist(gameId) {
    var list = getWishlist();
    var idx = list.indexOf(gameId);
    if (idx >= 0) list.splice(idx, 1);
    else list.push(gameId);
    saveWishlist(list);
    return list.indexOf(gameId) >= 0;
  }
  function createGameId(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }

  // ===== ДОБАВЛЯЕМ ЭЛЕМЕНТЫ В САЙДБАР =====
  function addSidebarItems() {
    var sidebar = document.querySelector('.sidebar ul');
    if (!sidebar || document.getElementById('btn-sale')) return;
    var bottomBtn = document.querySelector('.sidebar-btn.bottom');

    var saleLi = document.createElement('li');
    saleLi.className = 'sidebar-btn';
    saleLi.id = 'btn-sale';
    saleLi.innerHTML = '<a href="#">'
      + '<svg class="icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/></svg>'
      + 'Sale</a>';

    var wishLi = document.createElement('li');
    wishLi.className = 'sidebar-btn';
    wishLi.id = 'btn-wishlist';
    wishLi.innerHTML = '<a href="#">'
      + '<svg class="icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>'
      + 'Wishlist <span class="wishlist-count" id="wishlistCount"></span></a>';

    if (bottomBtn) {
      sidebar.insertBefore(wishLi, bottomBtn);
      sidebar.insertBefore(saleLi, bottomBtn);
    } else {
      sidebar.appendChild(wishLi);
      sidebar.appendChild(saleLi);
    }

    updateWishlistCount();

    saleLi.addEventListener('click', function(e) {
      e.preventDefault();
      if (window.Router) window.Router.showPage('sale');
      else showPageManual('sale');
    });
    wishLi.addEventListener('click', function(e) {
      e.preventDefault();
      if (window.Router) window.Router.showPage('wishlist');
      else showPageManual('wishlist');
    });
  }

  function showPageManual(name) {
    document.querySelectorAll('.store-content, .profile-page, .library-page, .sales-page, .wishlist-page').forEach(function(el) {
      if (el) el.style.display = 'none';
    });
    var page = document.querySelector('.' + name + '-page');
    if (page) page.style.display = 'block';
  }

  function updateWishlistCount() {
    var el = document.getElementById('wishlistCount');
    if (el) {
      var count = getWishlist().length;
      el.textContent = count > 0 ? count : '';
      el.style.display = count > 0 ? '' : 'none';
    }
  }

  // ===== HEART-КНОПКИ НА КАРТОЧКАХ =====
  function addWishlistButtons() {
    document.querySelectorAll('.game-card').forEach(function(card) {
      if (card.querySelector('.wish-btn')) return;
      var titleEl = card.querySelector('h4');
      if (!titleEl) return;
      var gameId = createGameId(titleEl.textContent);
      var inWish = getWishlist().indexOf(gameId) >= 0;

      var btn = document.createElement('button');
      btn.className = 'wish-btn' + (inWish ? ' active' : '');
      btn.type = 'button';
      btn.title = inWish ? 'Убрать из желаемого' : 'Добавить в желаемое';
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';

      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var active = toggleWishlist(gameId);
        btn.classList.toggle('active', active);
        btn.title = active ? 'Убрать из желаемого' : 'Добавить в желаемое';
        updateWishlistCount();
        if (typeof showNotification === 'function') {
          showNotification(active ? 'Добавлено в желаемое' : 'Удалено из желаемого', 'success');
        }
        if (document.querySelector('.wishlist-page')) renderWishlistPage();
      });

      card.style.position = 'relative';
      card.appendChild(btn);
    });
  }

  // ===== ПРИМЕНЕНИЕ СКИДОК К КАРТОЧКАМ МАГАЗИНА =====
  function applyDiscounts() {
    document.querySelectorAll('.game-card').forEach(function(card) {
      if (card.dataset.discountApplied) return;
      var titleEl = card.querySelector('h4');
      var priceEl = card.querySelector('.price');
      if (!titleEl || !priceEl) return;

      var gameId = createGameId(titleEl.textContent);
      var discount = DISCOUNTED_GAMES[gameId];
      if (!discount) return;

      card.dataset.discountApplied = '1';

      var oldText = priceEl.textContent;
      var oldNum = parseInt(oldText.replace(/[^\d]/g, ''));
      var newNum = Math.round(oldNum * (100 - discount) / 100);

      priceEl.innerHTML = '<span class="old-price">' + oldText + '</span> <span class="new-price">' + newNum + ' ₽</span>';

      var badge = document.createElement('span');
      badge.className = 'discount-badge';
      badge.textContent = '-' + discount + '%';
      card.appendChild(badge);
    });
  }

  // ===== ПАТЧ createProductPage =====
  function patchProductPage() {
    if (!window.createProductPage || window.createProductPage.__patched) return;
    var original = window.createProductPage;
    var wrapped = function(product, gameId) {
      var page = original(product, gameId);
      var discount = DISCOUNTED_GAMES[gameId];
      if (discount && page) {
        var priceEl = page.querySelector('.product-price');
        if (priceEl) {
          var oldNum = parseInt(product.price.replace(/[^\d]/g, ''));
          var newNum = Math.round(oldNum * (100 - discount) / 100);
          priceEl.innerHTML = '<span class="old-price">' + product.price + '</span> <span class="new-price">' + newNum + ' ₽</span> <span class="discount-badge-inline">-' + discount + '%</span>';
          priceEl.dataset.price = newNum;
        }
      }
      return page;
    };
    wrapped.__patched = true;
    window.createProductPage = wrapped;
  }

  // ===== СТРАНИЦА СКИДОК =====
  function createSalesPage() {
    if (document.querySelector('.sales-page')) return;
    var content = document.querySelector('.content');
    if (!content) return;

    var page = document.createElement('div');
    page.className = 'sales-page';
    page.style.display = 'none';
    page.innerHTML = ''
      + '<div class="sales-header">'
      + '  <h1 class="sales-title">Скидки</h1>'
      + '  <p class="sales-subtitle">Успейте купить со скидкой</p>'
      + '  <div class="sales-timer" id="salesTimer">'
      + '    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>'
      + '    <span id="salesTimerText">До конца акции...</span>'
      + '  </div>'
      + '</div>'
      + '<div class="games-grid" id="salesGrid"></div>';
    content.appendChild(page);

    if (window.Router) {
      window.Router.pages.sale = { selector: '.sales-page', btnId: 'btn-sale' };
    }
  }

  function renderSalesPage() {
    var grid = document.getElementById('salesGrid');
    if (!grid) return;

    if (typeof products === 'undefined') {
      grid.innerHTML = '<p style="color:#888;padding:20px;">Товары загружаются...</p>';
      return;
    }

    var html = '';
    Object.keys(DISCOUNTED_GAMES).forEach(function(gameId) {
      var product = products[gameId];
      if (!product) return;
      var discount = DISCOUNTED_GAMES[gameId];
      var oldNum = parseInt(product.price.replace(/[^\d]/g, ''));
      var newNum = Math.round(oldNum * (100 - discount) / 100);

      html += '<div class="game-card" data-game-id="' + gameId + '">'
        + '<img src="' + product.image + '" alt="' + product.title + '">'
        + '<h4>' + product.title + '</h4>'
        + '<span class="price"><span class="old-price">' + product.price + '</span> <span class="new-price">' + newNum + ' ₽</span></span>'
        + '<button class="sellgame2">Купить</button>'
        + '<span class="discount-badge">-' + discount + '%</span>'
        + '</div>';
    });
    grid.innerHTML = html;

    // Обновляем buy handlers для новых карточек
    grid.querySelectorAll('.game-card').forEach(function(card) {
      var buyBtn = card.querySelector('.sellgame2');
      if (!buyBtn) return;
      var titleEl = card.querySelector('h4');
      var gameId = card.getAttribute('data-game-id') || createGameId(titleEl.textContent);

      buyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (window.authManager && !window.authManager.isLoggedIn()) {
          if (typeof window.openAuthModal === 'function') window.openAuthModal('login');
          return;
        }
        var productData = products[gameId];
        if (!productData) return;
        if (typeof window.createProductPage === 'function') {
          var page = window.createProductPage(productData, gameId);
          if (window.Router) window.Router.showPage('product');
          else page.style.display = 'block';
        }
      });
    });

    addWishlistButtons();
    updateSalesTimer();
  }

  function updateSalesTimer() {
    var timerText = document.getElementById('salesTimerText');
    if (!timerText) return;

    var endDateStr = localStorage.getItem('sale_end_date');
    if (!endDateStr) {
      endDateStr = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      localStorage.setItem('sale_end_date', endDateStr);
    }

    var end = new Date(endDateStr);
    var now = new Date();
    var diff = end - now;

    if (diff <= 0) {
      timerText.textContent = 'Акция завершена';
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var secs = Math.floor((diff % (1000 * 60)) / 1000);

    timerText.textContent = 'До конца: ' + days + 'д ' + hours + 'ч ' + mins + 'м ' + secs + 'с';
  }

  // ===== СТРАНИЦА WISHLIST =====
  function createWishlistPage() {
    if (document.querySelector('.wishlist-page')) return;
    var content = document.querySelector('.content');
    if (!content) return;
    var page = document.createElement('div');
    page.className = 'wishlist-page';
    page.style.display = 'none';
    page.innerHTML = ''
      + '<div class="wishlist-header">'
      + '  <h1 class="wishlist-title">Список желаемого</h1>'
      + '  <p class="wishlist-subtitle">Игры, которые вы хотите купить</p>'
      + '</div>'
      + '<div class="games-grid" id="wishlistGrid"></div>';
    content.appendChild(page);

    if (window.Router) {
      window.Router.pages.wishlist = { selector: '.wishlist-page', btnId: 'btn-wishlist' };
    }
  }

  function renderWishlistPage() {
    var grid = document.getElementById('wishlistGrid');
    if (!grid) return;

    var wishlist = getWishlist();
    if (wishlist.length === 0) {
      grid.innerHTML = '<div class="empty-state-profile" style="grid-column:1/-1;">'
        + '<svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor" opacity="0.3"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>'
        + '<p>Список желаемого пуст. Нажмите на сердечко у игры в магазине.</p>'
        + '<button type="button" class="profile-goto-store">Перейти в магазин</button>'
        + '</div>';
      var btn = grid.querySelector('.profile-goto-store');
      if (btn && window.Router) btn.addEventListener('click', function() { window.Router.showPage('store'); });
      return;
    }

    var html = '';
    wishlist.forEach(function(gameId) {
      var product = (typeof products !== 'undefined') ? products[gameId] : null;
      if (!product) return;
      var discount = DISCOUNTED_GAMES[gameId];
      var oldNum = parseInt(product.price.replace(/[^\d]/g, ''));
      var newNum = discount ? Math.round(oldNum * (100 - discount) / 100) : oldNum;
      var priceHtml = discount
        ? '<span class="old-price">' + product.price + '</span> <span class="new-price">' + newNum + ' ₽</span>'
        : product.price;

      html += '<div class="game-card" data-game-id="' + gameId + '">'
        + '<img src="' + product.image + '" alt="' + product.title + '">'
        + '<h4>' + product.title + '</h4>'
        + '<span class="price">' + priceHtml + '</span>'
        + '<button class="sellgame2">Купить</button>'
        + (discount ? '<span class="discount-badge">-' + discount + '%</span>' : '')
        + '</div>';
    });
    grid.innerHTML = html;

    grid.querySelectorAll('.game-card').forEach(function(card) {
      var buyBtn = card.querySelector('.sellgame2');
      var titleEl = card.querySelector('h4');
      var gameId = card.getAttribute('data-game-id') || createGameId(titleEl.textContent);
      buyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (window.authManager && !window.authManager.isLoggedIn()) {
          if (typeof window.openAuthModal === 'function') window.openAuthModal('login');
          return;
        }
        var productData = products[gameId];
        if (!productData) return;
        if (typeof window.createProductPage === 'function') {
          var page = window.createProductPage(productData, gameId);
          if (window.Router) window.Router.showPage('product');
          else page.style.display = 'block';
        }
      });
    });

    addWishlistButtons();
  }

  // ===== УВЕДОМЛЕНИЕ О СКИДКАХ В WISHLIST =====
  function checkWishlistDiscounts() {
    var wishlist = getWishlist();
    var discounted = wishlist.filter(function(id) { return DISCOUNTED_GAMES[id]; });
    if (discounted.length > 0 && window.authManager && window.authManager.isLoggedIn()) {
      setTimeout(function() {
        if (typeof showNotification === 'function') {
          showNotification('Игры из вишлиста со скидкой: ' + discounted.length + ' — загляните!', 'info');
        }
      }, 3500);
    }
  }

  // ===== ИНИЦИАЛИЗАЦИЯ =====
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      addSidebarItems();
      createSalesPage();
      createWishlistPage();
      applyDiscounts();
      addWishlistButtons();
      patchProductPage();
      checkWishlistDiscounts();

      // Обновление таймера каждую секунду
      setInterval(function() {
        updateSalesTimer();
      }, 1000);

      // При открытии Sale-страницы — рендерим
      var origShowPage = window.Router && window.Router.showPage;
      if (window.Router && !window.Router.__patched) {
        window.Router.__patched = true;
        var originalShow = window.Router.showPage.bind(window.Router);
        window.Router.showPage = function(name) {
          originalShow(name);
          if (name === 'sale') renderSalesPage();
          if (name === 'wishlist') renderWishlistPage();
        };
      }
    }, 400);
  });
  window.renderWishlistInto = function(container) {
    if (!container) return;
    var wishlist = getWishlist();
    if (wishlist.length === 0) {
      container.innerHTML = '<div class="cards-empty">'
        + '<svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor" opacity="0.3"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>'
        + '<p>Список желаемого пуст. Нажмите на сердечко у игры в магазине.</p>'
        + '<button class="profile-goto-store">Перейти в магазин</button></div>';
      var gb = container.querySelector(".profile-goto-store");
      if (gb && window.Router) gb.addEventListener("click", function() { window.Router.showPage("store"); });
      return;
    }
    var html = '<h2 class="library-title">Список желаемого</h2><div class="games-grid">';
    wishlist.forEach(function(gameId) {
      var product = (typeof products !== "undefined") ? products[gameId] : null;
      if (!product) return;
      var discount = DISCOUNTED_GAMES[gameId];
      var oldNum = parseInt(product.price.replace(/[^\d]/g, ""));
      var newNum = discount ? Math.round(oldNum * (100 - discount) / 100) : oldNum;
      var priceHtml = discount ? '<span class="old-price">' + product.price + '</span> <span class="new-price">' + newNum + ' ₽</span>' : product.price;
      html += '<div class="game-card" data-game-id="' + gameId + '">'
        + '<img src="' + product.image + '" alt="' + product.title + '">'
        + '<h4>' + product.title + '</h4>'
        + '<span class="price">' + priceHtml + '</span>'
        + '<button class="sellgame2">Купить</button>'
        + (discount ? '<span class="discount-badge">-' + discount + '%</span>' : "")
        + '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
    container.querySelectorAll(".game-card").forEach(function(card) {
      var buyBtn = card.querySelector(".sellgame2");
      var titleEl = card.querySelector("h4");
      if (!buyBtn || !titleEl) return;
      var gameId = card.getAttribute("data-game-id") || createGameId(titleEl.textContent);
      buyBtn.addEventListener("click", function(e) {
        e.preventDefault();
        if (window.authManager && !window.authManager.isLoggedIn()) {
          if (typeof window.openAuthModal === "function") window.openAuthModal("login");
          return;
        }
        var pd = (typeof products !== "undefined") ? products[gameId] : null;
        if (!pd) return;
        if (typeof window.createProductPage === "function") {
          var p = window.createProductPage(pd, gameId);
          if (window.Router) window.Router.showPage("product");
          else p.style.display = "block";
        }
      });
    });
    if (typeof addWishlistButtons === "function") addWishlistButtons();
  };
})();
