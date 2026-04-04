// supports.js

document.addEventListener("DOMContentLoaded", function () {
  const btnSupport = document.getElementById("btn-support");
  const supportsPage = document.querySelector(".supports-page");

  // Добавляем supports-page в глобальную функцию hideAllPages, если она существует
  if (window.hideAllPages) {
    const originalHideAllPages = window.hideAllPages;
    window.hideAllPages = function () {
      originalHideAllPages();
      if (supportsPage) supportsPage.style.display = "none";
    };
  }

  // Функция скрытия всех страниц (локальная)
  function hideAllPages() {
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
  }

  // Показываем страницу поддержки
  if (btnSupport) {
    btnSupport.addEventListener("click", function (e) {
      e.preventDefault();

      hideAllPages();

      if (supportsPage) {
        supportsPage.style.display = "block";
      }

      // Управление активными классами
      document.querySelectorAll(".sidebar-btn").forEach((btn) => {
        btn.classList.remove("active");
      });
      btnSupport.classList.add("active");

      // Закрываем дропдаун Community
      const communityMenu = document.querySelector(
        "#btn-community .dropdown-menu"
      );
      if (communityMenu) {
        communityMenu.classList.remove("active");
        document.getElementById("btn-community")?.classList.remove("active");
      }
    });
  }

  // Также добавляем обработчик на все кнопки сайдбара, чтобы скрывать supports
  document.querySelectorAll(".sidebar-btn").forEach((btn) => {
    if (btn.id !== "btn-support") {
      btn.addEventListener("click", function () {
        if (supportsPage) {
          supportsPage.style.display = "none";
        }
      });
    }
  });

  // Обработчик для подпунктов меню
  document.querySelectorAll(".dropdown-link").forEach((link) => {
    link.addEventListener("click", function () {
      if (supportsPage) {
        supportsPage.style.display = "none";
      }
    });
  });

  // FAQ аккордеон
  document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", function () {
      const faqItem = this.closest(".faq-item");
      faqItem.classList.toggle("active");
    });
  });

  // Поиск по FAQ
  const searchInput = document.querySelector(".supports-search-input");
  const searchBtn = document.querySelector(".supports-search-btn");

  function searchFAQ() {
    const searchTerm = searchInput.value.toLowerCase();
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
      const question = item
        .querySelector(".faq-question")
        .textContent.toLowerCase();
      const answer = item
        .querySelector(".faq-answer")
        .textContent.toLowerCase();

      if (question.includes(searchTerm) || answer.includes(searchTerm)) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", searchFAQ);
  }

  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        searchFAQ();
      }
    });
  }

  // Чат
  const chatModal = document.getElementById("chatModal");
  const openChatBtn = document.querySelector(".open-chat-btn");
  const closeChatBtn = document.querySelector(".chat-close-btn");
  const sendBtn = document.querySelector(".chat-send-btn");
  const chatInput = document.querySelector(".chat-input");
  const chatMessages = document.getElementById("chatMessages");

  if (openChatBtn) {
    openChatBtn.addEventListener("click", function () {
      chatModal.classList.add("show");
    });
  }

  if (closeChatBtn) {
    closeChatBtn.addEventListener("click", function () {
      chatModal.classList.remove("show");
    });
  }

  if (sendBtn && chatInput && chatMessages) {
    function sendMessage() {
      const message = chatInput.value.trim();
      if (message) {
        // Сообщение пользователя
        const userMessage = document.createElement("div");
        userMessage.className = "chat-message user";
        userMessage.innerHTML = `
          <div class="message-text">${message}</div>
          <div class="message-time">Только что</div>
        `;
        chatMessages.appendChild(userMessage);

        chatInput.value = "";
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Ответ поддержки через 1 секунду
        setTimeout(() => {
          const supportMessage = document.createElement("div");
          supportMessage.className = "chat-message support";
          supportMessage.innerHTML = `
            <div class="message-text">Спасибо за обращение! Оператор ответит вам в ближайшее время.</div>
            <div class="message-time">Только что</div>
          `;
          chatMessages.appendChild(supportMessage);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
      }
    }

    sendBtn.addEventListener("click", sendMessage);

    chatInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  }

  // Клик вне модального окна для закрытия
  window.addEventListener("click", function (e) {
    if (e.target === chatModal) {
      chatModal.classList.remove("show");
    }
  });

  // Полезные ссылки
  document.querySelectorAll(".useful-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const page = this.getAttribute("data-page");

      showNotification(`Раздел "${this.textContent}" в разработке`);
    });
  });

  // Функция уведомлений
  window.showNotification = function (message) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #8f3ed1;
      color: white;
      padding: 15px 25px;
      border-radius: 10px;
      z-index: 9999;
      font-weight: 600;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  };
});
