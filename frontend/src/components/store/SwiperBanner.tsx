"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { fetchBanners } from "@/lib/strapi";
import QuickViewModal from "./QuickViewModal";

interface BannerItem {
  image: string;
  game: any;
}

export default function SwiperBanner() {
  const [mounted, setMounted] = useState(false);
  const [topItems, setTopItems] = useState<BannerItem[]>([]);
  const [bottomItems, setBottomItems] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<any>(null);

  useEffect(() => {
    setMounted(true);

    fetchBanners()
      .then((data) => {
        if (data && data.length > 0) {
          const sorted = data.sort(
            (a: any, b: any) => (a.Order || 0) - (b.Order || 0)
          );

          const mapToItem = (b: any): BannerItem => {
            const url = b?.Image?.url || b?.Image?.[0]?.url;
            return {
              image: url ? `http://127.0.0.1:1337${url}` : "",
              // ВАЖНО: поле называется "game" (с маленькой буквы), как вы его создали в Strapi
              game: b.game || null,
            };
          };

          const top = sorted
            .filter((b: any) => b.IsTop === true)
            .map(mapToItem)
            .filter((i) => i.image);
          const bottom = sorted
            .filter((b: any) => b.IsTop === false)
            .map(mapToItem)
            .filter((i) => i.image);

          setTopItems(top);
          setBottomItems(bottom);
        }
      })
      .catch((err) => console.error("[banners] Ошибка загрузки:", err))
      .finally(() => setLoading(false));
  }, []);

  if (!mounted || loading) {
    return (
      <div style={{ marginBottom: "40px", width: "100%" }}>
        <div
          style={{
            height: "140px",
            background: "#1a1a1a",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        />
        <div
          style={{
            height: "140px",
            background: "#1a1a1a",
            borderRadius: "10px",
          }}
        />
      </div>
    );
  }

  if (topItems.length === 0 && bottomItems.length === 0) return null;

  const slideStyle = {
    width: "240px",
    height: "140px",
    flexShrink: 0,
  };

  const handleBannerClick = (item: BannerItem) => {
    if (!item.game) {
      console.warn("У этого баннера нет привязанной игры в Strapi");
      return;
    }

    // Нормализуем данные игры для QuickViewModal
    const normalizedGame = {
      id: item.game.documentId,
      title: item.game.Title || item.game.title || "Без названия",
      price: `${item.game.Price ?? 0} ₽`,
      description:
        item.game.Description ||
        item.game.description ||
        "Описание отсутствует",
      developer: item.game.developer || "Неизвестно",
      genre: item.game.Genre || "Не указан",
      image: item.game.Cover?.url
        ? `http://127.0.0.1:1337${item.game.Cover.url}`
        : item.image, // Если у игры нет обложки, используем картинку баннера
    };

    setSelectedGame(normalizedGame);
  };

  return (
    <>
      {/* Модальное окно игры */}
      {selectedGame && (
        <QuickViewModal
          gameId={selectedGame.id}
          product={selectedGame}
          onClose={() => setSelectedGame(null)}
        />
      )}

      <div style={{ marginBottom: "40px", width: "100%", overflow: "hidden" }}>
        {/* Верхний слайдер */}
        {topItems.length > 0 && (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView="auto"
            loop={true}
            speed={1500}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              reverseDirection: false,
            }}
            style={{ marginBottom: "20px" }}
          >
            {topItems.map((item, i) => (
              <SwiperSlide key={`top-${i}`} style={slideStyle}>
                <div
                  onClick={() => handleBannerClick(item)}
                  style={{
                    cursor: "pointer",
                    width: "100%",
                    height: "100%",
                    background: "#1a1a1a",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={item.image}
                    alt={`Slide ${i}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* Нижний слайдер */}
        {bottomItems.length > 0 && (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView="auto"
            loop={true}
            speed={1500}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              reverseDirection: true,
            }}
          >
            {bottomItems.map((item, i) => (
              <SwiperSlide key={`bottom-${i}`} style={slideStyle}>
                <div
                  onClick={() => handleBannerClick(item)}
                  style={{
                    cursor: "pointer",
                    width: "100%",
                    height: "100%",
                    background: "#1a1a1a",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={item.image}
                    alt={`Slide ${i}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </>
  );
}
