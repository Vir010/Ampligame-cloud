document.addEventListener("DOMContentLoaded", () => {
  const storeContent = document.querySelector(".store-content");
  const btnStore = document.getElementById("btn-store");
  const cloudPage = document.querySelector(".cloud-page");

  // Функция для скрытия всего
  function hideAll() {
    if (storeContent) storeContent.style.display = "none";
    if (cloudPage) cloudPage.style.display = "none";
    
    const profilePage = document.querySelector(".profile-page");
    if (profilePage) profilePage.style.display = "none";
  }

  // Показываем store
  if (btnStore) {
    btnStore.addEventListener("click", (e) => {
      e.preventDefault();
      hideAll();
      if (storeContent) {
        storeContent.style.display = "block";
      }
    });
  }
});
