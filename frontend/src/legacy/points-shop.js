// points-shop.js — Очки и магазин оформления

(function() {
  'use strict';

  var POINTS_KEY = 'user_points';
  var OWNED_KEY = 'user_cosmetics';
  var EQUIPPED_KEY = 'user_equipped_cosmetics';

  var COSMETICS = {
    frames: [
      { id: 'frame_default', name: 'По умолчанию', price: 0, css: '' },
      { id: 'frame_purple', name: 'Фиолетовое кольцо', price: 50, css: 'frame-purple' },
      { id: 'frame_gold', name: 'Золотое кольцо', price: 100, css: 'frame-gold' },
      { id: 'frame_rainbow', name: 'Радужное', price: 200, css: 'frame-rainbow' },
      { id: 'frame_fire', name: 'Огненное', price: 300, css: 'frame-fire' },
      { id: 'frame_neon', name: 'Неоновое', price: 250, css: 'frame-neon' }
    ],
    backgrounds: [
      { id: 'bg_default', name: 'Стандартный', price: 0, css: '' },
      { id: 'bg_aurora', name: 'Северное сияние', price: 150, css: 'custom-bg-aurora' },
      { id: 'bg_nebula', name: 'Туманность', price: 250, css: 'custom-bg-nebula' },
      { id: 'bg_matrix', name: 'Матрица', price: 200, css: 'custom-bg-matrix' }
    ],
    inventory: [
      { id: 'inv_default', name: 'Стандарт', price: 0, css: '' },
      { id: 'inv_gradient', name: 'Градиент', price: 100, css: 'inv-gradient' },
      { id: 'inv_neon', name: 'Неон', price: 150, css: 'inv-neon' },
      { id: 'inv_gold', name: 'Золото', price: 200, css: 'inv-gold' }
    ]
  };

  function getPoints() { return parseInt(localStorage.getItem(POINTS_KEY) || '0'); }
  function setPoints(n) { localStorage.setItem(POINTS_KEY, String(n)); updatePointsUI(); }
  function addPoints(n) { setPoints(getPoints() + n); }
  function getOwned() { try { return JSON.parse(localStorage.getItem(OWNED_KEY) || '[]'); } catch(e) { return []; } }
  function saveOwned(a) { localStorage.setItem(OWNED_KEY, JSON.stringify(a)); }
  function getEquipped() { try { return JSON.parse(localStorage.getItem(EQUIPPED_KEY) || '{}'); } catch(e) { return {}; } }
  function saveEquipped(o) { localStorage.setItem(EQUIPPED_KEY, JSON.stringify(o)); applyCosmetics(); }

  function buyCosmetic(item) {
    var owned = getOwned();
    if (owned.indexOf(item.id) !== -1) return { success: false, error: 'Уже куплено' };
    var pts = getPoints();
    if (pts < item.price) return { success: false, error: 'Недостаточно очков (нужно ' + item.price + ')' };
    setPoints(pts - item.price);
    owned.push(item.id);
    saveOwned(owned);
    return { success: true };
  }

  function equipCosmetic(item, type) {
    var eq = getEquipped();
    eq[type] = item.id;
    saveEquipped(eq);
  }

  function applyCosmetics() {
    var eq = getEquipped();

    var frameId = eq.frames || 'frame_default';
    var frame = COSMETICS.frames.find(function(f) { return f.id === frameId; });
    var allFrames = ['frame-purple','frame-gold','frame-rainbow','frame-fire','frame-neon'];
    ['.avatar-circle', '.profile-avatar'].forEach(function(sel) {
      var el = document.querySelector(sel);
      if (!el) return;
      allFrames.forEach(function(c) { el.classList.remove(c); });
      if (frame && frame.css) el.classList.add(frame.css);
    });

    var invId = eq.inventory || 'inv_default';
    var inv = COSMETICS.inventory.find(function(i) { return i.id === invId; });
    if (typeof applyInventoryCosmetics === "function") applyInventoryCosmetics();

    var bgId = eq.backgrounds || 'bg_default';
    var bg = COSMETICS.backgrounds.find(function(b) { return b.id === bgId; });
    ['custom-bg-aurora','custom-bg-nebula','custom-bg-matrix'].forEach(function(c) { document.body.classList.remove(c); });
    if (bg && bg.css) document.body.classList.add(bg.css);
  }

  function updatePointsUI() {
    var v = document.getElementById('pointsValue');
    if (v) v.textContent = getPoints();
    var sv = document.getElementById('shopPointsDisplay');
    if (sv) sv.textContent = getPoints();
  }
  window.updatePointsUI = updatePointsUI;

  function addPointsCard() {
    var container = document.querySelector('.profile-left');
    if (!container) return;
    var existing = document.getElementById('pointsCard');
    if (existing) { updatePointsUI(); return; }
    var card = document.createElement('div');
    card.id = 'pointsCard';
    card.className = 'profile-points-card';
    card.innerHTML = ''
      + '<div class="points-card-icon">'
      + '  <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/></svg>'
      + '</div>'
      + '<div class="points-card-info">'
      + '  <span class="points-card-label">Очки оформления</span>'
      + '  <span class="points-card-value" id="pointsValue">0</span>'
      + '</div>'
      + '<button class="points-card-btn" id="openShopFromCard">Магазин</button>';
    var statsBar = container.querySelector('.profile-stats-bar');
    if (statsBar) statsBar.parentNode.insertBefore(card, statsBar.nextSibling);
    else container.appendChild(card);
    card.querySelector('#openShopFromCard').addEventListener('click', openShop);
    updatePointsUI();
  }

  function createShopModal() {
    if (document.getElementById('pointsShopModal')) return;
    var m = document.createElement('div');
    m.id = 'pointsShopModal';
    m.className = 'points-shop-modal';
    m.innerHTML = ''
      + '<div class="points-shop-content">'
      + '  <div class="points-shop-header">'
      + '    <div>'
      + '      <h2 class="points-shop-title">Магазин оформления</h2>'
      + '      <p class="points-shop-subtitle">Зарабатывайте очки за покупки игр (50 очков за игру)</p>'
      + '    </div>'
      + '    <div class="points-shop-balance">'
      + '      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/></svg>'
      + '      <span id="shopPointsDisplay">0</span>'
      + '    </div>'
      + '    <button class="points-shop-close" aria-label="Закрыть">'
      + '      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'
      + '    </button>'
      + '  </div>'
      + '  <div class="points-shop-tabs">'
      + '    <button class="points-tab-btn active" data-tab="frames">Рамки аватара</button>'
      + '    <button class="points-tab-btn" data-tab="backgrounds">Фоны</button>'
      + '    <button class="points-tab-btn" data-tab="inventory">Инвентарь</button>'
      + '  </div>'
      + '  <div class="points-shop-grid" id="pointsShopGrid"></div>'
      + '</div>';
    document.body.appendChild(m);
    m.querySelector('.points-shop-close').addEventListener('click', closeShop);
    m.addEventListener('click', function(e) { if (e.target === m) closeShop(); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && m.classList.contains('show')) closeShop(); });
    m.querySelectorAll('.points-tab-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        m.querySelectorAll('.points-tab-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        renderTab(btn.getAttribute('data-tab'));
      });
    });
  }

  function openShop() {
    createShopModal();
    var m = document.getElementById('pointsShopModal');
    renderTab('frames');
    updatePointsUI();
    m.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeShop() {
    var m = document.getElementById('pointsShopModal');
    if (m) m.classList.remove('show');
    document.body.style.overflow = '';
  }

  function renderTab(tab) {
    var grid = document.getElementById('pointsShopGrid');
    if (!grid) return;
    var items = COSMETICS[tab] || [];
    var owned = getOwned();
    var eq = getEquipped();
    var current = eq[tab] || (tab === 'frames' ? 'frame_default' : tab === 'backgrounds' ? 'bg_default' : 'inv_default');

    grid.innerHTML = items.map(function(item) {
      var isDefault = item.id === 'frame_default' || item.id === 'bg_default' || item.id === 'inv_default';
      var isOwned = isDefault || owned.indexOf(item.id) !== -1;
      var isEquipped = current === item.id;
      var btnText = isEquipped ? 'Активно' : (isOwned ? 'Применить' : item.price + ' очков');
      var btnClass = isEquipped ? 'equipped' : (isOwned ? 'owned' : 'buy');
      return '<div class="cosmetic-card">'
        + '<div class="cosmetic-preview ' + (item.css ? item.css + '-preview' : 'default-preview') + '">'
        + (item.css === 'frame-rainbow' || item.css === 'frame-fire' || item.css === 'frame-neon' || item.css === 'frame-gold' || item.css === 'frame-purple' ? '<div class="preview-avatar ' + item.css + '"></div>' : '')
        + (item.css.indexOf && item.css.indexOf('bg-') === 0 ? '<div class="preview-bg ' + item.css + '"></div>' : '')
        + (item.css.indexOf && item.css.indexOf('inv-') === 0 ? '<div class="preview-inv ' + item.css + '"></div>' : '')
        + '</div>'
        + '<div class="cosmetic-name">' + item.name + '</div>'
        + '<button class="cosmetic-btn ' + btnClass + '" data-id="' + item.id + '" data-type="' + tab + '" ' + (isEquipped ? 'disabled' : '') + '>' + btnText + '</button>'
        + '</div>';
    }).join('');

    grid.querySelectorAll('.cosmetic-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var id = btn.getAttribute('data-id');
        var type = btn.getAttribute('data-type');
        var item = items.find(function(i) { return i.id === id; });
        if (!item) return;
        if (btn.classList.contains('buy')) {
          var r = buyCosmetic(item);
          if (r.success) {
            if (typeof showNotification === 'function') showNotification('Куплено: ' + item.name, 'success');
            equipCosmetic(item, type);
            renderTab(type);
            updatePointsUI();
          } else if (typeof showNotification === 'function') showNotification(r.error, 'error');
        } else if (btn.classList.contains('owned')) {
          equipCosmetic(item, type);
          if (typeof showNotification === 'function') showNotification('Применено: ' + item.name, 'success');
          renderTab(type);
        }
      });
    });
  }

  window.addUserPoints = addPoints;
  window.getUserPoints = getPoints;
  window.openPointsShop = openShop;
  window.applyCosmetics = applyCosmetics;

  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      applyCosmetics();
      if (typeof window.loadProfileData !== 'undefined') {
        var orig = window.loadProfileData;
        window.loadProfileData = function() {
          orig();
          setTimeout(function() { addPointsCard(); applyCosmetics(); }, 50);
        };
      }
    }, 600);
  });
  function applyInventoryCosmetics() {
    var invGrid = document.querySelector(".inventory-grid");
    if (!invGrid) return;
    var eq = getEquipped();
    var invId = eq.inventory || "inv_default";
    var inv = COSMETICS.inventory.find(function(i) { return i.id === invId; });
    ["inv-gradient","inv-neon","inv-gold"].forEach(function(c) { invGrid.classList.remove(c); });
    if (inv && inv.css) invGrid.classList.add(inv.css);
  }
  window.applyInventoryCosmetics = applyInventoryCosmetics;

  if (typeof MutationObserver !== "undefined") {
    var observer = new MutationObserver(function() {
      var invGrid = document.querySelector(".inventory-grid");
      if (invGrid && !invGrid.dataset.cosmeticCheck) {
        invGrid.dataset.cosmeticCheck = "1";
        applyInventoryCosmetics();
      } else if (invGrid) {
        applyInventoryCosmetics();
      }
    });
    document.addEventListener("DOMContentLoaded", function() {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
})();
