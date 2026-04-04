// balance.js

// Ключ для хранения баланса в localStorage
const BALANCE_STORAGE_KEY = "user_balance";

// Класс для управления балансом
class UserBalance {
  constructor() {
    this.balance = this.loadBalance();
    this.updateDisplay();
  }

  loadBalance() {
    const saved = localStorage.getItem(BALANCE_STORAGE_KEY);
    return saved ? parseInt(saved) : 1000; // По умолчанию 1000 для теста
  }

  saveBalance() {
    localStorage.setItem(BALANCE_STORAGE_KEY, this.balance);
  }

  getBalance() {
    return this.balance;
  }

  addBalance(amount) {
    if (amount > 0) {
      this.balance += amount;
      this.saveBalance();
      this.updateDisplay();
      return true;
    }
    return false;
  }

  // Списание средств с проверкой
  subtractBalance(amount) {
    if (amount > 0 && this.balance >= amount) {
      this.balance -= amount;
      this.saveBalance();
      this.updateDisplay();
      return true;
    }
    return false;
  }

  // Проверка возможности покупки
  canAfford(amount) {
    return this.balance >= amount;
  }

  updateDisplay() {
    const balanceElement = document.getElementById("userBalance");
    if (balanceElement) {
      balanceElement.textContent = this.balance.toLocaleString() + " ₽";
    }
  }
}

// Создаем глобальный экземпляр
window.userBalance = new UserBalance();

// Инициализация
document.addEventListener("DOMContentLoaded", function () {
  const addBalanceBtn = document.getElementById("addBalanceBtn");
  const balanceModal = document.getElementById("balanceModal");
  const closeBtn = document.querySelector(".balance-close-btn");
  const presetButtons = document.querySelectorAll(".balance-preset");
  const customAddBtn = document.querySelector(".balance-custom-add");
  const customInput = document.getElementById("customAmount");

  // Открыть модальное окно
  if (addBalanceBtn) {
    addBalanceBtn.addEventListener("click", function () {
      balanceModal.classList.add("show");
    });
  }

  // Закрыть модальное окно
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      balanceModal.classList.remove("show");
    });
  }

  // Закрыть по клику вне окна
  window.addEventListener("click", function (e) {
    if (e.target === balanceModal) {
      balanceModal.classList.remove("show");
    }
  });

  // Пополнение по пресетам
  presetButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const amount = parseInt(this.getAttribute("data-amount"));
      if (window.userBalance.addBalance(amount)) {
        showNotification(`Баланс пополнен на ${amount} ₽`, "success");
        balanceModal.classList.remove("show");
      }
    });
  });

  // Пополнение своей суммы
  if (customAddBtn && customInput) {
    customAddBtn.addEventListener("click", function () {
      const amount = parseInt(customInput.value);
      if (amount && amount > 0) {
        if (window.userBalance.addBalance(amount)) {
          showNotification(`Баланс пополнен на ${amount} ₽`, "success");
          balanceModal.classList.remove("show");
          customInput.value = "";
        }
      } else {
        showNotification("Введите корректную сумму", "error");
      }
    });

    customInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        customAddBtn.click();
      }
    });
  }
});

// Функция уведомлений
window.showNotification = function (message, type = "success") {
  const notification = document.createElement("div");
  notification.textContent = message;

  const colors = {
    success: "#8f3ed1",
    error: "#ff4444",
    warning: "#ffaa00",
  };

  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 30px;
    background: ${colors[type] || colors.success};
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    z-index: 9999;
    font-weight: 600;
    animation: slideIn 0.3s ease;
    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
};
