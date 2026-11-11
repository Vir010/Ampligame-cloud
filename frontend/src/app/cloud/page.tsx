"use client";

import { useEffect, useState } from "react";
import { fetchTariffs } from "@/lib/strapi";
import TariffCard from "@/components/cloud/TariffCard";

export default function CloudPage() {
  const [tariffs, setTariffs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка тарифов из Strapi
  useEffect(() => {
    fetchTariffs()
      .then((data) => setTariffs(data))
      .catch((err) => console.error("[cloud] Ошибка загрузки тарифов:", err))
      .finally(() => setLoading(false));
  }, []);

  // Анимация появления карточек (срабатывает после загрузки данных)
  useEffect(() => {
    if (loading) return;

    const cards = document.querySelectorAll(".cloud-page .tariff-card");
    cards.forEach((card, index) => {
      const el = card as HTMLElement;
      setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, index * 150);
    });
  }, [loading]);

  return (
    <div className="cloud-page" style={{ display: "block" }}>
      <p className="cloud-mini">Cloud gaming</p>
      <h1 className="cloud-title">Почему AMPLIGAME?</h1>

      <div className="cloud-features">
        <div className="cloud-item">
          <div className="cloud-icon">
            <img src="/img/Ellipse 3.png" alt="" />
          </div>
          <h3>Плати только за время</h3>
          <p>С нас 5 000+ игр, с тебя — оплата только за время</p>
        </div>
        <div className="cloud-item">
          <div className="cloud-icon">
            <img src="/img/Ellipse 4.png" alt="" />
          </div>
          <h3>Поминутная оплата</h3>
          <p>
            Не обязательно играть весь оплаченный час — вернём остаток после
            завершения сессии
          </p>
        </div>
        <div className="cloud-item">
          <div className="cloud-icon">
            <img src="/img/Ellipse 5.png" alt="" />
          </div>
          <h3>Не лагает</h3>
          <p>Играй без тормозов, при проблемах можно выбрать другой сервер</p>
        </div>
        <div className="cloud-item">
          <div className="cloud-icon">
            <img src="/img/Ellipse 6.png" alt="" />
          </div>
          <h3>Сохраняй прогресс</h3>
          <p>Твои сейвы хранятся в облаке, продолжай игру с последнего места</p>
        </div>
      </div>

      <div className="cloud-tariffs">
        <h2 className="tariff-title">
          Найдите тариф, который подходит именно вам
        </h2>

        {loading && (
          <p style={{ color: "#aaa", textAlign: "center" }}>
            Загрузка тарифов...
          </p>
        )}

        {!loading && tariffs.length === 0 && (
          <p style={{ color: "red", textAlign: "center" }}>
            Тарифы не найдены. Добавьте их в Strapi (Content Manager → Tariff).
          </p>
        )}

        <div
          className="tariff-cards"
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {tariffs.map((tariff) => (
            <TariffCard key={tariff.documentId} tariff={tariff} />
          ))}
        </div>

        <p className="tariff-note">
          * Платные игры можно запустить только в том случае, если они у вас уже
          куплены
        </p>
      </div>
    </div>
  );
}
