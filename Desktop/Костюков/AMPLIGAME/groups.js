// groups.js

document.addEventListener("DOMContentLoaded", function () {
  const btnGroups = document.getElementById("btn-groups");
  const groupsPage = document.querySelector(".groups-page");

  // Функция скрытия всех страниц
  function hideAllPages() {
    const pages = [
      ".store-content",
      ".cloud-page",
      ".library-page",
      ".settings-page",
      ".profile-page",
      ".friends-page",
      ".forums-page",
      ".events-page",
      ".supports-page",
      ".product-page",
      ".groups-page", // добавляем страницу групп
    ];

    pages.forEach((selector) => {
      const page = document.querySelector(selector);
      if (page) page.style.display = "none";
    });
  }

  // Показываем страницу групп
  if (btnGroups) {
    btnGroups.addEventListener("click", function (e) {
      e.preventDefault();

      hideAllPages();

      if (groupsPage) {
        groupsPage.style.display = "block";
      }

      // Управление активными классами в сайдбаре
      document.querySelectorAll(".sidebar-btn").forEach((btn) => {
        btn.classList.remove("active");
      });

      // Активируем Community и Groups
      const communityBtn = document.getElementById("btn-community");
      if (communityBtn) {
        communityBtn.classList.add("active");
        const dropdownMenu = communityBtn.querySelector(".dropdown-menu");
        if (dropdownMenu) {
          dropdownMenu.classList.add("active");
        }
      }

      // Активируем пункт Groups в меню
      const groupsMenuItem = document
        .getElementById("btn-groups")
        .closest("li");
      if (groupsMenuItem) {
        groupsMenuItem.classList.add("active");
      }
    });
  }

  // Переключение вкладок внутри страницы групп
  const tabBtns = document.querySelectorAll(".groups-tab-btn");
  const tabContents = document.querySelectorAll(".groups-tab-content");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Убираем активный класс у всех кнопок
      tabBtns.forEach((b) => b.classList.remove("active"));

      // Добавляем активный класс текущей кнопке
      this.classList.add("active");

      // Получаем id вкладки
      const tabId = this.getAttribute("data-tab");

      // Скрываем все содержимое вкладок
      tabContents.forEach((content) => content.classList.remove("active"));

      // Показываем нужную вкладку
      const activeTab = document.getElementById(tabId);
      if (activeTab) {
        activeTab.classList.add("active");
      }
    });
  });

  // Обработка кнопок "Вступить" / "Открыть"
  document
    .querySelectorAll(".group-btn.primary, .join-btn, .recommended-join-btn")
    .forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();

        // Находим название группы
        let groupName = "";
        const groupCard = this.closest(".group-card, .recommended-card");

        if (groupCard) {
          if (groupCard.classList.contains("group-card")) {
            groupName = groupCard.querySelector("h3").textContent;
          } else {
            groupName = groupCard.querySelector("h3").textContent;
          }
        }

        // Меняем текст кнопки в зависимости от действия
        if (
          this.classList.contains("join-btn") ||
          this.textContent.includes("Вступить")
        ) {
          this.textContent = "✓ Вы вступили";
          this.style.background = "#27ae60";
          this.style.borderColor = "#27ae60";

          showNotification(`Вы вступили в группу "${groupName}"`, "success");
        } else if (this.textContent.includes("Открыть")) {
          showNotification(`Открываем группу "${groupName}"`, "info");
        }
      });
    });

  // Обработка кнопки "Создать группу"
  const createBtn = document.querySelector(".create-group-btn");
  if (createBtn) {
    createBtn.addEventListener("click", function () {
      showNotification("Функция создания группы будет доступна позже", "info");
    });
  }

  // Обработка кнопок "Поделиться"
  document.querySelectorAll(".group-btn.secondary").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();

      const groupCard = this.closest(".group-card");
      const groupName = groupCard
        ? groupCard.querySelector("h3").textContent
        : "группой";

      showNotification(
        `Ссылка на группу "${groupName}" скопирована`,
        "success"
      );
    });
  });

  // Обработка быстрого вступления (иконка + на recommended карточках)
  document.querySelectorAll(".recommended-quick-join").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();

      const recommendedCard = this.closest(".recommended-card");
      const groupName = recommendedCard.querySelector("h3").textContent;

      showNotification(`Вы вступили в группу "${groupName}"`, "success");

      // Меняем кнопку вступления
      const joinBtn = recommendedCard.querySelector(".recommended-join-btn");
      if (joinBtn) {
        joinBtn.textContent = "✓ Вы вступили";
        joinBtn.style.background = "#27ae60";
        joinBtn.style.borderColor = "#27ae60";
        joinBtn.style.color = "white";
      }
    });
  });

  // При клике на другие кнопки сайдбара скрываем страницу групп
  document.querySelectorAll(".sidebar-btn").forEach((btn) => {
    if (btn.id !== "btn-community" && !btn.querySelector(".dropdown-link")) {
      btn.addEventListener("click", function () {
        if (groupsPage) {
          groupsPage.style.display = "none";
        }
      });
    }
  });

  // При клике на подпункты меню (кроме Groups) скрываем страницу групп
  document.querySelectorAll(".dropdown-link").forEach((link) => {
    if (link.id !== "btn-groups") {
      link.addEventListener("click", function () {
        if (groupsPage) {
          groupsPage.style.display = "none";
        }
      });
    }
  });
});

// Функция уведомлений (если еще не определена)
if (typeof window.showNotification !== "function") {
  window.showNotification = function (message, type = "success") {
    // Проверяем, есть ли уже уведомление
    const oldNotification = document.querySelector(".group-notification");
    if (oldNotification) oldNotification.remove();

    const notification = document.createElement("div");
    notification.className = "group-notification";
    notification.textContent = message;

    const colors = {
      success: "#27ae60",
      error: "#e74c3c",
      info: "#3498db",
      warning: "#f39c12",
    };

    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 30px;
      background: ${colors[type] || colors.success};
      color: white;
      padding: 15px 25px;
      border-radius: 10px;
      z-index: 10000;
      font-weight: 600;
      animation: slideInGroup 0.3s ease;
      box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    `;

    // Добавляем анимацию, если её нет
    if (!document.querySelector("#group-notification-styles")) {
      const style = document.createElement("style");
      style.id = "group-notification-styles";
      style.textContent = `
        @keyframes slideInGroup {
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
    }

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  };
}
