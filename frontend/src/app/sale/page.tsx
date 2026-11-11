"use client";

import { useState, useEffect } from "react";
import { fetchGames } from "@/lib/strapi";
import GameCard from "@/components/store/GameCard";
import { getJSON } from "@/lib/storage";

export default function SalePage() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGames()
      .then((data) => {
        // Фильтруем игры: оставляем только те, у которых есть скидка
        // В Strapi это поле isSale (true) или oldPrice (больше 0)
        const discounted = data.filter((g: any) => {
          return (
            g.isSale === true ||
            (g.oldPrice && Number(g.oldPrice) > Number(g.Price))
          );
        });
        setGames(discounted);
      })
      .catch((err) => {
        console.error("[sale] Ошибка загрузки:", err);
        setError("Не удалось загрузить скидки. Попробуйте позже.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "30px", color: "#fff" }}>Загрузка скидок...</div>
    );
  }

  if (error) {
    return <div style={{ padding: "30px", color: "#ff4444" }}>{error}</div>;
  }

  return (
    <div style={{ padding: "30px" }}>
      {/* Заголовок в стиле как на скриншоте */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1
          style={{
            color: "#ff4d4d", // Оранжево-красный цвет как на скриншоте
            fontSize: "42px",
            margin: 0,
            fontWeight: "900",
            textShadow: "0 0 20px rgba(255, 77, 77, 0.5)", // Легкое свечение
          }}
        >
          Скидки
        </h1>
        <p style={{ color: "#aaa", fontSize: "14px", marginTop: "10px" }}>
          Успейте купить со скидкой
        </p>
      </div>

      {games.length === 0 ? (
        <div style={{ textAlign: "center", color: "#aaa", padding: "40px" }}>
          <p>Сейчас нет активных скидок.</p>
        </div>
      ) : (
        <div
          className="games-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {games.map((game) => (
            <GameCard key={game.documentId || game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
