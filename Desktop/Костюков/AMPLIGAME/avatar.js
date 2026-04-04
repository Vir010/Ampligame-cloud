// avatar.js

document.addEventListener("DOMContentLoaded", function () {
  const avatarContainer = document.getElementById("avatarContainer");
  const avatarImg = document.getElementById("userAvatar");

  // Загружаем аватарку из localStorage, если есть
  loadAvatar();

  // Обработчик клика на аватарку
  if (avatarContainer) {
    avatarContainer.addEventListener("click", function () {
      // Переход в профиль
      openProfile();
    });
  }

  function openProfile() {
    // Скрываем все страницы
    if (typeof window.hideAllPages === "function") {
      window.hideAllPages();
    }

    // Показываем страницу профиля
    const profilePage = document.querySelector(".profile-page");
    if (profilePage) {
      profilePage.style.display = "block";
    }

    // Активируем кнопку Profile в меню
    const profileBtn = document.getElementById("btn-profile");
    if (profileBtn) {
      document.querySelectorAll(".sidebar-btn").forEach((btn) => {
        btn.classList.remove("active");
      });
      profileBtn.classList.add("active");

      // Открываем дропдаун Community
      const communityBtn = document.getElementById("btn-community");
      const dropdownMenu = communityBtn?.querySelector(".dropdown-menu");
      if (dropdownMenu) {
        dropdownMenu.classList.add("active");
        communityBtn.classList.add("active");
      }
    }
  }

  function loadAvatar() {
    const savedAvatar = localStorage.getItem("user_avatar");
    if (savedAvatar && avatarImg) {
      avatarImg.src = savedAvatar;
    }
  }

  window.changeAvatar = function (newAvatarSrc) {
    if (avatarImg) {
      avatarImg.src = newAvatarSrc;
      localStorage.setItem("user_avatar", newAvatarSrc);
    }
  };

  window.changeAvatarStatus = function (status) {
    const statusElement = document.querySelector(".avatar-status");
    if (statusElement) {
      statusElement.className = `avatar-status ${status}`;
    }
  };
});

// Функция скрытия всех страниц
if (typeof window.hideAllPages !== "function") {
  window.hideAllPages = function () {
    const pages = [
      ".store-content",
      ".cloud-page",
      ".library-page",
      ".settings-page",
      ".profile-page",
      ".friends-page",
      ".groups-page",
      ".forums-page",
      ".events-page",
      ".product-page",
      ".supports-page",
    ];

    pages.forEach((selector) => {
      const page = document.querySelector(selector);
      if (page) page.style.display = "none";
    });
  };
}