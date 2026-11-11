"use client";
import { useState, useEffect } from "react";
import GameGrid from "@/components/store/GameGrid";
import SwiperBanner from "@/components/store/SwiperBanner";
import SearchBar from "@/components/store/SearchBar";
import { fetchFromStrapi } from "@/lib/strapi";

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [games, setGames] = useState<any[]>([]);

  useEffect(() => {
    fetchFromStrapi("games")
      .then((data) => {
        const raw = Array.isArray(data) ? data : data?.data ?? [];
        setGames(
          raw.map((g: any) => ({
            ...g,
            id: g.documentId ?? g.id,
            title: g.Title || "Без названия",
            price: g.Price ?? 0,
            description: g.Description || "Описание отсутствует",
            developer: g.developer || "Неизвестно",
            genre: g.Genre || "Не указан",
            image: g.Cover?.url
              ? `http://127.0.0.1:1337${g.Cover.url}`
              : "/placeholder.png",
          }))
        );
      })
      .catch((e) => console.error("[store] Ошибка Strapi:", e));
  }, []);

  return (
    <div
      className="store-content"
      style={{ display: "block", padding: "20px" }}
    >
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {!searchQuery && (
        <>
          <h2 className="store-glav">Главное</h2>
          <SwiperBanner />
        </>
      )}

      <h2 className="store-games-title">
        {searchQuery
          ? `Результаты поиска по запросу "${searchQuery}"`
          : "Популярные игры"}
      </h2>

      <GameGrid games={games} searchQuery={searchQuery} />
    </div>
  );
}
