const btnCloud = document.getElementById("btn-cloud");
const cloudPage = document.querySelector(".cloud-page");
const storeContent = document.querySelector(".store-content");

// Функция для скрытия всего
function hideAll() {
  if (storeContent) storeContent.style.display = "none";
  if (cloudPage) cloudPage.style.display = "none";
  
  const profilePage = document.querySelector(".profile-page");
  if (profilePage) profilePage.style.display = "none";
}

// Показываем cloud gaming
if (btnCloud) {
  btnCloud.addEventListener("click", function(e) {
    e.preventDefault();
    hideAll();
    if (cloudPage) {
      cloudPage.style.display = "block";
    }
  });
}

// Анимации для cloud gaming (простой вариант)
function initCloudAnimations() {
  const cards = document.querySelectorAll('.cloud-page .tariff-card');
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

// Запускаем анимации при показе cloud страницы
if (btnCloud) {
  btnCloud.addEventListener('click', function(e) {
    e.preventDefault();
    hideAll();
    if (cloudPage) {
      cloudPage.style.display = 'block';
      setTimeout(initCloudAnimations, 50);
    }
  });
}

// Добавьте в CSS:
// .tariff-card { opacity: 0; transform: translateY(20px); transition: all 0.3s; }