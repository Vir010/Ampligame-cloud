/*document.addEventListener("DOMContentLoaded", function () {

  // Верхний (вправо)
  const swiperTop = new Swiper(".swiperTop", {
    loop: true,
    slidesPerView: 5,
    spaceBetween: 20,
    speed: 5000, // скорость движения (чем больше — тем плавнее)

    autoplay: {
      delay: 0,
      disableOnInteraction: false,
      reverseDirection: false, // вправо
    },
  });

  // Нижний (влево)
  const swiperBottom = new Swiper(".swiperBottom", {
    loop: true,
    slidesPerView: "auto",
    spaceBetween: 20,
    speed: 5000,

    autoplay: {
      delay: 0,
      disableOnInteraction: false,
      reverseDirection: true, // влево
    },
  });

});*/

document.addEventListener("DOMContentLoaded", () => {

  const swiperTop = new Swiper(".swiperTop", {
    loop: true,
    slidesPerView: "auto",
    spaceBetween: 20,
    speed: 4000,

    freeMode: true,
    freeModeMomentum: false,

    autoplay: {
      delay: 0,
      disableOnInteraction: false,
      reverseDirection: false
    }
  });

  const swiperBottom = new Swiper(".swiperBottom", {
    loop: true,
    slidesPerView: "auto",
    spaceBetween: 20,
    speed: 4000,

    freeMode: true,
    freeModeMomentum: false,

    autoplay: {
      delay: 0,
      disableOnInteraction: false,
      reverseDirection: true
    }
  });

});


