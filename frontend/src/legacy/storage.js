// storage.js — изоляция данных по пользователю
(function() {
  const _get = Storage.prototype.getItem;
  const _set = Storage.prototype.setItem;
  const _remove = Storage.prototype.removeItem;
  const _key = Storage.prototype.key;

  const GLOBAL_KEYS = ['ampligame_current_user', 'ampligame_users', 'app_theme', 'app_language'];
  const PER_USER_KEYS = [
    'user_nickname', 'user_avatar', 'user_display_name', 'user_balance',
    'user_game_library', 'user_achievements', 'user_friends',
    'friend_requests', 'blocked_users'
  ];
  const PER_USER_PREFIXES = ['game_installed_'];

  function rawGet(k) { return _get.call(localStorage, k); }
  function rawSet(k, v) { return _set.call(localStorage, k, v); }
  function rawRemove(k) { return _remove.call(localStorage, k); }
  function rawKeys() {
    var arr = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = _key.call(localStorage, i);
      if (k) arr.push(k);
    }
    return arr;
  }

  function getUserId() {
    try {
      var raw = rawGet('ampligame_current_user');
      return raw ? JSON.parse(raw).id : null;
    } catch (e) { return null; }
  }

  function isPerUserKey(key) {
    if (PER_USER_KEYS.indexOf(key) !== -1) return true;
    for (var i = 0; i < PER_USER_PREFIXES.length; i++) {
      if (key.indexOf(PER_USER_PREFIXES[i]) === 0) return true;
    }
    return false;
  }

  function resolveKey(key) {
    if (typeof key !== 'string') return key;
    if (key.indexOf('__') === 0) return key;
    if (GLOBAL_KEYS.indexOf(key) !== -1) return key;
    var userId = getUserId();
    if (!userId) return key;
    return isPerUserKey(key) ? key + '__' + userId : key;
  }

  Storage.prototype.getItem = function(key) {
    if (this === window.localStorage) return _get.call(this, resolveKey(key));
    return _get.call(this, key);
  };
  Storage.prototype.setItem = function(key, value) {
    if (this === window.localStorage) return _set.call(this, resolveKey(key), value);
    return _set.call(this, key, value);
  };
  Storage.prototype.removeItem = function(key) {
    if (this === window.localStorage) return _remove.call(this, resolveKey(key));
    return _remove.call(this, key);
  };

  window.rawStorage = {
    get: rawGet, set: rawSet, remove: rawRemove, allKeys: rawKeys,
    perUserKeys: PER_USER_KEYS, perUserPrefixes: PER_USER_PREFIXES,
    globalKeys: GLOBAL_KEYS, userId: getUserId
  };

  function clearLegacy() {
    PER_USER_KEYS.forEach(function(k) { rawRemove(k); });
    PER_USER_PREFIXES.forEach(function(p) {
      rawKeys().forEach(function(k) {
        if (k.indexOf(p) === 0 && k.indexOf('__') === -1) rawRemove(k);
      });
    });
  }

  function migrate() {
    var userId = getUserId();
    if (!userId) return;
    if (rawGet('__migrated_' + userId) === '1') return;

    var migrated = false;
    PER_USER_KEYS.forEach(function(key) {
      var lv = rawGet(key);
      if (lv !== null && rawGet(key + '__' + userId) === null) {
        rawSet(key + '__' + userId, lv);
        migrated = true;
      }
    });
    PER_USER_PREFIXES.forEach(function(prefix) {
      rawKeys().forEach(function(k) {
        if (k.indexOf(prefix) === 0 && k.indexOf('__') === -1) {
          if (rawGet(k) !== null) {
            rawSet(k + '__' + userId, rawGet(k));
            migrated = true;
          }
        }
      });
    });

    if (migrated) {
      clearLegacy();
      console.log('[storage] Migrated legacy data to user', userId);
    }
    rawSet('__migrated_' + userId, '1');
  }

  window.rawStorage.clearLegacy = clearLegacy;
  migrate();
})();
