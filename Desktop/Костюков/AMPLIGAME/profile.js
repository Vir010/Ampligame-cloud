// profile.js

document.addEventListener("DOMContentLoaded", function () {
  const profileBtn = document.getElementById("btn-profile");
  const avatarContainer = document.getElementById("avatarContainer");
  const profilePage = document.querySelector(".profile-page");

  // Функция синхронизации аватарки с настройками
  function syncProfileAvatar() {
    const profileAvatar = document.querySelector(".profile-avatar img");
    const savedAvatar = localStorage.getItem("user_avatar");

    if (profileAvatar) {
      if (savedAvatar) {
        profileAvatar.src = savedAvatar;
      } else {
        profileAvatar.src = "./img/default-avatar.png";
      }
    }
  }

  // Загружаем сохраненный ник
  function loadNickname() {
    const savedNickname = localStorage.getItem("user_nickname");
    const nicknameElement = document.getElementById("profileNickname");
    if (savedNickname && nicknameElement) {
      nicknameElement.textContent = savedNickname;
    }
  }

  // Сохраняем ник
  function saveNickname(nickname) {
    localStorage.setItem("user_nickname", nickname);
    const nicknameElement = document.getElementById("profileNickname");
    if (nicknameElement) {
      nicknameElement.textContent = nickname;
    }
  }

  // Редактирование ника
  function setupNicknameEditing() {
    const editBtn = document.getElementById("editNicknameBtn");
    const nicknameElement = document.getElementById("profileNickname");

    if (editBtn && nicknameElement) {
      editBtn.addEventListener("click", function () {
        const currentNickname = nicknameElement.textContent;
        const input = document.createElement("input");
        input.type = "text";
        input.value = currentNickname;
        input.className = "nickname-input";

        const wrapper = nicknameElement.parentElement;
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "✓";
        saveBtn.className = "edit-nickname-btn";
        saveBtn.style.background = "#4CAF50";
        saveBtn.style.color = "white";

        nicknameElement.style.display = "none";
        editBtn.style.display = "none";
        wrapper.appendChild(input);
        wrapper.appendChild(saveBtn);
        input.focus();

        saveBtn.addEventListener("click", function () {
          const newNickname = input.value.trim();
          if (newNickname) {
            saveNickname(newNickname);
          }
          input.remove();
          saveBtn.remove();
          nicknameElement.style.display = "block";
          editBtn.style.display = "flex";
        });

        input.addEventListener("keypress", function (e) {
          if (e.key === "Enter") {
            const newNickname = input.value.trim();
            if (newNickname) {
              saveNickname(newNickname);
            }
            input.remove();
            saveBtn.remove();
            nicknameElement.style.display = "block";
            editBtn.style.display = "flex";
          }
        });

        input.addEventListener("keydown", function (e) {
          if (e.key === "Escape") {
            input.remove();
            saveBtn.remove();
            nicknameElement.style.display = "block";
            editBtn.style.display = "flex";
          }
        });
      });
    }
  }

  // Функция закрытия профиля (возврат в магазин)
  function closeProfile() {
    if (profilePage) {
      profilePage.style.display = "none";
    }
    // Показываем магазин
    const storeContent = document.querySelector(".store-content");
    if (storeContent) {
      storeContent.style.display = "block";
    }
    // Активируем кнопку Store
    const storeBtn = document.getElementById("btn-store");
    if (storeBtn) {
      document.querySelectorAll(".sidebar-btn").forEach((btn) => {
        btn.classList.remove("active");
      });
      storeBtn.classList.add("active");
    }
    // Закрываем дропдаун Community
    const communityBtn = document.getElementById("btn-community");
    const dropdownMenu = communityBtn?.querySelector(".dropdown-menu");
    if (dropdownMenu) {
      dropdownMenu.classList.remove("active");
      communityBtn.classList.remove("active");
    }
  }

  // Функция открытия профиля
  function openProfile() {
    // Скрываем все страницы
    if (typeof window.hideAllPages === "function") {
      window.hideAllPages();
    } else if (typeof hideAllPages === "function") {
      hideAllPages();
    }

    // Показываем страницу профиля
    if (profilePage) {
      profilePage.style.display = "block";
      // Синхронизируем аватарку при открытии
      syncProfileAvatar();
      // Загружаем ник
      loadNickname();
    }

    // Управление активными классами
    document.querySelectorAll(".sidebar-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    // Активируем кнопку Profile
    if (profileBtn) {
      profileBtn.classList.add("active");
    }

    // Открываем дропдаун Community
    const communityBtn = document.getElementById("btn-community");
    const dropdownMenu = communityBtn?.querySelector(".dropdown-menu");
    if (dropdownMenu) {
      dropdownMenu.classList.add("active");
      communityBtn.classList.add("active");
    }
  }

  // Обработчик для кнопки Profile в подменю
  if (profileBtn) {
    profileBtn.addEventListener("click", function (e) {
      e.preventDefault();
      openProfile();
    });
  }

  // Обработчик для аватарки
  if (avatarContainer) {
    avatarContainer.addEventListener("click", function () {
      openProfile();
    });
  }

  // Настраиваем редактирование ника
  setupNicknameEditing();

  // Слушаем изменения localStorage для обновления аватарки
  window.addEventListener("storage", function (e) {
    if (e.key === "user_avatar") {
      syncProfileAvatar();
    }
    if (e.key === "user_nickname") {
      loadNickname();
    }
  });
});

// Обработчик для подсветки активного пункта в дропдауне
document.addEventListener("DOMContentLoaded", () => {
  const dropdownLinks = document.querySelectorAll(".dropdown-link");
  const communityBtn = document.getElementById("btn-community");

  dropdownLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // убрать active у всех подпунктов
      document.querySelectorAll(".dropdown-menu li").forEach((li) => {
        li.classList.remove("active");
      });

      // поставить active на текущий li
      this.closest("li").classList.add("active");

      // оставить Community активным и открытым
      communityBtn.classList.add("active");
      communityBtn.querySelector(".dropdown-menu").classList.add("active");
    });
  });
});
